/**
 * Created by Diego Reyes on 1/23/14.
 */
myapp.controller('loginCtrl', ['$state', 'loginService', 'authFactory', 'dialogs', '$uibModal', 'generalFunctions',
	function($state, loginService, authFactory, dialogs, $uibModal, generalFunctions) {
		'use strict';
		const vm = this;

		function cerrarSesion(){
			authFactory.logout();
			vm.entrando = false;
		}

		function errorHandler(error){
			let errdlg;
			if (error.code == 'ACC-0010'){
				errdlg = dialogs.error("Error de acceso", "Su usuario ha sido aprobado, pero aún no se le han asignado permisos a las diferentes partes de la aplicación. Por favor, vuelva a intentarlo más tarde.");
				errdlg.result.then(() => {
					cerrarSesion();
				});
			} else if (error.code == 'ACC-0003') {
				$state.transitionTo('validar');
			} else if (error.code == 'ACC-0001' || error.code == 'ACC-0002' || error.code == 'ACC-0004') {
				errdlg = dialogs.error("Error de acceso", error.message);
				errdlg.result.then(() => {
					cerrarSesion();
				});
			}
		}

		vm.entrando = false;

		vm.email = '';
		vm.password = '';
		vm.sesion = true;

		if (loginService.isLoggedIn){
			if (generalFunctions.in_array('tarifario', loginService.acceso)){
				$state.transitionTo('tarifario');
			} else {
				$state.transitionTo(loginService.acceso[0])
			}
		}

		vm.login = () => {
			vm.entrando = true;
			authFactory.userEnter(vm.email, vm.password, vm.sesion).then((result) => {
				//$rootScope.socket.emit('login', result.user); //TODO incluir esto en el authfactory
				if (generalFunctions.in_array('tarifario', loginService.acceso)) {
					$state.transitionTo('tarifario');
				} else {
					$state.transitionTo(loginService.acceso[0])
				}
			}).catch((error) => {
				errorHandler(error);
			});
		};

		vm.resetPassword = () => {
			const modalInstance = $uibModal.open({
				templateUrl: 'view/login/reset.password.modal.html',
				controller: 'resetPasswordDialogCtrl',
				backdrop: 'static'
			});
			modalInstance.result.then((email) => {
				authFactory.resetPassword(email, (data) => {
					if (data.status == 'OK'){
						dialogs.notify('Recuperación de contraseña', 'Solicitud enviada correctamente. En breve recibirá un correo en la dirección indicada con su nueva contraseña.');
					} else {
						//console.log(data);
						dialogs.error('Error', 'No se ha encontrado una cuenta asociada a la dirección enviada.')
					}
				})
			});
		}
	}]);