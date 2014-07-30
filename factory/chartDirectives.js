/**
 * Created by Artiom on 28/04/14.
 */

myapp.directive('pieChart', function ($timeout) {
	return {
		restrict: 'EA',
		scope: {
			title:    '@title',
			width:    '@width',
			height:   '@height',
			data:     '=data',
			selectFn: '&select'
		},
		link: function ($scope, $elm) {

			// Create the data table and instantiate the chart
			var data = new google.visualization.DataTable();
			data.addColumn('string', 'Label');
			data.addColumn('number', 'Value');
			var chart = new google.visualization.PieChart($elm[0]);

			draw();

			// Watches, to refresh the chart when its data, title or dimensions change
			$scope.$watch('data', function() {
				draw();
			}, true); // true is for deep object equality checking
			$scope.$watch('title', function() {
				draw();
			});
			$scope.$watch('width', function() {
				draw();
			});
			$scope.$watch('height', function() {
				draw();
			});

			// Chart selection handler
			google.visualization.events.addListener(chart, 'select', function () {
				var selectedItem = chart.getSelection()[0];
				if (selectedItem) {
					$scope.$apply(function () {
						$scope.selectFn({selectedRowIndex: selectedItem.row});
					});
				}
			});

			function draw() {
				if (!draw.triggered) {
					draw.triggered = true;
					$timeout(function () {
						draw.triggered = false;
						var label, value;
						data.removeRows(0, data.getNumberOfRows());
						angular.forEach($scope.data, function(row) {
							label = row[0];
							value = parseFloat(row[1], 10);
							if (!isNaN(value)) {
								data.addRow([row[0], value]);
							}
						});
						var options = {
							'title': $scope.title,
							'width': $scope.width,
							'height': $scope.height,
							'backgroundColor': {'fill': 'transparent'}
						};
						chart.draw(data, options);
						// No raw selected
						$scope.selectFn({selectedRowIndex: undefined});
					}, 100, true);
				}
			}
		}
	};
});

myapp.directive('pieChart3d', function ($timeout) {
	return {
		restrict: 'EA',
		scope: {
			title:    '@title',
			width:    '@width',
			height:   '@height',
			data:     '=data',
			selectFn: '&select'
		},
		link: function ($scope, $elm) {

			// Create the data table and instantiate the chart
			var data = new google.visualization.DataTable();
			data.addColumn('string', 'Label');
			data.addColumn('number', 'Value');
			var chart = new google.visualization.PieChart($elm[0]);

			draw();

			// Watches, to refresh the chart when its data, title or dimensions change
			$scope.$watch('data', function() {
				draw();
			}, true); // true is for deep object equality checking
			$scope.$watch('title', function() {
				draw();
			});
			$scope.$watch('width', function() {
				draw();
			});
			$scope.$watch('height', function() {
				draw();
			});

			// Chart selection handler
			google.visualization.events.addListener(chart, 'select', function () {
				var selectedItem = chart.getSelection()[0];
				if (selectedItem) {
					$scope.$apply(function () {
						$scope.selectFn({selectedRowIndex: selectedItem.row});
					});
				}
			});

			function draw() {
				if (!draw.triggered) {
					draw.triggered = true;
					$timeout(function () {
						draw.triggered = false;
						var label, value;
						data.removeRows(0, data.getNumberOfRows());
						angular.forEach($scope.data, function(row) {
							label = row[0];
							value = parseFloat(row[1], 10);
							if (!isNaN(value)) {
								data.addRow([row[0], value]);
							}
						});
						var options = {
							'title': $scope.title,
							'width': $scope.width,
							'height': $scope.height,
							'backgroundColor': {'fill': 'transparent'},
							'is3D': true
						};
						chart.draw(data, options);
						// No raw selected
						$scope.selectFn({selectedRowIndex: undefined});
					}, 100, true);
				}
			}
		}
	};
});

myapp.directive('dynamicChart', function($timeout){
	return {
		restrict: 'E',
		scope: {
			title:    '@title',
			width:    '@width',
			height:   '@height',
			data:     '=data',
			selectFn: '&select',
			series:   '=series',
			colors:   '=colors',
			type:     '@type',
			stacked:  '=stacked',
			is3D:     '=is3D',
			currency: '=currency'
		},
		link: function ($scope, $elm) {

			var data; //= new google.visualization.arrayToDataTable($scope.data);
			var chart;

			switch ($scope.type){
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
			$scope.$watch('data', function() {
				draw();
			}, true); // true is for deep object equality checking
			$scope.$watch('title', function() {
				draw();
			});
			$scope.$watch('width', function() {
				draw();
			});
			$scope.$watch('height', function() {
				draw();
			});

			// Chart selection handler
			google.visualization.events.addListener(chart, 'select', function () {
				var selectedItem = chart.getSelection()[0];
				if (selectedItem) {
					$scope.$apply(function () {
						$scope.selectFn({selectedRowIndex: selectedItem.row});
					});
				}
			});

			function draw() {
				if (!draw.triggered) {
					draw.triggered = true;
					$timeout(function () {
						draw.triggered = false;
						if ($scope.type == 'pie'){
							var label, value;
							data.removeRows(0, data.getNumberOfRows());
							angular.forEach($scope.data, function(row) {
								label = row[0];
								value = parseFloat(row[1], 10);
								if (!isNaN(value)) {
									data.addRow([row[0], value]);
								}
							});
						}
						var options = {
							'title': $scope.title,
							'width': $scope.width,
							'height': $scope.height,
							'series': $scope.series,
							'backgroundColor': {'fill': 'transparent'},
							'animation':{
								duration: 1000,
								easing: 'out'
							},
							'legend': { position: 'top', maxLines: 3 },
							'bar': { groupWidth: '75%' },
							'is3D': $scope.is3D,
							'isStacked': $scope.stacked
						};
						if (!angular.equals($scope.colors, undefined)){
							options.colors = [$scope.colors.bactssa, $scope.colors.terminal4, $scope.colors.trp, 'green'];
						}
						if (!angular.equals($scope.stacked, undefined)){
							options.series = $scope.series;
						}
						if ($scope.type == 'column'){
							data = new google.visualization.arrayToDataTable($scope.data);
						}
						if ($scope.currency){
							options.vAxis= {format:'u$s###,###,###.##'};
							var formatter = new google.visualization.NumberFormat(
								{prefix: 'u$s', negativeColor: 'red', negativeParens: true});
							formatter.format(data, 1);
							if (!$scope.stacked){
								formatter.format(data, 2);
								formatter.format(data, 3);
								formatter.format(data, 4);
							}
						}
						chart.draw(data, options);
						// No raw selected
						$scope.selectFn({selectedRowIndex: undefined});
					}, 100, true);
				}
			}
		}
	};
});

myapp.directive('toupper', function() {
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
});