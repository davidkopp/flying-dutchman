(function ($, exports) {
    function changeLang(new_lang) {
        switch (new_lang) {
            case "en":
                Dictionary.setLanguage("en");
                break;
            case "de":
                Dictionary.setLanguage("de");
                break;
            case "pt":
                Dictionary.setLanguage("pt");
                break;
            default:
                console.error(`Language ${new_lang} not known.`);
                break;
        }
        updateView();
    }

    function updateView() {
        $("#welcome-text").text(Dictionary.getString("hello_text"));
        $("#username-label").text(Dictionary.getString("username"));
        $("#password-label").text(Dictionary.getString("password"));
        $("#order").text(Dictionary.getString("order"));
        $("#pay").text(Dictionary.getString("pay"));
        $("#login-form-submit").val(Dictionary.getString("login"));
    }

    $(document).ready(function () {
        updateView();
    });

    exports.changeLang = changeLang;
})(jQuery, window);
