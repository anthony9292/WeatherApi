$(document).ready(function () {
  var cityStorage = localStorage;
  var cityList = [];
  const APIKEY = "747881da8c4d68c9b809583b4d0c58bb";
  var targetCity = "";
  var targetCityLon = "";
  var targetCityLat = "";

  // function that retrieves from local storage on load
  function retrievePastSearches() {
    if (cityStorage.getItem("pastWeatherCities") != undefined) {
      cityList = JSON.parse(cityStorage.getItem("pastWeatherCities"));
      for (var i = 0; i < cityList.length; i++) {
        var newRecentSearchLink = $('<a href="#"></a>');
        newRecentSearchLink.text(cityList[i]);
        newRecentSearchLink.attr("data-city", cityList[i]);
        newRecentSearchLink.attr(
          "class",
          "recentSearchItem list-group-item list-group-item-action"
        );
        $("#resultList").prepend(newRecentSearchLink);
      }
    }
  }

  // gets data from local storage
  retrievePastSearches();

  // saves searches to local storage
  function savePastSearches() {
    cityStorage.setItem("pastWeatherCities", JSON.stringify(cityList));
  }

  //search button
  $("#searchButton").on("click", function () {
    event.preventDefault;
    console.log(`Searching for ${$("#searchTermEntry").val()} data.`);
    targetCity = $("#searchTermEntry").val();

    // call ajax for current weather API
    getCurrentWeatherData(targetCity);
  });

  // gets current weather from user input
  function getCurrentWeatherData(cityName) {
    $.ajax({
      method: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        `${cityName}&appid=${APIKEY}`,
    }).then(function (currentResponse) {
      // checks if a matching entry is already there
      var alreadyInList = false;
      for (var a = 0; a < $("#resultList").children().length; a++) {
        var existingEntry = $("#resultList").children().get(a).textContent;
        if (existingEntry === cityName) {
          alreadyInList = true;
        }
      }
      // if not there already, add it in
      if (alreadyInList === false) {
        var newRecentSearchLink = $('<a href="#"></a>');
        newRecentSearchLink.text(cityName);
        newRecentSearchLink.attr("data-city", cityName);
        newRecentSearchLink.attr(
          "class",
          "recentSearchItem list-group-item list-group-item-action"
        );
        $("#resultList").prepend(newRecentSearchLink);

        // updates local storage
        cityList.push(cityName);
        savePastSearches();
      }

      $("#currentWeatherCity").text(currentResponse.name); // city name label
      $("#currentWeatherIcon").attr(
        "src",
        `https://openweathermap.org/img/wn/${currentResponse.weather[0].icon}@2x.png`
      ); // weather icon
      $("#currentTempSpan").html(
        `${tempKtoC(currentResponse.main.temp)}&deg;C`
      ); // current temperature
      $("#currentHumiditySpan").text(`${currentResponse.main.humidity}%`); // current humidity
      $("#currentWindSpan").text(`${currentResponse.wind.speed}m/s`); // current wind

      targetCityLon = currentResponse.coord.lon;
      targetCityLat = currentResponse.coord.lat;

      getUVIndex(targetCityLat, targetCityLon);

      // call ajax for five day forecast
      getFiveDayForecast(targetCityLat, targetCityLon);
    });
  }

  //UV Index for selected city
  function getUVIndex(latitude, longitude) {
    $.ajax({
      method: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/uvi?appid=" +
        `${APIKEY}&lat=${latitude}&lon=${longitude}`,
    }).then(function (UVresponse) {
      $("#currentUVSpan").text(UVresponse.value);
      var UVunit = parseInt(UVresponse.value);

      // UV colors
      if (UVunit <= 2) {
        $("#currentUVSpan").css("background-color", "#97D700");
        $("#currentUVSpan").css("color", "#000000");
      } else if (UVunit >= 3 && UVunit <= 5) {
        $("#currentUVSpan").css("background-color", "#FCE300");
        $("#currentUVSpan").css("color", "#000000");
      } else if (UVunit >= 6 && UVunit <= 7) {
        $("#currentUVSpan").css("background-color", "#FF8200");
        $("#currentUVSpan").css("color", "#FFFFFF");
      } else if (UVunit >= 8 && UVunit <= 10) {
        $("#currentUVSpan").css("background-color", "#EF3340");
        $("#currentUVSpan").css("color", "#FFFFFF");
      } else if (UVunit >= 11) {
        $("#currentUVSpan").css("background-color", "#9063CD");
        $("#currentUVSpan").css("color", "#FFFFFF");
      }

      var currentDataDate = moment(UVresponse.date_iso);
      $("#currentWeatherDate").text(currentDataDate.format("DD/M/YYYY"));
    });
  }

  // gets 5-day forecast for desired city
  function getFiveDayForecast(latitude, longitude) {
    $("#fiveDayCardsRow").empty();

    $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${APIKEY}`,
    }).then(function (fiveDayResponse) {
      var fiveDayForecastList = fiveDayResponse.daily;
      for (var l = 1; l < 6; l++) {
        // displays each of the five-day forecasts on the screen
        var dailyDate = moment(fiveDayForecastList[l].dt, "X");
        var fiveDayCardDateTxt = dailyDate.format("DD/M/YYYY");
        var fiveDayCardIconSrc = `https://openweathermap.org/img/wn/${fiveDayForecastList[l].weather[0].icon}@2x.png`;
        var fiveDayCardTempTxt = `Temp: ${tempKtoC(
          fiveDayForecastList[l].temp.day
        )} °C`;
        var fiveDayHumidity = `Humidity: ${fiveDayForecastList[l].humidity}%`;

        var newFiveDayCard = document.createElement("div");
        $(newFiveDayCard).attr("class", "fiveDayCard card m-3");
        $("#fiveDayCardsRow").append(newFiveDayCard);
        var newFiveDayCardBody = $("<div>");
        $(newFiveDayCard).append(newFiveDayCardBody);
        $(newFiveDayCardBody).attr("class", "card-body");

        var newFiveDayCardHeading = document.createElement("h4");
        $(newFiveDayCardHeading).attr("class", "card-title fiveDayDate");
        $(newFiveDayCardHeading).text(fiveDayCardDateTxt);
        $(newFiveDayCardBody).append(newFiveDayCardHeading);

        //Weather icon
        var newFiveDayCardIcon = document.createElement("img");
        $(newFiveDayCardIcon).attr("src", fiveDayCardIconSrc);
        $(newFiveDayCardBody).append(newFiveDayCardIcon);

        // temperature icon
        var newFiveDayCardTemp = document.createElement("p");
        $(newFiveDayCardTemp).text(fiveDayCardTempTxt);
        $(newFiveDayCardBody).append(newFiveDayCardTemp);

        // humidity icon
        var newFiveDayHumidity = document.createElement("p");
        $(newFiveDayHumidity).text(fiveDayHumidity);
        $(newFiveDayCardBody).append(newFiveDayHumidity);
      }
    });
  }

  $(".recentSearchItem").click(function () {
    event.preventDefault;
    getCurrentWeatherData(this.dataset.city);
  });

  //temperature conversion function
  function tempKtoC(Ktemp) {
    var Ctemp = Ktemp - 273.15;
    return Math.floor(Ctemp);
  }
});
