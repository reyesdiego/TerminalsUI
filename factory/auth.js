/**
 * Created by leo on 18/07/14.
 */

myapp.factory('authFactory', ['$state', '$cookies', '$cookieStore', 'userFactory', 'loginService', '$rootScope', '$q', '$injector', 'cacheFactory', 'generalFunctions', function($state, $cookies, $cookieStore, userFactory, loginService, $rootScope, $q, $injector, cacheFactory, generalFunctions){
	var factory = {};

	factory.loginWithCookies = function(user, pass){
		var deferred = $q.defer();
		this.login(user, pass).then(function(){
			$cookies.username = user;
			$cookies.password = pass;
			$cookies.themeTerminal = loginService.getFiltro();
			deferred.resolve();
		},
		function(){
			deferred.reject();
		});
		return deferred.promise;
	};

	factory.loginWithoutCookies = function(user, pass){
		var deferred = $q.defer();
		this.login(user, pass)
			.then(function(){
				deferred.resolve();
			},
			function(){
				deferred.reject();
			});
		return deferred.promise;
	};

	factory.login = function(user, pass){
		var deferred = $q.defer();

		user = user || $cookies.username;
		pass = pass || $cookies.password;

		var usuario = {
			email:		user,
			password:	pass
		};

		userFactory.login(usuario, function(data, error){
			if (!error && typeof data.data.token === 'object') {
				$rootScope.$broadcast('progreso', {mensaje: 1});
				data = data.data;
				loginService.setInfo(data);
				loginService.setStatus(true);
				loginService.setType(data.role);
				loginService.setGroup(data.group);
				loginService.setToken(data.token.token);

				// Le agrega el token a todas las consultas $http
				$injector.get("$http").defaults.transformRequest = function(data, headersGetter) {
					if (loginService.getToken() != null) headersGetter()['token'] = loginService.getToken();
					if (data) { return angular.toJson(data); }
				};

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
					loginService.setFiltro('BACTSSA');
					$rootScope.filtroTerminal = 'BACTSSA';
				}

				// Carga el tema de la terminal
				if (typeof ($cookies.themeTerminal) != 'undefined') {
					loginService.setFiltro($cookies.themeTerminal);
					$rootScope.filtroTerminal = $cookies.themeTerminal;
					generalFunctions.switchTheme($cookies.themeTerminal);
				} else {
					generalFunctions.switchTheme(loginService.getFiltro());
				}

				// Carga la cache
				if (!factory.userEstaLogeado()){
					cacheFactory.cargaCache()
						.then(function(){
							deferred.resolve();
						},
						function(){
							deferred.reject();
						});
				} else {
					deferred.resolve();
				}
			} else {
				deferred.reject(data);
			}
		});

		return deferred.promise;
	};

	factory.logout = function(){
		$cookieStore.remove('username');
		$cookieStore.remove('password');
		$cookieStore.remove('themeTerminal');
		cacheFactory.limpiaCache();
		loginService.unsetLogin();
		generalFunctions.switchTheme('BACTSSA');
	};

	factory.userEstaLogeado = function(){
		return (angular.isDefined($cookies.username) && angular.isDefined($cookies.password) && $cookies.username != '' && $cookies.password != '');
	};

	factory.setTheme = function(terminal){
		if (angular.isDefined($cookies.themeTerminal) && $cookies.themeTerminal != ''){
			$cookies.themeTerminal = terminal;
		}
	};

	return factory;
}]);