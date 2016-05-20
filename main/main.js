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

Array.prototype.unique=function(a){
	return function(){
		return this.filter(a)
	}
}(function(a,b,c){
	return c.indexOf(a,b+1)<0
});

Array.prototype.equals = function (array) {
	// if the other array is a falsy value, return
	if (!array)
		return false;

	// compare lengths - can save a lot of time
	if (this.length != array.length)
		return false;

	this.sort();
	array.sort();

	for (var i = 0, l=this.length; i < l; i++) {
		// Check if we have nested arrays
		if (this[i] instanceof Array && array[i] instanceof Array) {
			// recurse into the nested arrays
			if (!this[i].equals(array[i]))
				return false;
		}
		else if (this[i] != array[i]) {
			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false;
		}
	}
	return true;
};

function in_array(needle, haystack, argStrict){
	var key = '',
		strict = !! argStrict;

	if(strict){
		for(key in haystack){
			if(haystack.hasOwnProperty(key) && haystack[key] === needle){
				return true;
			}
		}
	}else{
		for(key in haystack){
			if(haystack.hasOwnProperty(key) && haystack[key] == needle){
				return true;
			}
		}
	}
	return false;
}

var serverUrl = config.url();
var socketUrl = config.socket();

var myapp = angular.module('myapp', ['ui.router', 'mwl.calendar', 'ui.bootstrap', 'ngSanitize', 'ngCookies', 'angucomplete-alt', 'multi-select', 'angular-cache', 'ui.bootstrap.datetimepicker', 'cgNotify', 'btford.socket-io', 'ngAnimate', 'ngTagsInput']);

