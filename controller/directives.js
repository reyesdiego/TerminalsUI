/**
 * Created by leo on 05/09/14.
 */
(function(){
	myapp.directive('vistaComprobantes', function(){
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
				panelMensaje:						'='
			},
			controller: ['$rootScope', '$scope', '$modal', 'invoiceFactory', 'loginService', 'priceFactory', function($rootScope, $scope, $modal, invoiceFactory, loginService, priceFactory){
				$scope.currentPage = 1;

				//Variables para control de fechas
				$scope.maxDateD = new Date();
				$scope.maxDateH = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
				//Tipos de comprobantes
				$scope.vouchers = $rootScope.vouchers;
				//Opciones de fecha para calendarios
				$scope.formatDate = $rootScope.formatDate;
				$scope.dateOptions = $rootScope.dateOptions;
				//Listas para autocompletado
				$scope.listaContenedores = $rootScope.listaContenedores;
				$scope.listaRazonSocial = $rootScope.listaRazonSocial;
				$scope.listaBuques = $rootScope.listaBuques;

				$scope.comprobantesVistos = [];

				$scope.vouchersType = $rootScope.vouchersType;
				$scope.acceso = $rootScope.esUsuario;

				// Puntos de Ventas
				$scope.todosLosPuntosDeVentas = [];

				$scope.mostrarResultado = false;
				$scope.verDetalle = {};

				//Control de tarifas
				$scope.controlTarifas = [];
				$scope.noMatch = false;

				$scope.recargarResultado = false;

				priceFactory.getArrayMatches(loginService.getFiltro(), function(arrayMatches){
					$rootScope.matchesTerminal = arrayMatches;
				});

				invoiceFactory.getDescriptionItem(function(data){
					$scope.itemsDescription = data.data;
				});

				$scope.$on('iniciarBusqueda', function(event, data){
					$scope.filtrado(data.filtro, data.contenido);
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

				$scope.hitEnter = function(evt){
					if(angular.equals(evt.keyCode,13))
						$scope.cargaPuntosDeVenta();
				};

				$scope.openDate = function(event){
					$rootScope.openDate(event);
				};

				$scope.clientSelected = function(selected){
					if (angular.isDefined(selected)){
						$scope.model.razonSocial = selected.title;
						$scope.filtrado('razonSocial', selected.title);
					}
				};

				$scope.containerSelected = function(selected){
					if (angular.isDefined(selected)){
						$scope.model.contenedor = selected.title;
						$scope.filtrado('contenedor', selected.title);
					}
				};

				$scope.buqueSelected = function(selected){
					if (angular.isDefined(selected)){
						$scope.model.buque = selected.title;
						$scope.filtrado('buque', selected.title);
					}
				};

				$scope.filtrado = function(filtro, contenido){
					$scope.loadingState = true;
					$scope.mostrarResultado = false;
					$scope.currentPage = 1;
					switch (filtro){
						case 'nroPtoVenta':
							$scope.model.nroPtoVenta = contenido;
							break;
						case 'codigo':
							$scope.model.codigo = contenido;
							break;
						case 'codComprobante':
							$scope.model.codTipoComprob = contenido;
							break;
						case 'nroComprobante':
							$scope.model.nroComprobante = contenido;
							break;
						case 'razonSocial':
							$scope.model.razonSocial = $scope.filtrarCaracteresInvalidos(contenido);
							break;
						case 'documentoCliente':
							$scope.model.documentoCliente = contenido;
							break;
						case 'estado':
							$scope.model.estado = contenido;
							break;
						case 'fechaDesde':
							$scope.model.fechaDesde = contenido;
							break;
						case 'fechaHasta':
							$scope.model.fechaHasta = contenido;
							break;
						case 'contenedor':
							$scope.model.contenedor = contenido;
							break;
						case 'buque':
							$scope.model.buque = contenido;
							break;
					}
					if ($scope.model.fechaDesde > $scope.model.fechaHasta && $scope.model.fechaHasta != ''){
						$scope.model.fechaHasta = new Date($scope.model.fechaDesde);
						$scope.model.fechaHasta.setDate($scope.model.fechaHasta.getDate() + 1);
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

					$scope.$emit('cambioFiltro', $scope.model);
				};

				$scope.trackInvoice = function(comprobante){
					var estado;
					comprobante.estado.forEach(function(estadoGrupo){
						if (estadoGrupo.grupo == loginService.getGroup() || estadoGrupo.grupo === 'ALL'){
							estado = estadoGrupo.estado;
						}
					});
					invoiceFactory.getTrackInvoice(comprobante._id, function(dataTrack){
						var modalInstance = $modal.open({
							templateUrl: 'view/trackingInvoice.html',
							controller: trackingInvoiceCtrl,
							backdrop: 'static',
							resolve: {
								estado: function () {
									return estado;
								},
								track: function() {
									return dataTrack;
								}
							}
						});
						dataTrack = [];
						modalInstance.result.then(function (dataComment) {
							invoiceFactory.cambiarEstado(comprobante._id, dataComment.newState, function(){
								$scope.recargarResultado = true;
								var logInvoice = {
									title: dataComment.title,
									state: dataComment.newState,
									comment: dataComment.comment,
									invoice: comprobante._id
								};
								invoiceFactory.commentInvoice(logInvoice, function(dataRes){
									if (dataRes.status == 'OK'){
										switch (dataComment.newState){
											case 'Y':
												comprobante.interfazEstado = {
													'estado': 'Revisar',
													'btnEstado': 'btn-warning'
												};
												break;
											case 'G':
												comprobante.interfazEstado = {
													'estado': 'Controlado',
													'btnEstado': 'btn-success'
												};
												break;
											case 'R':
												comprobante.interfazEstado = {
													'estado': 'Error',
													'btnEstado': 'btn-danger'
												};
												break;
										}
										var nuevoEstado = {
											_id: comprobante._id,
											estado: dataComment.newState,
											grupo: loginService.getGroup(),
											user: loginService.getInfo().user
										};
										comprobante.estado.push(nuevoEstado);
										if (!$scope.ocultarAccordionInvoicesSearch && !$scope.mostrarResultado)
											$scope.cargaPuntosDeVenta();
									}
								});
							});
						});
					});
				};

				$scope.ocultarResultado = function(){
					$scope.mostrarResultado = false;
					if ($scope.recargarResultado)
						$scope.cargaPuntosDeVenta();
				};

				$scope.quitarVista = function (comprobante) {
					var pos = $scope.comprobantesVistos.indexOf(comprobante);
					$scope.comprobantesVistos.splice(pos, 1);
				};

				// Funciones de Puntos de Venta
				$scope.cargaPuntosDeVenta = function(){
					invoiceFactory.getCashbox(cargaDatosSinPtoVenta(), function(data){
						$scope.todosLosPuntosDeVentas.forEach(function(todosPtos){
							todosPtos.hide = data.data.indexOf(todosPtos.punto, 0) < 0;
							if (todosPtos.punto == $scope.model.nroPtoVenta && todosPtos.hide){
								$scope.model.nroPtoVenta = '';
								$scope.todosLosPuntosDeVentas[0].active = true;
							}
						});
						$scope.todosLosPuntosDeVentas[0].hide = false;
						$scope.currentPage = 1;

						$scope.$emit('cambioFiltro', $scope.model);
					});
				};

				$scope.cargaTodosLosPuntosDeVentas = function(){
					invoiceFactory.getCashbox('', function(data){
						var dato = {'heading': 'Todos los Puntos de Ventas', 'punto': '', 'active': true, 'hide': false};
						$scope.todosLosPuntosDeVentas.push(dato);
						data.data.forEach(function(punto){
							dato = {'heading': punto, 'punto': punto, 'active': false, 'hide': true};
							$scope.todosLosPuntosDeVentas.push(dato);
						});
						$scope.cargaPuntosDeVenta();
					})
				};

				$scope.mostrarDetalle = function(comprobante){
					$scope.recargarResultado = false;

					$scope.loadingState = true;
					var encontrado = false;
					$scope.comprobantesVistos.forEach(function(unComprobante){
						if (unComprobante._id == comprobante._id){
							encontrado = true;
						}
					});
					if (!encontrado){
						$scope.comprobantesVistos.push(comprobante);
					}

					invoiceFactory.invoiceById(comprobante._id, function(callback){
						$scope.verDetalle = callback;
						$scope.controlarTarifas($scope.verDetalle);

						$rootScope.commentsInvoice = [];
						$scope.mostrarResultado = true;
						$scope.loadingState = false;

						$rootScope.verDetalle = $scope.verDetalle;
						$rootScope.modeloImpresion.vista = 'hidden-print';
						$rootScope.modeloImpresion.comprobante = 'visible-print-block';
						$rootScope.modeloImpresion.correlativo = 'hidden-print';

						invoiceFactory.getTrackInvoice(comprobante._id, function(dataTrack){
							dataTrack.data.forEach(function(comment){
								if (comment.group == loginService.getGroup()){
									$rootScope.commentsInvoice.push(comment);
								}
							});
						});
					});
				};

				$scope.controlarTarifas = function(comprobante){
					var valorTomado;
					var tarifaError;

					comprobante.controlTarifas = [];

					var lookup = {};
					for (var i = 0, len = $rootScope.matchesTerminal.length; i < len; i++) {
						lookup[$rootScope.matchesTerminal[i].codigo] = $rootScope.matchesTerminal[i];
					}

					$scope.noMatch = false;

					comprobante.detalle.forEach(function(detalle){
						detalle.items.forEach(function(item){
							if (angular.isDefined(lookup[item.id])){
								valorTomado = item.impUnit;
								if (lookup[item.id].moneda != 'DOL'){
									valorTomado = item.impUnit * comprobante.cotiMoneda
								}
								if (valorTomado > lookup[item.id].valor){
									tarifaError = {
										codigo: item.id,
										currency: lookup[item.id].moneda,
										topPrice: lookup[item.id].valor,
										current: item.impUnit
									};
									comprobante.controlTarifas.push(tarifaError);
								}
							} else {
								$scope.noMatch = true;
							}
						});
					});
					$rootScope.noMatch = $scope.noMatch;
				};

				$scope.chequearTarifas = function(comprobante){
					$scope.controlarTarifas(comprobante);
					return comprobante.controlTarifas.length > 0;
				};

				$scope.existeDescripcion = function(itemId){
					return angular.isDefined($scope.itemsDescription[itemId]);
				};

				function cargaDatosSinPtoVenta(){
					var datos = $scope.model;
					datos.nroPtoVenta = '';
					return datos;
				}

				$scope.cargaTodosLosPuntosDeVentas();

			}]
		}
	});

	myapp.directive('tableInvoices', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/table.invoices.html'
		}
	});

	myapp.directive('tableGates', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/table.gates.html',
			scope: {
				datosGates:			'=',
				totalItems:			'=',
				detallesGates:		'=',
				ocultarFiltros:		'@',
				filtrarOrden:		'&'
			},
			controller: ['$scope', 'invoiceFactory', function($scope, invoiceFactory){
				$scope.totalGates = 0;
				$scope.configPanel = {
					tipo: 'panel-info',
					titulo: 'Gates'
				};
				$scope.colorHorario = function (gate) {
					var horarioGate = new Date(gate.gateTimestamp);
					var horarioInicio = new Date(gate.turnoInicio);
					var horarioFin = new Date(gate.turnoFin);
					if (horarioGate >= horarioInicio && horarioGate <= horarioFin) {
						return 'green'
					} else {
						return 'red'
					}
				};
				$scope.mostrarDetalle = function(contenedor){
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
			}]
		}
	});

	myapp.directive('tableGatesResult', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/gates.invoices.html'
		}
	});

	myapp.directive('tableTurnos', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/table.turnos.html',
			scope: {
				datosTurnos:		'=',
				totalItems:			'='
			},
			link: function($scope){
				$scope.configPanel = {
					tipo: 'panel-info',
					titulo: 'Turnos'
				};
			}
		}
	});

	myapp.directive('tableTasasCargas', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/table.tasas.cargas.html',
			link: function($scope){
				$scope.configPanel = {
					tipo: 'panel-info',
					titulo: 'Tasas a las Cargas'
				};
			}
		}
	});

	myapp.directive('accordionComprobantesVistos', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/accordion.comprobantes.vistos.html'
		}
	});

	myapp.directive('accordionInvoicesSearch', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/accordion.invoices.search.html'
		}
	});

	myapp.directive('invoicesResult', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/invoices.result.html'
		}
	});

	myapp.directive('invoiceTrack', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/comments.invoice.html'
		}
	});

	myapp.controller("searchController", ['$rootScope', '$scope', function($rootScope, $scope){
		$scope.maxDate = new Date();
		$scope.formatDate = $rootScope.formatDate;
		$scope.dateOptions = $rootScope.dateOptions;
		$scope.listaBuquesGates = $rootScope.listaBuquesGates;
		$scope.listaContenedoresGates = $rootScope.listaContenedoresGates;
		$scope.listaBuquesTurnos = $rootScope.listaBuquesTurnos;
		$scope.listaContenedoresTurnos = $rootScope.listaContenedoresTurnos;
		$scope.openDate = function(event){
			$rootScope.openDate(event);
		};
		$scope.hitEnter = function(evt){
			if(angular.equals(evt.keyCode,13))
				$scope.$emit('cambioFiltro');
		};
		$scope.buqueSelected = function (selected) {
			if (angular.isDefined(selected)) {
				$scope.model.buque = selected.title;
				$scope.filtrado('buque', selected.title);
			}
		};
		$scope.containerSelected = function (selected) {
			if (angular.isDefined(selected)) {
				$scope.model.contenedor = selected.title;
				$scope.filtrado('contenedor', selected.title);
			}
		};
		$scope.filtrado = function(filtro, contenido){
			switch (filtro){
				case 'fechaDesde':
					$scope.model.fechaDesde = contenido;
					break;
				case 'fechaHasta':
					$scope.model.fechaHasta = contenido;
					break;
				case 'contenedor':
					$scope.model.contenedor = contenido;
					break;
				case 'buque':
					$scope.model.buque = contenido;
					break;
			}
			if ($scope.model.fechaDesde > $scope.model.fechaHasta && $scope.model.fechaHasta != ''){
				$scope.model.fechaHasta = new Date($scope.model.fechaDesde);
				$scope.model.fechaHasta.setDate($scope.model.fechaHasta.getDate() + 1);
			}
			$scope.$emit('cambioFiltro');
		};
		$scope.cargaPorFiltros = function () {
			$scope.status.open = !$scope.status.open;
			$scope.$emit('cambioFiltro');
		};
	}]);

	myapp.directive('accordionGatesSearch', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/accordion.gates.search.html',
			scope: {
				model:			'='
			},
			controller: 'searchController'
		}
	});

	myapp.directive('accordionTurnosSearch', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/accordion.turnos.search.html',
			scope: {
				model:			'='
			},
			controller: 'searchController'
		}
	});

	myapp.directive('divPagination', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/div.pagination.html',
			scope: {
				totalItems:			'=',
				currentPage:		'='
			},
			link: function($scope){
				$scope.$watch('totalItems', function(){
					if ($scope.totalItems >= 10000){
						$scope.maxSizeSM = 9;
						$scope.maxSizeMD = 13;
						$scope.maxSizeLG = 17;
					} else {
						$scope.maxSizeSM = 10;
						$scope.maxSizeMD = 15;
						$scope.maxSizeLG = 20;
					}
				});
				$scope.pageChanged = function(){
					$scope.$emit('cambioPagina', $scope.currentPage);
				}
			}
		}
	});

	myapp.directive('divPanel', function(){
		return {
			restrict:		'E',
			transclude:		true,
			scope:	{
				configPanel:	'='
			},
			template:		'<div class="panel {{ configPanel.tipo }}">' +
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
			templateUrl:	'view/correlativeControlSearch.html',
			controller: ['$rootScope', '$scope', 'invoiceFactory', function($rootScope, $scope, invoiceFactory){
				$scope.ocultarFiltros = ['razonSocial', 'nroComprobante', 'documentoCliente', 'codigo', 'estado', 'buque', 'contenedor'];
				$scope.fechaDesde = new Date();
				$scope.fechaHasta = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
				$scope.maxDate = new Date();
				$scope.formatDate = $rootScope.formatDate;
				$scope.dateOptions = $rootScope.dateOptions;
				$scope.terminalSellPoints = [];
				$scope.configPanel = {
					tipo: 'panel-info',
					titulo: 'Puntos de venta de la terminal seleccionada.'
				};
				$scope.model = {
					'nroPtoVenta': '',
					'codTipoComprob': 1,
					'fechaDesde': $scope.fechaDesde,
					'fechaHasta': $scope.fechaHasta
				};
				$scope.traerPuntosDeVenta = function(){
					invoiceFactory.getCashbox({}, function(data){
						$scope.terminalSellPoints = data.data;
						$scope.model.codTipoComprob = 1;
					})
				};
				$scope.openDate = function(event){
					$rootScope.openDate(event);
				};
				$scope.hitEnter = function(evt){
					if(angular.equals(evt.keyCode,13))
						$scope.filtrar();
				};
				$scope.filtrado = function(filtro, contenido){
					$scope.mostrarResultado = false;
					$scope.currentPage = 1;
					switch (filtro){
						case 'nroPtoVenta':
							$scope.model.nroPtoVenta = contenido;
							break;
						case 'codComprobante':
							$scope.model.codTipoComprob = contenido;
							break;
						case 'fechaDesde':
							$scope.model.fechaDesde = contenido;
							break;
						case 'fechaHasta':
							$scope.model.fechaHasta = contenido;
							break;
					}
					if ($scope.model.fechaDesde > $scope.model.fechaHasta && $scope.model.fechaHasta != ''){
						$scope.model.fechaHasta = new Date($scope.model.fechaDesde);
						$scope.model.fechaHasta.setDate($scope.model.fechaHasta.getDate() + 1);
					}
					if ($scope.model.nroPtoVenta != '' && $scope.model.codTipoComprob != ''){
						$scope.$emit('cambioFiltro', cargaDatos());
					}
				};

				function cargaDatos(){
					return {
						'nroPtoVenta':		$scope.model.nroPtoVenta,
						'codTipoComprob':	$scope.model.codTipoComprob,
						'fechaDesde':		$scope.model.fechaDesde,
						'fechaHasta':		$scope.model.fechaHasta
					};
				}

				$scope.traerPuntosDeVenta();
			}]
		}
	});

})();