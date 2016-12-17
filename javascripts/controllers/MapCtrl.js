"use strict";

app.controller("MapCtrl", function($scope, $rootScope, $timeout, $location, $routeParams, AuthFactory, UserFactory, GoogleMapsFactory) {
    $scope.lat;
    $scope.lng;
    $scope.loading = true;
    $scope.selectedPlace = {};
    $scope.myplaces = [];
    let options = {
        componentRestrictions: {
            country: "us"
        }
    };

    let inputFrom = document.getElementById('from');
    let autocompleteFrom = new google.maps.places.Autocomplete(inputFrom, options);
    google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
        let place = autocompleteFrom.getPlace();
        $scope.lat = place.geometry.location.lat();
        $scope.lng = place.geometry.location.lng();
        $scope.$apply();
        initialize();
    });

    function initialize() {
        $scope.markers = [];
        var openedInfoWindow = null;
        var bounds = new google.maps.LatLngBounds();
        var map;
        var radius = 3000,

            center = new google.maps.LatLng($scope.lat, $scope.lng),
            mapOptions = {
                center: center,
                zoom: 14,

                scrollwheel: false
            };

        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        setMarkers(center, radius, map);

        function setMarkers(center, radius, map) {
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: {
                    lat: $scope.lat,
                    lng: $scope.lng
                },
                radius: radius,
                type: ["food"]
            }, processResults);
            function processResults(results, status, pagination) {
                var locations;
                var locationJSON = [];
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    locations = results;
                }
                for (var i = 0; i < locations.length; i++) {
                    locationJSON.push({
                        "placeId": locations[i].place_id
                    });
                }
                $scope.$apply();
                for (var j = 0; j < locations.length; j++) {
                    var data = locationJSON[j];
                    createMarker(data, map);
                }
            }
        }

        function createMarker(data, map) {
            var service = new google.maps.places.PlacesService(map);
            service.getDetails({
                placeId: data.placeId
            }, function(result, status) {
                if (status != google.maps.places.PlacesServiceStatus.OK) {
                    return;
                }
                var locPhoto;
                if (result.photos !== undefined) {
                    locPhoto = result.photos[0].getUrl({
                        'maxWidth': 100,
                        'maxHeight': 100
                    });
                } else {
                    locPhoto = "http://www.freeiconspng.com/uploads/no-image-icon-15.png";
                }
                var price_level;
                if (result.price_level == 0) {price_level = "Free";}
                else if (result.price_level == 1) {price_level = "$";}
                else if (result.price_level == 2) {price_level = "$$"}
                else if (result.price_level == 3) {price_level = "$$$"}
                else if (result.price_level == 4) {price_level = "$$$$"}
                else {price_level = "N/A"};
                var marker = new google.maps.Marker({
                    map: map,
                    place: {
                        placeId: data.placeId,
                        location: result.geometry.location,
                    },
                    placeid: data.placeId,
                    photo: locPhoto,
                    title: result.name,
                    location: result.geometry.location,
                    address: result.formatted_address,
                    phone_number: result.formatted_phone_number,
                    website: result.website,
                    rating: result.rating,
                    reviews: result.reviews,
                    price: price_level,
                    detailed_icon: result.icon,
                    hours: result.opening_hours.weekday_text,
                    types: result.types
                });
                // bounds.extend(result.geometry.location);
                // map.fitBounds(bounds);
                infoBox(map, marker, data, result);
                $scope.markers.push(marker);
                $scope.$apply();
            });
        }

        function infoBox(map, marker, data, result) {
            var infoWindow = new google.maps.InfoWindow();

            google.maps.event.addListener(marker, "click", function(e) {

                infoWindow.setContent(data.content);
                infoWindow.open(map, marker);
            });

            (function(marker, data) {

                google.maps.event.addListener(marker, "click", function(e) {

                    infoWindow.setContent(result.name);
                    infoWindow.open(map, marker);
                });
            })(marker, data);
            $scope.$apply();
        }
     $scope.loading = false;
    }
    getLocations();

    function getLocations() {
    GoogleMapsFactory.getLocations($rootScope.user.uid).then(function(response) {
    response.forEach(function(place) {
        $scope.myplaces.push(place.placeid);
    })
    });
    }

    $scope.addLocationToMyPlaces = function(newMyPlace) {
        getLocations();
        if ($scope.myplaces.indexOf(newMyPlace.placeid) < 0) {
        let index = $scope.markers.indexOf(newMyPlace);
        if (index > -1) {
            $scope.markers.splice(index, 1);
        };
        GoogleMapsFactory.addLocation($rootScope.user.uid, newMyPlace).then(function() {
             alertify.success('new myPlace added.');

        });
    } else {
        alertify.error('myPlace already exists.');
    }
};

    $scope.viewLocation = function(selectedPlace) {
      $scope.selectedPlace = selectedPlace;
      console.log(selectedPlace);
    };

    initializeOriginalCoordinates();

    function initializeOriginalCoordinates () {
    navigator.geolocation.getCurrentPosition(function(position) {
              $scope.lat = position.coords.latitude;
              $scope.lng = position.coords.longitude;
              initialize();
    });
};


});