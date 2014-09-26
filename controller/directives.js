/**
 * Created by leo on 05/09/14.
 */
(function(){
	myapp.directive('vistaComprobantes', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/vistaComprobantes.html',
			scope: {
				datosInvoices:		'=',
				ocultarFiltros:		'='
			},
			link: function($rootScope, $scope, $modal, invoiceFactory, loginService){
				$scope.fechaDesde = new Date();
				$scope.fechaHasta = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
				//Campos de búsqueda
				$scope.model = {
					'nroPtoVenta': '',
					'codTipoComprob': 0,
					'nroComprobante': '',
					'razonSocial': '',
					'documentoCliente': '',
					'fechaDesde': $scope.fechaDesde,
					'fechaHasta': $scope.fechaHasta,
					'contenedor': '',
					'buque': '',
					'estado': 'N',
					'codigo': '',
					'filtroOrden': 'gateTimestamp',
					'filtroOrdenAnterior': '',
					'filtroOrdenReverse': false,
					'order': ''
				};
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

				$scope.vouchersType = $rootScope.vouchersType;
				$scope.acceso = $rootScope.esUsuario;

				// Puntos de Ventas
				$scope.todosLosPuntosDeVentas = [];

				$rootScope.$watch('moneda', function(){ $scope.moneda = $rootScope.moneda; });

				$scope.hitEnter = function(evt){
					if(angular.equals(evt.keyCode,13))
						$scope.filtrar();
				};

				$scope.openDate = function(event){
					$rootScope.openDate(event);
				};

				$scope.clientSelected = function(selected){
					if (angular.isDefined(selected)){
						$scope.model.razonSocial = selected.title;
						$scope.filtrar({filtro: 'razonSocial', contenido: selected.title});
					}
				};

				$scope.containerSelected = function(selected){
					if (angular.isDefined(selected)){
						$scope.model.contenedor = selected.title;
						$scope.filtrar({filtro: 'contenedor', contenido: selected.title});
					}
				};

				$scope.buqueSelected = function(selected){
					if (angular.isDefined(selected)){
						$scope.model.buque = selected.title;
						$scope.filtrar({filtro: 'buque', contenido: selected.title});
					}
				};

				$scope.filtrado = function(filtro, contenido){
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
					//$scope.filtrar({filtro: filtro, contenido: contenido});
					$scope.cargaPuntosDeVenta();
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
					$scope.$emit('cambioFiltro', cargaDatos());
				};

				$scope.trackInvoice = function(comprobante){
					var estado;
					comprobante.estado.forEach(function(estadoGrupo){
						if (estadoGrupo.grupo == loginService.getGroup()){
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
										comprobante.estado = dataComment.newState;
										$scope.filtrar();
									}
								});
							});
						});
					});
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
						//$scope.cargaFacturas();
						$scope.$emit('cambioFiltro', cargaDatos());
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
						//$scope.cargaFacturas();
						$scope.$emit('cambioFiltro', cargaDatos());
					})
				};

				function cargaDatos(){
					return {
						'nroPtoVenta':		$scope.model.nroPtoVenta,
						'codTipoComprob':	$scope.model.codTipoComprob,
						'nroComprobante':	$scope.model.nroComprobante,
						'razonSocial':		$scope.model.razonSocial,
						'documentoCliente':	$scope.model.documentoCliente,
						'estado':			$scope.model.estado,
						'fechaDesde':		$scope.model.fechaDesde,
						'fechaHasta':		$scope.model.fechaHasta,
						'contenedor':		$scope.model.contenedor,
						'buque':			$scope.model.buque,
						'codigo':			$scope.model.codigo,
						'order':			$scope.model.order
					};
				}

				function cargaDatosSinPtoVenta(){
					var datos = cargaDatos();
					datos.nroPtoVenta = '';
					return datos;
				}

			}
		}
	});

	myapp.directive('tableInvoices', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/table.invoices.html',
			scope: {
				model:				'=',
				datosInvoices:		'=',
				ocultarFiltros:		'@',
				mostrarDetalle:		'&',
				filtrar:			'&'
			},
			controller: ['$rootScope', '$scope', '$modal', 'invoiceFactory', 'loginService', function($rootScope, $scope, $modal, invoiceFactory, loginService){
				$scope.vouchersType = $rootScope.vouchersType;
				$scope.acceso = $rootScope.esUsuario;
				$scope.filtrarOrden = function(filtro){
					var filtroModo;
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
					$scope.filtrar();
				};
				$scope.trackInvoice = function(comprobante){
					var estado;
					comprobante.estado.forEach(function(estadoGrupo){
						if (estadoGrupo.grupo == loginService.getGroup()){
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
										comprobante.estado = dataComment.newState;
										$scope.filtrar();
									}
								});
							});
						});
					});
				};
				$scope.filtrado = function(filtro, contenido){
					switch (filtro){
						case 'nroPtoVenta':
							$scope.model.nroPtoVenta = contenido;
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
					$scope.filtrar(filtro, contenido);
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
				$rootScope.$watch('moneda', function(){ $scope.moneda = $rootScope.moneda; });
			}]
		}
	});

	myapp.directive('accordionComprobantesVistos', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/accordion.comprobantes.vistos.html',
			scope: {
				comprobantesVistos:	'='
			},
			controller: ['$rootScope', '$scope', function($rootScope, $scope){
				$scope.vouchersType = $rootScope.vouchersType;
				$scope.quitarVista = function (comprobante) {
					var pos = $scope.comprobantesVistos.indexOf(comprobante);
					$scope.comprobantesVistos.splice(pos, 1);
				};
				$rootScope.$watch('moneda', function(){ $scope.moneda = $rootScope.moneda; });
			}]
		}
	});

	myapp.directive('accordionInvoicesSearch', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/accordion.invoices.search.html',
			scope: {
				model:				'=',
				ocultarFiltros:		'@',
				filtrar:			'&'
			},
			controller: ['$rootScope', '$scope', function($rootScope, $scope){
				$scope.maxDateD = new Date();
				$scope.maxDateH = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
				$scope.vouchers = $rootScope.vouchers;
				$scope.formatDate = $rootScope.formatDate;
				$scope.dateOptions = $rootScope.dateOptions;
				$scope.listaContenedores = $rootScope.listaContenedores;
				$scope.listaRazonSocial = $rootScope.listaRazonSocial;
				$scope.listaBuques = $rootScope.listaBuques;
				$scope.hitEnter = function(evt){
					if(angular.equals(evt.keyCode,13))
						$scope.filtrar();
				};
				$scope.openDate = function(event){
					$rootScope.openDate(event);
				};
				$scope.clientSelected = function(selected){
					if (angular.isDefined(selected)){
						$scope.model.razonSocial = selected.title;
						$scope.filtrar({filtro: 'razonSocial', contenido: selected.title});
					}
				};
				$scope.containerSelected = function(selected){
					if (angular.isDefined(selected)){
						$scope.model.contenedor = selected.title;
						$scope.filtrar({filtro: 'contenedor', contenido: selected.title});
					}
				};
				$scope.buqueSelected = function(selected){
					if (angular.isDefined(selected)){
						$scope.model.buque = selected.title;
						$scope.filtrar({filtro: 'buque', contenido: selected.title});
					}
				};
				$scope.filtrado = function(filtro, contenido){
					switch (filtro){
						case 'nroPtoVenta':
							$scope.model.nroPtoVenta = contenido;
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
					$scope.filtrar({filtro: filtro, contenido: contenido});
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
			}]
		}
	});

	myapp.directive('accordionGatesTurnosSearch', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/accordion.gatesturnos.search.html',
			scope: {
				model:			'=',
				ocultarFiltros:	'@',
				filtrar:		'&'
			},
			controller: ['$rootScope', '$scope', function($rootScope, $scope){
				$scope.maxDate = new Date();
				$scope.formatDate = $rootScope.formatDate;
				$scope.dateOptions = $rootScope.dateOptions;
				$scope.listaBuquesGates = $rootScope.listaBuquesGates;
				$scope.listaContenedoresGates = $rootScope.listaContenedoresGates;
				$scope.openDate = function(event){
					$rootScope.openDate(event);
				};
				$scope.hitEnter = function(evt){
					if(angular.equals(evt.keyCode,13))
						$scope.filtrar();
				};
				$scope.buqueSelected = function (selected) {
					if (angular.isDefined(selected)) {
						$scope.model.buque = selected.title;
						$scope.filtrar('buque', selected.title);
					}
				};
				$scope.containerSelected = function (selected) {
					if (angular.isDefined(selected)) {
						$scope.model.contenedor = selected.title;
						$scope.filtrar('contenedor', selected.title);
					}
				};
				$scope.filtrado = function(filtro, contenido){
					switch (filtro){
						case 'nroPtoVenta':
							$scope.model.nroPtoVenta = contenido;
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
					$scope.filtrar({filtro: filtro, contenido: contenido});
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
				$scope.cargaPorFiltros = function () {
					$scope.status.open = !$scope.status.open;
					$scope.filtrar();
				};
			}]
		}
	});

	myapp.directive('divPagination', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/div.pagination.html',
			scope: {
				totalItems:			'=',
				paginationHide:		'='
			},
			link: function($scope){
				$scope.currentPage = 1;
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
})();