package com.priahi.snackbud;

import android.view.View;
import android.widget.DatePicker;
import android.widget.TimePicker;

import androidx.test.espresso.InjectEventSecurityException;
import androidx.test.espresso.UiController;
import androidx.test.espresso.ViewAction;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;

import com.priahi.snackbud.main.MainActivity;

import org.hamcrest.Matcher;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onData;
import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.closeSoftKeyboard;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.assertion.ViewAssertions.doesNotExist;
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
public class SnackBudUITest {

    @Rule
    public ActivityScenarioRule<MainActivity> activityRule =
            new ActivityScenarioRule<>(MainActivity.class);

    @Test
    public void listGoesOverTheFold() {
        onView(withId(R.id.map_view)).check(matches(isDisplayed()));

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

        onView(withText("109786710572605387609"))
                .check(doesNotExist());

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

        onView(withText("109786710572605387609"))
                .check(doesNotExist());

        Assert.assertTrue(true);
    }

    /*
     * Test verify meetup functions
     * */
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
                .perform(click());

        // Send code enabled, try to verify
        onView(withId(R.id.send_code))
                .perform(click());

        Assert.assertTrue(true);
    }

    /*
     * Click on event spinner
     * */
    @Test
    public void clickOnEventSpinner() {
        clickOnVerifyMeetup();
        onView(withId(R.id.eventSpinner))
                .check(matches(isDisplayed()));

        Assert.assertTrue(true);
    }

//    /*
//     * Click on verify meetup
//     * */
//    @Test
//    public void clickOnCancelMeetup() {
//        switchPageToProfile();
//        onView(withId(R.id.cancel_meetup))
//                .perform(click());
//
//        onView(withText("109786710572605387609"))
//                .check(doesNotExist());
//
//        Assert.assertTrue(true);
//    }
//
//    /*
//     * Click on event spinner
//     * */
//    @Test
//    public void clickOnCancelEventSpinner() {
//        clickOnCancelMeetup();
//        onView(withId(R.id.cancel_event_spinner))
//                .check(matches(isDisplayed()));
//
//        Assert.assertTrue(true);
//    }

    /*
     * Cancel Event
     */
