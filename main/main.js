/**
 * Created by kolesnikov-a on 21/02/14.
 */

//google.charts.load('current', {'packages':['corechart'], 'language': 'es'});

var myapp = angular.module('myapp', ['ui.router', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'ngSanitize', 'ngCookies', 'multi-select', 'angular-cache', 'cgNotify', 'btford.socket-io', 'ngAnimate', 'ngTagsInput']);

myapp.constant('uiDatetimePickerConfig', {
	dateFormat: 'yyyy-MM-dd HH:mm',
	defaultTime: '00:00:00',
	html5Types: {
		date: 'yyyy-MM-dd',
		'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
		'month': 'yyyy-MM'
	},
	initialPicker: 'date',
	reOpenDefault: false,
	enableDate: true,
	enableTime: true,
	buttonBar: {
		show: true,
		now: {
			show: true,
			text: 'Ahora',
			cls: 'btn-sm btn-success'
		},
		today: {
			show: true,
			text: 'Hoy',
			cls: 'btn-sm btn-success'
		},
		clear: {
			show: true,
			text: 'Borrar',
			cls: 'btn-sm btn-danger'
		},
		date: {
			show: true,
			text: 'Fecha',
			cls: 'btn-sm btn-primary'
		},
		time: {
			show: true,
			text: 'Hora',
			cls: 'btn-sm btn-primary'
		},
		close: {
			show: true,
			text: 'Listo',
			cls: 'btn-sm btn-default'
		},
		cancel: {
			show: false
		}
	},
	closeOnDateSelection: true,
	closeOnTimeNow: true,
	appendToBody: false,
	altInputFormats: [],
	ngModelOptions: { },
	saveAs: false,
	readAs: false
});

myapp.config(['$qProvider', function ($qProvider) {
	$qProvider.errorOnUnhandledRejections(false);
}]);

myapp.config(['$httpProvider', function ($httpProvider) {

	$httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

}]);

//Configuración para interceptar respuestas http y tratar errores
myapp.config(['$provide', '$httpProvider', function($provide, $httpProvider){

	// register the interceptor as a service
	$provide.factory('myHttpInterceptor', ['$rootScope', '$q',
		function($rootScope, $q) {
			return {
				// optional method
				'request': function(config) {
					return config;
				},
				// optional method
				'requestError': function(rejection) {
					// do something on error

					/*if (canRecover(rejection)) {
					 return responseOrNewPromise
					 }*/
					return $q.reject(rejection);
				},
				// optional method
				'response': function(response) {
					// do something on success
					return response;
				},
				// optional method
				'responseError': function(rejection) {
					//TODO config custom messages for http Error status
					//console.log(rejection);
					/*if (rejection.status == 401){
						if (rejection.config.url != configService.serverUrl + '/login'){
							$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
							var deferred = $q.defer();
							var req = {
								config: rejection.config,
								deferred: deferred
							};
							$rootScope.requests401.push(req);

							return deferred.promise;
							//$state.transitionTo('login');
						}
					}

					/*if (rejection.status == -1) rejection.data = { message: 'No se ha podido establecer comunicación con el servidor.', status: 'ERROR' };
					// do something on error
					/*if (canRecover(rejection)) {
					 return responseOrNewPromise
					 }*/
					if (rejection.data == null){
						rejection.data = {
							status: 'ERROR',
							message: 'Fallo de comunicación con el servidor'
						};
					}
					if (angular.isDefined(rejection.config.timeout)){
						if (rejection.config.timeout.$$state.value == 'canceled'){
							rejection.status = -5;
						}
					}
					return $q.reject(rejection);
				}
			};
		}]);

	$httpProvider.interceptors.push('myHttpInterceptor');

}]);

