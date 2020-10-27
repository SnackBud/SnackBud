package com.priahi.snackbud;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TimePicker;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

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

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

public class MeetingFragment extends Fragment implements View.OnClickListener, AdapterView.OnItemSelectedListener {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    private static final String TAG = "MeetingFragment";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private String hostId;
    private String guestId;
    private String restId;
    private String restName;
    private Calendar timeOfMeet;
    private static final String url = "http://13.68.137.122:3000";
//    private static final String url = "http://192.168.1.66:3000";
    Map<String, String> users = new HashMap<String, String>();
    ArrayList<String> userNames = new ArrayList<String>();
    Map<String, String> restaurants = new HashMap<String, String>();
    ArrayList<String> restNames = new ArrayList<String>();
    Button btnDatePicker, btnTimePicker, btnCreateMeeting;
    EditText txtDate, txtTime;
    private int mYear, mMonth, mDay, mHour, mMinute;
    private RequestQueue queue;

    public MeetingFragment() {
        // Required empty public constructor
    }

    public static MeetingFragment newInstance(String param1, String param2) {
        MeetingFragment fragment = new MeetingFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }

        // this is using assets locally
        try {
            // get JSONObject from JSON file
            JSONObject obj = new JSONObject(loadJSONFromAsset());
            // fetch JSONArray named users
            JSONArray restaurantsArray = obj.getJSONArray("data");
            // implement for loop for getting users list data
            for (int i = 0; i < restaurantsArray.length(); i++) {
                JSONObject restaurant = restaurantsArray.getJSONObject(i);
                restaurants.put(restaurant.getString("name"), restaurant.getString("id"));
                restNames.add(i, restaurant.getString("name"));
            }

        } catch (JSONException e) {
            e.printStackTrace();
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


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle
            savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_two, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        btnCreateMeeting = (Button) requireView().findViewById(R.id.createmeeting);
        btnDatePicker = (Button) requireView().findViewById(R.id.btn_date);
        btnTimePicker = (Button) requireView().findViewById(R.id.btn_time);
        txtDate = (EditText) requireView().findViewById(R.id.in_date);
        txtTime = (EditText) requireView().findViewById(R.id.in_time);
        btnDatePicker.setOnClickListener((View.OnClickListener) this);
        btnTimePicker.setOnClickListener((View.OnClickListener) this);

        btnCreateMeeting.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                try {
                    postRequest();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });

        timeOfMeet = Calendar.getInstance();

        Log.d("user", userNames.toString());
        // List the users
        final Spinner userDropdown = requireView().findViewById(R.id.userSpinner);
        userDropdown.setOnItemSelectedListener(this);

        // List the restaurants
        Spinner restDropdown = requireView().findViewById(R.id.restSpinner);
        ArrayAdapter<String> restAdapter = new ArrayAdapter<String>(requireContext(),
                android.R.layout.simple_spinner_dropdown_item, restNames);
        restAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        restDropdown.setAdapter(restAdapter);
        restDropdown.setOnItemSelectedListener(this);

        JSONArray js = new JSONArray();

        queue = Volley.newRequestQueue(requireContext());
        // Get all users
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET,
                url + "/user/getAll",
                js,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.w(TAG, "/user/getAll request successful");
                        try {
                            VolleyLog.v("Response:%n %s", response.toString(4));
                            for (int i = 0; i < response.length(); i++) {
                                JSONObject object1 = response.getJSONObject(i);
                                String userId = object1.getString("userId");
                                String username = object1.getString("username");
                                if (!userId.equals(hostId)) {
                                    users.put(username, userId);
                                    userNames.add(i, username);
                                }
                            }
                            ArrayAdapter<String> userAdapter = new ArrayAdapter<String>(requireContext(),
                                    android.R.layout.simple_spinner_dropdown_item, userNames);
                            userAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                            userDropdown.setAdapter(userAdapter);

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
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
        switch (parent.getId()){
            case R.id.restSpinner:
                Log.d("restaurant", restNames.get(position));
                if (restNames.get(position) != null) {
                    restId = restaurants.get(restNames.get(position));
                    Log.d("restaurant", restId);
                    restName = restNames.get(position);
                }
                break;
            case R.id.userSpinner:
                Log.d("user", userNames.get(position));
                if (userNames.get(position) != null) {
                    guestId = users.get(userNames.get(position));
                    Log.d("user", guestId);
                }
                break;
        }
    }

