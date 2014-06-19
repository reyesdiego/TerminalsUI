/**
 * Created by kolesnikov-a on 17/06/14.
*/

var reportsCtrl = myapp.controller('reportsCtrl', function ($scope, reportsFactory){

	$scope.chartTitleBarrasBactssa = "Detalle por mes BACTSSA";
	$scope.chartWidthBarrasBactssa = 800;
	$scope.chartHeightBarrasBactssa = 400;
	$scope.chartDataBarrasBactssa = [];

	$scope.chartTitleBarrasTerminal4 = "Detalle por mes TERMINAL 4";
	$scope.chartWidthBarrasTerminal4 = 800;
	$scope.chartHeightBarrasTerminal4 = 400;
	$scope.chartDataBarrasTerminal4 = [];

	$scope.chartTitleBarrasTrp = "Detalle por mes TRP";
	$scope.chartWidthBarrasTrp = 800;
	$scope.chartHeightBarrasTrp = 400;
	$scope.chartDataBarrasTrp = [];

	$scope.chartTitleTortaBactssa = "Porcentaje anual BACTSSA";
	$scope.chartWidthTortaBactssa = 400;
	$scope.chartHeightTortaBactssa = 400;
	$scope.chartDataTortaBactssa = [];

	$scope.chartTitleTortaTerminal4 = "Porcentaje anual TERMINAL 4";
	$scope.chartWidthTortaTerminal4 = 400;
	$scope.chartHeightTortaTerminal4 = 400;
	$scope.chartDataTortaTerminal4 = [];

	$scope.chartTitleTortaTrp = "Porcentaje anual TRP";
	$scope.chartWidthTortaTrp = 400;
	$scope.chartHeightTortaTrp = 400;
	$scope.chartDataTortaTrp = [];

	$scope.desde = new Date();
	$scope.mesDesdeHorarios = new Date($scope.desde.getFullYear() + '-' + ($scope.desde.getMonth() + 1) + '-01' );

	$scope.monthMode = 'month';
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate', 'yyyy-MM'];
	$scope.format = $scope.formats['yyyy-MM-dd'];
	$scope.formatSoloMes = $scope.formats[3];
	$scope.terminoCarga = false;

	$scope.deleteRow = function (index) {
		$scope.chartData.splice(index, 1);
	};
	$scope.addRow = function () {
		$scope.chartData.push([]);
	};
	$scope.selectRow = function (index) {
		$scope.selected = index;
	};
	$scope.rowClass = function (index) {
		return ($scope.selected === index) ? "selected" : "";
	};

	$scope.cargarReporteHorarios = function(){
		reportsFactory.getCumplimientoTurnos($scope.mesDesdeHorarios, function(data){
			var graficoBarras = [
				['Datos', 'Cumplidos', 'Ausencias', 'Tardes', 'Sin turno', { role: 'annotation' } ]
			];
			var tortaBactssa = [
				['Cumplidos', 0],
				['Ausencias', 0],
				['Tardes', 0],
				['Sin turno', 0]
			];
			var tortaTerminal4 = [
				['Cumplidos', 0],
				['Ausencias', 0],
				['Tardes', 0],
				['Sin turno', 0]
			];
			var tortaTrp = [
				['Cumplidos', 0],
				['Ausencias', 0],
				['Tardes', 0],
				['Sin turno', 0]
			];
			var barrasBactssa = graficoBarras.slice();
			var barrasTerminal4 = graficoBarras.slice();
			var barrasTrp = graficoBarras.slice();

			var filaBarras = ['', 0, 0, 0, 0, ''];
			var meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre", "Diciembre"];

			data.data.forEach(function(datosHorarios){
				filaBarras[0] = meses[datosHorarios.month - 1] + ' del ' + datosHorarios.year;
				filaBarras[1] = datosHorarios.turnosPlanificados - datosHorarios.ausencias - datosHorarios.fueraDeHorario;
				filaBarras[2] = datosHorarios.ausencias;
				filaBarras[3] = datosHorarios.fueraDeHorario;
				filaBarras[4] = datosHorarios.gatesSinTurno;
				switch (datosHorarios.terminal){
					case "BACTSSA":
						barrasBactssa.push(filaBarras.slice());
						tortaBactssa[0][1] += datosHorarios.turnosPlanificados - datosHorarios.ausencias - datosHorarios.fueraDeHorario;
						tortaBactssa[1][1] += datosHorarios.ausencias;
						tortaBactssa[2][1] += datosHorarios.fueraDeHorario;
						tortaBactssa[3][1] += datosHorarios.gatesSinTurno;
						break;
					case "TERMINAL4":
						barrasTerminal4.push(filaBarras.slice());
						tortaTerminal4[0][1] += datosHorarios.turnosPlanificados - datosHorarios.ausencias - datosHorarios.fueraDeHorario;
						tortaTerminal4[1][1] += datosHorarios.ausencias;
						tortaTerminal4[2][1] += datosHorarios.fueraDeHorario;
						tortaTerminal4[3][1] += datosHorarios.gatesSinTurno;
						break;
					case "TRP":
						barrasTrp.push(filaBarras.slice());
						tortaTrp[0][1] += datosHorarios.turnosPlanificados - datosHorarios.ausencias - datosHorarios.fueraDeHorario;
						tortaTrp[1][1] += datosHorarios.ausencias;
						tortaTrp[2][1] += datosHorarios.fueraDeHorario;
						tortaTrp[3][1] += datosHorarios.gatesSinTurno;
						break;
				}
			})
			$scope.chartDataBarrasBactssa = barrasBactssa.slice();
			$scope.chartDataBarrasTerminal4 = barrasTerminal4.slice();
			$scope.chartDataBarrasTrp = barrasTrp.slice();

			$scope.chartDataTortaBactssa = tortaBactssa.slice();
			$scope.chartDataTortaTerminal4 = tortaTerminal4.slice();
			$scope.chartDataTortaTrp = tortaTrp.slice();
		});

	};
});

