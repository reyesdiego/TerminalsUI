/**
 * Created by artiom on 23/09/14.
 */
(function() {
	myapp.controller('correlatividadCtrl', function($rootScope, $scope, invoiceFactory, socket) {

		var socketIoRegister;

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
			titulo:  "Correlatividad",
			tipo: "panel-info",
			mensajeCorrelativo : 'Seleccione tipo de comprobante y presione el botón "Buscar" para realizar el control.',
			puntosDeVenta: []
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
			$scope.mostrarBotonImprimir = false;
			invoiceFactory.getCorrelative($scope.model, socketIoRegister, function(dataComprob) {
				$scope.totalFaltantes = dataComprob.totalCount;

				if (dataComprob.totalCount === 0){
					$scope.pantalla = {
						titulo:  "Correlatividad",
						tipo: "panel-info",
						mensajeCorrelativo : 'No se hallaron comprobantes faltantes.',
						puntosDeVenta: []
					};
				}
				$scope.loadingCorrelatividad = false;
			});
		};

		socket.emit('newUser', function (sess){

			socketIoRegister = sess;
			socket.on('correlative_' + sess, function (data) {
				$scope.loadingCorrelatividad = false;
				var pantalla = {
					mensajeCorrelativo: '',
					tipo: '',
					titulo: '',
					resultadoCorrelativo: ''
				};
				pantalla.nroPtoVenta = data.nroPtoVenta;
				pantalla.titulo = "Punto de Venta " + data.nroPtoVenta;
				if (data.totalCount > 0){
					pantalla.totalCnt = data.totalCount;
					pantalla.tipo = "panel-danger";
					pantalla.resultadoCorrelativo = data.data;
					$scope.mostrarBotonImprimir = true;
					$scope.puntosDeVenta.push(angular.copy(pantalla));
				}
			});
		});

	});
})();