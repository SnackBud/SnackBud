package com.priahi.snackbud;

import android.os.Bundle;
import android.view.MenuItem;
import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class MainActivity extends AppCompatActivity {

    DrawerLayout drawerLayout;
    Toolbar toolbar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        // side menu
        toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        drawerLayout = findViewById(R.id.drawer_layout);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar,
                R.string.navigation_drawer_open, R.string.navigation_drawer_close);

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        // Bottom Navigation
        BottomNavigationView btmNav = findViewById(R.id.bottom_navigation);
        btmNav.setOnNavigationItemSelectedListener(navlistener);

        // Fragment One is main
        getSupportFragmentManager().beginTransaction()
                .replace(R.id.fragment_layout, new MapsFragment()).commit();
        btmNav.setSelectedItemId(R.id.map_view);


    }

    //Listener
    private BottomNavigationView.OnNavigationItemSelectedListener navlistener = new
            BottomNavigationView.OnNavigationItemSelectedListener() {
                @Override
                public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                    Fragment selectedFragment = null;

                    switch (item.getItemId()) {
                        case R.id.profile_view:
                            selectedFragment = new HomeFragment();
                            break;

                        case R.id.map_view:
                            selectedFragment = new MapsFragment();
                            break;

                        case R.id.meetup_view:
                            selectedFragment = new HomeFragment();
                            break;
                    }

                    //Begin Transaction
                    getSupportFragmentManager().beginTransaction()
                            .replace(R.id.fragment_layout, selectedFragment)
                            .commit();

                    return true;
                }
            };

}
