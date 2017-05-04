$(document).ready(function () {

  console.log("hello");

  weatherApp = {

    $targetArea: $("#weather"),

    weatherApiKey: "",

    lastLatitiude: "",
    lastLongitude: "",

    getFormData: function () {
      if (weatherApp.weatherApiKey === null || weatherApp.weatherApiKey === "") {
        weatherApp.weatherApiKey = $("#apikey").val().trim();
      }

      let zip = $("#zip").val().trim();
      if (zip === null || zip.length < 5) {
        weatherApp.$targetArea.html("Enter a valid zip code.");
      } else {
        weatherApp.getWeatherData(zip);
      }

      console.log(weatherApp.weatherApiKey);
      console.log(zip);
    },

    getWeatherData: function (zipcode) {
      let url = "//api.openweathermap.org/data/2.5/weather?zip=" + zipcode + ",us&appid=" + weatherApp.weatherApiKey + "&units=imperial";

      //let url = "testData/test.json"

      $.getJSON(url, function (data) {

        if (data.cod == 200) {
          weatherApp.$targetArea.html("Success!");

          // THIS IS WHERE YOU WOULD ADD THE DATA TO THE PAGE
          // Add the city name
            weatherApp.$targetArea.append("<p>" + data.name + "</p>")

          // Add the weather condition descriptions, all of them, comma separated
           let html = "";
        html += "<ul>";

        $.each(data.weather, function (index) {
            //Get pet from array
            console.log(data.weather[index]);
            weather = data.weather[index];
            html += "<li>" + weather.description + "</li>" ;
        })
        html += "</ul>";

        weatherApp.$targetArea.append(html);
            

          // Add the current temperature, the day's low & high temp, current pressure, & current humidity
            weatherApp.$targetArea.append("<p>" + "Temp:" + data.main.temp + "</p>");
            weatherApp.$targetArea.append("<p>" + "Low Temp:" + data.main.temp_min + "</p>");
            weatherApp.$targetArea.append("<p>" + "High Temp:" + data.main.temp_max + "</p>");
            weatherApp.$targetArea.append("<p>" + "Pressure:" + data.main.pressure + "</p>");
            weatherApp.$targetArea.append("<p>" + "Humidity:" + data.main.humidity + "</p>");
          // Get the lat & longitude from the result and save
          weatherApp.lastLatitiude = data.coord.lat;
          weatherApp.lastLongitude = data.coord.lon;

          // Add a button for 5 day forcast
          weatherApp.$targetArea.append('<div id="5day"><button id="fiveDay">Get 5 Day Forecast</button></div>');
          $("#fiveDay").on("click", weatherApp.getFiveDayWeather);

        } else {
          weatherApp.$targetArea.html("Sorry, no weather data available. Try again later.");
        }
      }).fail(function () {
        weatherApp.$targetArea.html("Sorry, no weather data available. Try again later.");
      });
    },

    getFiveDayWeather: function () {
      let url = "//api.openweathermap.org/data/2.5/forecast?lat=" + weatherApp.lastLatitiude + "&lon=" + weatherApp.lastLongitude + "&appid=" + weatherApp.weatherApiKey + "&units=imperial";

      //let url = "testData/test5day.json"

      $.getJSON(url, function (data) {
        var $target = $("#5day")
        if (data.cod == 200) {
          $target.html("Success!");
            

          // THIS IS WHERE YOU WOULD ADD THE 5 DAY FORCAST DATA TO THE PAGE

          // For each of the 5 days, at each time specified, add the date/time plus:
          //   - the weather condition descriptions, all of them, comma separated
          //   - day's temp, low & high temp, pressure, humidity
            
            let html = "";
        html += "<ul>";

        $.each(data.list, function (index) {
            //Get pet from array
            console.log(data.list[index]);
            list = data.list[index];
            html += "<li>" + "Date and Time:" + new Date(list.dt * 1000) + "</li>" ;
            html += "<li>" + "Temp:" + list.main.temp + "</li>" ;
            html += "<li>" + "Low Temp:" + list.main.temp_min + "</li>";
            html += "<li>" + "High Temp:"  + list.main.temp_max + "</li>";
            $.each(list.weather, function(index2){
                weather = list.weather[index2];
                
                html +=  "<li>" + "Description:"  + weather.description + "</li>" ;
                
            });
            
        })
        html += "</ul>";
        weatherApp.$targetArea.append(html);

        } else {
          $target.html("Sorry, 5 day forcast data is unavailable. Try again later.");
        }
      }).fail(function () {
        weatherApp.$targetArea.html("Sorry, 5 day forcast data is unavailable. Try again later.");
      });

    }
  }

  // Form submit handler
  $("#submit").click(function () {
    weatherApp.getFormData();
    return false;
  });

});