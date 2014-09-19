/**
 * Created by leo on 29/04/14.
 */

myapp.service('formatDate', function () {
	return {
		formatearFecha : function(fecha){
		if (fecha != '' && fecha != null){
			fecha = new Date(fecha);
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
		},
		formatearFechaHorasMinutos : function(fecha){
		if (fecha != '' && fecha != null){
			fecha = new Date(fecha);
			var fechaAux = this.formatearFecha(fecha) + ' ';
			if(fecha.getHours() < 7){
				fechaAux = fechaAux + '0';
			}
			fechaAux = fechaAux + (fecha.getHours() + 3) + ':';
			if(fecha.getMinutes() < 10){
				fechaAux = fechaAux + '0';
			}
			fechaAux = fechaAux + fecha.getMinutes() + ' -0000';
			return fechaAux;
		}else
			return null;
		},
		formatearFechaHorasMinutosSinGMT : function(fecha){
			if (fecha != '' && fecha != null){
				fecha = new Date(fecha);
				var fechaAux = this.formatearFecha(fecha) + ' ';
				if(fecha.getHours() < 7){
					fechaAux = fechaAux + '0';
				}
				fechaAux = fechaAux + (fecha.getHours() + 3) + ':';
				if(fecha.getMinutes() < 10){
					fechaAux = fechaAux + '0';
				}
				fechaAux = fechaAux + fecha.getMinutes();
				return fechaAux;
			}else
				return null;
		}
	};
});