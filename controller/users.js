/**
 * Created by leo on 02/02/15.
 */
(function(){
	myapp.controller('usersCtrl', function($scope, ctrlUsersFactory) {
		$scope.permiso = false;
		$scope.cargando = true;

		ctrlUsersFactory.getUsers(function(data) {
			if (data.status === 'OK'){
				$scope.permiso = true;
				$scope.datosUsers = data.data;
			}
			$scope.cargando = false;
		});

		$scope.convertirIdAFecha = function(id) {
			return idToDate(id);
		};

		$scope.cambiaUsuario = function(id, check) {
			if (check) {
				ctrlUsersFactory.userEnabled(id, function(data) {
					console.log(data);
				})
			} else {
				ctrlUsersFactory.userDisabled(id, function(data) {
					console.log(data);
				})
			}
		}
	})
})();