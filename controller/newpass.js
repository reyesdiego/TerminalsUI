/**
 * Created by Artiom on 11/03/14.
 */
(function() {
	myapp.controller('changePassCtrl', function($scope, userFactory, dialogs, $state) {
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
				if ($scope.codStatus == 'Password changed successfully'){
					var dl = dialogs.notify('Cambiar contraseña', 'La contraseña ha sido modificada con éxito.');
					dl.result.then(function(){
						$state.transitionTo('login');
					})
				}

			});

		}
	});
})();