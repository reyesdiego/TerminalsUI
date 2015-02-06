/**
 * Created by leo on 02/02/15.
 */
(function(){
	myapp.controller('usersCtrl', function($scope, ctrlUsersFactory, dialogs, $q) {
		$scope.permiso = false;
		$scope.cargando = true;
		$scope.datosUsers = [];

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
				usuario.claseFila = 'success';
			} else {
				usuario.claseFila = 'danger';
			}
			usuario.status = check;
			usuario.guardar = !usuario.guardar;
		};

		$scope.disableButton = function(){
			if ($scope.datosUsers.length > 0){
				var i = 0;
				$scope.datosUsers.forEach(function(usuario){
					if (usuario.guardar){
						i++
					}
				});
				return i == 0;
			} else {
				return true;
			}
		};

		$scope.guardarCambiosUsuario = function(usuario){
			var deferred = $q.defer();
			if (usuario.status) {
				ctrlUsersFactory.userEnabled(usuario._id, function(data) {
					if (data.status == 'OK'){
						usuario.claseFila = 'success';
						deferred.resolve(data);
					} else {
						deferred.reject(data);
					}
					usuario.guardar = false;
				})
			} else {
				ctrlUsersFactory.userDisabled(usuario._id, function(data) {
					if (data.status == 'OK'){
						usuario.claseFila = 'danger';
						deferred.resolve(data);
					} else {
						deferred.reject(data);
					}
					usuario.guardar = false;
				})
			}
			return deferred.promise;
		};

		$scope.guardar = function(){
			var llamadas = [];
			$scope.datosUsers.forEach(function(user){
				if (user.guardar){
					llamadas.push($scope.guardarCambiosUsuario(user));
				}
			});
			$q.all(llamadas)
				.then(
				function(results) {
					dialogs.notify('Control de usuarios', 'Los datos se han guardado correctamente.');
				},
				function(errors) {
					dialogs.error('Control de usuarios', 'Se ha producido un error al actualizar los datos.');
				});
		}
	})
})();