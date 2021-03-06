package com.priahi.snackbud.main.profile.verifymeetup;

import android.annotation.SuppressLint;
import android.content.Context;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.maps.model.LatLng;
import com.priahi.snackbud.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

// import android.widget.*;

//import MapsFragment;

public class VerifyMeetup extends DialogFragment implements AdapterView.OnItemSelectedListener, LocationListener {

    private static final String TAG = "VerifyMeetup";
//    private static final String url = "http://13.77.158.161:3000";
//    private static final String url = "http://192.168.1.66:3000";

    private Button sendCodeButton;
    private Button enterCodeButton;
    private EditText editTextCode;
    private TextView displayCode;
    private TextView verifyStatus;

    private Location currentLocation;

    private String eventVerifyCode;
    private String userInputCode;
    private String eventId;
    private Map<String, String> hostIdMap = new HashMap<>();
    private Map<String, String> eventsIdMap = new HashMap<>();
    private ArrayList<String> eventsIdList = new ArrayList<>();
    private ArrayList<String> eventTitle = new ArrayList<>();
    private ArrayList<String> guestId = new ArrayList<>();
    private RequestQueue queue;
    private static double distance_tolerance = 200.0;

    private String restName;
    private ArrayList<String> restList = new ArrayList<>();


    private GoogleSignInAccount acct;

    public static VerifyMeetup newInstance() {
        return new VerifyMeetup();
    }

