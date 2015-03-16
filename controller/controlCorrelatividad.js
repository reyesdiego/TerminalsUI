/**
 * Created by artiom on 23/09/14.
 */

myapp.controller('correlatividadCtrl', ['$rootScope', '$scope', 'invoiceFactory', 'socket', 'generalCache', 'vouchersArrayCache', function($rootScope, $scope, invoiceFactory, socket, generalCache, vouchersArrayCache) {

	var socketIoRegister;

	$scope.hasta = new Date();
	$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());

	$scope.loadingCorrelatividad = false;

	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': 0,
		'fechaInicio': $scope.desde,
		'fechaFin': $scope.hasta
	};

	$scope.listaContenedores = generalCache.get('contenedores');

	$scope.tipoComprob = '';
	$scope.puntosDeVenta = [];
	$scope.totalFaltantes = 0;

	$scope.pantalla = {
		titulo:  "Correlatividad",
		tipo: "panel-info",
		mensajeCorrelativo : 'Seleccione tipo de comprobante y presione el botón "Buscar" para realizar el control.'
	};

	$scope.mostrarBotonImprimir = false;
	$scope.puntosDeVenta = [];

	$scope.$on('cambioFiltro', function(event, data){
		$scope.model = data;
		$scope.controlCorrelatividad();
	});

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.loadingCorrelatividad = false;
		$scope.pantalla.titulo = mensaje.titulo;
		$scope.pantalla.tipo = mensaje.tipo;
		$scope.pantalla.mensajeCorrelativo = mensaje.mensaje;
		$scope.pantalla.puntosDeVenta = [];
	});

	$scope.controlCorrelatividad = function(){
		$scope.loadingCorrelatividad = true;
		$scope.puntosDeVenta = [];
		$scope.tipoComprob = vouchersArrayCache.get($scope.model.codTipoComprob);
		$scope.mostrarBotonImprimir = false;
		invoiceFactory.getCorrelative($scope.model, socketIoRegister, function(dataComprob) {
			if (dataComprob.status == 'OK'){
				$scope.totalFaltantes = dataComprob.totalCount;

				if (dataComprob.totalCount === 0){
					$scope.pantalla = {
						titulo:  "Correlatividad",
						tipo: "panel-info",
						mensajeCorrelativo : 'No se hallaron comprobantes faltantes.'
					};
				}
			} else {
				$scope.pantalla = {
					titulo:  "Correlatividad",
					tipo: "panel-danger",
					mensajeCorrelativo : 'Se ha producido un error al cargar los datos.'
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
			$scope.$apply();
		});
	});
}]);