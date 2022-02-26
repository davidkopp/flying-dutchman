/*
 * File: LanguageControllerSpec.js
 *
 * Author: David Kopp
 * -----
 * Last Modified: Saturday, 26th February 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

describe("LanguageController", function () {
    beforeEach(function () {
        $("body").append(
            "<span id='test-element' data-lang='unit-test'></span>"
        );
    });

    afterEach(function () {
        $("#test-element").remove();
    });

    it("should be able to change the language", function () {
        changeLang("en");
        let firstString = $("#test-element").text();
        changeLang("de");
        let secondString = $("#test-element").text();

        expect(firstString).not.toEqual(secondString);
    });
});
