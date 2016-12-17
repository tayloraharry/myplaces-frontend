"use strict";

app.controller("NavCtrl", ($scope) => {
  $scope.navItems = [
  {
    name:"Logout",
    url: "#/logout"
  },
  {
    name:"Map",
    url: "#/map"
  },
    {
    name:"My Places",
    url: "#/myplaces"
  },
    {
    name:"My Contacts",
    url: "#/mycontacts"
  },
    {
    name:"My Profile",
    url: "#/myprofile"
  }
  // ,
  // {
  //   name:"Add New Pin",
  //   url: '#/pins/new'
  // }
  ];
});