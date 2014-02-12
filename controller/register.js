/**
 * Created by Diego Reyes on 1/23/14.
 */
function registerCtrl($scope, $http, $templateCache){
	'use strict'

	$scope.register = function(){

		var formData = {
			"full_name": $scope.full_name,
			"email": $scope.email,
			"password": $scope.password,
			"terminal": $scope.terminal
		};

		var inserturl = serverUrl + '/agp/register';
		$http({
			method: 'POST',
			url: inserturl,
			data: formData,
			cache: $templateCache
		}).success(function(response) {
				console.log("success");
				$scope.codeStatus = response.data;
				console.log($scope.codeStatus);

			}).error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

	}

}
