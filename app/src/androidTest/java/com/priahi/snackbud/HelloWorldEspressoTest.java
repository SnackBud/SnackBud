package com.priahi.snackbud;

import android.widget.DatePicker;
import android.widget.TimePicker;

import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;

import com.priahi.snackbud.main.MainActivity;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onData;
import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.*;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.contrib.PickerActions.setDate;
import static androidx.test.espresso.contrib.PickerActions.setTime;
import static androidx.test.espresso.matcher.RootMatchers.isDialog;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static androidx.test.espresso.matcher.ViewMatchers.isEnabled;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static org.hamcrest.Matchers.anything;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.not;


@RunWith(AndroidJUnit4.class)
@LargeTest
public class HelloWorldEspressoTest {

    @Rule
    public ActivityScenarioRule<MainActivity> activityRule =
            new ActivityScenarioRule<>(MainActivity.class);

    @Test
    public void listGoesOverTheFold() {
        onView(withId(R.id.map_view)).check(matches(isDisplayed()));
        //onView(withId(R.id.profile_view)).perform(click());//a
        Assert.assertTrue(true);

    }


    /* Profile Testcases */

    /*
     * Switch page to profile_view
     * */
    @Test
    public void switchPageToProfile() {
        onView(withId(R.id.profile_view))
                .perform(click())
                .check(matches(isDisplayed()));
        Assert.assertTrue(true);
    }

    /*
     * Click on Covid button
     * */
    @Test
    public void clickCovidButton() {
        switchPageToProfile();
        onView(withId(R.id.covid_report))
                .perform(click());
        onView(withText("Are you sure you want to report COVID symptoms?"))
                .check(matches(isDisplayed()));
        Assert.assertTrue(true);
    }

    /*
     * Click no on Covid button
     * */
    @Test
    public void clickCovidButtonNo() {
        clickCovidButton();
        onView(withText("NO"))
                .inRoot(isDialog())
                .check(matches(isDisplayed()))
                .perform(click());
        Assert.assertTrue(true);
    }

    /*
     * Click yes on Covid button
     * */
    @Test
    public void clickCovidButtonYes() {
        clickCovidButton();
        onView(withText("YES"))
                .inRoot(isDialog())
                .check(matches(isDisplayed()))
                .perform(click());
        Assert.assertTrue(true);
    }

    /*
     * Click on verify meetup
     * */
    @Test
    public void clickOnVerifyMeetup() {
        switchPageToProfile();
        onView(withId(R.id.verify_meetup))
                .perform(click());
        Assert.assertTrue(true);
    }

    @Test
    public void verifyMeetup() {

        // Event Button Enabled
        clickOnVerifyMeetup();
        onView(withId(R.id.eventSpinner))
                .check(matches(isEnabled()));

        // Enter code and Send Code buttons are disabled
        onView(withId(R.id.enter_code))
                .check(matches(not(isEnabled())));
        onView(withId(R.id.send_code))
                .check(matches(not(isEnabled())));

        // Enter code into text
        onView(withId(R.id.verify_meetup_code))
                .perform(click(), replaceText("998"), closeSoftKeyboard());

        // Send code button disabled
        onView(withId(R.id.send_code))
                .check(matches(not(isEnabled())));

        // Enter the code
        onView(withId(R.id.enter_code))
                .check(matches((isEnabled())))
                .perform(click());

        // Send code enabled, try to verify
        onView(withId(R.id.send_code))
                .check(matches((isEnabled())))
                .perform(click());
    }

    /*
     * Click on event spinner
     * */
    @Test
    public void clickOnEventSpinner() {
        clickOnVerifyMeetup();
        onView(withId(R.id.eventSpinner))
                .perform(click())
                .check(matches(isDisplayed()));
        Assert.assertTrue(true);
    }

    /*
     * Switch page to map_view
     * */
    @Test
    public void switchPageToMap() {
        onView(withId(R.id.map_view))
                .perform(click())
                .check(matches(isDisplayed()));
        Assert.assertTrue(true);
    }


    /* Meetup Testcases */

    /*
     * Switch page to meetup_view
     * */
    @Test
    public void switchPageToMeetup() {
        onView(withId(R.id.meetup_view))
                .perform(click())
                .check(matches(isDisplayed()));
        Assert.assertTrue(true);
    }

