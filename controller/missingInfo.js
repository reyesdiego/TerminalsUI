/**
 * Created by artiom on 12/03/15.
 */
myapp.controller('missingInfo', ['$rootScope', '$scope', 'gatesFactory', 'loginService', 'dialogs', 'generalFunctions', 'generalCache', 'invoiceService',
	function($rootScope, $scope, gatesFactory, loginService, dialogs, generalFunctions, generalCache, invoiceService){
		$scope.currentPage = 1;

		$scope.logoTerminal = $rootScope.logoTerminal;
		$scope.itemsPerPage = [
			{ value: 10, description: '10 items por página', ticked: false},
			{ value: 15, description: '15 items por página', ticked: true},
			{ value: 20, description: '20 items por página', ticked: false},
			{ value: 50, description: '50 items por página', ticked: false}
		];
		$scope.filteredDatos = [];
		$scope.search = '';

		$scope.datosFaltantes = [];
		$scope.cargando = false;

		//Variables para control de fechas
		$scope.maxDateD = new Date();
		$scope.maxDateH = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		$scope.comprobantesVistos = [];
		$scope.comprobantesControlados = [];
		$scope.itemDescriptionInvoices = generalCache.get('descripciones');
		$scope.acceso = $rootScope.esUsuario;

		$scope.$on('errorInesperado', function(e, mensaje){
			$scope.cargando = false;
			$scope.datosFaltantes = [];
			$scope.configPanel = mensaje;
		});

		$rootScope.$watch('moneda', function(){
			$scope.moneda = $rootScope.moneda;
		});

		$scope.colorHorario = function (gate) {
			return generalFunctions.colorHorario(gate);
		};

		$scope.existeDescripcion = function(itemId){
			return invoiceService.existeDescripcion(itemId);
		};

		$scope.openDate = function(event){
			generalFunctions.openDate(event);
		};

		$scope.cambioItemsPorPagina = function(data){
			$scope.filtrado('itemsPerPage', data.value);
		};

		$scope.trackInvoice = function(comprobante){
			invoiceService.trackInvoice(comprobante)
				.then(function(response){
					if (angular.isDefined(response)) comprobante = response;
				}, function(message){
					dialogs.error('Liquidaciones', message);
				})
		};

		$scope.configPanel = {
			tipo: 'panel-success',
			titulo: 'Control gates',
			mensaje: 'No se encontraron comprobantes con gates faltantes para los filtros seleccionados.'
		};

		$scope.model = {
			fechaInicio: new Date(),
			fechaFin: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
			itemsPerPage: 15
		};

		$scope.model.fechaInicio.setHours(0, 0, 0, 0);
		$scope.model.fechaFin.setHours(0, 0, 0, 0);

		$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque', 'viaje', 'btnBuscar'];

		$scope.filtrado = function(filtro, contenido){
			$scope.model[filtro] = contenido;
			if ($scope.model.fechaInicio > $scope.model.fechaFin && $scope.model.fechaFin != ''){
				$scope.model.fechaFin = new Date($scope.model.fechaInicio);
				$scope.model.fechaFin.setDate($scope.model.fechaFin.getDate() + 1);
			}
		};

		$scope.cargaDatos = function(){

			switch ($scope.datoFaltante){
				case 'gates':
					$scope.cargando = true;
					gatesFactory.getMissingGates(function(data){
						if (data.status == 'OK'){
							$scope.datosFaltantes = data.data;
							$scope.totalItems = $scope.datosFaltantes.length;
							$scope.datosFaltantes.forEach(function(comprob){
								if (angular.isDefined($scope.itemDescriptionInvoices[comprob.code])) {
									comprob.code = comprob.code + ' - ' + $scope.itemDescriptionInvoices[comprob.code];
								} else {
									comprob.code = comprob.code +  ' - No se halló la descripción, verifique que el código esté asociado.';
								}
							});
						} else {
							$scope.configPanel = {
								tipo: 'panel-danger',
								titulo: 'Control gates',
								mensaje: 'Se ha producido un error al cargar los gates faltantes.'
							};
						}
						$scope.cargando = false;
					});
					break;
				case 'invoices':
					$scope.cargando = true;
					gatesFactory.getMissingInvoices(function(data){
						if (data.status == 'OK'){
							$scope.datosFaltantes = data.data;
							$scope.totalItems = $scope.datosFaltantes.length;
							$scope.cargando = false;
							$scope.datosFaltantes.forEach(function(registro){
								registro.fecha = registro.gateTimestamp;
							})
						} else {
							$scope.configPanel = {
								tipo: 'panel-danger',
								titulo: 'Control gates',
								mensaje: 'Se ha producido un error al cargar los comprobantes faltantes.'
							};
						}
						$scope.cargando = false;
					});
					break;
			}
		};

		$scope.checkComprobantes = function(comprobante){
			var response;
			response = invoiceService.checkComprobantes(comprobante, $scope.comprobantesVistos, $scope.datosFaltantes);
			$scope.datosFaltantes = response.datosInvoices;
			$scope.comprobantesVistos = response.comprobantesVistos;
		};

		$scope.mostrarDetalle = function(comprobante){
			$scope.cargando = true;
			invoiceService.mostrarDetalle(comprobante._id, $scope.comprobantesVistos, $scope.datosFaltantes)
				.then(function(response){
					$scope.verDetalle = response.detalle;
					$scope.datosFaltantes = response.datosInvoices;
					$scope.comprobantesVistos = response.comprobantesVistos;
					$scope.noMatch = response.noMatch;
					//$scope.commentsInvoice = [];
					$rootScope.noMatch = $scope.noMatch;
					$scope.mostrarResultado = true;
					$scope.cargando = false;
				});
		};

		/*$scope.mostrarDetalle = function(comprobante){
		 $scope.cargando = true;
		 invoiceFactory.getInvoiceById(comprobante._id, function(dataComprob){
		 $scope.verDetalle = dataComprob;
		 $scope.mostrarResultado = true;
		 $scope.cargando = false;

		 });
		 };*/

		$scope.ocultarResultado = function(comprobante){
			$scope.checkComprobantes(comprobante);
			$scope.mostrarResultado = false;
		};

		/*$scope.ocultarResultado = function(comprobante){
		 var encontrado = false;
		 $scope.comprobantesVistos.forEach(function(unComprobante){
		 if (unComprobante._id == comprobante._id){
		 encontrado = true;
		 }
		 });
		 if (!encontrado){
		 $scope.comprobantesVistos.push(comprobante);
		 }
		 if ($scope.recargarResultado){
		 $scope.comprobantesVistos.forEach(function(visto){
		 if (visto._id == comprobante._id){
		 visto.interfazEstado = comprobante.interfazEstado;
		 visto.estado = comprobante.estado;
		 }
		 });
		 }
		 $scope.mostrarResultado = false;
		 };*/

		$scope.chequearTarifas = function(comprobante){
			var resultado = invoiceService.chequearTarifas(comprobante, $scope.comprobantesControlados);
			$scope.comprobantesControlados = resultado.data;
			$scope.noMatch = resultado.noMatch;
			$rootScope.noMatch = $scope.noMatch;
			return resultado.retValue;
		};

		$scope.verPdf = function(){
			$scope.disablePdf = true;
			invoiceService.verPdf($scope.verDetalle)
				.then(function(){
					$scope.disablePdf = false;
				}, function(){
					dialogs.error('Comprobantes', 'Se ha producido un error al procesar el comprobante');
					$scope.disablePdf = false;
				});
		};

		if (loginService.getStatus()) $scope.cargaDatos();

		$scope.$on('terminoLogin', function(){
			$scope.acceso = $rootScope.esUsuario;
			$scope.cargaDatos();
		});

	}]);