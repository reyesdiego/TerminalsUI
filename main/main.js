/**
 * Created by kolesnikov-a on 21/02/14.
 */

google.load("visualization", "1", {packages:["corechart"]});

Array.prototype.contains = function (item) {
	var result = false;
	this.forEach(function (data) {
		if (data === item)
			result = true;
		return result;
	});
	return result;
};

function in_array(needle, haystack, argStrict){
	var key = '',
		strict = !! argStrict;

	if(strict){
		for(key in haystack){
			if(haystack[key] === needle){
				return true;
			}
		}
	}else{
		for(key in haystack){
			if(haystack[key] == needle){
				return true;
			}
		}
	}
	return false;
}

function idToDate(objectId){
	var fechaGMT0 = new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
	fechaGMT0.setUTCHours(fechaGMT0.getHours(), fechaGMT0.getMinutes(), fechaGMT0.getSeconds());
	return fechaGMT0;
}

var serverUrl = config.url();

var myapp = angular.module('myapp', ['ui.router','ui.bootstrap', 'ngSanitize', 'ngCookies', 'angucomplete-alt', 'timepickerPop', 'multi-select', 'angular-cache']);

myapp.config(['$httpProvider', function ($httpProvider) {

	$httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

}]);

myapp.config(['$stateProvider', '$urlRouterProvider', '$provide', function ($stateProvider, $urlRouterProvider, $provide) {

	$provide.decorator("$exceptionHandler", ['$delegate', '$injector', function($delegate, $injector){
		return function(exception, cause){
			var $rootScope = $injector.get("$rootScope");
			$rootScope.addError({message:"Exception", reason:exception});
			$delegate(exception, cause);
		};
	}]);

	// For any unmatched url, send to /login
	$urlRouterProvider.otherwise("/login");

	//noinspection JSValidateTypes
	$stateProvider
		.state('login', {
			url: "/login",
			templateUrl: "view/login.html"
		})
		.state('register', {
			url: "/registro",
			templateUrl: "view/newUser.html"
		})
		.state('tarifario', {
			url: "/pricelist",
			templateUrl: "view/pricelist.html"
		})
		.state('invoices', {
			url: "/invoices",
			templateUrl: "view/invoices.html",
			controller: "invoicesCtrl"
		})
		.state('matches', {
			url: "/match",
			templateUrl: "view/matchprices.html"
		})
		.state('control', {
			url: "/control",
			templateUrl: "view/control.html",
			controller: "controlCtrl",
			resolve: { //Los datos de los gráficos deben venir cargados antes de llamar a la vista, por eso se utiliza el resolve
				datosGraficoPorMes: controlCtrl.prepararMatrizVacía,
				datosFacturadoPorDiaTasas: controlCtrl.prepararMatrizTasas,
				datosGraficoGatesTurnosDias: controlCtrl.prepararMatrizVaciaGatesTurnos
			}
		})
		.state('cfacturas', {
			url: "/cfacturas",
			templateUrl: "view/controlComprobantes.html"
		})
		.state('gates', {
			url: "/gates",
			templateUrl: "view/gates.html"
		})
		.state('cgates', {
			url: '/controlGates',
			templateUrl: 'view/gates.control.html'
		})
		.state('gates.invoices', {
			url: "/contenedor=:contenedor",
			templateUrl: "view/gates.invoices.html"
		})
		.state('turnos', {
			url: "/turnos",
			templateUrl: "view/turnos.html"
		})
		.state('changepass', {
			url: "/cambiarpass",
			templateUrl: "view/newpass.html"
		})
		.state('container',{
			url: "/contenedor",
			templateUrl: "view/container.html"
		})
		.state('buque',{
			url: "/buqueViaje",
			templateUrl: "view/buque.viaje.html"
		})
		.state('forbidden', {
			url: "/forbidden",
			templateUrl: "view/forbidden.html"
		})
		.state('reports', {
			url: "/reportes",
			templateUrl:"view/reportes.html"
		})
		.state('afip', {
			url: "/afip",
			templateUrl: "view/afip.html"
		})
		.state('afip.afectacion.afectacion1', {
			templateUrl: "view/afip.afectacion1.html"
		})
		.state('afip.afectacion.afectacion2', {
			templateUrl: "view/afip.afectacion2.html"
		})
		.state('afip.detalle.detimpo1', {
			templateUrl: "view/afip.detimpo1.html"
		})
		.state('afip.detalle.detimpo2', {
			templateUrl: "view/afip.detimpo2.html"
		})
		.state('afip.detalle.detimpo3', {
			templateUrl: "view/afip.detimpo3.html"
		})
		.state('afip.detalle.detexpo1', {
			templateUrl: "view/afip.detexpo1.html"
		})
		.state('afip.detalle.detexpo2', {
			templateUrl: "view/afip.detexpo2.html"
		})
		.state('afip.detalle.detexpo3', {
			templateUrl: "view/afip.detexpo3.html"
		})
		.state('afip.sumatorias.expo1', {
			templateUrl: "view/afip.expo1.html"
		})
		.state('afip.sumatorias.expo2', {
			templateUrl: "view/afip.expo2.html"
		})
		.state('afip.sumatorias.expo3', {
			templateUrl: "view/afip.expo3.html"
		})
		.state('afip.sumatorias.expo4', {
			templateUrl: "view/afip.expo4.html"
		})
		.state('afip.sumatorias.expo5', {
			templateUrl: "view/afip.expo5.html"
		})
		.state('afip.sumatorias.impo1', {
			templateUrl: "view/afip.impo1.html"
		})
		.state('afip.sumatorias.impo2', {
			templateUrl: "view/afip.impo2.html"
		})
		.state('afip.sumatorias.impo3', {
			templateUrl: "view/afip.impo3.html"
		})
		.state('afip.sumatorias.impo4', {
			templateUrl: "view/afip.impo4.html"
		})
		.state('afip.solicitud.solicitud1', {
			templateUrl: "view/afip.solicitud1.html"
		})
		.state('afip.solicitud.solicitud2', {
			templateUrl: "view/afip.solicitud2.html"
		})
		.state('afip.solicitud.solicitud3', {
			templateUrl: "view/afip.solicitud3.html"
		})
		.state('afip.afectacion', {
			templateUrl: "view/afip.afectacion.html"
		})
		.state('afip.detalle', {
			templateUrl: "view/afip.detalle.html"
		})
		.state('afip.solicitud', {
			templateUrl: "view/afip.solicitud.html"
		})
		.state('afip.sumatorias', {
			templateUrl: "view/afip.sumatorias.html"
		})
		.state('users', {
			url: "/users",
			templateUrl: "view/users.html"
		})
		.state('rates', {
			url: "/rates",
			templateUrl: 'view/invoicesRates.html'
		})
		.state('cambioTerminal', {
			url: "/cambioTerminal",
			templateUrl: 'view/cambioTerminal.html'
		})

}]);

