/*
 * File: HomeController.js
 *
 * Controller that is responsible for displaying the home page.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Saturday, 12th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

(function ($) {
    $(document).ready(function () {
        // Add hover effect to the login button.
        $("#home-center-button img")
            .mouseover(function () {
                $(this).attr("src", $(this).data("hover"));
            })
            .mouseout(function () {
                $(this).attr("src", $(this).data("src"));
            });

        $("#home-center-button").click(function () {});
    });
})(jQuery);
