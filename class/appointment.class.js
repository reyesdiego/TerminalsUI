/**
 * Created by kolesnikov-a on 25/08/2016.
 */
myapp.factory('Appointment', ['$http', '$q', 'APP_CONFIG', function($http, $q, APP_CONFIG){

    function Appointment(appointmentData){
        if (appointmentData)
            this.setData(appointmentData);
    }

    Appointment.prototype = {
        setData: function(appointmentData){
            angular.extend(this, appointmentData);
        },
        getComprobante: function(){
            var deferred = $q.defer();
            var insertUrl = APP_CONFIG.SERVER_URL + "/appointments/container/" + this.contenedor;
            $http.get(insertUrl, {params:{ _id: this._id }}).then(function(response){
                deferred.resolve(response.data);
            }, function(response){
                deferred.reject(response.data);
            });
            return deferred.promise;
        }
    };

    return Appointment;

}]);