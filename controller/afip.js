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
			$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
			$scope.page.limit = $scope.itemsPerPage;
			$scope.invoices = [];
			afipFactory.getAfip(registro, $scope.model.order, $scope.page, function(data){
				if(data.status === 'OK'){
					$scope.datosRegistro = data.data;
					$scope.totalItems = data.totalCount;
					$scope.cargando = false;
				}
			});
		};

		$scope.cargaDatos($scope.actualRegistro);
	})

})();
