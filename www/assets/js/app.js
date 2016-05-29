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

app.controller('mainCtrl', ['$scope', '$location', '$route', '$firebaseAuth', '$firebaseObject', '$firebaseArray', // No problem
  function ($scope, $location, $route, $firebaseAuth, $firebaseObject, $firebaseArray){

    var ref = new Firebase('https://bootstrap-template.firebaseio.com/');

    // Check authification
      var authData = ref.getAuth();
      $scope.authObj = $firebaseAuth(ref);

      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        if (authData.password.isTemporaryPassword) {
            $location.path('/modify_profile');
        } else {
          $location.path('/chat');
        }
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

    var ref = new Firebase('https://bootstrap-template.firebaseio.com/');

    $scope.spinner = false;
    $scope.error = false;
    $scope.error_email = false;

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

          $scope.spinner = true;

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
              refUsers.child($scope.inputUser).set({
                    id: userData.uid,
                    created_at: Date.now(),
                    date: day + '/' + month + '/' + year + ' at ' + hour + 'h' + minute
              });

              var refUsersID = new Firebase('https://bootstrap-template.firebaseio.com/usersID');
              refUsersID.child(userData.uid).set({
                username: $scope.inputUser,
                created_at: Date.now(),
                date: day + '/' + month + '/' + year + ' at ' + hour + 'h' + minute
              })

              return $scope.authObj.$authWithPassword({
                email: $scope.inputEmail,
                password: $scope.inputPassword
              });
            }).then(function(authData) {
              console.log("Logged in as:", authData.uid);
              $scope.spinner = false;
              $scope.error = false;
              $scope.error_email = false;
              $location.path('/chat');
            }).catch(function(error) {
              console.error("Error: ", error);
              $scope.spinner = false;
              $scope.error = true;
              $scope.error_email = true;
              $scope.inputPassword = "";
            });

      }

  }]);

app.controller('loginCtrl', ['$scope', '$location', '$route', '$firebaseAuth', '$firebaseObject', '$firebaseArray',
  function ($scope, $location, $route, $firebaseAuth, $firebaseObject, $firebaseArray){

    $scope.spinner = false;
    $scope.error_email = false;
    $scope.error = false;

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

    // Fonction login user
        $scope.login = function() {

          $scope.spinner = true;

          $scope.authObj.$authWithPassword({
            email: $scope.inputEmail,
            password: $scope.inputPassword
          }).then(function(authData) {
            console.log("Logged in as:", authData.uid);
            $scope.spinner = false;
            $scope.error_email = false;
            if (authData.password.isTemporaryPassword) {
              $location.path('/modify_profile');
            } else {
              $location.path('/chat');
            }
          }).catch(function(error) {
            console.error("Authentication failed:", error);
            $scope.error = true;
            $scope.spinner = false;
            $scope.error_email = true;
            $scope.inputPassword = "";
          });

      }

  }]);

app.controller('reset_passwordCtrl', ['$scope', '$location', '$route', '$firebaseAuth', '$firebaseObject', '$firebaseArray',
  function ($scope, $location, $route, $firebaseAuth, $firebaseObject, $firebaseArray){

    var ref = new Firebase('https://bootstrap-template.firebaseio.com/');

    $scope.spinner = false;

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

          $scope.spinner = true;

          $scope.authObj.$resetPassword({
            email: $scope.inputEmail
          }).then(function() {
            console.log("Password reset email sent successfully!");
            $scope.spinner = false;
            alert('Password reset email sent successfully!');
            $location.path('/login');
          }).catch(function(error) {
            $scope.spinner = false;
            console.error("Error: ", error);
          });

      }

  }]);

