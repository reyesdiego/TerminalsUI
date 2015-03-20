/**
 * Created by leo on 18/03/15.
 */
myapp.service('generalFunctions', [function () {
	this.filtrarOrden = function (model, filtro) {
		var filtroReverse = (model.filtroOrdenReverse) ? -1 : 1;
		model.currentPage = 1;
		model.filtroOrden = filtro;
		model.filtroOrdenReverse = (model.filtroOrden == model.filtroAnterior) ? !model.filtroOrdenReverse : false;
		model.order = '"' + filtro + '":' + filtroReverse;
		model.filtroAnterior = filtro;
		console.log(model);
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
		event.preventDefault();
		event.stopPropagation();
	};

	this.switchTheme = function (title) {
		var i, a;
		for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
			if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
				a.disabled = a.getAttribute("title") != title;
			}
		}
	}
}]);