/**
 * Created by kolesnikov-a on 10/05/2016.
 */

myapp.controller ('tarifasTerminalesCtrl', ['$scope', 'reportsFactory', 'loginService', 'generalCache', function($scope, reportsFactory, loginService, generalCache){

    $scope.descripciones = generalCache.get('descripciones' + loginService.getFiltro());

    $scope.model = {
        tipo: 'year',
        fecha: new Date(),
        loading: false
    };

    $scope.mensajeResultado = {
        titulo: 'Reporte de tarifas',
        mensaje: 'Seleccione año o mes y año y presione cargar para ver el reporte.',
        tipo: 'panel-info'
    };

    $scope.dataReporte = [];

    $scope.search = '';

    $scope.cargarReporte = function(){
        $scope.model.loading = true;
        var param = {
            year: $scope.model.fecha.getFullYear()
        };
        if ($scope.model.tipo == 'month'){
            param.month = $scope.model.fecha.getMonth() + 1;
        }
        reportsFactory.getReporteTerminales(param, function(data){
            $scope.model.loading = false;
            if (data.status == 'OK'){
                $scope.dataReporte = data.data;
                $scope.dataReporte.forEach(function(tarifa){
                    tarifa.descripcion = angular.isDefined($scope.descripciones[tarifa.code]) ? $scope.descripciones[tarifa.code] : 'Sin definir'
                })
            } else {
                $scope.dataReporte = [];
                $scope.mensajeResultado = {
                    titulo: 'Reporte de tarifas',
                    mensaje: 'Seleccione año o mes y año y presione cargar para ver el reporte.',
                    tipo: 'panel-danger'
                };
            }
        });
    };

    $scope.$on('cambioTerminal', function(){
        $scope.descripciones = generalCache.get('descripciones' + loginService.getFiltro());
        if ($scope.dataReporte.length > 0){
            $scope.cargarReporte();
        }
    })

}]);