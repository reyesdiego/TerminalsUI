/**
 * Created by leo on 02/02/15.
 */

myapp.controller('usersCtrl', ['$scope', 'ctrlUsersFactory', 'dialogs', '$q', 'generalFunctions', function($scope, ctrlUsersFactory, dialogs, $q, generalFunctions) {
	$scope.permiso = false;
	$scope.datosUsers = [];
	$scope.panelMensaje = {
		tipo: 'panel-info',
		titulo: 'Control de usuarios',
		mensaje: 'No posee permisos para requerir estos datos.'
	};

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.cargando = false;
		$scope.panelMensaje = mensaje;
		$scope.permiso = false;
	});

	$scope.cargaUsuarios = function () {
		$scope.cargando = true;
		ctrlUsersFactory.getUsers(function(data) {
			console.log(data);
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
	};

	$scope.convertirIdAFecha = function(id) {
		return generalFunctions.idToDate(id);
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
			function() {
				dialogs.notify('Control de usuarios', 'Los datos se han guardado correctamente.');
			},
			function() {
				dialogs.error('Control de usuarios', 'Se ha producido un error al actualizar los datos.');
			});
	};

	$scope.cargaUsuarios();
}]);