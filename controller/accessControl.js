/**
 * Created by artiom on 13/05/15.
 */

myapp.controller('accessControlCtrl', ['$scope','$rootScope', 'ctrlUsersFactory', 'dialogs', '$q', 'loginService', function($scope, $rootScope, ctrlUsersFactory, dialogs, $q, loginService){

	$scope.usuarios = [];
	$scope.tareas = [];
	$scope.cargaRutas = true;
	$scope.usuarioElegido = null;

	$scope.currentPage = 1;
	$scope.itemsPerPage = 10;

	$scope.rutasUsuario = [];
	$scope.rutasUsuarioOriginal = [];

	$scope.modo = 'tareas';

	ctrlUsersFactory.getUsers(function(data){
		if (data.status == 'OK'){
			$scope.usuarios = data.data;
			ctrlUsersFactory.getRoutes(function(data){
				if (data.status == 'OK'){
					$scope.tareas = data.data;
				} else {

				}
				$scope.cargaRutas = false;
			})
		}

	});

	$scope.cambioModo = function(modo){
		$scope.modo = modo;
	};

	$scope.chequearRuta = function(ruta){
		var indice = $scope.rutasUsuario.indexOf(ruta.route);
		if (indice >= 0){
			$scope.rutasUsuario.splice(indice, 1);
			if (ruta.route == 'afip'){
				for(var i = $scope.rutasUsuario.length; i--;) {
					if($scope.rutasUsuario[i].indexOf(ruta.route) >= 0) {
						$scope.tareas.forEach(function(unaTarea){
							if (unaTarea.route == $scope.rutasUsuario[i]) unaTarea.acceso = false;
						});
						$scope.rutasUsuario.splice(i, 1);
					}
				}
			}
		} else {
			$scope.rutasUsuario.push(ruta.route);
			if (ruta.route.indexOf('afip') >= 0){
				if ($scope.rutasUsuario.indexOf('afip') == -1){
					$scope.rutasUsuario.push('afip');
					$scope.tareas.forEach(function(unaTarea){
						if (unaTarea.route == 'afip') unaTarea.acceso = true;
					})
				}
			}
		}
	};

	$scope.userSelected = function(usuario){
		if ($scope.usuarioElegido != null && $scope.usuarioElegido.full_name != usuario.full_name){
			$scope.guardar().then(function(){
				$scope.setearUsuario(usuario);
			},
			function(){
				$scope.setearUsuario(usuario);
			});
		} else {
			$scope.setearUsuario(usuario);
		}
	};

	$scope.setearUsuario = function(usuario){
		$scope.usuarioElegido = usuario;
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

						$scope.usuarioElegido = null;
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
		}
		return deferred.promise;
	};


}]);
