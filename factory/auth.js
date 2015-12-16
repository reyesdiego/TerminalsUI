/**
 * Created by leo on 18/07/14.
 */

myapp.factory('authFactory', ['$state', '$cookies', 'userFactory', 'loginService', '$rootScope', '$q', 'cacheFactory', '$http',
	function($state, $cookies, userFactory, loginService, $rootScope, $q, cacheFactory, $http){
		var factory = {};

		factory.userEnter = function(user, pass, useCookies){
			var deferred = $q.defer();
			this.login(user, pass)
				.then(function(){
					if (useCookies){
						$cookies.put('username', user);
						$cookies.put('password', pass);
						$cookies.put('themeTerminal', loginService.getFiltro());
					}
					$cookies.put('isLogged', 'true');
					$cookies.put('restoreSesion', useCookies);
					deferred.resolve();
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

			userFactory.login(usuario, function(data, error){
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

						loginService.setAcceso(data.acceso);

						$rootScope.rutas = data.acceso;

						$rootScope.esUsuario = loginService.getType();
						$rootScope.terminal = loginService.getInfo();
						$rootScope.grupo = loginService.getGroup();

						//Si el rol es terminal, queda como filtro de si misma para las consultas
						//De lo contrario, dejo a BACTSSA como filtro por default
						if (data.role == 'terminal') {
							loginService.setFiltro(data.terminal);
						} else {
							var filtro = angular.isDefined($cookies.get('themeTerminal')) ? $cookies.get('themeTerminal') : 'BACTSSA';
							loginService.setFiltro(filtro);
							$rootScope.filtroTerminal = filtro;
						}

						// Carga la cache si el usuario no tenía el acceso por cookies
						var restoreSesion = $cookies.get('restoreSesion') === 'true';
						if (!restoreSesion){
							cacheFactory.cargaCache()
								.then(function(){
									deferred.resolve();
								},
								function(){
									var cacheError = {
										code: 'DAT-0010',
										message: 'Se ha producido un error en la carga de la caché.'
									};
									deferred.reject(cacheError);
								});
						} else {
							deferred.resolve();
						}
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
			cacheFactory.limpiaCache();
			loginService.unsetLogin();
		};

		return factory;
	}]);