package com.priahi.snackbud;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.ThumbnailUtils;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.ImageView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.google.android.gms.maps.*;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.MarkerOptions;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;

public class MapsFragment extends Fragment {

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
            GoogleMap mMap = googleMap;
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
            try {
                // get JSONObject from JSON file
                JSONObject obj = new JSONObject(loadJSONFromAsset());
                // fetch JSONArray named users
                JSONArray userArray = obj.getJSONArray("data");
                // implement for loop for getting users list data
                for (int i = 0; i < userArray.length(); i++) {
                    JSONObject userDetail = userArray.getJSONObject(i);
                    LatLng loc = new LatLng(userDetail.getDouble("lng"), userDetail.getDouble("lat"));
                    mMap.addMarker(new MarkerOptions().position(loc).title(userDetail.getString("name")));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
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
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        SupportMapFragment mapFragment =
                (SupportMapFragment) getChildFragmentManager().findFragmentById(R.id.map);
        if (mapFragment != null) {
            mapFragment.getMapAsync(callback);
        }
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
}