app.controller('profileCtrl', ['$scope', '$location', '$route', '$firebaseAuth', '$firebaseObject', '$firebaseArray',
  function ($scope, $location, $route, $firebaseAuth, $firebaseObject, $firebaseArray){

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })

    $scope.spinner = false;

    var ref = new Firebase('https://bootstrap-template.firebaseio.com/');

    // Check authification
      var authData = ref.getAuth();
      $scope.authObj = $firebaseAuth(ref);

      $scope.error_pw = false;

      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.password.email);
      } else {
        console.log("User is logged out");
        $location.path('/');
      }

      if (authData.password.isTemporaryPassword) {
        $scope.check_pass = true;
      } else {
        $scope.check = true;
        $scope.check_pass = false;
      }

      $scope.email = authData.password.email;
      $scope.user_id = authData.uid;

      $('#myModal').on('shown.bs.modal', function () {
        $('#inputEmailDelete').focus()
      })

      /*ref.once("value", function(snapshot) {
        var firstNameSnapshot = snapshot.child("name/first");
        var firstName = firstNameSnapshot.val();
        // firstName === "Fred"
      });*/

      $scope.open_modal = function () {

        if ($scope.inputNewPassword === $scope.inputNewPasswordConfirm) {
          $('#myModal2').modal('show');
          $('#myModal2').on('shown.bs.modal', function () {
            $('#inputPasswordValidation').focus()
          })
          $scope.error_pw = false;
        } else {
          $scope.error_pw = true;
          $scope.inputNewPasswordConfirm = "";
        }

      }

      $scope.change = function () {

        $scope.spinner = true;

        if ($scope.inputNewPassword == $scope.inputNewPasswordConfirm) {
          $scope.authObj.$changePassword({
            email: authData.password.email,
            oldPassword: $scope.inputPasswordValidation,
            newPassword: $scope.inputNewPassword
          }).then(function() {
            console.log("Password changed successfully!");

            // Re-Log with new password
            $scope.authObj.$authWithPassword({
              email: authData.password.email,
              password:$scope.inputNewPassword
            }).then(function(authData) {
              console.log("Logged with new password as:", authData.uid);
            }).catch(function(error) {
              console.error("Reloging failed:", error);
            });

            $('#myModal2').modal('hide');
            $scope.spinner = false;
            $scope.success = true;
            $scope.check = false;
            $scope.inputNewPassword = "";
            $scope.inputNewPasswordConfirm = "";
          }).catch(function(error) {
            console.error("Error: ", error);
            $scope.spinner = false;
          });
        }

      }

      $scope.delete = function () {

        if (authData.password.email == $scope.inputEmailDelete) {
          $scope.spinner = true;
          $scope.authObj.$removeUser({
            email: $scope.inputEmailDelete,
            password: $scope.inputPasswordDelete
          }).then(function() {
            console.log("User removed successfully!");
            $('#myModal').modal('hide');
            $scope.spinner = false;
            $location.path('/');
          }).catch(function(error) {
            console.error("Error: ", error);
            $scope.spinner = false;
          });
        } else {
          console.log('The specified email is not correct.');
          $scope.spinner = false;
        }

      }

  }]);

app.controller('chatCtrl', ['$scope', '$location', '$route', '$firebaseAuth', '$firebaseObject', '$firebaseArray', '$q',
  function ($scope, $location, $route, $firebaseAuth, $firebaseObject, $firebaseArray, $q){

    var ref = new Firebase('https://bootstrap-template.firebaseio.com/');

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })

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

      var refUsersID = new Firebase('https://bootstrap-template.firebaseio.com/usersID');
      var username = "";
      refUsersID.once("value", function(snapshot) {
        var usernamesnap = snapshot.child(authData.uid + "/username");
        username = usernamesnap.val();
        console.log(username);
      });

      $scope.send = function () {

        var d = new Date();
        var day = (d.getDate()<10?'0':'') + d.getDate()
        var month = ((d.getMonth() + 1)<10?'0':'') + (d.getMonth() + 1);
        var year = d.getFullYear();
        var hour = (d.getHours()<10?'0':'') + d.getHours();
        var minute = (d.getMinutes()<10?'0':'') + d.getMinutes();

        $scope.messages.$add({
          text: $scope.newMessageText,
          user_id: authData.uid,
          username: username,
          time: Date.now(),
          date: day + '/' + month + '/' + year + ' at ' + hour + 'h' + minute
        });

        $scope.newMessageText = "";

      }

  }]);
