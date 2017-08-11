/**
 * Created by kolesnikov-a on 08/05/2017.
 */
myapp.directive('ngPivot', ['chartLoader', '$window', function(chartLoader, $window){
	return {
		scope: {
			data: '=',
			options: '='
		},
		restrict: 'E',
		link: function(scope, element, attrs) {

			// Build Pivot
			function render(){

				chartLoader.then(() => {
					scope.options.renderers = $.extend($.pivotUtilities.locales.es.renderers, $.pivotUtilities.gchart_renderers, $.pivotUtilities.export_renderers);
				}).catch(() => {
					scope.options.renderers = $.extend($.pivotUtilities.locales.es.renderers, $.pivotUtilities.export_renderers);
				}).finally(() => {
					if(scope.data.length > 0){
						element.pivotUI(scope.data, scope.options, true, 'es');

						const renderer = angular.element("select.pvtRenderer").on('change', () => {
							scope.$apply(() => {
								scope.options.rendererName = renderer.val()
							});
						})
					}
				})

			}

			// Data binding
			scope.$watch('data', () => {
				// Reload pivot
				render();
			});

			angular.element($window).on('resize', () => {
				scope.$apply(() => {
					render();
				})
			});

		}
	}
}]);