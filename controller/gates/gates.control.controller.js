/**
 * Created by kolesnikov-a on 24/05/2016.
 */
myapp.controller('controlGatesCtrl', ['$scope', function($scope){

    $scope.active = 0;
    $scope.canDescargarCsv = true;

    $scope.tabs = [
        {name: 'Facturaciones sin gates', ref: 'cgates.gates'},
        {name: 'Gates sin facturación', ref: 'cgates.invoices'},
        {name: 'Gates sin turnos', ref: 'cgates.appointments'}
    ];

    //Guarda el estado de sus hijos para no tener que volver a llamar al servidor mientras se navegue entre ellos.
    $scope.childModels = {
        gates: null,
        invoices: null,
        gatesAppointments: null
    };

    //Evento que registra el estado de sus hijos, se ejecuta cuando se destruye el scope de alguno de sus hijos
    $scope.$on('saveState', function(ev, dato, model){
        $scope.childModels[dato] = model;
    });

    $scope.$on('$stateChangeSuccess', function (ev, to) {
        for (var i = 0; i < $scope.tabs.length; i++){
            if (to.name == $scope.tabs[i].ref) $scope.active = i;
        }
    });

}]);