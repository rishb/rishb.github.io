var runCounter = 0;

$(function() 
{
    window.onload = function() {
//        firstLine();
        initialiseCanvas();
//        setInterval(updateSnow, 10);
    };
    $("#Next").click(function() 
    {
        if (runCounter == 0)
        {
            runCounter = 1;
            firstLine();
            var canvas = document.getElementById('mainCanvas');
            canvas.addEventListener("mousedown", drawSnowflake, false);
            setInterval(updateSnow, 10);
        }
        else
        {
            nextArray();
            drawArray();
        }
    });
    $("#FreeFractal").click(function() 
    {
        runFreeFractal();
    });
    $("#toggle").click(function()
    {
        var canvas = document.getElementById('otherCanvas');
        if (canvasHidden == false)
        {
            canvas.style.display="none";
            canvasHidden = true;
        }
        else
        {
            canvas.style.display="initial";
            canvasHidden = false;
        }
    });
});

var canvasHidden = false;
var snowArr = new Array();
var snowHolder = new Array();
var snowHolderPrev = new Array();
var setOfSets = new Array();
var locationX = locationY = 0;
var startMatch = endMatch = -1;
var coordinates = new Array();
var arrSize = animIterator = globalArrIndex = 0;

function initialiseCanvas()
{
    var canvas = document.getElementById('otherCanvas');
    canvas.addEventListener("mousedown", getStart, false);
    canvas.addEventListener("mouseup", getEnd, false);
}

function drawSnowflake(event)
{
    var x = event.x - 68;
    var y = event.y - 220;
    snowArr = [];
    snowArr.push(generateCoord(x + 30, y + 30));
    snowArr.push(generateCoord(x - 30, y + 30));
    snowArr.push(generateCoord(x, y - 21.96));
    snowArr.push(generateCoord(x + 30, y + 30));
    for (var i = 0; i < 3; i++)
    {
        var newArray = [];
        var notEmpty = false;
        var iterator = 0;
        while (iterator < snowArr.length)
        {
            var firstCoord, secondCoord;
            firstCoord = snowArr[iterator];
            secondCoord = snowArr[iterator + 1];
            var oneThird = generateCoord(firstCoord.x + ((secondCoord.x - firstCoord.x) / 3.0), firstCoord.y + ((secondCoord.y - firstCoord.y) / 3.0));
            var twoThird = generateCoord(firstCoord.x + ((secondCoord.x - firstCoord.x) / (3.0 / 2.0)), firstCoord.y + ((secondCoord.y - firstCoord.y) / (3.0 / 2.0)));
            var newPos = calculateNextPosition(oneThird, twoThird);
            newArray.push(firstCoord);
            newArray.push(oneThird);
            newArray.push(newPos);
            newArray.push(twoThird);
            if (iterator + 2 >= snowArr.length)
            {
                newArray.push(secondCoord);
                iterator += 2;
            }
            else iterator++;
        }
        snowArr = [];
        snowArr = newArray.slice(0);
    }
    snowHolder.push(snowArr);
    snowHolderPrev.push(0);
}

function updateSnow()
{
    for (var i = 0; i < snowHolder.length; i++)
    {
        var move = 0;
        if (snowHolderPrev[i] == 0) move = 1;
        else move = 1.05 * snowHolderPrev[i];
        snowHolderPrev[i] = move;
        for (var j = 0; j < snowHolder[i].length; j++)
        {
            if (snowHolder[i][j].y < 710) snowHolder[i][j].y += move;
        }
    }
    drawSnow();
}

function drawSnow()
{
    var canvas = document.getElementById('secondCanvas');
    context = canvas.getContext('2d');
    context.clearRect(0, 0, 1300, 500);
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = "black";
    for (var i = 0; i < snowHolder.length; i++)
    {
        context.moveTo(snowHolder[i][0].x, snowHolder[i][0].y);
        for (var j = 1; j < snowHolder[i].length; j++)
        {
            context.lineTo(snowHolder[i][j].x, snowHolder[i][j].y);
        }
    }
    context.stroke();
}

function nodeOverlap(node1, node2, buffer) 
{
    if (node1.x >= node2.x - buffer && node1.x <= node2.x + buffer) 
    {
        if(node1.y >= node2.y - buffer && node1.y <= node2.y + buffer) return true;  
    }
    return false;
}

