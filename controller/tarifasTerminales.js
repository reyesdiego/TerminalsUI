/**
 * Created by kolesnikov-a on 10/05/2016.
 */

myapp.controller ('tarifasTerminalesCtrl', ['$scope', 'reportsFactory', 'loginService', 'generalCache', 'dialogs', '$window', function($scope, reportsFactory, loginService, generalCache, dialogs, $window){

    $scope.descripciones = generalCache.get('descripciones' + loginService.getFiltro());

    $scope.model = {
        tipo: 'year',
        fecha: new Date(),
        loading: false
    };

    $scope.datepickerMonth = {
        minMode: 'month',
        datepickerMode: 'month',
        maxDate: new Date()
    };

    $scope.datepickerYear = {
        minMode: 'year',
        datepickerMode: 'year',
        maxDate: new Date()
    };

    $scope.mensajeResultado = {
        titulo: 'Reporte de tarifas',
        mensaje: 'Seleccione año o mes y año y presione cargar para ver el reporte.',
        tipo: 'panel-info'
    };

    $scope.dataReporte = [];

    $scope.disableDown = false;

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

    /*$scope.$on('cambioTerminal', function(){
        $scope.descripciones = generalCache.get('descripciones' + loginService.getFiltro());
        if ($scope.dataReporte.length > 0){
            $scope.cargarReporte();
        }
    });*/

    $scope.descargarCSV = function(){
        $scope.disableDown = true;
        var param = {
            year: $scope.model.fecha.getFullYear()
        };
        var nombreReporte = 'Tarifas_terminales_' + loginService.getFiltro() + '_' + param.year;
        if ($scope.model.tipo == 'month'){
            param.month = $scope.model.fecha.getMonth() + 1;
            nombreReporte += '_' + param.month;
        }
        param.output = 'csv';
        nombreReporte += '.csv';

        reportsFactory.getTerminalesCSV(param, function(data, status){
            $scope.disableDown = false;

            if (status == 'OK'){

                if ($window.navigator.userAgent.indexOf('Trident') != -1 || $window.navigator.userAgent.indexOf('MSI') != -1){
                    var csvBlob = new Blob([data], {type: 'text/csv'});
                    $window.navigator.msSaveOrOpenBlob(csvBlob, nombreReporte);
                } else {
                    var anchor = angular.element('<a/>');
                    anchor.css({display: 'none'}); // Make sure it's not visible
                    angular.element(document.body).append(anchor); // Attach to document

                    anchor.attr({
                        href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                        target: '_blank',
                        download: nombreReporte
                    })[0].click();

                    anchor.remove(); // Clean it up afterwards
                }
            } else {
                dialogs.error('Reportes', 'Se ha producido un error al descargar los datos.');
            }
        })
    };

}]);