/**
 * Created by artiom on 13/05/15.
 */

myapp.controller('accessControlCtrl', ['$scope','$rootScope', 'ctrlUsersFactory', 'dialogs', '$q', 'loginService', function($scope, $rootScope, ctrlUsersFactory, dialogs, $q, loginService){

	$scope.usuarios = [];
	$scope.tareas = [];
	$scope.cargaRutas = true;
	$scope.usuarioElegido = undefined;

	$scope.currentPage = 1;
	$scope.itemsPerPage = 10;

	$scope.rutasUsuario = [];
	$scope.rutasUsuarioOriginal = [];

	$scope.modo = 'tareas';

	$scope.notificaciones = [
		{ description: 'Nuevo usuario', habilitar: false},
		{ description: 'Nueva tarifa', habilitar: false},
		{ description: 'Baja del servicio', habilitar: false}
	];

	$scope.panelMensaje = {
		titulo: 'Control de acceso',
		mensaje: 'No se han encontrado tareas.',
		tipo: 'panel-info'
	};

	ctrlUsersFactory.getUsers(function(data){
		if (data.status == 'OK'){
			$scope.usuarios = data.data;
			ctrlUsersFactory.getRoutes(function(data){
				if (data.status == 'OK'){
					$scope.tareas = data.data;
				} else {
					$scope.panelMensaje.mensaje = 'Se ha producido un error al cargar el listado de tareas.';
					$scope.panelMensaje.tipo = 'panel-danger';
					$scope.usuarios = [];
					$scope.tareas = [];
				}
				$scope.cargaRutas = false;
			})
		} else {
			$scope.panelMensaje.mensaje = 'Se ha producido un error al cargar el listado de usuarios.';
			$scope.panelMensaje.tipo = 'panel-danger';
			$scope.usuarios = [];
			$scope.tareas = [];
		}
	});

	$scope.cambioModo = function(modo){
		$scope.modo = modo;
	};

	$scope.chequearRuta = function(ruta){
		var indice = $scope.rutasUsuario.indexOf(ruta.route);
		var partesRuta = ruta.route.split('.');
		if (indice >= 0){
			$scope.rutasUsuario.splice(indice, 1);
			$scope.quitarHijos(ruta);
		} else {
			$scope.rutasUsuario.push(ruta.route);
			if (partesRuta.length > 1){
				var rutaPadre;
				rutaPadre = partesRuta[0];
				if (partesRuta.length > 2){
					rutaPadre += '.' + partesRuta[1];
				}
				$scope.agregarPadres(rutaPadre);
			}
		}
	};

	$scope.agregarPadres = function(ruta){
		if ($scope.rutasUsuario.indexOf(ruta) == -1){
			$scope.rutasUsuario.push(ruta);
			$scope.tareas.forEach(function(unaTarea){
				if (unaTarea.route == ruta) unaTarea.acceso = true
			})
		}

		var partesRuta = ruta.split('.');
		if (partesRuta.length > 1){
			var rutaPadre = partesRuta[0];
			$scope.agregarPadres(rutaPadre);
		}

	};

	$scope.quitarHijos = function(ruta){
		for(var i = $scope.rutasUsuario.length; i--;) {
			if($scope.rutasUsuario[i].indexOf(ruta.route + '.') >= 0) {
				$scope.tareas.forEach(function(unaTarea){
					if (unaTarea.route == $scope.rutasUsuario[i]) unaTarea.acceso = false;
				});
				$scope.rutasUsuario.splice(i, 1);
			}
		}
	};

	$scope.userSelected = function(usuario){
		if (angular.isDefined($scope.usuarioElegido) && $scope.usuarioElegido.full_name != usuario.full_name){
			$scope.guardar().then(function(){
				$scope.setearUsuario(usuario);
			},
			function(){
				$scope.usuarioElegido.elegido = '';
				$scope.setearUsuario(usuario);
			});
		} else {
			$scope.setearUsuario(usuario);
		}
	};

	$scope.setearUsuario = function(usuario){
		if (angular.isDefined($scope.usuarioElegido)) $scope.usuarioElegido.elegido = '';
		$scope.usuarioElegido = usuario;
		usuario.elegido = 'bg-info';
		angular.copy(usuario.acceso, $scope.rutasUsuario);
		angular.copy(usuario.acceso, $scope.rutasUsuarioOriginal);
		$scope.tareas.forEach(function(tarea){
			tarea.acceso = in_array(tarea.route, usuario.acceso);
		})
	};

	$scope.guardar = function(){
		var deferred = $q.defer();
		if (!$scope.rutasUsuario.equals($scope.rutasUsuarioOriginal)){
			var dlg = dialogs.confirm("Control de acceso", "¿Desea guardar los cambios efectuados para el usuario " + $scope.usuarioElegido.full_name + "?");
			dlg.result.then(function(){
				var rutasUsuario = {acceso: $scope.rutasUsuario};
				ctrlUsersFactory.setAccess($scope.usuarioElegido._id, rutasUsuario, function(data){
					if (data.status == 'OK') {
						dialogs.notify('Control de acceso', 'Las tareas para el usuario se han guardado correctamente');
						if (loginService.getInfo()._id == $scope.usuarioElegido._id){
							loginService.setAcceso($scope.rutasUsuario);
						}
						$scope.usuarios.forEach(function(usuario){
							if (usuario._id == $scope.usuarioElegido._id) angular.copy($scope.rutasUsuario, usuario.acceso)
						});
						$scope.usuarioElegido.elegido = '';
						$scope.usuarioElegido = undefined;
						$scope.tareas.forEach(function(tarea){
							tarea.acceso = false;
						});
						deferred.resolve();
					} else {
						dialogs.error('Control de acceso', 'Se ha producido un error al intentar guardar los datos.');
						deferred.reject();
					}
				});
			},
			function(){
				deferred.reject();
			})
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	};


}]);
