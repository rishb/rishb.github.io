var allChatData = new Array();
var indexData = new Array();
var enterSignup = 0;
var enterLogin = 0;
var first;
var last;
var chatText;
var query;
var endLoop;

//
//REMOVE GLOBAL CHATS -- MAKE IT SO THAT YOU HAVE TO ADD THE PERSON'S USERNAME AND THEN THAT WILL START A CHAT WITH THEM
//

$(function()
{
    window.onload = function() {
        Parse.initialize("aIPhs5D1uJYzB6jle6xtA8k3xlfyohcoAALbRVdi", "CaGYmxvPrbiPwJd4x8Q6Yo1Iu2mYpCzVJoQRXAF3");
        var canvas = document.getElementById('formCanvas');
        var context = canvas.getContext('2d');
        context.globalAlpha = 0.8;
        context.fillStyle = "white";
        context.fillRect(0, 0, 600, 600);
        canvas = document.getElementById('srchBox');
        context = canvas.getContext('2d');
        context.globalAlpha = 0.8;
        context.fillStyle = "white";
        context.fillRect(0, 0, 600, 600);
        document.getElementById('container').style.display = 'none';
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('loginForm2').style.display = 'none';
        document.getElementById('searchBox').style.display = 'none';
        
        ChatText = Parse.Object.extend("chatData");
        query = new Parse.Query(ChatText);
        query.find({
            success: function(results) {
                for (var i = 0; i < results.length; i++)
                {
                    console.log(results[i].get("input"));
                    allChatData.push(results[i].get("input"));
                }
            }
        });
//        console.log(allChatData);
    };
    $("#logout").click(function()
    {
        clearInterval(endLoop);
    });
    $("#signupButton").click(function()
    {
        if (enterLogin == 1)
        {
            document.getElementById('loginForm2').style.display = 'none';
            enterLogin = 0;
        }
        if (enterSignup == 0)
        {
            enterSignup = 1;
            document.getElementById("signupButton").innerHTML = "Click To Complete Sign Up";
            document.getElementById("loginButton").innerHTML = "Already Have An Account?";
            document.getElementById('loginForm').style.display = 'inline';
            return;
        }
        else
        {
            var username = document.getElementById('user').value;
            var password = document.getElementById('pw').value;
            var firstName = document.getElementById('fName').value;
            var lastName = document.getElementById('lName').value;
            if (username.length < 6) alert('Invalid username.');
            else if (password.length < 6) alert('Invalid password.');
            else if (firstName.length == 0) alert('First name field is empty.');
            else if (lastName.length == 0) alert('Last name field is empty.');
            else
            {
                var user = new Parse.User();
                user.set("username", username);
                user.set("password", password);
                user.set("firstName", firstName);
                user.set("lastName", lastName);

                user.signUp(null, {
                  success: function(user) {
                    alert('Signed up.');
                    $("#loginButton").click();
                  },
                  error: function(user, error) {
                    // Show the error message somewhere and let the user try again.
                    alert("An error occurred. Please try again later");
                  }
                });
            }
        }
    });
    $("#loginButton").click(function()
    {
        if (enterLogin == 0)
        {
            enterLogin = 1;
            document.getElementById("signupButton").innerHTML = "Don't Have An Account?";
            document.getElementById("loginButton").innerHTML = "Login";
            if (enterSignup == 1)
            {
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('loginForm2').style.display = 'block';
                enterSignup = 0;
            }
            else document.getElementById('loginForm2').style.display = 'block';
            return;
        }
        var username = document.getElementById('usr').value;
        var password = document.getElementById('pwd').value;
        document.getElementById('usr').value = "";
        document.getElementById('pwd').value = "";
        if (username.length < 6) alert('Incorrect username.');
        else if (password.length < 6) alert('Incorrect password.');
        else
        {
            Parse.User.logIn(username, password, {
                success: function(user) {
//                    alert('Logged In.');
                    var currentUser = Parse.User.current();
                    first = Parse.User.current().get('firstName');
                    last =  Parse.User.current().get('lastName');
                    document.getElementById('topRight').innerHTML = first + ' ' + last;
                    document.getElementById('container').style.display = 'block';
                    document.getElementById('searchBox').style.display = 'block';
                    
                    updateChat();
                    document.getElementById('loginForm2').style.display = 'none';
                    document.getElementById('signupButton').style.display = 'none';
                    document.getElementById('loginButton').style.display = 'none';
                    
                    endLoop = setInterval(refresh, 1000);
                },
                error: function(user, error) {
                    alert('Invalid username or password.');
                }
            });
        }
    });
    $("#submitText").click(function()
    {
        var textInput = document.getElementById('chatIn').value;
        if (textInput.length > 0)
        {
            textInput = first + ' ' + last + ': ' + textInput;
            document.getElementById('chatIn').value = "";
            var ChatText = Parse.Object.extend("chatData");
            var chatText = new ChatText();
            chatText.set("input", textInput);
            chatText.save();
            
            var canvas = document.getElementById('formCanvas');
            var context = canvas.getContext('2d');
            
            allChatData.push(textInput);
            console.log(allChatData);
            updateChat();
            return;
        }
        else alert('No text entered');
    });
    $("#chatIn").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#submitText").click();
        }
    });
    $("#pwd").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#loginButton").click();
        }
    });
    $("#search").keyup(function(event) {
        if (event.keyCode == 13) {
            var query = new Parse.Query(Parse.User);
            query.equalTo("username", document.getElementById('search').value);  // find all the women
            query.find({
                success: function(users) {
                    if (users.length > 0) alert('User exists');
                    else alert('User does not exist.');
                }
            });
                
            
        }
    });
});

function refresh()
{
    query.find({
        success: function(results) {
            console.log(results.length + ' ' + allChatData.length);
            if (results.length != allChatData.length)
            {
                for (var i = allChatData.length; i < results.length; i++)
                {
                    allChatData.push(results[i].get("input"));
                }
            }
        }
    });
    updateChat();
}

var splitArr = new Array();

function updateChat()
{
    var canvas = document.getElementById('formCanvas2');
    var context = canvas.getContext('2d');
    context.textAlign = "left";
    var otherCanvas = document.getElementById('formCanvas3');
    var otherContext = otherCanvas.getContext('2d');
    otherContext.textAlign = "right";
    context.clearRect(0, 0, canvas.width, canvas.height);
    otherContext.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "10px Verdana";
    for (var i = 0; i < allChatData.length; i++)
    {
        splitArr = [];
        splitArr = allChatData[allChatData.length - 1 - i].split(' ');
        if (splitArr[0] == first && splitArr[1] == (last + ':')) context.fillText(allChatData[allChatData.length - 1 - i], 20, 20 + (20 * (25 - i)));
        else otherContext.fillText(allChatData[allChatData.length - 1 - i], 590, 20 + (20 * (25 - i)));
        if (i >= 25) i = allChatData.length + 1;
    }
}