/**
 * Created by leo on 18/07/14.
 */

myapp.factory('authFactory', ['$state', '$cookies', 'loginService', '$rootScope', '$q', '$http', 'generalFunctions', 'APP_CONFIG',
	function($state, $cookies, loginService, $rootScope, $q, $http, generalFunctions, APP_CONFIG){

		class authFactory{

			login(user, pass){
				const deferred = $q.defer();

				user = user || $cookies.get('username');
				pass = pass || $cookies.get('password');

				const usuario = {
					email:		user,
					password:	pass
				};

				const inserturl = `${APP_CONFIG.SERVER_URL}/login`;
				$http.post(inserturl, usuario).then((response) => {
					let data = response.data.data;

					if (data.acceso.length > 0){
						loginService.info = data;
						loginService.isLoggedIn = true;
						loginService.type = data.role;
						loginService.group = data.group;
						loginService.token = data.token.token;

						$http.defaults.headers.common.token = loginService.token;

						loginService.acceso = data.acceso;

						//Si el rol es terminal, queda como filtro de si misma para las consultas
						//De lo contrario, dejo a BACTSSA como filtro por default
						if (data.role == 'terminal') {
							loginService.filterTerminal = data.terminal;
						} else {
							loginService.filterTerminal = angular.isDefined($cookies.get('themeTerminal')) ? $cookies.get('themeTerminal') : 'BACTSSA';
						}

						deferred.resolve(data);
					} else {
						var myError = {
							code: 'ACC-0010'
						};
						deferred.reject(myError);
					}
				}).catch((response) => {
					// ACC-0001 usuario o contraseña incorrecto
					// ACC-0001 usuario o contraseñas vacío
					// ACC-0003 no entro al correo
					// ACC-0004 no habilitado en el sistema
					if (response.data.code == 'ACC-0003'){
						$rootScope.salt = data.data.salt;
						$rootScope.rutasComunes.push('validar');
						deferred.reject(data);
					} else {
						deferred.reject(data);
					}
				});
				return deferred.promise;
			}

			userEnter(user, pass, useCookies){
				const deferred = $q.defer();
				this.login(user, pass).then((data) => {
					if (useCookies){
						$cookies.put('username', user);
						$cookies.put('password', pass);
						$cookies.put('themeTerminal', loginService.filterTerminal);
					}
					$cookies.put('isLogged', 'true');
					$cookies.put('restoreSesion', useCookies);
					deferred.resolve(data);
				}).catch((error) => {
					if (loginService.isLoggedIn){
						if (useCookies){
							$cookies.put('username', user);
							$cookies.put('password', pass);
							$cookies.put('themeTerminal', loginService.filterTerminal);
						}
						$cookies.put('isLogged', 'true');
						$cookies.put('restoreSesion', useCookies);
					}
					deferred.reject(error);
				});
				return deferred.promise;
			}

			logout(){
				$cookies.remove('isLogged');
				$cookies.remove('restoreSesion');
				$cookies.remove('username');
				$cookies.remove('password');
				loginService.unsetLogin();
			}

			cambiarContraseña(formData, callback){
				const inserturl = `${APP_CONFIG.SERVER_URL}/agp/password`;
				$http.post(inserturl, formData).then((response) => {
					callback(response.data);
				}).catch((response) => {
					callback(response.data);
				});
			}

			newUser(formData, callback){
				const inserturl = `${APP_CONFIG.SERVER_URL}/agp/register`;
				$http.post(inserturl, formData).then((response) => {
					callback(response.data);
				}).catch((response) => {
					callback(response.data);
				});
			}

			resetPassword(mail, callback){
				const inserturl = `${APP_CONFIG.SERVER_URL}/agp/resetPassword/${mail}`;
				$http.post(inserturl).then((response) => {
					callback(response.data);
				}).catch((response) => {
					callback(response.data);
				});
			}

			validateUser(salt, callback){
				const inserturl = `${APP_CONFIG.SERVER_URL}/agp/account/token`;
				$http.get(inserturl, { params: formatService.formatearDatos(salt) }).then((response) => {
					callback(response.data);
				}).catch((response) => {
					callback(response.data);
				});
			}

		}

		return new authFactory();
	}]);