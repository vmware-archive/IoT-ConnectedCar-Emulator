'use strict';

/**
 * @ngdoc overview
 * @name iotDashboard
 * @description
 *
 * Main module of the application.
 */
angular
  .module('iotDashboard', [
    'services.config',
    'google-maps',
    'percentage',
    'ngStomp'
  ]);

'use strict';

angular.module('services.config', [])
  .constant('configuration', {
    baseUrl: ''
  });

'use strict';

angular.module('iotDashboard')
  .controller('MainController', ['connectedCarService', '$http', '$scope', 'configuration', '$window', '$timeout', '$log', '$stomp', function (connectedCarService, $http, $scope, configuration, $window, $timeout, $log, $stomp) {
    $scope.currentPanel = 'status';

    $scope.updateVin = function() {
        connectedCarService.setVin($scope.selectedVin);
    };

    $http({
        method: 'GET',
        url: configuration.baseUrl + '/vins'
    }).success(function (result) {
        $scope.vins = result;
        $scope.selectedVin = result[0];
        connectedCarService.setVin($scope.selectedVin);
    });

    $scope.start = function(vin) {
      $http({
        method: 'POST',
        url: configuration.baseUrl + '/simulator/start/' + vin
      });
    };

    $scope.pause = function(vin) {
      $http({
        method: 'POST',
        url: configuration.baseUrl + '/simulator/pause/' + vin
      });
    };

    $scope.restart = function(vin) {
      $http({
        method: 'POST',
        url: configuration.baseUrl + '/simulator/restart/' + vin
      });
    };

    $scope.fastForward = function(vin) {
      $http({
        method: 'POST',
        url: configuration.baseUrl + '/simulator/speed/' + vin + '/4'
      });
    };

    $scope.superFastForward = function(vin) {
      $http({
        method: 'POST',
        url: configuration.baseUrl + '/simulator/speed/' + vin + '/8'
      });
    };


  // $stomp.setDebug(function (args) {
  //     $log.debug(args)
  // });

  let wssUrl = configuration.baseUrl
  if (configuration.baseUrl === '') {
    wssUrl = window.location.protocol + "//" + window.location.host + ":8443"
  }

  // console.log('wss url:', wssUrl);
  $stomp
  .connect(wssUrl + '/emulator')

  // frame = CONNECTED headers
  .then(function (frame) {
    $stomp.subscribe('/topic/position', function (payload, headers, res) {
      connectedCarService.parseResponse(payload);
      $scope.$apply();
    }, {});
  })
}]);

'use strict';

angular.module('iotDashboard')
  .controller('MapController', ['connectedCarService', '$scope', function(connectedCarService, $scope) {
    $scope.vin = connectedCarService.car.vin;
    $scope.journeys = connectedCarService.journeys;

    $scope.carLocation = connectedCarService.car.location;
    $scope.mapCenter = $scope.carLocation;
    $scope.mapZoom = 14;
    var carIcon = {
        anchor: new google.maps.Point(35,35),
        origin: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(70, 70),
        url: 'images/car_marker.png'
    };
    var carIconOptionObject = {
        icon: carIcon
    };

    $scope.carIconOptions = carIconOptionObject;

    $scope.boundsMarkers = [];

    $scope.getCurrentJourney = function getCurrentJourney() {
      return connectedCarService.currentJourney;
    };

    $scope.setCurrentJourney = function setCurrentJourney(journey){
      if(connectedCarService.currentJourney === journey){
        connectedCarService.currentJourney = null;
      } else {
        connectedCarService.currentJourney = journey;
      }
    };

    $scope.$watch('currentPanel', function() {
      if ($scope.currentPanel === 'journey') {
        $scope.mapCenter = _.extend({}, $scope.carLocation);
      } else {
        $scope.mapCenter = $scope.carLocation;
        $scope.mapZoom = 14;
      }
    });

    $scope.$watch('[currentPanel,carLocation]', function(){
        $scope.boundsMarkers.length = 0;

        if($scope.currentPanel === 'journey') {
            _.each($scope.journeys[connectedCarService.car.vin], function(journey){
                var newJourney = _.assign(_.clone(journey), {
                    options: { opacity: 0 }
                });
                $scope.boundsMarkers.push(newJourney);
            });
        }

        $scope.boundsMarkers.push(_.assign(_.clone($scope.carLocation), {
            id: 'car',
            options: { opacity: 0 }
        }));
    }, true);
  }]);

'use strict';

angular.module('iotDashboard')
  .controller('StatusController', ['connectedCarService', '$scope', function (connectedCarService, $scope) {
    $scope.car = connectedCarService.car;
  }]);

'use strict';

