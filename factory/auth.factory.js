/**
 * Created by leo on 18/07/14.
 */

myapp.factory('authFactory', ['$state', '$cookies', 'loginService', '$rootScope', '$q', '$http', 'generalFunctions', 'APP_CONFIG',
	function($state, $cookies, loginService, $rootScope, $q, $http, generalFunctions, APP_CONFIG){
		var factory = {};

		factory.userEnter = function(user, pass, useCookies){
			var deferred = $q.defer();
			this.login(user, pass)
				.then(function(data){
					if (useCookies){
						$cookies.put('username', user);
						$cookies.put('password', pass);
						$cookies.put('themeTerminal', loginService.getFiltro());
					}
					$cookies.put('isLogged', 'true');
					$cookies.put('restoreSesion', useCookies);
					deferred.resolve(data);
				},
				function(error){
					if (loginService.getStatus()){
						if (useCookies){
							$cookies.put('username', user);
							$cookies.put('password', pass);
							$cookies.put('themeTerminal', loginService.getFiltro());
						}
						$cookies.put('isLogged', 'true');
						$cookies.put('restoreSesion', useCookies);
					}
					deferred.reject(error);
				});
			return deferred.promise;
		};

		factory.login = function(user, pass){
			var deferred = $q.defer();

			user = user || $cookies.get('username');
			pass = pass || $cookies.get('password');

			var usuario = {
				email:		user,
				password:	pass
			};

			sessionlogin(usuario, function(data, error){
				if (!error && typeof data.data.token === 'object') {
					$rootScope.$broadcast('progreso', {mensaje: 1});
					data = data.data;

					if (data.acceso.length > 0){
						loginService.setInfo(data);
						loginService.setStatus(true);
						loginService.setType(data.role);
						loginService.setGroup(data.group);
						loginService.setToken(data.token.token);

						$http.defaults.headers.common.token = loginService.getToken();

						//****************************************
						/*if (generalFunctions.in_array('cfacturas', data.acceso)){
							data.acceso.push('cfacturas.tasas');
							data.acceso.push('cfacturas.correlatividad');
							data.acceso.push('cfacturas.codigos');
							data.acceso.push('cfacturas.revisar');
							data.acceso.push('cfacturas.erroneos');
							data.acceso.push('cfacturas.reenviar');
						}
						if (generalFunctions.in_array('reports', data.acceso)){
							data.acceso.push('reports.tasas');
							data.acceso.push('reports.tarifas');
							data.acceso.push('reports.empresas');
							data.acceso.push('reports.terminales');
						}
						if (generalFunctions.in_array('cgates', data.acceso)){
							data.acceso.push('cgates.gates');
							data.acceso.push('cgates.invoices');
							data.acceso.push('cgates.appointments');
						}
						data.acceso.push('trackContainer');*/
						//****************************************


						loginService.setAcceso(data.acceso);

						//$rootScope.rutas = data.acceso;

						//$rootScope.esUsuario = loginService.getType();
						//$rootScope.terminal = loginService.getInfo();
						//$rootScope.grupo = loginService.getGroup();

						//Si el rol es terminal, queda como filtro de si misma para las consultas
						//De lo contrario, dejo a BACTSSA como filtro por default
						if (data.role == 'terminal') {
							loginService.setFiltro(data.terminal);
						} else {
							var filtro = angular.isDefined($cookies.get('themeTerminal')) ? $cookies.get('themeTerminal') : 'BACTSSA';
							loginService.setFiltro(filtro);
							/*$rootScope.filtroTerminal = filtro;
							switch (filtro){
								case 'BACTSSA':
									$rootScope.terminalEstilo = 'bootstrap.cerulean';
									$rootScope.logoTerminal = 'images/logo_bactssa.png';
									break;
								case 'TERMINAL4':
									$rootScope.terminalEstilo = 'bootstrap.united';
									$rootScope.logoTerminal = 'images/logo_terminal4.png';
									break;
								case 'TRP':
									$rootScope.terminalEstilo = 'bootstrap.flaty';
									$rootScope.logoTerminal = 'images/logo_trp.png';
									break;
							}*/
						}

						// Carga la cache si el usuario no tenía el acceso por cookies
						/*var restoreSesion = $cookies.get('restoreSesion') === 'true';
						if (!restoreSesion){
							cacheFactory.cargaCache()
								.then(function(){
									deferred.resolve(data);
								},
								function(){
									var cacheError = {
										code: 'DAT-0010',
										message: 'Se ha producido un error en la carga de la caché.'
									};
									deferred.reject(cacheError);
								});
						} else {
							deferred.resolve(data);
						}*/
						deferred.resolve(data);
					} else {
						var myError = {
							code: 'ACC-0010'
						};
						deferred.reject(myError);
					}
				} else {
					if (data.code == 'ACC-0003'){
						$rootScope.salt = data.data.salt;
						$rootScope.rutasComunes.push('validar');
						deferred.reject(data);
					} else {
						deferred.reject(data);
					}
				}
			});

			return deferred.promise;
		};

		factory.logout = function(){
			$cookies.remove('isLogged');
			$cookies.remove('restoreSesion');
			$cookies.remove('username');
			$cookies.remove('password');
			loginService.unsetLogin();
		};

		function sessionlogin (datos, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/login';
			$http.post(inserturl, datos)
					.then(function(response) {
						callback(response.data, false);
					}, function(response) {
						if (angular.isDefined(response.data.data) && response.data.data != null){
							// ACC-0001 usuario o contraseña incorrecto
							// ACC-0001 usuario o contraseñas vacío
							// ACC-0003 no entro al correo
							// ACC-0004 no habilitado en el sistema
							callback(response.data, true);
						} else {
							//console.log(response);
							/*response.data = {
							 code: 'ACC-0020',
							 message: 'Se ha producido un error de comunicación con el servidor.'
							 };*/
							callback(response.data, true);
						}
					});
		};

		factory.cambiarContraseña = function(formData, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/agp/password';
			$http.post(inserturl, formData)
					.then(function(response) {
						callback(response.data);
					}, function(response) {
						callback(response.data);
					});
		};

		factory.newUser = function(formData, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/agp/register';
			$http.post(inserturl, formData)
					.then(function(response) {
						callback(response.data);
					}, function(response) {
						callback(response.data);
					});
		};

		factory.resetPassword = function(mail, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/agp/resetPassword/' + mail;
			$http.post(inserturl)
					.then(function(response) {
						callback(response.data);
					}, function(response) {
						callback(response.data);
					});
		};

		factory.validateUser = function(salt, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/agp/account/token';
			$http.get(inserturl, { params: formatService.formatearDatos(salt) })
					.then(function(response){
						callback(response.data);
					}, function(response){
						callback(response.data);
					});
		};

		return factory;
	}]);