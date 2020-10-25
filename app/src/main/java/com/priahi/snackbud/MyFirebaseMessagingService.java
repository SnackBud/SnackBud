package com.priahi.snackbud;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.messaging.FirebaseMessagingService;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    private static String TAG = "PushNotification";
    public static String deviceToken;

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);
        Log.d(TAG, "Refreshed token: " + token);

        // update global token variable
        MyFirebaseMessagingService.deviceToken=token;
    }
}
