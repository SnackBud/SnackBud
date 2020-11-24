package com.priahi.snackbud.main.about;

import android.view.View;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import com.priahi.snackbud.R;
import mehdi.sakout.aboutpage.AboutPage;
import mehdi.sakout.aboutpage.Element;

public class About extends AppCompatActivity {

    private String aboutUs = "This App was created by Arnold, Parsa, Rain and Sanjeev";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_about);

        Element adsElement = new Element();
        adsElement.setTitle("Advertise with us");

        View aboutPage = new AboutPage(this)
                .isRTL(false)
                .enableDarkMode(false)
                .setImage(R.drawable.snackbud)
                .setDescription(aboutUs)
                .addItem(new Element().setTitle("Version 1.0"))
                .addItem(adsElement)
                .addGitHub("https://github.com/Priahi/SnackBud")
                .create();

        setContentView(aboutPage);
    }
}