angular.module('iotDashboard')
  .controller('JourneyController', ['connectedCarService', '$scope', function(connectedCarService, $scope) {

    $scope.vin = connectedCarService.vin;
    $scope.journeys = connectedCarService.journeys;
    $scope.car = connectedCarService.car;

    $scope.setCurrentJourney = function setCurrentJourney(journey){
      if(connectedCarService.currentJourney === journey){
        connectedCarService.currentJourney = null;
      } else {
        connectedCarService.currentJourney = journey;
      }
    };

    $scope.getCurrentJourney = function getCurrentJourney() {
      return connectedCarService.currentJourney;
    };
}]);


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

'use strict';

angular.module('iotDashboard')
  .directive('journeyMarker', function() {
    return {
      restrict: 'E',
      scope: {
        journey: '=',
        isCurrentJourney: '=',
        setCurrentJourneyCallback: '='
      },
      link: function(scope) {
        scope.clickMarkerCallback = function clickMarkerCallback() {
          scope.setCurrentJourneyCallback(scope.journey);
        };

        scope.closeWindowCallback = function closeWindowCallback() {
          scope.setCurrentJourneyCallback();
        };

        scope.journeyMarkerIcon = {
          url: 'images/icon_marker.png',
          scaledSize: { height: 40, width: 30 }
        };

        scope.id = scope.journey.id.toString();
      },
      templateUrl: 'templates/journey_marker.html'
    };
  });

/* jshint newcap:false */
'use strict';

angular.module('iotDashboard')
  .directive('radialMeter', function() {
    return {
      restrict: 'E',
      scope: {
        id: '@',
        value: '=',
        min: '=',
        max: '=',
        label: '@',
        size: '=',
        strokeWidth: '=',
        suffix: '='
      },
      templateUrl: 'templates/meter.html' ,
      link: function(scope) {
        var size = scope.size;
        var strokeWidth = scope.strokeWidth;
        var r = (size-strokeWidth)/2;

        function valueToPath(value) {
          var cx = size/2;
          var cy = size/2;
          var startX = cx+r*Math.sin(-3/4*Math.PI);
          var startY = cy-r*Math.cos(-3/4*Math.PI);

          var percentage = (value - scope.min)/(scope.max-scope.min);
          var theta = (-3/4)*Math.PI + (3/2)*Math.PI*percentage;
          var largeArcSweep = (percentage < 2/3) ? 0 : 1;
          var x = cx+r*Math.sin(theta);
          var y = cy-r*Math.cos(theta);

          return [
            ["M", startX, startY],
            ["A", r, r, 0, largeArcSweep, 1, x, y]
          ];
        }

        var paper = Raphael(scope.id, size, size);

        var backgroundPath = paper.path()
          .attr({
            "stroke-width": strokeWidth
          })
          .attr({
            path: valueToPath(scope.max)
          });

        var foregroundPath = paper.path()
          .attr({
            "stroke-width": strokeWidth
          })
          .attr({
            path: valueToPath(scope.min)
          });

        backgroundPath.node.setAttribute("class", "radial-meter-background-path");
        foregroundPath.node.setAttribute("class", "radial-meter-foreground-path");

        scope.$watch('value', function(){
          foregroundPath.stop().animate({path: valueToPath(scope.value)}, 300);
        }, true);
      }
    };
  });


/* jshint newcap:false */
'use strict';

angular.module('iotDashboard')
  .directive('fillMeter', function(){
    return {
      restrict: 'E',
      scope: {
        id: '@',
        value: '=',
        min: '=',
        max: '=',
        label: '@',
        size: '=',
        strokeWidth: '=',
        innerRadius: '=',
        suffix: '='
      },
      templateUrl: 'templates/meter.html',
      link: function(scope){
        var size = scope.size;
        var strokeWidth = scope.strokeWidth;
        var innerR = scope.innerRadius;
        var r = (size-strokeWidth)/2;

        function valueToClipRect(value) {
          var percentage = (value-scope.min)/(scope.max-scope.min);
          var clipRectStartY = size - ((percentage*2*innerR) + (size/2-innerR));
          return "0 " + clipRectStartY + " " + size + " " + size;
        }

        var paper = Raphael(scope.id, size, size);

        var background = paper.circle(size/2, size/2, r)
          .attr({
            "stroke-width": strokeWidth
          });

        var fill = paper.circle(size/2, size/2, innerR);

        background.node.setAttribute("class", "fill-meter-background");
        fill.node.setAttribute("class", "fill-meter-fill");

        scope.$watch('value', function() {
          fill.attr({"clip-rect": valueToClipRect(scope.value)});
        }, true);
      }
    };
  });

'use strict';

angular.module('iotDashboard')
  .filter('probabilityOpacity', function(){
    return function probabilityOpacity(probability){
      return (0.34 + 0.66 * probability);
    };
  });
