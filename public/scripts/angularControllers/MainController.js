app.controller("MainCtrl", ["$scope", "$firebaseAuth",
  function($scope, $firebaseAuth) {
    var ref = new Firebase("https://docs-sandbox.firebaseio.com");
    auth = $firebaseAuth(ref);

    $scope.login = function(useremail, userpassword) {
      $scope.authData = null;
      $scope.error = null;
      console.log("Called.");
      auth.$authWithPassword({
        email: useremail,
        password: userpassword
      }).then(function(authData) {
        $scope.authData = authData;
        alertify.success("Logged in as:", authData.uid);
      }).catch(function(error) {
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
      });
    };

    $scope.thirdPartyLogin = function(provider){
      auth.$authWithOAuthPopup(provider).then(function(authData) {
        $scope.authData = authData;
        alertify.success("Logged in as:", authData.uid);
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
    }
]);

app.controller("SidebarCtrl", ["$firebaseObject",
  function($firebaseObject) {
    var ref = new Firebase("https://qb-stock-exchange.firebaseio.com/");
    // download users's profile data into a local object
    // all server changes are applied in realtime
    $scope.profile = $firebaseObject(ref.child('users').child(authData.uid));
  }
]);