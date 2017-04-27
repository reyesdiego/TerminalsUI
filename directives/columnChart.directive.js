/**
 * Created by kolesnikov-a on 14/03/2017.
 */
myapp.directive('columnChart', ['chartLoader', '$window', function(chartLoader, $window){
	return {
		restrict: 'E',
		scope: {
			data: '=',
			options: '=',
			click: '&'
		},
		link: function (scope, elm) {

			scope.options.animation = {
				duration: 1000,
				easing: 'out'
			};
			scope.options.backgroundColor = {'fill': 'transparent'};
			scope.options.legend = { position: 'top', maxLines: 3 };
			scope.options.bar = { groupWidth: '75%' };
			scope.options.chartArea = { left: '10%', width: '90%' };
			scope.options.tooltip = {trigger: 'both'};

			chartLoader.then((Chart) => {

				scope.readyFn = () => {
					chartCtrl.pngImg.then((img) => {
						scope.options.image = img;
					})
				};

				scope.selectFn = () => {
					let selectedItem = chartCtrl.chart.getSelection()[0];
					scope.click({selectedRow: selectedItem, id: scope.options.id});
				};

				let chartCtrl = new Chart('COLUMN', elm[0], scope.selectFn, scope.readyFn);

				if (scope.data.length > 1){
					chartCtrl.drawChart(scope.data, scope.options);
				}

				scope.$watch('data', () => {
					if (scope.data.length > 1){
						chartCtrl.drawChart(scope.data, scope.options);
					}
				}, true);

				scope.$watch('options', () => {
					if (scope.data.length > 1){
						chartCtrl.drawChart(scope.data, scope.options);
					}
				}, true);

				angular.element($window).on('resize', () => {
					scope.$apply(() => {
						chartCtrl.drawChart(scope.data, scope.options);
					})
				})

			})
		}
	}
}]);