function returnMatch(node1)
{
    for (var i = 0; i < setOfSets.length; i++)
    {
        for (var j = 0; j < setOfSets[i].length; j++)
        {
            if (nodeOverlap(setOfSets[i][j], node1, 3)) return i;
        }
    }
    return -1;
}
    
function getFirst(node, setOfSetsIdx) {
    
    if (nodeOverlap(node, setOfSets[setOfSetsIdx][0], 3)) return 0;
    return -1;
}

function getMiddle(node, setOfSetsIdx) 
{
    setLen = setOfSets[setOfSetsIdx].length;
    for (var i = 1; i < setLen - 1; ++i) {
        if (nodeOverlap(node, setOfSets[setOfSetsIdx][i], 3)) return i;
    }
    return -1;
}

function getLast(node, setOfSetsIdx) 
{
    setLen = setOfSets[setOfSetsIdx].length;
    if (nodeOverlap(node, setOfSets[setOfSetsIdx][setLen - 1], 3)) return setLen - 1;
    return -1;
}

function getStart(event)
{
    var x = event.x - 68;
    var y = event.y - 200;
    var canvas = document.getElementById("otherCanvas");
    var context = canvas.getContext('2d');
    locationX = x;
    locationY = y;
    var setOfOverlay = returnMatch(generateCoord(x, y));
    if (setOfOverlay != -1)
    {
        for (var i = 0; i < setOfSets[setOfOverlay].length; i++)
        {
            if (nodeOverlap(setOfSets[setOfOverlay][i], generateCoord(x, y), 3) == true)
            {
                locationX = setOfSets[setOfOverlay][i].x;
                locationY = setOfSets[setOfOverlay][i].y;
                context.clearRect(locationX - 5, locationY - 5, 11, 11);
                context.beginPath();
                context.strokeStyle = "red";
                context.lineWidth = 3;
                context.arc(locationX, locationY, 3, 0, 2 * Math.PI, false);
                context.stroke();
                break;
            }
        }
    }
    else
    {
        context.beginPath();
        context.lineWidth = 3;
        context.arc(locationX, locationY, 3, 0, 2 * Math.PI, false);
        context.stroke();
    }
    startMatch = -1;
    startMatch = returnMatch(generateCoord(x, y));
}

