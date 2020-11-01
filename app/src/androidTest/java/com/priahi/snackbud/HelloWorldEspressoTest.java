package com.priahi.snackbud;

import androidx.test.espresso.ViewAssertion;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;

import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.matcher.RootMatchers.isDialog;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.*;


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
    * Create a meetup
    * */
    @Test
    public void CreateMeetUp() {
        
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
