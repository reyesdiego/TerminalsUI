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
			if (!this.emailToApp.price) this.emailToApp.price = false;
			if (!this.emailToApp.emailAppointmentToApp) this.emailToApp.emailAppointmentToApp = false;
			if (!this.emailToApp.appointmentError) this.emailToApp.appointmentError = false;
		}


		guardarTareas(){
			const deferred = $q.defer();
			const inserturl = `${APP_CONFIG.SERVER_URL}/agp/account/${this._id}/tasks`;
			$http.put(inserturl, this.tareasNuevas).then((response) => {
				this.acceso = this.tareasNuevas;
				this.tareasNuevas = [];
				deferred.resolve(response.data);
			}).catch((response) => {
				deferred.reject(response.data)
			});
			return deferred.promise;
		}

		guardarNotificaciones(){
			const deferred = $q.defer();
			const inserturl = `${APP_CONFIG.SERVER_URL}/agp/account/${this._id}/emailToApp`;
			$http.put(inserturl, this.notificacionesNuevas).then((response) => {
				this.emailToApp = this.notificacionesNuevas;
				this.notificacionesNuevas = {
					price: false,
					emailAppointmentToApp: false,
					appointmentError: false
				};
				deferred.resolve(response.data);
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise;
		}

		guardar(){
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
					this.elegido = '';
					deferred.resolve();
				} else {
					deferred.reject(errorMessage)
				}
			}).catch((error) => {
				deferred.reject(error.mmesage);
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

	}

	return User;

}]);