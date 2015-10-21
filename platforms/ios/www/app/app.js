"use strict";

angular.module("ngapp", [ "ngCordova", "ngTouch", "ui.router", "ngMdIcons", "ngMaterial" ])

.run(function($cordovaStatusbar){
    document.addEventListener("deviceready", function () {
        $cordovaStatusbar.overlaysWebView(false);
        $cordovaStatusbar.styleColor('black');
    }, false); 
    document.addEventListener("deviceready", function () {
      if (window.cordova) {
        console.log('window.cordova is available');
      } else {
        console.log('window.cordova NOT available');
      }
    }, false);
    document.addEventListener("deviceready", function () {
      if (window.cordova.plugins) {
        console.log('window.cordova.plugins is available');
      } else {
        console.log('window.cordova.plugins NOT available');
      }
    }, false); 
});