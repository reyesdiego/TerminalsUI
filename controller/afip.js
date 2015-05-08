/**
 * Created by artiom on 19/12/14.
 */

myapp.controller('afipCtrl',['$scope', 'afipFactory', '$state', 'generalFunctions', function($scope, afipFactory, $state, generalFunctions){

	$scope.tabs = [
		{ heading: 'Afectación',	select: 'afectacion1',	uisref: 'afip.afectacion.afectacion1' },
		{ heading: 'Detallada',		select: 'detimpo1',		uisref: 'afip.detalle.detimpo1' },
		{ heading: 'Solicitud',		select: 'solicitud1',	uisref: 'afip.solicitud.solicitud1' },
		{ heading: 'Sumarias',		select: 'impo1',		uisref: 'afip.sumatorias.impo1' }
	];

	$scope.model = {
		afectacion: '',
		detalle: '',
		solicitud: '',
		sumaria: '',
		conocimiento: '',
		buqueNombre: '',
		contenedor: '',
		fechaInicio: '',
		fechaFin: '',
		filtroOrden: '',
		filtroOrdenReverse: false,
		filtroAnterior: '',
		order: '',
		currentPage: 1
	};

	$scope.panelMensaje = {
		titulo: 'AFIP',
		mensaje: 'No se encontraron datos en la tabla seleccionada.',
		tipo: 'panel-info'
	};

	$scope.ocultarFiltros = ['solicitud', 'detalle'];

	$scope.datosRegistro = [];
	$scope.totalItems = 0;
	$scope.itemsPerPage = 15;
	$scope.page = {
		skip: 0,
		limit: $scope.itemsPerPage
	};
	$scope.actualRegistro = 'afectacion1';
	$scope.afectacionActiva = true;

	$scope.buques = {
		afectacion: [],
		impo: [],
		expo: []
	};
	$scope.vistaConBuques = false;


	$scope.openDate = function(event){
		generalFunctions.openDate(event)
	};

	$scope.buqueSelected = function(selected){
		if (angular.isDefined(selected) && selected.title != $scope.model.buqueNombre){
			$scope.model.buqueNombre = selected.originalObject.D;
		}
	};

	$scope.$watch('$state.current', function(){
		$scope.vistaConBuques = false;
		if ($state.current.name == 'afip'){
			$state.transitionTo('afip.afectacion.afectacion1');
			$scope.cargaDatos('afectacion1');
			$scope.tabs[0].active = true;
		} else if ($state.current.name == 'afip.sumatorias.impo1') {
			if ($scope.buques.impo.length == 0) {
				afipFactory.getBuquesImpo(function (data) {
					$scope.buques.impo = data.data;
					$scope.listaBuques = $scope.buques.impo;
				});
			} else {
				$scope.listaBuques = $scope.buques.impo;
			}
			$scope.vistaConBuques = true;
		} else if ($state.current.name == 'afip.sumatorias.expo1') {
			if ($scope.buques.expo.length == 0) {
				afipFactory.getBuquesExpo(function (data) {
					$scope.buques.expo = data.data;
					$scope.listaBuques = $scope.buques.expo;
				});
			} else {
				$scope.listaBuques = $scope.buques.expo;
			}
			$scope.vistaConBuques = true;
		} else if ($state.current.name == 'afip.afectacion.afectacion1') {
			if ($scope.buques.afectacion.length == 0) {
				afipFactory.getBuquesExpo(function (data) {
					$scope.buques.afectacion = data.data;
					$scope.listaBuques = $scope.buques.afectacion;
				});
			} else {
				$scope.listaBuques = $scope.buques.afectacion;
			}
			$scope.vistaConBuques = true;
		}
	});

	$scope.$on('cambioPagina', function(event, data){
		$scope.model.currentPage = data;
		$scope.cargaDatos($scope.actualRegistro);
	});

	$scope.$on('errorInesperado', function(){
		$scope.cargando = false;
		$scope.datosRegistro = [];
	});

	$scope.hitEnter = function(evt){
		if(angular.equals(evt.keyCode,13))
			$scope.cargaDatos($scope.actualRegistro);
	};

	$scope.filtrado = function(filtro, contenido){
		$scope.cargando = true;
		$scope.model.currentPage = 1;
		$scope.model[filtro] = contenido;
		if ($scope.model.fechaInicio > $scope.model.fechaFin && $scope.model.fechaFin != ''){
			$scope.model.fechaFin = new Date($scope.model.fechaInicio);
			$scope.model.fechaFin.setDate($scope.model.fechaFin.getDate() + 1);
		}
		$scope.cargaDatos($scope.actualRegistro);
	};

	$scope.filtrarOrden = function(filtro){
		$scope.model = generalFunctions.filtrarOrden($scope.model, filtro);
		$scope.cargaDatos($scope.actualRegistro);
	};

	$scope.cargaDatos = function(registro){
		$scope.cargando = true;
		if (registro != $scope.actualRegistro){
			$scope.model = {
				afectacion: '',
				detalle: '',
				solicitud: '',
				sumaria: '',
				conocimiento: '',
				buqueNombre: '',
				contenedor: '',
				fechaInicio: $scope.fechaInicio,
				fechaFin: $scope.fechaFin,
				filtroOrden: '',
				filtroOrdenReverse: false,
				filtroAnterior: '',
				order: '',
				currentPage: 1
			};
		}
		$scope.actualRegistro = registro;
		switch ($scope.actualRegistro){
			case 'afectacion1':
				$scope.ocultarFiltros = ['solicitud', 'detalle', 'conocimiento', 'contenedor'];
				break;
			case 'afectacion2':
				$scope.ocultarFiltros = ['solicitud', 'detalle', 'sumaria', 'conocimiento', 'buque', 'contenedor', 'fechaInicio', 'fechaFin'];
				$scope.model.fechaInicio = '';
				$scope.model.fechaFin = '';
				break;
			case 'detimpo1':
				$scope.ocultarFiltros = ['afectacion', 'solicitud', 'buque', 'contenedor'];
				break;
			case 'detimpo2':
				$scope.ocultarFiltros = ['afectacion', 'solicitud', 'buque', 'contenedor', 'fechaInicio', 'fechaFin'];
				$scope.model.fechaInicio = '';
				$scope.model.fechaFin = '';
				break;
			case 'detimpo3':
				$scope.ocultarFiltros = ['afectacion', 'solicitud', 'sumaria', 'conocimiento', 'buque', 'contenedor', 'fechaInicio', 'fechaFin'];
				$scope.model.fechaInicio = '';
				$scope.model.fechaFin = '';
				break;
			case 'detexpo1':
				$scope.ocultarFiltros = ['afectacion', 'solicitud', 'sumaria', 'conocimiento', 'buque', 'contenedor'];
				break;
			case 'detexpo2':
			case 'detexpo3':
				$scope.ocultarFiltros = ['afectacion', 'solicitud', 'sumaria', 'conocimiento', 'buque', 'contenedor', 'fechaInicio', 'fechaFin'];
				$scope.model.fechaInicio = '';
				$scope.model.fechaFin = '';
				break;
			case 'solicitud1':
				$scope.ocultarFiltros = ['afectacion', 'detalle', 'conocimiento', 'contenedor'];
				break;
			case 'solicitud2':
				$scope.ocultarFiltros = ['afectacion', 'detalle', 'sumaria', 'buque', 'contenedor', 'fechaInicio', 'fechaFin'];
				$scope.model.fechaInicio = '';
				$scope.model.fechaFin = '';
				break;
			case 'solicitud3':
				$scope.ocultarFiltros = ['afectacion', 'detalle', 'sumaria', 'conocimiento', 'buque', 'fechaInicio', 'fechaFin'];
				$scope.model.fechaInicio = '';
				$scope.model.fechaFin = '';
				break;
			case 'impo1':
			case 'expo1':
				$scope.ocultarFiltros = ['afectacion', 'detalle', 'solicitud', 'conocimiento', 'contenedor'];
				break;
			case 'impo2':
			case 'impo3':
			case 'expo2':
			case 'expo3':
			case 'expo5':
				$scope.ocultarFiltros = ['afectacion', 'detalle', 'solicitud', 'buque', 'contenedor', 'fechaInicio', 'fechaFin'];
				$scope.model.fechaInicio = '';
				$scope.model.fechaFin = '';
				break;
			case 'impo4':
			case 'expo4':
				$scope.ocultarFiltros = ['afectacion', 'detalle', 'solicitud', 'buque', 'fechaInicio', 'fechaFin'];
				break;
		}
		$scope.page.skip = (($scope.model.currentPage - 1) * $scope.itemsPerPage);
		$scope.page.limit = $scope.itemsPerPage;
		$scope.datosRegistro = [];
		afipFactory.getAfip(registro, $scope.model, $scope.page, function(data){
			if(data.status === 'OK'){
				$scope.datosRegistro = data.data;
				$scope.totalItems = data.totalCount;
				$scope.cargando = false;
			} else {
				$scope.panelMensaje = {
					titulo: 'AFIP',
					mensaje: 'Se ha producido un error al cargar los datos.',
					tipo: 'panel-danger'
				};
				$scope.datosRegistro = [];
				$scope.totalItems = 0;
				$scope.cargando = false;
			}
		});
	};

	$scope.cargaDatos($scope.actualRegistro);
}]);

