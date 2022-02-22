(function ($, exports) {
    // This function is the simplest possible. However, in order
    // to handle many different languages it will not be sufficient.
    // The necessary change should not be difficult to implement.
    //
    // After each language change, we will need to update the view, to propagate
    // the change to the whole view.
    //
    function change_lang(new_lang) {
        switch (new_lang) {
            case "en":
                language = "en";
                break;
            case "de":
                language = "de";
                break;
            case "pt":
                language = "pt";
                break;
            default:
                console.error(`Language ${new_lang} not known.`);
                break;
        }
        update_view();
    }

    function update_view() {
        $("#welcome-text").text(get_string("hello_text"));
        $("#username").text(get_string("username"));
        $("#password").text(get_string("password"));
        $("#order").text(get_string("order"));
        $("#pay").text(get_string("pay"));
        $("#login").text(get_string("login"));
    }

    $(document).ready(function () {
        update_view();
    });

    exports.change_lang = change_lang;
})(jQuery, window);
