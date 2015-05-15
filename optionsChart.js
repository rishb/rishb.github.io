var myNewChart;
var actualData = [];
var xAxis = [];
var labelArr = [];
var arraySize;
var stepWidth;
var startVal;
var bezier = false;

$(function() 
{
    window.onload = function() {
        document.getElementById('riskfree').style.display = 'none';
        document.getElementById('vol').style.display = 'none';
        document.getElementById('time').style.display = 'none';
        document.getElementById('divYield').style.display = 'none';
        var ctx = $("#myChart").get(0).getContext("2d");
        var data = {
            labels: [95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105],
            datasets: [
                {
                    fillColor: "rgba(220,220,220,0)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    strokeWidth: 10,
                    data: [-1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4]
                },
                {
                    fillColor: "rgba(220,220,220,0)",
                    strokeColor: "rgba(0,0,0,1)",
                    strokeWidth: 4,
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                {
                    fillColor: "rgba(220,220,220,0)",
                    strokeColor: "rgba(0,0,0,0)",
                    strokeWidth: 4,
                    data: [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3]
                }
            ]
        }
        myNewChart = new Chart(ctx).Line(data, {
            bezierCurve: false,
            pointDot: false,
            scaleFontColor: "#000",
            scaleShowHorizontalLines: true
        });
    };
    $("#submit").click(function() 
    {
        var instrumentType = document.getElementById('instrumentType').value;
        var buyOrSell = document.getElementById('buyOrSell').value;
        var dataType = document.getElementById('dataType').value;
        var strike = document.getElementById('strike').value;
        var price = document.getElementById('price').value;
        if (strike.length < 1) alert('No strike price entered.');
        else if (price.length < 1) alert('No option price entered.');
        else
        {
            var temp = Math.ceil(strike);
            if (temp != strike) return;
            temp = Math.ceil(price);
            if (temp != price) return;

            //Plain Call
            actualData = [];
            xAxis = [];
            labelArr = [];
            if (instrumentType == 'call')
            {
                if (dataType == 'payout')
                {
                    arraySize = Number(price) + 15;
                    stepWidth = Math.ceil(arraySize / 20);
                    startVal = Number(strike);
                    for (var i = 0; i < arraySize; i = i + stepWidth)
                    {
                        labelArr.push(strike - (stepWidth * 4) + i);
                        xAxis.push(0);
                        if (buyOrSell == 'buy')
                        {
                            if (strike - (stepWidth * 4) + i <= strike) actualData.push(price * -1);
                            else actualData.push((strike - (stepWidth * 4) + i) - strike + (price * -1));
                        }
                        else
                        {
                            if (strike - (stepWidth * 4) + i <= strike) actualData.push(price);
                            else actualData.push(((strike - (stepWidth * 4) + i) - strike + (price * -1)) * -1);
                            if (((strike - (stepWidth * 4) + i) - strike + (price * -1)) * -1 < startVal)
                            {
                                startVal = ((strike - (stepWidth * 4) + i) - strike + (price * -1)) * -1;
                            }
                        }
                    }
                    startVal -= 3;
                    arraySize = arraySize / stepWidth;
                    bezier = false;
                    if (buyOrSell == 'buy') startVal = (Number(price) * -1) - 3;
                }
                else
                {
                    var riskFree = document.getElementById('riskfree').value;
                    var volatility = document.getElementById('vol').value;
                    var divYield = document.getElementById('divYield').value;
                    var time = document.getElementById('time').value;

                    if (riskFree.length < 1) alert('No strike price entered.');
                    else if (volatility.length < 1) alert('No option price entered.');
                    else if (divYield.length < 1) alert('No option price entered.');
                    else if (time.length < 1) alert('No option price entered.');
                    else
                    {
                        var temp = Math.ceil(riskFree);
                        if (temp != riskFree) return;
                        temp = Math.ceil(volatility);
                        if (temp != volatility) return;
                        temp = Math.ceil(divYield);
                        if (temp != divYield) return;
                        temp = Math.ceil(time);
                        if (temp != time) return;

                        if (dataType == 'delta')
                        {
                            for (var i = Number(strike) - 15; i < Number(strike) + Number(price) + 15; i++)
                            {
                                var d1 = calcD1(i, strike, time, riskFree, divYield, volatility);
                                var callDelta = (Math.pow(Math.E, (Number(divYield) / 100) * (Number(time) / 365) * -1)) * normalcdf(0, 1, d1);
                                
                                labelArr.push(i);
                                xAxis.push(0);
                                if (buyOrSell == 'buy') actualData.push(callDelta);
                                else actualData.push(callDelta * -1);
                            }
                            arraySize = 10;
                            stepWidth = 0.1;
                            if (buyOrSell == 'buy') startVal = 0;
                            else startVal = -1;
                            bezier = true;
                        }
                        else if (dataType == 'gamma')
                        {
                            for (var i = Number(strike) - 15; i < Number(strike) + Number(price) + 15; i++)
                            {
                                var d1 = calcD1(i, strike, time, riskFree, divYield, volatility);
                                var gamma = calcGamma(divYield, time, volatility, d1, i);
                                
                                labelArr.push(i);
                                xAxis.push(0);
                                if (buyOrSell == 'buy') actualData.push(gamma);
                                else actualData.push(gamma * -1);
                            }
                            arraySize = 10;
                            stepWidth = 0.1;
                            if (buyOrSell == 'buy') startVal = 0;
                            else startVal = -1;
                            bezier = true;
                        }
                        else if (dataType == 'vega')
                        {
                            for (var i = Number(strike) - 15; i < Number(strike) + Number(price) + 15; i++)
                            {
                                var d1 = calcD1(i, strike, time, riskFree, divYield, volatility);
                                var vega = calcVega(i, divYield, time, d1);
                                
                                labelArr.push(i);
                                xAxis.push(0);
                                if (buyOrSell == 'buy') actualData.push(vega);
                                else actualData.push(vega * -1);
                            }
                            arraySize = 10;
                            stepWidth = 0.1;
                            if (buyOrSell == 'buy') startVal = 0;
                            else startVal = -1;
                            bezier = true;
                        }
                        else if (dataType == 'theta')
                        {
                            var min = 0;
                            for (var i = Number(strike) - 15; i < Number(strike) + Number(price) + 15; i++)
                            {
                                var d1 = calcD1(i, strike, time, riskFree, divYield, volatility);
                                var d2 = calcD2(d1, volatility, time);
                                var theta = ((1 / Number(time)) * ((-1 * (((i * (Number(volatility) / 100) * (Math.pow(Math.E, (Number(divYield) / 100) * (Number(time) / 365) * -1))) / (2 * Math.sqrt(Number(time) / 365)))
                                    * (1 / Math.sqrt(2 * Math.PI)) * (Math.pow(Math.E, (Math.pow(d1, 2) / -2))))) 
                                    - ((Number(riskFree) / 100) * Number(strike) * Math.pow(Math.E, (Number(riskFree) / 100) * (Number(time) / 365) * -1) * normalcdf(0, 1, d2))
                                    + ((Number(riskFree) / 100) * i * Math.pow(Math.E, (Number(riskFree) / 100) * (Number(time) / 365) * -1) * normalcdf(0, 1, d1))));

                                if (theta < min) min = theta;
                                
                                labelArr.push(i);
                                xAxis.push(0);
                                if (buyOrSell == 'buy')
                                {
                                    if (theta < 0) actualData.push(theta);
                                    else actualData.push(0);
                                }
                                else
                                {
                                    if (theta * -1 > 0) actualData.push(theta * -1);
                                    else actualData.push(0);
                                }
                            }
                            arraySize = 20; 
                            stepWidth = Math.ceil(((min - 0.1) * -100) / 20) * 0.01;
                            if (buyOrSell == 'buy') startVal = min - 0.1;
                            else startVal = 0;
                            bezier = true;
                        }
                    }
                }
            }
            //Plain Put
            else if (instrumentType == 'put')
            {
                if (dataType == 'payout')
                {
                    arraySize = Number(price) + 15;
                    stepWidth = Math.ceil(arraySize / 20);
                    startVal = Number(strike);
                    for (var i = 0; i < arraySize; i = i + stepWidth)
                    {
                        labelArr.push(strike - (stepWidth * 8) + i);
                        xAxis.push(0);
                        if (buyOrSell == 'buy')
                        {
                            if (strike - (stepWidth * 8) + i < strike) actualData.push((strike - (strike - (stepWidth * 8) + i)) - Number(price));
                            else actualData.push(price * -1);
                        }
                        else
                        {
                            if (strike - (stepWidth * 8) + i < strike) actualData.push(((strike - (strike - (stepWidth * 8) + i)) - Number(price)) * -1);
                            else actualData.push(price);
                            if (((strike - (strike - (stepWidth * 8) + i)) - Number(price)) * -1 < startVal)
                            {
                                startVal = ((strike - (strike - (stepWidth * 8) + i)) - Number(price)) * -1;
                            }
                        }
                    }
                    startVal -= 3;
                    arraySize = arraySize / stepWidth;
                    bezier = false;
                    if (buyOrSell == 'buy') startVal = (Number(price) * -1) - 3;
                }
                else
                {
                    var riskFree = document.getElementById('riskfree').value;
                    var volatility = document.getElementById('vol').value;
                    var divYield = document.getElementById('divYield').value;
                    var time = document.getElementById('time').value;

                    if (riskFree.length < 1) alert('No strike price entered.');
                    else if (volatility.length < 1) alert('No option price entered.');
                    else if (divYield.length < 1) alert('No option price entered.');
                    else if (time.length < 1) alert('No option price entered.');
                    else
                    {
                        var temp = Math.ceil(riskFree);
                        if (temp != riskFree) return;
                        temp = Math.ceil(volatility);
                        if (temp != volatility) return;
                        temp = Math.ceil(divYield);
                        if (temp != divYield) return;
                        temp = Math.ceil(time);
                        if (temp != time) return;

                        if (dataType == 'delta')
                        {
                            for (var i = Number(strike) - 15; i < Number(strike) + Number(price) + 15; i++)
                            {
                                var d1 = calcD1(i, strike, time, riskFree, divYield, volatility);
                                var callDelta = (Math.pow(Math.E, (Number(divYield) / 100) * (Number(time) / 365) * -1)) * (normalcdf(0, 1, d1) - 1);
                                
                                labelArr.push(i);
                                xAxis.push(0);
                                if (buyOrSell == 'buy') actualData.push(callDelta);
                                else actualData.push(callDelta * -1);
                            }
                            arraySize = 10;
                            stepWidth = 0.1;
                            if (buyOrSell == 'buy') startVal = -1;
                            else startVal = 0;
                            bezier = true;
                        }
                        else if (dataType == 'gamma')
                        {
                            for (var i = Number(strike) - 15; i < Number(strike) + Number(price) + 15; i++)
                            {
                                var d1 = calcD1(i, strike, time, riskFree, divYield, volatility);
                                var gamma = calcGamma(divYield, time, volatility, d1, i);
                                
                                labelArr.push(i);
                                xAxis.push(0);
                                if (buyOrSell == 'buy') actualData.push(gamma);
                                else actualData.push(gamma * -1);
                            }
                            arraySize = 10;
                            stepWidth = 0.1;
                            if (buyOrSell == 'buy') startVal = 0;
                            else startVal = -1;
                            bezier = true;
                        }
                        else if (dataType == 'vega')
                        {
                            for (var i = Number(strike) - 15; i < Number(strike) + Number(price) + 15; i++)
                            {
                                var d1 = calcD1(i, strike, time, riskFree, divYield, volatility);
                                var vega = calcVega(i, divYield, time, d1);
                                
                                labelArr.push(i);
                                xAxis.push(0);
                                if (buyOrSell == 'buy') actualData.push(vega);
                                else actualData.push(vega * -1);
                            }
                            arraySize = 10;
                            stepWidth = 0.1;
                            if (buyOrSell == 'buy') startVal = 0;
                            else startVal = -1;
                            bezier = true;
                        }
                        else if (dataType == 'theta')
                        {
                            var min = 0;
                            for (var i = Number(strike) - 15; i < Number(strike) + Number(price) + 15; i++)
                            {
                                var d1 = calcD1(i, strike, time, riskFree, divYield, volatility);
                                var d2 = calcD2(d1, volatility, time);
                                var theta = ((1 / Number(time)) * ((-1 * (((i * (Number(volatility) / 100) * (Math.pow(Math.E, (Number(divYield) / 100) * (Number(time) / 365) * -1))) / (2 * Math.sqrt(Number(time) / 365)))
                                    * (1 / Math.sqrt(2 * Math.PI)) * (Math.pow(Math.E, (Math.pow(d1, 2) / -2))))) 
                                    + ((Number(riskFree) / 100) * Number(strike) * Math.pow(Math.E, (Number(riskFree) / 100) * (Number(time) / 365) * -1) * normalcdf(0, 1, d2 * -1))
                                    - ((Number(riskFree) / 100) * i * Math.pow(Math.E, (Number(riskFree) / 100) * (Number(time) / 365) * -1) * normalcdf(0, 1, d1 * -1))));

                                if (theta < min) min = theta;
                                
                                labelArr.push(i);
                                xAxis.push(0);
                                if (buyOrSell == 'buy')
                                {
                                    if (theta < 0) actualData.push(theta);
                                    else actualData.push(0);
                                }
                                else
                                {
                                    if (theta * -1 > 0) actualData.push(theta * -1);
                                    else actualData.push(0);
                                }
                            }
                            arraySize = 20; 
                            stepWidth = Math.ceil(((min - 0.1) * -100) / 20) * 0.01;
                            if (buyOrSell == 'buy') startVal = min - 0.1;
                            else startVal = 0;
                            bezier = true;
                        }
                    }
                }
            }
            drawChart();
        }
    });
});

function drawChart()
{
    myNewChart.destroy();
    var ctx = $("#myChart").get(0).getContext("2d");
    var data = {
        labels: labelArr,
        datasets: [
            {
                fillColor: "rgba(220,220,220,0)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                strokeWidth: 10,
                data: actualData
            },
            {
                fillColor: "rgba(220,220,220,0)",
                strokeColor: "rgba(0,0,0,1)",
                strokeWidth: 4,
                data: xAxis
            }
        ]
    }
    myNewChart = new Chart(ctx).Line(data, {
        bezierCurve: bezier,
        pointDot: false,
        scaleFontColor: "#000",
        scaleShowHorizontalLines: true,
        scaleOverride: true,
        scaleSteps: arraySize,
        scaleStepWidth: stepWidth,
        scaleStartValue: startVal
    });
}

function dataChange()
{
    var dataType = document.getElementById('dataType').value;
    if (dataType != 'payout')
    {
        document.getElementById('riskfree').style.display = 'inline';
        document.getElementById('vol').style.display = 'inline';
        document.getElementById('time').style.display = 'inline';
        document.getElementById('divYield').style.display = 'inline';
    }
    else
    {
        document.getElementById('riskfree').style.display = 'none';
        document.getElementById('vol').style.display = 'none';
        document.getElementById('time').style.display = 'none';
        document.getElementById('divYield').style.display = 'none';
    }
}

function normalcdf(mean, sigma, to) 
{
    var z = (to-mean)/Math.sqrt(2*sigma*sigma);
    var t = 1/(1+0.3275911*Math.abs(z));
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var erf = 1-(((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-z*z);
    var sign = 1;
    if(z < 0)
    {
        sign = -1;
    }
    return (1/2)*(1+sign*erf);
}

function calcD1(i, strike, time, riskFree, divYield, volatility)
{
    return (Math.log(i / Number(strike)) + 
                ((Number(time) / 365) * 
                    ((Number(riskFree) - Number(divYield)) / 100) + (Math.pow((Number(volatility) / 100), 2) / 2))) / ((Number(volatility) / 100) * Math.sqrt((Number(time) / 365)));
}

function calcD2(d1, volatility, time)
{
    return d1 - ((Number(volatility) / 100) * Math.sqrt(Number(time) / 365));
}

function calcGamma(divYield, time, volatility, d1, i)
{
    return (Math.pow(Math.E, (Number(divYield) / 100) * (Number(time) / 365) * -1) / (i * (Number(volatility) / 100) * Math.sqrt(Number(time) / 365))) * (1 / Math.sqrt(2 * Math.PI)) * (Math.pow(Math.E, (Math.pow(d1, 2) / -2)));
}

function calcVega(i, divYield, time, d1)
{
    return ((1 / 100) * i * Math.pow(Math.E, (Number(divYield) / 100) * (Number(time) / 365) * -1)) * (1 / Math.sqrt(2 * Math.PI)) * (Math.pow(Math.E, (Math.pow(d1, 2) / -2)));
}


