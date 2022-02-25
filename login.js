/*
 * File: login.js
 *
 * Login handling of the staff and VIP members.
 *
 * Author: Paarth Sanhotra
 * -----
 * Last Modified: Wednesday, 23rd February 2022
 * Modified By: Paarth Sanhotra (paarthsanhotra@gmail.com)
 */

const login_form = $("#login-form");
const login_button = $("#login-form-submit");

login_button[0].addEventListener("click", (e) => {
    e.preventDefault();

    // TODO: Implement login handling
    const username = document.getElementById("username-input-field").value;
    const password = document.getElementById("password-input-field").value;

    for (let index = 0; index < DB.users.length; index++)
    {
        if(username == DB.users[index].username)
        {
            if(password == DB.users[index].password)
            {
                switch(DB.users[index].credentials)
                {
                    case 0: window.location.href = "manager_dashboard.html"; break;
                    case 1: case 2: window.location.href = "waiter_dashboard.html"; break;
                    case 3: window.location.href = "vip_dashboard.html"; break;
                    default: alert("Credentials do not exist");
                }
            }
            else
            {
                alert("Wrong Password");
                break;
            }
        }
        if(index == DB.users.length-1)
        {
            alert("Username not found");
        }
    }
});
