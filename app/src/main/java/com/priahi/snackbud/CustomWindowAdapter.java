package com.priahi.snackbud;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import com.bumptech.glide.Glide;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.Marker;
import com.squareup.picasso.Callback;
import com.squareup.picasso.Picasso;
import com.squareup.picasso.Target;

import java.util.HashMap;
import java.util.Map;

public class CustomWindowAdapter implements GoogleMap.InfoWindowAdapter {

    private final View mWindow;

    private Context mContext;

    private Map<String, String> restaurantImageUrl = new HashMap<>();

    public CustomWindowAdapter(Context context, Map<String, String> restaurantImageUrl) {
        this.mContext = mContext;
        this.restaurantImageUrl = restaurantImageUrl;
        mWindow = LayoutInflater.from(context).inflate(R.layout.custom_info_window, null);
    }

    private void renderWindowText(Marker marker, View view) {
        String title = marker.getTitle();
        TextView tvTitle = (TextView) view.findViewById(R.id.map_title);

        if(!title.equals("")) {
            tvTitle.setText(title);
        }

        String snippet = marker.getSnippet();
        TextView tvSnippet = (TextView) view.findViewById(R.id.map_snippet);

        if(!title.equals("")) {
            tvSnippet.setText(snippet);
        }

        ImageView restaurant_image = view.findViewById(R.id.map_image);
        Picasso.get().load(restaurantImageUrl.get(marker.getTitle())).into(restaurant_image);
    }


    @Override
    public View getInfoWindow(Marker marker) {
        renderWindowText(marker, mWindow);
        return mWindow;
    }

    @Override
    public View getInfoContents(Marker marker) {
        renderWindowText(marker, mWindow);
        return mWindow;
    }
}
