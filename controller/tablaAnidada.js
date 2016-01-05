/**
 * Created by artiom on 05/01/16.
 */
myapp.controller('tablaAnidadaCtrl', ['$scope', function($scope){

	$scope.tableRowExpanded = false;
	$scope.tableRowIndexExpandedCurr = "";
	$scope.tableRowIndexExpandedPrev = "";
	$scope.dataIdExpanded = "";

	$scope.dataCollapseFn = function () {
		$scope.dataCollapse = [];
		for (var i = 0; i < $scope.data.length; i += 1) {
			$scope.dataCollapse.push(false);
		}
	};

	$scope.selectTableRow = function (index, dataId) {
		if (typeof $scope.dataCollapse === 'undefined') {
			$scope.dataCollapseFn();
		}

		if ($scope.tableRowExpanded === false && $scope.tableRowIndexExpandedCurr === "" && $scope.dataIdExpanded === "") {
			$scope.tableRowIndexExpandedPrev = "";
			$scope.tableRowExpanded = true;
			$scope.tableRowIndexExpandedCurr = index;
			$scope.dataIdExpanded = dataId;
			$scope.dataCollapse[index] = true;
		} else if ($scope.tableRowExpanded === true) {
			if ($scope.tableRowIndexExpandedCurr === index && $scope.dataIdExpanded === dataId) {
				$scope.tableRowExpanded = false;
				$scope.tableRowIndexExpandedCurr = "";
				$scope.dataIdExpanded = "";
				$scope.dataCollapse[index] = false;
			} else {
				$scope.tableRowIndexExpandedPrev = $scope.tableRowIndexExpandedCurr;
				$scope.tableRowIndexExpandedCurr = index;
				$scope.dataIdExpanded = dataId;
				$scope.dataCollapse[$scope.tableRowIndexExpandedPrev] = false;
				$scope.dataCollapse[$scope.tableRowIndexExpandedCurr] = true;
			}
		}
	};

}]);