reportsCtrl.prepararMatrizVaciaBarras = function($q){
	var defer = $q.defer();
	var base = [
		['Datos', 'Cumplidos', 'Ausencias', 'Tardes', 'Sin turno', { role: 'annotation' } ]
		['', 0, 0, 0, 0, '']
	];
	defer.resolve(base);
	return defer.promise;
};

reportsCtrl.prepararMatrizVaciaTorta = function($q){
	var defer = $q.defer();
	var base = [
		['Cumplidos', 0],
		['Ausencias', 0],
		['Tardes', 0],
		['Sin turno', 0]
	];
	defer.resolve(base);
	return defer.promise;
};

reportsCtrl.prepararDatosMes = function(datosGrafico){
	//Matriz base de los datos del gráfico, ver alternativa al hardcodeo de los nombres de las terminales
	var base = [
		['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ]
	];
	//Para cambiar entre columnas
	var contarTerminal = 1;
	//Para cargar promedio
	var acum = 0;
	var meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre", "Diciembre"];
	//Los datos vienen en objetos que incluyen la fecha, la terminal, y la suma facturada(cnt)
	//ordenados por fecha, y siguiendo el orden de terminales "BACTSSA", "Terminal 4", "TRP"???????
	var flagPrimero = true;
	var fechaAnterior;
	var fila = ['', 0, 0, 0, 0, ''];
	datosGrafico.forEach(function(datosDia){
		if (flagPrimero){
			flagPrimero = false;
			fila[0] = meses[datosDia._id.month - 1] + ' del ' + datosDia._id.year;
			fechaAnterior = datosDia._id.month;
		}
		if (fechaAnterior != datosDia._id.month){
			//Al llegar a la tercer terminal cargo el promedio de ese día, meto la fila en la matriz y reseteo las columnas
			fila[4] = acum/3;
			base.push(fila.slice());
			//Meto la fila en la matriz y vuelvo a empezar
			fila = ['', 0, 0, 0, 0, ''];
			acum = 0;
			fechaAnterior = datosDia._id.month;
			fila[0] = meses[datosDia._id.month - 1] + ' del ' + datosDia._id.year;
		}
		switch (datosDia._id.terminal){
			case "BACTSSA":
				contarTerminal = 1;
				break;
			case "TERMINAL4":
				contarTerminal = 2;
				break;
			case "TRP":
				contarTerminal = 3;
				break;
		}
		fila[contarTerminal] = datosDia.cnt;
		acum += datosDia.cnt;
	});
	fila[4] = acum/3;
	base.push(fila.slice());
	//Finalmente devuelvo la matriz generada con los datos para su asignación
	return base;
};
