/**
 * Created by leo on 29/04/14.
 */

myapp.service('formatDate', function () {

	this.formatearFecha = function(fecha){
		if (fecha != '' && fecha != null){
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
		}else
			return null;
	};

	this.formatearFechaHorasMinutos = function(fecha){
		if (fecha != '' && fecha != null){
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
		}else
			return null;
	};

});