app.controller("MainCtrl", ["$scope", "$firebaseAuth", "$firebaseObject", "$http",
  function($scope, $firebaseAuth, $firebaseObject, $http) {
    var ref = new Firebase("https://qb-stock-exchange.firebaseio.com/");
    auth = $firebaseAuth(ref);
    var d = new Date();
    $http({
      method: 'POST',
      url: '/genLog',
      data: { "_id": d.getTime(),
              "time": d.toLocaleTimeString(),
              "date": d.toLocaleDateString(),
              "ua": navigator.userAgent
            }
    })
    .success(function(data, status, headers, config){console.log(data, status)})
    .error(function(data, status, headers, config){console.log(status, data)});
    $scope.login = function(useremail, userpassword) {
      $scope.authData = null;
      $scope.error = null;
      // console.log("Called.", useremail, userpassword);
      auth.$authWithPassword({
        email: useremail,
        password: userpassword
      }).then(function(authData) {
        $scope.authData = authData;
        // download users's profile data into a local object
        // all server changes are applied in realtime
        var user = $firebaseObject(ref.child('users').child($scope.authData.uid));
        user.$bindTo($scope, "profile").then(function(){
          console.log($scope.profile)
        });
        $scope.logUser(authData.uid);
        alertify.success("Logged in successfully!");
        if(authData.password.isTemporaryPassword){
          alertify.alert("You have logged in with temporary password and you must change it.");
          $scope.changePassword()
        }
      }).catch($scope.loginError(exception));
    };

    $scope.loginError = function(error) {
      var isMobile = false;
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        isMobile = true;
      }
      switch (error.code){
        case ErrorEnum.INVALID_PASSWORD:
          if(isMobile){
            var scrollY = window.pageYOffset;
            alertify.error("Password is incorrect.");
            $(".alertify-logs").css("top", scrollY+"px");
          }
          else{
            alertify.error("Password is incorrect.");
          }
          break;
        case ErrorEnum.INVALID_USER:
          if(isMobile){
            var scrollY = window.pageYOffset;
            alertify.error(error.message);
            $(".alertify-logs").css("top", scrollY+"px");
          }
          else{
            alertify.error(error.message);
          }
          break;
        case ErrorEnum.INVALID_EMAIL:
          if(isMobile){
            var scrollY = window.pageYOffset;
            alertify.error("Not a valid format of email address.");
            $(".alertify-logs").css("top", scrollY+"px");
          }
          else{
            alertify.error("Not a valid format of email address.");
          }
          break;
      }
    };

    $scope.logout = function(){
      auth.$unauth();
      $scope.authData = null;
    };

    $scope.thirdPartyLogin = function(provider){
      auth.$authWithOAuthPopup(provider).then(function(authData) {
        $scope.authData = authData;
        // download users's profile data into a local object
        // all server changes are applied in realtime
        var user = $firebaseObject(ref.child('users').child($scope.authData.uid));
        user.$bindTo($scope, "profile").then(function(){
          console.log($scope.profile)
        });
        $scope.logUser(authData.uid);
        alertify.success("Logged in successfully!");
      }).catch(function(error) {
          switch(error.code){
            case ErrorEnum.USER_CANCELLED:
              alertify.log("User cancelled action.");
              break;
            case ErrorEnum.INVALID_PASSWORD:
              alertify.error("Password is incorrect.");
              break;
            case ErrorEnum.PROVIDER_ERROR:
              alertify.error(error.message);
              break;
            case ErrorEnum.NETWORK_ERROR:
              alertify.error(error.message);
              break;
            default:
              alertify.alert(error.code + " " + error.message + " " + provider);
          }
        });
    };
    //needs significant work
    $scope.changePassword = function(){
      $scope.authObj.$changePassword({
        email: $scope.authData.password.email,
        oldPassword: "mypassword",
        newPassword: "otherpassword"
      }).then(function() {
        console.log("Password changed successfully!");
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    };

    $scope.buyStock = function(){

    };

    $scope.logUser = function(uid){
			console.log(uid);
      var d = new Date();
			$http.post("/userLog",{
       "_id": d.getTime(),
       "user": uid,
       "time": d.toLocaleTimeString(),
       "date": d.toLocaleDateString()
      });
		}

  }
]);

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
      //console.log($scope.qbs);
    }
]);