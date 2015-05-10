$(function() 
{
    window.onload = function() {
        statementOne = document.getElementById('infoStatementOne');
        statementTwo = document.getElementById('infoStatementTwo');
        statementThree = document.getElementById('infoStatementThree');
        lCanvas = document.getElementById('Lines');
        if (lCanvas != null) lContext = lCanvas.getContext('2d');
    };
    $("#addRandom").click(function() 
    {
        addNodes(20);
        console.log(xPositions.length);
    });
    $("#clearNodes").click(function()
    {
        if (twoOptRunning == 1) clearInterval(loopCheck);
        removeNodes();
        greedyCalled = tspCalled = -1;
        startThrottle = outer = totalRun = upperBound = twoOptRunning = percent = 0;
        improved = inner = 1;
        statementOne.innerHTML = "The greedy algorithm has not been used to initialise.";
        statementTwo.innerHTML = "The program has not been run.";
    });
    $("#2Opt").click(function()
    {
        tspCalled = 0;
        if (numberOfNodes > 0)
        {
            twoOptRunning = 1;
            if (greedyCalled == 0) initialise();
            else
            {
                alert('The algorithm will begin after a slight delay');
                findGreedyPath();
                setTimeout(initialise, 8000);
            }
        }
    });
    $("#3Opt").click(function()
    {
        tspCalled = 1;
        outer = 0;
        inner = 1;
        percent = 0;
        if (numberOfNodes > 0)
        {
            twoOptRunning = 1;
            if (greedyCalled == 0) initialise();
            else
            {
                alert('The algorithm will begin after a slight delay');
                findGreedyPath();
                setTimeout(initialise, 8000);
            }
        }
    });
    $("#startToggle").click(function()
    {
        console.log('here');
        if (startThrottle == 0 && numberOfNodes > 0)
        {
            startThrottle = 1;
            greedyCalled = 0;
            findGreedyPath();
        }
    });
    $("#judge").click(function()
    {
        localStorage["iters"] = JSON.stringify(iterArray);
        localStorage["pathLen"] = JSON.stringify(pathLengthArr);
        console.log(iterArray);
        console.log(JSON.parse(localStorage["iters"]));
        return;
    });
    $("#anal").click(function()
    {
        var storedIter = JSON.parse(localStorage["iters"]);
        var storedPathLen = JSON.parse(localStorage["pathLen"]);
        iterArray = pathLengthArr = [];
        iterArray = storedIter.slice(0);
        pathLengthArr = storedPathLen.slice(0);
        document.getElementById('myChart').style.borderColor = "grey";
        createArrs();
    });
});

var statementOne, statementTwo, statementThree, lCanvas, lContext, loopCheck;
var path = new Array();
var iterArray = new Array();
var pathLengthArr = new Array();
var xPositions = new Array();
var yPositions = new Array();
var startThrottle = 0, prevUpper = 0, iterations = 0, totalRun = 0, outer = 0, numberOfNodes = 0, upperBound = 0, twoOptRunning = 0;
var greedyCalled = -1, tspCalled = -1, improved = 1, inner = 2;

function addNodes(x)
{
    numberOfNodes += x;
    var canvas = document.getElementById('Map');
    var context = canvas.getContext('2d');
    for (var i = 0; i < x; i++)
    {
        context.beginPath();
        context.lineWidth = 3;
        var xPos = parseInt((Math.random() * 1170) + 15);
        var yPos = parseInt((Math.random() * 450) + 25);
        xPositions.push(xPos);
        yPositions.push(yPos);
        context.arc(xPos, yPos, 3, 0, 2 * Math.PI, false);
        context.stroke();
    }
}

function removeNodes()
{
    numberOfNodes = upperBound = 0;
    xPositions = [];
    yPositions = [];
    path = [];
    iterArray = [];
    pathLengthArr = [];
    var canvas = document.getElementById('Map');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, 1200, 500);
    lContext.clearRect(0, 0, 1200, 500);
}

function calcDistance(x, y)
{
    return parseInt(Math.sqrt(Math.pow(xPositions[x] - xPositions[y], 2) + Math.pow(yPositions[x] - yPositions[y], 2)));
}

function createArrs()
{
    var finalIter = [], finalPath = [];
    var end = iterArray.length - 1;
    var removal = Math.floor(end / 21);
    for (var i = 0; i < 21; i++)
    {
        finalIter.push(end - (removal * i));
    }
    finalIter.push(end - (removal * 21));
    finalIter.reverse();
    for (var i = 0; i < finalIter.length; i++)
    {
        finalPath.push(pathLengthArr[finalIter[i]]);
    }
    iterArray = pathLengthArr = [];
    iterArray = finalIter.slice(0);
    pathLengthArr = finalPath.slice(0);
    viewChart();
}

