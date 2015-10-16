/**
 * Created by artiom on 21/08/15.
 */
myapp.controller('facturacionPorEmpresaCtrl', ['$scope', 'controlPanelFactory', 'dialogs', 'loginService',
	function($scope, controlPanelFactory, dialogs, loginService){

		$scope.fechaInicio = new Date();
		$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

		$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'documentoCliente', 'contenedor', 'codigo', 'estado', 'buque', 'viaje', 'itemsPerPage'];

		$scope.model = {
			fechaInicio: $scope.fechaInicio,
			fechaFin: $scope.fechaFin,
			razonSocial: '',
			terminal: ''
		};

		$scope.resultados =  [];

		$scope.$on('iniciarBusqueda', function(){
			if ($scope.model.razonSocial != ''){
				$scope.cargarReporte();
			} else {
				dialogs.notify('Facturación por empresa', 'Debe seleccionar una razón social para realizar la búsqueda');
			}
		});

		$scope.todasLasTerminales = true;

		$scope.cargarReporte = function(){
			if (!$scope.todasLasTerminales){
				$scope.model.terminal = loginService.getFiltro();
			} else {
				$scope.model.terminal = ''
			}
			controlPanelFactory.getFacturacionEmpresas($scope.model, function(data){
				console.log(data);
				if (data.status == 'OK'){
					$scope.resultados = data.data;
				}
			})
		}
}]);