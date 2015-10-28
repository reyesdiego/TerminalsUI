/**
 * Created by Artiom on 28/04/14.
 */

myapp.directive('dynamicChart', ['$timeout', function($timeout){
	return {
		restrict: 'E',
		scope: {
			chartObject:	'=',
			selectFn:		'&',
			series:			'=',
			colors:			'='
		},
		link: function ($scope, $elm) {

			var data; //= new google.visualization.arrayToDataTable($scope.data);
			var chart;
			var prefijo;

			switch ($scope.chartObject.type){
				case 'column':
					chart = new google.visualization.ColumnChart($elm[0]);
					break;
				case 'pie':
					data = new google.visualization.DataTable();
					data.addColumn('string', 'Label');
					data.addColumn('number', 'Value');
					chart = new google.visualization.PieChart($elm[0]);
					break;
			}

			draw();

			// Watches, to refresh the chart when its data, title or dimensions change
			$scope.$watch('chartObject', function() {
				draw();
			}, true); // true is for deep object equality checking
			/*$scope.$watch('title', function() {
				draw();
			});
			$scope.$watch('width', function() {
				draw();
			});
			$scope.$watch('height', function() {
				draw();
			});*/

			// Chart selection handler
			google.visualization.events.addListener(chart, 'select', function () {
				var selectedItem = chart.getSelection()[0];
				if (selectedItem) {
					$scope.$apply(function () {
						$scope.selectFn({selectedRowIndex: selectedItem.row});
					});
				}
			});

			google.visualization.events.addListener(chart, 'ready', function () {
				$scope.$apply(function(){
					$scope.chartObject.image = chart.getImageURI();
				});
			});

			function draw() {
				if (!draw.triggered) {
					draw.triggered = true;
					$timeout(function () {
						draw.triggered = false;
						switch ($scope.chartObject.money){
							case 'PES':
								prefijo = 'AR$ ';
								break;
							case 'DOL':
								prefijo = 'US$ ';
								break;
						}
						if ($scope.chartObject.type == 'pie'){
							var label, value;
							data.removeRows(0, data.getNumberOfRows());
							angular.forEach($scope.chartObject.data, function(row) {
								label = row[0];
								value = parseFloat(row[1], 10);
								if (!isNaN(value)) {
									data.addRow([row[0], value]);
								}
							});
						}
						var options = {
							'title': $scope.chartObject.title,
							'width': $scope.chartObject.width,
							'height': $scope.chartObject.height,
							'series': $scope.chartObject.series,
							'backgroundColor': {'fill': 'transparent'},
							'animation':{
								duration: 1000,
								easing: 'out'
							},
							'legend': { position: 'top', maxLines: 3 },
							'bar': { groupWidth: '75%' },
							'is3D': $scope.chartObject.is3D,
							'isStacked': $scope.chartObject.stacked
						};
						if (!angular.equals($scope.colors, undefined)){
							options.colors = [$scope.colors.bactssa, $scope.colors.terminal4, $scope.colors.trp, 'green'];
						}
						if (!angular.equals($scope.chartObject.stacked, undefined)){
							options.series = $scope.chartObject.series;
						}
						if ($scope.chartObject.type == 'column'){
							data = new google.visualization.arrayToDataTable($scope.chartObject.data);
						}
						if ($scope.chartObject.currency){
							options.vAxis= {format:prefijo + '###,###,###.##'};
							var formatter = new google.visualization.NumberFormat(
								{prefix: prefijo, negativeColor: 'red', negativeParens: true});
							formatter.format(data, 1);
							if (!$scope.chartObject.stacked){
								for (var i=2; i<=$scope.chartObject.columns; i++)
									formatter.format(data, i);
							}
						}
						chart.draw(data, options);
						// No raw selected
						$scope.selectFn({selectedRowIndex: undefined});
					}, 100, true)
				}
			}
		}
	};
}]);