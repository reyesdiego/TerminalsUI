/**
 * Created by Diego Reyes on 1/23/14.
 */
myapp.controller('loginCtrl', ['$rootScope', '$scope', '$state', 'loginService', 'authFactory', 'userFactory', 'dialogs', '$modal', function($rootScope, $scope, $state, loginService, authFactory, userFactory, dialogs, $modal) {
	'use strict';
	$scope.entrando = false;
	$scope.sesion = false;

	$scope.max = 100;

	$scope.progreso = 0;
	$scope.msg = [
		'Autenticando...',
		'Sesión iniciada',
		'Cargando datos de la aplicación...',
		'Finalizando'
	];
	$scope.mostrarMensaje = $scope.msg[0];

	if (loginService.getStatus()){
		$state.transitionTo('tarifario');
	}

	$scope.$on('progreso', function(e, mensaje){
		$scope.mostrarMensaje = $scope.msg[mensaje.mensaje];
		$scope.progreso += 10;
		if ($scope.progreso >= 80){
			$scope.mostrarMensaje = $scope.msg[3];
		}
	});

	$scope.login = function(){
		$scope.entrando = true;
		if ($scope.sesion){
			authFactory.loginWithCookies($scope.email, $scope.password)
				.then(function(result){
					$state.transitionTo('tarifario');
				});
		} else {
			authFactory.loginWithoutCookies($scope.email, $scope.password)
				.then(function(result){
					$state.transitionTo('tarifario');
				});
		}
	};

	$scope.resetPassword = function(){
		var modalInstance = $modal.open({
			templateUrl: 'view/resetPassword.dialog.html',
			controller: 'resetPasswordDialogCtrl',
			backdrop: 'static'
		});
		modalInstance.result.then(function(email){
			userFactory.resetPassword(email, function(data){
				if (data.status == 'OK'){
					dialogs.notify('Recuperación de contraseña', 'Solicitud enviada correctamente. En breve recibirá un correo en la dirección indicada con su nueva contraseña.');
				} else {
					console.log(data);
					dialogs.error('Error', 'No se ha encontrado una cuenta asociada a la dirección enviada.')
				}
			})
		});
	}
}]);