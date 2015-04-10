app.controller("MainCtrl", ["$scope", "$firebaseAuth",
  function($scope, $firebaseAuth) {
    var ref = new Firebase("https://docs-sandbox.firebaseio.com");
    auth = $firebaseAuth(ref);

    $scope.login = function() {
      $scope.authData = null;
      $scope.error = null;

      auth.$authWithPassword({
        email: "my@email.com",
        password: "mypassword"
      }).then(function(authData) {
        $scope.authData = authData;
        var isMobile = false;
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
          isMobile = true;
        }
        alertify.success("Logged in as:", authData.uid);
      }).catch(function(error) {
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
              alertify.alert(error.code + ": Please contact webmaster");
          }
        });
      }
    }
]);