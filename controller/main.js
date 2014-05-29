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

function es_substring(needle, haystack){
	var posicion = haystack.indexOf(needle);
	return posicion != -1;
}

var serverUrl = config.url();

var myapp = angular.module('myapp', ['ui.router','ui.bootstrap', 'ui.bootstrap.modal', 'ngRoute', 'ngSanitize']);

myapp.config(['$httpProvider', function ($httpProvider) {

	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	$httpProvider.defaults.transformRequest = [function (data) {
		/**
		 * The workhorse; converts an object to x-www-form-urlencoded serialization.
		 * @param {Object} obj
		 * @return {String}
		 */
		var param = function (obj) {
			var query = '';
			var name, value, fullSubName, subName, subValue, innerObj, i;

			for (name in obj) {
				value = obj[name];

				if (value instanceof Array) {
					for (i = 0; i < value.length; ++i) {
						subValue = value[i];
						fullSubName = name + '[' + i + ']';
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += param(innerObj) + '&';
					}
				}
				else if (value instanceof Object) {
					for (subName in value) {
						subValue = value[subName];
						fullSubName = name + '[' + subName + ']';
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += param(innerObj) + '&';
					}
				}
				else if (value !== undefined && value !== null) {
					query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
				}
			}

			return query.length ? query.substr(0, query.length - 1) : query;
		};

		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];
}]);

myapp.config(function ($stateProvider, $urlRouterProvider) {

	// For any unmatched url, send to /login
	$urlRouterProvider.otherwise("/login");

	//noinspection JSValidateTypes
	$stateProvider
		.state('login', {
			url: "/login",
			templateUrl: "view/login.html",
			controller: loginCtrl
		})
		.state('tarifario', {
			url: "/pricelist",
			templateUrl: "view/pricelist.html",
			controller: pricelistCtrl
		})
		.state('invoices', {
			url: "/invoices",
			templateUrl: "view/invoices.html",
			controller: invoicesCtrl
		})
		.state('invoices.result', {
			templateUrl: "view/invoices.result.html"
		})
		.state('matches', {
			url: "/match",
			templateUrl: "view/matchprices.html",
			controller: matchPricesCtrl
		})
		.state('control', {
			url: "/control",
			templateUrl: "view/control.html",
			controller: controlCtrl,
			resolve: {
				datosGrafico: function(controlPanelFactory, $q){
					var defer = $q.defer();

					var fecha = new Date();
					controlPanelFactory.getTotales(fecha, function(graf){
						var base = [
//							['Datos', 'Facturas', 'Gates', 'Turnos', { role: 'annotation' } ],
							['Datos', 'Facturas', { role: 'annotation' } ],
//							['BACTSSA', 0, 0, 0, ''],
//							['TRP', 0, 0, 0, ''],
//							['TERMINAL 4', 0, 0, 0, '']
							['BACTSSA', 0, ''],
							['TRP', 0, ''],
							['TERMINAL 4', 0, '']
						];
						var i = 1;
						graf.forEach(function(terminal){
//							base[i] = [terminal.nombre, terminal.invoices, terminal.gates, terminal.turnos, ''];
//							base[i] = [terminal._id.terminal, terminal.invoicesCount, terminal.invoicesCount, terminal.invoicesCount, ''];
							base[i] = [terminal._id.terminal, terminal.invoicesCount,''];
							i++;
						});
						defer.resolve(base);
					});
					return defer.promise;
				},
				datosGraficoFacturas: function (controlPanelFactory, $q){
					var defer = $q.defer();
					var fecha = new Date()
					controlPanelFactory.getFacturasMeses(fecha.getMonth()+1, function(graf){
						var base = [
							['Terminales', 'BACTSSA', 'TRP', 'Terminal 4', 'Promedio', { role: 'annotation'} ]
						];
						var i = 1;
						graf.data.forEach(function(datosMes){
							var fila = [datosMes.mes, 0, 0, 0, 0, ''];
							var acum = 0;
							datosMes.datos.forEach(function(terminal){
								fila[i] = terminal.facturas;
								i++;
								acum += terminal.facturas;
							});
							fila[4] = acum/3;
							base.push(fila);
							i = 1;
						});
						defer.resolve(base);
					});
					return defer.promise;
				},
				datosGraficoGates: function (controlPanelFactory, $q){
					var defer = $q.defer();
					var fecha = new Date();
					controlPanelFactory.getGatesMeses(fecha.getMonth()+1, function(graf){
						var base = [
							['Terminales', 'BACTSSA', 'TRP', 'Terminal 4', 'Promedio', { role: 'annotation'} ]
						];
						var i = 1;
						graf.data.forEach(function(datosMes){
							var fila = [datosMes.mes, 0, 0, 0, 0, ''];
							var acum = 0;
							datosMes.datos.forEach(function(terminal){
								fila[i] = terminal.gates;
								i++;
								acum += terminal.gates;
							});
							fila[4] = acum/3;
							base.push(fila);
							i = 1;
						});
						defer.resolve(base);
					});
					return defer.promise;
				},
				datosGraficoTurnos: function (controlPanelFactory, $q){
					var defer = $q.defer();
					var fecha = new Date();
					controlPanelFactory.getTurnosMeses(fecha.getMonth()+1, function(graf){
						var base = [
							['Terminales', 'BACTSSA', 'TRP', 'Terminal 4', 'Promedio', { role: 'annotation'} ]
						];
						var i = 1;
						graf.data.forEach(function(datosMes){
							var fila = [datosMes.mes, 0, 0, 0, 0, ''];
							var acum = 0;
							datosMes.datos.forEach(function(terminal){
								fila[i] = terminal.turnos;
								i++;
								acum += terminal.turnos;
							})
							fila[4] = acum/3;
							base.push(fila);
							i = 1;
						});
						defer.resolve(base);
					});
					return defer.promise;
				},
				datosFacturadoPorDia: function (controlPanelFactory, $q){
					var defer = $q.defer();
					var fecha = new Date();
					controlPanelFactory.getFacturadoPorDia(fecha, function(graf){
						var base = [
							['Terminales', 'BACTSSA', 'TRP', 'Terminal 4', 'Promedio', { role: 'annotation'} ]
						];
						var i = 1;
						graf.data.forEach(function(datosDia){
							var fila = [datosDia.dia, 0, 0, 0, 0, ''];
							var acum = 0;
							datosDia.datos.forEach(function(terminal){
								fila[i] = terminal.monto;
								i++;
								acum += terminal.monto;
							})
							fila[4] = acum/3;
							base.push(fila);
							i = 1;
						});
						defer.resolve(base);
					});
					return defer.promise;
				}
			}
		})
		.state('cfacturas', {
			url: "/cfacturas",
			templateUrl: "view/cfacturas.html",
			controller: cfacturasCtrl
		})
		.state('cfacturas.result', {
			templateUrl: "view/cfacturas.result.html"
		})
		.state('gates', {
			url: "/gates",
			templateUrl: "view/gates.html",
			controller: gatesCtrl
		})
		.state('gates.invoices', {
			templateUrl: "view/invoices.html"
		})
		.state('gates.invoices.result', {
			templateUrl: "view/invoices.result.html"
		})
		.state('correlativo', {
			url: "/correlatividad",
			templateUrl: "view/correlatividad.html",
			controller: cfacturasCtrl
		})
		.state('correlativo.result', {
			templateUrl: "view/correlatividad.result.html"
		})
		.state('turnos', {
			url: "/turnos",
			templateUrl: "view/turnos.html",
			controller: turnosCtrl
		})
		.state('turnos.result', {
			templateUrl: "view/turnos.result.html"
		})
		.state('changepass', {
			url: "/cambiarpass",
			templateUrl: "view/newpass.html",
			controller: changePassCtrl
		})
		.state('forbidden', {
			url: "/forbidden",
			templateUrl: "view/forbidden.html"
		})
});

myapp.run(function($rootScope, $state, loginService){
	"use strict";
	var rutasComunes = ['login', 'forbidden', 'changepass'];
	$rootScope.$state = $state;
	// Variables Globales de Paginacion
	$rootScope.itemsPerPage = 10;
	$rootScope.currentPage = 1;
	$rootScope.page = { skip:0, limit: $rootScope.itemsPerPage };
	// Variables Globales de Fecha
	$rootScope.dateOptions = { 'showWeeks': false };
	$rootScope.formatDate = 'yyyy-MM-dd';
	$rootScope.openDate = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
	};

	$rootScope.$on('$stateChangeStart', function(event, toState){
		if (!in_array(toState.name, rutasComunes)){
			if (loginService.getStatus()){
				if(!in_array(toState.name, loginService.getAcceso())){
					event.preventDefault();
					$state.transitionTo('forbidden');
				}
			} else {
				event.preventDefault();
				$state.transitionTo('forbidden');
			}
		}
	})
});