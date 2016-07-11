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

  $stomp
  .connect(configuration.baseUrl + '/emulator')

  // frame = CONNECTED headers
  .then(function (frame) {
    $stomp.subscribe('/topic/position', function (payload, headers, res) {
      connectedCarService.parseResponse(payload);
      $scope.$apply();
    }, {});
  })
}]);
