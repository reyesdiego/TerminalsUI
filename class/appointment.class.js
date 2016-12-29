/**
 * Created by kolesnikov-a on 25/08/2016.
 */
myapp.factory('Appointment', ['$http', '$q', 'APP_CONFIG', function($http, $q, APP_CONFIG){

    class Appointment {
        constructor(appointmentData){
            if (appointmentData)
                angular.extend(this, appointmentData);
        }

        getComprobante(){
            const deferred = $q.defer();
            const insertUrl = `${APP_CONFIG.SERVER_URL}/appointments/container/${this.contenedor}`;
            $http.get(insertUrl, {params:{ _id: this._id }}).then((response) => {
                deferred.resolve(response.data);
            }).catch((response) => {
                deferred.reject(response.data);
            });
            return deferred.promise;
        }
    }

    return Appointment;

}]);