package com.priahi.snackbud.main.profile.cancelmeetup;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.AdapterView;
import android.widget.ImageButton;
import android.widget.ArrayAdapter;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;
import com.android.volley.Request;
import com.android.volley.VolleyError;
import com.android.volley.Response;
import com.android.volley.VolleyLog;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import android.view.View;

import com.priahi.snackbud.R;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

public class CancelMeetup extends DialogFragment implements AdapterView.OnItemSelectedListener{

    private static final String TAG = "CancelMeetup";
//    private static final String url = "http://13.77.158.161:3000";
//    private static final String url = "http://192.168.1.66:3000";


    private Button cancelEvent;
    private RequestQueue queue;
    private String eventId;
    private Map<String, String> eventsIdMap = new HashMap<>();
    private ArrayList<String> eventsIdList = new ArrayList<>();
    private ArrayList<String> eventTitle = new ArrayList<>();


    public static CancelMeetup newInstance() {
        return new CancelMeetup();
    }

    @SuppressLint("ResourceType")
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setStyle(DialogFragment.STYLE_NORMAL, R.layout.activity_cancel_meetup);
    }


    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.activity_cancel_meetup, container, false);
    }


    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // button to close the dialog
        ImageButton closeButton = view.findViewById(R.id.close_verify_meetup);
        closeButton.setOnClickListener(v -> dismiss());

        // cancel button
        cancelEvent = view.findViewById(R.id.cancel_event);
        cancelEvent.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    putRequest();
                    dismiss();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });

        // spinner
        final Spinner eventDropdown = requireView().findViewById(R.id.cancel_event_spinner);
        eventDropdown.setOnItemSelectedListener(this);
    }

    // for setting the users and restaurants
    @Override
    public void onItemSelected(AdapterView<?> parent, View v, int position, long id) {
        if (eventsIdMap != null && eventsIdList != null && parent.getId() == R.id.eventSpinner) {
            Log.d("eventId", eventsIdList.get(position));
            Log.d("eventTitle", eventTitle.get(position));
            Log.d("verificationCode", Objects.requireNonNull(eventsIdMap.get(eventsIdList.get(position))));
            if (eventsIdList.get(position) != null) {
                // get the eventId for selected spinner element
                eventId = eventsIdList.get(position);
            }
        }
    }

    @Override
    public void onNothingSelected(AdapterView<?> parent) {

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

    private void initialRequest(JSONArray response, Spinner eventDropdown) {
        try {
            VolleyLog.v("Response:%n %s", response.toString(4));
            for (int i = 0; i < response.length(); i++) {
                JSONObject object1 = response.getJSONObject(i);
                String eventIdString = object1.getString("eventId");
                String restName = object1.getString("restName");
                long timeOfMeet = object1.getLong("timeOfMeet");
                Date meetingTime = new Date(timeOfMeet);

                eventsIdList.add(i, eventIdString);

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
}