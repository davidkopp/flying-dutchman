/*
 * File: login.js
 *
 * Login handling of the staff and VIP members.
 *
 * Author: Paarth Sanhotra
 * -----
 * Last Modified: Wednesday, 23rd February 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

const login_form = $("#login-form");
const login_button = $("#login-form-submit");

login_button.addEventListener("click", (e) => {
    e.preventDefault();

    // TODO: Implement login handling
    const username = login_form.username.value;
    const password = login_form.password.value;

    const userdetails = JSON.parse();
});
