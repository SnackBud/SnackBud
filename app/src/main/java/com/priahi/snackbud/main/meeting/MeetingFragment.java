package com.priahi.snackbud.main.meeting;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.pchmn.materialchips.ChipsInput;
import com.pchmn.materialchips.model.Chip;
import com.pchmn.materialchips.model.ChipInterface;
import com.priahi.snackbud.R;
import com.priahi.snackbud.main.MainActivity;
import com.priahi.snackbud.main.meeting.helper.RangeTimePickerDialog;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

public class MeetingFragment extends Fragment implements View.OnClickListener {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
//    private static final String ARG_PARAM1 = "param1";
//    private static final String ARG_PARAM2 = "param2";
    private static final String TAG = "MeetingFragment";

//    private String mParam1;
//    private String mParam2;
    private Dialog dialog;
    private String hostId;
    private ArrayList<String> guestIds = new ArrayList<>();
    private Calendar timeOfMeet;
//  private static final String url = "http://13.77.158.161:3000";
    private Map<String, String> users = new HashMap<>();
    private ArrayList<String> userNames = new ArrayList<>();
    private Map<String, String> restaurants = new HashMap<>();
    private ArrayList<String> restNames = new ArrayList<>();
    private Button btnDatePicker;
    private Button btnTimePicker;
    private Button btnCreateMeeting;
    private EditText txtDate;
    private EditText txtTime;
    private TextView searchRest;
    private ChipsInput chipsInput;
    private int mYear;
    private int mMonth;
    private int mDay;
    private int mHour;
    private int mMinute;
    private long minHour;
    private long maxHour;
    private long maxMin;
    private long minMin;
    private RequestQueue queue;
    private Integer pos = -1;
    private int dayOfMonth;
    private int monthOfYear;

    public MeetingFragment() {

        mYear = 2020;
        // Required empty public constructor
    }

