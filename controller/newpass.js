/**
 * Created by Artiom on 11/03/14.
 */

function changePassCtrl ($scope, userFactory, dialogs) {
	'use strict';

	$scope.changePass = function(){

		if ($scope.newPass != $scope.confirmPass){
			dialogs.notify('Cambiar contraseña', 'Las contraseñas no coinciden');
			return;
		}

		var formData = {
			"email": $scope.email,
			"password": $scope.password,
			"newPass": $scope.newPass,
			"confirmPass": $scope.confirmPass
		};

		userFactory.cambiarContraseña(formData, function(data){
			$scope.codStatus = data.data;
			dialogs.notify('Cambiar contraseña', 'La contraseña ha sido modificada con éxito.');
		});

	}

}