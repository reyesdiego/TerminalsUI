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

var myapp = angular.module('myapp', ['ui.router','ui.bootstrap', 'ngSanitize']);

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
			controller: "ControlCtrl",
			resolve: { //Los datos de los gráficos deben venir cargados antes de llamar a la vista, por eso se utiliza el resolve
				datosGrafico: controlCtrl.primerCargaComprobantes,
				datosGraficoPorMes: controlCtrl.prepararMatrizVacía,
				datosFacturadoPorDiaTasas: controlCtrl.prepararMatrizTasas
			}
		})
		.state('cfacturas', {
			url: "/cfacturas",
			templateUrl: "view/cfacturas.html",
			controller: cfacturasCtrl
		})
		.state('cfacturas.result', {
			templateUrl: "view/invoices.result.html"
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
		.state('changepass', {
			url: "/cambiarpass",
			templateUrl: "view/newpass.html",
			controller: changePassCtrl
		})
		.state('forbidden', {
			url: "/forbidden",
			templateUrl: "view/forbidden.html"
		})
		.state('reports', {
			url: "/reportes",
			templateUrl:"view/reportes.html",
			controller: "ReportsCtrl",
			resolve: { //Los datos de los gráficos deben venir cargados antes de llamar a la vista, por eso se utiliza el resolve
				matrizVaciaBarras: reportsCtrl.prepararMatrizVaciaBarras,
				matrizVaciaTorta: reportsCtrl.prepararMatrizVaciaTorta
			}
		})
});

myapp.run(function($rootScope, $state, loginService, $http, vouchersFactory){
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

	vouchersFactory.getVouchersArray(function(data){
		$rootScope.vouchersType = data.data;
	})

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