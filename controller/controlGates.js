/**
 * Created by kolesnikov-a on 24/05/2016.
 */
myapp.controller('controlGatesCtrl', ['$scope', '$state', function($scope, $state){

    $state.transitionTo('cgates.gates');

    $scope.tabs = [
        {name: 'Facturaciones sin gates', ref: 'cgates.gates', active: true},
        {name: 'Gates sin facturación', ref: 'cgates.invoices', active: false},
        {name: 'Gates sin turnos', ref: 'cgates.appointments', active: false}
    ];

    $scope.childModels = {
        gates: null,
        invoices: null,
        gatesAppointments: null
    };

    $scope.$on('saveState', function(ev, dato, model){
        $scope.childModels[dato] = model;
    })

}]);