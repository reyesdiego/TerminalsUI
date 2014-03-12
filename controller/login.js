/**
 * Created by Diego Reyes on 1/23/14.
 */
function loginCtrl($scope, $http, $templateCache){
	'use strict'

	$scope.register = function(){

		var formData = {
			"email": $scope.email,
			"password": $scope.password
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