//Configuración de todas las rutas de la app
myapp.config(['$stateProvider', '$urlRouterProvider', '$provide', 'cacheServiceProvider', function ($stateProvider, $urlRouterProvider, $provide, cacheServiceProvider) {

	const initialLoadFactory = cacheServiceProvider.$get();

	$provide.decorator("$exceptionHandler", ['$delegate', '$injector', function($delegate, $injector){
		return function(exception, cause){
			const $rootScope = $injector.get("$rootScope");
			$rootScope.addError({message:"Exception", reason:exception});
			$delegate(exception, cause);
		};
	}]);

	// For any unmatched url, send to /login
	//$urlRouterProvider.otherwise("/login");
	$urlRouterProvider.otherwise( function($injector, $location) {
		const $state = $injector.get("$state");
		$state.go("login");
	});

	//noinspection JSValidateTypes
	$stateProvider
		//=============================================================\\
		//************************* LOGIN *****************************\\
		//=============================================================\\
		.state('login', {
			url: "/login",
			templateUrl: "view/login/login.html",
			controller: "loginCtrl as vmLogin"
		})
		.state('register', {
			url: "/registro",
			templateUrl: "view/login/registro.html",
			controller: "registerCtrl"
		})
		.state('changepass', {
			url: "/cambiarpass",
			templateUrl: "view/login/cambio.password.html",
			controller: "changePassCtrl as newPassVm",
			resolve: {
				ratesMatches: function(){ return initialLoadFactory.cargaMatchesRates() }
			}
		})
		.state('validar', {
			url: "/validarUsuario",
			templateUrl: "view/login/validar.usuario.html",
			controller: "validarUsuarioCtrl" //TODO tal vez necesite ratesMatches, revisarlo...
		})
		//================================================================\\
		//************************** TARIFARIO ***************************\\
		//=================================================================\\
		.state('tarifario', {
			url: "/pricelist",
			templateUrl: "view/tarifario/tarifario.html",
			controller: "pricelistCtrl",
			resolve: {
				unitTypes: function(){
					return initialLoadFactory.cargaUnidades()
				}
			}
		})
		.state('matches', {
			url: "/match",
			templateUrl: "view/tarifario/tarifario.editar.html",
			controller: 'matchPricesCtrl',
			resolve: {
				unitTypes: function(){ return initialLoadFactory.cargaUnidades() }
			}
		})
		.state('modificarTarifario', {
			parent: 'matches',
			url: "/editarTarifario",
			templateUrl: "view/tarifario/tarifario.editar.nuevo.html"

		})
		.state('agrupar', {
			url: "/agrupaciones",
			templateUrl: "view/tarifario/tarifario.agrupar.html",
			controller: 'agruparTarifarioCtrl as vmAgrupar'
		})
		//=======================================================\\
		//**************** COMPROBANTES *************************\\
		//=======================================================\\
		.state('invoices', {
			url: "/comprobantes",
			templateUrl: "view/comprobantes/comprobantes.html",
			controller: "invoicesCtrl",
			resolve: {
				unitTypes: function(){ return initialLoadFactory.cargaUnidades() },
				//buques: initialLoadFactory.cargaBuques,
				//trenes: initialLoadFactory.cargaTrenes,
				//clientes: initialLoadFactory.cargaClientes,
				vouchers: function(){ return initialLoadFactory.cargaVouchers() },
				estados: function(){ return initialLoadFactory.cargaEstados() },
				matches: function(){ return initialLoadFactory.cargaMatchesArray() },
				ratesMatches: function(){ return initialLoadFactory.cargaMatchesRates() },
				descripciones: function(){ return initialLoadFactory.cargaDescripciones() }
			}
		})
		.state('cfacturas', {
			url: "/controlComprobantes",
			templateUrl: "view/comprobantes/comprobantes.control.html",
			controller: 'controlComprobantesCtrl',
			resolve: {
				unitTypes: function(){ return initialLoadFactory.cargaUnidades() },
				//buques: initialLoadFactory.cargaBuques,
				//trenes: initialLoadFactory.cargaTrenes,
				//clientes: initialLoadFactory.cargaClientes,
				vouchers: function(){ return initialLoadFactory.cargaVouchers() },
				estados: function(){ return initialLoadFactory.cargaEstados() },
				matches: function(){ return initialLoadFactory.cargaMatchesArray() },
				ratesMatches: function(){ return initialLoadFactory.cargaMatchesRates() },
				descripciones: function(){ return initialLoadFactory.cargaDescripciones() }
			},
			redirectTo: 'cfacturas.correlatividad'
		})
		.state('cfacturas.tasas', {
				url: '/tasas',
				templateUrl: 'view/comprobantes/control.tasas.html',
				controller: 'tasaCargasCtrl'
			})
		.state('cfacturas.correlatividad', {
				url: '/correlatividad',
				templateUrl: 'view/comprobantes/control.correlatividad.html',
				controller: 'correlatividadCtrl'
			})
		.state('cfacturas.codigos', {
				url: '/codigos',
				templateUrl: 'view/comprobantes/control.codigos.html',
				controller: 'codigosCtrl'
			})
		.state('cfacturas.revisar', {
				url: '/revisar',
				templateUrl: 'view/comprobantes/control.revisar.html'
			})
		.state('cfacturas.erroneos', {
				url: '/erroneos',
				templateUrl: 'view/comprobantes/control.erroneos.html'
			})
		.state('cfacturas.reenviar', {
				url: '/reenviar',
				templateUrl: 'view/comprobantes/control.reenviar.html'
			})
		//===================================================================\\
		//*********************** GATES *************************************\\
		//===================================================================\\
		.state('gates', {
			url: "/gates",
			templateUrl: "view/gates/gates.html",
			controller: "gatesCtrl",
			resolve: {
				unitTypes: function(){ return initialLoadFactory.cargaUnidades() },
				//buques: initialLoadFactory.cargaBuques,
				//trenes: initialLoadFactory.cargaTrenes,
				//clientes: initialLoadFactory.cargaClientes,
				vouchers: function(){ initialLoadFactory.cargaVouchers() },
				estados: function(){ return initialLoadFactory.cargaEstados() },
				matches: function(){ return initialLoadFactory.cargaMatchesArray() },
				ratesMatches: function(){ return initialLoadFactory.cargaMatchesRates() },
				descripciones: function(){ return initialLoadFactory.cargaDescripciones() }
			}
		})
		.state('cgates', {
			url: '/controlGates',
			templateUrl: 'view/gates/gates.control.html',
			controller: 'controlGatesCtrl',
			resolve: {
				unitTypes: function(){ return initialLoadFactory.cargaUnidades() },
				//buques: initialLoadFactory.cargaBuques,
				//trenes: initialLoadFactory.cargaTrenes,
				//clientes: initialLoadFactory.cargaClientes,
				vouchers: function(){ return initialLoadFactory.cargaVouchers() },
				estados: function(){ return initialLoadFactory.cargaEstados() },
				matches: function(){ return initialLoadFactory.cargaMatchesArray() },
				ratesMatches: function(){ return initialLoadFactory.cargaMatchesRates() },
				descripciones: function(){ return initialLoadFactory.cargaDescripciones() }
			},
			redirectTo: 'cgates.gates'
		})
		.state('cgates.gates', {
				url: '/gatesFaltantes',
				templateUrl: 'view/gates/gates.control.faltantes.html'
			})
		.state('cgates.invoices', {
				url: '/comprobantesFaltantes',
				templateUrl: 'view/gates/gates.control.sinFacturacion.html'
			})
		.state('cgates.appointments', {
				url: '/turnosFaltantes',
				templateUrl: 'view/gates/gates.control.sinTurnos.html'
			})
		//=========================================================================\\
		//******************************* TURNOS **********************************\\
		//=========================================================================\\
		.state('turnos', {
			url: "/turnos",
			templateUrl: "view/turnos/turnos.html",
			controller: "turnosCtrl",
			resolve: {
				ratesMatches: function(){ return initialLoadFactory.cargaMatchesRates() },
				estados: function(){ return initialLoadFactory.cargaEstados() }
			}
		})
		.state('cturnos', {
			url: "/colaTurnos",
			templateUrl: 'view/turnos/turnos.sinNotificar.html',
			controller: "queuedMailsCtrl",
			resolve: {
				ratesMatches: function(){ return initialLoadFactory.cargaMatchesRates() }
			}
		})
		//TODO controlar lo que devuelve el servidor
		.state('mturnos', {
			url: "/controlTurnos",
			templateUrl: "view/turnos/turnos.control.html"
		})
		.state('consultaTurnos', {
			url: '/consultaTurnos',
			templateUrl: 'view/turnos/turnos.consulta.html',
			controller: 'turnosConsultaCtrl as vmTurnos',
			resolve: {
				containersList: function(){ return initialLoadFactory.cargaContainersList() },
				patentesList: function(){ return initialLoadFactory.cargaPatentesList() }
			}
		})
		//===========================================================================\\
		//******************************* REPORTES **********************************\\
		//===========================================================================\\
		.state('control', {
			url: "/control",
			templateUrl: "view/reportes/control.html",
			controller: "controlCtrl",
			resolve: {
				ratesMatches: function(){ return initialLoadFactory.cargaMatchesRates() },
				descripciones: function(){ return initialLoadFactory.cargaDescripciones() }
			}
		})
		.state('reports', {
			url: "/reportes",
			templateUrl:"view/reportes/reportes.html",
			controller: 'reportsCtrl',
			redirectTo: 'reports.tasas'
		})
		.state('reports.tasas', {
			url:'/tasas',
			templateUrl: 'view/reportes/reportes.tasas.html',
			controller: 'ratesCtrl',
			resolve: {
				unitTypes: function(){ return initialLoadFactory.cargaUnidades() },
				descripciones: function(){ return initialLoadFactory.cargaDescripciones() },
				ratesMatches: function(){ return initialLoadFactory.cargaMatchesRates() },
				allRates: function(){ return initialLoadFactory.cargaAllRates() },
				estados: function(){ return initialLoadFactory.cargaEstados() }
			}
		})
		.state('reports.tarifas', {
			url: '/tarifas',
			templateUrl: 'view/reportes/reportes.tarifas.new.html',
			controller: 'reporteCuboCtrl as vmCubo',
			resolve: {
				ratesMatches: function(){ return initialLoadFactory.cargaMatchesRates() }
			}
		})
		.state('reports.empresas', {
			url: '/empresas',
			templateUrl: 'view/reportes/reportes.empresas.html',
			controller: 'facturacionPorEmpresaCtrl',
			resolve: {
				clientes: function(){ return initialLoadFactory.cargaClientes() },
				descripciones: function(){ return initialLoadFactory.cargaDescripciones() },
				ratesMatches: function(){ return initialLoadFactory.cargaMatchesRates() },
				estados: function(){ return initialLoadFactory.cargaEstados() }
			}
		})
		.state('reports.terminales', {
			url: '/terminales',
			templateUrl: 'view/reportes/reportes.terminales.html',
			controller: 'tarifasTerminalesCtrl',
			resolve: {
				ratesMatches: function(){ return initialLoadFactory.cargaMatchesRates() }
			}
		})
		//TODO ver si este reporte necesita algún resolve
		.state('reports.containers', {
			url: '/contenedores',
			templateUrl: 'view/reportes/reportes.contenedores.html',
			controller: 'reporteContenedorCtrl'
		})
		//========================================================================\\
		//************************* CONTENEDORES *********************************\\
		//========================================================================\\
		.state('container',{
			url: "/contenedor?container",
			params: {
				container: null
			},
			templateUrl: "view/contenedores/contenedor.html",
			controller: "buqueViajeCtrl",
			resolve: {
				unitTypes: function(){ return initialLoadFactory.cargaUnidades() },
				//buques: initialLoadFactory.cargaBuques,
				//trenes: initialLoadFactory.cargaTrenes,
				//clientes: initialLoadFactory.cargaClientes,
				vouchers: function(){ return initialLoadFactory.cargaVouchers() },
				estados: function(){ return initialLoadFactory.cargaEstados() },
				matches: function(){ return initialLoadFactory.cargaMatchesArray() },
				ratesMatches: function(){ return initialLoadFactory.cargaMatchesRates() },
				descripciones: function(){ return initialLoadFactory.cargaDescripciones() }
			}
		})
		.state('buque',{
			url: "/buqueViaje",
			templateUrl: "view/contenedores/buque.viaje.html",
			resolve: {
				unitTypes: function(){ return initialLoadFactory.cargaUnidades() },
				buques: function(){ return initialLoadFactory.cargaBuqueViajes() },
				//trenes: initialLoadFactory.cargaTrenes,
				//clientes: initialLoadFactory.cargaClientes,
				vouchers: function(){ return initialLoadFactory.cargaVouchers() },
				estados: function(){ return initialLoadFactory.cargaEstados() },
				matches: function(){ return initialLoadFactory.cargaMatchesArray() },
				ratesMatches: function(){ return initialLoadFactory.cargaMatchesRates() },
				descripciones: function(){ return initialLoadFactory.cargaDescripciones() }
			}
		})
		//=====================================================================\\
		//************************** AFIP *************************************\\
		//=====================================================================\\
		.state('afip', {
			url: "/afip",
			templateUrl: "view/afip/afip.html",
			controller: "afipCtrl",
			resolve: {
				sumImpoBuques: function(){ return initialLoadFactory.cargaSumariaImpoBuques() },
				sumExpoBuques: function(){ return initialLoadFactory.cargaSumariaExpoBuques() },
				solicitudBuques: function(){ return initialLoadFactory.cargaSolicitudBuques() },
				afectacionBuques: function(){ return initialLoadFactory.cargaAfectacionBuques() }
			}
		})
		.state('afip.afectacion.afectacion1', {
			templateUrl: "view/afip/afip.afectacion1.html"
		})
		.state('afip.afectacion.afectacion2', {
			templateUrl: "view/afip/afip.afectacion2.html"
		})
		.state('afip.detalle.detimpo1', {
			templateUrl: "view/afip/afip.detimpo1.html"
		})
		.state('afip.detalle.detimpo2', {
			templateUrl: "view/afip/afip.detimpo2.html"
		})
		.state('afip.detalle.detimpo3', {
			templateUrl: "view/afip/afip.detimpo3.html"
		})
		.state('afip.detalle.detexpo1', {
			templateUrl: "view/afip/afip.detexpo1.html"
		})
		.state('afip.detalle.detexpo2', {
			templateUrl: "view/afip/afip.detexpo2.html"
		})
		.state('afip.detalle.detexpo3', {
			templateUrl: "view/afip/afip.detexpo3.html"
		})
		.state('afip.sumatorias.expo1', {
			templateUrl: "view/afip/afip.expo1.html"
		})
		.state('afip.sumatorias.expo2', {
			templateUrl: "view/afip/afip.expo2.html"
		})
		.state('afip.sumatorias.expo3', {
			templateUrl: "view/afip/afip.expo3.html"
		})
		.state('afip.sumatorias.expo4', {
			templateUrl: "view/afip/afip.expo4.html"
		})
		.state('afip.sumatorias.expo5', {
			templateUrl: "view/afip/afip.expo5.html"
		})
		.state('afip.sumatorias.impo1', {
			templateUrl: "view/afip/afip.impo1.html"
		})
		.state('afip.sumatorias.impo2', {
			templateUrl: "view/afip/afip.impo2.html"
		})
		.state('afip.sumatorias.impo3', {
			templateUrl: "view/afip/afip.impo3.html"
		})
		.state('afip.sumatorias.impo4', {
			templateUrl: "view/afip/afip.impo4.html"
		})
		.state('afip.solicitud.solicitud1', {
			templateUrl: "view/afip/afip.solicitud1.html"
		})
		.state('afip.solicitud.solicitud2', {
			templateUrl: "view/afip/afip.solicitud2.html"
		})
		.state('afip.solicitud.solicitud3', {
			templateUrl: "view/afip/afip.solicitud3.html"
		})
		.state('afip.removido.removido1', {
			templateUrl: "view/afip/afip.removido1.html"
		})
		.state('afip.removido.removido2', {
			templateUrl: "view/afip/afip.removido2.html"
		})
		.state('afip.removido.removido3', {
			templateUrl: "view/afip/afip.removido3.html"
		})
		.state('afip.afectacion', {
			templateUrl: "view/afip/afip.afectacion.html"
		})
		.state('afip.detalle', {
			templateUrl: "view/afip/afip.detalle.html"
		})
		.state('afip.solicitud', {
			templateUrl: "view/afip/afip.solicitud.html"
		})
		.state('afip.sumatorias', {
			templateUrl: "view/afip/afip.sumatorias.html"
		})
		.state('afip.removido', {
			templateUrl: "view/afip/afip.removido.html"
		})
		.state('afip.transbordos', {
			templateUrl: "view/afip/afip.transbordos.html"
		})
		.state('afip.transbordos.impo', {
			templateUrl: "view/afip/table.transbordos.html"
		})
		.state('afip.transbordos.expo', {
			templateUrl: "view/afip/table.transbordos.html"
		})
		//===============================================================\\
		//************************ SEGURIDAD ****************************\\
		//===============================================================\\
		.state('users', {
			url: "/users",
			templateUrl: "view/seguridad/usuarios.html",
			controller: "usersCtrl"
		})
		.state('access', {
			url: "/controlAcceso",
			templateUrl: 'view/seguridad/control.acceso.html',
			controller: "accessControlCtrl"
		})
		.state('forbidden', {
			url: "/sinAcceso",
			templateUrl: "view/seguridad/prohibido.html"
		})
		//====================================================================\\
		//************************* LIQUIDACIONES ****************************\\
		//====================================================================\\
		.state('liquidaciones', {
			url: "/liquidaciones",
			templateUrl: "view/liquidaciones/liquidaciones.html",
			controller: "liquidacionesCtrl",
			resolve: {
				unitTypes: function(){ return initialLoadFactory.cargaUnidades() },
				//buques: initialLoadFactory.cargaBuques,
				//trenes: initialLoadFactory.cargaTrenes,
				//clientes: initialLoadFactory.cargaClientes,
				vouchers: function(){ return initialLoadFactory.cargaVouchers() },
				estados: function(){ return initialLoadFactory.cargaEstados() },
				matches: function(){ return initialLoadFactory.cargaMatchesArray() },
				ratesMatches: function(){ return initialLoadFactory.cargaMatchesRates() },
				descripciones: function(){ return initialLoadFactory.cargaDescripciones() }
			}
		})
		//TODO Esta vista no se está usando en realidad, no está la parte del servidor
		.state('mat', {
			url: "/mat",
			templateUrl: "view/liquidaciones/mat.html"
		})
}]);

