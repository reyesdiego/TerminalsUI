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
				var pos = $scope.comprobantesVistos.indexOf(comprobante);
				$scope.comprobantesVistos.splice(pos, 1);
			};
		}
	}
});

myapp.directive('accordionInvoicesSearch', ['generalCache', 'contenedoresCache', function(generalCache, contenedoresCache){
	return {
		restrict:		'E',
		templateUrl:	'view/accordion.invoices.search.html',
		link: function ($scope) {
			$scope.listaRazonSocial = generalCache.get('clientes');
			$scope.listaContenedores = [];//contenedoresCache.get('contenedores');
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

myapp.directive('containersGatesSearch', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/accordion.gates.search.html'
	}
});

myapp.directive('accordionTurnosSearch', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/accordion.turnos.search.html'
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
				$scope.$emit('cambioPagina', $scope.currentPage);
			};
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
		scope: {
			model:			'=',
			ocultarFiltros:	'='
		},
		controller: 'searchController',
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
			'<span class="hidden-print">{{ text | maxLength : max }}' +
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

myapp.directive('tableLiquidaciones', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/table.liquidaciones.html'
	}
});

myapp.directive('tablePagos', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/table.pagos.html'
	}
});

myapp.directive('liquidacionesSearch', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/accordion.liquidacion.search.html',
		scope: {
			model:					"=",
			ocultarLiquidacion:		"@"
		},
		controller: 'searchController'
	}
});