    @Override
    public void onNothingSelected(AdapterView<?> parent) {
        // TODO Auto-generated method stub
    }

    // For choosing time
    @Override
    public void onClick(View v) {
        if (v == btnDatePicker) {
            // Get Current Date
            final Calendar c = Calendar.getInstance();
            mYear = c.get(Calendar.YEAR);
            mMonth = c.get(Calendar.MONTH);
            mDay = c.get(Calendar.DAY_OF_MONTH);

            DatePickerDialog datePickerDialog = new DatePickerDialog(requireContext(),
                    new DatePickerDialog.OnDateSetListener() {
                        @Override
                        public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                            String date = String.format("%d-%02d-%02d", year, monthOfYear + 1, dayOfMonth);
                            txtDate.setText(date);

                            // set calendar
                            timeOfMeet.set(year, monthOfYear, dayOfMonth);
//                            timeOfMeet.set(Calendar.MONTH, monthOfYear);
//                            timeOfMeet.set(Calendar.DAY_OF_MONTH, dayOfMonth);
                        }
                    }, mYear, mMonth, mDay);
            datePickerDialog.getDatePicker().setMinDate(c.getTimeInMillis());
            datePickerDialog.show();
            //TODO: make this timezone invariant
        } else if (v == btnTimePicker) {
            // Get Current Time
            final Calendar c = Calendar.getInstance();
            mHour = c.get(Calendar.HOUR_OF_DAY);
            mMinute = c.get(Calendar.MINUTE);
            // Launch Time Picker Dialog
            TimePickerDialog timePickerDialog = new TimePickerDialog(requireContext(),
                    new TimePickerDialog.OnTimeSetListener() {
                        @Override
                        public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
                            String timeOfDay = String.format("%02d:%02d", hourOfDay, minute);
                            txtTime.setText(timeOfDay);

                            // set calendar
                            timeOfMeet.set(timeOfMeet.get(Calendar.YEAR),
                                           timeOfMeet.get(Calendar.MONTH),
                                           timeOfMeet.get(Calendar.DATE),
                                           hourOfDay, minute);
//                            timeOfMeet.set(Calendar.MINUTE, minute);
                        }
                    }, mHour, mMinute, false);
            timePickerDialog.show();
        }

//                String.format("%d-%02d-%02dT%02d:%02d:00Z", mYear, mMonth + 1, mDay, mHour, mMinute);
        Log.d("time", String.valueOf(timeOfMeet.getTime()));
    }

    private void postRequest() throws JSONException {

        GoogleSignInAccount acct = GoogleSignIn.getLastSignedInAccount(requireActivity());
        if (acct == null) {
            Log.e(TAG, "error, no google sign in");
            return;
        }

        Log.d("time sent", String.valueOf(timeOfMeet.getTime()));

        JSONObject eventRequest = new JSONObject();
        eventRequest.put("hostId", acct.getId());

        JSONArray array = new JSONArray();
        JSONObject guestId = new JSONObject();
        guestId.put("guestId", this.guestId);
        array.put(guestId);

        eventRequest.put("guestIds", array);
        eventRequest.put("restId", restId);
        eventRequest.put("restName", restName);
        eventRequest.put("timeOfMeet", timeOfMeet.getTimeInMillis());

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST,
                url + "/event",
                eventRequest,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            VolleyLog.v("Response:%n %s", response.toString(4));
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                VolleyLog.e("Error: ", error.getMessage());
            }
        });

        queue.add(request);
    }
}
