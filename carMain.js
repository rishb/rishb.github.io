var totalNumber = 0
var curPage = 1
var maxPage = 0
var year = new Array()
var brand = new Array()
var model = new Array()
var price = new Array()
var images = new Array()
var URL = new Array()
var imgLoc = new Array()
var everyBrand, selectedBrand, selectedYear, selectedPrice
var origBrand, origPrice, origYear

var imageOneEnd

$(function() {
    window.onload = function () {
        Parse.initialize("4eC0JG6MChmwMJHrR5oupTtuhUEQcB9bdXMEEuaB", "nAe2JseluNyxynK4qS6x0IHDETh5hCMvCVU1Cr6a");
        var cars = Parse.Object.extend("Cars");
        var query = new Parse.Query(cars);
        selectedBrand = -1;
        selectedYear = -1;
        selectedPrice = -1;
        origBrand = document.getElementById("brandToggle").textContent;
        origYear = document.getElementById("yearToggle").textContent;
        origPrice = document.getElementById("priceToggle").textContent;
        query.count({
            success: function(number) {
                for (var i = 0; i < 20; i++)
                {
                    imgLoc.push(-1);
                }
                totalNumber = number;
                getData();
            },
            error: function() {
                console.log('There was an error.');
            }
        });
        var allBrands = Parse.Object.extend("AllBrands");
        var brandQuery = new Parse.Query(allBrands);
        brandQuery.find({
            success: function(results) {
                everyBrand = results[0].get("brands");
                everyBrand.sort();
//                <li><a href="#">BMW</a></li>
                var brandsMenu = document.getElementById('brandsMenu');
                for (var i = 0; i < everyBrand.length; i++)
                {
                    var tempCounter = i + 1;
                    var stringCount = tempCounter.toString();
                    document.getElementById(stringCount).textContent = everyBrand[i];
                }
                if (everyBrand.length < 60)
                {
                    for (var i = everyBrand.length; i < 60; i++)
                    {
                        var tempCounter = i + 1;
                        var stringCount = tempCounter.toString();
                        document.getElementById(stringCount).style.display = 'none';
                    }
                }
            },
            error: function() {
                console.log('There was an error.');
            }
        });       
    };
    $(".dropdown-menu li a").click(function(){
      $(this).parents(".btn-group").find('.btn').html(
      $(this).text()+" <span class=\"caret\"></span>"
      );
    });
    $("#filterBtn").click(function() {
        if (document.getElementById("brandToggle").textContent != origBrand)
        {
            selectedBrand = document.getElementById("brandToggle").textContent;
            selectedBrand = selectedBrand.substring(0, selectedBrand.length - 1);
        }
        if (document.getElementById("yearToggle").textContent != origYear)
        {
            selectedYear = document.getElementById("yearToggle").textContent;
        }
        if (document.getElementById("priceToggle").textContent != origPrice)
        {
            selectedPrice = document.getElementById("priceToggle").textContent;
        }
        curPage = 1;
        document.getElementById("but2").setAttribute("class", "");
        document.getElementById("but3").setAttribute("class", "");
        document.getElementById("but4").setAttribute("class", "");
        document.getElementById("but5").setAttribute("class", "");
        document.getElementById("but1").setAttribute("class", "active");
        document.getElementById("prevButton").setAttribute("class", "disabled");
        document.getElementById("nextButton").setAttribute("class", "");
        document.getElementById("anch1").textContent = 1;
        document.getElementById("anch2").textContent = 2;
        document.getElementById("anch3").textContent = 3;
        document.getElementById("anch4").textContent = 4;
        document.getElementById("anch5").textContent = 5;
        getData();
    });
    $("#resetBtn").click(function() {
        location.reload();
    });
    $("#nextButton").click(function() {
        nextButtonClicked();
        getData();
    });
    $("#prevButton").click(function() {
        prevButtonClicked();
        getData();
    });
    $("#but1").click(function() {
        curPage = parseInt(document.getElementById("anch1").textContent);
        document.getElementById("but2").setAttribute("class", "");
        document.getElementById("but3").setAttribute("class", "");
        document.getElementById("but4").setAttribute("class", "");
        document.getElementById("but5").setAttribute("class", "");
        document.getElementById("but1").setAttribute("class", "active");
        document.getElementById("prevButton").setAttribute("class", "");
        document.getElementById("nextButton").setAttribute("class", "");
        if (curPage == 1)
        {
            document.getElementById("prevButton").setAttribute("class", "disabled");
        } 
        if (curPage == maxPage)
        {
            document.getElementById("nextButton").setAttribute("class", "disabled");
        }
        getData();
    });
    $("#but2").click(function() {
        curPage = parseInt(document.getElementById("anch2").textContent);
        document.getElementById("but1").setAttribute("class", "");
        document.getElementById("but3").setAttribute("class", "");
        document.getElementById("but4").setAttribute("class", "");
        document.getElementById("but5").setAttribute("class", "");
        document.getElementById("but2").setAttribute("class", "active");
        document.getElementById("prevButton").setAttribute("class", "");
        document.getElementById("nextButton").setAttribute("class", "");
        if (curPage == 1)
        {
            document.getElementById("prevButton").setAttribute("class", "disabled");
        } 
        if (curPage == maxPage)
        {
            document.getElementById("nextButton").setAttribute("class", "disabled");
        }
        getData();
    });
    $("#but3").click(function() {
        curPage = parseInt(document.getElementById("anch3").textContent);
        document.getElementById("but2").setAttribute("class", "");
        document.getElementById("but1").setAttribute("class", "");
        document.getElementById("but4").setAttribute("class", "");
        document.getElementById("but5").setAttribute("class", "");
        document.getElementById("but3").setAttribute("class", "active");
        document.getElementById("prevButton").setAttribute("class", "");
        document.getElementById("nextButton").setAttribute("class", "");
        if (curPage == 1)
        {
            document.getElementById("prevButton").setAttribute("class", "disabled");
        } 
        if (curPage == maxPage)
        {
            document.getElementById("nextButton").setAttribute("class", "disabled");
        }
        getData();
    });
    $("#but4").click(function() {
        curPage = parseInt(document.getElementById("anch4").textContent);
        document.getElementById("but2").setAttribute("class", "");
        document.getElementById("but3").setAttribute("class", "");
        document.getElementById("but1").setAttribute("class", "");
        document.getElementById("but5").setAttribute("class", "");
        document.getElementById("but4").setAttribute("class", "active");
        document.getElementById("prevButton").setAttribute("class", "");
        document.getElementById("nextButton").setAttribute("class", "");
        if (curPage == 1)
        {
            document.getElementById("prevButton").setAttribute("class", "disabled");
        } 
        if (curPage == maxPage)
        {
            document.getElementById("nextButton").setAttribute("class", "disabled");
        }
        getData();
    });
    $("#but5").click(function() {
        curPage = parseInt(document.getElementById("anch5").textContent);
        document.getElementById("but2").setAttribute("class", "");
        document.getElementById("but3").setAttribute("class", "");
        document.getElementById("but4").setAttribute("class", "");
        document.getElementById("but1").setAttribute("class", "");
        document.getElementById("but5").setAttribute("class", "active");
        document.getElementById("prevButton").setAttribute("class", "");
        document.getElementById("nextButton").setAttribute("class", "");
        if (curPage == 1)
        {
            document.getElementById("prevButton").setAttribute("class", "disabled");
        } 
        if (curPage == maxPage)
        {
            document.getElementById("nextButton").setAttribute("class", "disabled");
        }
        getData();
    });
    $("#right1").click(function() {
        var current = 0;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img1");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left1").click(function() {
        var current = 0;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img1");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right2").click(function() {
        var current = 1;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img2");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left2").click(function() {
        var current = 1;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img2");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right3").click(function() {
        var current = 2;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img3");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left3").click(function() {
        var current = 2;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img3");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right4").click(function() {
        var current = 3;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img4");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left4").click(function() {
        var current = 3;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img4");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right5").click(function() {
        var current = 4;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img5");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left5").click(function() {
        var current = 4;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img5");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right6").click(function() {
        var current = 5;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img6");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left6").click(function() {
        var current = 5;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img6");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right7").click(function() {
        var current = 6;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img7");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left7").click(function() {
        var current = 6;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img7");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right8").click(function() {
        var current = 7;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img8");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left8").click(function() {
        var current = 7;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img8");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right9").click(function() {
        var current = 8;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img9");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left9").click(function() {
        var current = 8;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img9");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right10").click(function() {
        var current = 9;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img10");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left10").click(function() {
        var current = 9;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img10");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right11").click(function() {
        var current = 10;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img11");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left11").click(function() {
        var current = 10;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img11");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right12").click(function() {
        var current = 11;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img12");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left12").click(function() {
        var current = 11;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img12");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right13").click(function() {
        var current = 12;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img13");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left13").click(function() {
        var current = 12;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img13");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right14").click(function() {
        var current = 13;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img14");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left14").click(function() {
        var current = 13;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img14");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right15").click(function() {
        var current = 14;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img15");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left15").click(function() {
        var current = 14;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img15");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right16").click(function() {
        var current = 15;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img16");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left16").click(function() {
        var current = 15;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img16");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right17").click(function() {
        var current = 16;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img17");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left17").click(function() {
        var current = 16;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img17");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right18").click(function() {
        var current = 17;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img18");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left18").click(function() {
        var current = 17;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img18");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right19").click(function() {
        var current = 18;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img19");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left19").click(function() {
        var current = 18;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img19");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#right20").click(function() {
        var current = 19;
        imgLoc[current] = imgLoc[current] + 1;
        if (imgLoc[current] >= images[current].length)
        {
            imgLoc[current] = 0;
        }
        var image = document.getElementById("img20");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
    $("#left20").click(function() {
        var current = 19;
        imgLoc[current] = imgLoc[current] - 1;
        if (imgLoc[current] < 0)
        {
            imgLoc[current] = images[current].length - 1;
        }
        var image = document.getElementById("img20");
        image.setAttribute("src", images[current][imgLoc[current]]);
    });
});

function getData()
{
    year = [];
    brand = [];
    model = [];
    price = [];
    images = [];
    URL = [];
    var cars = Parse.Object.extend("Cars");
    var query = new Parse.Query(cars);
    var conditionQuery = new Parse.Query(cars);
    if (selectedYear != -1 || selectedBrand != -1 || selectedPrice != -1)
    {
        console.log('There is a condition');
        if (selectedYear != -1)
        {
            var theYear = ""
            if (selectedYear[0] == '2')
            {
                var theYear = "";
                for (var i = 0; i < 4; i++)
                {
                    theYear = theYear + selectedYear[i];
                }
                theYear = parseInt(theYear);
                theYear = theYear - 1;
                conditionQuery.greaterThan("year", theYear);
            }
            else
            {
                conditionQuery.lessThan("year", 2006);
            }
        }
        if (selectedBrand != -1)
        {
            conditionQuery.equalTo("brand", selectedBrand);
        }
        if (selectedPrice != -1)
        {
            if (selectedPrice[0] == 'L')
            {
                conditionQuery.lessThan("price", 100000);
            }
            else if (selectedPrice[1] == '1' && selectedPrice[2] != ',')
            {
                conditionQuery.greaterThan("price", 99999);
                conditionQuery.lessThan("price", 200000);
            }
            else if (selectedPrice[1] == '1' && selectedPrice[2] == ',' && selectedPrice[3] == '0')
            {
                conditionQuery.greaterThan("price", 999999);
                conditionQuery.lessThan("price", 1500000);
            }
            else if (selectedPrice[1] == '1' && selectedPrice[2] == ',' && selectedPrice[3] == '5')
            {
                conditionQuery.greaterThan("price", 1499999);
                conditionQuery.lessThan("price", 2000000);
            }
            else if (selectedPrice[1] == '2' && selectedPrice[2] != ',')
            {
                conditionQuery.greaterThan("price", 199999);
                conditionQuery.lessThan("price", 300000);
            }
            else if (selectedPrice[1] == '2' && selectedPrice[2] == ',')
            {
                conditionQuery.greaterThan("price", 1999999);
            }
            else if (selectedPrice[1] == '3')
            {
                conditionQuery.greaterThan("price", 299999);
                conditionQuery.lessThan("price", 400000);
            }
            else if (selectedPrice[1] == '4')
            {
                conditionQuery.greaterThan("price", 399999);
                conditionQuery.lessThan("price", 500000);
            }
            else if (selectedPrice[1] == '5')
            {
                conditionQuery.greaterThan("price", 499999);
                conditionQuery.lessThan("price", 750000);
            }
            else if (selectedPrice[1] == '7')
            {
                conditionQuery.greaterThan("price", 749999);
                conditionQuery.lessThan("price", 1000000);
            }
        }
        conditionQuery.count({
            success: function(number) {
                totalNumber = number;
                var startVal = ((curPage - 1) * 20) + 1;
                var endVal = curPage * 20;
                var textValue = "Results " + startVal.toString() + "-" + endVal.toString() + " of " + totalNumber.toString() + ".";
                document.getElementById("mainDescrip").textContent = textValue;
                maxPage = Math.ceil(totalNumber / 20);
                if (totalNumber < 20 && curPage == 1)
                {
                    document.getElementById("navigator").style.display = 'none';
                }
                else if (totalNumber < 40)
                {
                    document.getElementById("but3").style.display = "none";
                    document.getElementById("but4").style.display = "none";
                    document.getElementById("but5").style.display = "none";
                }
                else if (totalNumber < 60)
                {
                    document.getElementById("but4").style.display = "none";
                    document.getElementById("but5").style.display = "none";
                }
                else if (totalNumber < 80)
                {
                    document.getElementById("but5").style.display = "none";
                }
                else if (totalNumber > 80 && curPage == 1)
                {
                    document.getElementById("but3").style.display = "inline";
                    document.getElementById("but4").style.display = "inline";
                    document.getElementById("but5").style.display = "inline";
                }
            },
            error: function() {
                console.log('There was an error.');
            }
        });
        var skipNum = (curPage - 1) * 20;
        conditionQuery.descending("arrLen")
        conditionQuery.limit(20)
        conditionQuery.skip(skipNum)
        conditionQuery.find({
            success: function(results) {
                for (var i = 0; i < results.length; i++)
                {
                    var brandName = results[i].get("brand");
                    var modelName = results[i].get("model");
                    var serverPrices = results[i].get("price");
                    var years = results[i].get("year");
                    var im = results[i].get("images");
                    var origLink = results[i].get("link");
                    var tempprices = serverPrices.toString();
                    var prices = ''
                    var commaCounter = 0
                    for (var j = tempprices.length - 1; j >= 0; j--)
                    {
                        prices = tempprices[j] + prices;
                        commaCounter = commaCounter + 1;
                        if (commaCounter % 3 == 0 && j != 0)
                        {
                            prices = ',' + prices;
                        }
                    }
                    prices = '$' + prices
                    year.push(years);
                    brand.push(brandName);
                    model.push(modelName);
                    price.push(prices);
                    images.push(im);
                    URL.push(origLink);
                }
                generateCars();
            },
            error: function() {
                console.log('Error');
            }
        });    
        console.log(selectedYear);
        console.log(selectedBrand);
        console.log(selectedPrice);
    }
    else
    {
        query.count({
            success: function(number) {
                totalNumber = number;
                var startVal = ((curPage - 1) * 20) + 1;
                var endVal = curPage * 20;
                var textValue = "Results " + startVal.toString() + "-" + endVal.toString() + " of " + totalNumber.toString() + ".";
                document.getElementById("mainDescrip").textContent = textValue;
            },
            error: function() {
                console.log('There was an error.');
            }
        });
        for (var i = 0; i < 20; i++)
        {
            imgLoc[i] = -1;
        }
        if (totalNumber < 20 && curPage == 1)
        {
            maxPage = Math.ceil(totalNumber / 20);
            document.getElementById("navigator").style.display = 'none';
        }
        else if (curPage == 1)
        {
            maxPage = Math.ceil(totalNumber / 20);
            document.getElementById("but1").setAttribute("class", "active");
            document.getElementById("prevButton").setAttribute("class", "disabled");
        }
        var skipNum = (curPage - 1) * 20;
        query.descending("arrLen")
        query.limit(20)
        query.skip(skipNum)
        query.find({
            success: function(results) {
                for (var i = 0; i < results.length; i++)
                {
                    var brandName = results[i].get("brand");
                    var modelName = results[i].get("model");
                    var serverPrices = results[i].get("price");
                    var years = results[i].get("year");
                    var im = results[i].get("images");
                    var origLink = results[i].get("link");
                    var tempprices = serverPrices.toString();
                    var prices = ''
                    var commaCounter = 0
                    for (var j = tempprices.length - 1; j >= 0; j--)
                    {
                        prices = tempprices[j] + prices;
                        commaCounter = commaCounter + 1;
                        if (commaCounter % 3 == 0 && j != 0)
                        {
                            prices = ',' + prices;
                        }
                    }
                    prices = '$' + prices
                    year.push(years);
                    brand.push(brandName);
                    model.push(modelName);
                    price.push(prices);
                    images.push(im);
                    URL.push(origLink);
                }
                generateCars();
            },
            error: function() {
                console.log('Error');
            }
        });
    }
}

function generateCars()
{
    for (var i = 0; i < 20; i++)
    {
        var counter = i + 1;
        var stringCounter = counter.toString();
        if (i < year.length)
        {
            document.getElementById("box" + stringCounter).style.display = 'inline';
            var image = document.getElementById("img" + stringCounter);
            if (images[counter - 1].length == 0)
            {
                image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
            }
            else
            {
                image.setAttribute("src", images[counter - 1][0]);
                imgLoc[i] = 0;
            }
            document.getElementById("year" + stringCounter).textContent = year[counter - 1];
            document.getElementById("model" + stringCounter).textContent = brand[counter - 1] + ' ' + model[counter - 1];
            document.getElementById("price" + stringCounter).textContent = price[counter - 1];
            var hyperLink = document.getElementById("boxAnch" + stringCounter);
            if (URL[counter - 1][7] == '9' && URL[counter - 1][8] == '0' && URL[counter - 1][9] == '0' && URL[counter - 1][10] == '0')
            {
                var genLink = 'http://9000cc.com/buy.php?searchtype2=CARS&filter=all&index1=1&searchtype=&string1='
                var splitFile = model[counter - 1].split(" ")
                for (var j = 0; j < splitFile.length; j++)
                {
                    genLink = genLink + splitFile[j];
                    if (j < splitFile.length - 1)
                    {
                        genLink = genLink + '+'
                    }
                    else
                    {
                        genLink = genLink + '&string2='
                    }
                }
                hyperLink.setAttribute("href", genLink);
            }
            else
            {
                hyperLink.setAttribute("href", URL[counter - 1]);
            }
        }
        else
        {
            document.getElementById("box" + stringCounter).style.display = 'none';
        }
    }
}

function imgError1()
{
    var image = document.getElementById("img1");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError2()
{
    var image = document.getElementById("img2");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError3()
{
    var image = document.getElementById("img3");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError4()
{
    var image = document.getElementById("img4");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError5()
{
    var image = document.getElementById("img5");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError6()
{
    var image = document.getElementById("img6");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError7()
{
    var image = document.getElementById("img7");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError8()
{
    var image = document.getElementById("img8");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError9()
{
    var image = document.getElementById("img9");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError10()
{
    var image = document.getElementById("img10");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError11()
{
    var image = document.getElementById("img11");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError12()
{
    var image = document.getElementById("img12");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError13()
{
    var image = document.getElementById("img13");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError14()
{
    var image = document.getElementById("img14");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError15()
{
    var image = document.getElementById("img15");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError16()
{
    var image = document.getElementById("img16");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError17()
{
    var image = document.getElementById("img17");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError18()
{
    var image = document.getElementById("img18");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError19()
{
    var image = document.getElementById("img19");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function imgError20()
{
    var image = document.getElementById("img20");
    image.setAttribute("src", "http://www.planetdog.com/c.3709135/shopflow/img/no_image_available.jpeg");
}

function nextButtonClicked()
{
    if (curPage < maxPage)
    {
        if (curPage % 5 == 0)
        {
            document.getElementById("but5").setAttribute("class", "");
            document.getElementById("anch1").textContent = curPage + 1;
            document.getElementById("anch2").textContent = curPage + 2;
            document.getElementById("anch3").textContent = curPage + 3;
            document.getElementById("anch4").textContent = curPage + 4;
            document.getElementById("anch5").textContent = curPage + 5;
            document.getElementById("but1").setAttribute("class", "active");
            if (curPage == Math.floor(maxPage / 5) * 5)
            {
                var excessPages = maxPage - curPage;
                if (excessPages == 1)
                {
                    document.getElementById("but2").style.display = "none";
                    document.getElementById("but3").style.display = "none";
                    document.getElementById("but4").style.display = "none";
                    document.getElementById("but5").style.display = "none";
                }
                else if (excessPages == 2)
                {
                    document.getElementById("but3").style.display = "none";
                    document.getElementById("but4").style.display = "none";
                    document.getElementById("but5").style.display = "none";
                }
                else if (excessPages == 3)
                {
                    document.getElementById("but4").style.display = "none";
                    document.getElementById("but5").style.display = "none";
                }
                else if (excessPages == 4)
                {
                    document.getElementById("but5").style.display = "none";
                }
            }
        }
        else
        {
            if (curPage % 5 == 1)
            {
                document.getElementById("but1").setAttribute("class", "");
                document.getElementById("but2").setAttribute("class", "active");
            }
            else if (curPage % 5 == 2)
            {
                document.getElementById("but2").setAttribute("class", "");
                document.getElementById("but3").setAttribute("class", "active");
            }
            else if (curPage % 5 == 3)
            {
                document.getElementById("but3").setAttribute("class", "");
                document.getElementById("but4").setAttribute("class", "active");
            }
            else if (curPage % 5 == 4)
            {
                document.getElementById("but4").setAttribute("class", "");
                document.getElementById("but5").setAttribute("class", "active");
            }
        }
        curPage = curPage + 1;
        if (curPage == maxPage)
        {
            document.getElementById("nextButton").setAttribute("class", "disabled");
        }
        document.getElementById("prevButton").setAttribute("class", "");
    }
}

function prevButtonClicked()
{
    if (curPage > 1)
    {
        if (curPage % 5 == 1)
        {
            document.getElementById("but1").setAttribute("class", "");
            document.getElementById("anch1").textContent = curPage - 5;
            document.getElementById("anch2").textContent = curPage - 4;
            document.getElementById("anch3").textContent = curPage - 3;
            document.getElementById("anch4").textContent = curPage - 2;
            document.getElementById("anch5").textContent = curPage - 1;
            document.getElementById("but5").setAttribute("class", "active");
            if (curPage == (Math.floor(maxPage / 5) * 5) + 1)
            {
                document.getElementById("but2").style.display = "inline";
                document.getElementById("but3").style.display = "inline";
                document.getElementById("but4").style.display = "inline";
                document.getElementById("but5").style.display = "inline";
            }
        }
        else
        {
            if (curPage % 5 == 2)
            {
                document.getElementById("but2").setAttribute("class", "");
                document.getElementById("but1").setAttribute("class", "active");
            }
            else if (curPage % 5 == 3)
            {
                document.getElementById("but3").setAttribute("class", "");
                document.getElementById("but2").setAttribute("class", "active");
            }
            else if (curPage % 5 == 4)
            {
                document.getElementById("but4").setAttribute("class", "");
                document.getElementById("but3").setAttribute("class", "active");
            }
            else if (curPage % 5 == 0)
            {
                document.getElementById("but5").setAttribute("class", "");
                document.getElementById("but4").setAttribute("class", "active");
            }
        }
        curPage = curPage - 1;
        if (curPage == 1)
        {
            document.getElementById("prevButton").setAttribute("class", "disabled");
        }
        document.getElementById("nextButton").setAttribute("class", "");
    }
}

function imageOneHoverOn()
{
    localcurrent = 0
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageTwoHoverOn()
{
    localcurrent = 1
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageThreeHoverOn()
{
    localcurrent = 2
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageFourHoverOn()
{
    localcurrent = 3
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageFiveHoverOn()
{
    localcurrent = 4
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageSixHoverOn()
{
    localcurrent = 5
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageSevenHoverOn()
{
    localcurrent = 6
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageEightHoverOn()
{
    localcurrent = 7
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageNineHoverOn()
{
    localcurrent = 8
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageTenHoverOn()
{
    localcurrent = 9
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageElevenHoverOn()
{
    localcurrent = 10
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageTwelveHoverOn()
{
    localcurrent = 11
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageThirteenHoverOn()
{
    localcurrent = 12
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageFourteenHoverOn()
{
    localcurrent = 13
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageFifteenHoverOn()
{
    localcurrent = 14
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageSixteenHoverOn()
{
    localcurrent = 15
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageSeventeenHoverOn()
{
    localcurrent = 16
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageEighteenHoverOn()
{
    localcurrent = 17
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageNineteenHoverOn()
{
    localcurrent = 18
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

function imageTwentyHoverOn()
{
    localcurrent = 19
    imageOneEnd = setInterval(imageOneHoverOnNext, 1000);
}

var localcurrent

function imageOneHoverOnNext()
{
//    localcurrent = 0;
    imgLoc[localcurrent] = imgLoc[localcurrent] + 1;
    if (imgLoc[localcurrent] >= images[localcurrent].length)
    {
        imgLoc[localcurrent] = 0;
    }
    var locationImg = localcurrent + 1
    var locationString = locationImg.toString();
    var image = document.getElementById("img" + locationString);
    image.setAttribute("src", images[localcurrent][imgLoc[localcurrent]]);
}

function imageOneHoverOff()
{
    clearInterval(imageOneEnd);
}

