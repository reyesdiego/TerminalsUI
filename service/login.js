/**
 * Created by diego on 3/26/14.
 */

myapp.service('loginService', function () {
	var login = {};
	return {
		getStatus: function () {
			return login.status;
		},
		setStatus: function (value) {
			login.status = value;
		},
		getToken: function () {
			return login.token;
		},
		setToken: function (value) {
			login.token = value;
		}
	};
});