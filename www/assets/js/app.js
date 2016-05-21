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
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'loginCtrl'})
      .when('/reset_password', {
        templateUrl: 'partials/reset_password.html',
        controller: 'reset_passwordCtrl'})
      .when('/profile', {
        templateUrl: 'partials/profile.html',
        controller: 'profileCtrl'})
      .when('/modify_profile', {
        templateUrl: 'partials/modify_profile.html',
        controller: 'profileCtrl'})
      .when('/chat', {
        templateUrl: 'partials/chat.html',
        controller: 'chatCtrl'})
      .otherwise({redirectTo: '/'
    });
}]);

app.controller('mainCtrl', ['$scope', '$location', '$route', '$firebaseAuth', '$firebaseObject', '$firebaseArray',
  function ($scope, $location, $route, $firebaseAuth, $firebaseObject, $firebaseArray){

    console.log("Hello World!");

    var ref = new Firebase('https://bootstrap-template.firebaseio.com/');

    // Check authification
      var authData = ref.getAuth();
      $scope.authObj = $firebaseAuth(ref);

      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        $location.path('/chat');
      } else {
        console.log("User is logged out");
        $location.path('/');
      }

    // Fonction logout
    $scope.logout = function() {

      var ref = new Firebase('https://bootstrap-template.firebaseio.com/');

      // Check authification
        var authData = ref.getAuth();
        $scope.authObj = $firebaseAuth(ref);

        if (authData) {
          ref.unauth();
          $location.path('/login');
        } else {
          console.log("User is already logged out");
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
        $location.path('/chat');
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

app.controller('loginCtrl', ['$scope', '$location', '$route', '$firebaseAuth', '$firebaseObject', '$firebaseArray',
  function ($scope, $location, $route, $firebaseAuth, $firebaseObject, $firebaseArray){

    console.log("Hello World!");

    var ref = new Firebase('https://bootstrap-template.firebaseio.com/');

    // Check authification
      var authData = ref.getAuth();
      $scope.authObj = $firebaseAuth(ref);

      $scope.error = false;

      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        $location.path('/chat');
      } else {
        console.log("User is logged out");
      }

    // Fonction login user
        $scope.login = function() {

          $scope.authObj.$authWithPassword({
            email: $scope.inputEmail,
            password: $scope.inputPassword
          }).then(function(authData) {
            console.log("Logged in as:", authData.uid);
            if (authData.password.isTemporaryPassword) {
              $location.path('/modify_profile');
            } else {
              $location.path('/chat');
            }
          }).catch(function(error) {
            console.error("Authentication failed:", error);
            $scope.error = true;
          });

      }

  }]);

app.controller('reset_passwordCtrl', ['$scope', '$location', '$route', '$firebaseAuth', '$firebaseObject', '$firebaseArray',
  function ($scope, $location, $route, $firebaseAuth, $firebaseObject, $firebaseArray){

    console.log("Hello World!");

    var ref = new Firebase('https://bootstrap-template.firebaseio.com/');

    // Check authification
      var authData = ref.getAuth();
      $scope.authObj = $firebaseAuth(ref);

      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        $location.path('/chat');
      } else {
        console.log("User is logged out");
      }

    // Fonction change password
        $scope.reset_password = function() {

          $scope.authObj.$resetPassword({
            email: $scope.inputEmail
          }).then(function() {
            console.log("Password reset email sent successfully!");
            alert('Password reset email sent successfully!');
            $location.path('/login');
          }).catch(function(error) {
            console.error("Error: ", error);
          });

      }

  }]);

app.controller('chatCtrl', ['$scope', '$location', '$route', '$firebaseAuth', '$firebaseObject', '$firebaseArray',
  function ($scope, $location, $route, $firebaseAuth, $firebaseObject, $firebaseArray){

    console.log("Hello World!");

    var ref = new Firebase('https://bootstrap-template.firebaseio.com/');

    // Check authification
      var authData = ref.getAuth();
      $scope.authObj = $firebaseAuth(ref);

      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        $location.path('/chat');
      } else {
        console.log("User is logged out");
        $location.path('/');
      }

  }]);

app.controller('profileCtrl', ['$scope', '$location', '$route', '$firebaseAuth', '$firebaseObject', '$firebaseArray',
  function ($scope, $location, $route, $firebaseAuth, $firebaseObject, $firebaseArray){

    console.log("Hello World!");

    var ref = new Firebase('https://bootstrap-template.firebaseio.com/');

    // Check authification
      var authData = ref.getAuth();
      $scope.authObj = $firebaseAuth(ref);

      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
      } else {
        console.log("User is logged out");
        $location.path('/');
      }

      if (authData.password.isTemporaryPassword) {
        $scope.check = true;
        $scope.password = "";
        $scope.passwordConfirm = "";
      } else {
        $scope.check = false;
        $scope.password = "Only you know it";
        $scope.passwordConfirm = "Only you know it";
      }

      $scope.email = authData.password.email;
      $scope.user = authData.uid;


      $scope.change = function () {



      }

  }]);
