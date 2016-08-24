/**
 * Created by kolesnikov-a on 04/08/2016.
 */
myapp.controller('trackContainerCtrl', ['$rootScope', '$scope', '$window', 'invoiceFactory', 'controlPanelFactory', 'gatesFactory', 'turnosFactory', 'afipFactory', '$q', '$state', 'invoiceManager',
    function($rootScope, $scope, $window, invoiceFactory, controlPanelFactory, gatesFactory, turnosFactory, afipFactory, $q, $state, invoiceManager){

        $rootScope.pageTitle = $window.localStorage.getItem('trackContainer');
        $scope.filtrosComprobantes = ['codTipoComprob', 'razonSocial', 'nroComprobante', 'fechaInicio'];
        //$rootScope.inTrackContainer = true;

        $scope.contenedorElegido = { contenedor: $window.localStorage.getItem('trackContainer')};

        $scope.model = {
            rates: '',
            payment: '',
            contenedor: $window.localStorage.getItem('trackContainer'),
            itemsPerPage: 10
        };

        $scope.pageComprobantes = {
            skip: 0,
            limit: 10
        };

        $scope.cargarDatos = function(){
            $scope.hayError = false;
            cargaComprobantes();
            cargaTasasCargas();
            cargaGates();
            cargaTurnos();
            cargaSumaria();
        };

        var cargaComprobantes = function(){
            $scope.loadingInvoices = true;
            $scope.mensajeResultado = {
                titulo: 'Comprobantes',
                mensaje: 'No se encontraron comprobantes para los filtros seleccionados.',
                tipo: 'panel-info'
            };
            $scope.pageComprobantes.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
            $scope.pageComprobantes.limit = $scope.model.itemsPerPage;
            invoiceManager.getInvoices($scope.$id, $scope.model, $scope.pageComprobantes, function(data){
                if(data.status === 'OK'){
                    $scope.invoices = data.data;
                    $scope.invoicesTotalItems = data.totalCount;
                } else {
                    $scope.mensajeResultado = {
                        titulo: 'Comprobantes',
                        mensaje: 'Se ha producido un error al cargar los datos de los comprobantes.',
                        tipo: 'panel-danger'
                    };
                }
                $scope.loadingInvoices = false;
            });
        };

        var cargaTasasCargas = function(){
            if (angular.isDefined($scope.model.contenedor) && $scope.model.contenedor != ''){
                $scope.loadingTasas = true;
                $scope.configPanelTasas = {
                    tipo: 'panel-info',
                    titulo: 'Tasas',
                    mensaje: 'No se encontraron tasas para los filtros seleccionados.'
                };
                var datos = { contenedor: $scope.model.contenedor, currency: $scope.moneda, buqueNombre: $scope.model.buqueNombre, viaje: $scope.model.viaje};
                controlPanelFactory.getTasasContenedor(datos, $state.current.name, function(data){
                    if (data.status === 'OK'){
                        $scope.tasas = data.data;
                        $scope.totalTasas = data.totalTasas;
                    } else {
                        $scope.configPanelTasas = {
                            tipo: 'panel-danger',
                            titulo: 'Tasas',
                            mensaje: 'Se ha producido un error al cargar los datos de las tasas.'
                        };
                    }
                    $scope.loadingTasas = false;
                });
            }
        };

        var cargaGates = function(page){
            $scope.loadingGates = true;
            $scope.configPanelGates = {
                tipo: 'panel-info',
                titulo: 'Gates',
                mensaje: 'No se encontraron gates para los filtros seleccionados.'
            };
            page = page || { skip: 0, limit: $scope.itemsPerPage };
            if (page.skip == 0){ $scope.currentPage = 1}
            gatesFactory.getGate($scope.model, page, function (data) {
                if (data.status === "OK") {
                    $scope.gates = data.data;
                    $scope.gatesTotalItems = data.totalCount;
                    $scope.gatesTiempoConsulta = (data.time / 1000).toFixed(2);
                } else {
                    $scope.configPanelGates = {
                        tipo: 'panel-danger',
                        titulo: 'Gates',
                        mensaje: 'Se ha producido un error al cargar los gates.'
                    };
                }
                $scope.loadingGates = false;
            });
        };

        var cargaTurnos = function(page){
            $scope.loadingTurnos = true;
            $scope.configPanelTurnos = {
                tipo: 'panel-info',
                titulo: 'Turnos',
                mensaje: 'No se encontraron Turnos para los filtros seleccionados.'
            };
            page = page || { skip:0, limit: $scope.itemsPerPage };
            turnosFactory.getTurnos($scope.model, page, function(data){
                if (data.status === "OK"){
                    $scope.turnos = data.data;
                    $scope.turnosTotalItems = data.totalCount;
                } else {
                    $scope.configPanelTurnos = {
                        tipo: 'panel-danger',
                        titulo: 'Turnos',
                        mensaje: 'Se ha producido un error al cargar los turnos.'
                    };
                }
                $scope.loadingTurnos = false;
            });
        };

        var cargaSumariaImpo = function(){
            var deferred = $q.defer();
            afipFactory.getContainerSumaria($scope.model.contenedor, function(data){
                if (data.status == 'OK'){
                    deferred.resolve(data.data);
                } else {
                    $scope.sumariaConfigPanel = {
                        tipo: 'panel-danger',
                        titulo: 'A.F.I.P. sumaria',
                        mensaje: 'Se ha producido un error al cargar los datos de la sumaria del contenedor.'
                    };
                    deferred.reject()
                }
            });
            return deferred.promise;
        };

        var cargaSumariaExpo = function(){
            var deferred = $q.defer();
            afipFactory.getContainerSumariaExpo($scope.model.contenedor, function(data){
                if (data.status == 'OK'){
                    deferred.resolve(data.data);
                } else {
                    $scope.sumariaConfigPanel = {
                        tipo: 'panel-danger',
                        titulo: 'A.F.I.P. sumaria',
                        mensaje: 'Se ha producido un error al cargar los datos de la sumaria del contenedor.'
                    };
                    deferred.reject()
                }
            });
            return deferred.promise;
        };

        var cargaSumaria = function(){
            $scope.sumariaAfip = [];
            $scope.cargandoSumaria = true;
            $scope.sumariaConfigPanel = {
                tipo: 'panel-info',
                titulo: 'A.F.I.P. sumaria',
                mensaje: 'No se encontraron datos en los registros de A.F.I.P. para el contenedor seleccionado.'
            };
            var llamadas = [];
            llamadas.push(cargaSumariaImpo());
            llamadas.push(cargaSumariaExpo());
            $q.all(llamadas)
                .then(function(result){
                    result.forEach(function(resultado){
                        resultado.forEach(function(data){
                            $scope.sumariaAfip.push(data);
                        })
                    });
                    $scope.cargandoSumaria = false;
                }, function(){
                    $scope.cargandoSumaria = false;
                })
        };

        $scope.cargarDatos();

    }]);