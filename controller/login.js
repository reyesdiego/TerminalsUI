/**
 * Created by Diego Reyes on 1/23/14.
 */
myapp.controller('loginCtrl', ['$scope', '$state', 'loginService', 'authFactory', 'userFactory', 'dialogs', '$modal', function($scope, $state, loginService, authFactory, userFactory, dialogs, $modal) {
	'use strict';
	$scope.sesion = false;
	if (loginService.getStatus()){
		$state.transitionTo('tarifario');
	}

	$scope.login = function(){
		if ($scope.sesion){
			authFactory.loginWithCookies($scope.email, $scope.password);
		} else {
			authFactory.loginWithoutCookies($scope.email, $scope.password);
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
				console.log(data);
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