//    @Test
//    public void CancelEvent() {
//        clickOnVerifyMeetup();
//        onView(withId(R.id.cancel_event_spinner))
//                .perform(click())
//                .check(matches(isDisplayed()));
//
//        Assert.assertTrue(true);
//    }

    /*
     * Switch page to map_view
     * */
    @Test
    public void switchPageToMap() {
        onView(withId(R.id.map_view))
                .perform(click())
                .check(matches(isDisplayed()));

        onView(withText("109786710572605387609"))
                .check(doesNotExist());

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

        onView(withText("109786710572605387609"))
                .check(doesNotExist());

        Assert.assertTrue(true);
    }

    /*
     * Click on user spinner
     * */
    @Test
    public void clickOnUserChipInput() {
        switchPageToMeetup();
        onView(withId(R.id.chips_input))
                .perform(click())
                .check(matches(isDisplayed()));
        Assert.assertTrue(true);
    }

    /*
     * Click on user spinner and search for a user chip
     * */
    @Test
    public void searchUser() {
        switchPageToMeetup();

        onView(withId(R.id.chips_input))
                .perform(
                        new ViewAction() {
                            @Override
                            public Matcher<View> getConstraints() {
                                return isEnabled();
                            }

                            @Override
                            public String getDescription() {
                                return "type in user name";
                            }

                            @Override
                            public void perform(UiController uiController, View view) {
                                view.performClick();
                                try {
                                    uiController.injectString("Arnold");
                                } catch (InjectEventSecurityException e) {
                                    e.printStackTrace();
                                }
                            }
                        }
                )
                .check(matches(isDisplayed()));

        onView(withText("Arnold Ying"))
                .check(matches(isDisplayed()));

        Assert.assertTrue(true);
    }

    /*
     * Click on rest spinner
     * */
    @Test
    public void clickOnRestSpinner() {
        switchPageToMeetup();

        onView(withId(R.id.search_rest))
                .perform(click());

        onView(withId(R.id.edit_text_rest))
                .check(matches(isDisplayed()));

        onView(withId(R.id.list_view_rest))
                .check(matches(isDisplayed()));

        Assert.assertTrue(true);
    }

    /*
     * Click on restaurant spinner and select a restaurant
     * */
    @Test
    public void searchAndSelectRest() {
        switchPageToMeetup();

        onView(withId(R.id.search_rest)).perform(click());

        onView(withId(R.id.edit_text_rest))
                .check(matches(isDisplayed()))
                .perform(replaceText("33 Acres"));
        onData(anything())
                .atPosition(0)
                .perform(click());

        onView(withText("33 Acres")).check(matches(isDisplayed()));

        Assert.assertTrue(true);
    }

    /*
     * Create a meetup without interacting with the UI
     * */
    @Test
    public void createMeetUpNoInputs() {
        switchPageToMeetup();

        onView(withId(R.id.btn_date)).check(matches(not(isEnabled())));

        onView(withId(R.id.btn_time)).check(matches(not(isEnabled())));

        onView(withId(R.id.createmeeting)).check(matches(not(isEnabled())));

        Assert.assertTrue(true);
    }


    /*
     * Select a user and restaurant and check if each button is enabled or not
     * */
    @Test
    public void createMeetUpNoDate() {
        switchPageToMeetup();

        onView(withId(R.id.search_rest)).perform(click());

        onView(withId(R.id.edit_text_rest))
                .check(matches(isDisplayed()))
                .perform(replaceText("33 Acres"));
        onData(anything())
                .atPosition(0)
                .perform(click());

        onView(withText("33 Acres")).check(matches(isDisplayed()));

        onView(withId(R.id.btn_date)).check(matches(isEnabled()));

        onView(withId(R.id.btn_time)).check(matches(not(isEnabled())));

        onView(withId(R.id.createmeeting)).check(matches(not(isEnabled())));

        Assert.assertTrue(true);
    }


    /*
     * Select a user and restaurant and time and check if each button is enabled or not
     * */
    @Test
    public void createMeetUpNoTime() {
        switchPageToMeetup();

        onView(withId(R.id.search_rest)).perform(click());

        onView(withId(R.id.edit_text_rest))
                .check(matches(isDisplayed()))
                .perform(replaceText("33 Acres"));
        onData(anything())
                .atPosition(0)
                .perform(click());

        onView(withText("33 Acres")).check(matches(isDisplayed()));

        onView(withId(R.id.btn_date))
                .perform(click());

        onView(withClassName(equalTo(DatePicker.class.getName())))
                .perform(setDate(2021, 2, 14));
        onView(withText("OK")).perform(click());

        onView(withId(R.id.btn_time)).check(matches(isEnabled()));

        onView(withId(R.id.createmeeting)).check(matches(not(isEnabled())));

        Assert.assertTrue(true);
    }

    /*
     * Create a meetup with valid inputs
     * */
    @Test
    public void createMeetUp() {
        switchPageToMeetup();
        // click 1 - on the chips
        onView(withId(R.id.search_rest)).perform(click()); // click 2

        onView(withId(R.id.edit_text_rest))
                .check(matches(isDisplayed()))
                .perform(replaceText("33 Acres"));
        onData(anything())
                .atPosition(0)
                .perform(click()); // click 3

        onView(withText("33 Acres")).check(matches(isDisplayed()));

        onView(withId(R.id.btn_date))
                .perform(click()); // click 4
        onView(withClassName(equalTo(DatePicker.class.getName())))
                .perform(setDate(2021, 2, 14)); // click 5 & click 6
        onView(withText("OK")).perform(click()); // click 7

        onView(withId(R.id.btn_time))
                .perform(click()); // click 8
        onView(withClassName(equalTo(TimePicker.class.getName())))
                .perform(setTime(15, 35)); // click 9 & click 10
        onView(withText("OK")).perform(click()); // click 11

        onView(withId(R.id.createmeeting))
                .check(matches(isEnabled())); // click 12
        Assert.assertTrue(true);
    }
}
