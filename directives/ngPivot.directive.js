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

			let firstRender = true;
			// Build Pivot
			function render(){
				if (firstRender){
					chartLoader.then(() => {
						scope.options.renderers = $.extend($.pivotUtilities.locales.es.renderers, $.pivotUtilities.gchart_renderers);
					}).catch(() => {
						scope.options.renderers = $.pivotUtilities.locales.es.renderers;
					}).finally(() => {
						firstRender = false;
						if(scope.data.length > 0){
							element.pivotUI(scope.data, scope.options, true, 'es');
						}
					})
				} else {
					if(scope.data.length > 0){
						element.pivotUI(scope.data, scope.options, true, 'es');
					}
				}
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
			})

		}
	}
}]);