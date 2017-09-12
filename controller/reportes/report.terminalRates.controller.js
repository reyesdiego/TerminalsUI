/**
 * Created by kolesnikov-a on 10/05/2016.
 */

myapp.controller ('tarifasTerminalesCtrl', ['$scope', 'reportsFactory', 'loginService', 'dialogs', function($scope, reportsFactory, loginService, dialogs){

    //$scope.descripciones = cacheService.cache.get('descripciones' + loginService.filterTerminal);

    $scope.ordenField = 'total';
    $scope.ordenType = true;

    $scope.ordenar = field => {
        $scope.ordenField = field;
        $scope.ordenType = !$scope.ordenType;
    };

    $scope.model = {
        tipo: 'year',
        tarifa: '',
        fecha: new Date(),
        fechaFin: new Date(),
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
        let param = {
            year: $scope.model.fecha.getFullYear()
        };
        if ($scope.model.tipo == 'month'){
            param.month = $scope.model.fecha.getMonth() + 1;
        }
        if ($scope.model.tipo == 'day'){
            param.fechaInicio = $scope.model.fecha;
            param.fechaFin = $scope.model.fechaFin;
        }
        param.tarifa = $scope.model.tarifa;
        reportsFactory.getReporteTerminales(param, (data) => {
            $scope.model.loading = false;
            if (data.status == 'OK'){
                $scope.dataReporte = data.data;
                /*$scope.dataReporte.forEach((tarifa) => {
                    tarifa.descripcion = angular.isDefined($scope.descripciones[tarifa.code]) ? $scope.descripciones[tarifa.code] : 'Sin definir'
                })*/
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

    $scope.descargarCSV = function(){
        let nombreReporte;
        $scope.disableDown = true;
        let param = {
            year: $scope.model.fecha.getFullYear()
        };
        if ($scope.model.tipo == 'month'){
            nombreReporte = 'Tarifas_terminales_' + loginService.filterTerminal + '_' + param.year;
            param.month = $scope.model.fecha.getMonth() + 1;
            nombreReporte += '_' + param.month;
        }
        if ($scope.model.tipo == 'day'){
            nombreReporte = 'Tarifas_terminales_' + $scope.model.fecha.getDay() + '_' + $scope.model.fechaFin.getDay();
            param.fechaInicio = $scope.model.fecha;
            param.fechaFin = $scope.model.fechaFin;
        }

        param.tarifa = $scope.model.tarifa;
        param.output = 'csv';
        nombreReporte += '.csv';

        reportsFactory.getTerminalesCSV(param, nombreReporte, (status) => {
            $scope.disableDown = false;

            if (status != 'OK'){
                dialogs.error('Reportes', 'Se ha producido un error al descargar los datos.');
            }
        })
    };

}]);