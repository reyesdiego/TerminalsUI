/**
 * Created by kolesnikov-a on 28/04/2017.
 */
myapp.directive('reporteEmpresasSearch', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/reportes/accordion.reporte.empresas.html',
		scope: {
			model:					"=",
			ranking:				"=",
			ocultarFiltros:			"="
		},
		controller: 'searchController'
	}
});

myapp.directive('reporteTarifasSearch', function(){
	return {
		restrict: 'E',
		templateUrl: 'view/reportes/accordion.reporte.tarifas.html'
	}
});

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

myapp.directive('pieChart', ['chartLoader', '$window', function(chartLoader, $window){
	return {
		restrict: 'E',
		scope: {
			data: '=',
			options: '=',
			click: '&'
		},
		link: function (scope, elm) {
			let selectedItem = undefined;

			scope.options.animation = {
				duration: 1000,
				easing: 'out'
			};
			scope.options.backgroundColor = {'fill': 'transparent'};
			scope.options.legend = { position: 'top', maxLines: 3 };
			scope.options.bar = { groupWidth: '75%' };
			scope.options.chartArea = { left: '10%', width: '90%' };
			scope.options.tooltip = {trigger: 'both'};
			scope.options.slices = {};

			chartLoader.then((Chart) => {

				scope.readyFn = () => {
					pieChart.chart.setSelection(selectedItem);

					pieChart.pngImg.then((img) => {
						scope.options.image = img;
					})
				};

				scope.selectFn = () => {
					selectedItem = pieChart.chart.getSelection();

					if(selectedSlice != -1){    // If we have a selection, unexplode it
						scope.options.slices[selectedSlice] = {offset:'0'};
						selectedSlice = -1;
					}

					if (selectedItem[0]){
						const rowNumber = parseInt(selectedItem[0].row);

						scope.options.slices[rowNumber] = {offset:'.2'};
						selectedSlice = rowNumber;
						//selectItem = true;

					}

					pieChart.drawChart(scope.data, scope.options);

					scope.click({selectedRow: selectedItem[0], id: scope.options.id});

				};

				let pieChart = new Chart('PIE', elm[0], scope.selectFn, scope.readyFn);
				let selectedSlice = -1;

				if (scope.data.length > 1){
					pieChart.drawChart(scope.data, scope.options);
				}

				scope.$watch('data', () => {
					if (scope.data.length > 1){
						pieChart.drawChart(scope.data, scope.options);
					}
				}, true);

				angular.element($window).on('resize', () => {
					scope.$apply(() => {
						pieChart.drawChart(scope.data, scope.options);
					})
				})

			})
		}
	}
}]);