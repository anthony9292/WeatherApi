$(document).ready(function) () { 

var cityStorage = localStorage; 
var cityList = []; 
const APIKEY = "747881da8c4d68c9b809583b4d0c58bb"; 
var targetCity = ""; 
var targetCityLon = ""; 
var targetCityLat = ""; 


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

 retrievePastSearches(); 

 function savePastSearches() { 
   cityStorage.setItem("pastWeatherCities", JSON.stringify(cityList)); 

 }

 $("#searchButton").on("click", function () { 

  event.preventDefault; 
  console.log(`Searching for ${$("#searchTermEntry").val()} data.`);
        targetCity = $("#searchTermEntry").val();

      getCurrentWeatherData(targetCity); 
 }); 


 function getCurrentWeatherData(cityName) {  
    $.ajax({ 
      method: "GET", 
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + `${cityName}&appid=${APIKEY}`
    }).then(function (currentResponse) {

      



    })

 }
}





