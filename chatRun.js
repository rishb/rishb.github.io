var allChatData = new Array();
var first;
var last;
var sender;
var prevSender = "~SDFS@#@DSFDSDF";
var changeSender = 0;
var message;
var totalLength = 0;

$(function() {
    window.onload = function () {
        Parse.initialize("aIPhs5D1uJYzB6jle6xtA8k3xlfyohcoAALbRVdi", "CaGYmxvPrbiPwJd4x8Q6Yo1Iu2mYpCzVJoQRXAF3");
        
        first = localStorage["firstName"];
        last = localStorage["lastName"];
        
        var ChatText = Parse.Object.extend("chatData");
        var query = new Parse.Query(ChatText);
        query.find({
            success: function(results) {
                totalLength += results.length;
                for (var i = 0; i < results.length; i++)
                {
                    allChatData.push(results[i].get("input"));
                }
                updateChat();
            }
        });
        setInterval(remove, 1000);
    };
    $("#chatInput").keyup(function(event) {
        if (event.keyCode == 13) {
            if (document.getElementById('chatInput').value.length > 0)
            {
                submitRight();
                document.getElementById('chatInput').value = "";
            }
        }
    });
});

function updateChat()
{
    for (var i = 0; i < allChatData.length; i++)
    {
        var splitArr = [];
        splitArr = allChatData[i].split(' ');
        sender = splitArr[0] + " ";
        for (var j = 0; j < splitArr[1].length - 1; j++)
        {
            sender = sender + splitArr[1][j];
        }
        if (sender != prevSender)
        {
            changeSender = 1;
            prevSender = sender;
            message = sender;
            if (splitArr[0] == first && splitArr[1] == (last + ':')) submitRightNot();
            else submitLeft();
        }
        changeSender = 0;
        message = "";
        for (var j = 2; j < splitArr.length; j++)
        {
            if (j == 2) message = message + splitArr[j];
            else message = message + " " + splitArr[j];
        }
        if (splitArr[0] == first && splitArr[1] == (last + ':')) submitRightNot();
        else submitLeft();
    }
}

function submitRight()
{   
    
    var newDiv = document.createElement('div');
    
    var textVal = document.getElementById("chatInput").value;
    
    sender = first + " " + last;
    if (sender != prevSender)
    {
        prevSender = sender;
        newDiv.className = "textDivsRightName";
        var newText = document.createTextNode(sender);
        newDiv.appendChild(newText);
        var curDiv = document.getElementById('mainContainer');
        curDiv.appendChild(newDiv);
        newDiv = document.createElement('div');
        newDiv.className = "clear";
        curDiv.appendChild(newDiv);
        curDiv.scrollTop = curDiv.scrollHeight;
        
        newDiv = document.createElement('div');
        newDiv.className = "textDivsRight";
        newText = document.createTextNode(textVal);
        newDiv.appendChild(newText);
        curDiv.appendChild(newDiv);
        newDiv = document.createElement('div');
        newDiv.className = "clear";
        curDiv.appendChild(newDiv);
        newDiv = document.createElement('div');
        newDiv.className = "clear";
        curDiv.appendChild(newDiv);
        curDiv.scrollTop = curDiv.scrollHeight;
        
        textVal = first + " " + last + ": " + textVal;
    
        var ChatText = Parse.Object.extend("chatData");
        var chatText = new ChatText();
        chatText.set("input", textVal);
        chatText.save();
        
        totalLength++;
    }
    else
    {
        newDiv.className = "textDivsRight";
        var newText = document.createTextNode(textVal);
        newDiv.appendChild(newText);
        var curDiv = document.getElementById('mainContainer');
        curDiv.appendChild(newDiv);
        newDiv = document.createElement('div');
        newDiv.className = "clear";
        curDiv.appendChild(newDiv);
        newDiv = document.createElement('div');
        newDiv.className = "clear";
        curDiv.appendChild(newDiv);
        curDiv.scrollTop = curDiv.scrollHeight;
        
        textVal = first + " " + last + ": " + textVal;
    
        var ChatText = Parse.Object.extend("chatData");
        var chatText = new ChatText();
        chatText.set("input", textVal);
        chatText.save();
        
        totalLength++;
    }
}

function submitRightNot()
{   
    var newDiv = document.createElement('div');
    if (changeSender == 0) newDiv.className = "textDivsRight";
    else if (changeSender == 1) newDiv.className = "textDivsRightName";
    
    var newText = document.createTextNode(message);
    newDiv.appendChild(newText);
    var curDiv = document.getElementById('mainContainer');
    curDiv.appendChild(newDiv);
    newDiv = document.createElement('div');
    newDiv.className = "clear";
    curDiv.appendChild(newDiv);
    curDiv.scrollTop = curDiv.scrollHeight;
}

function submitLeft()
{   
    var newDiv = document.createElement('div');
    if (changeSender == 0) newDiv.className = "textDivsLeft";
    else if (changeSender == 1) newDiv.className = "textDivsLeftName";
    
    var newText = document.createTextNode(message);
    newDiv.appendChild(newText);
    var curDiv = document.getElementById('mainContainer');
    curDiv.appendChild(newDiv);
    newDiv = document.createElement('div');
    newDiv.className = "clear";
    curDiv.appendChild(newDiv);
    curDiv.scrollTop = curDiv.scrollHeight;
}

function remove()
{
    var ChatText = Parse.Object.extend("chatData");
    var query = new Parse.Query(ChatText);
    query.find({
        success: function(results) {
            if (results.length > totalLength)
            {
                allChatData = [];
                for (var i = totalLength; i < results.length; i++)
                {
                    allChatData.push(results[i].get('input'));
                }
                totalLength = results.length;
                updateChat();
            }
        }
    });
}