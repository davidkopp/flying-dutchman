/*
 * File: LoginController.js
 *
 * Login handling of the staff and VIP members.
 *
 * Author: Paarth Sanhotra
 * -----
 * Last Modified: Wednesday, 9th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

(function ($, exports) {
    /**
     * When the DOM is ready set the event handlers for the login and logout
     * button and update the login status.
     */
    $(document).ready(function () {
        $("#login-form-submit").click(loginEventHandler);
        $("#logout-button").click(logoutEventHandler);

        updateLoginStatusOnPage();
    });

    /**
     * The event handler for the login of an user.
     *
     * @param {object} e The event object.
     */
    function loginEventHandler(e) {
        e.preventDefault();

        const username = $("#username-input-field").val().trim();
        const password = $("#password-input-field").val().trim();

        // Important: This login handling is not secure and stores the password in plain text in the database!
        var user = DatabaseAPI.Users.getUserDetailsIfCredentialsAreValid(
            username,
            password
        );
        if (!user) {
            alert("Wrong username or password!");
            return;
        }

        const alreadyLoggedInUser = getUserDataOfLoggedInUser();
        if (alreadyLoggedInUser) {
            if (alreadyLoggedInUser.username == username) {
                console.log(`The user '${username}' is already logged in.`);
            } else {
                console.log(
                    `There is another user already logged in: '${alreadyLoggedInUser.username}'. This user will be logged out now.`
                );
            }
        }
        // Save the relevant user data to the storage, so this user is supposed to be logged-in.
        saveUserDataInStorage(user);
        console.log(
            `User '${username}' is now logged in with the access level '${user.credentials}'.`
        );

        // Forward the user to the default page based on the access level.
        forwardUserPageBasedOnAccessLevel(user.credentials);
    }

    /**
     * The event handler for the logout of an user.
     *
     * @param {object} e The event object.
     */
    function logoutEventHandler(e) {
        e.preventDefault();

        const loggedInUserData = getUserDataOfLoggedInUser();
        if (!loggedInUserData) {
            return;
        }

        // Remove user data of the currently logged-in from the storage, so no user is supposed to be logged-in anymore.
        sessionStorage.removeItem(Constants.STORAGE_LOGGED_IN_USER_KEY);
        console.log(
            `User '${loggedInUserData.username}' was successfully logged out.`
        );

        // Forward the user to the default page.
        forwardUserPageBasedOnAccessLevel(Constants.ACCESS_LEVEL_NONE);
    }

    /**
     * Updates the login status on the page by inserting the username if a user
     * is currently logged in. Otherwise
     */
    function updateLoginStatusOnPage() {
        const loggedInUserData = getUserDataOfLoggedInUser();
        if (loggedInUserData) {
            // An user is logged in → show the user name.
            $("#logged-in-user").text(loggedInUserData.username);
            $("#logged-in-user-container").show();
            $("#logout-button").show();
        } else {
            // No user is currently logged in → don't show info about any user.
            $("#logged-in-user").text("");
            $("#logged-in-user-container").hide();
            $("#logout-button").hide();
        }
    }

    /**
     * Save the relevant data of the logged in user to storage.
     *
     * @param {object} user The user object.
     */
    function saveUserDataInStorage(user) {
        const userData = {
            user_id: user.user_id,
            username: user.username,
            credentials: user.credentials,
        };
        sessionStorage.setItem(
            Constants.STORAGE_LOGGED_IN_USER_KEY,
            JSON.stringify(userData)
        );
    }

    /**
     * Get the user data of the currently logged in user.
     *
     * @returns {object} The user object of the logged-in user, or `null` if
     *   there is no user logged-in.
     */
    function getUserDataOfLoggedInUser() {
        const savedUserDataString = sessionStorage.getItem(
            Constants.STORAGE_LOGGED_IN_USER_KEY
        );
        return savedUserDataString && JSON.parse(savedUserDataString);
    }

    /**
     * Returns the access level of the current logged-in user.
     *
     * @returns {number} The access level of the user.
     */
    function getAccessLevelOfLoggedInUser() {
        const loggedInUser = getUserDataOfLoggedInUser();
        if (!loggedInUser) {
            return Constants.ACCESS_LEVEL_NONE;
        }
        return loggedInUser.credentials;
    }

    /**
     * Forwards the user to another page based on the access level the user has.
     *
     * @param {number} credentials The access level of an user.
     */
    function forwardUserPageBasedOnAccessLevel(credentials) {
        switch (credentials) {
            case Constants.ACCESS_LEVEL_MANAGER:
                window.location.href = "manager_dashboard.html";
                break;
            case Constants.ACCESS_LEVEL_BARTENDER:
            case Constants.ACCESS_LEVEL_WAITER:
                window.location.href = "staff_dashboard.html";
                break;
            case Constants.ACCESS_LEVEL_VIP:
                window.location.href = "vip_dashboard.html";
                break;
            case Constants.ACCESS_LEVEL_NONE:
                window.location.href = "index.html";
                break;
            default:
                console.log(
                    `LoginController | Access level '${credentials}' is unknown!`
                );
        }
    }

    exports.LoginController = {};
    exports.LoginController.getAccessLevelOfLoggedInUser =
        getAccessLevelOfLoggedInUser;
    exports.LoginController.getUserDataOfLoggedInUser =
        getUserDataOfLoggedInUser;
})(jQuery, window);
