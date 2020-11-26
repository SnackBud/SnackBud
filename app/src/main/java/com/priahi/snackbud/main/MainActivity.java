package com.priahi.snackbud.main;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;
import com.priahi.snackbud.R;
import com.priahi.snackbud.login.LoginActivity;
import com.priahi.snackbud.main.about.About;
import com.priahi.snackbud.main.maps.MapsFragment;
import com.priahi.snackbud.main.meeting.MeetingFragment;
import com.priahi.snackbud.main.profile.HomeFragment;

public class MainActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {


    private GoogleSignInClient mGoogleSignInClient;
    //    public static RequestQueue queue;

    //Listener
    private BottomNavigationView.OnNavigationItemSelectedListener navListener = item -> {
        Fragment selectedFragment;

        switch (item.getItemId()) {
            case R.id.profile_view:
                selectedFragment = new HomeFragment();
                break;

            case R.id.map_view:
                selectedFragment = new MapsFragment();
                break;

            case R.id.meetup_view:
                selectedFragment = new MeetingFragment();
                break;
            default:
                throw new IllegalStateException("Unexpected value: " + item.getItemId());
        }

        //Begin Transaction
        getSupportFragmentManager().beginTransaction()
                .replace(R.id.fragment_layout, selectedFragment)
                .commit();

        return true;
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

//        queue = Volley.newRequestQueue(this);
        DrawerLayout drawerLayout;
        Toolbar toolbar;

        // side menu
        toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        drawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.side_navigation);
        navigationView.setNavigationItemSelectedListener(this);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar,
                R.string.navigation_drawer_open, R.string.navigation_drawer_close);

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();


        // Bottom Navigation
        BottomNavigationView btmNav = findViewById(R.id.bottom_navigation);
        btmNav.setOnNavigationItemSelectedListener(navListener);

        // Fragment One is main
        getSupportFragmentManager().beginTransaction()
                .replace(R.id.fragment_layout, new MapsFragment()).commit();
        btmNav.setSelectedItemId(R.id.map_view);

        // Google data
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();

        // Build a GoogleSignInClient with the options specified by gso.
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        // get account info
        GoogleSignIn.getLastSignedInAccount(this);

    }



    /**
     * Called when an item in the navigation menu is selected.
     *
     * @param item The selected item
     * @return true to display the item as the selected item
     */
    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()) {

            case R.id.nav_logout:
                signOut();
                revokeAccess();
                startActivity(new Intent(MainActivity.this, LoginActivity.class));
                break;

            case R.id.nav_about_us:
                startActivity(new Intent(MainActivity.this, About.class));
                break;

            default:
                throw new IllegalStateException("Unexpected value: " + item.getItemId());
        }
        return false;
    }

    private void signOut() {
        mGoogleSignInClient.signOut()
                .addOnCompleteListener(this, task -> {
                    // ...
                });
    }

    private void revokeAccess() {
        mGoogleSignInClient.revokeAccess()
                .addOnCompleteListener(this, task -> {
                    // ...
                });
    }

}
