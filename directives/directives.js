/**
 * Created by leo on 05/09/14.
 */

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
			controlCodigos:						'=',
			codigosSinAsociar:					'=',
			mostrarPtosVenta:					'=',
			ocultarAccordionInvoicesSearch:		'=',
			ocultarAccordionComprobantesVistos:	'=',
			panelMensaje:						'=',
			volverAPrincipal:					'=',
			filtroEstados:						'='
		},
		controller: 'vistaComprobantesCtrl'
	}
});

myapp.directive('comprobantesPorEstado', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/comprobantesPorEstado.html',
		scope: {
			estado:								'@',
			filtroEstados:						'@'
		},
		controller: 'comprobantesPorEstadoCtrl'
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
			ocultarBusqueda:	'=',
			model:				'=',
			datosGates:			'=',
			totalItems:			'=',
			tiempoConsulta:		'=',
			itemsPerPage:		'=',
			detallesGates:		'=',
			ocultarFiltros:		'=',
			currentPage:		'=',
			configPanel:		'=',
			loadingState:		'='
		},
		controller: 'searchController'
	}
});

myapp.directive('detalleLiquidacion', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/detalle.liquidacion.html',
		scope: {
			payment:	'=',
			tasaAgp:	'='
		}
	}
});

myapp.directive('tableTurnos', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/table.turnos.html',
		scope: {
			ocultarBusqueda:	'=',
			model:				'=',
			datosTurnos:		'=',
			totalItems:			'=',
			itemsPerPage:		'=',
			configPanel:		'=',
			currentPage:		'=',
			ocultarFiltros:		'=',
			loadingState:		'=',
			control:			'='
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
			loadingState:		'=',
			moneda:				'='
		}
	}
});

myapp.directive('accordionComprobantesVistos', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/accordion.comprobantes.vistos.html',
		link: function ($scope) {
			$scope.quitarVista = function (comprobante) {
				comprobante.controlled = false;
				var pos = $scope.comprobantesVistos.indexOf(comprobante);
				$scope.comprobantesVistos.splice(pos, 1);
			};
		}
	}
});

myapp.directive('accordionInvoicesSearch', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/accordion.invoices.search.html',
		scope: {
			model:				'=',
			ocultarFiltros:		'='
		},
		controller: 'searchController'
	}
});

myapp.directive('invoicesResult', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/invoices.result.html'
	}
});

myapp.directive('detalleComprobante', ['dialogs', 'loginService', function(dialogs, loginService){
	return {
		restrict:		'E',
		templateUrl:	'view/invoices.result.html',
		scope:{
			verDetalle:			"=",
			mostrar:			"=",
			comprobantes:		"=",
			comprobantesVistos:	"=",
			ocultarFiltros:		"=",
			logoTerminal:		"=",
			moneda:				'='
		},
		link: function($scope){
			$scope.acceso = loginService.type;
			$scope.comprobantesControlados = [];

			$scope.ocultarResultado = function(){
				$scope.mostrar = false;
			};

			$scope.verPdf = function(){
				$scope.disablePdf = true;
				$scope.verDetalle.verPdf()
					.then(function(){
						$scope.disablePdf = false;
					}, function(){
						dialogs.error('Comprobantes', 'Se ha producido un error al procesar el comprobante');
						$scope.disablePdf = false;
					});
			};
		}
	}
}]);

