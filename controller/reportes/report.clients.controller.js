/**
 * Created by artiom on 21/08/15.
 */
myapp.controller('facturacionPorEmpresaCtrl', ['$scope', 'reportsFactory', 'dialogs', 'loginService', 'cacheService', 'downloadFactory',
	function($scope, reportsFactory, dialogs, loginService, cacheService, downloadFactory){

		$scope.ranking = true;

		$scope.chartReporteEmpresas = {
			options: {
				title: 'Totales por empresa',
				width: '100%',
				height: 500,
				columns: 1,
				currency: true,
				stacked: false,
				is3D: false,
				money: 'PES',
				id: 1,
				image: null
			},
			data: [
				['Empresas', 'algo'],
				['hola', 2526]
			]
		};

		$scope.chartPorcentaje = {
			options: {
				title: 'Porcentajes respecto del total',
				width: '100%',
				height: 500,
				currency: true,
				stacked: false,
				is3D: true,
				money: 'PES',
				id: 2,
				image: null
			},
			data: [
				['Empresas', 'algo'],
				['hola', 2526]
			]
		};

		$scope.selectRow = function (index) {
			$scope.selected = index;
		};
		$scope.rowClass = function (index) {
			return ($scope.selected === index) ? "selected" : "";
		};

		$scope.listaClientes = cacheService.cache.get('clientes' + loginService.filterTerminal);

		$scope.cargando = false;

		$scope.totalTerminal = 0;

		function armarGrafico(){
			let dataGraficos = [
				['Empresas', 'Total']
			];
			let total = 0;
			$scope.resultados.forEach((cliente) => {
				total += cliente.total;
				dataGraficos.push([cliente.razon, cliente.total]);
			});
			let otros = $scope.totalTerminal - total;
			if (otros < 0) otros = 0;
			$scope.chartReporteEmpresas.data = angular.copy(dataGraficos);
			dataGraficos.push(['Otros', otros]);
			$scope.chartPorcentaje.data = angular.copy(dataGraficos);
		}

		$scope.clientSelected = function(cliente){
			let i = $scope.model.clients.indexOf(cliente.nombre);
			if (i == -1){
				$scope.model.clients.push(cliente.nombre);
				$scope.ranking = false;
			} else {
				$scope.quitarCliente(cliente.nombre);
			}
		};

		$scope.quitarCliente = function(cliente){
			let i = $scope.model.clients.indexOf(cliente);
			$scope.model.clients.splice(i, 1);
			if ($scope.model.clients.length == 0) $scope.ranking = true;
		};

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
			fechaInicio: new Date(),
			fechaFin: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
			clients: [],
			terminal: '',
			top: '20',
			campo: 'total',
			order: '-1',
			normalOrder: true
		};

		$scope.resultados =  [];

		$scope.$on('iniciarBusqueda', function(){
			cargarReporte();
		});

		function tratarResultado(data){
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
		}

		function cargarReporte(){
			$scope.cargando = true;
			$scope.model.terminal = loginService.filterTerminal;
			const datos = angular.copy($scope.model);
			if ($scope.ranking){
				reportsFactory.getTopFacturacionEmpresas(datos, tratarResultado)
			} else {
				datos.top = '';
				reportsFactory.getFacturacionEmpresas(datos, tratarResultado)
			}
		}

		$scope.setOrder = function(order){
			if ($scope.model.campo == order){
				$scope.model.order = $scope.model.order == '-1' ? '1' : '-1';
			} else {
				$scope.model.campo = order;
				$scope.model.order = '-1';
			}
			cargarReporte();
		};

		$scope.descargarPdf = function(){
			const data = {
				id: $scope.$id,
				desde: $scope.model.fechaInicio,
				hasta: $scope.model.fechaFin,
				hoy: new Date(),
				resultados: $scope.resultados,
				totalTerminal: $scope.totalTerminal,
				terminal: loginService.filterTerminal,
				charts: [
					{filename: $scope.chartReporteEmpresas.options.id, image: $scope.chartReporteEmpresas.options.image.data, h: $scope.chartReporteEmpresas.options.image.h, w: $scope.chartReporteEmpresas.options.image.w},
					{filename: $scope.chartPorcentaje.options.id, image: $scope.chartPorcentaje.options.image.data, h: $scope.chartPorcentaje.options.image.h, w: $scope.chartPorcentaje.options.image.w}
				]
			};
			const nombreReporte = 'Reporte_empresas.pdf';
			downloadFactory.convertToPdf(data, 'reporteEmpresasPdf', nombreReporte).then().catch(() => {
				dialogs.error('Reporte empresas', 'Se ha producido un error al exportar el reporte a PDF');
			});
		};

		$scope.descargarCsv = function(all){
			let alterModel = angular.copy($scope.model);
			alterModel.output = 'csv';
			if (all){
				alterModel.clientes = [];
				alterModel.top = '';
			}
			controlPanelFactory.getFacturacionEmpresasCSV(alterModel, (status) => {
				if (status != 'OK'){
					dialogs.error('Reporte empresas', 'Se ha producido un error al descargar el reporte.');
				}
			})
		}
}]);