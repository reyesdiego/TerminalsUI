/**
 * Created by leo on 05/09/14.
 */

myapp.directive('vistaComprobantes', ['generalCache', 'generalFunctions', 'dialogs', function(generalCache, generalFunctions, dialogs){
	return {
		restrict:		'E',
		templateUrl:	'view/vistaComprobantes.html',
		scope: {
			model:								'=',
			datosInvoices:						'=',
			ocultarFiltros:						'=',
			totalItems:							'=',
			loadingState:						'=',
			controlCodigos:						'&',
			codigosSinAsociar:					'=',
			mostrarPtosVenta:					'=',
			ocultarAccordionInvoicesSearch:		'=',
			ocultarAccordionComprobantesVistos:	'=',
			panelMensaje:						'=',
			volverAPrincipal:					'=',
			filtroEstados:						'@'
		},
		controller: ['$rootScope', '$scope', '$modal', '$filter', 'invoiceFactory', 'loginService', 'statesFactory', function($rootScope, $scope, $modal, $filter, invoiceFactory, loginService){
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

			$scope.$on('iniciarBusqueda', function(event, data){
				$scope.filtrado(data.filtro, data.contenido);
			});

			$scope.$on('borrarEstado', function(){
				$scope.filtrado('estado', 'N');
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

			$scope.containerSelected = function(selected){
				if (angular.isDefined(selected) && selected.title != $scope.model.contenedor){
					$scope.model.contenedor = selected.title;
					$scope.filtrado('contenedor', selected.title);
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
				$scope.$emit('cambioFiltro', $scope.model);
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
							invoiceFactory.cambiarEstado(comprobante._id, dataComment.newState._id, function(){
								//$scope.recargarResultado = true;
								var logInvoice = {
									title: dataComment.title,
									state: dataComment.newState._id,
									comment: dataComment.comment,
									invoice: comprobante._id
								};
								invoiceFactory.commentInvoice(logInvoice, function(dataRes){
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
										if ($scope.model.estado != 'N')
											$scope.cargaPuntosDeVenta();
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

			$scope.quitarVista = function (comprobante) {
				var pos = $scope.comprobantesVistos.indexOf(comprobante);
				$scope.comprobantesVistos.splice(pos, 1);
			};

			// Funciones de Puntos de Venta
			$scope.cargaPuntosDeVenta = function(){
				invoiceFactory.getCashbox(cargaDatosSinPtoVenta(), function(data){
					if (data.status == 'OK'){
						$scope.todosLosPuntosDeVentas.forEach(function(todosPtos){
							todosPtos.hide = data.data.indexOf(todosPtos.punto, 0) < 0;
							if ($scope.model != undefined && todosPtos.punto == $scope.model.nroPtoVenta && todosPtos.hide){
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

				invoiceFactory.invoiceById(comprobante._id, function(callback){

					$scope.verDetalle = callback;
					$scope.controlarTarifas($scope.verDetalle);

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
										current: item.impUnit
									};
									comprobante.controlTarifas.push(tarifaError);
								}
							} else {
								if (valorTomado > precioALaFecha){
									tarifaError = {
										codigo: item.id,
										currency: monedaALaFecha,
										topPrice: precioALaFecha,
										current: item.impUnit
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
				var datos = $scope.model || { nroPtoVenta : '' };
				datos.nroPtoVenta = '';
				return datos;
			}

			if (loginService.getStatus) $scope.cargaTodosLosPuntosDeVentas();

		}]
	}
}]);

myapp.directive('tableInvoices', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/table.invoices.html'
	}
});

myapp.directive('tableGates', ['generalFunctions', function(generalFunctions){
	return {
		restrict:		'E',
		templateUrl:	'view/table.gates.html',
		scope: {
			model:				'=',
			datosGates:			'=',
			totalItems:			'=',
			detallesGates:		'=',
			ocultarFiltros:		'=',
			currentPage:		'=',
			configPanel:		'=',
			loadingState:		'='
		},
		controller: ['$scope', 'invoiceFactory', function($scope, invoiceFactory){
			$scope.totalGates = 0;
			$scope.itemsPerPage = 10;
			$scope.listaViajes = [];
			$scope.$on('errorInesperado', function(e, mensaje){
				$scope.detallesGates = false;
			});
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
			$scope.filtrado = function(filtro, contenido){
				$scope.model[filtro] = contenido;
				if (filtro == 'buqueNombre') {
					var i = 0;
					$scope.listaBuques.forEach(function(buque){
						if (buque.buque == contenido){
							buque.viajes.forEach(function(viaje){
								var objetoViaje = {
									'id': i,
									'viaje': viaje
								};
								$scope.listaViajes.push(objetoViaje);
								i++;
							})
						}
					});
				}
				$scope.$emit('cambioFiltro', $scope.listaViajes);
			};
			$scope.filtrarOrden = function(filtro){
				$scope.model = generalFunctions.filtrarOrden($scope.model, filtro);
				$scope.$emit('cambioFiltro');
			};
		}]
	}
}]);

myapp.directive('tableGatesResult', function(){
	return {
		restrict:		'E',
		template:
			'<div class="container">' +
			'	<div class="row">' +
			'		<div class="col-lg-12">' +
			'			<h4>Comprobantes del contenedor {{ contenedor }}</h4>' +
			'			<vista-comprobantes model="$parent.model" datos-invoices="invoices" ocultar-filtros="$parent.filtrosComprobantes" total-items="totalItems" loading-state="cargando" mostrar-ptos-venta="false" ocultar-accordion-invoices-search="true" ocultar-accordion-comprobantes-vistos="true" panel-mensaje="mensajeResultado"></vista-comprobantes>' +
			'			<button class="btn btn-default hidden-print" ng-hide="mostrarResultado" ng-click="detallesGates = false; totalItems = totalGates; currentPage = paginaAnterior"><span class="glyphicon glyphicon-arrow-left"></span> Volver a Gates</button>' +
			'		</div>' +
			'	</div>' +
			'</div>'
	}
});

myapp.directive('tableTurnos', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/table.turnos.html',
		scope: {
			model:				'=',
			datosTurnos:		'=',
			totalItems:			'=',
			itemsPerPage:		'=',
			configPanel:		'=',
			currentPage:		'=',
			ocultarFiltros:		'=',
			loadingState:		'='
		},
		controller: 'searchController'
	}
});

myapp.directive('tableTasasCargas', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/table.tasas.cargas.html',
		scope: {
			configPanel:		'=',
			tasas:				'=',
			totalTasas:			'=',
			moneda:				'='
		}
	}
});

myapp.directive('accordionComprobantesVistos', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/accordion.comprobantes.vistos.html'
	}
});

myapp.directive('accordionInvoicesSearch', ['generalCache', 'contenedoresCache', function(generalCache, contenedoresCache){
	return {
		restrict:		'E',
		templateUrl:	'view/accordion.invoices.search.html',
		link: function ($scope) {
			$scope.listaRazonSocial = generalCache.get('clientes');
			$scope.listaContenedores = contenedoresCache.get('contenedores');
			$scope.listaBuques = generalCache.get('buques');
		}
	}
}]);

myapp.directive('invoicesResult', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/invoices.result.html'
	}
});

myapp.directive('invoiceTrack', function(){
	return {
		restrict:		'E',
		template:
			'<div class="table-responsive col-lg-12 center-block visible-print-block">' +
			'	<table class="table table-striped table-bordered table-hover" ng-show="commentsInvoice.length > 0">' +
			'		<thead>' +
			'			<tr>' +
			'				<th>Fecha</th>' +
			'				<th>Usuario</th>' +
			'				<th>Comentario</th>' +
			'				<th>Estado</th>' +
			'			</tr>' +
			'		</thead>' +
			'		<tbody>' +
			'			<tr ng-repeat="comment in commentsInvoice">' +
			'				<td>{{ comment.fecha }}</td>' +
			'				<td>{{ comment.user }}</td>' +
			'				<td>{{ comment.comment }}</td>' +
			'				<td>{{ devolverEstado(comment.state) }}</td>' +
			'			</tr>' +
			'		</tbody>' +
			'	</table>' +
			'</div>'
	}
});

myapp.directive('containersGatesSearch', [function(){
	return {
		restrict:		'E',
		templateUrl:	'view/accordion.gates.search.html',
		scope: {
			model:			'=',
			ocultarFiltros:	'=',
			currentPage:	'='
		},
		controller: 'searchController'
	}
}]);

myapp.directive('accordionTurnosSearch', [function(){
	return {
		restrict:		'E',
		templateUrl:	'view/accordion.turnos.search.html',
		scope: {
			model:			'=',
			currentPage:	'='
		},
		controller: 'searchController'
	}
}]);

myapp.directive('divPagination', function(){
	return {
		restrict:		'E',
		scope: {
			totalItems:			'=',
			currentPage:		'=',
			itemsPerPage:		'=',
			panelSize:			'='
		},
		link: function($scope){
			$scope.$watch('totalItems', function(){
				switch ($scope.panelSize){
					case 12:
					case undefined:
						if ($scope.totalItems / $scope.itemsPerPage >= 1000){
							$scope.maxSizeSM = 9;
							$scope.maxSizeMD = 13;
							$scope.maxSizeLG = 17;
						} else {
							$scope.maxSizeSM = 10;
							$scope.maxSizeMD = 15;
							$scope.maxSizeLG = 20;
						}
						break;
					case 10:
						if ($scope.totalItems / $scope.itemsPerPage >= 10000){
							$scope.maxSizeSM = 3;
							$scope.maxSizeMD = 7;
							$scope.maxSizeLG = 11;
						} else if ($scope.totalItems / $scope.itemsPerPage >= 1000){
							$scope.maxSizeSM = 5;
							$scope.maxSizeMD = 9;
							$scope.maxSizeLG = 13;
						} else if ($scope.totalItems / $scope.itemsPerPage >= 100) {
							$scope.maxSizeSM = 7;
							$scope.maxSizeMD = 11;
							$scope.maxSizeLG = 15;
						} else {
							$scope.maxSizeSM = 10;
							$scope.maxSizeMD = 15;
							$scope.maxSizeLG = 20;
						}
						break;
				}

			});
			$scope.pageChanged = function(){
				$scope.$emit('cambioPagina', $scope.currentPage);
			}
		},
		template:
			'<div class="col-lg-12 hidden-print" ng-show="totalItems > itemsPerPage">' +
			'	<div class="text-center visible-xs"><pagination boundary-links="true" total-items="totalItems" items-per-page="itemsPerPage" ng-model="currentPage" max-size="5" ng-click="pageChanged()" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;"></pagination></div>' +
			'	<div class="text-center visible-sm"><pagination boundary-links="true" total-items="totalItems" items-per-page="itemsPerPage" ng-model="currentPage" max-size="maxSizeSM" ng-click="pageChanged()" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;"></pagination></div>' +
			'	<div class="text-center visible-md"><pagination boundary-links="true" total-items="totalItems" items-per-page="itemsPerPage" ng-model="currentPage" max-size="maxSizeMD" ng-click="pageChanged()" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;"></pagination></div>' +
			'	<div class="text-center visible-lg"><pagination boundary-links="true" total-items="totalItems" items-per-page="itemsPerPage" ng-model="currentPage" max-size="maxSizeLG" ng-click="pageChanged()" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;"></pagination></div>' +
			'</div>'

	}
});

myapp.directive('divPanel', function(){
	return {
		restrict:		'E',
		transclude:		true,
		scope:	{
			configPanel:	'='
		},
		template:
			'<div class="panel {{ configPanel.tipo }}">' +
			'	<div class="panel-heading">' +
			'		<h3 class="panel-title">{{ configPanel.titulo }}</h3>' +
			'	</div>' +
			'	<div class="panel-body">' +
			'		<span ng-transclude></span>' +
			'	</div>' +
			'</div>'
	}
});

myapp.directive('accordionBusquedaCorrelatividad', function(){
	return {
		restrict:		'E',
		controller: ['$scope', 'invoiceFactory', 'generalCache', 'generalFunctions', function($scope, invoiceFactory, generalCache, generalFunctions){
			$scope.status = {
				open: true
			};
			$scope.ocultarFiltros = ['razonSocial', 'nroPtoVenta', 'nroComprobante', 'documentoCliente', 'codigo', 'estado', 'buque', 'contenedor', 'viaje', 'itemsPerPage'];
			$scope.fechaInicio = new Date();
			$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
			$scope.maxDate = new Date();
			$scope.terminalSellPoints = [];
			$scope.configPanel = {
				tipo: 'panel-info',
				titulo: 'Puntos de venta de la terminal seleccionada.'
			};
			$scope.model = {
				'nroPtoVenta': '',
				'codTipoComprob': 1,
				'fechaInicio': $scope.fechaInicio,
				'fechaFin': $scope.fechaFin
			};
			$scope.vouchers = generalCache.get('vouchers');
			$scope.traerPuntosDeVenta = function(){
				invoiceFactory.getCashbox({}, function(data){
					if (data.status == 'OK'){
						var i;
						$scope.terminalSellPoints = data.data;
						$scope.model.codTipoComprob = 1;
						$scope.model.nroPtoVenta = $scope.terminalSellPoints[0];
						for (i = 1; i<$scope.terminalSellPoints.length; i++){
							$scope.model.nroPtoVenta = $scope.model.nroPtoVenta + ',' + $scope.terminalSellPoints[i];
						}
					}
				})
			};
			$scope.openDate = function(event){
				generalFunctions.openDate(event);
			};
			$scope.hitEnter = function(evt){
				if(angular.equals(evt.keyCode,13))
					$scope.filtrar();
			};
			$scope.filtrado = function(filtro, contenido){
				$scope.mostrarResultado = false;
				$scope.currentPage = 1;
				$scope.model[filtro] = contenido;
				if ($scope.model.fechaInicio > $scope.model.fechaFin && $scope.model.fechaFin != ''){
					$scope.model.fechaFin = new Date($scope.model.fechaInicio);
					$scope.model.fechaFin.setDate($scope.model.fechaFin.getDate() + 1);
				}
				if ($scope.model.nroPtoVenta != '' && $scope.model.codTipoComprob != ''){
					$scope.$emit('cambioFiltro', cargaDatos());
				}
			};

			function cargaDatos(){
				return {
					'nroPtoVenta':		$scope.model.nroPtoVenta,
					'codTipoComprob':	$scope.model.codTipoComprob,
					'fechaInicio':		$scope.model.fechaInicio,
					'fechaFin':			$scope.model.fechaFin
				};
			}

			$scope.traerPuntosDeVenta();
		}],
		template:
			'<div class="row">' +
			'	<accordion-invoices-search></accordion-invoices-search>' +
			'</div>'
	}
});

myapp.directive('impresionFiltros', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/print.filtros.html'
	}
});

myapp.directive('buqueViajeSearch', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/buque.viaje.search.html',
		controller: ['$rootScope', '$scope', 'invoiceFactory', 'controlPanelFactory', 'gatesFactory', 'turnosFactory', 'afipFactory', 'dialogs', 'generalCache', function($rootScope, $scope, invoiceFactory, controlPanelFactory, gatesFactory, turnosFactory, afipFactory, dialogs, generalCache){
			$scope.loadingState = false;
			$scope.invoices = [];
			$scope.loadingInvoices = false;
			$scope.gates = [];
			$scope.loadingGates = false;
			$scope.turnos = [];
			$scope.loadingTurnos = false;
			$scope.tasas = [];
			$scope.loadingTasas = false;
			$scope.detalleGates = false;
			$scope.volverAPrincipal = false;
			$scope.ocultarFiltros = ['buque', 'contenedor', 'comprobantes', 'razonSocial', 'codTipoComprob', 'nroComprobante', 'fechaInicio'];
			$scope.mensajeResultado = $rootScope.mensajeResultado;
			$scope.configPanelTasas = {
				tipo: 'panel-info',
				titulo: 'Tasas a las cargas',
				mensaje: 'No se encontraron tasas a las cargas para los filtros seleccionados.'
			};
			$scope.configPanelGates = {
				tipo: 'panel-info',
				titulo: 'Gates',
				mensaje: 'No se encontraron gates para los filtros seleccionados.'
			};
			$scope.configPanelTurnos = {
				tipo: 'panel-info',
				titulo: 'Turnos',
				mensaje: 'No se encontraron turnos para los filtros seleccionados.'
			};
			$scope.detalle = false;
			$scope.contenedorElegido = {};
			$scope.currentPageContainers = 1;
			$scope.itemsPerPage = 10;
			$scope.totalItems = 0;
			$scope.panelMensaje = {
				titulo: 'Buque - Viaje',
				mensaje: 'No se encontraron contenedores para los filtros seleccionados.',
				tipo: 'panel-info'
			};
			$scope.sumariaConfigPanel = {
				tipo: 'panel-info',
				titulo: 'A.F.I.P. sumaria',
				mensaje: 'No se encontraron datos de sumarias de A.F.I.P relacionados.'
			};
			$scope.model = {
				buqueNombre: '',
				viaje: '',
				contenedor: ''
			};
			$scope.buques = generalCache.get('buques');
			$scope.buqueElegido = {
				viajes:[]
			};
			$scope.datosContainers = [];
			$scope.loadingState = false;
			$scope.cargandoSumaria = false;
			$scope.moneda = $rootScope.moneda;
			$scope.search = '';
			$scope.filtrarDesde = 0;
			$scope.mostrarAnterior = false;

			$scope.mostrarMenosViajes = function(){
				$scope.filtrarDesde -= 5;
				if ($scope.filtrarDesde == 0){
					$scope.mostrarAnterior = false;
				}
			};

			$scope.mostrarMasViajes = function(){
				$scope.filtrarDesde += 5;
				$scope.mostrarAnterior = true;
			};

			$scope.$on('errorInesperado', function(e, mensaje){
				$scope.loadingState = false;
				$scope.panelMensaje = mensaje;
				$scope.totalItems = 0;
				$scope.datosContainers = [];
			});

			$scope.buqueSelected = function(selected){
				$scope.buqueElegido.elegido = '';
				selected.elegido = 'bg-info';
				$scope.buqueElegido = selected;
				$scope.buqueElegido.viajes[0].active = true;
				$scope.model.buqueNombre = selected.buque;
				$scope.model.viaje = selected.viajes[0].viaje;
				$scope.traerResultados();
			};

			$scope.filtrado = function(filtro, contenido){
				$scope.loadingState = true;
				$scope.currentPageContainers = 1;
				$scope.model.contenedor = '';
				var cargar = true;
				switch (filtro){
					case 'buque':
						if (contenido == '') {
							$scope.model = {
								buqueNombre: '',
								viaje: ''
							};
							$scope.datosContainers = [];
							$scope.buqueElegido = {};
							$scope.loadingState = false;
							cargar = false;
						} else {
							$scope.model.buqueNombre = contenido;
						}
						break;
					case 'viaje':
						$scope.model.viaje = contenido;
						break;
				}
				if (cargar){
					$scope.traerResultados();
				}
			};

			$scope.traerResultados = function(){
				$scope.detalle = false;
				$scope.loadingState = true;
				$scope.datosContainers = [];
				invoiceFactory.getShipContainers($scope.model, function(data){
					if (data.status == 'OK'){
						$scope.datosContainers = data.data;
						$scope.totalItems = $scope.datosContainers.length;
					} else {
						$scope.panelMensaje = {
							titulo: 'Buque - Viaje',
							mensaje: 'Se ha producido un error al cargar los datos.',
							tipo: 'panel-danger'
						};
					}
					$scope.loadingState = false;
				});
			};

			$scope.verDetalles = function(contenedor){
				$scope.volverAPrincipal = !$scope.volverAPrincipal;
				$scope.loadingInvoices = true;
				$scope.invoices = [];
				$scope.loadingGates = true;
				$scope.gates = [];
				$scope.loadingTurnos = true;
				$scope.turnos = [];
				$scope.loadingTasas = true;
				$scope.tasas = [];
				$scope.detalle = true;
				$scope.contenedorElegido = contenedor;
				$scope.model.contenedor = contenedor.contenedor;
				$scope.cargaComprobantes();
				$scope.cargaTasasCargas();
				$scope.cargaGates();
				$scope.cargaTurnos();
				$scope.cargaSumaria();
			};

			$scope.cargaComprobantes = function(page){
				page = page || { skip:0, limit: $scope.itemsPerPage };
				if (page.skip == 0){ $scope.currentPage = 1}
				invoiceFactory.getInvoice($scope.model, page, function(data){
					if(data.status === 'OK'){
						$scope.invoices = data.data;
						$scope.invoicesTotalItems = data.totalCount;
					} else {
						$scope.mensajeResultado = {
							titulo: 'Comprobantes',
							mensaje: 'Se ha producido un error al cargar los datos de los comprobantes.',
							tipo: 'panel-danger'
						}
					}
					$scope.loadingInvoices = false;
				});
			};

			$scope.cargaTasasCargas = function(){
				var datos = { contenedor: $scope.contenedorElegido.contenedor, currency: $scope.moneda};
				controlPanelFactory.getTasasContenedor(datos, function(data){
					if (data.status === 'OK'){
						$scope.tasas = data.data;
						$scope.totalTasas = data.totalTasas;
					} else {
						$scope.configPanelTasas = {
							tipo: 'panel-danger',
							titulo: 'Tasas a las cargas',
							mensaje: 'Se ha producido un error al cargar los datos de tasas a las cargas.'
						}
					}
					$scope.loadingTasas = false;
				});
			};

			$scope.cargaGates = function(page){
				page = page || { skip: 0, limit: $scope.itemsPerPage };
				if (page.skip == 0){ $scope.currentPage = 1}
				gatesFactory.getGate($scope.model, page, function (data) {
					if (data.status === "OK") {
						$scope.gates = data.data;
						$scope.gatesTotalItems = data.totalCount;
					} else  {
						$scope.configPanelGates = {
							tipo: 'panel-danger',
							titulo: 'Gates',
							mensaje: 'Se ha producido un error al cargar los datos de los gates.'
						}
					}
					$scope.loadingGates = false;
				});
			};

			$scope.cargaTurnos = function(page){
				page = page || { skip:0, limit: $scope.itemsPerPage };
				turnosFactory.getTurnos($scope.model, page, function(data){
					if (data.status === "OK"){
						$scope.turnos = data.data;
						$scope.turnosTotalItems = data.totalCount;
					} else {
						$scope.configPanelTurnos = {
							tipo: 'panel-danger',
							titulo: 'Turnos',
							mensaje: 'Se ha producido un error al cargar los datos de los turnos.'
						}
					}
					$scope.loadingTurnos = false;
				});
			};

			$scope.cargaSumaria = function(){
				$scope.cargandoSumaria = true;
				afipFactory.getContainerSumaria($scope.model.contenedor, function(data){
					if (data.status == 'OK'){
						$scope.sumariaAfip = data.data;
					} else {
						$scope.sumariaConfigPanel = {
							tipo: 'panel-danger',
							titulo: 'A.F.I.P. sumaria',
							mensaje: 'Se ha producido un error al cargar los datos de la sumaria de A.F.I.P.'
						}
					}
					$scope.cargandoSumaria = false;
				})
			};

			$rootScope.$watch('moneda', function(){
				$scope.moneda = $rootScope.moneda;
				if ($scope.detalle){
					$scope.loadingTasas = true;
					$scope.cargaTasasCargas();
				}
			});

		}]
	}
});

myapp.directive('tableBuqueViaje', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/buque.viaje.result.html'
	}
});

