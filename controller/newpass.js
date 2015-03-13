/**
 * Created by Artiom on 11/03/14.
 */

myapp.controller('changePassCtrl', ['$scope', 'userFactory', 'dialogs', '$state', function($scope, userFactory, dialogs, $state) {
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
			if (data.status === 'OK'){
				$scope.codStatus = data.data;
				var dl = dialogs.notify('Cambio de contraseña', $scope.codStatus);
				dl.result.then(function(){
					$state.transitionTo('login');
				})
			} else {
				dialogs.error('Cambio de contraseña', data.data);
			}

		});

	}
}]);