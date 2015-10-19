/**
 * Created by artiom on 21/08/15.
 */
myapp.controller('facturacionPorEmpresaCtrl', ['$scope', 'controlPanelFactory', 'dialogs', 'loginService', 'generalCache',
	function($scope, controlPanelFactory, dialogs, loginService, generalCache){

		$scope.chartWidth = 600;
		$scope.chartHeight = 400;

		$scope.chartTitleReporteEmpresas = "Totales por empresa";
		$scope.chartDataReporteEmpresas = [
			['Empresas', 'algo'],
			['hola', 2526]
		];

		$scope.chartTitlePorcentaje = "Porcentajes respecto del total";
		$scope.chartDataPorcentaje = [
			['Codigos', 0],
			['hola', 2526]
		];

		$scope.monedaFija = 'PES';

		$scope.selectRow = function (index) {
			$scope.selected = index;
		};
		$scope.rowClass = function (index) {
			return ($scope.selected === index) ? "selected" : "";
		};

		$scope.columnChart = 'column';
		$scope.pieChart = 'pie';

		$scope.listaClientes = generalCache.get('clientes' + loginService.getFiltro());

		$scope.cargando = false;

		$scope.totalTerminal = 0;

		$scope.armarGrafico = function(){
			var baseTotales = [
				['Empresas', 'Total']
			];
			var basePorcentaje = [];
			var total = 0;
			$scope.resultados.forEach(function(cliente){
				total += cliente.total;
				var nuevaLinea = [];
				nuevaLinea.push(cliente.razon);
				nuevaLinea.push(cliente.total);
				baseTotales.push(angular.copy(nuevaLinea));
				basePorcentaje.push(angular.copy(nuevaLinea));
			});
			basePorcentaje.push(['Otros', $scope.totalTerminal - total]);
			$scope.chartDataReporteEmpresas = baseTotales;
			$scope.chartDataPorcentaje = basePorcentaje;
		};

		$scope.clientSelected = function(cliente){
			var i = $scope.model.clients.indexOf(cliente.nombre);
			if (i == -1){
				$scope.model.clients.push(cliente.nombre);
			} else {
				$scope.quitarCliente(cliente.nombre);
			}
		};

		$scope.quitarCliente = function(cliente){
			var i = $scope.model.clients.indexOf(cliente);
			$scope.model.clients.splice(i, 1);
		};

		$scope.fechaInicio = new Date();
		$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

		$scope.mensajeResultado = {
			titulo: 'Reporte empresas',
			mensaje: 'Seleccione una razón social para realizar la búsqueda.',
			tipo: 'panel-info'
		};

		$scope.$on('errorInesperado', function(e, mensaje){
			$scope.cargando = false;
			$scope.invoices = [];
			$scope.mensajeResultado = mensaje;
		});

		$scope.model = {
			fechaInicio: $scope.fechaInicio,
			fechaFin: $scope.fechaFin,
			clients: [],
			terminal: ''
		};

		$scope.resultados =  [];

		$scope.$on('iniciarBusqueda', function(){
			if ($scope.model.clients.length > 0){
				$scope.cargarReporte();
			} else {
				dialogs.notify('Facturación por empresa', 'Debe seleccionar al menos una razón social para realizar la búsqueda');
			}
		});

		$scope.todasLasTerminales = true;

		$scope.cargarReporte = function(){
			$scope.cargando = true;
			$scope.model.terminal = loginService.getFiltro();
			controlPanelFactory.getFacturacionEmpresas($scope.model, function(data){
				if (data.status == 'OK'){
					$scope.resultados = data.data;
					$scope.totalTerminal = data.total;
					$scope.armarGrafico();
					$scope.mensajeResultado.mensaje = 'No se hallaron datos de facturación para ' + $scope.model.razonSocial + ' entre las fechas seleccionadas.';
				} else {
					$scope.mensajeResultado = {
						titulo: 'Error',
						mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
						tipo: 'panel-danger'
					};
					$scope.resultados = [];
				}
				$scope.cargando = false;
			})
		}
}]);