function getEnd(event)
{
    var x = event.x - 68;
    var y = event.y - 200;
    var canvas = document.getElementById("otherCanvas");
    var context = canvas.getContext('2d');
    context.clearRect(locationX - 5, locationY - 5, 11, 11);
    context.beginPath();
    context.lineWidth = 3;
    context.strokeStyle = "black";
    context.arc(locationX, locationY, 3, 0, 2 * Math.PI, false);
    context.stroke();
    context.closePath();
    context.beginPath();
    context.arc(x, y, 3, 0, 2 * Math.PI, false);
    context.stroke();
    var Ocanvas = document.getElementById('lineCanvas');
    var Ocontext = Ocanvas.getContext('2d');
    Ocontext.beginPath();
    Ocontext.lineWidth = 2;
    Ocontext.strokeStyle = "black";
    Ocontext.moveTo(locationX, locationY);
    Ocontext.lineTo(x, y);
    Ocontext.stroke();
    endMatch = -1;
    endMatch = returnMatch(generateCoord(x, y));
    var result = -1;
    if (startMatch != -1 && endMatch == -1) 
    {
        if ((result = getFirst(generateCoord(locationX, locationY), startMatch)) != -1) 
        {
            console.log('Result: ' + result);
            setOfSets[startMatch].reverse();
            setOfSets[startMatch].push(generateCoord(x,y));
        }
        else if ((result = getLast(generateCoord(locationX, locationY), startMatch)) != -1) 
        {
            console.log('Result: ' + result);
            setOfSets[startMatch].push(generateCoord(x,y));
        }
        else if((result = getMiddle(generateCoord(locationX, locationY), startMatch)) != -1) 
        {
            console.log('Result: ' + result);
            setOfSets.push(generateCoord(generateCoord(locationX, locationY), generateCoord(x, y)));
        }
        else console.log('Result: ' + result);
    }
    else if (endMatch != -1 && startMatch == -1) 
    {
        if ((result = getFirst(generateCoord(x, y), endMatch)) != -1) 
        {
            setOfSets[endMatch].reverse();
            setOfSets[endMatch].push(generateCoord(locationX, locationY));
        }
        else if ((result = getLast(generateCoord(x, y), endMatch)) != -1) setOfSets[endMatch].push(generateCoord(locationX, locationY));
        else if((result = getMiddle(generateCoord(x, y), endMatch)) != -1) setOfSets.push(generateCoord(generateCoord(locationX, locationY), generateCoord(x, y)));
    }
    else if (endMatch != -1 && startMatch != -1)  {
        var result = -1;
        if ( ((result = getFirst(generateCoord(locationX, locationY), startMatch)) != -1) &&
            ((result = getFirst(generateCoord(x, y), endMatch)) != -1) ) 
        {
            if (startMatch == endMatch) return;
            else 
            {
                setOfSets[startMatch].reverse();
                setOfSets[startMatch] = setOfSets[startMatch].concat( setOfSets[endMatch] );
                setOfSets[endMatch] = setOfSets[0];
                setOfSets.shift();
            }
        }
        else if ( ((result = getLast(generateCoord(locationX, locationY), startMatch)) != -1) &&
            ((result = getLast(generateCoord(x, y), endMatch)) != -1) ) 
        {
            if (startMatch == endMatch) return;
            else 
            {
                setOfSets[startMatch].reverse();
                setOfSets[startMatch] = setOfSets[startMatch].concat( setOfSets[endMatch] );
                setOfSets[endMatch] = setOfSets[0];
                setOfSets.shift();
            }
        }
        else if ( ((result = getFirst(generateCoord(locationX, locationY), startMatch)) != -1) &&
            ((result = getLast(generateCoord(x, y), endMatch)) != -1) ) 
        {
            if (startMatch == endMatch) 
            {
                if (setOfSets[startMatch][0] === setOfSets[startMatch][setOfSets[startMatch].length - 1]) return;
                else setOfSets[startMatch].push( setOfSets[startMatch][0] );
            }
            else 
            {
                setOfSets[endMatch] = setOfSets[endMatch].concat( setOfSets[startMatch] );
                setOfSets[startMatch] = setOfSets[0];
                setOfSets.shift();
            }
        }
        else if ( ((result = getLast(generateCoord(locationX, locationY), startMatch)) != -1) &&
            ((result = getFirst(generateCoord(x, y), endMatch)) != -1) ) 
        {
            if (startMatch == endMatch) 
            {
                if (setOfSets[startMatch][0] === setOfSets[startMatch][setOfSets[startMatch].length - 1]) return;
                else setOfSets[startMatch].push( setOfSets[startMatch][0] );    
            }
            else 
            {
                setOfSets[startMatch] = setOfSets[startMatch].concat( setOfSets[endMatch] );
                setOfSets[endMatch] = setOfSets[0];
                setOfSets.shift();
            }
        }
        else if ( ((result = getFirst(generateCoord(locationX, locationY), startMatch)) != -1) &&
            ((result = getMiddle(generateCoord(x, y), endMatch)) != -1) ) 
        {
            if (startMatch == endMatch) setOfSets.push([ generateCoord(locationX, locationY), generateCoord(x, y) ]);
            else 
            {
                setOfSets[startMatch].reverse();
                setOfSets[startMatch] = setOfSets[startMatch].concat( generateCoord(x, y) );
            }
        }
        else if ( ((result = getLast(generateCoord(locationX, locationY), startMatch)) != -1) &&
            ((result = getMiddle(generateCoord(x, y), endMatch)) != -1) ) 
        {
            if (startMatch == endMatch) setOfSets.push([ generateCoord(locationX, locationY), generateCoord(x, y) ]);
            else setOfSets[startMatch] = setOfSets[startMatch].concat( generateCoord(x, y) );
        }
        else if ( ((result = getMiddle(generateCoord(locationX, locationY), startMatch)) != -1) &&
            ((result = getMiddle(generateCoord(x, y), endMatch)) != -1) ) 
        {
            if (startMatch == endMatch) setOfSets.push([ generateCoord(locationX, locationY), generateCoord(x, y) ]);
            else setOfSets.push([ generateCoord(locationX, locationY), generateCoord(x, y) ]);
        }
        else if ( ((result = getMiddle(generateCoord(locationX, locationY), startMatch)) != -1) &&
            ((result = getFirst(generateCoord(x, y), endMatch)) != -1) ) 
        {
            if (startMatch == endMatch) setOfSets.push([ generateCoord(locationX, locationY), generateCoord(x, y) ]);
            else 
            {
                setOfSets[endMatch].reverse();
                setOfSets[endMatch].push( generateCoord(locationX, locationY) );
            }
        }
        else if ( ((result = getMiddle(generateCoord(locationX, locationY), startMatch)) != -1) &&
            ((result = getLast(generateCoord(x, y), endMatch)) != -1) ) 
        {
            if (startMatch == endMatch) setOfSets.push([ generateCoord(locationX, locationY), generateCoord(x, y) ]);
            else setOfSets[endMatch] = setOfSets[endMatch].concat( generateCoord(locationX, locationY) );
        }
    }
    else {
        if(nodeOverlap(generateCoord(locationX, locationY), generateCoord(x, y), 3))
        {
            clearShit = document.getElementById('otherCanvas');
            shitContext = clearShit.getContext('2d');
            shitContext.clearRect(locationX - 5, locationY - 5, 11, 11);
            alert('Please increase distance of line');
        }
        else setOfSets.push([ generateCoord(locationX, locationY), generateCoord(x, y) ]);
    }
}

