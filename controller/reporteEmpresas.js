/**
 * Created by artiom on 21/08/15.
 */
myapp.controller('facturacionPorEmpresaCtrl', ['$scope', 'controlPanelFactory', 'dialogs', 'loginService', 'generalCache',
	function($scope, controlPanelFactory, dialogs, loginService, generalCache){

		$scope.ranking = true;

		$scope.chartReporteEmpresas = {
			title: 'Totales por empresa',
			width: 600,
			height: 400,
			type: 'column',
			columns: 1,
			currency: true,
			stacked: false,
			is3D: false,
			money: 'PES',
			data: [
				['Empresas', 'algo'],
				['hola', 2526]
			],
			id: 1,
			image: null
		};

		$scope.chartPorcentaje = {
			title: 'Porcentajes respecto del total',
			width: 600,
			height: 400,
			type: 'pie',
			currency: true,
			stacked: false,
			is3D: true,
			money: 'PES',
			data: [
				['Empresas', 'algo'],
				['hola', 2526]
			],
			id: 2,
			image: null
		};

		$scope.selectRow = function (index) {
			$scope.selected = index;
		};
		$scope.rowClass = function (index) {
			return ($scope.selected === index) ? "selected" : "";
		};

		$scope.listaClientes = generalCache.get('clientes' + loginService.getFiltro());

		$scope.cargando = false;

		$scope.totalTerminal = 0;

		var armarGrafico = function(){
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
			$scope.chartReporteEmpresas.data = baseTotales;
			$scope.chartPorcentaje.data = basePorcentaje;
		};

		$scope.clientSelected = function(cliente){
			var i = $scope.model.clients.indexOf(cliente.nombre);
			if (i == -1){
				$scope.model.clients.push(cliente.nombre);
				$scope.ranking = false;
			} else {
				$scope.quitarCliente(cliente.nombre);
			}
		};

		$scope.quitarCliente = function(cliente){
			var i = $scope.model.clients.indexOf(cliente);
			$scope.model.clients.splice(i, 1);
			if ($scope.model.clients.length == 0) $scope.ranking = true;
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
			terminal: '',
			top: 20
		};

		$scope.resultados =  [];

		$scope.$on('iniciarBusqueda', function(){
			cargarReporte();
		});

		var tratarResultado = function(data){
			if (data.status == 'OK'){
				$scope.resultados = data.data;
				$scope.totalTerminal = data.total;
				armarGrafico();
				$scope.mensajeResultado.titulo = 'Reporte empresas';
				$scope.mensajeResultado.tipo = 'panel-info';
				if ($scope.model.clients.length == 1){
					$scope.mensajeResultado.mensaje = 'No se hallaron datos de facturación para ' + $scope.model.clients[0] + ' entre las fechas seleccionadas.';
				} else {
					$scope.mensajeResultado.mensaje = 'No se hallaron datos de facturación para los clientes seleccionados entre las fechas dadas.';
				}
			} else {
				$scope.mensajeResultado = {
					titulo: 'Error',
					mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
					tipo: 'panel-danger'
				};
				$scope.resultados = [];
			}
			$scope.cargando = false;
		};

		var cargarReporte = function(){
			$scope.cargando = true;
			$scope.model.terminal = loginService.getFiltro();
			var datos = angular.copy($scope.model);
			if ($scope.ranking){
				controlPanelFactory.getTopFacturacionEmpresas(datos, tratarResultado)
			} else {
				datos.top = '';
				controlPanelFactory.getFacturacionEmpresas(datos, tratarResultado)
			}
		};

		$scope.$on('cambioTerminal', function(){
			$scope.searchClient = '';
			$scope.listaClientes = generalCache.get('clientes' + loginService.getFiltro());
			$scope.resultados = [];
			$scope.mensajeResultado = {
				titulo: 'Reporte empresas',
				mensaje: 'Seleccione una razón social para realizar la búsqueda.',
				tipo: 'panel-info'
			};
			$scope.model.clients = [];
		});

		$scope.descargarPdf = function(){

		}
}]);