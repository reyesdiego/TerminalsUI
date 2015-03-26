/**
 * Created by artiom on 12/03/15.
 */

myapp.controller("searchController", ['$scope', 'generalCache', 'contenedoresCache', 'generalFunctions', 'invoiceFactory', function($scope, generalCache, contenedoresCache, generalFunctions, invoiceFactory){
	$scope.status = {
		open: true
	};
	$scope.maxDate = new Date();
	$scope.listaContenedoresGates = contenedoresCache.get('contenedoresGates');
	$scope.listaContenedoresTurnos = contenedoresCache.get('contenedoresTurnos');
	$scope.listaBuques = generalCache.get('buques');
	$scope.listaViajes = [];

	$scope.$on('tengoViajes', function(event, data){
		$scope.listaViajes = data;
	});
	$scope.openDate = function(event){
		generalFunctions.openDate(event);
	};
	$scope.hitEnter = function(evt){
		if(angular.equals(evt.keyCode,13))
			$scope.$emit('cambioFiltro');
	};
	$scope.buqueSelected = function(selected){
		if (angular.isDefined(selected)){
			$scope.model.buqueNombre = selected.originalObject.buque;
			var i = 0;
			selected.originalObject.viajes.forEach(function(viaje){
				var objetoViaje = {
					'id': i,
					'viaje': viaje.viaje
				};
				$scope.listaViajes.push(objetoViaje);
				i++;
			});
		}
	};
	$scope.viajeSelected = function(selected){
		if (angular.isDefined(selected)){
			$scope.model.viaje = selected.title;
			$scope.filtrado('viaje', selected.title);
		}
	};
	$scope.containerSelected = function (selected) {
		if (angular.isDefined(selected)) {
			$scope.model.contenedor = selected.title;
			$scope.filtrado('contenedor', selected.title);
		}
	};
	$scope.filtrado = function(filtro, contenido){
		$scope.model[filtro] = contenido;
		if (filtro == 'buqueNombre') {
			if (contenido != ''){
				var i = 0;
				$scope.listaBuques.forEach(function(buque){
					if (buque.buque == contenido){
						buque.viajes.forEach(function(viaje){
							var objetoViaje = {
								'id': i,
								'viaje': viaje.viaje
							};
							$scope.listaViajes.push(objetoViaje);
							i++;
						})
					}
				});
			} else {
				$scope.model.viaje = '';
			}
		}
		if ($scope.model.fechaInicio > $scope.model.fechaFin && $scope.model.fechaFin != ''){
			$scope.model.fechaFin = new Date($scope.model.fechaInicio);
			$scope.model.fechaFin.setDate($scope.model.fechaFin.getDate() + 1);
		}
		$scope.$emit('cambioFiltro', $scope.listaViajes);
	};
	//FUNCIONES DE TABLE GATES //////////////////////////////////////////////////////////////////////
	$scope.colorHorario = function (gate) {
		return generalFunctions.colorHorario(gate);
	};
	$scope.mostrarDetalle = function(contenedor){
		$scope.paginaAnterior = $scope.currentPage;
		$scope.totalGates = $scope.totalItems;
		$scope.detallesGates = true;
		$scope.contenedor = contenedor.contenedor;
		var datos = { 'contenedor': contenedor.contenedor };
		invoiceFactory.getInvoice(datos, { skip: 0, limit: $scope.itemsPerPage }, function (data) {
			if (data.status === 'OK') {
				$scope.invoices = data.data;
				$scope.totalItems = data.totalCount;
			}
		});
	};
	$scope.ocultarDetallesGates = function(){
		$scope.detallesGates = false;
		$scope.totalItems = $scope.totalGates;
		$scope.currentPage = $scope.paginaAnterior
	};

	$scope.filtrarOrden = function(filtro){
		$scope.model = generalFunctions.filtrarOrden($scope.model, filtro);
		$scope.$emit('cambioFiltro');
	};
	///////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.cargaPorFiltros = function () {
		$scope.$emit('cambioFiltro');
	};
}]);