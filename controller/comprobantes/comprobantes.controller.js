/**
 * Created by Diego Reyes on 2/3/14.
 */

myapp.controller('invoicesCtrl', ['$rootScope', '$scope', 'invoiceFactory', 'loginService', 'dialogs', function($rootScope, $scope, invoiceFactory, loginService, dialogs){

    $scope.dataTerminal = loginService;
    $scope.disableDown = false;

    $scope.fechaInicio = new Date();
    $scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    $scope.ocultarFiltros = ['nroPtoVenta'];

    $scope.model = {
        'nroPtoVenta': '',
        'codTipoComprob': '',
        'nroComprobante': '',
        'razonSocial': '',
        'documentoCliente': '',
        'fechaInicio': $scope.fechaInicio,
        'fechaFin': $scope.fechaFin,
        'contenedor': '',
        'buqueNombre': '',
        'viaje': '',
        'estado': 'N',
        'code': '',
        'filtroOrden': 'fecha.emision',
        'filtroOrdenAnterior': '',
        'filtroOrdenReverse': false,
        'order': '',
        'itemsPerPage': 15,
        'rates': '',
        'payment': '',
        'payed': ''
    };

    $scope.invoices = [];
    $scope.invoicesResumen = {};

    $scope.cargando = true;

    $scope.$on('cambioPagina', function(event, data){
        $scope.currentPage = data;
        $scope.cargaDatos();
        $scope.getTotales();
    });

    $scope.$on('cambioFiltro', (event, data) => {
        $scope.currentPage = 1;
        $scope.cargaDatos();
        $scope.getTotales();
    });

    $scope.$on('cambioOrden', (event, data) => {
        $scope.cargaDatos();
        $scope.getTotales();
    });

    $scope.$on('descargarCsv', (event, model) => {
        console.log(event);
        console.log("paso por comprobante.controller descargarCsv %j", model);
        $scope.descargarCSV(model);
    });


    $scope.$on('errorInesperado', (e, mensaje) => {
        $scope.cargando = false;
        $scope.invoices = [];
        $scope.mensajeResultado = mensaje;
    });

    $scope.cargaDatos = () => {
        $scope.cargando = true;
        $scope.page.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
        $scope.page.limit = $scope.model.itemsPerPage;
        $scope.invoices = [];
        invoiceFactory.getInvoices($scope.$id, $scope.model, $scope.page).then(data => {
            $scope.invoices = data.data;
            $scope.totalItems = data.totalCount;
        }).catch((error) => {
            $scope.mensajeResultado = {
                titulo: 'Error',
                mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
                tipo: 'panel-danger'
            };
            $scope.invoices = [];
        }).finally(() => $scope.cargando = false);
    };

    $scope.getTotales = () => {
        var terminal = loginService.filterTerminal;

        let prom1 = invoiceFactory.getTotales($scope.model);
        let prom2 = invoiceFactory.getRatesInvoices($scope.model);

        Promise.all([prom1, prom2])
        .then(data => {
                let totales = data[0];
                let tasas = data[1];
                $scope.invoicesResumen = totales.data.find(item => (item.terminal === terminal));
                let codes = [];
                tasas.data.forEach(item => {codes = codes.concat(item.codes)});
                let invoData = codes.filter(ter => ter.terminal === terminal).map(x => ({total: x.total, ton: x.ton}) ).reduce((x, y) => ({total: x.total + y.total, ton: x.ton + y.ton}));
                $scope.invoicesResumen.tasa = invoData.total;
                $scope.invoicesResumen.ton = invoData.ton;
            });
    };


    $scope.descargarCSV = (model) => {
        $scope.disableDown = true;
        invoiceFactory.getCSV(model, 'Comprobantes.csv', (status) => {
            if (status != 'OK'){
                dialogs.error('Comprobantes', 'Se ha producido un error al exportar los datos a CSV.');
            }
            $scope.disableDown = false;
        });
    }

}]);