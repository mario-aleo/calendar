"use strict";

angular.module("ngapp").service("shared", function(){

  this.eventsCalendar = {
    filter: null
  };

  this.workingEvent = {
    name: null,
    location: null,
    message: null,
    pickedDate: null,
    inicHora: null,
    inicMinuto: null,
    finalHora: null,
    finalMinuto: null,
    id: null
  };
});