function viewChart()
{
    var ctx = $("#myChart").get(0).getContext("2d");
    var data = {
        labels: iterArray,
        datasets: [
            {
                fillColor: "rgba(207,147,81,0.5)",
                strokeColor: "rgba(207,147,81,1)",
                pointColor: "#fff",
                pointStrokeColor: "#fff",
                data: pathLengthArr
            }
        ]
    }
    var myNewChart = new Chart(ctx).Line(data, {
        bezierCurve: false,
        datasetStrokeWidth: 5});
}

function initialise()
{
    loopCheck = setInterval(optimise, 1);
}

function clearCanvas()
{
    lContext.clearRect(0, 0, 1200, 500);
}

function drawLines()
{
    lContext.beginPath();
    lContext.lineWidth = 2;
    lContext.strokeStyle = "red";
    lContext.moveTo(xPositions[path[0]], yPositions[path[0]]);
    for (var i = 1; i < numberOfNodes; i++)
    {
        lContext.lineTo(xPositions[path[i]], yPositions[path[i]]);
    }
    lContext.lineTo(xPositions[path[0]], yPositions[path[0]]);
    lContext.stroke();
    lContext.font = "20px Verdana";
    lContext.textAlign = "left";
    lContext.fillText(percent + "%", 5, 20);
    lContext.closePath();
    lContext.beginPath();
    lContext.font = "20px Verdana";
    lContext.textAlign = "right";
    lContext.fillText(iterations, 1195, 20);
    lContext.stroke();
    lContext.closePath();
}

function findGreedyPath()
{
    var greedyVisit = [];
    if (greedyCalled == -1)
    {
        for (var i = 0; i < numberOfNodes; i++)
        {
            path.push(i);
            greedyVisit.push(false);
        }
    }
    else
    {
        for (var i = 0; i < numberOfNodes; i++)
        {
            greedyVisit.push(false);
        }
        path = [];
        upperBound = 0;
        greedyVisit[0] = true;
        if (path[0] != 0) path.push(0);
        var lastNode = 0, curMin = -1, minIndex = -1, tempDist;
        for (var i = 1; i < numberOfNodes; i++)
        {
            for (var j = 0; j < numberOfNodes; j++)
            {
                if (greedyVisit[j] == false)
                {
                    tempDist = calcDistance(lastNode, j);
                    if (curMin == -1)
                    {
                        curMin = tempDist;
                        minIndex = j;
                    }
                    else if (tempDist < curMin)
                    {
                        curMin = tempDist;
                        minIndex = j;
                    }
                }
            }
            if (curMin != -1)
            {
                greedyVisit[minIndex] = true;
                lastNode = minIndex;
                path.push(lastNode);
                curMin = minIndex = -1;
            }
        }
    }
    drawGreedyPath();
}

function drawGreedyPath()
{
    lContext.beginPath();
    lContext.lineWidth = 2;
    lContext.strokeStyle = "red";
    upperBound += calcDistance(path[totalRun], path[totalRun + 1]);
    if (greedyCalled != -1) statementOne.innerHTML = "The greedy algorithm provided an upper bound of " + upperBound + ".";
    lContext.moveTo(xPositions[path[totalRun]], yPositions[path[totalRun]]);
    lContext.lineTo(xPositions[path[totalRun + 1]], yPositions[path[totalRun + 1]]);
    totalRun++;
    lContext.stroke();
    if (totalRun < numberOfNodes - 1) window.requestAnimationFrame(drawGreedyPath);
    else
    {
        lContext.lineTo(xPositions[path[0]], yPositions[path[0]]);
        lContext.stroke();
        lContext.closePath();
        upperBound += calcDistance(path[numberOfNodes - 1], path[0]);
        if (greedyCalled != -1) statementOne.innerHTML = "The greedy algorithm provided an upper bound of " + upperBound + ".";
    }
}

