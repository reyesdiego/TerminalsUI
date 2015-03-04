/**
 * Created by leo on 18/07/14.
 */
(function(){

myapp.factory('authFactory', function($state, $cookies, $cookieStore, userFactory, loginService, $rootScope, invoiceFactory, $q, $injector){
	var factory = {};

	factory.loginWithCookies = function(user, pass){
		this.login(user, pass).then(function(){
			$cookies.username = user;
			$cookies.password = pass;
			$cookies.themeTerminal = loginService.getFiltro();
		});
	};

	factory.loginWithoutCookies = function(user, pass){
		this.login(user, pass);
	};

	factory.login = function(user, pass){
		var deferred = $q.defer();

		user = user || $cookies.username;
		pass = pass || $cookies.password;

		userFactory.login(user, pass, function(data, error){

			if (!error && typeof data.data.token === 'object') {
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
				///-------------------------------------------------------------------------

				loginService.setAcceso(data.acceso);
				if ($state.current.name == 'login') {
					$state.transitionTo('tarifario');
				}

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
					$rootScope.switchTheme($cookies.themeTerminal);
				} else {
					$rootScope.switchTheme(loginService.getFiltro());
				}

				//En el login debe cargar todos los datos que se utilizan
				$rootScope.cargaGeneral();

				deferred.resolve(data);
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
});

})();