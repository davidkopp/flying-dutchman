/*
 * File: EffectsController.js
 *
 * Controller that is responsible for some effects (e.g. changing images while hovering).
 *
 * Author: David Kopp
 * -----
 * Last Modified: Saturday, 12th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

(function ($, exports) {
    $(document).ready(function () {
        // Add hover effect to the login button.
        $("[data-hover]").each(function (index, element) {
            $(element).mouseover(function () {
                $(this).attr("src", $(this).data("hover"));
            });
            $(element).mouseout(function () {
                $(this).attr("src", $(this).data("src"));
            });
        });
    });

    /**
     * Changes the filter icons in the menu accordingly to the currently used
     * filter (normal / active).
     *
     * @param {string} filter The filter.
     */
    function updateFilterIconsInView(filter) {
        $(".filter-icon").each(function () {
            const $img = $(this).find("img");
            $img.attr("src", $($img).data("src"));
        });
        let $img;
        switch (filter) {
            case Constants.BEER_filter:
                $img = $("#filter-icon-beer").find("img");
                break;
            case Constants.WINE_filter:
                $img = $("#filter-icon-wine").find("img");
                break;
            case Constants.DRINK_filter:
                $img = $("#filter-icon-drink").find("img");
                break;
            case Constants.WATER_filter:
                $img = $("#filter-icon-water").find("img");
                break;
            default:
                break;
        }
        if ($img) {
            $img.attr("src", $($img).data("active"));
        }
    }

    exports.EffectsController = {};
    exports.EffectsController.updateFilterIconsInView = updateFilterIconsInView;
})(jQuery, window);
