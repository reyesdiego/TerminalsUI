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

var serverUrl = config.url();

var myapp = angular.module('myapp', ['ui.router','ui.bootstrap', 'ngSanitize', 'ngCookies']);

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
			templateUrl: "view/login.html"
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
		.state('invoices.result', {
			templateUrl: "view/invoices.result.html"
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
				datosGrafico: controlCtrl.primerCargaComprobantes,
				datosGraficoPorMes: controlCtrl.prepararMatrizVacía,
				datosFacturadoPorDiaTasas: controlCtrl.prepararMatrizTasas,
				datosGraficoGatesTurnosDias: controlCtrl.prepararMatrizVaciaGatesTurnos
			}
		})
		.state('cfacturas', {
			url: "/cfacturas",
			templateUrl: "view/cfacturas.html"
		})
		.state('cfacturas.result', {
			templateUrl: "view/invoices.result.html"
		})
		.state('gates', {
			url: "/gates",
			templateUrl: "view/gates.html"
		})
		.state('gates.invoices', {
			templateUrl: "view/invoices.html"
		})
		.state('gates.invoices.result', {
			templateUrl: "view/invoices.result.html"
		})
		.state('turnos', {
			url: "/turnos",
			templateUrl: "view/turnos.html"
		})
		.state('changepass', {
			url: "/cambiarpass",
			templateUrl: "view/newpass.html"
		})
		.state('forbidden', {
			url: "/forbidden",
			templateUrl: "view/forbidden.html"
		})
		.state('reports', {
			url: "/reportes",
			templateUrl:"view/reportes.html",
			controller: "reportsCtrl"
		})
});

myapp.run(function($rootScope, $state, loginService, $http, vouchersFactory, authFactory){
	"use strict";

	// Carga la sesion por cookies
	if (!loginService.getStatus() && authFactory.userEstaLogeado()){
		authFactory.login().then(function(){
			$rootScope.estaLogeado = true;
		});
	}

	$rootScope.colorBactssa = '';
	$rootScope.colorTerminal4 = '';
	$rootScope.colorTrp = '';

	var styles=document.styleSheets;
	for(var i=0,l=styles.length; i<l; ++i){
		var sheet=styles[i];

		if(sheet.title === "BACTSSA"){
			var rules=sheet.cssRules;
			for(var j=0, l2=rules.length; j<l2; j++){
				var rule=rules[j];

				if('.navbar-default' === rule.selectorText){
					$rootScope.colorBactssa = rule.style['backgroundColor'];
				}
			}
		}
		if(sheet.title === "TRP"){
			var rules=sheet.cssRules;
			for(var j=0, l2=rules.length; j<l2; j++){
				var rule=rules[j];

				if('.navbar-default' === rule.selectorText){
					$rootScope.colorTrp = rule.style['backgroundColor'];
				}
			}
		}
		if(sheet.title === "TERMINAL4"){
			var rules=sheet.cssRules;
			for(var j=0, l2=rules.length; j<l2; j++){
				var rule=rules[j];

				if('.navbar-default' === rule.selectorText){
					$rootScope.colorTerminal4 = rule.style['backgroundColor'];
				}
			}
		}
	}

	$rootScope.moneda = "PES";

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
	$rootScope.isDefined = function(element){
		return angular.isDefined(element);
	};

	$rootScope.conversionMoneda = function(importe, codMoneda, cotiMoneda){
		if ($rootScope.moneda == 'PES' && codMoneda == 'DOL'){
			return (importe * cotiMoneda);
		} else if ($rootScope.moneda == 'DOL' && codMoneda == 'PES'){
			return (importe / cotiMoneda);
		} else {
			return (importe);
		}
	};

	vouchersFactory.getVouchersArray(function(data){
		$rootScope.vouchersType = data.data;
	});

	$rootScope.switchTheme = function(title){
		var i, a;
		for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
			if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
				a.disabled = a.getAttribute("title") != title;
			}
		}
	};

	$rootScope.$on('$stateChangeStart', function(event, toState){
		if (!loginService.getStatus() && authFactory.userEstaLogeado()){
			authFactory.login().then(function(){
				$rootScope.verificaRutas(event, toState);
			});
		} else {
			$rootScope.verificaRutas(event, toState);
		}
	});

	$rootScope.verificaRutas = function(event, toState){
		if (!in_array(toState.name, rutasComunes)){
			if (loginService.getStatus()){
				if(!in_array(toState.name, loginService.getAcceso())){
					$rootScope.usuarioNoAutorizado(event);
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
});