var userFirst;
var userLast;

$(function() {
    window.onload = function () {
        Parse.initialize("aIPhs5D1uJYzB6jle6xtA8k3xlfyohcoAALbRVdi", "CaGYmxvPrbiPwJd4x8Q6Yo1Iu2mYpCzVJoQRXAF3");
        document.getElementById('signUpDiv').style.display = 'none';
        document.getElementById('messengerLogo').style.opacity = startOpacity;
        startOpacity = startOpacity + 0.01;
        loadOpacity();
    };
    $("#signUpButton").click(function() {
        document.getElementById('mainArea').style.display = 'none';
        document.getElementById('signUpDiv').style.display = 'block';
    });
    $("#pass").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#pass").blur();
            $("#signUpBut").click();
        }
    });
    $("#usr").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#usr").blur();
            $("#signUpBut").click();
        }
    });
    $("#firstName").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#firstName").blur();
            $("#signUpBut").click();
        }
    });
    $("#surname").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#surname").blur();
            $("#signUpBut").click();
        }
    });
    $("#email").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#email").blur();
            $("#signUpBut").click();
        }
    });
    $("#username").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#username").blur();
            $("#logInButton").click();
        }
    });
    $("#password").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#password").blur();
            $("#logInButton").click();
        }
    });
    $("#logInButton").click(function() {
            var user = document.getElementById('username').value;
            var pass = document.getElementById('password').value;
            if (user.length < 1) alert('Username field is empty.');
            else if (pass.length < 1) alert('Password field is empty.');
            else
            {
                document.getElementById('username').value = "";
                document.getElementById('password').value = "";
                Parse.User.logIn(user, pass, {
                    success: function (user) {
                        userFirst = Parse.User.current().get('firstName');
                        userLast =  Parse.User.current().get('lastName');
//                        localStorage.setItem("firstName", userFirst);
//                        localStorage.setItem("lastName", userLast);
                        localStorage["firstName"] = userFirst;
                        localStorage["lastName"] = userLast;
                        window.open('loading.html','_self',false);
                    },
                    error: function(user, error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            }
    });
    $("#signUpBut").click(function() {
        //Register user into Parse database as Parse.User
        
        var usrName = document.getElementById('usr').value;
        var password = document.getElementById('pass').value;
        var first = document.getElementById('firstName').value;
        var last = document.getElementById('surname').value;
        var mail = document.getElementById('email').value;
        
        var user = new Parse.User();
        user.set("username", usrName);
        user.set("password", password);
        user.set("firstName", first);
        user.set("lastName", last);
        user.set("email", mail);
        
        if (usrName.length < 1) alert("Please choose a username.");
        else if (pass.length < 1) alert("Please choose a password.");
        else if (mail.length < 1) alert("Please enter your email.");
        else if (first.length < 1) alert("Please enter your first name.");
        else if (last.length < 1) alert("Please enter your last name.");
        else
        {
            user.signUp(null, {
              success: function(user) {
                document.getElementById('signUpText').innerHTML = "Account Created.";
                document.getElementById('usr').style.display = 'none';
                document.getElementById('pass').style.display = 'none';
                document.getElementById('firstName').style.display = 'none';
                document.getElementById('surname').style.display = 'none';
                document.getElementById('email').style.display = 'none';
              },
              error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
              }
            });
        }
    });
});

var startOpacity = 0;

function loadOpacity()
{
    document.getElementById('messengerLogo').style.opacity = startOpacity;
    startOpacity = startOpacity + 0.01;
    if (startOpacity < 1.00) setTimeout(loadOpacity, 25);
}
    