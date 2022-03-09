/*
 * File: HomeController.js
 *
 * Controller that is responsible for displaying the home page.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Wednesday, 9th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

(function ($) {
    $(document).ready(function () {
        // Add hover effect to the login button.
        $("#home-login-button img")
            .mouseover(function () {
                $(this).attr("src", $(this).data("hover"));
            })
            .mouseout(function () {
                $(this).attr("src", $(this).data("src"));
            });

        $("#home-login-button").click(function () {});
    });
})(jQuery);
