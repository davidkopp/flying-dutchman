describe("LanguageController", function () {
    beforeEach(function () {
        $("body").append("<span id='welcome-text'></span>");
    });

    afterEach(function () {
        $("#welcome-text").remove();
    });

    it("should be able to change the language", function () {
        changeLang("en");
        let firstString = $("#welcome-text").text();
        changeLang("de");
        let secondString = $("#welcome-text").text();

        expect(firstString).not.toEqual(secondString);
    });
});