function generateCoord(one, two)
{
    var newItem = {x: one, y: two};
    return newItem;
}

function firstLine()
{
    coordinates.push(generateCoord(50, 401));
    coordinates.push(generateCoord(1250, 401));
    arrSize += 2;
    drawArray();
}

function nextArray()
{
    if (arrSize < 3000)
    {
        var newArray = [];
        var notEmpty = false;
        var iterator = 0;
        while (iterator < arrSize)
        {
            var firstCoord, secondCoord;
            firstCoord = coordinates[iterator];
            secondCoord = coordinates[iterator + 1];
            var oneThird = generateCoord(firstCoord.x + ((secondCoord.x - firstCoord.x) / 3.0), firstCoord.y + ((secondCoord.y - firstCoord.y) / 3.0));
            var twoThird = generateCoord(firstCoord.x + ((secondCoord.x - firstCoord.x) / (3.0 / 2.0)), firstCoord.y + ((secondCoord.y - firstCoord.y) / (3.0 / 2.0)));
            var newPos = calculateNextPosition(oneThird, twoThird);
            newArray.push(firstCoord);
            newArray.push(oneThird);
            newArray.push(newPos);
            newArray.push(twoThird);
            if (iterator + 2 >= arrSize)
            {
                newArray.push(secondCoord);
                iterator += 2;
            }
            else iterator++;
        }
        coordinates = [];
        coordinates = newArray.slice(0);
        arrSize = coordinates.length;
    }
}

function runFreeFractal()
{
    canvas = document.getElementById('lineCanvas');
    context = canvas.getContext('2d');
    context.clearRect(0, 0, 1300, 700);
    for (var i = 0; i < setOfSets.length; i++)
    {
        globalArrIndex = i;
        nextArrayFractal();
        drawArrayFractal();
    }
}

function nextArrayFractal()
{
    if (setOfSets[globalArrIndex].length < 3000)
    {
        var newArray = [];
        var notEmpty = false;
        var iterator = 0;
        while (iterator < setOfSets[globalArrIndex].length)
        {
            var firstCoord, secondCoord;
            firstCoord = setOfSets[globalArrIndex][iterator];
            secondCoord = setOfSets[globalArrIndex][iterator + 1];
            var oneThird = generateCoord(firstCoord.x + ((secondCoord.x - firstCoord.x) / 3.0), firstCoord.y + ((secondCoord.y - firstCoord.y) / 3.0));
            var twoThird = generateCoord(firstCoord.x + ((secondCoord.x - firstCoord.x) / (3.0 / 2.0)), firstCoord.y + ((secondCoord.y - firstCoord.y) / (3.0 / 2.0)));
            var newPos = calculateNextPosition(oneThird, twoThird);
            newArray.push(firstCoord);
            newArray.push(oneThird);
            newArray.push(newPos);
            newArray.push(twoThird);
            if (iterator + 2 >= setOfSets[globalArrIndex].length)
            {
                newArray.push(secondCoord);
                iterator += 2;
            }
            else iterator++;
        }
        setOfSets[globalArrIndex] = [];
        setOfSets[globalArrIndex] = newArray.slice(0);
    }
}

