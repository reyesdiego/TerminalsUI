/**
 * Created by leo on 02/02/15.
 */

myapp.controller('usersCtrl', ['$rootScope', '$scope', 'ctrlUsersFactory', 'dialogs', '$q', 'generalFunctions', function($rootScope, $scope, ctrlUsersFactory, dialogs, $q, generalFunctions) {

	$scope.$on('socket:loggedIn', function(event, data){
		$scope.datosUsers.forEach(function(user){
			if (user.user == data.user) user.online = true;
		})
	});

	$scope.$on('socket:loggedOff', function(event, data){
		$scope.datosUsers.forEach(function(user){
			if (user.user == data.user) user.online = false;
		})
	});

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

	$scope.ultimaConexion = function (fecha) {
		var ultimaConex = new Date(fecha);
		var fechaActual = new Date();
		ultimaConex.setHours(0, 0, 0, 0);
		fechaActual.setHours(0, 0, 0, 0);
		var claseColor = '';
		if (parseInt(Math.abs(fechaActual.getTime() - ultimaConex.getTime()) / (24 * 60 * 60 * 1000), 10) <= 2) {
			claseColor = 'usuarioActivo';
		} else if (parseInt(Math.abs(fechaActual.getTime() - ultimaConex.getTime()) / (24 * 60 * 60 * 1000), 10) > 2 && parseInt(Math.abs(fechaActual.getTime() - ultimaConex.getTime()) / (24 * 60 * 60 * 1000), 10) <= 5) {
			claseColor = 'usuarioRegular';
		} else {
			claseColor = 'usuarioInactivo';
		}
		return claseColor;
	};

	$scope.cargaUsuarios = function () {
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
	};

	$scope.convertirIdAFecha = function(id) {
		return generalFunctions.idToDate(id);
	};

	$scope.estaDefinido = function(data) {
		return angular.isDefined(data) && data != '';
	};

	$scope.cambiaUsuario = function(usuario) {
		if (usuario.status && usuario.acceso.length == 0) {
			var dlg = dialogs.confirm("Control de usuario", "El usuario " + usuario.full_name + " no tiene ningún acceso definido. ¿Desea habilitarlo de todas formas?");
			dlg.result.then(function(){
				usuario.claseFila = 'success';
				usuario.guardar = !usuario.guardar;
			},
			function(){
				usuario.status = false;
			})
		} else {
			usuario.claseFila = 'danger';
			usuario.guardar = !usuario.guardar;
		}
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