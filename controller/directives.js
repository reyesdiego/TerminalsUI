/**
 * Created by leo on 05/09/14.
 */
(function(){
	myapp.directive('tableInvoices', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/table.invoices.html',
			scope: {
				invoices:			'=datosInvoices',
				acceso:				'@',
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
				comprobantesVistos:	'=datosComprobantes',
				mostrarDetalle:		'&',
				quitarVista:		'&'
			},
			controller: ['$rootScope', '$scope', function($rootScope, $scope){
				$scope.vouchersType = $rootScope.vouchersType;
				$scope.moneda = $rootScope.moneda;
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
				$scope.openDate = function(event){
					$rootScope.openDate(event);
				};
				$scope.filtrado = function(filtro, contenido){
					$scope.filtrar({filtro: filtro, contenido: contenido});
				}
			}]
		}
	});

	myapp.directive('divPagination', function(){
		return {
			restrict:		'E',
			templateUrl:	'view/div.pagination.html',
			scope: {
				currentPage:		'=',
				totalItems:			'=',
				pageChanged:		'&'
			},
			link: function($scope){
				$scope.$watch('currentPage', function(){ $scope.pageChanged() })
			}
		}
	});
})();