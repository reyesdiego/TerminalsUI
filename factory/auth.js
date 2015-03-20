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

				///Hardcodeo de nuevas rutas agregadas
				///Cuando ya estén todas definidas, estos valores deben venir desde el servidor
				data.acceso.push("reports");
				data.acceso.push("container");
				data.acceso.push("buque");
				data.acceso.push("afip");
				data.acceso.push("afip.afectacion.afectacion1");
				data.acceso.push("afip.afectacion.afectacion2");
				data.acceso.push("afip.detalle.detexpo1");
				data.acceso.push("afip.detalle.detexpo2");
				data.acceso.push("afip.detalle.detexpo3");
				data.acceso.push("afip.detalle.detimpo1");
				data.acceso.push("afip.detalle.detimpo2");
				data.acceso.push("afip.detalle.detimpo3");
				data.acceso.push("afip.sumatorias.expo1");
				data.acceso.push("afip.sumatorias.expo2");
				data.acceso.push("afip.sumatorias.expo3");
				data.acceso.push("afip.sumatorias.expo4");
				data.acceso.push("afip.sumatorias.expo5");
				data.acceso.push("afip.sumatorias.impo1");
				data.acceso.push("afip.sumatorias.impo2");
				data.acceso.push("afip.sumatorias.impo3");
				data.acceso.push("afip.sumatorias.impo4");
				data.acceso.push("afip.solicitud.solicitud1");
				data.acceso.push("afip.solicitud.solicitud2");
				data.acceso.push("afip.solicitud.solicitud3");
				data.acceso.push("afip.afectacion");
				data.acceso.push("afip.detalle");
				data.acceso.push("afip.solicitud");
				data.acceso.push("afip.sumatorias");
				data.acceso.push("cgates");
				data.acceso.push("users");
				data.acceso.push("rates");
				data.acceso.push("cambioTerminal");
				///-------------------------------------------------------------------------

				loginService.setAcceso(data.acceso);

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