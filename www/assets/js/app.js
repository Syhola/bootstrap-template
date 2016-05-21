var app = angular.module('bootstraptemplate', [
  'ngRoute',
  'firebase'
]);

app.config(['$routeProvider',
  function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'partials/register.html',
        controller: 'registerCtrl'})
      .when('/chat', {
        templateUrl: 'partials/chat.html',
        controller: ''})
      .otherwise({redirectTo: '/'
    });
}]);

app.controller('logoutCtrl', ['$scope', '$location', '$route', '$firebaseAuth', '$firebaseObject', '$firebaseArray',
  function ($scope, $location, $route, $firebaseAuth, $firebaseObject, $firebaseArray){

    // Fonction logout
    $scope.logout = function() {

      var ref = new Firebase('https://bootstrap-template.firebaseio.com/');

      // Check authification
        var authData = ref.getAuth();
        $scope.authObj = $firebaseAuth(ref);

        if (authData) {
          ref.unauth();
          $location.path('/register');
        } else {
          console.log("User is already logged out");
          alert('User is already logged out.');
        }

      }

}]);

app.controller('registerCtrl', ['$scope', '$location', '$route', '$firebaseAuth', '$firebaseObject', '$firebaseArray',
  function ($scope, $location, $route, $firebaseAuth, $firebaseObject, $firebaseArray){

    console.log("Hello World!");

    var ref = new Firebase('https://bootstrap-template.firebaseio.com/');

    // Check authification
      var authData = ref.getAuth();
      $scope.authObj = $firebaseAuth(ref);

      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        $scope.youremail = authData.password.email;
        var uid = authData.uid;
      } else {
        console.log("User is logged out");
      }

    // Fonction create user
        $scope.register = function() {

          $scope.authObj.$createUser({
            email: $scope.inputEmail,
            password: $scope.inputPassword
          }).then(function(userData) {
            console.log("User " + userData.uid + " created successfully!");

            return $scope.authObj.$authWithPassword({
              email: $scope.inputEmail,
              password: $scope.inputPassword
            });
          }).then(function(authData) {
            console.log("Logged in as:", authData.uid);
            $location.path('/chat');
          }).catch(function(error) {
            console.error("Error: ", error);
            alert(error);
          });

      }

  }]);
