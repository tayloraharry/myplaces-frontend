"use strict";

app.controller("PlacesCtrl", function($scope, $rootScope, $location, $routeParams, AuthFactory, UserFactory, GoogleMapsFactory, ContactsFactory) {
$scope.myplaces = [];
$scope.selectedPlace = {};
$scope.contacts;
$scope.IsHidden = true;
$scope.ShowHide = function () {
$scope.IsHidden = $scope.IsHidden ? false : true;
};
getLocations();
getContacts();

function getLocations() {
GoogleMapsFactory.getLocations($rootScope.user.uid).then(function(response) {
$scope.myplaces = response;
});
}

function getContacts() {
ContactsFactory.getContacts($rootScope.user.uid).then(function(response) {
$scope.contacts = response;
});
}



$scope.addNewContact = function() {
 ContactsFactory.addContact($rootScope.user.uid, $scope.selectedPlace.recipient_name, $scope.selectedPlace.recipient_phone).then(function() {
 });
};

$scope.viewLocation = function(selectedPlace) {
  $scope.selectedPlace = selectedPlace;
};

$scope.deleteLocation = function(selectedPlace) {
  GoogleMapsFactory.deleteLocation(selectedPlace).then(function() {
    alertify.error('myPlace removed.');
    getLocations();
  });
};

$scope.sendText = function(selectedPlace) {
console.log(selectedPlace);
};






});
