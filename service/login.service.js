/**
 * Created by diego on 3/26/14.
 */

myapp.service('loginService', ['generalFunctions', '$cookies', '$http', function (generalFunctions, $cookies, $http) {

	class loginService {
		constructor(){
			this.logoTerminal = 'images/logo_bactssa.png';
			this.terminalEstilo = 'bootstrap.cerulean';
		}

		get isLoggedIn(){
			return sessionStorage.getItem('loginStatus');
		}

		set isLoggedIn(value){
			sessionStorage.setItem('loginStatus', value);
		}

		get token(){
			return sessionStorage.getItem('token');
		}

		set token(value){
			sessionStorage.setItem('token', value);
		}

		get type(){
			if (sessionStorage.getItem('type')){
				return sessionStorage.getItem('type');
			} else {
				return '';
			}
		}

		set type(value){
			sessionStorage.setItem('type', value);
		}

		get group(){
			return sessionStorage.getItem('group');
		}

		set group(value){
			sessionStorage.setItem('group', value);
		}

		get acceso(){
			if (sessionStorage.acceso){
				return JSON.parse(sessionStorage.acceso);
			} else {
				return [];
			}
		}

		set acceso(rutas){
			if (generalFunctions.in_array('cfacturas', rutas)){
				const controlComprobantes = ['cfacturas.tasas', 'cfacturas.correlatividad', 'cfacturas.codigos', 'cfacturas.revisar', 'cfacturas.erroneos', 'cfacturas.reenviar'];
				for (let i=0; i<controlComprobantes.length; i++ ){
					rutas.push(controlComprobantes[i]);
				}
			}
			if (generalFunctions.in_array('reports', rutas)){
				const reportes = ['reports.tasas', 'reports.tarifas', 'reports.empresas', 'reports.terminales', 'reports.containers'];
				for (let j = 0; j < reportes.length; j++){
					rutas.push(reportes[j]);
				}
			}
			if (generalFunctions.in_array('cgates', rutas)){
				const controlGates = ['cgates.gates', 'cgates.invoices', 'cgates.appointments'];
				for (var k = 0; k < controlGates.length; k++){
					rutas.push(controlGates[k]);
				}
			}
			if (generalFunctions.in_array('matches', rutas)){
				rutas.push('agrupar');
			}

			sessionStorage.acceso = JSON.stringify(rutas);
		}

		get info(){
			if (sessionStorage.userData){
				return JSON.parse(sessionStorage.userData);
			} else {
				return {};
			}
		}

		set info(value){
			sessionStorage.userData = JSON.stringify(value);
		}

		get filterTerminal(){
			return sessionStorage.getItem('filtro');
		}

		set filterTerminal(value){
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
		}

		setHeaders(){
			$http.defaults.headers.common.token = this.token;
		}

		unsetLogin(){
			sessionStorage.clear();
			this.filterTerminal = 'BACTSSA';
		}
	}

	return new loginService();

}]);