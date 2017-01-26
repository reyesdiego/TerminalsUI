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

	$scope.cargaUsuarios = function () {
		$scope.cargando = true;
		ctrlUsersFactory.getUsers(function(data) {
			if (data.status === 'OK'){
				$scope.permiso = true;
				$scope.datosUsers = data.data;
			}
			$scope.cargando = false;
		});
	};

	$scope.cambiaUsuario = function(usuario) {
		if (usuario.status && usuario.acceso.length == 0) {
			var dlg = dialogs.confirm("Control de usuario", "El usuario " + usuario.full_name + " no tiene ningún acceso definido. ¿Desea habilitarlo de todas formas?");
			dlg.result.then(function(){
				usuario.guardar = !usuario.guardar;
			},
			function(){
				usuario.status = false;
			})
		} else {
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

	$scope.guardar = function(){
		var llamadas = [];
		$scope.datosUsers.forEach(function(user){
			if (user.guardar){
				llamadas.push(user.guardarEstado());
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