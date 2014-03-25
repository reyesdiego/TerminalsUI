/**
 * Created by Artiom on 11/03/14.
 */

function changePassCtrl ($scope, $http, $dialogs) {
	'use strict';

	$scope.changePass = function(){

		if ($scope.newPass != $scope.confirmPass){
			$dialogs.notify("Cambiar contraseña","Las contraseñas no coinciden");
			return;
		}

		var formData = {
			"email": $scope.email,
			"password": $scope.password,
			"newPass": $scope.newPass,
			"confirmPass": $scope.confirmPass
		};

		var inserturl = serverUrl + '/agp/password';
		$http({
			method: 'PUT',
			url: inserturl,
			data: formData
		}).success(function(response) {
				console.log("success");
				$scope.codeStatus = response.data;
				console.log($scope.codeStatus);
				$dialogs.notify("Cambiar contraseña","La contraseña ha sido modificada con éxito.");

			}).error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
				$dialogs.error('Se ha producido un error al intentar cambiar la contraseña. Inténtelo nuevamente más tarde.');
			});

	}

}