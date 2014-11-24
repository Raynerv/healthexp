angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $console, $ionicPlatform) {
  $ionicPlatform.ready(function() {
    $console.log('Loaded DashCtrl successfully.');
    $scope.region = {
      uuid: null,
      identifier: "DefaultRegion"
    };
    $scope.beacons = {};
    var beaconRegion = cordova.plugins.locationManager.Regions.fromJson($scope.region).fail($console.error)
      .done();
    cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion);
    var delegate = new cordova.plugins.locationManager.Delegate();

    delegate.didRangeBeaconsInRegion = function(pluginResult) {
      $console.log('didRangeBeaconsInRegion()');
      $scope.beacons = pluginResult;
    };

    cordova.plugins.locationManager.setDelegate(delegate);
  });
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {});
