/**
 * Created by Diego on 28/04/14.
 */

myapp.controller('turnosTodosCtrl', ['$scope', 'turnosFactory', 'loginService', 'TERMINAL_COLORS', 'controlPanelFactory', function($scope, turnosFactory, loginService, TERMINAL_COLORS, controlPanelFactory){
	$scope.fechaInicio = new Date();
	$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	$scope.fecha = new Date();

	$scope.showCsv = false;
	$scope.control = false;
	$scope.currentPage = 1;
	$scope.itemsPerPage = 15;
	$scope.totalItems = 0;
	$scope.turnosGates = true;
	$scope.cargando = false;
	$scope.configPanel = {
		tipo: 'panel-info',
		titulo: 'Turnos',
		mensaje: 'No se han encontrado turnos para los filtros seleccionados.'
	};

	const barColors = {
		"bactssa": TERMINAL_COLORS.BACTSSA,
		"terminal4": TERMINAL_COLORS.TERMINAL4,
		"trp": TERMINAL_COLORS.TRP
	};

	$scope.radioModel = 'Gates';

	$scope.diaGatesTurnos = new Date();
	$scope.diaGatesTurnosFin = new Date();

	$scope.ocultarFiltros = ['patenteCamion', 'tren', 'carga', 'ontime', 'onlyTrains', 'size', 'fechaInicio', 'fechaFin'];

	// Fecha (dia y hora)
	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': 0,
		'nroComprobante': '',
		'razonSocial': '',
		'documentoCliente': '',
		'fechaInicio': $scope.fechaInicio,
		'fechaFin': $scope.fechaFin,
		'fecha': $scope.fecha,
		'fechaConGMT': true,
		'contenedor': '',
		'buqueNombre': '',
		'viaje': '',
		'estado': 'N',
		'code': '',
		'mov': 'IMPO',
		'filtroOrden': 'inicio',
		'filtroOrdenAnterior': 'inicio',
		'filtroOrdenReverse': false,
		'order': '"inicio":1'
	};

	$scope.chartDiaGatesTurnos = {
		options: {
			width: '100%',
			height: '100%',
			series: {3: {type: "line"}},
			currency: false,
			stacked: false,
			is3D: false,
			colors: [barColors.bactssa, barColors.terminal4, barColors.trp, 'green'],
			id: 5,
			image: null
		},
		data: [
			['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ]
		],

	};

	$scope.model.fechaInicio.setHours(0,0);
	$scope.model.fechaFin.setMinutes(0);
	$scope.model.fechaFin.setHours($scope.model.fechaFin.getHours() + 1);

	$scope.fechaAuxDesde = new Date();
	$scope.fechaAuxHasta = new Date();

	// Variable para almacenar la info principal que trae del factory
	$scope.turnos = [];

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
		$scope.cargaTurnos();
	});

	$scope.$on('iniciarBusqueda', function(event, data){
		$scope.currentPage = 1;
		$scope.cargaTurnos();
	});

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.cargando = false;
		$scope.turnos = [];
		$scope.configPanel = mensaje;
	});

	// Carga los turnos por fechas
	$scope.cargaPorFiltros = function(){
		$scope.currentPage = 1;
		$scope.cargaTurnos();
	};

	$scope.cargaTurnos = function(){
		$scope.cargando = true;
		$scope.turnos = [];
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.page.limit = $scope.itemsPerPage;
		$scope.configPanel = {
			tipo: 'panel-info',
			titulo: 'Turnos',
			mensaje: 'No se han encontrado turnos para los filtros seleccionados.'
		};
		turnosFactory.getTurnos($scope.model, $scope.page).then((data) => {
			$scope.turnos = data.data;
			$scope.totalItems = data.totalCount;
		}).catch((error) => {
			$scope.configPanel = {
				tipo: 'panel-danger',
				titulo: 'Turnos',
				mensaje: 'Se ha producido un error al cargar los turnos.'
			};
		}).finally(() => $scope.cargando = false);
	};

	$scope.traerDatosGatesTurnosDia = function(){
		let promise = null;
		$scope.isOpenDayGatesTurnos = false;
		$scope.isOpenDayGatesTurnosFin = false;

		//$scope.gatesTurnos.error = false;
		$scope.cargando = true;

		$scope.diaGatesTurnos.setHours(0, 0, 0);
		$scope.diaGatesTurnosFin.setHours(0, 0, 0);

		const params = {
			fechaInicio: $scope.diaGatesTurnos,
			fechaFin: $scope.diaGatesTurnosFin,
			fechaConGMT: true
		};

		if ($scope.radioModel == 'Gates'){
			promise = controlPanelFactory.getGatesDia(params);
		} else if ($scope.radioModel == 'Turnos'){
			promise = controlPanelFactory.getTurnosDia(params);
		}
		promise.then((graf) => {
			if (graf.status == 'OK'){
				$scope.chartDiaGatesTurnos.data = graf.data;
				if ($scope.radioModel == 'Gates'){
					$scope.labelPorHora = 'Gates por hora'
				} else {
					$scope.labelPorHora = 'Turnos por hora'
				}
			} else {
				$scope.gatesTurnos.error = true;
			}
		}).catch(error => {
			console.log(error);
			$scope.gatesTurnos.error = true;
			if (error.status != -5){
				$scope.gatesTurnos.mesnsaje = error.data.data.msg;
			} else {
				$scope.gatesTurnos.mesnsaje = error.data.message;
			}
		}).finally(() => {
			//$scope.gatesTurnos.loading = false;
			$scope.cargando = false;
		});
	};


	// Carga los turnos del día hasta la hora del usuario
	if (loginService.isLoggedIn) {
		$scope.cargaTurnos();
		$scope.traerDatosGatesTurnosDia();
	}

	/*$scope.$on('cambioTerminal', function(){
		$scope.cargaTurnos();
	});*/

	/*$scope.$on('$destroy', function(){
		turnosFactory.cancelRequest();
	});*/

}]);