/**
 * Created by kolesnikov-a on 17/06/14.
*/

var reportsCtrl = myapp.controller('reportsCtrl', function ($scope, reportsFactory, invoiceFactory, vouchersFactory){

	vouchersFactory.getVouchersType(function(data){
		$scope.comprobantesTipos = data.data;
	});

	$scope.chartTitleBarrasHorarios = "Detalle por mes";
	$scope.chartWidthBarrasHorarios = 500;
	$scope.chartHeightBarrasHorarios = 400;

	$scope.chartDataBarrasBactssa = [];
	$scope.chartDataBarrasTerminal4 = [];
	$scope.chartDataBarrasTrp = [];

	$scope.chartTitleTortaHorarios = "Porcentaje anual";
	$scope.chartWidthTortaHorarios = 550;
	$scope.chartHeightTortaHorarios = 530;

	$scope.chartDataTortaBactssa = [];
	$scope.chartDataTortaTerminal4 = [];
	$scope.chartDataTortaTrp = [];

	$scope.chartDataTarifasBactssa = [];
	$scope.chartDataTarifasTerminal4 = [];
	$scope.chartDataTarifasTrp = [];

	$scope.resultadosTarifasBactssa = [];
	$scope.resultadosTarifasTerminal4 = [];
	$scope.resultadosTarifasTrp = [];

	$scope.matchesBactssa = [];
	$scope.matchesTerminal4 = [];
	$scope.matchesTrp = [];

	$scope.hasta = new Date();
	$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());
	$scope.mesDesdeHorarios = new Date($scope.hasta.getFullYear() + '-' + ($scope.hasta.getMonth() + 1) + '-01' );

	$scope.monthMode = 'month';
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate', 'yyyy-MM'];
	$scope.format = $scope.formats['yyyy-MM-dd'];
	$scope.formatSoloMes = $scope.formats[3];
	$scope.terminoCarga = false;
	$scope.tipoComprobante = "0";

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

	$scope.cargarReporteTarifasTerminal = function(unaTerminal){
		var arrayCodigos = [];
		var arrayDescripcion = [];
		var arrayCantidad = [];
		var graficoArmado = [];
		var filaGrafico = [];
		//Los array de código y cantidad se cargan por separado para facilitar la tarea, respetando que la posición en un array
		//se corresponden con los datos en el otro en la misma posición
		invoiceFactory.getByDate($scope.desde, $scope.hasta, unaTerminal, $scope.tipoComprobante, function(dataComprob){
			$scope.result = dataComprob;

			$scope.result.data.forEach(function(comprob){
				comprob.detalle.forEach(function(detalle){
					detalle.items.forEach(function(item){
						if (!in_array(item.id, arrayCodigos)){
							arrayCodigos.push(item.id)
							arrayCantidad.push(0);
						}
						var pos = arrayCodigos.indexOf(item.id);
						arrayCantidad[pos] += 1;
					});
				});
			});

			invoiceFactory.getDescriptionItem(unaTerminal, function(losMatches){
				var i;
				var tope;

				if (arrayCodigos.length > 9){
					tope = 9;
				}else{
					tope = arrayCodigos.length - 1
				}

				for (i = 0; i <= tope; i++){

					if (angular.isDefined(losMatches[arrayCodigos[i]])){
						arrayDescripcion.push(losMatches[arrayCodigos[i]])
					}
					else{
						arrayDescripcion.push("No se halló la descripción, verifique que el código esté asociado");
					}

					filaGrafico = [arrayCodigos[i], arrayDescripcion[i], arrayCantidad[i]];
					switch (unaTerminal){
						case 'BACTSSA':
							$scope.resultadosTarifasBactssa.push(filaGrafico.slice());
							break;
						case 'TERMINAL4':
							$scope.resultadosTarifasTerminal4.push(filaGrafico.slice());
							break;
						case 'TRP':
							$scope.resultadosTarifasTrp.push(filaGrafico.slice());
							break;
					}
					filaGrafico = [arrayCodigos[i], arrayCantidad[i]];
					graficoArmado.push(filaGrafico.slice());
				}

				switch (unaTerminal){
					case 'BACTSSA':
						$scope.chartDataTarifasBactssa = graficoArmado.slice();
						$scope.matchesBactssa = losMatches;
						break;
					case 'TERMINAL4':
						$scope.chartDataTarifasTerminal4 = graficoArmado.slice();
						$scope.matchesTerminal4 = losMatches;
						break;
					case 'TRP':
						$scope.chartDataTarifasTrp = graficoArmado.slice();
						$scope.matchesTrp = losMatches;
						break;
				}
			})

		});

	};

	$scope.cargarReporteTarifas = function(){
		$scope.resultadosTarifasBactssa = [];
		$scope.resultadosTarifasTerminal4 = [];
		$scope.resultadosTarifasTrp = [];

		var arrayTerminales = ['BACTSSA', 'TERMINAL4', 'TRP'];

		arrayTerminales.forEach(function(unaTerminal){
			$scope.cargarReporteTarifasTerminal(unaTerminal);
		});

	};

	$scope.cargarReporteHorarios = function(){
		reportsFactory.getCumplimientoTurnos($scope.mesDesdeHorarios, function(data){
			var graficoBarras = [
				['Datos', 'Ausencias', 'Tardes', 'Sin turno', { role: 'annotation' } ]
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

			var filaBarras = ['', 0, 0, 0, ''];
			var meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre", "Diciembre"];

			data.data.forEach(function(datosHorarios){
				filaBarras[0] = meses[datosHorarios.month - 1] + ' del ' + datosHorarios.year;
				filaBarras[1] = datosHorarios.ausencias;
				filaBarras[2] = datosHorarios.fueraDeHorario;
				filaBarras[3] = datosHorarios.gatesSinTurno;
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
