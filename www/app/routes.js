"use strict";

angular.module("ngapp").config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise("/main");

  $stateProvider.state("main", {
    url: "/main",
    templateUrl: "app/components/main/main.html",
    title: "Calendar",
    controller: "MainController",
    controllerAs: "main"
  })
  .state("edit", {
    url: "/edit",
    templateUrl: "app/components/workingEvent/wevent.html",
    controller: "WeventController",
    controllerAs: "edit"
  });

}]);
