"use strict";

app.factory("ContactsFactory", function($q, $http, FIREBASE_CONFIG) {

  let addContact = (uid, newContact) => {
    return $q((resolve, reject) => {
      $http.post(`${FIREBASE_CONFIG.databaseURL}/usercontacts.json`,
        JSON.stringify({
          uid: uid,
          firstname: newContact.firstname,
          lastname: newContact.lastname,
          phone: newContact.phone,
          email: newContact.email
        })
      )
      .success(function(storedUserSuccess){
        resolve(storedUserSuccess);
      })
      .error(function(storedUserFailure){
        reject(storedUserFailure);
      });
    });
  };

  let getContacts = (userId) => {
    return $q((resolve, reject) => {
    $http.get(`${FIREBASE_CONFIG.databaseURL}/usercontacts.json?orderBy="uid"&equalTo="${userId}"`)
      .success(function(userContactObject){
        let userContacts = [];
        Object.keys(userContactObject).forEach(function(key) {
          userContactObject[key].id= key;
          userContacts.push(userContactObject[key]);
        });
        resolve(userContacts);
      }).error(function(error){
        reject(error);
      });
    });
  };

  var deleteContact = function(contactId){
    return $q((resolve, reject)=> {
      $http.delete(`${FIREBASE_CONFIG.databaseURL}/usercontacts/${contactId}.json`
      ).success(function(deleteResponse) {
        resolve(deleteResponse);
      }).error(function(deleteError) {
        reject(deleteError);
      });
    });
  };

  var editContact = function(editedContact){
    return $q((resolve, reject)=> {
      $http.put(`${FIREBASE_CONFIG.databaseURL}/usercontacts/${editedContact.id}.json`, JSON.stringify({
         firstname: editedContact.firstname,
         lastname: editedContact.lastname,
         phone: editedContact.phone,
         email: editedContact.email,
         uid: editedContact.uid
        })
      ).success(function(editResponse) {
        resolve(editResponse);
      }).error(function(editError) {
        reject(editError);
      });
    });
  };

  return {
            addContact:addContact,
            getContacts:getContacts,
            deleteContact:deleteContact,
            editContact:editContact
          };

});