    public MeetingFragment(Integer pos) {
        this.pos = pos;
    }


//    public static MeetingFragment newInstance(String param1, String param2) {
//        MeetingFragment fragment = new MeetingFragment();
//        Bundle args = new Bundle();
//        args.putString(ARG_PARAM1, param1);
//        args.putString(ARG_PARAM2, param2);
//        fragment.setArguments(args);
//        return fragment;
//    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        if (getArguments() != null) {
//            mParam1 = getArguments().getString(ARG_PARAM1);
//            mParam2 = getArguments().getString(ARG_PARAM2);
//        }

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
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle
            savedInstanceState) {
        // Inflate the layout for this fragment
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken("220578639199-rv1vof8saj5d8b31fk2tp76hi8d9jv80.apps.googleusercontent.com")
                .requestProfile()
                .requestId()
                .requestEmail()
                .build();

        // Build a GoogleSignInClient with the options specified by gso.
        GoogleSignIn.getClient(requireContext(), gso);

        // get account info
        GoogleSignInAccount acct = GoogleSignIn.getLastSignedInAccount(requireContext());

        hostId = acct.getId();

        return inflater.inflate(R.layout.fragment_two, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        btnCreateMeeting = requireView().findViewById(R.id.createmeeting);
        btnDatePicker = requireView().findViewById(R.id.btn_date);
        btnTimePicker = requireView().findViewById(R.id.btn_time);
        txtDate = requireView().findViewById(R.id.in_date);
        txtTime = requireView().findViewById(R.id.in_time);
        btnDatePicker.setOnClickListener(this);
        btnTimePicker.setOnClickListener(this);

        btnDatePicker.setEnabled(false);
        btnTimePicker.setEnabled(false);
        btnCreateMeeting.setEnabled(false);

        btnCreateMeeting.setOnClickListener(this);

        timeOfMeet = Calendar.getInstance();

        searchRest = requireView().findViewById(R.id.search_rest);

        if (pos != -1) {
            searchRest.setText(restNames.get(pos));
            searchRest.setEnabled(false);
        }

        searchRest.setEnabled(false);
        searchRest.setOnClickListener(this);

        setUsers();
    }

    public void setUsers() {
        JSONArray js = new JSONArray();

        queue = Volley.newRequestQueue(requireContext());
        // Get all users
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET,
                getString(R.string.backend_url) + "/user/getAll",
                js,
                response -> {
                    Log.w(TAG, "/user/getAll request successful");
                    try {
                        VolleyLog.v("Response:%n %s", response.toString(4));
                        int j=0;
                        for (int i = 0; i < response.length(); i++) {
                            JSONObject object1 = response.getJSONObject(i);
                            String userId = object1.getString("userId");
                            String username = object1.getString("username");
                            if (!userId.equals(hostId)) {
                                users.put(username, userId);
                                userNames.add(j, username);
                                j++;
                            }
                        }

                        // get ChipsInput view
                        chipsInput = (ChipsInput) requireView().findViewById(R.id.chips_input);
                        chipsInput.setLayoutParams(chipsInput.getLayoutParams());

                        List<Chip> contactList = new ArrayList<Chip>();
                        for(int i = 0; i < userNames.size(); i++) {
                            contactList.add(new Chip(userNames.get(i), ""));
                        }

                        // pass the ContactChip list
                        chipsInput.setFilterableList(contactList);

                        chipsInput.addChipsListener(new ChipsInput.ChipsListener() {
                            @Override
                            public void onChipAdded(ChipInterface chip, int newSize) {
                                    searchRest.setEnabled(pos == -1);
                                    btnDatePicker.setEnabled(pos != -1);
                            }

                            @Override
                            public void onChipRemoved(ChipInterface chip, int newSize) {
                                if(newSize <= 0) searchRest.setEnabled(pos == -1);
                            }

                            @Override
                            public void onTextChanged(CharSequence text) {
                                // do nothing
                            }
                        });


                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }, error -> {
            Log.d(TAG, "Failed with error msg:\t" + error.getMessage());
            Log.d(TAG, "Error StackTrace: \t" + Arrays.toString(error.getStackTrace()));
            // edited here
            try {
                byte[] htmlBodyBytes = error.networkResponse.data;
                Log.e(TAG, new String(htmlBodyBytes), error);
            } catch (NullPointerException e) {
                e.printStackTrace();
            }
        });

        // Start the request immediately
        queue.add(request);
    }

    // For choosing time
    @Override
    public void onClick(View v) {
        if (v.equals(btnDatePicker)) {
            // Get Current Date
            final Calendar c = Calendar.getInstance();
            mYear = c.get(Calendar.YEAR);
            mMonth = c.get(Calendar.MONTH);
            mDay = c.get(Calendar.DAY_OF_MONTH);
            mHour = c.get(Calendar.HOUR_OF_DAY);

            // bug fixed for m10
            if(mHour == 23) mDay += 1;

            DatePickerDialog datePickerDialog = new DatePickerDialog(requireContext(),
                    (view, year, monthOfYear, dayOfMonth) -> {
                        String date = String.format("%d-%02d-%02d", year, monthOfYear + 1, dayOfMonth);
                        txtDate.setText(date);

                        this.dayOfMonth = dayOfMonth;
                        this.monthOfYear = monthOfYear;

                        // set calendar
                        timeOfMeet.set(year, monthOfYear, dayOfMonth);
//                            timeOfMeet.set(Calendar.MONTH, monthOfYear);
//                            timeOfMeet.set(Calendar.DAY_OF_MONTH, dayOfMonth);
                    }, mYear, mMonth, mDay);

            if(mHour == 23) {
                c.add(Calendar.DAY_OF_MONTH, +1);
            }
            datePickerDialog.getDatePicker().setMinDate(c.getTimeInMillis());
            c.add(Calendar.MONTH, +1);
            long oneMonthAhead = c.getTimeInMillis();
            datePickerDialog.getDatePicker().setMaxDate(oneMonthAhead);
            datePickerDialog.show();

            btnTimePicker.setEnabled(true);

        } else if (v.equals(btnTimePicker)) {
            // Get Current Time
            final Calendar c = Calendar.getInstance();
            mHour = c.get(Calendar.HOUR_OF_DAY);
            mMinute = c.get(Calendar.MINUTE);
            minHour = 8;
            maxHour = 23;
            maxMin = 0;

            // bug fixed for m10
            if(mHour == 23) mDay += 1;

            if(mHour == 23
                    || mHour < 7
                    || mDay != dayOfMonth
                    || mMonth != monthOfYear) {
                mHour = 8;
                mMinute = 0;
            }
            else {
                mHour = mHour + 1;
            }

            // Launch Time Picker Dialog
            RangeTimePickerDialog timePickerDialog = new RangeTimePickerDialog(requireContext(),
                    (view, hourOfDay, minute) -> {
                        String timeOfDay = String.format("%02d:%02d", hourOfDay, minute);
                        txtTime.setText(timeOfDay);

                        // set calendar

                        timeOfMeet.set(timeOfMeet.get(Calendar.YEAR),
                                timeOfMeet.get(Calendar.MONTH),
                                timeOfMeet.get(Calendar.DATE),
                                hourOfDay, minute);
//                            timeOfMeet.set(Calendar.MINUTE, minute);
                    }, mHour, mMinute, false);

            if(Calendar.getInstance().get(Calendar.DAY_OF_YEAR) >= timeOfMeet.get(Calendar.DAY_OF_YEAR)) {
                minHour = mHour; //Math.max(Calendar.getInstance().get(Calendar.HOUR_OF_DAY) + 1, 8);
                minMin = mMinute; //Math.max(Calendar.getInstance().get(Calendar.MINUTE), 0);
            }
            Log.d("hour", String.valueOf(minHour));
            timePickerDialog.setMin((int) minHour, (int) minMin);
            timePickerDialog.setMax((int) maxHour, (int) maxMin);
            timePickerDialog.show();

            btnCreateMeeting.setEnabled(true);

        } else if(v.equals(btnCreateMeeting)) {
            try {
                postRequest();
                Toast.makeText(getContext(), "Meeting successfully created", Toast.LENGTH_LONG).show();
                Intent intent = new Intent(getContext(), MainActivity.class);
                startActivity(intent);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        } else if(v.equals(searchRest)) {

            dialog = new Dialog(getContext());
            dialog.setContentView(R.layout.dialog_searchable_spinner);
            dialog.getWindow().setLayout(900, 1200);
            dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            dialog.show();

            EditText editText = dialog.findViewById(R.id.edit_text_rest);
            ListView listView = dialog.findViewById(R.id.list_view_rest);

            ArrayAdapter<String> adapter = new ArrayAdapter<>(requireContext(),
                    android.R.layout.simple_spinner_dropdown_item, restNames);
            listView.setAdapter(adapter);

            editText.addTextChangedListener(new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence s, int start,
                                              int count, int after) {
                    // do nothing
                }

                @Override
                public void onTextChanged(CharSequence s, int start,
                                          int before, int count) {
                    adapter.getFilter().filter(s);
                }

                @Override
                public void afterTextChanged(Editable s) {
                    // do nothing
                }
            });

            listView.setOnItemClickListener((parent, view12, position, id) -> {
                searchRest.setText(adapter.getItem(position));
                btnDatePicker.setEnabled(pos == -1);
                dialog.dismiss();
            });

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

        List<Chip> contactsSelected = (List<Chip>) chipsInput.getSelectedChipList();
        for(int i = 0; i < contactsSelected.size(); i++) {
            String userId = users.get(contactsSelected.get(i).getLabel());
            if (userId != null) {
                this.guestIds.add(i, userId);
                Log.i("guest", userId);
            }
        }

        JSONObject eventRequest = new JSONObject();
        eventRequest.put("hostId", acct.getId());

        JSONArray array = new JSONArray();

        for (String guest : this.guestIds) {
            JSONObject guestId = new JSONObject();
            guestId.put("guestId", guest);
            array.put(guestId);
        }

        String restName = searchRest.getText().toString();
        String restId = restaurants.get(restName);

        eventRequest.put("guestIds", array);
        eventRequest.put("notVerified", array);
        eventRequest.put("restId", restId);
        eventRequest.put("restName", restName);
        eventRequest.put("timeOfMeet", timeOfMeet.getTimeInMillis());

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST,
                getString(R.string.backend_url) + "/event",
                eventRequest,
                response -> {
                    try {
                        VolleyLog.v("Response:%n %s", response.toString(4));
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }, error -> VolleyLog.e("Error: ", error.getMessage()));

        queue.add(request);
    }
}