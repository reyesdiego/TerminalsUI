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
	};

	this.idToDate = function (id) {
		var fechaGMT0 = new Date(parseInt(id.substring(0, 8), 16) * 1000);
		fechaGMT0.setUTCHours(fechaGMT0.getHours(), fechaGMT0.getMinutes(), fechaGMT0.getSeconds());
		return fechaGMT0;
	};
}]);