myapp.constant('uiDatetimePickerConfig', {
	dateFormat: 'yyyy-MM-dd HH:mm',
	enableDate: true,
	enableTime: true,
	todayText: 'Hoy',
	nowText: 'Ahora',
	clearText: 'Borrar',
	closeText: 'Listo',
	dateText: 'Fecha',
	timeText: 'Hora',
	closeOnDateSelection: true,
	appendToBody: false,
	showButtonBar: true
});

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
	//$urlRouterProvider.otherwise("/login");
	$urlRouterProvider.otherwise( function($injector, $location) {
		var $state = $injector.get("$state");
		$state.go("login");
	});

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
			templateUrl: "view/pricelistEdit.html",
			controller: 'matchPricesCtrl'
		})
		.state('control', {
			url: "/control",
			templateUrl: "view/control.html",
			controller: "controlCtrl"
		})
		.state('cfacturas', {
			url: "/controlComprobantes",
			templateUrl: "view/controlComprobantes.html",
			controller: 'controlComprobantesCtrl'
		})
			.state('cfacturas.tasas', {
				url: '/tasas',
				templateUrl: 'view/control.tasas.html',
				controller: 'tasaCargasCtrl'
			})
			.state('cfacturas.correlatividad', {
				url: '/correlatividad',
				templateUrl: 'view/control.correlatividad.html',
				controller: 'correlatividadCtrl'
			})
			.state('cfacturas.codigos', {
				url: '/codigos',
				templateUrl: 'view/control.codigos.html',
				controller: 'codigosCtrl'
			})
			.state('cfacturas.revisar', {
				url: '/revisar',
				templateUrl: 'view/control.revisar.html'
			})
			.state('cfacturas.erroneos', {
				url: '/erroneos',
				templateUrl: 'view/control.erroneos.html'
			})
			.state('cfacturas.reenviar', {
				url: '/reenviar',
				templateUrl: 'view/control.reenviar.html'
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
			templateUrl:"view/reportes.html",
			controller: 'reportsCtrl'
		})
			.state('reports.tasas', {
				url:'/tasas',
				templateUrl: 'view/reportes.tasas.html',
				controller: 'ratesCtrl'
			})
			.state('reports.tarifas', {
				url: '/tarifas',
				templateUrl: 'view/reportes.tarifas.html',
				controller: 'reporteTarifasCtrl'
			})
			.state('reports.empresas', {
				url: '/empresas',
				templateUrl: 'view/reportes.empresas.html',
				controller: 'facturacionPorEmpresaCtrl'
			})
			.state('reports.terminales', {
				url: '/terminales',
				templateUrl: 'view/reportes.terminales.html',
				controller: 'tarifasTerminalesCtrl'
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
		.state('afip.removido.removido1', {
			templateUrl: "view/afip.removido1.html"
		})
		.state('afip.removido.removido2', {
			templateUrl: "view/afip.removido2.html"
		})
		.state('afip.removido.removido3', {
			templateUrl: "view/afip.removido3.html"
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
		.state('afip.removido', {
			templateUrl: "view/afip.removido.html"
		})
		.state('afip.transbordos', {
			templateUrl: "view/afip.transbordos.html"
		})
		.state('afip.transbordos.impo', {
			templateUrl: "view/table.transbordos.html"
		})
		.state('afip.transbordos.expo', {
			templateUrl: "view/table.transbordos.html"
		})
		.state('users', {
			url: "/users",
			templateUrl: "view/users.html"
		})
		.state('agenda', {
			url: "/agendaTurnos",
			templateUrl: 'view/turnosAgenda.html'
		})
		.state('access', {
			url: "/controlAcceso",
			templateUrl: 'view/controlAcceso.html'
		})
		.state('cturnos', {
			url: "/colaTurnos",
			templateUrl: 'view/turnosEncolados.html'
		})
		.state('validar', {
			url: "/validarUsuario",
			templateUrl: "view/validarUsuario.html"
		})
		.state('liquidaciones', {
			url: "/liquidaciones",
			templateUrl: "view/liquidaciones.html"
		})
		.state('modificarTarifario', {
			parent: 'matches',
			url: "/editarTarifario",
			templateUrl: "view/editPricelist.new.html"

		})
		.state('mturnos', {
			url: "/controlTurnos",
			templateUrl: "view/appointments.control.html"
		})
		.state('mat', {
			url: "/mat",
			templateUrl: "view/mat.html"
		})
}]);

myapp.config(['$provide', function ($provide) {
	$provide.decorator('daypickerDirective', ['$delegate', function ($delegate) {
		var directive = $delegate[0];
		var compile = directive.compile;
		directive.compile = function(tElement, tAttrs) {
			var link = compile.apply(this, arguments);
			return function(scope, elem, attrs) {
				link.apply(this, arguments);
				scope.showWeeks = false;
			};
		};
		return $delegate;
	}]);
	$provide.decorator('datepickerPopupDirective', ['$delegate', function ($delegate) {
		var directive = $delegate[0];
		var compile = directive.compile;
		directive.compile = function(tElement, tAttrs) {
			var link = compile.apply(this, arguments);
			return function(scope, elem, attrs) {
				link.apply(this, arguments);
				scope.showButtonBar = false;
			};
		};
		return $delegate;
	}]);
	$provide.decorator('calendarConfig', ['$delegate', function ($delegate) {
		$delegate.titleFormats.week = 'Semana {week} del {year}';
		return $delegate;
	}]);
	$provide.decorator('mwlCalendarDirective', ['$delegate', function ($delegate) {
		$delegate[0].$$isolateBindings.dayViewStart.mode = '=';
		return $delegate;
	}]);
	$provide.decorator('mwlCalendarDayDirective', ['$delegate', function ($delegate) {
		$delegate[0].controller = ['$scope', '$timeout', 'moment', 'calendarHelper', 'calendarConfig', function($scope, $timeout, moment, calendarHelper, calendarConfig) {

			var vm = this;
			var dayViewStart, dayViewEnd;

			vm.calendarConfig = calendarConfig;

			function updateDays() {
				dayViewStart = moment($scope.dayViewStart || '00:00', 'HH:mm');
				dayViewEnd = moment($scope.dayViewEnd || '23:00', 'HH:mm');
				vm.dayViewSplit = parseInt($scope.dayViewSplit);
				vm.hourHeight = (60 / $scope.dayViewSplit) * 30;
				vm.hours = [];
				var dayCounter = moment(dayViewStart);
				for (var i = 0; i <= dayViewEnd.diff(dayViewStart, 'hours'); i++) {
					vm.hours.push({
						label: dayCounter.format(calendarConfig.dateFormats.hour)
					});
					dayCounter.add(1, 'hour');
				}
			}

			var originalLocale = moment.locale();

			$scope.$on('calendar.refreshView', function() {

				if (originalLocale !== moment.locale()) {
					originalLocale = moment.locale();
					updateDays();
				}

				vm.view = calendarHelper.getDayView($scope.events, $scope.currentDay, dayViewStart.hours(), dayViewEnd.hours(), vm.hourHeight);

			});

			$scope.$watch('dayViewStart', updateDays);

			updateDays();

		}];
		return $delegate;
	}]);

}]);

myapp.config(['calendarConfigProvider', function(calendarConfigProvider){
	calendarConfigProvider.setI18nStrings({
		eventsLabel: 'Turnos',
		timeLabel: 'Hora'
	});
}]);

myapp.config(['$cookiesProvider', function($cookiesProvider){
	var hoy = new Date();

	$cookiesProvider.defaults.expires = new Date(hoy.getFullYear(), hoy.getMonth()+1, hoy.getDate());
}]);

myapp.run(['$rootScope', '$state', 'loginService', 'authFactory', 'dialogs', '$injector', 'moment', '$cookies', 'appSocket', '$http',
	function($rootScope, $state, loginService, authFactory, dialogs, $injector, moment, $cookies, appSocket, $http){ //El app socket está simplemente para que inicie la conexión al iniciar la aplicación

		$rootScope.socket = appSocket;

		$rootScope.socket.connect();

		$rootScope.listaTerminales = ['BACTSSA', 'TERMINAL4', 'TRP'];
		$rootScope.terminalEstilo = 'bootstrap.cerulean';

		moment().format('YYYY-MM-DD');
		moment.locale('es');

		moment.locale('es', {
			week : {
				dow : 7 // Domingo primer día de la semana
			}
		});

		$rootScope.appointmentNotify = 0;
		$rootScope.gateNotify = 0;
		$rootScope.invoiceNotify = 0;

		$rootScope.logoTerminal = 'images/logo_bactssa.png';

		$rootScope.verNotificaciones = true;

		$rootScope.cambioTerminal = false;
		$rootScope.cargarCache = false;
		$rootScope.primerRuteo = false;
		$rootScope.cargandoCache = false;

		$rootScope.ordenarPor = function(filtro){
			if ($rootScope.predicate == filtro){
				$rootScope.reverse = !$rootScope.reverse;
			}
			$rootScope.predicate = filtro;
		};

		$rootScope.cambioMoneda = true;
		$rootScope.cambioTerminal = true;

		$rootScope.setEstiloTerminal = function(terminal){
			if ($rootScope.filtroTerminal != terminal){
				$rootScope.filtroTerminal = terminal;
				$cookies.put('themeTerminal', terminal);
				loginService.setFiltro(terminal);
				switch (terminal){
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
				}
			}
		};

		if (loginService.getStatus()){
			$http.defaults.headers.common.token = loginService.getToken();
			$rootScope.rutas = loginService.getAcceso();
			$rootScope.setEstiloTerminal(loginService.getFiltro());
			$rootScope.esUsuario = loginService.getType();
			$rootScope.terminal = loginService.getInfo();
			$rootScope.grupo = loginService.getGroup();
			//$rootScope.cargarCache = true;
			//$rootScope.primerRuteo = true;
		}

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

		$rootScope.moneda = "DOL";

		$rootScope.rutasComunes = ['login', 'forbidden', 'changepass', 'register', 'cambioTerminal'];
		$rootScope.rutasSinMoneda = ['reports', 'afip', 'tarifario', 'matches', 'turnos', 'users', 'agenda', 'access', 'control', 'cturnos', 'mat'];
		$rootScope.rutasSinTerminal = ['control', 'afip', 'mat', 'access', 'users', 'cturnos'];
		$rootScope.$state = $state;
		// Variables Globales de Paginacion
		$rootScope.itemsPerPage = 15;
		$rootScope.currentPage = 1;
		$rootScope.page = { skip:0, limit: $rootScope.itemsPerPage };

		$rootScope.salir = function(){
			$rootScope.socket.emit('logoff', loginService.getInfo().user);
			authFactory.logout();
			$rootScope.appointmentNotify = 0;
			$rootScope.invoiceNotify = 0;
			$rootScope.gateNotify = 0;
			$rootScope.esUsuario = '';
			$rootScope.$broadcast('logout');
			$state.transitionTo('login');
			$rootScope.setEstiloTerminal('BACTSSA');
			$rootScope.filtroTerminal = '';
		};

		$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from) {
			$rootScope.setEstiloTerminal($cookies.get('themeTerminal'));
		});

		$rootScope.$on('$stateChangeStart', function(event, toState){
			if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion < 10){
				dialogs.error('Error de navegador', 'La aplicación no es compatible con su versión de navegador. Los navegadores compatibles son Mozilla Firefox, Google Chrome y las versiones de IE mayores a 8.');
			}
			if (!loginService.getStatus() && $cookies.get('restoreSesion') === 'true'){
				event.preventDefault();
				authFactory.login().then(function(data){
					$rootScope.socket.emit('login', data.user);
					$rootScope.$broadcast('terminoLogin');
					if (toState.name == 'login') {
						$state.transitionTo('tarifario');
					} else {
						$state.transitionTo(toState.name);
					}
				});
			} else {
				$rootScope.verificaRutas(event, toState);
			}
		});

		$rootScope.verificaRutas = function(event, toState){
			$rootScope.cambioMoneda = !(in_array(toState.name, $rootScope.rutasSinMoneda) || toState.name.indexOf('afip') != -1);
			$rootScope.cambioTerminal = !(in_array(toState.name, $rootScope.rutasSinTerminal) || toState.name.indexOf('afip') != -1);
			if (!in_array(toState.name, $rootScope.rutasComunes)){
				if (loginService.getStatus()){
					if ($cookies.get('isLogged') === 'true'){
						if(!in_array(toState.name, loginService.getAcceso())){
							$rootScope.usuarioNoAutorizado(event);
						}
					} else {
						event.preventDefault();
						$rootScope.salir();
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
