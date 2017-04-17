/**
 * Created by kolesnikov-a on 24/01/2017.
 */
myapp.factory('User', ['$http', '$q', 'APP_CONFIG', 'loginService', function($http, $q, APP_CONFIG, loginService){

	class User {

		constructor(userData){
			this.elegido = '';
			if (userData) this.setData(userData);
		}

		resetData(){
			this.tareasNuevas = [];
			this.notificacionesNuevas = {
				price: false,
				emailAppointmentToApp: false,
				appointmentError: false
			};
		}

		setData(userData){
			angular.extend(this, userData);
			this.resetData();
			if (!this.acceso) this.acceso = [];
			if (!this.emailToApp) {
				this.emailToApp = {
					price: false,
					emailAppointmentToApp: false,
					appointmentError: false
				}
			} else {
				if (!this.emailToApp.price) this.emailToApp.price = false;
				if (!this.emailToApp.emailAppointmentToApp) this.emailToApp.emailAppointmentToApp = false;
				if (!this.emailToApp.appointmentError) this.emailToApp.appointmentError = false;
			}

		}

		guardarTareas(){
			const deferred = $q.defer();
			const inserturl = `${APP_CONFIG.SERVER_URL}/agp/account/${this._id}/tasks`;
			const data = {
				acceso: this.tareasNuevas
			};
			$http.put(inserturl, data).then((response) => {
				this.acceso = this.tareasNuevas;
				deferred.resolve(response.data);
			}).catch((response) => {
				deferred.reject(response.data)
			});
			return deferred.promise;
		}

		guardarNotificaciones(){
			const deferred = $q.defer();
			const inserturl = `${APP_CONFIG.SERVER_URL}/agp/account/${this._id}/emailToApp`;
			const saveData = {
				emailToApp: this.notificacionesNuevas
			};
			$http.put(inserturl, saveData).then((response) => {
				this.emailToApp = this.notificacionesNuevas;
				deferred.resolve(response.data);
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise;
		}

		guardarTareasNotificaciones(){
			const deferred = $q.defer();
			let datosGuardar = [];

			if (this.tieneCambiosTareas) datosGuardar.push(this.guardarTareas());
			if (this.tieneCambiosNotificaciones) datosGuardar.push(this.guardarNotificaciones());

			$q.all(datosGuardar).then((values) => {
				let contar = 0;
				let errorMessage = '';
				values.forEach((result) => {
					if (result.status == 'OK'){
						contar++;
					} else {
						errorMessage += result.message + '\n';
					}
				});
				if (contar == values.length){
					this.resetData();
					deferred.resolve();
				} else {
					deferred.reject(errorMessage)
				}
			}).catch((error) => {
				deferred.reject(error.message);
			});

			return deferred.promise;
		}

		guardarEstado(){
			const deferred = $q.defer();
			let estado = '';
			this.status ? estado = 'enable' : estado = 'disable';
			const inserturl = `${APP_CONFIG.SERVER_URL}/agp/account/${this._id}/${estado}`;
			$http.put(inserturl).then((response) => {
				if (response.data.status == 'OK'){
					this.guardar = false;
					deferred.resolve();
				} else {
					deferred.reject();
				}
			}).catch((response) => {
				//callback(response.data);
				deferred.reject();
			});
			return deferred.promise;

		}

		get tieneCambiosTareas(){
			return (!this.tareasNuevas.equals(this.acceso));
		}

		get tieneCambiosNotificaciones(){
			let hayCambios = false;
			for (let prop in this.notificacionesNuevas){
				if (this.notificacionesNuevas.hasOwnProperty(prop)){
					hayCambios = (this.emailToApp[prop] != this.notificacionesNuevas[prop]) || hayCambios;
				}
			}
			return hayCambios;
		}

		get ultimaConexionClass(){
			let ultimaConex = new Date(this.lastLogin);
			let fechaActual = new Date();
			ultimaConex.setHours(0, 0, 0, 0);
			fechaActual.setHours(0, 0, 0, 0);
			let claseColor = '';
			if (parseInt(Math.abs(fechaActual.getTime() - ultimaConex.getTime()) / (24 * 60 * 60 * 1000), 10) <= 2) {
				claseColor = 'usuarioActivo';
			} else if (parseInt(Math.abs(fechaActual.getTime() - ultimaConex.getTime()) / (24 * 60 * 60 * 1000), 10) > 2 && parseInt(Math.abs(fechaActual.getTime() - ultimaConex.getTime()) / (24 * 60 * 60 * 1000), 10) <= 5) {
				claseColor = 'usuarioRegular';
			} else {
				claseColor = 'usuarioInactivo';
			}
			return claseColor;
		}

		get habilitado(){
			return angular.isDefined(this.token) && angular.isDefined(this.token.date_created) && this.token.date_created != '';
		}

		get estadoClass(){
			if (this.status){
				return 'success';
			} else if (this.habilitado){
				return 'danger';
			} else {
				return 'warning';
			}
		}

	}

	return User;

}]);