myapp.directive('buqueViajeDetail', function() {
	return {
		restrict:		'E',
		templateUrl:	'view/buque.viaje.detail.html'
	}
});

myapp.directive('encabezadoTablaOrdenado', function() {
	return {
		restrict:		'E',
		transclude:		true,
		scope: {
			filtrarOrden:	'&',
			ocultaFiltros:	'=',
			model:			'=',
			filtro:			'@',
			filtroOrden:	'@',
			titulo:			'@'
		},
		template:
			'<a href ng-click="filtrarOrden({\'filtro\' : filtro})" ng-hide="ocultarFiltros.indexOf(\'{{ filtroOrden }}\', 0) >= 0">' +
			'	<span class="glyphicon" ng-class="{\'glyphicon-sort-by-attributes\' : !model.filtroOrdenReverse, \'glyphicon-sort-by-attributes-alt\' : model.filtroOrdenReverse}" ng-show="model.filtroOrden == \'{{ filtro }}\'"></span>' +
			'	{{ titulo }}' +
			'</a>' +
			'<span ng-show="ocultarFiltros.indexOf(\'{{ filtroOrden }}\', 0) >= 0">{{ titulo }}</span>'
	}
});

myapp.directive('tableContainerSumaria', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/container.sumaria.html',
		scope: {
			datosSumaria:	'=',
			loadingState:	'=',
			configPanel:	'='
		}
	}
});

