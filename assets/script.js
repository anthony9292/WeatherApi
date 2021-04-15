var button = document.querySelector('.button')
var inputValue = document.querySelector('.inputValue')
var name = document.querySelector('.name');
var desc = document.querySelector('.desc');
var temp = document.querySelector('.temp');


button.addEventListener('click', function(){   
fetch('api.openweathermap.org/data/2.5/weather?q={city name}'+inputValue.value+'&appid={747881da8c4d68c9b809583b4d0c58bb}') 
  .then(response => response.json()) 
  .then(data => { 
    var nameValue = data ['name']

  }

   

  .catch(errr => alert('Wrong city name!!'))



})