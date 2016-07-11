'use strict';

angular.module('iotDashboard')
  .factory('connectedCarService', ['$http', '$interval', 'configuration', function ($http, $interval, configuration) {
    var car = {
      engineRpm: 0,
      vehicleSpeed: 0,
      coolantTemp: 0,
      fuel: 0,
      location: {
        latitude: '0',
        longitude: '0'
      },
      range: 0,
      mpg: 0,
      vin: ""
    };
    var journeys = {};
    var vin = "";

    function setVin(newVin) {
      vin = newVin;
      getJourneys(vin);
    }

    function getJourneys(vin) {
      delete journeys[vin];

      $http({method: 'GET', url: configuration.baseUrl + '/journey/' + vin}).
      success(function (data) {
        var journeyId = 0;
        _.each(data["destinations"], function(journey) {
          journey.id = journeyId;
          journeyId++;
        });
        journeys[vin] = data["destinations"];
      });

    }

    function parseResponse(response) {
      car.vin = response['vin'];
      car.engineRpm = Math.round(response["rpm"]);
      car.vehicleSpeed = Math.round(response["vehicleSpeed"]);
      car.coolantTemp = Math.round(response["coolantTemp"]);
      car.fuel = Math.ceil(response["fuelLevelInput"]);
      car.location.latitude = response["latitude"];
      car.location.longitude = response["longitude"];
      car.mpg = Math.ceil(response["mpgInstantaneous"]);
      car.range = Math.ceil(response["remainingRange"]);

      var updatedJourneys = [];

      _.each(response["predictions"], function(journey) {
        var matchingJourney = _.find(journeys[car.vin], {latitude: journey.latitude, longitude: journey.longitude})
        matchingJourney.mpgJourney = journey.mpgJourney;
        matchingJourney.probability = journey.probability;
        updatedJourneys.push(matchingJourney)
      });
      journeys[vin] = updatedJourneys;
    }

    return { car: car, journeys: journeys, vin: vin, setVin: setVin, parseResponse: parseResponse};
  }]);
