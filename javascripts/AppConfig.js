"use strict";

let isAuth = (AuthFactory) => new Promise((resolve, reject)=>{
 if (AuthFactory.isAuthenticated()){
   resolve();
 } else {
   reject();
 }
});

app.run(function(FIREBASE_CONFIG, $rootScope, $location, AuthFactory){
  firebase.initializeApp(FIREBASE_CONFIG);
  $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
    let logged = AuthFactory.isAuthenticated();
    let appTo;

    if (currRoute.originalPath){
     appTo = currRoute.originalPath.indexOf("/auth") !== -1;
   }

    if (!appTo && !logged) {
      event.preventDefault();
      $location.path("/auth");
    }

  });
});

app.config(function($routeProvider) {
  $routeProvider
    .when('/auth', {
      templateUrl: 'partials/auth.html',
      controller: 'AuthCtrl'
    })
    .when('/map', {
      templateUrl: 'partials/map.html',
      controller: 'MapCtrl',
      resolve: {isAuth}
    })
    .when('/myplaces', {
      templateUrl: 'partials/places.html',
      controller: 'PlacesCtrl',
      resolve: {isAuth}
    })
    .when('/mycontacts', {
      templateUrl: 'partials/contacts.html',
      controller: 'ContactsCtrl',
      resolve: {isAuth}
    })
    .when('/myprofile', {
      templateUrl: 'partials/profile.html',
      controller: 'ProfileCtrl',
      resolve: {isAuth}
    })
    .when('/logout', {
      templateUrl: 'partials/auth.html',
      controller: 'AuthCtrl',
      resolve: {isAuth}
    })
    .otherwise('/auth');
  });