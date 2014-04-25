/**
 * Created by leo on 25/04/14.
 */

myapp.factory('formatDate', function(){
	var factory = {};

	factory.formatearFecha = function(fecha){
		if (fecha != '' && fecha != null){
			console.log(fecha);
			var fechaAux = fecha.getFullYear() + '-';
			if ((fecha.getMonth() + 1) < 10){
				fechaAux = fechaAux + '0';
			}
			fechaAux = fechaAux + (fecha.getMonth() + 1) + '-';
			if (fecha.getDate() < 10){
				fechaAux = fechaAux + '0';
			}
			fechaAux = fechaAux + fecha.getDate();
			return fechaAux;
		}
	};

	factory.formatearFechaHorasMinutos = function(fecha){
		var fechaAux = this.formatearFecha(fecha) + ' ';
		if(fecha.getHours() < 10){
			fechaAux = fechaAux + '0';
		}
		fechaAux = fechaAux + fecha.getHours() + ':';
		if(fecha.getMinutes() < 10){
			fechaAux = fechaAux + '0';
		}
		fechaAux = fechaAux + fecha.getMinutes() + ' -0000';
		return fechaAux;
	};

	return factory;
});
