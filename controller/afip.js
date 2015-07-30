/**
 * Created by artiom on 19/12/14.
 */

myapp.controller('afipCtrl',['$scope', '$rootScope', 'afipFactory', '$state', 'generalFunctions', 'afipCache', 'loginService', function($scope, $rootScope, afipFactory, $state, generalFunctions, afipCache, loginService){

	$rootScope.rutas.sort();
	$scope.afectacion = 'afip';
	$scope.detalle = 'afip';
	$scope.solicitud = 'afip';
	$scope.sumatoria = 'afip';
	$scope.removido = 'afip';
	$scope.actualRegistro = '';

	if (in_array('afip.afectacion', $rootScope.rutas)){
		$rootScope.rutas.forEach(function(ruta){
			if (ruta.indexOf('afip.afectacion.') >= 0 && $scope.afectacion == 'afip') {
				$scope.afectacion = ruta;
				if ($scope.actualRegistro == '') $scope.actualRegistro = ruta;
			}
		})
	}

	if (in_array('afip.detalle', $rootScope.rutas)){
		$rootScope.rutas.forEach(function(ruta){
			if (ruta.indexOf('afip.detalle.') >= 0 && $scope.detalle == 'afip') {
				$scope.detalle = ruta;
				if ($scope.actualRegistro == '') $scope.actualRegistro = ruta;
			}
		})
	}

	if (in_array('afip.solicitud', $rootScope.rutas)){
		$rootScope.rutas.forEach(function(ruta){
			if (ruta.indexOf('afip.solicitud.') >= 0 && $scope.solicitud == 'afip') {
				$scope.solicitud = ruta;
				if ($scope.actualRegistro == '') $scope.actualRegistro = ruta;
			}
		})
	}

	if (in_array('afip.sumatorias', $rootScope.rutas)){
		$rootScope.rutas.forEach(function(ruta){
			if (ruta.indexOf('afip.sumatorias.') >= 0 && $scope.sumatoria == 'afip') {
				$scope.sumatoria = ruta;
				if ($scope.actualRegistro == '') $scope.actualRegistro = ruta;
			}
		})
	}

	if (in_array('afip.removido', $rootScope.rutas)){
		$rootScope.rutas.forEach(function(ruta){
			if (ruta.indexOf('afip.removido.') >= 0 && $scope.removido == 'afip') {
				$scope.removido = ruta;
				if ($scope.actualRegistro == '') $scope.actualRegistro = ruta;
			}
		})
	}

	$scope.tabs = [
		{ heading: 'Afectación',	uisref: $scope.afectacion,	mostrar: in_array('afip.afectacion', $rootScope.rutas) },
		{ heading: 'Detallada',		uisref: $scope.detalle,		mostrar: in_array('afip.detalle', $rootScope.rutas) },
		{ heading: 'Solicitud',		uisref: $scope.solicitud,	mostrar: in_array('afip.solicitud', $rootScope.rutas) },
		{ heading: 'Sumarias',		uisref: $scope.sumatoria,	mostrar: in_array('afip.sumatorias', $rootScope.rutas) },
		{ heading: 'Removido',		uisref: $scope.removido,	mostrar: in_array('afip.removido', $rootScope.rutas) }
	];

	$scope.model = {
		afectacion: '',
		detallada: '',
		solicitud: '',
		sumaria: '',
		documento: '',
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

	$scope.panelMensaje = {
		titulo: 'AFIP',
		mensaje: 'No se encontraron datos en la tabla seleccionada.',
		tipo: 'panel-info'
	};

	$scope.ocultarFiltros = ['solicitud', 'detallada'];

	$scope.datosRegistro = [];
	$scope.totalItems = 0;
	$scope.itemsPerPage = 15;
	$scope.page = {
		skip: 0,
		limit: $scope.itemsPerPage
	};

	$scope.afectacionActiva = true;

	$scope.openDate = function(event){
		generalFunctions.openDate(event)
	};

	$scope.buqueSelected = function(selected){
		if (angular.isDefined(selected) && selected.title != $scope.model.buqueNombre){
			$scope.model.buqueNombre = selected.originalObject.D;
		}
	};

	$scope.$watch('$state.current', function(){
		switch ($state.current.name){
			case 'afip':
				$state.transitionTo($scope.actualRegistro);
				$scope.cargaDatos($scope.actualRegistro);
				$scope.tabs[0].active = true;
				break;
			case 'afip.afectacion.afectacion1':
				$scope.listaBuques = afipCache.get('AfectacionBuques');
				break;
			case 'afip.solicitud.solicitud1':
				$scope.listaBuques = afipCache.get('SolicitudBuques');
				break;
			case 'afip.sumatorias.impo1':
				$scope.listaBuques = afipCache.get('SumImpoBuques');
				break;
			case 'afip.sumatorias.expo1':
				$scope.listaBuques = afipCache.get('SumExpoBuques');
				break;
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
		$scope.panelMensaje = {
			titulo: 'AFIP',
			mensaje: 'No se encontraron datos en la tabla seleccionada.',
			tipo: 'panel-info'
		};
		if (registro != $scope.actualRegistro){
			$scope.model = {
				afectacion: '',
				detallada: '',
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
			case 'afip.afectacion.afectacion1':
				$scope.ocultarFiltros = ['documento', 'solicitud', 'detallada', 'conocimiento', 'contenedor'];
				break;
			case 'afip.afectacion.afectacion2':
				$scope.ocultarFiltros = ['documento', 'solicitud', 'detallada', 'sumaria', 'conocimiento', 'buque', 'contenedor', 'fechaInicio', 'fechaFin'];
				$scope.model.fechaInicio = '';
				$scope.model.fechaFin = '';
				break;
			case 'afip.detalle.detimpo1':
				$scope.ocultarFiltros = ['documento', 'afectacion', 'solicitud', 'buque', 'contenedor'];
				break;
			case 'afip.detalle.detimpo2':
				$scope.ocultarFiltros = ['documento', 'afectacion', 'solicitud', 'buque', 'contenedor', 'fechaInicio', 'fechaFin'];
				$scope.model.fechaInicio = '';
				$scope.model.fechaFin = '';
				break;
			case 'afip.detalle.detimpo3':
				$scope.ocultarFiltros = ['documento', 'afectacion', 'solicitud', 'sumaria', 'conocimiento', 'buque', 'contenedor', 'fechaInicio', 'fechaFin'];
				$scope.model.fechaInicio = '';
				$scope.model.fechaFin = '';
				break;
			case 'afip.detalle.detexpo1':
				$scope.ocultarFiltros = ['documento', 'afectacion', 'solicitud', 'sumaria', 'conocimiento', 'buque', 'contenedor'];
				break;
			case 'afip.detalle.detexpo2':
			case 'afip.detalle.detexpo3':
				$scope.ocultarFiltros = ['documento', 'afectacion', 'solicitud', 'sumaria', 'conocimiento', 'buque', 'contenedor', 'fechaInicio', 'fechaFin'];
				$scope.model.fechaInicio = '';
				$scope.model.fechaFin = '';
				break;
			case 'afip.solicitud.solicitud1':
				$scope.ocultarFiltros = ['documento', 'afectacion', 'detallada', 'conocimiento', 'contenedor'];
				break;
			case 'afip.solicitud.solicitud2':
				$scope.ocultarFiltros = ['documento', 'afectacion', 'detallada', 'sumaria', 'buque', 'contenedor', 'fechaInicio', 'fechaFin'];
				$scope.model.fechaInicio = '';
				$scope.model.fechaFin = '';
				break;
			case 'afip.solicitud.solicitud3':
				$scope.ocultarFiltros = ['documento', 'afectacion', 'detallada', 'sumaria', 'conocimiento', 'buque', 'fechaInicio', 'fechaFin'];
				$scope.model.fechaInicio = '';
				$scope.model.fechaFin = '';
				break;
			case 'afip.sumatorias.impo1':
			case 'afip.sumatorias.expo1':
				$scope.ocultarFiltros = ['documento', 'afectacion', 'detallada', 'solicitud', 'conocimiento', 'contenedor'];
				break;
			case 'afip.sumatorias.impo2':
			case 'afip.sumatorias.impo3':
			case 'afip.sumatorias.expo2':
			case 'afip.sumatorias.expo3':
			case 'afip.sumatorias.expo5':
				$scope.ocultarFiltros = ['documento', 'afectacion', 'detallada', 'solicitud', 'buque', 'contenedor', 'fechaInicio', 'fechaFin'];
				$scope.model.fechaInicio = '';
				$scope.model.fechaFin = '';
				break;
			case 'afip.sumatorias.impo4':
			case 'afip.sumatorias.expo4':
				$scope.ocultarFiltros = ['documento', 'afectacion', 'detallada', 'solicitud', 'buque', 'fechaInicio', 'fechaFin'];
				break;
			case 'afip.removido.removido1':
				$scope.ocultarFiltros = ['afectacion', 'solicitud', 'detallada', 'sumaria', 'conocimiento', 'buque', 'contenedor'];
				break;
			case 'afip.removido.removido2':
			case 'afip.removido.removido3':
				$scope.ocultarFiltros = ['afectacion', 'solicitud', 'detallada', 'sumaria', 'conocimiento', 'buque', 'contenedor', 'fechaInicio', 'fechaFin'];
				break;
		}
		$scope.page.skip = (($scope.model.currentPage - 1) * $scope.itemsPerPage);
		$scope.page.limit = $scope.itemsPerPage;
		$scope.datosRegistro = [];
		for (var elemento in $scope.model){
			if (!angular.isDefined($scope.model[elemento])) $scope.model[elemento] = '';
		}
		$scope.$broadcast('checkAutoComplete');
		afipFactory.getAfip(registro, $scope.model, $scope.page, function(data){
			console.log(data);
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

	$scope.in_array = function(aguja, pajar){
		return in_array(aguja, pajar);
	};

	if (loginService.getStatus()) $scope.cargaDatos($scope.actualRegistro);

	$scope.$on('terminoLogin', function(){
		$scope.cargaDatos($scope.actualRegistro);
	});

}]);

