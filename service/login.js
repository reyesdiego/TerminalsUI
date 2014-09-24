/**
 * Created by diego on 3/26/14.
 */

myapp.service('loginService', function () {
	return {
		getStatus: function () {
			return sessionStorage.getItem('loginStatus');
		},
		setStatus: function (value) {
			sessionStorage.setItem('loginStatus', value);
		},
		getToken: function () {
			return sessionStorage.getItem('token');
		},
		setToken: function (value) {
			sessionStorage.setItem('token', value);
		},
		setType: function (value) {
			sessionStorage.setItem('type', value);
		},
		getType: function () {
			return sessionStorage.getItem('type');
		},
		setGroup: function (value) {
			sessionStorage.setItem('group', value);
		},
		getGroup: function () {
			return sessionStorage.getItem('group');
		},
		setAcceso: function(value) {
			sessionStorage.acceso = JSON.stringify(value);
		},
		getAcceso: function() {
			return JSON.parse(sessionStorage.acceso);
		},
		setInfo: function (value) {
			sessionStorage.userData = JSON.stringify(value);
		},
		getInfo: function () {
			return JSON.parse(sessionStorage.userData);
		},
		setFiltro: function(value) {
			sessionStorage.setItem('filtro', value);
		},
		getFiltro: function() {
			return sessionStorage.getItem('filtro');
		},
		unsetLogin: function(){
			sessionStorage.clear();
		}
	};
});