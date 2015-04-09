/**
 * QBController.js
 * @file Controller that handles formatting of all Quarterbacks.
 * Will read from database (Firebase) when needed.
 * @author James Teague II jtteague13@gmail.com
 * @since 4/7/2015
 */

app.factory("quarterbacks", ["$firebaseArray",
  function($firebaseArray) {
    // create a reference to the Firebase where we will store our data
    var ref = new Firebase("https://qb-stock-exchange.firebaseio.com/qb");

    // this uses AngularFire to create the synchronized array
    return $firebaseArray(ref);
  }
]);

app.controller("QBCtrl", ["$scope", "quarterbacks",
	// we pass our new quarterbacks factory into the controller
	function($scope, quarterbacks) {
    	// we add quarterbacks array to the scope to be used in our ng-repeat
    	$scope.qbs = quarterbacks;
  	}
]);