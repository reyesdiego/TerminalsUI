/**
* Created by artiom on 03/02/15.
*/


myapp.controller('resetPasswordDialogCtrl', ['$scope', '$uibModalInstance', function($scope,$uibModalInstance){
    $scope.data = {mail: ''};
    $scope.validEmail = false;
    $scope.helpText = 'Ingrese la dirección de e-mail con la que registró su cuenta.';
    $scope.tipoAyuda = '';

    $scope.cancel = function(){
        $uibModalInstance.dismiss('canceled');
    }; // end cancel

    $scope.save = function(){
        if ($scope.validEmail){
            $uibModalInstance.close($scope.data.mail);
        } else {
            $scope.helpText = 'La dirección ingresada no es válida. Ingrese la dirección de e-mail con la que registró su cuenta.';
            $scope.tipoAyuda = 'text-danger';
        }
    }; // end save

    $scope.hitEnter = function(evt){
        if(angular.equals(evt.keyCode,13) && !(angular.equals($scope.name,null) || angular.equals($scope.name,'')))
            $scope.save();
    };

    $scope.$watch('data.mail', function(){
        //var expr = /^([a-zA-Z0-9_\\.\\-])+\\@(" + $scope.entidad + ")\\.([a-zA-Z0-9]{2,4})+(\\.[a-zA-Z]{2})?$/;
        var expr = /^([a-zA-Z0-9_\.\-])+\@(bactssa|trp|apmterminals|puertobuenosaires)\.([a-zA-Z0-9]{2,4})+(\.[a-zA-Z]{2})?$/;
        $scope.validEmail = expr.test($scope.data.mail);
    })
}]);
