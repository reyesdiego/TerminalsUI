/**
 * Created by artiom on 13/05/15.
 */

myapp.controller('accessControlCtrl', ['$scope', 'ctrlUsersFactory', 'dialogs', '$q', 'loginService', '$filter', 'generalFunctions', function($scope, ctrlUsersFactory, dialogs, $q, loginService, $filter, generalFunctions){

	$scope.permiso = false;
	$scope.panelMensaje = {
		tipo: 'panel-info',
		titulo: 'Control de usuarios',
		mensaje: 'No posee permisos para requerir estos datos.'
	};

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.cargaRutas = false;
		$scope.panelMensaje = mensaje;
		$scope.permiso = false;
	});

	$scope.usuarios = [];
	$scope.tareas = [];
	$scope.cargaRutas = true;
	$scope.usuarioElegido = undefined;

	$scope.currentPageGeneral = 1;
	$scope.currentPageAGP = 1;
	$scope.itemsPerPage = 10;

	$scope.rutasUsuarioOriginal = [];

	$scope.notificacionesUsuarioOriginal = [];

	$scope.modo = 'tareas';

	$scope.tabTareas = {
		active: true
	};

	$scope.notificaciones = [
		//{ description: 'Nuevo usuario', habilitar: false},
		{ description: 'Nueva tarifa', habilitar: false, valor: 'price', mostrar: ''},
		//{ description: 'Baja del servicio', habilitar: false}
		{ description: 'Enviar mail a cliente por nuevo turno', habilitar: false, valor: 'emailAppointmentToApp', mostrar: 'terminal'},
		{ description: 'Último comprobante', habilitar: false, valor: 'lastInvoice', mostrar: 'Diego Reyes'}
	];

	ctrlUsersFactory.getUsers(function(data){
		if (data.status == 'OK'){
			$scope.permiso = true;
			$scope.usuarios = data.data;
			ctrlUsersFactory.getRoutes(function(data){
				if (data.status == 'OK'){
					$scope.tareas = $filter('orderBy')(data.data, 'route');
				} else {
					$scope.panelMensaje.mensaje = 'Se ha producido un error al cargar el listado de tareas.';
					$scope.panelMensaje.tipo = 'panel-danger';
					$scope.usuarios = [];
					$scope.tareas = [];
				}
				$scope.cargaRutas = false;
			})
		}
	});

	$scope.cambioModo = function(modo){
		$scope.modo = modo;
	};

	$scope.chequearRuta = function(ruta){
		var partesRuta = ruta.route.split('.');
		if (!ruta.acceso){
			quitarHijos(ruta);
			quitarPadres(ruta.route);
		} else {
			if (partesRuta.length > 1){
				var rutaPadre;
				rutaPadre = partesRuta[0];
				if (partesRuta.length > 2){
					rutaPadre += '.' + partesRuta[1];
				}
				agregarPadres(rutaPadre);
			}
			agregarHijos(ruta.route);
		}
	};

	var agregarPadres = function(ruta){
		$scope.tareas.forEach(function(unaTarea){
			if (unaTarea.route == ruta) unaTarea.acceso = true
		});

		var partesRuta = ruta.split('.');
		if (partesRuta.length > 1){
			var rutaPadre = partesRuta[0];
			agregarPadres(rutaPadre);
		}

	};

	var quitarPadres = function(ruta){
		var partesRuta = ruta.split('.');
		if (partesRuta.length > 1){
			var rutaPadre;
			rutaPadre = partesRuta[0];
			for (var i=1; i < partesRuta.length - 1; i++){
				rutaPadre += '.' + partesRuta[1];
			}
			var hijosHabilitados = false;
			$scope.tareas.forEach(function(unaTarea){
				if (unaTarea.route.indexOf(rutaPadre + '.') >= 0 && unaTarea.acceso) hijosHabilitados = true;
			});
			if (!hijosHabilitados) {
				$scope.tareas.forEach(function(unaTarea){
					if (unaTarea.route == rutaPadre) unaTarea.acceso = false;
				})
			}
			quitarPadres(rutaPadre);
		}
	};

	var quitarHijos = function(ruta){
		$scope.tareas.forEach(function(unaTarea){
			if (unaTarea.route.indexOf(ruta.route + '.') >= 0) unaTarea.acceso = false;
		});
	};

	var agregarHijos = function(ruta){
		var hijoHabilitado = false;
		var rutaHija = '';
		$scope.tareas.forEach(function(unaTarea){
			if (unaTarea.route.indexOf(ruta + '.') >= 0 && unaTarea.acceso) hijoHabilitado = true;
		});
		if (!hijoHabilitado){
			$scope.tareas.forEach(function(unaTarea){
				if (unaTarea.route.indexOf(ruta + '.') >= 0 && !hijoHabilitado){
					rutaHija = unaTarea.route;
					unaTarea.acceso = true;
					hijoHabilitado = true;
				}
			})
		}
		if (hijoHabilitado) agregarHijos(rutaHija);
	};

	$scope.userSelected = function(usuario){
		if (angular.isDefined($scope.usuarioElegido) && $scope.usuarioElegido.full_name != usuario.full_name){
			$scope.guardar().then(function(){
				setearUsuario(usuario);
			},
			function(){
				$scope.usuarioElegido.elegido = '';
				setearUsuario(usuario);
			});
		} else {
			setearUsuario(usuario);
		}
	};

	var setearUsuario = function(usuario){
		if (angular.isDefined($scope.usuarioElegido)) $scope.usuarioElegido.elegido = '';
		$scope.usuarioElegido = usuario;
		usuario.elegido = 'bg-info';
		angular.copy(usuario.acceso, $scope.rutasUsuarioOriginal);
		angular.copy(usuario.emailToApp, $scope.notificacionesUsuarioOriginal);
		$scope.tareas.forEach(function(tarea){
			tarea.acceso = generalFunctions.in_array(tarea.route, usuario.acceso);
		});
		$scope.notificaciones.forEach(function(notif){
			notif.habilitar = generalFunctions.in_array(notif.valor, usuario.emailToApp);
		});
		$scope.modo = 'tareas';
		$scope.tabTareas.active = true;
	};

	var guardarTareas = function(tareas){
		var deferred = $q.defer();
		var rutasUsuario = {acceso: tareas};
		ctrlUsersFactory.setAccess($scope.usuarioElegido._id, rutasUsuario, function(data){
			if (data.status == 'OK') {
				if (loginService.info._id == $scope.usuarioElegido._id){
					loginService.acceso = tareas;
					angular.copy(tareas, loginService.acceso);
				}
				$scope.usuarios.forEach(function(usuario){
					if (usuario._id == $scope.usuarioElegido._id) angular.copy(tareas, usuario.acceso)
				});
				deferred.resolve({ status: 'OK' });
			} else {
				deferred.resolve({ status: 'ERROR', data: 'Se ha producido un error al intentar guardar las tareas del usuario.' });
			}
		});
		return deferred.promise;
	};

	var guardarNotificaciones = function(notificaciones){
		var deferred = $q.defer();
		var notifUsuario = { emailToApp: notificaciones };
		ctrlUsersFactory.setNotifications($scope.usuarioElegido._id, notifUsuario, function(data){
			if (data.status == 'OK'){
				$scope.usuarios.forEach(function(usuario) {
					if (usuario._id == $scope.usuarioElegido._id) angular.copy(notificaciones, usuario.emailToApp)
				});
				deferred.resolve({ status: 'OK' });
			} else {
				deferred.resolve({ status: 'ERROR', data: 'Se ha producido un error al intentar guardar las notificaciones del usuario.' });
			}
		});
		return deferred.promise;
	};

	$scope.guardar = function(){
		var deferred = $q.defer();
		var tareasUsuario = [];
		var notificacionesUsuario = [];
		$scope.tareas.forEach(function(unaTarea){
			if (unaTarea.acceso) tareasUsuario.push(unaTarea.route);
		});
		$scope.notificaciones.forEach(function(notif){
			if (notif.habilitar) notificacionesUsuario.push(notif.valor);
		});
		if (!tareasUsuario.equals($scope.rutasUsuarioOriginal) || !notificacionesUsuario.equals($scope.notificacionesUsuarioOriginal)){
			var dlg = dialogs.confirm("Control de acceso", "¿Desea guardar los cambios efectuados para el usuario " + $scope.usuarioElegido.full_name + "?");
			dlg.result.then(function(){
				var guardar = [];
				if (!tareasUsuario.equals($scope.rutasUsuarioOriginal)) guardar.push(guardarTareas(tareasUsuario));
				if (!notificacionesUsuario.equals($scope.notificacionesUsuarioOriginal)) guardar.push(guardarNotificaciones(notificacionesUsuario));
				$q.all(guardar)
					.then(function(values){
						var contar = 0;
						var errorMsg = [];
						values.forEach(function(result){
							if (result.status == 'OK'){
								contar++
							} else {
								errorMsg.push(result.data);
							}
						});
						if (contar == values.length){
							dialogs.notify('Control de acceso', 'La configuración para el usuario ' + $scope.usuarioElegido.full_name + ' se ha guardado correctamente');
							$scope.usuarioElegido.elegido = '';
							$scope.usuarioElegido = undefined;
							$scope.tareas.forEach(function(tarea){
								tarea.acceso = false;
							});
							$scope.notificaciones.forEach(function(notif){
								notif.habilitar = false;
							});
							$scope.modo = 'tareas';
							$scope.tabTareas.active = true;
							deferred.resolve();
						} else {
							errorMsg.forEach(function(error){
								dialogs.error('Control de acceso', error + ' Inténtelo nuevamente más tarde');
							});
							deferred.reject();
						}
					})
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