myapp.directive('tableMissingGates', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/missing.gates.html',
		scope: {
			datoFaltante:	'='
		},
		controller:		'missingInfo'
	}
});

myapp.directive('tableMissingInvoices', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/missing.invoices.html',
		scope: {
			datoFaltante: '='
		},
		controller:		'missingInfo'
	}
});

myapp.directive('textPop', function() {
	return {
		restrict:		'E',
		scope: {
			text:		'@',
			max:		'@'
		},
		template:
			'<span class="hidden-print">{{ text | maxLength : max }}>' +
			'	<a href ng-show="(text.length > max)" popover="{{ text }}" popover-trigger="mouseenter"> (...)</a>' +
			'</span>' +
			'<span class="visible-print">{{ text }}</span>'
	}
});

myapp.directive('accordionAfipSearch', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/accordion.afip.search.html'
	}
});

myapp.directive('datepickerPopup', function (){
	return {
		restrict: 'EAC',
		require: 'ngModel',
		link: function(scope, element, attr, controller) {
			//remove the default formatter from the input directive to prevent conflict
			controller.$formatters.shift();
		}
	}
});

myapp.directive('toupper', [function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, modelCtrl) {
			var mayusculas = function(inputValue) {
				if (inputValue != undefined && inputValue != ''){
					var capitalized = inputValue.toUpperCase();
					if(capitalized !== inputValue) {
						modelCtrl.$setViewValue(capitalized);
						modelCtrl.$render();
					}
					return capitalized;
				}
			};
			modelCtrl.$parsers.push(mayusculas);
			mayusculas(scope[attrs.ngModel]);  // capitalize initial value
		}
	};
}]);