function amendPath(tsp)
{
    iterations++;
    var newDist = 0, prev = -1, cur = -1;
    for (var i = 1; i < numberOfNodes; i++)
    {
        if (i >= outer)
        {
            if (i <= inner) cur = inner - (i - outer);
            else cur = i;
        }
        else cur = i;
        if ((i - 1) >= outer)
        {
            if ((i - 1) <= inner) prev = inner - ((i - 1) - outer);
            else prev = i - 1;
        }
        else prev = i - 1;
        newDist += calcDistance(path[prev], path[cur]);
    }
    if (outer == 0) prev = inner;
    else prev = 0;
    if (inner == numberOfNodes - 1) cur = outer;
    else cur = numberOfNodes - 1;
    newDist += calcDistance(path[prev], path[cur]);
    if (newDist < upperBound)
    {
        upperBound = newDist;
        improved = 1;
        var newArr = path.slice(0);
        path = [];
        for (var i = 0; i < numberOfNodes; i++)
        {
            if (i >= outer && i <= inner) path.push(newArr[inner - (i - outer)]);
            else path.push(newArr[i]);
        }
        if (tsp == 0) inner = outer + 2;
        else inner = outer + 1;
        return;
    }
    inner++;
    if (inner >= numberOfNodes)
    {
        outer++;
        if ((outer / numberOfNodes) * 100 > percent) percent = parseInt((outer / numberOfNodes) * 100);
        if (tsp == 0)
        {
            inner = outer + 2;
            if (percent > 90 && upperBound == prevUpper && outer > numberOfNodes / 3)
            {
                lContext.clearRect(0, 0, 100, 25);
                lContext.clearRect(1100, 0, 100, 25);
                lContext.beginPath();
                lContext.font = "20px Verdana";
                lContext.textAlign = "left";
                lContext.fillText("Finalising", 5, 20);
                lContext.stroke();
                lContext.closePath();
                lContext.beginPath();
                lContext.font = "20px Verdana";
                lContext.textAlign = "right";
                lContext.fillText(iterations, 1195, 20);
                lContext.stroke();
                lContext.closePath();
            }
            else
            {
                lContext.clearRect(0, 0, 100, 25);
                lContext.clearRect(1100, 0, 100, 25);
                lContext.beginPath();
                lContext.font = "20px Verdana";
                lContext.textAlign = "left";
                lContext.fillText(percent + "%", 5, 20);
                lContext.stroke();
                lContext.closePath();
                lContext.beginPath();
                lContext.font = "20px Verdana";
                lContext.textAlign = "right";
                lContext.fillText(iterations, 1195, 20);
                lContext.stroke();
                lContext.closePath();
            }
            if (outer >= numberOfNodes - 2)
            {
                if (upperBound == prevUpper)
                {
                    statementTwo.innerHTML = "The approximation algorithm has finished running. It provided a path of " + upperBound + ".";
                    lContext.clearRect(0, 0, 100, 25);
                    lContext.clearRect(1100, 0, 100, 25);
                    clearInterval(loopCheck);
                    twoOptRunning = 0;
                    alert('The algorithm finished running.');
                }
                else prevUpper = upperBound;
                outer = 0;
                inner = 2;
            }
        }
        else
        {
            inner = outer + 1;
            if (percent > 90 && upperBound == prevUpper && outer > numberOfNodes / 3)
            {
                lContext.clearRect(0, 0, 100, 25);
                lContext.clearRect(1100, 0, 100, 25);
                lContext.beginPath();
                lContext.font = "20px Verdana";
                lContext.textAlign = "left";
                lContext.fillText("Finalising", 5, 20);
                lContext.stroke();
                lContext.closePath();
                lContext.beginPath();
                lContext.font = "20px Verdana";
                lContext.textAlign = "right";
                lContext.fillText(iterations, 1195, 20);
                lContext.stroke();
                lContext.closePath();
            }
            else
            {
                lContext.clearRect(0, 0, 100, 25);
                lContext.clearRect(1100, 0, 100, 25);
                lContext.beginPath();
                lContext.font = "20px Verdana";
                lContext.textAlign = "left";
                lContext.fillText(percent + "%", 5, 20);
                lContext.stroke();
                lContext.closePath();
                lContext.beginPath();
                lContext.font = "20px Verdana";
                lContext.textAlign = "right";
                lContext.fillText(iterations, 1195, 20);
                lContext.stroke();
                lContext.closePath();
            }
            if (outer >= numberOfNodes - 1)
            {
                if (upperBound == prevUpper)
                {
                    statementThree.innerHTML = "The solution has been found. It has a path of " + upperBound + ".";
                    lContext.clearRect(0, 0, 100, 25);
                    lContext.clearRect(1100, 0, 100, 25);
                    clearInterval(loopCheck);
                    twoOptRunning = 0;
                    alert('The algorithm finished running.');
                }
                else prevUpper = upperBound;
                outer = 0;
                inner = 1;
            }
        }
    }
}

var percent = 0;

function optimise()
{
    if (tspCalled == 0) statementTwo.innerHTML = "The approximation algorithm is running and has a current path of " + upperBound + ".";
    else if (tspCalled == 1) statementThree.innerHTML = "The final solution algorithm is running and has a current path of " + upperBound + ".";
    iterArray.push(iterations);
    pathLengthArr.push(upperBound);
    if (improved == 1)
    {
        clearCanvas();
        drawLines();
        improved = 0;
    }
    amendPath(tspCalled);
}
