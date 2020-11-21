package com.priahi.snackbud;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;

import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.material.bottomnavigation.BottomNavigationItemView;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

//import com.squareup.picasso.Picasso;

public class MapsFragment extends Fragment {

//    private RequestQueue mQueue;

    private GoogleMap mMap;

//    final private String RESTAURANTS_URL = "";
//
    private Button findMeetUp;
//
//    private boolean isMeetUpOn = false;

    private Map<String, Integer> restaurantPosition = new HashMap<>();

    private View mapView;

    private Map<String, String> restaurantImageUrl = new HashMap<>();

    private OnMapReadyCallback callback = new OnMapReadyCallback() {

        /**
         * Manipulates the map once available.
         * This callback is triggered when the map is ready to be used.
         * This is where we can add markers or lines, add listeners or move the camera.
         * In this case, we just add a marker near Sydney, Australia.
         * If Google Play services is not installed on the device, the user will be prompted to
         * install it inside the SupportMapFragment. This method will only be triggered once the
         * user has installed Google Play services and returned to the app.
         */

        @SuppressLint("WrongConstant")
        @Override
        public void onMapReady(GoogleMap googleMap) {
            mMap = googleMap;

            Location location = getLocation();
            if (location != null) {
                mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(location.getLatitude(), location.getLongitude()), 13));

                CameraPosition cameraPosition = new CameraPosition.Builder()
                        .target(new LatLng(location.getLatitude(), location.getLongitude()))      // Sets the center of the map to location user
                        .zoom(15)                   // Sets the zoom
                        .bearing(0)                // Sets the orientation of the camera to east
                        .tilt(0)                   // Sets the tilt of the camera to 30 degrees
                        .build();                   // Creates a CameraPosition from the builder
                mMap.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));

                if (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                        && ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    return;
                }
                mMap.setMyLocationEnabled(true);
            }
            // default to vancouver
            else {
                // Add a marker in Vancity and move the camera
                LatLng vancouver = new LatLng(49.20, -123.0724);
                LatLng topLeft = new LatLng(49.15, -123.2);
                LatLng bottomRight = new LatLng(49.35, -123.0);
                //MarkerOptions van = new MarkerOptions().position(vancouver).title("Ready for a meetup?");
                LatLngBounds.Builder b = new LatLngBounds.Builder();
                b.include(vancouver);
                b.include(topLeft);
                b.include(bottomRight);
                LatLngBounds bounds = b.build();
                int width = getResources().getDisplayMetrics().widthPixels;
                CameraUpdate cu = CameraUpdateFactory.newLatLngBounds(bounds, width,width,25);
                mMap.animateCamera(cu);
                //mMap.addMarker(van);
            }

            // this is using assets locally
            try {
                // get JSONObject from JSON file
                JSONObject obj = new JSONObject(loadJSONFromAsset());
                // fetch JSONArray named users
                JSONArray restaurantsArray = obj.getJSONArray("data");
                // implement for loop for getting users list data
                for (int i = 0; i < restaurantsArray.length(); i++) {
                    JSONObject restaurants = restaurantsArray.getJSONObject(i);
                    LatLng loc = new LatLng(restaurants.getDouble("lng"), restaurants.getDouble("lat"));
                    String snippet = "cuisine: " + restaurants.getString("cuisine") + "\n"
                                    + "rating: " + restaurants.getString("rating") + "\n"
                                    + "weekdays: " + restaurants.getString("Monday_Open_Time")
                                    + " - " + restaurants.getString("Monday_Close_Time") + "\n"
                                    + "weekends: " + restaurants.getString("Saturday_Open_Time")
                                    + " - " + restaurants.getString("Saturday_Close_Time");
                    MarkerOptions marker = new MarkerOptions()
                                                .position(loc)
                                                .title(restaurants.getString("name"))
                                                .snippet(snippet);
                    restaurantImageUrl.put(marker.getTitle(), restaurants.getString("imageUrl"));
                    restaurantPosition.put(marker.getTitle(), i);
                    mMap.addMarker(marker);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }


            mMap.setOnMarkerClickListener(marker -> {
                LatLng position = marker.getPosition();
                CameraPosition cameraPosition = new CameraPosition.Builder()
                        .target(new LatLng(position.latitude, position.longitude))      // Sets the center of the map to location user
                        .zoom(15)                   // Sets the zoom
                        .bearing(0)                // Sets the orientation of the camera to east
                        .tilt(0)                   // Sets the tilt of the camera to 30 degrees
                        .build();                  // Creates a CameraPosition from the builder
                mMap.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
                findMeetUp.setVisibility(View.VISIBLE);

                findMeetUp.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        MeetingFragment meetingFragment = new MeetingFragment(restaurantPosition.get(marker.getTitle()));
                        FragmentTransaction fragmentTransaction = getFragmentManager().beginTransaction();
                        fragmentTransaction.replace(R.id.fragment_layout, meetingFragment).commit();
                    }
                });


                return false;
            });

            mMap.setOnMapClickListener(latLng -> {
                findMeetUp.setVisibility(View.INVISIBLE);
            });

            mMap.setInfoWindowAdapter(new CustomWindowAdapter(getContext(), restaurantImageUrl));

        }
    };

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {

        return inflater.inflate(R.layout.fragment_maps, container, false);
    }

    @Override
    public void onViewCreated(@NonNull final View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        SupportMapFragment mapFragment =
                (SupportMapFragment) getChildFragmentManager().findFragmentById(R.id.map);
        if (mapFragment != null) {
            mapFragment.getMapAsync(callback);
        }

        findMeetUp = view.findViewById(R.id.map_btn);
        findMeetUp.setVisibility(View.INVISIBLE);

        mapView = view;
    }

    public String loadJSONFromAsset() {
        String json;
        try {
            InputStream is = getContext().getAssets().open("restaurants.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            json = new String(buffer, StandardCharsets.UTF_8);
        } catch (IOException ex) {
            ex.printStackTrace();
            return null;
        }
        return json;
    }


    //    private void jsonParse(String url) {
//
//        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
//            @Override
//            public void onResponse(JSONObject response) {
//                try {
//                    JSONArray jsonArray = response.getJSONArray("data");
//
//                    for (int i = 0; i < jsonArray.length(); i++) {
//                        JSONObject restaurants = jsonArray.getJSONObject(i);
//                        LatLng loc = new LatLng(restaurants.getDouble("lng"), restaurants.getDouble("lat"));
//                        mMap.addMarker(new MarkerOptions().position(loc).title(restaurants.getString("name")));
//                    }
//
//
//                } catch (JSONException e) {
//                    e.printStackTrace();
//                }
//            }
//        }, new Response.ErrorListener() {
//            @Override
//            public void onErrorResponse(VolleyError error) {
//                error.printStackTrace();
//            }
//        });
//
//        mQueue.add(jsonObjectRequest);
//    }
//
    private Location getLocation() {
        LocationManager locationManager = (LocationManager) getContext().getSystemService(Context.LOCATION_SERVICE);
        Criteria criteria = new Criteria();

        Location location = locationManager.getLastKnownLocation(locationManager.getBestProvider(criteria, false));
        return location;
    }

}




