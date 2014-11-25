var startScanForBeacons = function(rootScope) {

  // Regions that define which page to show for each beacon.
  var beaconRegions = [{
    id: 'test',
    uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
    major: 3,
    minor: 1
    /*},  {
     id: 'test2',
     uuid: 'b9407f30-f5f8-466e-aff9-25556b57fe6d',
     major: 5,
     minor: 1*/
  }];
  var delegate = new cordova.plugins.locationManager.Delegate();

  delegate.didExitRegion = function(pluginResult) {
    //window.alert('[DOM] didExitRegion: ' + JSON.stringify(pluginResult));
    //cordova.plugins.locationManager.appendToDeviceLog('[DOM] didExitRegion: ' + JSON.stringify(pluginResult));
    //console.log(JSON.stringify(pluginResult));
    rootScope.$emit('iBeacon:exit', pluginResult);
    rootScope.$apply();
  };

  delegate.didEnterRegion = function(pluginResult) {
    //window.alert('[DOM] didEnterRegion: ' + JSON.stringify(pluginResult));
    //cordova.plugins.locationManager.appendToDeviceLog('[DOM] didEnterRegion: ' + JSON.stringify(pluginResult));
    //console.log(JSON.stringify(pluginResult));
    rootScope.$emit('iBeacon:enter', pluginResult);
    rootScope.$apply();
  };

  delegate.didDetermineStateForRegion = function(pluginResult) {
    //window.alert('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
    //cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
    //console.log(JSON.stringify(pluginResult));
    pluginResult.state = pluginResult.state.substring(13);
    rootScope.$emit('iBeacon:state', pluginResult);
    rootScope.$apply();
  };

  delegate.didStartMonitoringForRegion = function(pluginResult) {
    console.log('didStartMonitoringForRegion:', pluginResult);
  };

  delegate.didRangeBeaconsInRegion = function(pluginResult) {
    //window.alert('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
    //console.log(JSON.stringify(pluginResult));
    //console.log(pluginResult);
    if (pluginResult.beacons.length === 0) {
      return;
    }
    rootScope.$emit('iBeacon:range', pluginResult);
    rootScope.$apply();
  };

  // Set the delegare object to use.
  cordova.plugins.locationManager.setDelegate(delegate);

  // Start monitoring and ranging our beacons.
  for (var r in beaconRegions) {
    var region = beaconRegions[r];

    var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(region.id,
      region.uuid, region.major, region.minor);

    // Start monitoring.
    cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion).fail(
      console.error).done();

    // Start ranging.
    cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion).fail(
      console.error).done();
  }
};

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
  .factory('iBeaconBroadcastingService', function($rootScope) {
    /*function onDeviceReady() {
     console.info('NOTIFY  Device is ready.  Registering with GCM server');
     //register with google GCM server
     //var pushNotification = window.plugins.pushNotification;
     cordova.plugins.locationManager.requestAlwaysAuthorization();
     cordova.plugins.locationManager.enableDebugNotifications();
     cordova.plugins.locationManager.enableDebugLogs();
     startScanForBeacons($rootScope);
     }*/

    return {
      initialize: function() {
        //console.info('Start beacon scanning  initializing');
        //document.addEventListener('deviceready', onDeviceReady, false);
        cordova.plugins.locationManager.requestAlwaysAuthorization();
        cordova.plugins.locationManager.enableDebugNotifications();
        cordova.plugins.locationManager.enableDebugLogs();
        startScanForBeacons($rootScope);

      },
      registerID: function() {
        /*//Insert code here to store the user's ID on your notification server.
         //You'll probably have a web service (wrapped in an Angular service of course) set up for this.
         //For example:
         MyService.registerNotificationID(id).then(function (response) {
         if (response.data.Result) {
         console.info('NOTIFY  Registration succeeded');
         } else {
         console.error('NOTIFY  Registration failed');
         }
         });*/
      },
      //unregister can be called from a settings area.
      unregister: function() {
        /*console.info('unregister');
         var push = window.plugins.pushNotification;
         if (push) {
         push.unregister(function () {
         console.info('unregister success');
         });
         }
         */
      }
    };
  })

.run(function($ionicPlatform, iBeaconBroadcastingService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    window.locationManager = cordova.plugins.locationManager;
    iBeaconBroadcastingService.initialize();
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
