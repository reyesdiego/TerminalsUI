/**
 * Created by Artiom on 11/03/14.
 */

function changePassCtrl ($scope, invoiceFactory) {
	'use strict';

	$scope.changePass = function(){

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