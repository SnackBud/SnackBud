package com.priahi.snackbud;

import androidx.fragment.app.FragmentActivity;

import android.os.Bundle;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.MarkerOptions;

import java.util.Objects;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
    }

    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        // Add a marker in Vancity and move the camera
        LatLng vancouver = new LatLng(49.32, -123.0724);
        LatLng topLeft = new LatLng(49.4, -123.1);
        LatLng bottomRight = new LatLng(49.30, -123.0);
        MarkerOptions van = new MarkerOptions().position(vancouver).title("Ready for a meetup?");
        LatLngBounds.Builder b = new LatLngBounds.Builder();
        b.include(vancouver);
        b.include(topLeft);
        b.include(bottomRight);
        LatLngBounds bounds = b.build();
        int width = getResources().getDisplayMetrics().widthPixels;
        CameraUpdate cu = CameraUpdateFactory.newLatLngBounds(bounds, width,width,25);
        mMap.animateCamera(cu);
        mMap.addMarker(van);
//        mMap.moveCamera(CameraUpdateFactory.newLatLng(vancouver));
        // Add a marker in Sydney and move the camera
    }
}