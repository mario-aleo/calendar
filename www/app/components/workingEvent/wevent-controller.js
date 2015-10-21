"use strict";

angular.module("ngapp").controller("WeventController", function(shared, $scope, $state, $mdMenu, $cordovaCalendar, $cordovaDevice, $mdDialog){
  var ctrl = this;

  ctrl.title = shared.workingEvent.name;

  ctrl.name = shared.workingEvent.name;

  ctrl.location = shared.workingEvent.location;

  ctrl.message = shared.workingEvent.message;

  ctrl.pickedDate = shared.workingEvent.pickedDate;

  ctrl.inicHora = shared.workingEvent.inicHora;

  ctrl.inicMinuto = shared.workingEvent.inicMinuto;

  ctrl.finalHora = shared.workingEvent.finalHora;

  ctrl.finalMinuto = shared.workingEvent.finalMinuto;


  ctrl.cancel = function(){
    $state.go("main");
  };

  ctrl.save = function(){

    var yyyy = shared.workingEvent.pickedDate.getFullYear();
    var mm = shared.workingEvent.pickedDate.getMonth();
    var dd = shared.workingEvent.pickedDate.getDate();
    var ih = shared.workingEvent.inicHora;
    var im = shared.workingEvent.inicMinuto;
    var fh = shared.workingEvent.finalHora;
    var fm = shared.workingEvent.finalMinuto;

    var nyyyy = ctrl.pickedDate.getFullYear();
    var nmm = ctrl.pickedDate.getMonth();
    var ndd = ctrl.pickedDate.getDate();
    var nih = ctrl.inicHora;
    var nim = ctrl.inicMinuto;
    var nfh = ctrl.finalHora;
    var nfm = ctrl.finalMinuto;

    if($cordovaDevice.getPlatform() == 'Android'){

      $cordovaCalendar.deleteEvent({
        newTitle: shared.workingEvent.name,
        location: null,
        notes: null,
        startDate: new Date(yyyy, mm, dd, ih, im, 0, 0, 0),
        endDate: new Date(yyyy, mm, dd, fh, fm, 0, 0, 0)
      }).then(function (message) {

        console.log('Success: ' + JSON.stringify(message));
        $scope.Ok = true;

      }, function (message) {
        console.log('Err: ' + JSON.stringify(message));
      });

    } else{

      $cordovaCalendar.modifyEvent({
        title: shared.workingEvent.name,
        location: shared.workingEvent.location,
        notes: shared.workingEvent.message,
        startDate: new Date(yyyy, mm, dd, ih, im, 0, 0, 0),
        endDate: new Date(yyyy, mm, dd, fh, fm, 0, 0, 0),
        newTitle: ctrl.name,
        newLocation: ctrl.location,
        newNotes: ctrl.message,
        newStartDate: new Date(nyyyy, nmm, ndd, nih, nim, 0, 0, 0),
        newEndDate: new Date(nyyyy, nmm, ndd, nfh, nfm, 0, 0, 0)
      }).then(function (message) {
        console.log('Success: ' + JSON.stringify(message));

        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Editar Evento')
            .content('Informações alteradas com sucesso.')
            .ariaLabel('editEvent Success')
            .ok('Ok')
            .targetEvent()
        );

        $state.go("main");
      }, function (message) {
        console.log('Err: ' + JSON.stringify(message));

        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Editar Evento')
            .content('As informações não puderam ser alteradas.')
            .ariaLabel('editEvent Error')
            .ok('Ok')
            .targetEvent()
        );

        $state.go("main");
      });
    };
  };

  $scope.$watch("Ok", function(){
    if($scope.Ok == true){
      var nyyyy = ctrl.pickedDate.getFullYear();
      var nmm = ctrl.pickedDate.getMonth();
      var ndd = ctrl.pickedDate.getDate();
      var nih = ctrl.inicHora;
      var nim = ctrl.inicMinuto;
      var nfh = ctrl.finalHora;
      var nfm = ctrl.finalMinuto;

      var calOptions = window.plugins.calendar.getCalendarOptions();
      calOptions.calendarId = shared.workingEvent.id;

      var success = function(message){
         console.log('Success: ' + JSON.stringify(message));

         $mdDialog.show(
           $mdDialog.alert()
             .parent(angular.element(document.querySelector('#popupContainer')))
             .clickOutsideToClose(true)
             .title('Editar Evento')
             .content('Informações alteradas com sucesso.')
             .ariaLabel('editEvent Error')
             .ok('Ok')
             .targetEvent()
         );

         $scope.$apply();

         $state.go("main");
       };

      var error = function(message){
         console.log('Err: ' + JSON.stringify(message));

         $mdDialog.show(
           $mdDialog.alert()
             .parent(angular.element(document.querySelector('#popupContainer')))
             .clickOutsideToClose(true)
             .title('Editar Evento')
             .content('As informações não puderam ser alteradas.')
             .ariaLabel('editEvent Error')
             .ok('Ok')
             .targetEvent()
         );

         $scope.$apply();

         $state.go("main");
       };

      window.plugins.calendar.createEventWithOptions(ctrl.name,ctrl.location,ctrl.message,new Date(nyyyy, nmm, ndd, nih, nim, 0, 0, 0),new Date(nyyyy, nmm, ndd, nfh, nfm, 0, 0, 0),calOptions,success,error);
    }
  }, true);

  // Start Time Manipulation
  ctrl.upInitHour = function(){
    if(parseInt(ctrl.inicHora) == 23){
      ctrl.inicHora = 0;
    } else{
      ctrl.inicHora = parseInt(ctrl.inicHora) + 1;
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
    if(parseInt(ctrl.finalHora) == 0){
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
    if(parseInt(ctrl.inicMinuto) == 59){
      ctrl.inicMinuto = 0;
    } else{
      ctrl.inicMinuto = parseInt(ctrl.inicMinuto) + 1;
    }

    if(parseInt(ctrl.inicMinuto) < 10){
      ctrl.inicMinuto = "0" + parseInt(ctrl.inicMinuto);
    }
    if(parseInt(ctrl.finalMinuto) < 10){
      ctrl.finalMinuto = "0" + parseInt(ctrl.finalMinuto);
    }
  };

  ctrl.downInitMinute = function(){
    if(parseInt(ctrl.inicMinuto) == 0){
      ctrl.inicMinuto = 59;
    } else{
      ctrl.inicMinuto = parseInt(ctrl.inicMinuto) - 1;
    }

    if(parseInt(ctrl.inicMinuto) < 10){
      ctrl.inicMinuto = "0" + parseInt(ctrl.inicMinuto);
    }
    if(parseInt(ctrl.finalMinuto) < 10){
      ctrl.finalMinuto = "0" + parseInt(ctrl.finalMinuto);
    }
  };

  ctrl.upFinalMinute = function(){
    if(parseInt(ctrl.finalMinuto) == 59){
      ctrl.finalMinuto = 0;
    } else{
      ctrl.finalMinuto = parseInt(ctrl.finalMinuto) + 1;
    }

    if(parseInt(ctrl.inicMinuto) < 10){
      ctrl.inicMinuto = "0" + parseInt(ctrl.inicMinuto);
    }
    if(ctrl.finalMinuto < 10){
      ctrl.finalMinuto = "0" + parseInt(ctrl.finalMinuto);
    }
  };

  ctrl.downFinalMinute = function(){
    if(parseInt(ctrl.finalMinuto) == 0){
      ctrl.finalMinuto = 59;
    } else{
      ctrl.finalMinuto = parseInt(ctrl.finalMinuto) - 1;
    }

    if(parseInt(ctrl.inicMinuto) < 10){
      ctrl.inicMinuto = "0" + parseInt(ctrl.inicMinuto);
    }
    if(parseInt(ctrl.finalMinuto) < 10){
      ctrl.finalMinuto = "0" + parseInt(ctrl.finalMinuto);
    }
  };
  // End Time Manipulation
});
