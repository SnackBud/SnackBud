package com.priahi.snackbud;

import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.fragment.app.Fragment;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.JsonObjectRequest;
import android.widget.*;
import androidx.fragment.app.DialogFragment;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.maps.GoogleMap;
import com.squareup.picasso.Picasso;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link HomeFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class HomeFragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    private static final String TAG = "HomeFragment";

    private GoogleSignInClient mGoogleSignInClient;
    private GoogleSignInAccount acct;

    GridLayout gridLayout;

    private GoogleMap mMap;

    final private String RESTAURANTS_URL = "";


    private Button covidReport;
    private Button enterPasscode;
    private int REQUEST_CODE = -1;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public HomeFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment HomeFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static HomeFragment newInstance(String param1, String param2) {
        HomeFragment fragment = new HomeFragment();
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
        // Google data
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken("220578639199-rv1vof8saj5d8b31fk2tp76hi8d9jv80.apps.googleusercontent.com")
                .requestProfile()
                .requestId()
                .requestEmail()
                .build();

        // Build a GoogleSignInClient with the options specified by gso.
        mGoogleSignInClient = GoogleSignIn.getClient(requireContext(), gso);

        // get account info
        acct = GoogleSignIn.getLastSignedInAccount(requireContext());



    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_home, container, false);

        // modify view GET REQUEST
        covidReport = view.findViewById(R.id.covid_report);

        covidReport.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                postCovidReport();
            }
        });



        enterPasscode = view.findViewById(R.id.verify_meetup);

        enterPasscode.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DialogFragment dialogFragment = VerifyMeetup.newInstance();
                dialogFragment.show(getParentFragmentManager(), "VerifyMeetup");
            }
        });


        // profile setup
        // image
        ImageView profileImage = view.findViewById(R.id.profile_image);
        Uri url = acct.getPhotoUrl();
        if(url != null) {
            Picasso.get().load(url).into(profileImage);
        } else {
            Picasso.get().load("http://www.gravatar.com/avatar/?d=identicon").into(profileImage);
        }

        // Name
        TextView name = view.findViewById(R.id.person_name_google);
        String displayName = acct.getDisplayName();
        if (displayName != null) {
            name.setText("Name: " + displayName);
        } else {
            name.setText("Name: Anon");
        }

        // UserId
        TextView id = view.findViewById(R.id.person_user_id_google);
        String userId = acct.getId();
        if (userId != null) {
            id.setText("UserId: " + userId);
        } else {
            id.setText("UserId: null");
        }

        // Inflate the layout for this fragment
        return view;
    }


    private void postCovidReport() {
        // send with cur date + 14 days
        RequestQueue mQueue = Volley.newRequestQueue(requireContext());

        Map<String, String> params = new HashMap<String, String>();

        GoogleSignInAccount acct = GoogleSignIn.getLastSignedInAccount(requireActivity());
        if (acct == null) {
            Log.e(TAG, "error, no google sign in");
            return;
        }

        Date myDate = Calendar.getInstance().getTime();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(myDate);
        calendar.add(Calendar.DAY_OF_YEAR, -14);
        Date newDate = calendar.getTime();

        String currentDate = myDate.toString();
        String twoWeeksAgo = newDate.toString();

        params.put("userId", acct.getId());
        params.put("currentDate", currentDate);
        params.put("twoWeeksAgo", twoWeeksAgo);

        String url = "http://13.68.137.122:3000/event/contactTrace";

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET,
            url,
            new JSONObject(params),
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


        mQueue.add(request);
    }

}