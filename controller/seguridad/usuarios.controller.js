/**
 * Created by leo on 02/02/15.
 */

myapp.controller('usersCtrl', ['$rootScope', '$scope', 'ctrlUsersFactory', 'dialogs', '$q', '$state', function($rootScope, $scope, ctrlUsersFactory, dialogs, $q, $state) {

	$scope.$on('socket:loggedIn', (event, data) => {
		$scope.datosUsers.forEach((user) => {
			if (user.user == data.user) user.online = true;
		})
	});

	$scope.$on('socket:loggedOff', (event, data) => {
		$scope.datosUsers.forEach((user) => {
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

	$scope.$on('errorInesperado', (e, mensaje) => {
		$scope.cargando = false;
		$scope.panelMensaje = mensaje;
		$scope.permiso = false;
	});

	 function cargaUsuarios() {
		$scope.cargando = true;
		ctrlUsersFactory.getUsers((data) => {
			if (data.status === 'OK'){
				$scope.permiso = true;
				$scope.datosUsers = data.data;
			}
			$scope.cargando = false;
		});
	}

	$scope.cambiaUsuario = function(usuario) {
		if (usuario.status && usuario.acceso.length == 0) {
			const dlg = dialogs.confirm("Control de usuario", "El usuario " + usuario.full_name + " no tiene ningún acceso definido. ¿Desea habilitarlo de todas formas?");
			dlg.result.then(() => {
				usuario.guardar = !usuario.guardar;
			}).catch(() => {
				usuario.status = false;
			})
		} else {
			usuario.guardar = !usuario.guardar;
		}
	};

	$scope.disableButton = function(){
		if ($scope.datosUsers.length > 0){
			let i = 0;
			$scope.datosUsers.forEach((usuario) => {
				if (usuario.guardar){
					i++
				}
			});
			return i == 0;
		} else {
			return true;
		}
	};

	$scope.actualizar = function(){
		$state.reload();
	};

	$scope.guardar = function(){
		let llamadas = [];
		$scope.datosUsers.forEach((user) => {
			if (user.guardar){
				llamadas.push(user.guardarEstado());
			}
		});
		$q.all(llamadas).then(() => {
			dialogs.notify('Control de usuarios', 'Los datos se han guardado correctamente.');
		}).catch(() => {
			dialogs.error('Control de usuarios', 'Se ha producido un error al actualizar los datos.');
		});
	};

	cargaUsuarios();
}]);