function calculateNextPosition(first, second)
{
    var baseAngle = findAngle(first, second);
    var shaftAng = shaftAngle(baseAngle);
    var midPoint = generateCoord(((second.x - first.x) / 2) + first.x, first.y - ((first.y - second.y) / 2));
    var dist = Math.sqrt(Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2));
    var shaftLength = Math.sqrt(Math.pow(dist, 2) - Math.pow(dist / 2, 2));
    var xMove = 0;
    var yMove = 0;
    if ((shaftAng > 359.5 && shaftAng < 360) || (shaftAng >=0 && shaftAng < 0.5)) xMove = shaftLength;
	else if (shaftAng > 89.5 && shaftAng < 90.5) yMove = (shaftLength * -1);
	else if (shaftAng > 179.5 && shaftAng < 180.5) xMove = shaftLength * -1;
	else if (shaftAng > 269.5 && shaftAng < 270.5) yMove = shaftLength;
    else
    {
        if (shaftAng > 0 && shaftAng < 90)
		{
			xMove = shaftLength * Math.cos(shaftAng * (3.141592653589793 / 180)); Math.cos
			yMove = (shaftLength * Math.sin(shaftAng * (3.141592653589793 / 180))) * -1;
		}
		else if (shaftAng > 90 && shaftAng < 180)
		{
			shaftAng = 180.0 - shaftAng;
			xMove = (shaftLength * Math.cos(shaftAng * (3.141592653589793 / 180))) * -1;
			yMove = (shaftLength * Math.sin(shaftAng * (3.141592653589793 / 180))) * -1;
		}
		else if (shaftAng > 180 && shaftAng < 270)
		{
			shaftAng = shaftAng - 180.0;
			xMove = (shaftLength * Math.cos(shaftAng * (3.141592653589793 / 180))) * -1;
			yMove = (shaftLength * Math.sin(shaftAng * (3.141592653589793 / 180)));
		}
		else
		{
			shaftAng = 360.0 - shaftAng;
			xMove = shaftLength * Math.cos(shaftAng * (3.141592653589793 / 180));
			yMove = (shaftLength * Math.sin(shaftAng * (3.141592653589793 / 180)));
		}
    }
    var finalCoord = generateCoord(midPoint.x + xMove, midPoint.y + yMove);
    return finalCoord;
}

function findAngle(one, two)
{
    var dist = Math.sqrt(Math.pow(one.x - two.x, 2) + Math.pow(one.y - two.y, 2));
    var xDiff = Math.abs(one.x - two.x);
    var yDiff = Math.abs(one.y - two.y);
    var temp = (Math.pow(dist, 2) + Math.pow(xDiff, 2) - Math.pow(yDiff, 2)) / (2 * dist * xDiff);
    var absAngle = Math.abs(radToDeg(Math.acos(temp)));
    if ((two.x - one.x) > 0 && (one.y - two.y) >= 0) return absAngle;
	else if ((two.x - one.x) <= 0 && (one.y - two.y) > 0) return 180.0 - absAngle;
	else if ((two.x - one.x) < 0 && (one.y - two.y) <= 0) return 180.0 + absAngle;
	else return 360.0 - absAngle;
}

function shaftAngle(baseAngle)
{
    var result = baseAngle + 90;
    if (result > 360) return result - 360;
    return result;
}
    
function radToDeg(rad)
{
    return ((rad * 180.0) / 3.141592653589793);
}

var globalEnd;
    
function drawArray()
{
    if (coordinates.length < 5000)
    {
        canvas = document.getElementById('mainCanvas');
        context = canvas.getContext('2d');
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        if (animIterator == 0)
        {
            context.clearRect(0, 0, 1300, 500);
        }
        context.moveTo(coordinates[animIterator].x, coordinates[animIterator].y);
        context.lineTo(coordinates[animIterator + 1].x, coordinates[animIterator + 1].y);
        context.stroke();
        context.moveTo(coordinates[coordinates.length - (animIterator + 1)].x, coordinates[coordinates.length - (animIterator + 1)].y);
        context.lineTo(coordinates[coordinates.length - (animIterator + 2)].x, coordinates[coordinates.length - (animIterator + 2)].y);
        context.stroke();
        animIterator++;
        if (animIterator <= (coordinates.length - (animIterator + 1))) globalEnd = setTimeout(drawArray, 10);
        else animIterator = 0;
    }
}

function drawArrayFractal()
{
    canvas = document.getElementById('lineCanvas');
    context = canvas.getContext('2d');
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.moveTo(setOfSets[globalArrIndex][0].x, setOfSets[globalArrIndex][0].y);
    for (var i = 1; i < setOfSets[globalArrIndex].length; i++)
    {
        context.lineTo(setOfSets[globalArrIndex][i].x, setOfSets[globalArrIndex][i].y);
    }
    context.stroke();
}   
