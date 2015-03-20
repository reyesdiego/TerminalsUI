/**
 * Created by artiom on 23/09/14.
 */

myapp.controller('correlatividadCtrl', ['$rootScope', '$scope', 'invoiceFactory', 'socket', 'generalCache', 'vouchersArrayCache', function($rootScope, $scope, invoiceFactory, socket, generalCache, vouchersArrayCache) {

	var socketIoRegister;

	$scope.hasta = new Date();
	$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());
	$scope.deshabilitarBuscar = false;
	$scope.totalPuntos = 0;
	$scope.leerData = true;
	$scope.arrayCargados = [];

	$scope.loadingCorrelatividad = false;

	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': 0,
		'fechaInicio': $scope.desde,
		'fechaFin': $scope.hasta
	};

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

	$scope.generarInterfaz = function(punto){
		$scope.loadingCorrelatividad = false;
		var pantalla = {
			mensajeCorrelativo: '',
			tipo: '',
			titulo: '',
			resultadoCorrelativo: ''
		};
		pantalla.nroPtoVenta = punto.nroPtoVenta;
		pantalla.titulo = "Punto de Venta " + punto.nroPtoVenta;
		if (punto.totalCount > 0){
			pantalla.totalCnt = punto.totalCount;
			pantalla.tipo = "panel-danger";
			pantalla.resultadoCorrelativo = punto.data;
			$scope.mostrarBotonImprimir = true;
			$scope.puntosDeVenta.push(angular.copy(pantalla));
		}
		$scope.arrayCargados.push(punto.nroPtoVenta);
		$scope.totalPuntos--
	};

	$scope.controlCorrelatividad = function(){
		$scope.arrayCargados = [];
		$scope.leerData = true;
		$scope.totalFaltantes = 0;
		$scope.totalPuntos = $scope.model.nroPtoVenta.split(',').length;
		$scope.deshabilitarBuscar = true;
		$scope.loadingCorrelatividad = true;
		$scope.puntosDeVenta = [];
		$scope.tipoComprob = vouchersArrayCache.get($scope.model.codTipoComprob);
		$scope.mostrarBotonImprimir = false;
		invoiceFactory.getCorrelative($scope.model, socketIoRegister, function(dataComprob) {
			if (dataComprob.status == 'OK'){
				if ($scope.totalPuntos > 0){
					$scope.leerData = false;
					dataComprob.data.forEach(function(punto){
						if (!in_array(punto.nroPtoVenta, $scope.arrayCargados)){
							$scope.generarInterfaz(punto);
						}
					});
					$scope.totalPuntos = 0;
				}
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

	$scope.$watch('totalPuntos', function(){
		if ($scope.totalPuntos == 0){
			$scope.deshabilitarBuscar = false;
		}
	});

	socket.emit('newUser', function (sess){

		socketIoRegister = sess;
		socket.on('correlative_' + sess, function (data) {
			if ($scope.leerData){
				$scope.generarInterfaz(data);
				$scope.$apply();
			}
		});
	});
}]);