"use strict";

app.controller("ProfileCtrl", function($scope, $rootScope, $location, $routeParams, AuthFactory, UserFactory, GoogleMapsFactory, ContactsFactory) {
$scope.myinfo;
$scope.editing = false;


getUserDetails();

function getUserDetails () {
  UserFactory.getUserDetails($rootScope.user.uid).then(function(response) {
    $scope.myinfo = response;
  })
}

$scope.editUserDetails =function(editedUserInfo) {
  console.log(editedUserInfo);
  UserFactory.editUser($rootScope.user.uid, editedUserInfo).then(function(response) {
  getUserDetails();
  })
}

$scope.edit = function(){
  $scope.editing = !$scope.editing;
}




});