    /*
     * Click on user spinner
     * */
    @Test
    public void clickOnUserSpinner() {
        switchPageToMeetup();
        onView(withId(R.id.userSpinner))
                .perform(click())
                .check(matches(isDisplayed()));
        Assert.assertTrue(true);
    }

    /*
     * Click on rest spinner
     * */
    @Test
    public void clickOnRestSpinner() {
        switchPageToMeetup();
        onView(withId(R.id.restSpinner))
                .perform(click())
                .check(matches(isDisplayed()));
        Assert.assertTrue(true);
    }


    /*
     * Create a meetup without any inputs
     * */
    @Test
    public void createMeetUpNoInput() {
        switchPageToMeetup();
        onView(withId(R.id.createmeeting))
                .perform(click());
        Assert.assertTrue(true);
    }


    /*
     * Create a meetup without guest
     * */
    @Test
    public void createMeetUpNoGuestID() {
        switchPageToMeetup();
        onView(withId(R.id.btn_date))
                .perform(click());

        onView(withClassName(equalTo(DatePicker.class.getName())))
                .perform(setDate(2020, 11, 20));
        onView(withText("OK")).perform(click());

        onView(withId(R.id.btn_time))
                .perform(click());

        onView(withClassName(equalTo(TimePicker.class.getName())))
                .perform(setTime(16, 35));
        onView(withText("OK")).perform(click());

        onView(withId(R.id.createmeeting))
                .perform(click());
        Assert.assertTrue(true);
    }


    /*
     * Create a meetup without date
     * */
    @Test
    public void createMeetUpNoDate() {
        switchPageToMeetup();

        onView(withId(R.id.userSpinner))
                .perform(click());
        onData(anything())
                .atPosition(1)
                .perform(click());

        onView(withId(R.id.restSpinner))
                .perform(click());
        onData(anything())
                .atPosition(1)
                .perform(click());

        onView(withId(R.id.btn_time))
                .perform(click());

        onView(withClassName(equalTo(TimePicker.class.getName())))
                .perform(setTime(16, 35));
        onView(withText("OK")).perform(click());

        onView(withId(R.id.createmeeting))
                .perform(click());
        Assert.assertTrue(true);
    }


    /*
     * Create a meetup without time
     * */
    @Test
    public void createMeetUpNoTime() {
        switchPageToMeetup();

        onView(withId(R.id.userSpinner))
                .perform(click());
        onData(anything())
                .atPosition(1)
                .perform(click());

        onView(withId(R.id.restSpinner))
                .perform(click());
        onData(anything())
                .atPosition(1)
                .perform(click());

        onView(withId(R.id.btn_date))
                .perform(click());

        onView(withClassName(equalTo(DatePicker.class.getName())))
                .perform(setDate(2020, 11, 22));
        onView(withText("OK")).perform(click());

        onView(withId(R.id.createmeeting))
                .perform(click());
        Assert.assertTrue(true);
    }

    /*
     * Create a meetup with valid inputs
     * */
    @Test
    public void createMeetUp() {
        switchPageToMeetup(); // Click 1

        onView(withId(R.id.userSpinner))
                .perform(click()); // Click 2
        onData(anything())
                .atPosition(1)
                .perform(click()).check(matches(isEnabled())); // Click 3

        onView(withId(R.id.restSpinner))
                .perform(click()); // Click 4
        onData(anything())
                .atPosition(1)
                .perform(click()).check(matches(isEnabled())); // Click 5

        onView(withId(R.id.btn_date))
                .perform(click()); // Click 6
        onView(withClassName(equalTo(DatePicker.class.getName())))
                .perform(setDate(2020, 11, 22)); // Click 7
        onView(withText("OK")).perform(click()).check(matches(isEnabled())); // Click 8

        onView(withId(R.id.btn_time))
                .perform(click()); // Click 9
        onView(withClassName(equalTo(TimePicker.class.getName())))
                .perform(setTime(15, 35)); // Click 10
        onView(withText("OK")).perform(click()).check(matches(isEnabled())); // Click 11

        onView(withId(R.id.createmeeting))
                .perform(click()).check(matches(isEnabled()));// Click 12
        Assert.assertTrue(true);
    }

}
