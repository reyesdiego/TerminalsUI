/**
 * Created by leo on 05/03/15.
 */
(function () {
	myapp.service('formatService', function() {

		function estaDefinido(o) {
			return angular.isDefined(o) && o != null && o != '';
		}

		this.formatearDatos = function(datos) {
			var array = {};
			angular.forEach(datos, function(value, key) {
				if (value != null && value != '' && (key != 'estado' || (key == 'estado' && value != 'N')) && key != 'fechaConGMT' && key != 'filtroOrden' && key != 'filtroOrdenReverse' && key != 'filtroAnterior') array[key] = value;
			});
			if (estaDefinido(array.contenedor)) array.contenedor = datos.contenedor.toUpperCase();
			if (estaDefinido(array.razonSocial)) array.razonSocial = datos.razonSocial.toUpperCase();
			if (estaDefinido(array.fechaInicio)) array.fechaInicio = (estaDefinido(datos.fechaConGMT) && datos.fechaConGMT) ? this.formatearFechaHorasMinutosGMTLocal(datos.fechaInicio) : this.formatearFecha(datos.fechaInicio);
			if (estaDefinido(array.fechaFin)) array.fechaFin = (estaDefinido(datos.fechaConGMT) && datos.fechaConGMT) ? this.formatearFechaHorasMinutosGMTLocal(datos.fechaFin) : this.formatearFecha(datos.fechaFin);
			if (estaDefinido(array.order)) array.order = '[{' + datos.order + '}]';

			return array;
		};

		this.formatearFecha = function(fecha) {
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
		};

		this.formatearFechaHorasMinutosGMTLocal = function(fecha) {
			if (fecha != '' && fecha != null){
				fecha = new Date(fecha);
				var fechaAux = this.formatearFecha(fecha) + ' ';
				if(fecha.getHours() < 7){
					fechaAux = fechaAux + '0';
				}
				fechaAux = fechaAux + (fecha.getHours()) + ':';
				if(fecha.getMinutes() < 10){
					fechaAux = fechaAux + '0';
				}
				fechaAux = fechaAux + fecha.getMinutes() + ' -0300';
				return fechaAux;
			}else
				return null;
		};

		this.formatearFechaHorasMinutos = function(fecha) {
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
		};

		this.formatearFechaHorasMinutosSinGMT = function(fecha) {
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
		};

	})
})();