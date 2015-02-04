/**
 * Created by leo on 02/02/15.
 */
(function(){
	myapp.controller('usersCtrl', function($scope, ctrlUsersFactory, dialogs) {
		$scope.permiso = false;
		$scope.cargando = true;

		ctrlUsersFactory.getUsers(function(data) {
			if (data.status === 'OK'){
				$scope.permiso = true;
				$scope.datosUsers = data.data;
				$scope.datosUsers.forEach(function(user){
					if (user.status){
						user.claseFila = 'success';
					} else if (angular.isDefined(user.token) && user.token != null){
						user.claseFila = 'danger';
					} else {
						user.claseFila = 'warning';
					}
				})
			}
			$scope.cargando = false;
		});

		$scope.convertirIdAFecha = function(id) {
			return idToDate(id);
		};

		$scope.estaDefinido = function(data) {
			return angular.isDefined(data) && data != '';
		};

		$scope.cambiaUsuario = function(usuario, check) {
			if (check) {
				ctrlUsersFactory.userEnabled(usuario._id, function(data) {
					if (data.status == 'OK'){
						usuario.claseFila = 'success';
					} else {
						dialogs.error('Control de usuarios', 'Se ha producido un error al intentar habilitar el usuario.');
					}
				})
			} else {
				ctrlUsersFactory.userDisabled(usuario._id, function(data) {
					if (data.status == 'OK'){
						usuario.claseFila = 'danger';
					} else {
						dialogs.error('Control de usuarios', 'Se ha producido un error al intentar deshabilitar el usuario.');
					}
				})
			}
		}
	})
})();