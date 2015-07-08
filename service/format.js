/**
 * Created by leo on 05/03/15.
 */
	myapp.service('formatService', [function() {

		function estaDefinido(o) {
			return angular.isDefined(o) && o != null && o != '';
		}

		this.formatearDatos = function(datos) {
			var array = {};
			angular.forEach(datos, function(value, key) {
				if (value != null && value != '' && key != 'fechaConGMT' && key != 'filtroOrden' && key != 'filtroOrdenReverse' && key != 'filtroAnterior' && key != 'itemsPerPage' && key != 'currentPage' && key != 'moneda' && ((key != 'estado') || (key == 'estado' && value != 'N'))) array[key] = value;
			});
			if (estaDefinido(array.contenedor)) array.contenedor = datos.contenedor.toUpperCase();
			if (estaDefinido(array.razonSocial)) array.razonSocial = datos.razonSocial.toUpperCase();
			if (estaDefinido(array.fechaInicio)) array.fechaInicio = this.formatearFechaISOString(datos.fechaInicio);
			if (estaDefinido(array.fechaFin)) array.fechaFin = this.formatearFechaISOString(datos.fechaFin);
			if (estaDefinido(array.fecha)) array.fecha = this.formatearFechaISOString(datos.fecha);
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

		this.formatearFechaISOString = function(fecha) {
			if (fecha != '' && fecha != null){
				fecha = new Date(fecha);
				var fechaAux = this.formatearFecha(fecha) + 'T';
				if(fecha.getHours() < 10){
					fechaAux = fechaAux + '0';
				}
				fechaAux = fechaAux + (fecha.getHours()) + ':';
				if(fecha.getMinutes() < 10){
					fechaAux = fechaAux + '0';
				}
				fechaAux = fechaAux + fecha.getMinutes() + '.000-03:00';
				return fechaAux;
			}else
				return null;
		};

		/*this.formatearFechaHorasMinutosSinGMT = function(fecha) {
			if (fecha != '' && fecha != null){
				fecha = new Date(fecha);
				var fechaAux = this.formatearFecha(fecha) + 'T';
				if(fecha.getHours() < 10){
					fechaAux = fechaAux + '0';
				}
				fechaAux = fechaAux + (fecha.getHours() + 3) + ':';
				if(fecha.getMinutes() < 10){
					fechaAux = fechaAux + '0';
				}
				fechaAux = fechaAux + fecha.getMinutes() + '.000';
				return fechaAux;
			}else
				return null;
		};*/

	}]);