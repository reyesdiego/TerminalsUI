/**
 * Created by leo on 05/09/14.
 */
(function(){
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
			controller: ['$rootScope', '$scope', '$modal', 'invoiceFactory', function($rootScope, $scope, $modal, invoiceFactory){
				$scope.vouchersType = $rootScope.vouchersType;
				$scope.moneda = $rootScope.moneda;
				$scope.acceso = $rootScope.esUsuario;
				$scope.conversionMoneda = function(importe, codMoneda, cotiMoneda){
					if ($rootScope.moneda == 'PES' && codMoneda == 'DOL'){ return (importe * cotiMoneda);
					} else if ($rootScope.moneda == 'DOL' && codMoneda == 'PES'){ return (importe / cotiMoneda);
					} else { return (importe); }
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
					$scope.filtrar();
				};
				$scope.trackInvoice = function(comprobante){
					var estado = comprobante.estado;
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
			}]
		}
	});

	myapp.directive('accordionComprobantesVistos', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/accordion.comprobantes.vistos.html',
			scope: {
				comprobantesVistos:	'=',
				mostrarDetalle:		'&'
			},
			controller: ['$rootScope', '$scope', function($rootScope, $scope){
				$scope.vouchersType = $rootScope.vouchersType;
				$scope.moneda = $rootScope.moneda;
				$scope.quitarVista = function (comprobante) {
					var pos = $scope.comprobantesVistos.indexOf(comprobante);
					$scope.comprobantesVistos.splice(pos, 1);
				};
				$scope.conversionMoneda = function(importe, codMoneda, cotiMoneda){
					if ($rootScope.moneda == 'PES' && codMoneda == 'DOL'){ return (importe * cotiMoneda);
					} else if ($rootScope.moneda == 'DOL' && codMoneda == 'PES'){ return (importe / cotiMoneda);
					} else { return (importe); }
				};
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
				$scope.filtrado = function(filtro, contenido){
					$scope.filtrar({filtro: filtro, contenido: contenido});
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
			}]
		}
	});

	myapp.directive('accordionGatesTurnosSearch', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/accordion.gatesturnos.search.html'
		}
	});

	myapp.directive('divPagination', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/div.pagination.html',
			scope: {
				currentPage:		'=',
				totalItems:			'=',
				paginationHide:		'=',
				pageChanged:		'&'
			},
			link: function($scope){
				$scope.$watch('currentPage', function(){ $scope.pageChanged() });
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
				})
			}
		}
	});
})();