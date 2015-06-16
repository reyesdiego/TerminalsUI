/**
 * Created by Diego Reyes on 1/23/14.
 */
myapp.controller('loginCtrl', ['$rootScope', '$scope', '$state', 'loginService', 'authFactory', 'userFactory', 'dialogs', '$modal', '$timeout', 'generalFunctions', function($rootScope, $scope, $state, loginService, authFactory, userFactory, dialogs, $modal, $timeout, generalFunctions) {
	'use strict';
	$scope.barType = "progress-bar-info";
	$scope.entrando = false;
	$scope.sesion = false;
	$scope.hayError = false;

	$scope.max = 130;

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
	$scope.porcentaje = 0;

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

	$scope.cerrarSesion = function(tipo){
		$rootScope.cargandoCache = false;
		if (tipo == 'normal'){
			$scope.mostrarMensaje = $scope.msg[5];
			authFactory.logout();
			$rootScope.esUsuario = '';
			$rootScope.filtroTerminal = '';
			$scope.volver();
		} else {
			$scope.hayError = true;
			$scope.barType = 'progress-bar-danger';
			$scope.mostrarMensaje = $scope.msg[4];
			authFactory.logout();
			$rootScope.esUsuario = '';
			$rootScope.filtroTerminal = '';
			$scope.volver();
		}
	};

	$scope.volver = function(){
		$timeout(function(){
			if ($scope.progreso > 0){
				$scope.progreso -= 10;
				$scope.porcentaje = ($scope.progreso * 100 / $scope.max).toFixed();
				$scope.mostrarMensaje = $scope.msg[5];
				$scope.volver();
			} else {
				$scope.entrando = false;
				$scope.hayError = false;
			}
		}, 1000);
	};

	$scope.login = function(){
		$scope.barType = "progress-bar-info";
		$scope.mostrarMensaje = $scope.msg[0];
		$scope.entrando = true;
		$rootScope.cargandoCache = true;
		if ($scope.sesion){
			authFactory.loginWithCookies($scope.email, $scope.password)
				.then(function(result){
					$rootScope.cargandoCache = false;
					$state.transitionTo('tarifario');
				},
				function(error){
					if (error == 'sinAcceso'){
						var errdlg = dialogs.error("Error de acceso", "Su usuario ha sido aprobado, pero aún no se le han asignado permisos a las diferentes partes de la aplicación. Por favor, vuelva a intentarlo más tarde.");
						errdlg.result.then(function(){
							$scope.cerrarSesion('normal');
						})
					} else {
						if ($scope.progreso > 10){
							var dlg = dialogs.confirm('Error', 'Se producido un error al cargar los datos, puede que alguna funcionalidad de la aplicación no esté disponible. ¿Desea ingresar a la aplicación de todos modos?');
							dlg.result.then(function(){
									$rootScope.cargandoCache = false;
									$state.transitionTo('tarifario');
								},
								function(){
									$scope.cerrarSesion();
								})
						} else {
							$scope.cerrarSesion();
						}
					}
				});
		} else {
			authFactory.loginWithoutCookies($scope.email, $scope.password)
				.then(function(result){
					$rootScope.cargandoCache = false;
					$state.transitionTo('tarifario');
				},
				function(reason){
					if (reason == 'sinAcceso'){
						var errdlg = dialogs.error("Error de acceso", "Su usuario ha sido aprobado, pero aún no se le han asignado permisos a las diferentes partes de la aplicación. Por favor, vuelva a intentarlo más tarde.");
						errdlg.result.then(function(){
							$scope.cerrarSesion('normal');
						})
					} else {
						if ($scope.progreso > 10){
							var dlg = dialogs.confirm('Error', 'Se producido un error al cargar los datos, puede que alguna funcionalidad de la aplicación no esté disponible. ¿Desea ingresar a la aplicación de todos modos?');
							dlg.result.then(function(){
									$rootScope.cargandoCache = false;
									$state.transitionTo('tarifario');
								},
								function(){
									$scope.cerrarSesion();
								})
						} else {
							$scope.cerrarSesion();
						}
					}
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