myapp.run(['$rootScope', '$state', 'loginService', '$http', 'authFactory', 'dialogs', '$injector', function($rootScope, $state, loginService, $http, authFactory, dialogs, $injector){
	$rootScope.previousState = '';
	$rootScope.cambioTerminal = false;
	$rootScope.cargarCache = false;
	$rootScope.primerRuteo = false;

	$rootScope.ordenarPor = function(filtro){
		if ($rootScope.predicate == filtro){
			$rootScope.reverse = !$rootScope.reverse;
		}
		$rootScope.predicate = filtro;
	};

	$rootScope.cambioMoneda = true;

	// Le agrega el token a todas las consultas $http
	$injector.get("$http").defaults.transformRequest = function(data, headersGetter) {
		if (loginService.getToken() != null) headersGetter()['token'] = loginService.getToken();
		if (data) { return angular.toJson(data); }
	};

	// Carga la sesion por cookies
	if (!loginService.getStatus() && authFactory.userEstaLogeado()){
		authFactory.login().then(function(){
			$rootScope.cargarCache = true;
			$rootScope.primerRuteo = true;
			$rootScope.estaLogeado = true;
			$rootScope.$broadcast('loginComplete');
		});
	}

	if (loginService.getStatus()){
		$rootScope.cargarCache = true;
		$rootScope.primerRuteo = true;
	}

	$rootScope.fechaInicio = new Date();
	$rootScope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

	$rootScope.colorBactssa = '';
	$rootScope.colorTerminal4 = '';
	$rootScope.colorTrp = '';

	$rootScope.mensajeResultado = {
		titulo: 'Comprobantes',
		mensaje: 'No se encontraron comprobantes para los filtros seleccionados.',
		tipo: 'panel-info'
	};

	$rootScope.addError = function(error){
		$rootScope.mensajeResultado = {
			titulo: 'Error',
			mensaje: 'Se ha producido un error inesperado. Intente recargar la página. Si el error persiste, comuníquese con A.G.P. S.E. ',
			tipo: 'panel-danger',
			error: error
		};
		$rootScope.$broadcast('errorInesperado', $rootScope.mensajeResultado);
	};

	var styles=document.styleSheets;
	for(var i=0,l=styles.length; i<l; ++i){
		var sheet=styles[i];
		var rules, rule, j, l2;
		if(sheet.title === "BACTSSA"){
			rules=sheet.cssRules;
			for(j=0, l2=rules.length; j<l2; j++){
				rule=rules[j];

				if('.navbar-default' === rule.selectorText){
					$rootScope.colorBactssa = rule.style['backgroundColor'];
				}
			}
		}
		if(sheet.title === "TRP"){
			rules=sheet.cssRules;
			for(j=0, l2=rules.length; j<l2; j++){
				rule=rules[j];

				if('.navbar-default' === rule.selectorText){
					$rootScope.colorTrp = rule.style['backgroundColor'];
				}
			}
		}
		if(sheet.title === "TERMINAL4"){
			rules=sheet.cssRules;
			for(j=0, l2=rules.length; j<l2; j++){
				rule=rules[j];

				if('.navbar-default' === rule.selectorText){
					$rootScope.colorTerminal4 = rule.style['backgroundColor'];
				}
			}
		}
	}

	$rootScope.moneda = "DOL";

	var rutasComunes = ['login', 'forbidden', 'changepass', 'register'];
	$rootScope.$state = $state;
	// Variables Globales de Paginacion
	$rootScope.itemsPerPage = 15;
	$rootScope.currentPage = 1;
	$rootScope.page = { skip:0, limit: $rootScope.itemsPerPage };
	// Variables Globales de Fecha
	$rootScope.dateOptions = { 'showWeeks': false };
	$rootScope.formatDate = 'yyyy-MM-dd';

	$rootScope.isDefined = function(element){
		return angular.isDefined(element);
	};

	$rootScope.switchTheme = function(title){
		var i, a;
		for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
			if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
				a.disabled = a.getAttribute("title") != title;
			}
		}
	};

	$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
		if (!$rootScope.primerRuteo){
			$rootScope.previousState = from;
		} else {
			$rootScope.primerRuteo = false;
		}
	});

	$rootScope.$on('$stateChangeStart', function(event, toState){
		if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion < 10){
			dialogs.error('Error de navegador', 'La aplicación no es compatible con su versión de navegador. Los navegadores compatibles son Mozilla Firefox, Google Chrome y las versiones de IE mayores a 8.');
		}
		if (!loginService.getStatus() && authFactory.userEstaLogeado()){
			authFactory.login().then(function(){
				$rootScope.verificaRutas(event, toState);
			});
		} else {
			$rootScope.verificaRutas(event, toState);
		}
	});

	$rootScope.verificaRutas = function(event, toState){
		$rootScope.cambioMoneda = !(toState.name == 'reports' || toState.name.indexOf('afip') != -1 || toState.name == 'tarifario' || toState.name == 'matches' || toState.name == 'turnos' || toState.name == 'users');
		if (!in_array(toState.name, rutasComunes)){
			if (loginService.getStatus()){
				if(!in_array(toState.name, loginService.getAcceso())){
					$rootScope.usuarioNoAutorizado(event);
				} else {
					if ($rootScope.cargarCache){
						$rootScope.cargarCache = false;
						$rootScope.previousState = toState.name;
						event.preventDefault();
						$state.transitionTo('cambioTerminal');
					}
				}
			} else {
				$rootScope.usuarioNoAutorizado(event);
			}
		}
	};

	$rootScope.usuarioNoAutorizado = function(event){
		event.preventDefault();
		$state.transitionTo('forbidden');
	};
}]);
