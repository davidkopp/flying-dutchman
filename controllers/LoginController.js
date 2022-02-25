/*
 * File: LoginController.js
 *
 * Login handling of the staff and VIP members.
 *
 * Author: Paarth Sanhotra
 * -----
 * Last Modified: Friday, 25th February 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

(function ($) {
    // When the DOM is ready set the event handler to the login button
    $(document).ready(function () {
        $("#login-form-submit").click(loginEventHandler);
    });

    function loginEventHandler(e) {
        e.preventDefault();

        const username = $("#username-input-field").val();
        const password = $("#password-input-field").val();

        // Important: This login handling is not secure and stores the password in plain text in the database!
        var user = DatabaseAPI.Users.getUserDetailsIfCredentialsAreValid(
            username,
            password
        );
        if (!user) {
            alert("Wrong username or password!");
            return;
        }

        switch (user.credentials) {
            case 0:
                window.location.href = "manager_dashboard.html";
                break;
            case 1:
            case 2:
                window.location.href = "waiter_dashboard.html";
                break;
            case 3:
                window.location.href = "vip_dashboard.html";
                break;
            default:
                console.log(
                    `LoginController.loginEventHandler | Credentials permission level '${user.credentials}' is unknown!`
                );
        }
    }
})(jQuery);
