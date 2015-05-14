/**
 * Created by artiom on 13/05/15.
 */

myapp.controller('accessControlCtrl', ['$scope','$rootScope', 'ctrlUsersFactory', 'dialogs', '$q', function($scope, $rootScope, ctrlUsersFactory, dialogs, $q){

	$scope.usuarios = [];
	$scope.tareas = [];
	$scope.cargaRutas = true;
	$scope.usuarioElegido = null;

	$scope.currentPage = 1;
	$scope.itemsPerPage = 10;

	$scope.rutasUsuario = [];
	$scope.rutasUsuarioOriginal = [];

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
				ctrlUsersFactory.setAccess($scope.usuarioElegido._id, $scope.rutasUsuario, function(data){
					console.log(data);
					if (data.status == 'OK') {
						var dl = dialogs.notify('Control de acceso', 'Las tareas para el usuario se han guardado correctamente');
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