myapp.directive('collap', [function() {
	return {
		restrict: 'A',
		link: function(scope, element) {
			element.bind('click', function () {
				scope.isCollapsed = false;
			});
		}
	};
}]);

myapp.directive('accordionMin', [function () {
	return {
		restrict:		'E',
		transclude:		true,
		scope: {
			heading:	'@',
			open:		'='
		},
		link: function (scope) {
			if (angular.isDefined(scope.open)) scope.estado = scope.open;
		},
		template:
			'<div class="col-lg-12 hidden-print" ng-init="estado = true">' +
			'	<accordion>' +
			'		<accordion-group is-open="estado">' +
			'			<accordion-heading>' +
			'				<strong>{{ heading }}</strong><i class="pull-right glyphicon" ng-class="{\'glyphicon-chevron-down\': estado, \'glyphicon-chevron-right\': !estado}"></i>' +
			'			</accordion-heading>' +
			'			<div class="row">' +
			'				<div ng-transclude></div>' +
			'			</div>' +
			'		</accordion-group>' +
			'	</accordion>' +
			'</div>'
	}
}]);

myapp.directive('divCargando', [function () {
	return {
		restrict:		'E',
		transclude:		true,
		scope: {
			mostrar:	'='
		},
		template:
			'<div class="col-lg-12 text-center" ng-show="mostrar">' +
			'	<img class="media-object" style="margin-left: 40%; margin-top: 50px" src="images/ajax_loader_gray_512.gif" width="252" height="252">' +
			'</div>' +
			'<div class="col-lg-12" ng-hide="mostrar">' +
			'	<div ng-transclude></div>' +
			'</div>'

	}
}]);