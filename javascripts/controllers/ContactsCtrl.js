"use strict";

app.controller("ContactsCtrl", function($scope, $rootScope, $timeout, $location, $routeParams, AuthFactory, UserFactory, GoogleMapsFactory, ContactsFactory) {
$scope.contacts = [];
$scope.selectedContact;

getContacts();

function getContacts() {
  ContactsFactory.getContacts($rootScope.user.uid).then(function(usersContacts) {
    $scope.contacts = usersContacts;
  });
}

$scope.deleteContact = function(contactId) {
  ContactsFactory.deleteContact(contactId).then(function() {
    alertify.error('Contact removed.');
    getContacts();
  });
};

$scope.viewContact = function(contact) {
 $scope.selectedContact = contact;
};

$scope.editContact = function(contact) {
  ContactsFactory.editContact(contact).then(function() {
    alertify.success('Contact updated.');
    getContacts();
  })
};

$scope.addContact = function(contact) {
  ContactsFactory.addContact($rootScope.user.uid, contact).then(function() {
    alertify.success('Contact added.');
    getContacts();
  });
};


});