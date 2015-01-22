/**
 * Created by artiom on 19/12/14.
 */
(function(){

	myapp.controller('afipCtrl', function afectacion1Ctrl($scope, afipFactory, $state){

		$scope.tabs = [
			{ heading: 'Afectación',	select: 'afectacion1',	uisref: 'afip.afectacion.afectacion1' },
			{ heading: 'Detalles',		select: 'detimpo1',		uisref: 'afip.detalle.detimpo1' },
			{ heading: 'Solicitud',		select: 'solicitud1',	uisref: 'afip.solicitud.solicitud1' },
			{ heading: 'Sumarias',		select: 'impo1',		uisref: 'afip.sumatorias.impo1' }
		];

		$scope.model = {
			filtroOrden: '',
			filtroOrdenReverse: false,
			filtroAnterior: '',
			order: ''
		};

		$scope.panelMensaje = {
			titulo: 'AFIP',
			mensaje: 'No se encontraron datos en la tabla seleccionada.',
			tipo: 'panel-info'
		};

		$scope.ocultarFiltros = ['solicitud', 'detalle'];

		$scope.datosRegistro = [];
		$scope.currentPage = 1;
		$scope.totalItems = 0;
		$scope.itemsPerPage = 15;
		$scope.page = {
			skip: 0,
			limit: $scope.itemsPerPage
		};
		$scope.actualRegistro = 'afectacion1';
		$scope.afectacionActiva = true;

		$scope.$watch('$state.current', function(){
			if ($state.current.name == 'afip'){
				$state.transitionTo('afip.afectacion.afectacion1');
				$scope.cargaDatos('afectacion1');
				$scope.tabs[0].active = true;
			}
		});

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
			$scope.cargaDatos($scope.actualRegistro);
		});

		$scope.filtrarOrden = function(filtro){
			var filtroModo;
			$scope.currentPage = 1;
			$scope.model.filtroOrden = filtro;
			if ($scope.model.filtroOrden == $scope.model.filtroAnterior){
				$scope.model.filtroOrdenReverse = !$scope.model.filtroOrdenReverse;
			} else {
				$scope.model.filtroOrdenReverse = false;
			}
			if ($scope.model.filtroOrdenReverse){
				filtroModo = -1;
			} else {
				filtroModo = 1;
			}
			$scope.model.order = '"' + filtro + '":' + filtroModo;
			$scope.model.filtroAnterior = filtro;

			$scope.currentPage = 1;
			$scope.cargaDatos($scope.actualRegistro);
		};

		$scope.cargaDatos = function(registro){
			$scope.cargando = true;
			if (registro != $scope.actualRegistro){
				$scope.model = {
					filtroOrden: '',
					filtroOrdenReverse: false,
					filtroAnterior: '',
					order: ''
				};
				$scope.currentPage = 1;
			}
			$scope.actualRegistro = registro;
			switch ($scope.actualRegistro){
				case 'afectacion1':
					$scope.ocultarFiltros = ['solicitud', 'detalle', 'conocimiento', 'contenedor'];
					break;
				case 'afectacion2':
					$scope.ocultarFiltros = ['solicitud', 'detalle', 'sumaria', 'conocimiento', 'buque', 'contenedor'];
					break;
				case 'detimpo1':
				case 'detimpo2':
					$scope.ocultarFiltros = ['afectacion', 'solicitud', 'buque', 'contenedor'];
					break;
				case 'detimpo3':
				case 'detexpo1':
				case 'detexpo2':
				case 'detexpo3':
					$scope.ocultarFiltros = ['afectacion', 'solicitud', 'sumaria', 'conocimiento', 'buque', 'contenedor'];
					break;
				case 'solicitud1':
					$scope.ocultarFiltros = ['afectacion', 'detalle', 'conocimiento', 'contenedor'];
					break;
				case 'solicitud2':
					$scope.ocultarFiltros = ['afectacion', 'detalle', 'sumaria', 'buque', 'contenedor'];
					break;
				case 'solicitud3':
					$scope.ocultarFiltros = ['afectacion', 'detalle', 'sumaria', 'conocimiento', 'buque'];
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
					$scope.ocultarFiltros = ['afectacion', 'detalle', 'solicitud', 'buque', 'contenedor'];
					break;
				case 'impo4':
				case 'expo4':
					$scope.ocultarFiltros = ['afectacion', 'detalle', 'solicitud', 'buque'];
					break;
			}
			$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
			$scope.page.limit = $scope.itemsPerPage;
			$scope.invoices = [];
			afipFactory.getAfip(registro, $scope.model.order, $scope.page, function(data){
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

		$scope.cargaDatos($scope.actualRegistro);
	})

})();
