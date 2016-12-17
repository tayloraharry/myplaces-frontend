"use strict";

app.factory("GoogleMapsFactory", function($q, $http, FIREBASE_CONFIG) {

  let addLocation = (uid, newLocation) => {
    return $q((resolve, reject) => {
      $http.post(`${FIREBASE_CONFIG.databaseURL}/userplaces.json`,
        JSON.stringify({
          uid: uid,
          placeid: newLocation.placeid,
          photo: newLocation.photo,
          title: newLocation.title,
          location: newLocation.location,
          address: newLocation.address,
          phone_number: newLocation.phone_number,
          website: newLocation.website,
          rating: newLocation.rating,
          price: newLocation.price,
          reviews: newLocation.reviews,
          hours: newLocation.hours,
          detailed_icon: newLocation.detailed_icon,
          types: newLocation.types
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

  let getLocations = (userId) => {
    return $q((resolve, reject) => {
    $http.get(`${FIREBASE_CONFIG.databaseURL}/userplaces.json?orderBy="uid"&equalTo="${userId}"`)
      .success(function(userLocationObject){
        let userLocations = [];
        Object.keys(userLocationObject).forEach(function(key) {
          userLocationObject[key].id= key;
          userLocations.push(userLocationObject[key]);
        });
        resolve(userLocations);
      }).error(function(error){
        reject(error);
      });
    });
  };

  var deleteLocation = function(locationId){
    return $q((resolve, reject)=> {
      $http.delete(`${FIREBASE_CONFIG.databaseURL}/userplaces/${locationId}.json`
      ).success(function(deleteResponse) {
        resolve(deleteResponse);
      }).error(function(deleteError) {
        reject(deleteError);
      });
    });
  };

  return {
            addLocation:addLocation,
            getLocations:getLocations,
            deleteLocation:deleteLocation
          };

});