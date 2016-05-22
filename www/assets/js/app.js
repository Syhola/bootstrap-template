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

    //$scope.users = $firebaseArray(refUsers);

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

          var d = new Date();
          var day = (d.getDate()<10?'0':'') + d.getDate()
          var month = ((d.getMonth() + 1)<10?'0':'') + (d.getMonth() + 1);
          var year = d.getFullYear();
          var hour = (d.getHours()<10?'0':'') + d.getHours();
          var minute = (d.getMinutes()<10?'0':'') + d.getMinutes();

          $scope.authObj.$createUser({
            email: $scope.inputEmail,
            password: $scope.inputPassword
          }).then(function(userData) {
            console.log("User " + userData.uid + " created successfully!");

            var refUsers = new Firebase('https://bootstrap-template.firebaseio.com/users/');
            var uniqueUserRef = refUsers.child(userData.uid);

            uniqueUserRef.set({
                  username: $scope.inputUser,
                  created_at: Date.now(),
                  date: day + '/' + month + '/' + year + ' at ' + hour + 'h' + minute
            });

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

    // Push messages

      var refMessage = new Firebase('https://bootstrap-template.firebaseio.com/messages');
      $scope.messages = $firebaseArray(refMessage);

      $scope.send = function () {

        var refUsers = new Firebase('https://bootstrap-template.firebaseio.com/users');

        var refMessage = new Firebase('https://bootstrap-template.firebaseio.com/messages');
        $scope.messages = $firebaseArray(refMessage);

        refUsers.child(authData.uid + "/username").on('value', function(username) {

          var d = new Date();
          var day = (d.getDate()<10?'0':'') + d.getDate()
          var month = ((d.getMonth() + 1)<10?'0':'') + (d.getMonth() + 1);
          var year = d.getFullYear();
          var hour = (d.getHours()<10?'0':'') + d.getHours();
          var minute = (d.getMinutes()<10?'0':'') + d.getMinutes();

          $scope.messages.$add({
            text: $scope.newMessageText,
            user_id: authData.uid,
            username: username.val(),
            time: Date.now(),
            date: day + '/' + month + '/' + year + ' at ' + hour + 'h' + minute
          });

          $scope.newMessageText = "";

        });
        
      }

  }]);

app.controller('profileCtrl', ['$scope', '$location', '$route', '$firebaseAuth', '$firebaseObject', '$firebaseArray',
  function ($scope, $location, $route, $firebaseAuth, $firebaseObject, $firebaseArray){

    console.log("Hello World!");

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })

    var ref = new Firebase('https://bootstrap-template.firebaseio.com/');

    // Check authification
      var authData = ref.getAuth();
      $scope.authObj = $firebaseAuth(ref);

      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.password.email);
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

      var modif = false;

      $scope.change = function () {

        if ($scope.inputNewPassword == $scope.inputNewPasswordConfirm) {
          $scope.authObj.$changePassword({
            email: authData.password.email,
            oldPassword: $scope.inputPasswordValidation,
            newPassword: $scope.inputNewPassword
          }).then(function() {
            console.log("Password changed successfully!");
            $('#myModal2').modal('hide');
            $location.path('/profile');
          }).catch(function(error) {
            console.error("Error: ", error);
          });
        }

      }

      $scope.delete = function () {

        if (authData.password.email == $scope.inputEmailDelete) {
          $scope.authObj.$removeUser({
            email: $scope.inputEmailDelete,
            password: $scope.inputPasswordDelete
          }).then(function() {
            console.log("User removed successfully!");
            $('#myModal').modal('hide');
            $location.path('/');
          }).catch(function(error) {
            console.error("Error: ", error);
          });
        } else {
          console.log('The specified email is not correct.');
        }

      }

  }]);
