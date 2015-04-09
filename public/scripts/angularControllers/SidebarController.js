/**
 * SidebarController.js
 * @file Controller that handles formatting of user stocks.
 * Will read from database (Firebase) when needed.
 * @author James Teague II jtteague13@gmail.com
 * @since 4/7/2015
 */

sidebarApp.controller("SidebarCtrl", ["$firebaseObject",
  function($firebaseObject) {
    var ref = new Firebase("https://qb-stock-exchange.firebaseio.com/");
    // download users's profile data into a local object
    // all server changes are applied in realtime
    $scope.profile = $firebaseObject(ref.child('users').child(authData.uid));
  }
]);