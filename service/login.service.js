/**
 * Created by diego on 3/26/14.
 */

myapp.service('loginService', ['generalFunctions', '$cookies', '$http', function (generalFunctions, $cookies, $http) {

	this.logoTerminal = 'images/logo_bactssa.png';
	this.terminalEstilo = 'bootstrap.cerulean';

	this.getStatus = function () {
		return sessionStorage.getItem('loginStatus');
	};

	this.setStatus = function (value) {
		sessionStorage.setItem('loginStatus', value);
	};

	this.getToken = function () {
		return sessionStorage.getItem('token');
	};

	this.setToken = function (value) {
		sessionStorage.setItem('token', value);
	};

	this.setType = function (value) {
		sessionStorage.setItem('type', value);
	};

	this.getType = function () {
		if (sessionStorage.getItem('type')){
			return sessionStorage.getItem('type');
		} else {
			return '';
		}

	};

	this.setGroup = function (value) {
		sessionStorage.setItem('group', value);
	};

	this.getGroup = function () {
		return sessionStorage.getItem('group');
	};

	this.setAcceso = function(rutas) {

		if (generalFunctions.in_array('cfacturas', rutas)){
			var controlComprobantes = ['cfacturas.tasas', 'cfacturas.correlatividad', 'cfacturas.codigos', 'cfacturas.revisar', 'cfacturas.erroneos', 'cfacturas.reenviar'];
			for (var i=0; i<controlComprobantes.length; i++ ){
				rutas.push(controlComprobantes[i]);
			}
		}
		if (generalFunctions.in_array('reports', rutas)){
			var reportes = ['reports.tasas', 'reports.tarifas', 'reports.empresas', 'reports.terminales'];
			for (var j = 0; j < reportes.length; j++){
				rutas.push(reportes[j]);
			}
		}
		if (generalFunctions.in_array('cgates', rutas)){
			var controlGates = ['cgates.gates', 'cgates.invoices', 'cgates.appointments'];
			for (var k = 0; k < controlGates.length; k++){
				rutas.push(controlGates[k]);
			}
		}

		sessionStorage.acceso = JSON.stringify(rutas);
	};

	this.getAcceso = function() {
		if (sessionStorage.acceso){
			return JSON.parse(sessionStorage.acceso);
		} else {
			return [];
		}
	};

	this.setInfo = function (value) {
		sessionStorage.userData = JSON.stringify(value);
	};

	this.getInfo = function () {
		if (sessionStorage.userData){
			return JSON.parse(sessionStorage.userData);
		} else {
			return {};
		}

	};

	this.setFiltro = function(value) {
		sessionStorage.setItem('filtro', value);
		$cookies.put('themeTerminal', value);
		switch (value){
			case 'BACTSSA':
				this.terminalEstilo = 'bootstrap.cerulean';
				this.logoTerminal = 'images/logo_bactssa.png';
				break;
			case 'TERMINAL4':
				this.terminalEstilo = 'bootstrap.united';
				this.logoTerminal = 'images/logo_terminal4.png';
				break;
			case 'TRP':
				this.terminalEstilo = 'bootstrap.flaty';
				this.logoTerminal = 'images/logo_trp.png';
				break;
		}
	};

	this.getFiltro = function() {
		return sessionStorage.getItem('filtro');
	};

	this.unsetLogin = function(){
		sessionStorage.clear();
		this.setFiltro('BACTSSA');
	};

	this.setHeaders = function(){
		$http.defaults.headers.common.token = this.getToken();
	}

}]);