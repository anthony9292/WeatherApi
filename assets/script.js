$(document).ready(function) () { 

var cityStorage = localStorage; 
var cityList = []; 
const APIKEY = "747881da8c4d68c9b809583b4d0c58bb"; 
var targetCity = ""; 
var targetCityLon = ""; 
var targetCityLat = ""; 

// function that retrieves from local storage on load 
function retrievePastSearches() { 
  if(cityStorage.getItem("pastWeatherCities") != undefined) { 
    cityList = JSON.parse(cityStorage.getItem("pastWeatherCities")); 
    for (var i = 0; i < cityList.length; i++) { 

      var NewRecentSearchLink - $("<a href=\"\#\"></a>"); 
      NewRecentSearchLink.text(cityList[i]); 
      NewRecentSearchLink.attr("data-city", cityList[i]); 
      NewRecentSearchLink.attr("class","recentSearchItem list-group-item-action"); 
      $("#resultList").prepend(newRecentSearchLink); 
    }
  }
}

// Retrieves the data from the local storage 
 retrievePastSearches(); 

 // function that saves your searches to the local storage 
 function savePastSearches() { 
   cityStorage.setItem("pastWeatherCities", JSON.stringify(cityList)); 

 }

 //search bottom 
 $("#searchButton").on("click", function () { 

  event.preventDefault; 
  console.log(`Searching for ${$("#searchTermEntry").val()} data.`);
        targetCity = $("#searchTermEntry").val();

        // calls ajax for the current weather API 
      getCurrentWeatherData(targetCity); 
 }); 

// Function to get the current weather from users input location(city name)
 function getCurrentWeatherData(cityName) {  
    $.ajax({ 
      method: "GET", 
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + `${cityName}&appid=${APIKEY}`
    }).then(function (currentResponse) {

      
     var alreadyInList = false; 
     for(var a = 0; a < $("#resultList").children().length; a++) { 
       var existingEntry = $("#resultList").children().get(a).textContent;
       if(existingEntry === cityName) { 
         alreadyInList =  true; 
       }
     }
   

     if(alreadyInList === false) { 
       var newRecentSearchLink = $("<a href=\"\#\"></a>");
       newRecentSearchLink.attr("data-city", cityName); 
       newRecentSearchLink.attr("class", "recentSearchItem list-group-item list-group-item-action"); 
       $("#resultList").prepend(newRecentSearchLink); 


       //updates local storage
       cityList.push(cityName); 
       savePastSearches();
     }

     //city name(label)
     $("#currentWeathher").text(currentResponse.name);
      //weather icon
      $("#currentTempSpan").html(`${tempKtoC(currentResponse.main.temp)}&deg;C`);
      //present humidity 
      $("#currentHumiditySpan").text(`${currentResponse.main.humidity}%`);
    //present wind 
     $("#currentWindSpan").text(`${currentResponse.wind.speed}m/s`);
      
    targetCityLon = currentResponse.coord.lon; 
    targetCityLat = currentResponse.coord.lat;


    getUVIndex(targetCityLat, targetCityLon); 

    getfiveForecast(targetCityLat, targetCityLon); 

    }); 

    function  getUVIndex(latitude, longitude) { 

      $ajax|({ 
        method: "GET", 
        url:  "https://api.openweathermap.org/data/2.5/uvi?appid=" + `${APIKEY}&lat=${latitude}&lon=${longitude}`
      }).then(function (UVresponse) { 

        $("#currentUVSpan").text(UVresponse.value); 
        var UVunit = parseInt(UVresponse.value); 
         

        if (UVunit <= 2) { 
               
          $("#currentUVSpan").css("background-color", "#97D700");
          $("#currentUVSpan").css("color", "#000000"); 
        } else if(UVunit >= 3 && UVunit <= 5) { 

          $("#currentUVSpan").css("background-color", "#FCE300"); 
          $("#currentUVSpan").css("color", "#000000"); 
        }; else if (UVunit >= 6 && UVunit <= 7) { 

          $("#currentUVSpan").css("background-color", "#FF8200");
          $("#currentUVSpan").css("color", "#FFFFFF");
      } else if (UVunit >= 8 && UVunit <= 10) {
          // Very High 
          $("#currentUVSpan").css("background-color", "#EF3340");
          $("#currentUVSpan").css("color", "#FFFFFF");
      } else if (UVunit >= 11) {
          // Extreme 
          $("#currentUVSpan").css("background-color", "#9063CD");
          $("#currentUVSpan").css("color", "#FFFFFF");
      }

      });
     }

    function getFiveDayForcast(latitude, longitude) {  
      $("#fiveDayCardsRow").empty(); 

      $.ajax({

    method: "GET", 
    url: `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${APIKEY}`

      }).then(function (fiveDayResponse) { 

          var fiveDayForcastList = fiveDayResponse.daily; 
          for (var l = 1; l < 6; l++) { 

            var dailyDate = moment( fiveDayForcastList[1].dt, "X"); 
            var fiveDayCardDateTxt =  dailyDate.format("DD/M/YYYY"); 
            var fiveDayCardIconSrc =  `https://openweathermap.org/img/wn/${fiveDayForecastList[l].weather[0].icon}@2x.png`;
            var fiveDayCardTempTxt = `Temp: ${tempKtoC(fiveDayForecastList[l].temp.day)} °C`;
            var fiveDayHumidity = `Humidity: ${fiveDayForecastList[l].humidity}%`;


            var newFiveDayCard = document.createElement("div"); 
            $(newFiveDayCard)attr("class", "fiveDayCard card m-2");
            $("fiveDayCardsRow").append(newFiveDayCard); 
            var newFiveDayCardBody = $("<div>"); 
            $(newFiveDayCard).append(newFiveDayCardBody); 
            $(newFiveDayCardBody).attr("class", "card-body"); 



            var newFiveDayCardHeading =  document.createElement("h4"); 
            $(newFiveDayCardHeading).attr("class", "card-title fiveDayDate"); 
            $(newFiveDayCardHeading).text(fiveDayCardDateTxt); 
            $(newFiveDayCardBody).append(newFiveDayCardHeading); 



            var newFiveDayCardIcon = document.createElement("img");







          }


      })





    }




 }
}





