/**
 * Created by leo on 18/07/14.
 */
(function(){

myapp.factory('authFactory', function($state, $cookies, $cookieStore, userFactory, loginService, $rootScope, invoiceFactory, $q){
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
			if (!error) {
				loginService.setInfo(data);
				loginService.setStatus(true);
				loginService.setType(data.role);
				loginService.setGroup(data.group);
				loginService.setToken(data.token.token);

				///Hardcodeo de nuevas rutas agregadas
				///Cuando ya estén todas definidas, estos valores deben venir desde el servidor
				data.acceso.push("reports");
				data.acceso.push("container");
				data.acceso.push("buque");
				data.acceso.push("afip");
				data.acceso.push("afip.afectacion1");
				data.acceso.push("afip.afectacion2");
				data.acceso.push("afip.detexpo1");
				data.acceso.push("afip.detexpo2");
				data.acceso.push("afip.detexpo3");
				data.acceso.push("afip.detimpo1");
				data.acceso.push("afip.detimpo2");
				data.acceso.push("afip.detimpo3");
				data.acceso.push("afip.expo1");
				data.acceso.push("afip.expo2");
				data.acceso.push("afip.expo3");
				data.acceso.push("afip.expo4");
				data.acceso.push("afip.expo5");
				data.acceso.push("afip.impo1");
				data.acceso.push("afip.impo2");
				data.acceso.push("afip.impo3");
				data.acceso.push("afip.impo4");
				data.acceso.push("afip.solicitud1");
				data.acceso.push("afip.solicitud2");
				data.acceso.push("afip.solicitud3");
				///-------------------------------------------------------------------------

				loginService.setAcceso(data.acceso);
				if ($state.current.name == 'login') {
					$state.transitionTo('tarifario');
				}

				$rootScope.esUsuario = loginService.getType();
				$rootScope.terminal = loginService.getInfo();

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