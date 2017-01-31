/**
 * Created by Artiom on 11/03/14.
 */

myapp.controller('changePassCtrl', ['authFactory', 'dialogs', '$state', function(authFactory, dialogs, $state) {
	'use strict';
	const vm = this;

	vm.changePass = function(){

		if (vm.newPass != vm.confirmPass){
			dialogs.notify('Cambiar contraseña', 'Las contraseñas no coinciden');
			return;
		}

		var formData = {
			"email": vm.email,
			"password": vm.password,
			"newPass": vm.newPass,
			"confirmPass": vm.confirmPass
		};

		authFactory.cambiarContraseña(formData, function(data){
			if (data.status === 'OK'){
				vm.codStatus = data.data;
				var dl = dialogs.notify('Cambio de contraseña', vm.codStatus);
				dl.result.then(function(){
					$state.transitionTo('login');
				})
			} else {
				dialogs.error('Cambio de contraseña', data.data);
			}

		});

	}
}]);