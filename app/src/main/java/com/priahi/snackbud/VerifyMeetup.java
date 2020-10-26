package com.priahi.snackbud;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.*;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import androidx.fragment.app.DialogFragment;
import com.android.volley.*;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class VerifyMeetup extends DialogFragment implements AdapterView.OnItemSelectedListener{

    private static final String TAG = "VerifyMeetup";
    private static final String url = "http://13.68.137.122:3000";

    private Button sendCodeButton;
    private ImageButton closeButton;

    private String eventId;
    private Map<String, String> eventsIdMap = new HashMap<String, String>();
    private ArrayList<String> eventsIdList = new ArrayList<String>();
    private RequestQueue queue;

    static VerifyMeetup newInstance() {
        return new VerifyMeetup();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setStyle(DialogFragment.STYLE_NORMAL, R.layout.activity_verify_meetup);
    }


    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.activity_verify_meetup, container, false);
        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        sendCodeButton = view.findViewById(R.id.send_code);
        sendCodeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    postRequest();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });

        closeButton = view.findViewById(R.id.close_verify_meetup);
        closeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });

        // List the events
        final Spinner eventDropdown = requireView().findViewById(R.id.eventSpinner);
        eventDropdown.setOnItemSelectedListener(this);

        JSONArray js = new JSONArray();

        queue = Volley.newRequestQueue(requireContext());
         // request all event for guest
         JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET,
                url + "/event/getAll",
                js,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.w(TAG, "request successful");
                        try {
                            VolleyLog.v("Response:%n %s", response.toString(4));
                            for (int i = 0; i < response.length(); i++) {
                                JSONObject object1 = response.getJSONObject(i);
                                String eventIdString = object1.getString("eventId");
                                // one more param for event

                                // populate the maps and arrays
                                //eventsIdMap.put(paramEvent, eventId);
                                //eventsIdList.add(i, eventId);
                            }
                            ArrayAdapter<String> eventAdapter = new ArrayAdapter<String>(requireContext(),
                                    android.R.layout.simple_spinner_dropdown_item, eventsIdList);
                            eventAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                            eventDropdown.setAdapter(eventAdapter);

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            /**
             * Callback method that an error has been occurred with the provided error code and optional
             * user-readable message.
             *
             * @param error
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
        switch (parent.getId()){
            case R.id.eventSpinner:
                Log.d("eventId", eventsIdList.get(position));
                if (eventsIdList.get(position) != null) {
                    // get the eventId for selected spinner element
                    eventId = eventsIdMap.get(eventsIdList.get(position));
                    Log.d("eventId", eventId);
                }
                break;
        }
    }

    @Override
    public void onNothingSelected(AdapterView<?> parent) {
        // TODO Auto-generated method stub
    }

    private void postRequest() throws JSONException {

        GoogleSignInAccount acct = GoogleSignIn.getLastSignedInAccount(requireActivity());
        if (acct == null) {
            Log.e(TAG, "error, no google sign in");
            return;
        }

        JSONObject eventRequest = new JSONObject();
        eventRequest.put("guestId", acct.getId());
        eventRequest.put("eventId", this.eventId);

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


