$(document).ready(function () {
    'use strict';

    // weatherReport Class storing a locations weather and wind information with methods to render the data on page
    class weatherReport {
        constructor(location, weatherForecast, weatherTempHigh, weatherTempLow, windChill, windDirection, windSpeed) {
            this.location = location;
            this.weatherForecast = weatherForecast;
            this.weatherTempHigh = weatherTempHigh;
            this.weatherTempLow = weatherTempLow;
            this.windChill = windChill;
            this.windDirection = windDirection;
            this.windSpeed = windSpeed;
            this.weatherTempHigh = weatherTempHigh;
            this.weatherTempHigh = weatherTempHigh;
        }

        static locationError() {
            return "Location does not exist!";

        }

        get weatherTitle() {
            return "<h2>" + this.location + ":</h2>";

        }


        get weatherSummary() {

            return "<h3>Weather:</h3><p>Forecast: " + this.weatherForecast + "</p><p>High: " + this.weatherTempHigh + "</p><p>Low: " + this.weatherTempLow + "</p>";

        }

        get windSummary() {

            return "<h3>Wind:</h3><p>Windchill: " + this.windChill + "</p><p>Direction: " + this.windDirection + "</p><p>Speed: " + this.windSpeed + "</p>";

            
        }


        get weatherAndWindSummary() {

            return "<article><div class=grid_row><div class=grid_item><div id=weatherTitle>" + this.weatherTitle + "</div></div></div><div class=grid_row><div class=grid_item><div id=weatherSummary>" + this.weatherSummary + "</div></div><div class=grid_item><div id=windSummary>" + this.weatherSummary + "</div></div></div></article>";

        }
        
        get weatherOnlySummary() {

            return "<article><div class=grid_row><div class=grid_item><div id=weatherTitle>"+this.weatherTitle+"</div></div></div><div class=grid_row><div class=grid_item><div id=windSummary>"+this.weatherSummary+"</div></div></div></article>";

        }

        get windOnlySummary() {

            return "<article><div class=grid_row><div class=grid_item><div id=weatherTitle>"+this.weatherTitle+"</div></div></div><div class=grid_row><div class=grid_item><div id=windSummary>"+this.windSummary+"</div></div></div></article>";

        }
        
        get noOptionsSummary() {

            return "<article><div class=grid_row><div class=grid_item><div id=weatherTitle>"+this.weatherTitle+"</div></div></div><div class=grid_row><div class=grid_item><p>No options selected. Please select Wind and/or Weather</p></div></div></article>";

        }

        

    }

    // A function to make a API call and create a weather report  with error handling
    function createReport(location, showWind, showWeather) {

        // reset text input color and value
        $('#locationInput').attr("placeholder", "Enter location").css("background-color", "white").val("");

        const startTime = Date.now();


        $.getJSON('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + location + '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
            .done(function (data) {


                // Check that JSON response is not empty
                if (data.query.count !== 0) {

                    // Create new weatherReport object containing Location, wind and Weather information
                    const wr = new weatherReport(
                        data.query.results.channel.location.city + ", " + data.query.results.channel.location.region + ", " + data.query.results.channel.location.country,
                        data.query.results.channel.item.forecast[0].text,
                        data.query.results.channel.item.forecast[0].high,
                        data.query.results.channel.item.forecast[0].low,
                        data.query.results.channel.wind.chill,
                        data.query.results.channel.wind.direction,
                        data.query.results.channel.wind.speed
                    );

                    if ((showWind === true) && (showWeather === false)) {
                        console.log("Show Wind report: " + showWind);
                        console.log("Show Weather report: " + showWeather);
                        // Render Wind results only
                        $('#weatherReport').append(wr.windOnlySummary);

                    } else if ((showWind === false) && (showWeather === true)) {
                        console.log("Show Wind report: " + showWind);
                        console.log("Show Weather report: " + showWeather);
                        // Render Weather results only
                        $('#weatherReport').append(wr.weatherOnlySummary);

                    } 
                    
                    else if ((showWind === false) && (showWeather === false)) {
                        console.log("Show Wind report: " + showWind);
                        console.log("Show Weather report: " + showWeather);
                        // Render Weather results only
                        $('#weatherReport').append(wr.noOptionsSummary);

                    } 
                    
                    else {
                        console.log("Show Wind report: " + showWind);
                        console.log("Show Weather report: " + showWeather);
                        // Render message to select Wind and Weather options
                        $('#weatherReport').append(wr.weatherAndWindSummary);
                       
                    }



                } else {


                    // warn user of error by warning message in text input and change text input background color
                    $('#locationInput').attr("placeholder", weatherReport.locationError).css("background-color", "lightpink");

                    // Error message in console
                    throw Error("Location does not exist!");

                }


            })
        
            // upon a fail return console message 
            .fail(function () {
                // log failed query
                console.log("Query failed!");

            })
        
            // always return timing information
            .always(function () {

                // Show time to complete query
                const elapsedTime = Date.now() - startTime;
                console.log("Query completed in " + elapsedTime + " ms");

            });


    }


    // Set Weather report options 
    let showWind = true;
    let showWeather = true;

    // Toggle Wind report options 

    $("#wind").click(() => {
        if (showWind === true) {
            showWind = false;
            $("#wind").css("background-color", "grey");
        } else {
            showWind = true;
            $("#wind").css("background-color", "lightblue");

        }
        console.log("Show Wind report: " + showWind);
    });

    // Toggle Weather report options 
    $("#weather").click(() => {
        if (showWeather === true) {
            showWeather = false;
            $("#weather").css("background-color", "grey");
        } else {
            showWeather = true;
            $("#weather").css("background-color", "lightblue");

        }
        console.log("Show Weather report: " + showWeather);

    });

    /* When user clicks the button with ID #search
     go and trigger a function that creates a report
     the function takes in the value of my text field 
     with the ID #locationInput
    */
    $("#search").click(() => {
        createReport($('#locationInput').val(), showWind, showWeather);
    });

    /* Alternatively when user hits Enter key in the text feild with the ID #locationInput

      IF the text field is empty, change the text field color to lightpink to warn the user  

      Else trigger a function that creates a report the function takes in the value of my text field with the ID #locationInput.
    */

    $('#locationInput').keypress(function (e) {
        if (e.which == 13) { //Enter key pressed


            if ($('#locationInput').val() === "") {
                console.log('error empty!');
                $('#locationInput').css("background-color", "lightpink");
            } else {
                $('#locationInput').css("background-color", "white");
                createReport($('#locationInput').val(), showWind, showWeather);
            }
        }
    });


});
