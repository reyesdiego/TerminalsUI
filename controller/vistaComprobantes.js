/**
 * Created by artiom on 30/03/15.
 */
myapp.controller('vistaComprobantesCtrl', ['$rootScope', '$scope', '$modal', '$filter', 'invoiceFactory', 'loginService', 'statesFactory', 'generalCache', 'generalFunctions', 'dialogs', 'downloadFactory', function($rootScope, $scope, $modal, $filter, invoiceFactory, loginService, statesFactory, generalCache, generalFunctions, dialogs, downloadFactory){
	$scope.status = {
		open: true
	};
	$scope.currentPage = 1;
	$scope.itemsPerPage = 15;
	//Variables para control de fechas
	$scope.maxDateD = new Date();
	$scope.maxDateH = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	//Tipos de comprobantes
	$scope.vouchers = generalCache.get('vouchers');
	//Listas para autocompletado
	$scope.itemsDescription = generalCache.get('descripciones');
	$scope.matchesTerminal = generalCache.get('matches');
	$scope.tasaCargasTerminal = generalCache.get('ratesMatches');
	$scope.listaViajes = [];
	$scope.itemsPerPage = [
		{ value: 10, description: '10 items por página', ticked: false},
		{ value: 15, description: '15 items por página', ticked: true},
		{ value: 20, description: '20 items por página', ticked: false},
		{ value: 50, description: '50 items por página', ticked: false}
	];
	$scope.estadosComprobantes = $filter('filter')(generalCache.get('estados'), $scope.filtroEstados);
	$scope.logoTerminal = $rootScope.logoTerminal;

	$scope.estadosComprobantes.forEach(function(unEstado){
		unEstado.ticked = false;
	});

	$scope.comprobantesVistos = [];

	$scope.acceso = $rootScope.esUsuario;

	// Puntos de Ventas
	$scope.todosLosPuntosDeVentas = [];

	$scope.mostrarResultado = false;
	$scope.verDetalle = {};

	//Control de tarifas
	$scope.controlTarifas = [];
	$scope.noMatch = false;

	$scope.commentsInvoice = [];

	$scope.recargarResultado = false;

	$scope.comprobantesControlados = [];

	$scope.actualizarComprobante = null;

	$scope.disablePdf = false;

	$scope.$on('iniciarBusqueda', function(event, data){
		$scope.filtrado(data.filtro, data.contenido);
	});

	$scope.$on('borrarEstado', function(){
		$scope.filtrado('estado', 'N');
	});

	$scope.$on('mostrarComprobante', function(event, comprobante){
		$scope.mostrarDetalle(comprobante);
	});

	$rootScope.$watch('moneda', function(){
		$scope.moneda = $rootScope.moneda;
	});

	$scope.$watch('ocultarFiltros', function() {
		$scope.currentPage = 1;
	});

	$scope.$watch('panelMensaje', function(){
		if (!angular.isDefined($scope.panelMensaje) || $scope.panelMensaje == {}){
			$scope.panelMensaje = {
				titulo: 'Comprobantes',
				mensaje: 'No se encontraron comprobantes para los filtros seleccionados.',
				tipo: 'panel-info'
			};
		}
	});

	$scope.$watch('volverAPrincipal', function() {
		$scope.mostrarResultado = false;
	});

	$scope.cambioItemsPorPagina = function(data){
		$scope.filtrado('itemsPerPage', data.value);
	};

	$scope.estadoSeleccionado = function(data){
		var contenido = '';
		if (data.ticked){
			$scope.estadosComprobantes.forEach(function(unEstado){
				if (unEstado.ticked){
					if (contenido == ''){
						contenido += unEstado._id;
					} else {
						contenido += ',' + unEstado._id;
					}
				}
			});
		} else {
			contenido = $scope.model.estado.replace(',' + data._id, '');
			contenido = contenido.replace(data._id + ',', '');
			contenido = contenido.replace(data._id, '');
			if (contenido == ''){
				contenido = 'N';
			}
		}
		$scope.filtrado('estado', contenido);
	};

	$scope.hitEnter = function(evt){
		if(angular.equals(evt.keyCode,13))
			$scope.cargaPuntosDeVenta();
	};

	$scope.openDate = function(event){
		generalFunctions.openDate(event);
	};

	$scope.clientSelected = function(selected){
		if (angular.isDefined(selected) && selected.title != $scope.model.razonSocial){
			$scope.model.razonSocial = selected.title;
			$scope.filtrado('razonSocial', selected.title);
		}
	};

	$scope.buqueSelected = function(selected){
		if (angular.isDefined(selected) && selected.title != $scope.model.buqueNombre){
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
		if (angular.isDefined(selected) && selected.title != $scope.model.viaje){
			$scope.model.viaje = selected.title;
			$scope.filtrado('viaje', selected.title);
		}
	};

	$scope.filtrado = function(filtro, contenido){
		$scope.loadingState = true;
		$scope.mostrarResultado = false;
		$scope.currentPage = 1;
		$scope.model[filtro] = contenido;
		if (filtro == 'razonSocial') {
			$scope.model[filtro] = $scope.filtrarCaracteresInvalidos(contenido);
		}
		if ($scope.model.fechaInicio > $scope.model.fechaFin && $scope.model.fechaFin != ''){
			$scope.model.fechaFin = new Date($scope.model.fechaInicio);
			$scope.model.fechaFin.setDate($scope.model.fechaFin.getDate() + 1);
		}
		for (var elemento in $scope.model){
			if (!angular.isDefined($scope.model[elemento])) $scope.model[elemento] = '';
		}
		$scope.$broadcast('checkAutoComplete');
		if (filtro == 'nroPtoVenta'){
			$scope.$emit('cambioFiltro', $scope.model);
		} else {
			$scope.cargaPuntosDeVenta();
		}
	};

	$scope.filtrarCaracteresInvalidos = function(palabra){
		if (angular.isDefined(palabra) && palabra.length > 0){
			var palabraFiltrada;
			var caracteresInvalidos = ['*', '(', ')', '+', ':', '?'];
			palabraFiltrada = palabra;
			for (var i = 0; i <= caracteresInvalidos.length - 1; i++){
				if (palabraFiltrada.indexOf(caracteresInvalidos[i], 0) > 0){
					palabraFiltrada = palabraFiltrada.substring(0, palabraFiltrada.indexOf(caracteresInvalidos[i], 0));
				}
			}
			return palabraFiltrada.toUpperCase();
		} else {
			return palabra;
		}
	};

	$scope.filtrarOrden = function(filtro){
		$scope.currentPage = 1;
		$scope.model = generalFunctions.filtrarOrden($scope.model, filtro);
		$scope.$emit('cambioOrden', $scope.model);
	};

	$scope.trackInvoice = function(comprobante){
		var estado;
		estado = comprobante.interfazEstado;
		invoiceFactory.getTrackInvoice(comprobante._id, function(dataTrack){
			if (dataTrack.status == 'OK'){
				var modalInstance = $modal.open({
					templateUrl: 'view/trackingInvoice.html',
					controller: 'trackingInvoiceCtrl',
					backdrop: 'static',
					resolve: {
						estado: function () {
							return estado;
						},
						track: function() {
							return dataTrack;
						},
						states : function() {
							return angular.copy(generalCache.get('estados'));
						}
					}
				});

				dataTrack = [];
				modalInstance.result.then(function (dataComment) {
					invoiceFactory.putCambiarEstado(comprobante._id, dataComment.newState._id, function(){
						//$scope.recargarResultado = true;
						var logInvoice = {
							title: dataComment.title,
							state: dataComment.newState._id,
							comment: dataComment.comment,
							invoice: comprobante._id
						};
						invoiceFactory.postCommentInvoice(logInvoice, function(dataRes){
							if (dataRes.status == 'OK'){
								comprobante.interfazEstado = dataComment.newState;
								$scope.checkComprobantes(comprobante);
								switch (dataComment.newState.type){
									case 'WARN':
										comprobante.interfazEstado.btnEstado = 'text-warning';
										break;
									case 'OK':
										comprobante.interfazEstado.btnEstado = 'text-success';
										break;
									case 'ERROR':
										comprobante.interfazEstado.btnEstado = 'text-danger';
										break;
									case 'UNKNOWN':
										comprobante.interfazEstado.btnEstado = 'text-info';
										break;
								}
								var nuevoEstado = {
									_id: comprobante._id,
									estado: dataComment.newState,
									grupo: loginService.getGroup(),
									user: loginService.getInfo().user
								};
								comprobante.estado.push(nuevoEstado);
								if ($scope.model.estado != 'N' && $scope.mostrarPtosVenta){
									$rootScope.$broadcast('actualizarListado', $scope.model.estado);
									$scope.cargaPuntosDeVenta();
								}
							}
						});
					});
				});
			} else {
				dialogs.error('Comprobantes', 'Se ha producido un error al cargar los comentarios del comprobante');
			}

		});
	};

	$scope.checkComprobantes = function(comprobante){
		var encontrado = false;
		$scope.comprobantesVistos.forEach(function(unComprobante){
			if (unComprobante._id == comprobante._id){
				encontrado = true;
				unComprobante.interfazEstado = comprobante.interfazEstado;
			}
		});
		$scope.datosInvoices.forEach(function(otroComprobante){
			if (otroComprobante._id == comprobante._id){
				otroComprobante.interfazEstado = comprobante.interfazEstado;
			}
		});
		if (!encontrado){
			$scope.comprobantesVistos.push(comprobante);
		}
	};

	$scope.ocultarResultado = function(comprobante){
		$scope.checkComprobantes(comprobante);
		$scope.mostrarResultado = false;
	};

	$scope.cambiaPtoVenta = function (pto) {
		$scope.todosLosPuntosDeVentas.forEach(function (ptos) { ptos.active = false; });
		pto.active = true;
		$scope.filtrado('nroPtoVenta', pto.punto);
	};

	// Funciones de Puntos de Venta
	$scope.cargaPuntosDeVenta = function(){
		invoiceFactory.getCashbox(cargaDatosSinPtoVenta(), function(data){
			if (data.status == 'OK'){
				$scope.todosLosPuntosDeVentas.forEach(function(puntosVenta){
					puntosVenta.hide = data.data.indexOf(puntosVenta.punto, 0) < 0;
					if ($scope.model != undefined && puntosVenta.punto == $scope.model.nroPtoVenta && puntosVenta.hide){
						$scope.model.nroPtoVenta = '';
						$scope.todosLosPuntosDeVentas[0].active = true;
					}
				});
				$scope.todosLosPuntosDeVentas[0].hide = false;
				$scope.currentPage = 1;
				$scope.$emit('cambioFiltro', $scope.model);
			} else {
				dialogs.error('Comprobantes', 'Se ha producido un error al cargar los puntos de venta');
			}
		});
	};

	$scope.cargaTodosLosPuntosDeVentas = function(){
		invoiceFactory.getCashbox('', function(data){
			if (data.status == 'OK'){
				var dato = {'heading': 'Todos los Puntos de Ventas', 'punto': '', 'active': true, 'hide': false};
				$scope.todosLosPuntosDeVentas.push(dato);
				data.data.forEach(function(punto){
					dato = {'heading': punto, 'punto': punto, 'active': false, 'hide': true};
					$scope.todosLosPuntosDeVentas.push(dato);
				});
				$scope.cargaPuntosDeVenta();
			} else {
				dialogs.error('Comprobantes', 'Se ha producido un error al cargar los puntos de venta');
			}
		})
	};

	$scope.mostrarDetalle = function(comprobante){
		$scope.recargarResultado = false;

		$scope.loadingState = true;

		invoiceFactory.getInvoiceById(comprobante._id, function(callback){

			$scope.verDetalle = callback;
			$scope.controlarTarifas($scope.verDetalle);
			$scope.checkComprobantes($scope.verDetalle);
			$scope.commentsInvoice = [];
			$scope.mostrarResultado = true;
			$scope.loadingState = false;

			invoiceFactory.getTrackInvoice(comprobante._id, function(dataTrack){
				if (dataTrack.status == 'OK'){
					dataTrack.data.forEach(function(comment){
						if (comment.group == loginService.getGroup()){
							$scope.commentsInvoice.push(comment);
						}
					});
				}
			});
		});
	};

	$scope.devolverEstado = function(estado){
		switch (estado){
			case 'G':
				return 'Controlado';
				break;
			case 'Y':
				return 'Sin revisar';
				break;
			case 'R':
				return 'Error';
				break;
		}
	};

	$scope.controlarTarifas = function(comprobante){
		var valorTomado;
		var tarifaError;

		var precioALaFecha;
		var monedaALaFecha;

		comprobante.controlTarifas = [];
		var lookup = {};
		for (var i = 0, len = $scope.matchesTerminal.length; i < len; i++) {
			lookup[$scope.matchesTerminal[i].code] = $scope.matchesTerminal[i];
		}

		$scope.noMatch = false;
		comprobante.noMatch = false;

		comprobante.detalle.forEach(function(detalle){
			detalle.items.forEach(function(item){
				if (angular.isDefined(lookup[item.id])){
					valorTomado = item.impUnit;
					lookup[item.id].topPrices.forEach(function(precioMatch){
						if (comprobante.fecha.emision > precioMatch.from){
							precioALaFecha = precioMatch.price;
							monedaALaFecha = precioMatch.currency
						}
					});
					if (monedaALaFecha != 'DOL'){
						valorTomado = item.impUnit * comprobante.cotiMoneda
					}
					if ($scope.tasaCargasTerminal.indexOf(item.id) >= 0){
						if (valorTomado != precioALaFecha){
							tarifaError = {
								codigo: item.id,
								currency: monedaALaFecha,
								topPrice: precioALaFecha,
								current: item.impUnit,
								container: detalle.contenedor
							};
							comprobante.controlTarifas.push(tarifaError);
						}
					} else {
						if (valorTomado > precioALaFecha){
							tarifaError = {
								codigo: item.id,
								currency: monedaALaFecha,
								topPrice: precioALaFecha,
								current: item.impUnit,
								container: detalle.contenedor
							};
							comprobante.controlTarifas.push(tarifaError);
						}
					}
				} else {
					$scope.noMatch = true;
					comprobante.noMatch = true;
				}
			});
		});
		$rootScope.noMatch = $scope.noMatch;
	};

	$scope.chequearTarifas = function(comprobante){
		if (angular.isDefined($scope.comprobantesControlados[comprobante._id])){
			comprobante.noMatch = $scope.comprobantesControlados[comprobante._id].codigos;
			return $scope.comprobantesControlados[comprobante._id].tarifas;
		} else {
			$scope.controlarTarifas(comprobante);
			$scope.comprobantesControlados[comprobante._id] = {
				tarifas: (comprobante.controlTarifas.length > 0),
				codigos: comprobante.noMatch
			};
			return comprobante.controlTarifas.length > 0;
		}
	};

	$scope.existeDescripcion = function(itemId){
		return angular.isDefined($scope.itemsDescription[itemId]);
	};

	$scope.mostrarTope = function(){
		var max = $scope.currentPage * 10;
		return max > $scope.totalItems ? $scope.totalItems : max;
	};

	function cargaDatosSinPtoVenta(){
		var datos = {};
		angular.copy($scope.model, datos); //|| { nroPtoVenta : '' };
		datos.nroPtoVenta = '';
		return datos;
	}

	if (loginService.getStatus() && ($scope.mostrarPtosVenta || $scope.controlCodigos)) $scope.cargaTodosLosPuntosDeVentas();

	$scope.$on('terminoLogin', function(){
		if ($scope.mostrarPtosVenta || $scope.controlCodigos) $scope.cargaTodosLosPuntosDeVentas();
	});

	$scope.verPdf = function(){
		$scope.disablePdf = true;
		var imprimirComprobante = {};
		angular.copy($scope.verDetalle, imprimirComprobante);
		imprimirComprobante.codTipoComprob = $filter('nombreComprobante')(imprimirComprobante.codTipoComprob);
		imprimirComprobante.fecha.emision = $filter('date')(imprimirComprobante.fecha.emision, 'dd/MM/yyyy', 'UTC');
		imprimirComprobante.fecha.vcto = $filter('date')(imprimirComprobante.fecha.vcto, 'dd/MM/yyyy', 'UTC');
		imprimirComprobante.fecha.desde = $filter('date')(imprimirComprobante.fecha.desde, 'dd/MM/yyyy', 'UTC');
		imprimirComprobante.fecha.hasta = $filter('date')(imprimirComprobante.fecha.hasta, 'dd/MM/yyyy', 'UTC');
		imprimirComprobante.detalle.forEach(function(detalle){
			detalle.buque.fecha = $filter('date')(detalle.buque.fecha, 'dd/MM/yyyy', 'UTC');
		});
		downloadFactory.invoicePDF(imprimirComprobante, function(data, status){
			if (status == 'OK'){
				var file = new Blob([data], {type: 'application/pdf'});
				var fileURL = URL.createObjectURL(file);
				window.open(fileURL);
			} else {
				dialogs.error('Comprobantes', 'Se ha producido un error al procesar el comprobante');
			}
			$scope.disablePdf = false;
		})
	}

}]);
