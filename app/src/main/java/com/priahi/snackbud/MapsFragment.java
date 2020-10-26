package com.priahi.snackbud;

import android.Manifest;
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

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

//import com.squareup.picasso.Picasso;

public class MapsFragment extends Fragment {

    private RequestQueue mQueue;

    private GoogleMap mMap;

    final private String RESTAURANTS_URL = "";

    private Button findMeetUp;

    private boolean isMeetUpOn = false;

    View mapView;

    Map<String, String> restaurantImageUrl = new HashMap<>();

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
                    MarkerOptions marker = new MarkerOptions().position(loc).title(restaurants.getString("name"));
                    restaurantImageUrl.put(marker.getTitle(), restaurants.getString("imageUrl"));
                    mMap.addMarker(marker);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }

            mMap.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
                @Override
                public boolean onMarkerClick(Marker marker) {
                    LatLng position = marker.getPosition();
                    CameraPosition cameraPosition = new CameraPosition.Builder()
                            .target(new LatLng(position.latitude, position.longitude))      // Sets the center of the map to location user
                            .zoom(15)                   // Sets the zoom
                            .bearing(0)                // Sets the orientation of the camera to east
                            .tilt(0)                   // Sets the tilt of the camera to 30 degrees
                            .build();                  // Creates a CameraPosition from the builder
                    mMap.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
                    ImageView restaurant_image = mapView.findViewById(R.id.restaurant_image);
//                    Picasso.get().load(restaurantImageUrl.get(marker.getTitle())).into(restaurant_image);
                    return false;
                }
            });

            mMap.setOnMapClickListener(new GoogleMap.OnMapClickListener() {
                @Override
                public void onMapClick(LatLng latLng) {
                    ImageView restaurant_image = mapView.findViewById(R.id.restaurant_image);
                    restaurant_image.setImageBitmap(null);
                }
            });


            // this is using a GET request
            /*
               mQueue = Volley.newRequestQueue(getContext());
               jsonParse(RESTAURANTS_URL);
            */
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

        mapView = view;
    }

    public String loadJSONFromAsset() {
        String json = null;
        try {
            InputStream is = getContext().getAssets().open("restaurants.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            json = new String(buffer, "UTF-8");
        } catch (IOException ex) {
            ex.printStackTrace();
            return null;
        }
        return json;
}


    private void jsonParse(String url) {

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    JSONArray jsonArray = response.getJSONArray("data");

                    for (int i = 0; i < jsonArray.length(); i++) {
                        JSONObject restaurants = jsonArray.getJSONObject(i);
                        LatLng loc = new LatLng(restaurants.getDouble("lng"), restaurants.getDouble("lat"));
                        mMap.addMarker(new MarkerOptions().position(loc).title(restaurants.getString("name")));
                    }


                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
            }
        });

        mQueue.add(jsonObjectRequest);
    }

    private Location getLocation() {
        LocationManager locationManager = (LocationManager) getContext().getSystemService(Context.LOCATION_SERVICE);
        Criteria criteria = new Criteria();

        Location location = locationManager.getLastKnownLocation(locationManager.getBestProvider(criteria, false));
        return location;
    }

}




