/**
 * Created by artiom on 23/09/14.
 */
(function() {
	myapp.controller('correlatividadCtrl', function($rootScope, $scope, invoiceFactory, socket) {
		$scope.hasta = new Date();
		$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());

		$scope.loadingCorrelatividad = false;

		$scope.model = {
			'nroPtoVenta': '',
			'codTipoComprob': 0,
			'fechaDesde': $scope.desde,
			'fechaHasta': $scope.hasta
		};

		$scope.tipoComprob = '';
		$scope.puntosDeVenta = [];
		$scope.totalFaltantes = 0;

		$scope.pantalla = {
			"titulo":  "Correlatividad",
			"mensajeCorrelativo": 'Seleccione tipo de comprobante y presione el botón "Buscar" para realizar el control.',
			"tipo": "panel-info",
			"resultadoCorrelativo": []
		};
		$scope.puntosDeVenta.push(angular.copy($scope.pantalla));
		$scope.mostrarBotonImprimir = false;

		$scope.$on('cambioFiltro', function(event, data){
			$scope.model = data;
			$scope.controlCorrelatividad();
		});

		$scope.$on('errorCorrelatividad', function(){
			$scope.pantalla.titulo =  "Error";
			$scope.pantalla.mensajeCorrelativo = 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.';
			$scope.pantalla.tipo = "panel-danger";
			$scope.pantalla.resultadoCorrelativo = [];
			$scope.loadingCorrelatividad = false;
		});

		$scope.controlCorrelatividad = function(){
			$scope.loadingCorrelatividad = true;
			$scope.puntosDeVenta = [];
			$scope.tipoComprob = $rootScope.vouchersType[$scope.model.codTipoComprob];
			invoiceFactory.getCorrelative($scope.model, function(dataComprob) {
				$scope.totalFaltantes = dataComprob.totalCount;
			});
		};

		socket.on('correlative', function (data) {
			var pantalla = {
				mensajeCorrelativo: '',
				tipo: '',
				titulo: '',
				resultadoCorrelativo: ''
			};
			if (data.totalCount > 0){
				pantalla.mensajeCorrelativo = "Se hallaron " + data.totalCount + " " + $rootScope.vouchersType[$scope.model.codTipoComprob] + " faltantes: ";
				pantalla.tipo = "panel-danger";
				pantalla.titulo = "Error en el punto de venta " + data.nroPtoVenta;
				pantalla.resultadoCorrelativo = data.data;
				$scope.mostrarBotonImprimir = true;
			} else {
				pantalla.titulo =  "Éxito";
				pantalla.mensajeCorrelativo = "No se hallaron " + $rootScope.vouchersType[$scope.model.codTipoComprob] + " faltantes en el punto de venta " + data.nroPtoVenta;
				pantalla.tipo = "panel-success";
				pantalla.resultadoCorrelativo = [];
			}
			$scope.puntosDeVenta.push(angular.copy(pantalla));
			$scope.loadingCorrelatividad = false;
		});

	});
})();