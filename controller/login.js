/**
 * Created by Diego Reyes on 1/23/14.
 */
myapp.controller('loginCtrl', ['$rootScope', '$scope', '$state', 'loginService', 'authFactory', 'userFactory', 'dialogs', '$modal', '$timeout', function($rootScope, $scope, $state, loginService, authFactory, userFactory, dialogs, $modal, $timeout) {
	'use strict';
	$scope.barType = "progress-bar-info";
	$scope.entrando = false;
	$scope.sesion = false;
	$scope.hayError = false;

	$scope.max = 120;

	$scope.progreso = 0;
	$scope.msg = [
		'Autenticando...',
		'Sesión iniciada',
		'Cargando datos de la aplicación...',
		'Finalizando',
		'Se ha producido un error...',
		'Cerrando sesión'
	];
	$scope.mostrarMensaje = $scope.msg[0];

	if (loginService.getStatus()){
		$state.transitionTo('tarifario');
	}

	$scope.$on('progreso', function(e, mensaje){
		if (!$scope.hayError){
			$scope.mostrarMensaje = $scope.msg[mensaje.mensaje];
			$scope.progreso += 10;
			$scope.porcentaje = ($scope.progreso * 100 / $scope.max).toFixed();
			if ($scope.porcentaje >= 80){
				$scope.mostrarMensaje = $scope.msg[3];
			}
		}
	});

	$scope.cerrarSesión = function(){
		$scope.hayError = true;
		$scope.barType = 'progress-bar-danger';
		$scope.mostrarMensaje = $scope.msg[4];
		authFactory.logout();
		$rootScope.esUsuario = '';
		loginService.unsetLogin();
		$rootScope.filtroTerminal = '';
		$rootScope.switchTheme('BACTSSA');
		$scope.volver();
	};

	$scope.volver = function(){
		$timeout(function(){
			if ($scope.progreso > 0){
				$scope.progreso -= 10;
				$scope.mostrarMensaje = $scope.msg[5];
				$scope.volver();
			} else {
				$scope.entrando = false;
				$scope.hayError = false;
			}
		}, 1000);
	};

	$scope.login = function(){
		$scope.entrando = true;
		if ($scope.sesion){
			authFactory.loginWithCookies($scope.email, $scope.password)
				.then(function(result){
					$state.transitionTo('tarifario');
				},
				function(){
					$scope.cerrarSesión();
				});
		} else {
			authFactory.loginWithoutCookies($scope.email, $scope.password)
				.then(function(result){
					$state.transitionTo('tarifario');
				},
				function(){
					$scope.cerrarSesión();
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