"use strict";

angular.module("ngapp").controller("MainController", function(shared, $state, $scope, $mdSidenav, $mdComponentRegistry, $cordovaCalendar, $cordovaDevice, $mdDialog, $window){

  // Start Variables
    var ctrl = this;


    ctrl.inicHora = 12;


    ctrl.inicMinuto = '0' + 0;


    ctrl.finalHora = 12;


    ctrl.finalMinuto = '0' + 0;


    ctrl.pickedDate = null;


    ctrl.name = null;


    ctrl.location = null;


    ctrl.notes = null;


    ctrl.selectedCalendar = {name: "Selecione um  Calendario"};


    ctrl.filter = shared.eventsCalendar.filter;


    ctrl.calendarList = [];


    ctrl.selectionCalendar = [];


    ctrl.eventList = [];


    ctrl.allEvents = [];


    ctrl.toggle = angular.noop;
  // End Variables

  // Start Plugin Definition
    document.addEventListener("deviceready", function () {
        ctrl.loadList = function(){
            ctrl.allEvents = []; // Reset List to Reload
                var today = new Date;
                ctrl.dd = today.getDate();
                ctrl.mm = today.getMonth(); // January is 0, so always add + 1
                ctrl.yyyy = today.getFullYear();
                var j = 0;

                ctrl.ndd = ctrl.dd;
                ctrl.nmm = ctrl.mm;
                ctrl.nyyyy = ctrl.yyyy + 1;

                $cordovaCalendar.findEvent({
                    title: null,
                    location: null,
                    notes: null,
                    startDate: new Date(ctrl.yyyy, ctrl.mm, ctrl.dd, 0, 0, 0, 0, 0),
                    endDate: new Date(ctrl.nyyyy, ctrl.mm, ctrl.dd, 0, 0, 0, 0, 0)
                }).then(function (data) {
                    var leng = data.length;

                    for(var i = 0; i < leng; i++){
                      if($cordovaDevice.getPlatform() == 'Android'){
                        if( j == 0 || data[i].title != ctrl.allEvents[j - 1].title){
                          if(data[i].location == null || data[i].location == "")
                          {
                            data[i].location = "Não especificado";
                          }

                          if(data[i].message == null || data[i].message == ""){
                            data[i].message = "Sem informações especificas";
                          }

                          if(data[i].allday == true || data[i].startDate == data[i].endDate){
                            data[i].startDate = data[i].startDate.split(" ")[0] + " - " + "All Day";
                            data[i].endDate = data[i].endDate.split(" ")[0] + " - " + "All Day";
                          } else{
                            data[i].startDate = data[i].startDate.split(" ")[0] + " - " + data[i].startDate.split(" ")[1];
                            data[i].endDate = data[i].endDate.split(" ")[0] + " - " + data[i].endDate.split(" ")[1];
                          }

                          if(ctrl.filter == null){
                            ctrl.allEvents.push( data[i] );
                            j++;
                          }else{
                            if(data[i].calendarId == ctrl.filter){
                              ctrl.allEvents.push( data[i] );
                              j++;
                            }
                          }

                        }
                      }
                      else{
                        if( j == 0 || data[i].title != ctrl.allEvents[j - 1].title){
                            data[i].eventLocation = data[i].location;

                            if(data[i].location == null || data[i].location == "")
                            {
                              data[i].location = "Não especificado";
                            }

                            if(data[i].message == null || data[i].message == ""){
                              data[i].message = "Sem informações especificas";
                            }

                            if(data[i].startDate.split(" ")[1] == "00:00:00"){
                              data[i].startDate = data[i].startDate.split(" ")[0] + " - " + "All Day";
                              data[i].endDate = data[i].endDate.split(" ")[0] + " - " + "All Day";
                            } else{
                              data[i].startDate = data[i].startDate.split(" ")[0] + " - " + data[i].startDate.split(" ")[1];
                              data[i].endDate = data[i].endDate.split(" ")[0] + " - " + data[i].endDate.split(" ")[1];
                            }

                            if(ctrl.filter == null){
                              ctrl.allEvents.push( data[i] );
                              j++;
                            }else{
                              if(data[i].calendar == ctrl.filter){
                                ctrl.allEvents.push( data[i] );
                                j++;
                              }
                            }
                         }
                      }
                    }

                    if(ctrl.calendarList.length == 0){
                      $cordovaCalendar.listCalendars().then(function (result) {
                        ctrl.calendarList = result;
                        if(ctrl.calendarList.length > 1){
                          ctrl.calendarList.push({id: null, name: "Todos"});
                        }
                        $scope.Ok = null;
                      }, function (err) {
                        // error
                      });
                    }
                }, function (err) {
                    alert("Error: ");
                });
        };

        ctrl.loadList();
    }, false);


    $scope.$watch("Ok", function(){
        var lgn = ctrl.calendarList.length - 1;
        for(var i = 0; i < lgn; i++){
          var name = ctrl.calendarList[i].name.split("");
          for(var j = 0; j < name.length; j++){
            if(name[j] == "@"){
              ctrl.selectionCalendar.push(ctrl.calendarList[i]);
            }
          }
        }
        $scope.$apply();
    }, true);


    ctrl.saveEvent = function(){

        ctrl.day = ctrl.pickedDate.getDate();

        ctrl.month = ctrl.pickedDate.getMonth();

        ctrl.year = ctrl.pickedDate.getFullYear();

        var calOptions = window.plugins.calendar.getCalendarOptions();
        if($cordovaDevice.getPlatform() == 'Android'){
          calOptions.calendarId = ctrl.selectedCalendar.id;
        } else{
          calOptions.calendarName = ctrl.selectedCalendar.name;
        }

        var success = function(message){
           console.log('Success: ' + JSON.stringify(message));
           ctrl.loadList();
           ctrl.close();};
        var error = function(message){
           console.log('Err: ' + JSON.stringify(message));
         };

        window.plugins.calendar.createEventWithOptions(ctrl.name,ctrl.location,ctrl.notes,new Date(ctrl.year, ctrl.month, ctrl.day, ctrl.inicHora, ctrl.inicMinuto, 0, 0, 0),new Date(ctrl.year, ctrl.month, ctrl.day, ctrl.finalHora, ctrl.finalMinuto, 0, 0, 0),calOptions,success,error);
    };
  // End Plugin Definition

  // Start Time Manipulation
    /*/ Keep in mind that the final time is dependent of the initial time
          But the initial time isn't dependent of the final time /*/
    ctrl.upInitHour = function(){
        if(parseInt(ctrl.inicHora) == parseInt(ctrl.finalHora)){
            if(parseInt(ctrl.inicHora) == 23){
                ctrl.inicHora = 0;
            } else{
                ctrl.inicHora = parseInt(ctrl.inicHora) + 1;
                ctrl.finalHora = parseInt(ctrl.finalHora) + 1;
            }
        } else{
            if(parseInt(ctrl.inicHora) == 23){
                ctrl.inicHora = 0;
            } else{
                ctrl.inicHora = parseInt(ctrl.inicHora) + 1;
            }
        }
        if(parseInt(ctrl.inicHora) < 10){
            ctrl.inicHora = "0" + parseInt(ctrl.inicHora);
        }
        if(parseInt(ctrl.finalHora) < 10){
            ctrl.finalHora = "0" + parseInt(ctrl.finalHora);
        }
    };


    ctrl.downInitHour = function(){
        if(parseInt(ctrl.inicHora) == 0){
            ctrl.inicHora = 23;
        } else{
            ctrl.inicHora = parseInt(ctrl.inicHora) - 1;
        }
        if(parseInt(ctrl.inicHora) < 10){
            ctrl.inicHora = "0" + parseInt(ctrl.inicHora);
        }
        if(parseInt(ctrl.finalHora) < 10){
            ctrl.finalHora = "0" + parseInt(ctrl.finalHora);
        }
    };


    ctrl.upFinalHour = function(){
        if(parseInt(ctrl.finalHora) == 23){
            ctrl.finalHora = ctrl.inicHora;
        } else{
            ctrl.finalHora = parseInt(ctrl.finalHora) + 1;
        }
        if(parseInt(ctrl.inicHora) < 10){
            ctrl.inicHora = "0" + parseInt(ctrl.inicHora);
        }
        if(parseInt(ctrl.finalHora) < 10){
            ctrl.finalHora = "0" + parseInt(ctrl.finalHora);
        }
    };


    ctrl.downFinalHour = function(){
        if(parseInt(ctrl.finalHora) == parseInt(ctrl.inicHora)){
            ctrl.finalHora = 23;
        } else if(parseInt(ctrl.finalHora) == 0){
            ctrl.finalHora = 23;
        } else{
            ctrl.finalHora = parseInt(ctrl.finalHora) - 1;
        }
        if(parseInt(ctrl.inicHora) < 10){
            ctrl.inicHora = "0" + parseInt(ctrl.inicHora);
        }
        if(parseInt(ctrl.finalHora) < 10){
            ctrl.finalHora = "0" + parseInt(ctrl.finalHora);
        }
    };


    ctrl.upInitMinute = function(){
        if(parseInt(ctrl.inicHora) == parseInt(ctrl.finalHora)){
            if(parseInt(ctrl.inicMinuto) == parseInt(ctrl.finalMinuto)){
                if(ctrl.inicMinuto == 59){
                    ctrl.inicMinuto = 0;
                } else{
                    ctrl.inicMinuto = parseInt(ctrl.inicMinuto) + 1;
                    ctrl.finalMinuto = parseInt(ctrl.finalMinuto) + 1;
                }
            } else{
                if(parseInt(ctrl.inicMinuto) == 59){
                    ctrl.inicMinuto = 0;
                } else{
                    ctrl.inicMinuto = parseInt(ctrl.inicMinuto) + 1;
                }
            }

        } else{
            if(parseInt(ctrl.inicMinuto) == 59){
                ctrl.inicMinuto = 0;
            } else{
                ctrl.inicMinuto = parseInt(ctrl.inicMinuto) + 1;
            }
        }
        if(parseInt(ctrl.inicMinuto) < 10){
            ctrl.inicMinuto = "0" + parseInt(ctrl.inicMinuto);
        }
        if(parseInt(ctrl.finalMinuto) < 10){
            ctrl.finalMinuto = "0" + parseInt(ctrl.finalMinuto);
        }
    };


    ctrl.downInitMinute = function(){
        if(parseInt(ctrl.inicHora) == parseInt(ctrl.finalHora)){
          if(parseInt(ctrl.inicMinuto) == 0){
              ctrl.inicMinuto = 59;
              ctrl.finalMinuto = 59;
          } else{
              ctrl.inicMinuto = parseInt(ctrl.inicMinuto) - 1;
          }
        } else{
            if(parseInt(ctrl.inicMinuto) == 0){
                ctrl.inicMinuto = 59;
            } else{
                ctrl.inicMinuto = parseInt(ctrl.inicMinuto) - 1;
            }
        }
        if(parseInt(ctrl.inicMinuto) < 10){
            ctrl.inicMinuto = "0" + parseInt(ctrl.inicMinuto);
        }
        if(parseInt(ctrl.finalMinuto) < 10){
            ctrl.finalMinuto = "0" + parseInt(ctrl.finalMinuto);
        }
    };


    ctrl.upFinalMinute = function(){
        if(parseInt(ctrl.finalHora) == parseInt(ctrl.inicHora)){
            if(ctrl.finalMinuto == 59){
                ctrl.finalMinuto = ctrl.inicMinuto;
            } else{
                ctrl.finalMinuto = parseInt(ctrl.finalMinuto) + 1;
            }
        } else{
            if(parseInt(ctrl.finalMinuto) == 59){
                ctrl.finalMinuto = 0;
            } else{
                ctrl.finalMinuto = parseInt(ctrl.finalMinuto) + 1;
            }
        }
        if(parseInt(ctrl.inicMinuto) < 10){
            ctrl.inicMinuto = "0" + parseInt(ctrl.inicMinuto);
        }
        if(ctrl.finalMinuto < 10){
            ctrl.finalMinuto = "0" + parseInt(ctrl.finalMinuto);
        }
    };


    ctrl.downFinalMinute = function(){
        if(parseInt(ctrl.finalHora) == parseInt(ctrl.inicHora)){
            if(parseInt(ctrl.finalMinuto) == parseInt(ctrl.inicMinuto)){
                ctrl.finalMinuto = 59;
            } else{
                ctrl.finalMinuto = parseInt(ctrl.finalMinuto) - 1;
            }
        } else{
            if(parseInt(ctrl.finalMinuto) == 0){
                ctrl.finalMinuto = 59;
            } else{
                ctrl.finalMinuto = parseInt(ctrl.finalMinuto) - 1;
            }
        }
        if(parseInt(ctrl.inicMinuto) < 10){
            ctrl.inicMinuto = "0" + parseInt(ctrl.inicMinuto);
        }
        if(parseInt(ctrl.finalMinuto) < 10){
            ctrl.finalMinuto = "0" + parseInt(ctrl.finalMinuto);
        }
    };
  // End Time Manipulation


  // Start Dropdown Menu Definition
    this.openMenu = function($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    };
  // End


  // Start Filter Manipulation
    ctrl.applyFilter = function(filter){
      if($cordovaDevice.getPlatform() == 'Android' || filter.id == null){
        shared.eventsCalendar.filter = filter.id;
        ctrl.filter = shared.eventsCalendar.filter;
      } else{
        shared.eventsCalendar.filter = filter.name;
        ctrl.filter = shared.eventsCalendar.filter;
      }
        ctrl.loadList();
    }
  // End Filter Manipulation


  // Start Calendar Selection Manipulation
    ctrl.applySelection = function(calendar){
      ctrl.selectedCalendar = calendar;
    }
  // End Calendar Selection Manipulation


  // Start Toggle Bar Definition
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
  // End Toggle Bar Definition

  // Start Alert Information Definition
    ctrl.showDetail = function($event, data) {
        $mdDialog.show({
          clickOutsideToClose: true,
          scope: $scope,        // use parent scope in template
          preserveScope: true,  // do not forget this if use parent scope
          template: '<md-dialog>'                                                                                           +
                    '  <md-dialog-content layout-fill layout-align="space-around" style="width: 20em; height: 30em;">'      +
                    '    <md-content layout="row" layout-align="center center">'                                            +
                    '     <h2 style="margin-bottom: 15px;">' + data.title + '</h2>'                                         +
                    '    </md-content>'                                                                                     +
                    '    <md-content layout="column" layout-align="space-around" style="margin-left: 1em;">'                +
                    '     <h4 style="margin-bottom: 5px;">Data:</h4>'                                                       +
                          data.startDate.split(" - ")[0]                                                                    +
                    '     <h4 style="margin-bottom: 5px;">Inicio:</h4>'                                                     +
                          data.startDate.split(" - ")[1]                                                                    +
                    '     <h4 style="margin-bottom: 5px;">Termino:</h4>'                                                    +
                          data.endDate.split(" - ")[1]                                                                      +
                    '     <h4 style="margin-bottom: 5px;">Local:</h4>'                                                      +
                          data.location                                                                                +
                    '     <h4 style="margin-bottom: 5px;">Notas:</h4>'                                                      +
                          data.message                                                                                +
                    '    </md-content>'                                                                                     +
                    '  </md-dialog-content>'                                                                                +
                    '</md-dialog>'                                                                                          ,
          controller: function DialogController($scope, $mdDialog) {
              $scope.closeDialog = function(){
                  $mdDialog.hide();
              };

          }
       });
    }
  // End Alert Information Definition

  ctrl.option = function(){
    alert("Options");
  }

  // Start Watch Route
    $scope.$watch("$state.current.title", function(){
        ctrl.title = $state.current.title;
        $scope.$apply();
    }, true);
  // End Watch Route

});
