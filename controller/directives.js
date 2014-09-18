/**
 * Created by leo on 05/09/14.
 */
(function(){
	myapp.directive('tableInvoices', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/table.invoices.html',
			scope: {
				datosInvoices:		'=',
				ocultarFiltros:		'@',
				filtroOrden:		'@',
				filtroOrdenReverse:	'=',
				mostrarDetalle:		'&',
				filtrarOrden:		'&',
				trackInvoice:		'&',
				filtrar:			'&'
			},
			controller: ['$rootScope', '$scope', function($rootScope, $scope){
				$scope.vouchersType = $rootScope.vouchersType;
				$scope.moneda = $rootScope.moneda;
				$scope.acceso = $rootScope.esUsuario;
				$scope.conversionMoneda = function(importe, codMoneda, cotiMoneda){
					if ($rootScope.moneda == 'PES' && codMoneda == 'DOL'){ return (importe * cotiMoneda);
					} else if ($rootScope.moneda == 'DOL' && codMoneda == 'PES'){ return (importe / cotiMoneda);
					} else { return (importe); }
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
				$scope.maxDateH = new Date();
				$scope.maxDateH.setDate($scope.maxDateH.getDate() + 1);
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