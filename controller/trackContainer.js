/**
 * Created by kolesnikov-a on 04/08/2016.
 */
myapp.controller('trackContainerCtrl', ['$rootScope', '$scope', '$window', '$state', 'Container',
    function($rootScope, $scope, $window, $state, Container){

        $rootScope.pageTitle = $window.localStorage.getItem('trackContainer');
        $scope.filtrosComprobantes = ['codTipoComprob', 'razonSocial', 'nroComprobante', 'fechaInicio'];
        //$rootScope.inTrackContainer = true;

        $scope.contenedorElegido = new Container({ contenedor: $window.localStorage.getItem('trackContainer')});

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
            $scope.contenedorElegido.getInvoices($scope.$id, $scope.pageComprobantes).then(function(){
                $scope.loadingInvoices = false;
            }, function(){
                $scope.mensajeResultado = {
                    titulo: 'Comprobantes',
                    mensaje: 'Se ha producido un error al cargar los datos de los comprobantes.',
                    tipo: 'panel-danger'
                };
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
                $scope.contenedorElegido.getRates($state.current.name, $scope.moneda).then(function(){
                    $scope.loadingTasas = false;
                }, function(error){
                    $scope.configPanelTasas = {
                        tipo: 'panel-danger',
                        titulo: 'Tasas',
                        mensaje: 'Se ha producido un error al cargar los datos de las tasas.'
                    };
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
            $scope.contenedorElegido.getGates(page).then(function(){
                $scope.loadingGates = false;
            }, function(){
                $scope.configPanelGates = {
                    tipo: 'panel-danger',
                    titulo: 'Gates',
                    mensaje: 'Se ha producido un error al cargar los gates.'
                };
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
            $scope.contenedorElegido.getAppointments(page).then(function(){
                $scope.loadingTurnos = false;
            }, function(){
                $scope.configPanelTurnos = {
                    tipo: 'panel-danger',
                    titulo: 'Turnos',
                    mensaje: 'Se ha producido un error al cargar los turnos.'
                };
                $scope.loadingTurnos = false;
            });
        };

        var cargaSumaria = function(){
            $scope.sumariaAfip = [];
            $scope.cargandoSumaria = true;
            $scope.sumariaConfigPanel = {
                tipo: 'panel-info',
                titulo: 'A.F.I.P. sumaria',
                mensaje: 'No se encontraron datos en los registros de A.F.I.P. para el contenedor seleccionado.'
            };
            $scope.contenedorElegido.getAfipData()
                .then(function(){
                    $scope.cargandoSumaria = false;
                }, function(error){
                    console.log(error);
                    $scope.cargandoSumaria = false;
                });
        };

        $scope.cargarDatos();

    }]);