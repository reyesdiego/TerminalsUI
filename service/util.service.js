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


	this.colorHorario = (time, begin, end) => {
		var horarioGate = new Date(time);
		var horarioInicio = new Date(begin);
		var horarioFin = new Date(end);
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
	};

	this.isEqualArray = function(myArray, compareArray){
		// if the other array is a falsy value, return
		if (!compareArray)
			return false;

		// compare lengths - can save a lot of time
		if (myArray.length != compareArray.length)
			return false;

		myArray.sort();
		compareArray.sort();

		for (var i = 0, l=myArray.length; i < l; i++) {
			// Check if we have nested arrays
			if (myArray[i] instanceof Array && compareArray[i] instanceof Array) {
				// recurse into the nested arrays
				if (!this.isEqualArray(myArray[i],compareArray[i]))
					return false;
			}
			else if (myArray[i] != compareArray[i]) {
				// Warning - two different object instances will never be equal: {x:20} != {x:20}
				return false;
			}
		}
		return true;
	};

}]);