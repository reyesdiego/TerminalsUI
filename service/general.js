/**
 * Created by leo on 18/03/15.
 */
myapp.service('generalFunctions', [function () {
	this.filtrarOrden = function (model, filtro) {
		model.currentPage = 1;
		model.filtroOrden = filtro;
		model.filtroOrdenReverse = (model.filtroOrden == model.filtroOrdenAnterior) ? !model.filtroOrdenReverse : false;
		var filtroReverse = (model.filtroOrdenReverse) ? -1 : 1;
		model.order = '"' + filtro + '":' + filtroReverse;
		model.filtroOrdenAnterior = filtro;

		return model;
	};

	this.colorHorario = function (gate) {
		var horarioGate = new Date(gate.gateTimestamp);
		var horarioInicio = new Date(gate.turnoInicio);
		var horarioFin = new Date(gate.turnoFin);
		if (horarioGate >= horarioInicio && horarioGate <= horarioFin) {
			return 'green';
		} else {
			return 'red';
		}
	};

	this.openDate = function (event) {
		//event.preventDefault();
		//event.stopPropagation();
	};

	this.idToDate = function (id) {
		return new Date(parseInt(id.substring(0, 8), 16) * 1000);
	};

	this.in_array = function(needle, haystack, argStrict){
		var key = '',
				strict = !! argStrict;

		if(strict){
			for(key in haystack){
				if(haystack.hasOwnProperty(key) && haystack[key] === needle){
					return true;
				}
			}
		}else{
			for(key in haystack){
				if(haystack.hasOwnProperty(key) && haystack[key] == needle){
					return true;
				}
			}
		}
		return false;
	}
}]);