myapp.directive('containersGatesSearch', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/accordion.gates.search.html'
	}
});

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
			$scope.lastPage = $scope.currentPage;
			$scope.$watch('totalItems', function(){
				switch ($scope.panelSize){
					case 12:
					case undefined:
						if ($scope.totalItems / $scope.itemsPerPage >= 10000){
							$scope.maxSizeSM = 6;
							$scope.maxSizeMD = 10;
							$scope.maxSizeLG = 14;
						} else if ($scope.totalItems / $scope.itemsPerPage >= 1000) {
							$scope.maxSizeSM = 9;
							$scope.maxSizeMD = 13;
							$scope.maxSizeLG = 17;
						} else {
							$scope.maxSizeSM = 10;
							$scope.maxSizeMD = 15;
							$scope.maxSizeLG = 19;
						}
						break;
					case 10:
						if ($scope.totalItems / $scope.itemsPerPage >= 10000){
							$scope.maxSizeSM = 3;
							$scope.maxSizeMD = 7;
							$scope.maxSizeLG = 10;
						} else if ($scope.totalItems / $scope.itemsPerPage >= 1000){
							$scope.maxSizeSM = 5;
							$scope.maxSizeMD = 9;
							$scope.maxSizeLG = 12;
						} else if ($scope.totalItems / $scope.itemsPerPage >= 100) {
							$scope.maxSizeSM = 7;
							$scope.maxSizeMD = 11;
							$scope.maxSizeLG = 15;
						} else {
							$scope.maxSizeSM = 8;
							$scope.maxSizeMD = 12;
							$scope.maxSizeLG = 17;
						}
						break;
				}

			});
			$scope.pageChanged = function(){
				if ($scope.lastPage != $scope.currentPage){
					$scope.lastPage = $scope.currentPage;
					$scope.$emit('cambioPagina', $scope.currentPage);
				}
			};
		},
		template:
			'<div class="col-lg-12 hidden-print hidden-xs" ng-show="totalItems > itemsPerPage">' +
			'	<div class="text-center visible-sm"><uib-pagination boundary-links="true" total-items="totalItems" items-per-page="itemsPerPage" ng-model="currentPage" max-size="maxSizeSM" ng-click="pageChanged()" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;"></uib-pagination></div>' +
			'	<div class="text-center visible-md"><uib-pagination boundary-links="true" total-items="totalItems" items-per-page="itemsPerPage" ng-model="currentPage" max-size="maxSizeMD" ng-click="pageChanged()" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;"></uib-pagination></div>' +
			'	<div class="text-center visible-lg"><uib-pagination boundary-links="true" total-items="totalItems" items-per-page="itemsPerPage" ng-model="currentPage" max-size="maxSizeLG" ng-click="pageChanged()" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;"></uib-pagination></div>' +
			'</div>' +
			'<div class="col-lg-12 hidden-print visible-xs" ng-show="totalItems > itemsPerPage">' +
				'<uib-pager total-items="totalItems" ng-model="currentPage" previous-text="<< Anterior" next-text="Siguiente >>" ng-click="pageChanged()"></uib-pager>' +
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
		controller: 'buqueViajeCtrl'
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
		},
		controller: 'containerSumariaCtrl'
	}
});

myapp.directive('detalleManifiesto', function(){
	return {
		retrict:        'E',
		templateUrl:    'view/container.sumaria.manifiesto.html'
	}
});

myapp.directive('tableMissingGates', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/missing.gates.html',
		scope: {
			datoFaltante:	'=',
			savedState:		'='
		},
		controller:		'missingInfo'
	}
});

myapp.directive('tableMissingInvoices', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/missing.invoices.html',
		scope: {
			datoFaltante: '=',
			savedState:		'='
		},
		controller:		'missingInfo'
	}
});

myapp.directive('tableMissingAppointments', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/missing.appointments.html',
		scope: {
			datoFaltante: '=',
			savedState:		'='
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
			'<span class="hidden-print">{{ text | maxLength : max }}' +
			'	<a href ng-show="(text.length > max)" uib-popover="{{ text }}" popover-trigger="mouseenter"> (...)</a>' +
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

myapp.directive('toupper', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, modelCtrl) {
			var mayusculas = function(input) {
				input ? element.css("text-transform","uppercase") : element.css("text-transform","initial");
				return input ? input.toUpperCase() : "";
			};

			modelCtrl.$parsers.push(mayusculas);

			scope.$watch(attrs.ngModel, function(valor){
				mayusculas(valor);
			});

			//mayusculas();
		}
	};
});

myapp.directive('collap', function() {
	return {
		restrict: 'A',
		link: function(scope, element) {
			element.bind('click', function () {
				scope.isCollapsed = false;
			});
		}
	};
});

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
			'	<uib-accordion>' +
			'		<uib-accordion-group is-open="estado">' +
			'			<uib-accordion-heading>' +
			'				<strong>{{ heading }}</strong><i class="pull-right glyphicon" ng-class="{\'glyphicon-chevron-down\': estado, \'glyphicon-chevron-right\': !estado}"></i>' +
			'			</uib-accordion-heading>' +
			'			<div class="row">' +
			'				<div ng-transclude></div>' +
			'			</div>' +
			'		</uib-accordion-group>' +
			'	</uib-accordion>' +
			'</div>'
	}
}]);

myapp.directive('divCargando', function () {
	return {
		restrict:		'E',
		transclude:		true,
		scope: {
			mostrar:	'='
		},
		template:
			'<div class="col-lg-12 text-center" ng-show="mostrar">' +
			'	<img class="media-object center-block" src="images/loading.gif">' +
			'</div>' +
			'<div class="col-lg-12" ng-hide="mostrar">' +
			'	<div ng-transclude></div>' +
			'</div>'

	}
});

