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
			rutas = [...rutas, ...['cfacturas.tasas', 'cfacturas.correlatividad', 'cfacturas.codigos', 'cfacturas.revisar', 'cfacturas.erroneos', 'cfacturas.reenviar']];
		}
		if (generalFunctions.in_array('reports', rutas)){
			rutas = [...rutas, ...['reports.tasas', 'reports.tarifas', 'reports.empresas', 'reports.terminales']];
		}
		if (generalFunctions.in_array('cgates', rutas)){
			rutas = [...rutas, ...['cgates.gates', 'cgates.invoices', 'cgates.appointments']];
		}
		rutas.push('trackContainer');

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