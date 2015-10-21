"use strict";

angular.module("ngapp").controller("MainController", function(shared, $state, $scope, $mdSidenav, $mdComponentRegistry, $cordovaCalendar){
    
    var ctrl = this;
    
    
    ctrl.pickedDate = null;
    
    
    ctrl.name = null;
    
    
    ctrl.location = null;
    
    
    ctrl.notes = null;
    
    
    ctrl.toggle = angular.noop;
    
    
    ctrl.saveEvent = function(){
        
        ctrl.day = ctrl.pickedDate.getDate();
        
        ctrl.month = ctrl.pickedDate.getMonth();
        
        ctrl.year = ctrl.pickedDate.getFullYear();
        
        $cordovaCalendar.createEvent({
            title: ctrl.name,
            location: ctrl.location,
            notes: ctrl.notes,
            startDate: new Date(ctrl.year, ctrl.month, ctrl.day, 12, 0, 0, 0, 0), //(yyyy, mm + 1, dd, hh, mm, 0, 0, 0)
            endDate: new Date(ctrl.year, ctrl.month, ctrl.day, 12, 0, 0, 0, 0)    //new Date()     //(yyyy, mm + 1, dd, hh, mm, 0, 0, 0)
        })
        .then(
            function (data){
                alert('Created');
            },
            function(err){
                alert('Error');
            }
        );  
    };
    
    
    ctrl.isOpen = function() { return false };
    $mdComponentRegistry
    .when("left")
    .then( function(sideNav){
      ctrl.isOpen = angular.bind( sideNav, sideNav.isOpen );
      ctrl.toggle = angular.bind( sideNav, sideNav.toggle );
    });
    
    
    ctrl.toggleRight = function() {
    $mdSidenav("left").toggle()
        .then(function(){
        });
    };
    
    
    ctrl.close = function() {
    $mdSidenav("left").close()
        .then(function(){
        });
    };
    
     
    $scope.$watch("$state.current.title", function(newValue, oldValue) {
        if (newValue === oldValue){
            return; 
        }
        
        ctrl.title = $state.current.title;
        $scope.$apply();
    }, true);
});