myapp.directive('buttonActualizar', ['$state', function ($state) {
	return {
		restrict:		'E',
		template:
			'<button class="btn btn-primary" ng-click="actualizar()"><span class="glyphicon glyphicon-refresh"></span></button>',
		link: function (scope) {
			scope.actualizar = function () {
				$state.reload();
			}
		}
	}
}]);

myapp.directive('tableSinLiquidar', ['dialogs', 'generalFunctions', function(dialogs, generalFunctions){
	return {
		restrict:		'E',
		templateUrl:	'view/table.sinLiquidar.html',
		scope: {
			payment:				"=",
			model:					"=",
			tasaAgp:				"=",
			ocultarFiltros:			"="
		},
		link: function(scope){
			scope.panelMensaje = {
				titulo: 'Liquidaciones',
				mensaje: 'No se encontraron comprobantes para los filtros seleccionados.',
				tipo: 'panel-info'
			};
			scope.cargando = false;
			//scope.byContainer = false;
			scope.itemsPerPage = 15;
			scope.currentPage = 1;
			scope.mostrarResultado = false;

			function loadInvoices(){
				var page = {
					skip: (scope.currentPage - 1) * scope.itemsPerPage,
					limit: scope.itemsPerPage
				};
				scope.cargando = true;
				scope.payment.getInvoices(page, function(success, err){
					scope.cargando = false;
					if (!success) {
						console.log(err);
						scope.panelMensaje = {
							titulo: 'Liquidaciones',
							mensaje: 'Se produjo un error al cargar los comprobantes.',
							tipo: 'panel-danger'
						};
					}
				})
			}

			scope.filter = function(filtro, contenido){
				if (filtro == 'date'){
					scope.model.fechaInicio = new Date(contenido);
					scope.model.fechaFin = new Date(contenido);
				} else {
					scope.model[filtro] = contenido;
				}
				scope.$emit('iniciarBusqueda', scope.model);
			};

			scope.changeView = function(){
				scope.payment.byContainer ? scope.totalCount = scope.payment.invoicesByContainer.totalCount : scope.totalCount = scope.payment.invoices.totalCount;
			};

			scope.cambioPagina = function(){
				loadInvoices();
			};

			scope.mostrarDetalle = function(invoice){
				scope.cargando = true;
				invoice.mostrarDetalle()
					.then(function(){
						//scope.model.invoiceSelected = invoice;
						//$scope.sinLiquidar.comprobantes = response.datosInvoices;
						//$scope.commentsInvoice = response.commentsInvoice;
						scope.verDetalle = invoice;
						scope.mostrarResultado = true;
						scope.cargando = false;
					}, function(error){
						console.log(error);
						dialogs.error('Liquidaciones', 'Se ha producido un error al cargar los datos del comprobante. ' + error.data.message);
						scope.cargando = false;
					});
			};

			scope.ordenar = function(filtro){
				scope.payment.searchParams = generalFunctions.filtrarOrden(scope.payment.searchParams, filtro);
				loadInvoices();
			};

			loadInvoices();
		}
	}
}]);

myapp.directive('tablePreLiquidacion', function(){
	return {
		restrict:		'E',
		scope: {
			cargando:			'=',
			datosPagos:			'=',
			pagoSelected:		'=',
			panelMensaje:		'=',
			detalle:			'&'
		},
		templateUrl:	'view/table.preLiquidacion.html'
	}
});

myapp.directive('tablePagos', function(){
	return {
		restrict:		'E',
		scope: {
			cargando:			'=',
			data:			'=',
			panelMensaje:		'=',
			detalle:			'&'
		},
		templateUrl:	'view/table.pagos.html',
		controller:		'tablaAnidadaCtrl'
	}
});

myapp.directive('detalleTransbordo', function(){
	return {
		restrict:		'E',
		scope: {
			data:			'='
		},
		templateUrl:	'view/detalleTransbordos.html',
		controller:		'tablaAnidadaCtrl'
	}
});

myapp.directive('liquidacionesSearch', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/accordion.liquidacion.search.html',
		scope: {
			model:					"=",
			ocultarFiltros:			"="
		},
		controller: 'searchController'
	}
});

myapp.directive('reporteEmpresasSearch', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/accordion.reporte.empresas.html',
		scope: {
			model:					"=",
			ranking:				"="
		},
		controller: 'searchController'
	}
});