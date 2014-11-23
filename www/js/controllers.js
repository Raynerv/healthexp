angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  $scope.region = {uuid:null, identifier:"DefaultRegion"};
  $scope.beacons = {};
  var beaconRegion = cordova.plugins.locationManager.Regions.fromJson($scope.region);
  cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion);
  var delegate = new cordova.plugins.locationManager.Delegate().implement({
			didRangeBeaconsInRegion: function (pluginResult) {
			  $scope.beacons = pluginResult;
			}
		});
	cordova.plugins.locationManager.setDelegate(delegate);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
});
