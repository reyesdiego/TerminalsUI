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
			controlCodigos:						'&',
			codigosSinAsociar:					'=',
			mostrarPtosVenta:					'=',
			ocultarAccordionInvoicesSearch:		'=',
			ocultarAccordionComprobantesVistos:	'=',
			panelMensaje:						'=',
			volverAPrincipal:					'=',
			filtroEstados:						'@'
		},
		controller: 'vistaComprobantesCtrl'
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
		templateUrl:	'view/accordion.gates.search.html'
	}
}]);

myapp.directive('accordionTurnosSearch', [function(){
	return {
		restrict:		'E',
		templateUrl:	'view/accordion.turnos.search.html'
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
			'	<img class="media-object imagenCargando" style="margin-left: 40%; margin-top: 50px">' +
			'</div>' +
			'<div class="col-lg-12" ng-hide="mostrar">' +
			'	<div ng-transclude></div>' +
			'</div>'

	}
}]);