    @SuppressLint("ResourceType")
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setStyle(DialogFragment.STYLE_NORMAL, R.layout.activity_verify_meetup);
        acct = GoogleSignIn.getLastSignedInAccount(requireActivity());
        if (acct == null) {
            Log.e(TAG, "error, no google sign in");
        }
    }


    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.activity_verify_meetup, container, false);
    }


    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // update current location
        getLocation();

        // button to POST the verification code onto the server
        sendCodeButton = view.findViewById(R.id.send_code);
        sendCodeButton.setEnabled(false);
        sendCodeButton.setOnClickListener(v -> {
            try {
                putRequest();
                dismiss();
            } catch (JSONException e) {
                e.printStackTrace();
            }
        });

        // verify status text
        verifyStatus = view.findViewById(R.id.verifyStatus);
        verifyStatus.setText(R.string.verifyText);

        // button to close the dialog
        ImageButton closeButton = view.findViewById(R.id.close_verify_meetup);
        closeButton.setOnClickListener(v -> dismiss());

        // enter the verification code
        editTextCode = view.findViewById(R.id.verify_meetup_code);
        editTextCode.setEnabled(false);
        editTextCode.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                //needs comment for code style
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                //needs comment for code style
            }

            @Override
            public void afterTextChanged(Editable s) {
                enableSubmitIfReady();
            }
        });

        // enter code button
        enterCodeButton = view.findViewById(R.id.enter_code);
        enterCodeButton.setEnabled(false);
        enterCodeButton.setOnClickListener(v -> {
            sendCodeButton.setEnabled(true);
            userInputCode = editTextCode.getText().toString();
        });
        enableSubmitIfReady();

        // A spinner for the events
        final Spinner eventDropdown = requireView().findViewById(R.id.eventSpinner);
        eventDropdown.setOnItemSelectedListener(this);

        // display verification code
        displayCode = view.findViewById(R.id.display_code);
        displayCode.setText(eventVerifyCode);

        // queue to hold the volley requests
        queue = Volley.newRequestQueue(requireContext());

        getUserEvents(eventDropdown);
    }

    @SuppressWarnings("Duplicates")
    private void getUserEvents(Spinner eventDropdown) {
        // JSON array to get event ID's
        JSONArray array = new JSONArray();
        JSONObject user = new JSONObject();
        try {
            user.put("userId", Objects.requireNonNull(GoogleSignIn.getLastSignedInAccount(requireContext())).getId());
            Log.w(TAG, user.toString());
        } catch (JSONException e) {
            e.printStackTrace();
            Log.e(TAG, e.toString());
        }

        array.put(user);
        Log.w(TAG, array.toString());

        // request all events on App
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.POST,
                getString(R.string.backend_url) + "/event/toVerify",
                array,
                response -> {
                    Log.w(TAG, "request successful");
                    initialRequest(response, eventDropdown);
                }, new Response.ErrorListener() {


            /**
             * Callback method that an error has been occurred with the provided error code and optional
             * user-readable message.
             * <p>
             * param error
             */
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, "Failed with error msg:\t" + error.getMessage());
                Log.d(TAG, "Error StackTrace: \t" + Arrays.toString(error.getStackTrace()));
                // edited here
                try {
                    byte[] htmlBodyBytes = error.networkResponse.data;
                    Log.e(TAG, new String(htmlBodyBytes), error);
                } catch (NullPointerException e) {
                    e.printStackTrace();
                }
            }
        });

        // Start the request immediately
        queue.add(request);
    }


    // for setting the users and restaurants
    @Override
    public void onItemSelected(AdapterView<?> parent, View v, int position, long id) {
        if (eventsIdMap != null && eventsIdList != null && parent.getId() == R.id.eventSpinner) {
            Log.d("eventId", eventsIdList.get(position));
            Log.d("eventTitle", eventTitle.get(position));
            Log.d("verificationCode", Objects.requireNonNull(eventsIdMap.get(eventsIdList.get(position))));
            Log.d("restName", restList.get(position));
            Log.d("dist:", String.valueOf(distToRestaurant()));
            if (eventsIdList.get(position) != null) {
                // get the eventId for selected spinner element
                eventId = eventsIdList.get(position);
                restName = restList.get(position);
                eventVerifyCode = eventsIdMap.get(eventsIdList.get(position));
                updateCodeText();
                editTextCode.setEnabled(true);
                editTextCode.setText("");
            }
            if(distToRestaurant() >= distance_tolerance) {
                Toast.makeText(getActivity(), "Please reach the restaurant to verify!", Toast.LENGTH_SHORT).show();
            }
            else {
                Toast.makeText(getActivity(), "You can verify now!", Toast.LENGTH_SHORT).show();
            }
        }

    }

    @Override
    public void onNothingSelected(AdapterView<?> parent) {
        // TODO Auto-generated method stub
    }

    private void initialRequest(JSONArray response, Spinner eventDropdown) {
        try {
            VolleyLog.v("Response:%n %s", response.toString(4));
            for (int i = 0; i < response.length(); i++) {
                JSONObject object1 = response.getJSONObject(i);
                String eventIdString = object1.getString("eventId");
                String restName = object1.getString("restName");
                long timeOfMeet = object1.getLong("timeOfMeet");
                Date meetingTime = new Date(timeOfMeet);
                String verifyCode = object1.getString("verifyCode");
                String hostId = object1.getString("hostId");

                JSONArray guestIds = object1.getJSONArray("guestIds");
                for (int j = 0; j < guestIds.length(); j++) {
                    guestId.add(guestIds.getString(j));
                }

                eventsIdMap.put(eventIdString, verifyCode);
                eventsIdList.add(i, eventIdString);

                restList.add(i, restName);

                hostIdMap.put(verifyCode, hostId);

                DateFormat dateFormat = new SimpleDateFormat("E, dd MMM HH:mm", Locale.US);
                eventTitle.add(i, dateFormat.format(meetingTime) + " at " + restName);
            }

            ArrayAdapter<String> eventAdapter = new ArrayAdapter<>(requireContext(),
                    android.R.layout.simple_spinner_dropdown_item, eventTitle);
            eventAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
            eventDropdown.setAdapter(eventAdapter);


        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @SuppressWarnings("Duplicates")
    private void putRequest() throws JSONException {

        GoogleSignInAccount acct = GoogleSignIn.getLastSignedInAccount(requireActivity());
        if (acct == null) {
            Log.w(TAG, "error, no google sign in");
            return;
        }
        Log.e(TAG, Objects.requireNonNull(acct.getId()));
        JSONObject eventRequest = new JSONObject();
        eventRequest.put("guestId", acct.getId());
        eventRequest.put("eventId", this.eventId);
        eventRequest.put("verifyCode", userInputCode);
        Log.e(TAG, eventRequest.toString());
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.PUT,
                getString(R.string.backend_url) + "/event/verify",
                eventRequest,
                response -> {
                    try {
                        VolleyLog.v("Response:%n %s", response.toString(4));
                        //Toast.makeText(getContext(), response.toString(), Toast.LENGTH_SHORT).show();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }, error -> {
            //Toast.makeText(getContext(), error.toString(), Toast.LENGTH_SHORT).show();
            VolleyLog.e("Error: ", error.getMessage());
        });
        queue.add(request);
    }

    private void updateCodeText() {
        if (Objects.equals(hostIdMap.get(eventVerifyCode), acct.getId())) {
            displayCode.setText(eventVerifyCode);
        } else {
            displayCode.setText("");
        }
    }

    public void enableSubmitIfReady() {
        boolean inRange = (distToRestaurant() < distance_tolerance);
        boolean validCode = editTextCode.getText().toString().length() > 2
                && editTextCode.getText().toString().length() < 4;

        enterCodeButton.setEnabled(false);

        if (!inRange) {
            verifyStatus.setText(R.string.locationWarning);
        } else if (!validCode) {
            verifyStatus.setText(R.string.verifyWarning);
//        } else if (!editTextCode.getText().toString().contentEquals(displayCode.getText())) {
//            verifyStatus.setText(R.string.isCorrect);
        } else {
            verifyStatus.setText(R.string.enter);
            enterCodeButton.setEnabled(true);
        }

    }

    private double distToRestaurant() {
        getLocation();

        Location location = currentLocation;

        try {
            LatLng rest_loc = null;
            JSONObject obj = new JSONObject(loadJSONFromAsset());
            JSONArray restaurantsArray = obj.getJSONArray("data");
            // implement for loop for getting users list data
            for (int i = 0; i < restaurantsArray.length(); i++) {
                JSONObject restaurant = restaurantsArray.getJSONObject(i);
                String rest = restaurant.getString("name");
                if (rest.equals(restName)) {
                    rest_loc = new LatLng(restaurant.getDouble("lng"), restaurant.getDouble("lat"));
                    break;
                }
            }

            float pk = (float) (180.f / Math.PI);

            float a1 = (float) (location.getLatitude() / pk);
            float a2 = (float) (location.getLongitude() / pk);
            assert rest_loc != null;
            float b1 = (float) rest_loc.latitude / pk;
            float b2 = (float) rest_loc.longitude / pk;

            double t1 = Math.cos(a1) * Math.cos(a2) * Math.cos(b1) * Math.cos(b2);
            double t2 = Math.cos(a1) * Math.sin(a2) * Math.cos(b1) * Math.sin(b2);
            double t3 = Math.sin(a1) * Math.sin(b1);
            double tt = Math.acos(t1 + t2 + t3);

            return 6366000 * tt;
        } catch (Exception err) {
            err.printStackTrace();
            return distance_tolerance;
        }

    }

    private void getLocation() {
        LocationManager locationManager = (LocationManager) getActivity().getSystemService(Context.LOCATION_SERVICE);
        Criteria criteria = new Criteria();

        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 5, this);
        currentLocation = locationManager.getLastKnownLocation(locationManager.getBestProvider(criteria, false));


//        return locationManager.getLastKnownLocation(locationManager.getBestProvider(criteria, false));
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

    @Override
    public void onLocationChanged(Location location) {
        currentLocation = location;
    }

    @Override
    public void onStatusChanged(String s, int i, Bundle bundle) {
        Log.w(TAG, "on status changed"); //keep for codacy
    }

    @Override
    public void onProviderEnabled(String s) {
        Log.w(TAG, "on provider enabled"); //keep for codacy
    }

    @Override
    public void onProviderDisabled(String s) {
        Log.w(TAG, "on provider disabled"); //keep for codacy
    }
}




