//controllers.controller('firstCtrl', ['$scope', '$location', '$route', '$firebaseAuth', '$firebaseObject', '$firebaseArray'
firstCtrl = function ($scope, $location, $route, $firebaseAuth, $firebaseObject, $firebaseArray) {

  var ref = new Firebase('https://bootstrap-template.firebaseio.com/');

  // Check authification
    var authData = ref.getAuth();
    $scope.authObj = $firebaseAuth(ref);

    if (authData) {
      console.log("User " + authData.uid + " is logged in with " + authData.provider);
      $scope.log = true;
      $scope.youremail = authData.password.email;
      var uid = authData.uid;
    } else {
      console.log("User is logged out");
    }

  // Fonction create user
      $scope.register = function(){

        $scope.authObj.$createUser({
          email: $scope.email,
          password: $scope.password
        }).then(function(userData) {
          console.log("User " + userData.uid + " created successfully!");

          return $scope.authObj.$authWithPassword({
            email: $scope.email,
            password: $scope.password
          });
        }).then(function(authData) {
          console.log("Logged in as:", authData.uid);
          $location.path('/stats');
          isAuth = true;
        }).catch(function(error) {
          console.error("Error: ", error);
        });

    }

  // Fonction logout
  $scope.logout = function(){

      ref.unauth();
      $route.reload();

    }

}
//]);
