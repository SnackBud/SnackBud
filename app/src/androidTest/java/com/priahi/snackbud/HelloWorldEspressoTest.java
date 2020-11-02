package com.priahi.snackbud;

import android.widget.DatePicker;
import android.widget.TimePicker;

import androidx.test.espresso.ViewAssertion;
import androidx.test.espresso.contrib.PickerActions;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;

import static androidx.test.espresso.Espresso.onData;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.matcher.RootMatchers.isDialog;

import org.hamcrest.Matchers;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.*;
import static androidx.test.espresso.contrib.PickerActions.*;


import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.anything;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
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
        //onView(withId(R.id.profile_view)).perform(click());
    }


    /* Profile Testcases */

    /*
    * Switch page to profile_view
    * */
    @Test
    public void SwitchPageToProfile() {
        onView(withId(R.id.profile_view))
                .perform(click())
                .check(matches(isDisplayed()));
    }

    /*
     * Click on Covid button
     * */
    @Test
    public void ClickCovidButton() {
        SwitchPageToProfile();
        onView(withId(R.id.covid_report))
                .perform(click());
        onView(withText("Are you sure you want to report COVID symptoms?"))
                .check(matches(isDisplayed()));
    }

    /*
     * Click no on Covid button
     * */
    @Test
    public void ClickCovidButtonNo() {
        ClickCovidButton();
        onView(withText("NO"))
                .inRoot(isDialog())
                .check(matches(isDisplayed()))
                .perform(click());
    }

    /*
     * Click yes on Covid button
     * */
    @Test
    public void ClickCovidButtonYes() {
        ClickCovidButton();
        onView(withText("YES"))
                .inRoot(isDialog())
                .check(matches(isDisplayed()))
                .perform(click());
    }

    /*
     * Click on verify meetup
     * */
    @Test
    public void ClickOnVerifyMeetup() {
        SwitchPageToProfile();
        onView(withId(R.id.verify_meetup))
                .perform(click());
    }

    /*
     * Click on event spinner
     * */
    /*
    @Test
    public void ClickOnEventSpinner() {
        ClickOnVerifyMeetup();
        onView(withId(R.id.eventSpinner))
                .perform(click())
                .check(matches(isDisplayed()));
    }
    */




    /* Map Testcases */

    /*
     * Switch page to map_view
     * */
    @Test
    public void SwitchPageToMap() {
        onView(withId(R.id.map_view))
                .perform(click())
                .check(matches(isDisplayed()));
    }


    /*
     * Click on maps
     * */

    // click on various points




    /* Meetup Testcases */

    /*
     * Switch page to meetup_view
     * */
    @Test
    public void SwitchPageToMeetup() {
        onView(withId(R.id.meetup_view))
                .perform(click())
                .check(matches(isDisplayed()));
    }

    /*
    * Click on user spinner
    * */
    @Test
    public void ClickOnUserSpinner() {
        SwitchPageToMeetup();
        onView(withId(R.id.userSpinner))
                .perform(click())
                .check(matches(isDisplayed()));
    }

    /*
     * Click on rest spinner
     * */
    @Test
    public void ClickOnRestSpinner() {
        SwitchPageToMeetup();
        onView(withId(R.id.restSpinner))
                .perform(click())
                .check(matches(isDisplayed()));
    }


    /*
    * Create a meetup without any inputs
    * */
    @Test
    public void CreateMeetUp_NoInput() {
        SwitchPageToMeetup();
        onView(withId(R.id.createmeeting))
                .perform(click())
                .check(matches(not(isEnabled())));
    }


    /*
     * Create a meetup without guest
     * */
    @Test
    public void CreateMeetUp_NoGuestID() {
        SwitchPageToMeetup();
        onView(withId(R.id.btn_date))
                .perform(click());

        onView(withClassName(Matchers.equalTo(DatePicker.class.getName())))
                .perform(PickerActions.setDate(2021, 11, 10));
        onView(withText("OK")).perform(click());

        onView(withClassName(Matchers.equalTo(TimePicker.class.getName())))
                .perform(PickerActions.setTime(12, 0));
        onView(withText("OK")).perform(click());

        onView(withId(R.id.createmeeting))
                .perform(click())
                .check(matches(not(isEnabled())));
    }


    /*
     * Create a meetup without date
     * */
    @Test
    public void CreateMeetUp_NoDate() {
        SwitchPageToMeetup();

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

        onView(withClassName(Matchers.equalTo(TimePicker.class.getName())))
                .perform(PickerActions.setTime(12, 0));
        onView(withText("OK")).perform(click());

        onView(withId(R.id.createmeeting))
                .perform(click())
                .check(matches(not(isEnabled())));
    }


    /*
     * Create a meetup without time
     * */
    @Test
    public void CreateMeetUp_NoTime() {
        SwitchPageToMeetup();

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

        onView(withClassName(Matchers.equalTo(DatePicker.class.getName())))
                .perform(PickerActions.setDate(2021, 11, 10));
        onView(withText("OK")).perform(click());

        onView(withId(R.id.createmeeting))
                .perform(click())
                .check(matches(not(isEnabled())));
    }




    /* SideNav Testcases */
    // about
    // logout

    /* Login Testcases */
    // google login

    /* Permission Testcases */
    // enable location
    // disable location
}
