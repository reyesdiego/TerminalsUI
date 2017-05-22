/**
 * Created by leo on 05/09/14.
 */

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
			'	<div class="text-center visible-sm"><ul uib-pagination boundary-links="true" total-items="totalItems" items-per-page="itemsPerPage" ng-model="currentPage" max-size="maxSizeSM" ng-click="pageChanged()" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;"></ul></div>' +
			'	<div class="text-center visible-md"><ul uib-pagination boundary-links="true" total-items="totalItems" items-per-page="itemsPerPage" ng-model="currentPage" max-size="maxSizeMD" ng-click="pageChanged()" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;"></ul></div>' +
			'	<div class="text-center visible-lg"><ul uib-pagination boundary-links="true" total-items="totalItems" items-per-page="itemsPerPage" ng-model="currentPage" max-size="maxSizeLG" ng-click="pageChanged()" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;"></ul></div>' +
			'</div>' +
			'<div class="col-lg-12 hidden-print visible-xs" ng-show="totalItems > itemsPerPage">' +
				'<ul uib-pager total-items="totalItems" ng-model="currentPage" previous-text="<< Anterior" next-text="Siguiente >>" ng-click="pageChanged()"></ul>' +
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

myapp.directive('textPop', function() {
	return {
		restrict:		'E',
		scope: {
			text:		'@',
			max:		'@'
		},
		template:
			'<span class="hidden-print">{{ text | maxLength : max }}' +
			'	<a href ng-show="(text.length > max)" uib-popover="{{ text }}" popover-trigger="\'mouseenter\'"> (...)</a>' +
			'</span>' +
			'<span class="visible-print">{{ text }}</span>'
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
			'		<div uib-accordion-group is-open="estado" class="panel-default">' +
			'			<uib-accordion-heading>' +
			'				<strong>{{ heading }}</strong><i class="pull-right glyphicon" ng-class="{\'glyphicon-chevron-down\': estado, \'glyphicon-chevron-right\': !estado}"></i>' +
			'			</uib-accordion-heading>' +
			'			<div class="row">' +
			'				<div ng-transclude></div>' +
			'			</div>' +
			'		</div>' +
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