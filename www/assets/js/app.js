var app = angular.module('bootstraptemplate', [
  'ngRoute',
  'controllers',
  'firebase'
]);

app.config(['$routeProvider',
  function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'partials/register.html',
        controller: 'firstCtrl'})
      .when('/chat', {
        templateUrl: 'partials/chat.html',
        controller: 'firstCtrl'})
      .otherwise({redirectTo: '/'
    });
}]);

app.controller('firstCtrl', ['$scope', '$location', '$route', '$firebaseAuth', '$firebaseObject', '$firebaseArray',
  function ($scope, $location, $route, $firebaseAuth, $firebaseObject, $firebaseArray){
  }]);

var bootstraptemplateControllers = angular.module('controllers', []);
