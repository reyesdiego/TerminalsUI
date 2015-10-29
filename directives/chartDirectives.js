/**
 * Created by Artiom on 28/04/14.
 */

myapp.directive('dynamicChart', ['$timeout', function($timeout){
	return {
		restrict: 'E',
		scope: {
			chartObject:	'=',
			selectFn:		'&select',
			series:			'=',
			colors:			'='
		},
		link: function ($scope, $elm) {

			var data; //= new google.visualization.arrayToDataTable($scope.data);
			var chart;
			var prefijo;

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
				'isStacked': $scope.chartObject.stacked,
				'slices': {}
			};

			var selectedSlice = -1;
			var controlSelect;
			var selectItem = false;

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
			$scope.$watch('chartObject.data', function() {
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
				controlSelect = chart.getSelection();
				var selectedItem = chart.getSelection()[0];
				if (selectedItem) {
					if ($scope.chartObject.type == 'pie'){
						var rowNumber = parseInt(selectedItem.row);

						if(selectedSlice != -1){    // If we have a selection, unexplode it
							options.slices[selectedSlice] = {offset:'0'};
						}
						if(selectedSlice == rowNumber){ // If this is already selected, unselect it
							selectedSlice = -1;
						}else{  // else explode it
							options.slices[rowNumber] = {offset:'.2'};
							selectedSlice = rowNumber;
							selectItem = true;
						}

						chart.draw(data, options);
					}
					$scope.$apply(function () {
						$scope.selectFn({selectedRowIndex: selectedItem.row});
					});
				} else {
					if ($scope.chartObject.type == 'pie'){
						options.slices[selectedSlice] = {offset:'0'};
						selectedSlice = -1
						chart.draw(data, options);
					}
				}
			});

			google.visualization.events.addListener(chart, 'ready', function () {
				$scope.$apply(function(){
					if (selectItem){
						chart.setSelection(controlSelect);
						selectItem = false;
					}
					convertirPNGaJPG(chart.getImageURI(), function(jpgImg){
						$scope.chartObject.image = jpgImg;
					});
				});
			});

			function convertirPNGaJPG(base64Png, callback){
				var img = new Image();
				img.onload = function(){
					var canvas = document.createElement('CANVAS'),
						ctx = canvas.getContext('2d'), dataURL;
					canvas.height = this.height;
					canvas.width = this.width;
					ctx.fillStyle = 'white';
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(this, 0, 0);
					dataURL = canvas.toDataURL('image/jpeg');
					callback(dataURL);
					canvas = null;
				};
				img.src = base64Png;
			}

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
							options.tooltip = {trigger: 'selection'};
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