myapp.config(['$cookiesProvider', function($cookiesProvider){
	var hoy = new Date();

	$cookiesProvider.defaults.expires = new Date(hoy.getFullYear(), hoy.getMonth()+1, hoy.getDate());
}]);

myapp.constant('TERMINAL_COLORS', {
	BACTSSA: 'rgb(47, 164, 231)',
	TERMINAL4: 'rgb(221, 72, 20)',
	TRP: 'rgb(44, 62, 80)'
});

myapp.run(['$rootScope', '$state', 'loginService', 'authFactory', 'dialogs', '$injector', '$cookies', 'appSocket', '$http', 'generalFunctions',
	function($rootScope, $state, loginService, authFactory, dialogs, $injector, $cookies, appSocket, $http, generalFunctions){ //El app socket está simplemente para que inicie la conexión al iniciar la aplicación

		$rootScope.pageTitle = 'Administración General de Puertos S.E.';
		$rootScope.socket = appSocket;

		$rootScope.socket.connect();

		$rootScope.appointmentNotify = 0;
		$rootScope.gateNotify = 0;
		$rootScope.invoiceNotify = 0;

		$rootScope.verNotificaciones = true;

		$rootScope.loadingNewView = false;

		$rootScope.dataTerminal = loginService;

		$rootScope.ordenarPor = function(filtro){
			if ($rootScope.predicate == filtro){
				$rootScope.reverse = !$rootScope.reverse;
			}
			$rootScope.predicate = filtro;
		};

		$rootScope.cambioMoneda = true;
		$rootScope.cambioTerminal = true;

		if (loginService.isLoggedIn) loginService.setHeaders();

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

		$rootScope.rutasComunes = ['login', 'forbidden', 'changepass', 'register', 'consultaTurnos'];
		$rootScope.rutasSinMoneda = ['reports', 'afip', 'tarifario', 'matches', 'turnos', 'users', 'agenda', 'access', 'control', 'cturnos', 'mat', 'liquidaciones', 'trackContainer'];
		$rootScope.rutasSinTerminal = ['control', 'afip', 'mat', 'access', 'users', 'cturnos', 'trackContainer'];
		$rootScope.$state = $state;
		// Variables Globales de Paginacion
		$rootScope.itemsPerPage = 15;
		$rootScope.currentPage = 1;
		$rootScope.page = { skip:0, limit: $rootScope.itemsPerPage };

		$rootScope.salir = function(){
			if (loginService.isLoggedIn) $rootScope.socket.emit('logoff', loginService.info.user);
			authFactory.logout();
			$rootScope.appointmentNotify = 0;
			$rootScope.invoiceNotify = 0;
			$rootScope.gateNotify = 0;
			$rootScope.$broadcast('logout');
			$state.transitionTo('login');
			//$rootScope.setEstiloTerminal('BACTSSA');
		};


		$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from) {
			$rootScope.inTrackContainer = to.name == 'trackContainer';
			loginService.filterTerminal = $cookies.get('themeTerminal');
			$rootScope.loadingNewView = false;
		});

		$rootScope.$on('$stateChangeStart', function(event, toState){
			if (toState.redirectTo){
				event.preventDefault();
				$state.transitionTo(toState.redirectTo);
			}

			$rootScope.loadingNewView = true;
			if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion < 10){
				dialogs.error('Error de navegador', 'La aplicación no es compatible con su versión de navegador. Los navegadores compatibles son Mozilla Firefox, Google Chrome y las versiones de IE mayores a 8.');
			}
			if (!loginService.isLoggedIn && $cookies.get('restoreSesion') === 'true'){
				event.preventDefault();
				authFactory.login().then(function(data){
					$rootScope.socket.emit('login', data.user);
					//$rootScope.$broadcast('terminoLogin');
					if (toState.name == 'login') {
						$state.transitionTo('tarifario');
					} else {
						$state.transitionTo(toState.name);
					}
				}, function(err){
					//console.log(err);
					dialogs.error('Error', err.message);
					$rootScope.salir();
				});
			} else {
				$rootScope.verificaRutas(event, toState);
			}
		});

		$rootScope.verificaRutas = function(event, toState){
			$rootScope.cambioMoneda = !(generalFunctions.in_array(toState.name, $rootScope.rutasSinMoneda) || toState.name.indexOf('afip') != -1);
			$rootScope.cambioTerminal = !(generalFunctions.in_array(toState.name, $rootScope.rutasSinTerminal) || toState.name.indexOf('afip') != -1);
			if (!generalFunctions.in_array(toState.name, $rootScope.rutasComunes)){
				if (loginService.isLoggedIn){
					if ($cookies.get('isLogged') === 'true'){
						if(!generalFunctions.in_array(toState.name, loginService.acceso)){
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
