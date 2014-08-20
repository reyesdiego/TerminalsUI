/**
 * Created by kolesnikov-a on 17/06/14.
*/

var reportsCtrl = myapp.controller('reportsCtrl', function ($scope, reportsFactory, invoiceFactory, vouchersFactory, priceFactory, loginService){

	vouchersFactory.getVouchersType(function(data){
		$scope.comprobantesTipos = data.data;
	});

	$scope.paginaAnterior = 1;

	$scope.filteredPrices = [];
	$scope.tarifasGraficar = {
		"field": "code",
		"data": []
	};
	$scope.tablaGrafico = [];

	priceFactory.getPrice(loginService.getFiltro(), function (data) {
		$scope.pricelist = data.data;
		$scope.pricelist.forEach(function (price) {
			price.graficar = false;
		});
		$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage);
		$scope.totalItems = $scope.pricelist.length;
	});

	$scope.pageChanged = function(){
		$scope.filteredPrices.forEach(function(price){
			var pos = $scope.filteredPrices.indexOf(price);
			$scope.pricelist[($scope.paginaAnterior-1)*$scope.itemsPerPage + pos].graficar = price.graficar;
		});
		$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage);
		$scope.paginaAnterior = $scope.currentPage;
	};

	$scope.mostrarGrafico = false;

	$scope.barColors = {
		"bactssa":$scope.colorBactssa,
		"terminal4": $scope.colorTerminal4,
		"trp": $scope.colorTrp
	};
	$scope.chartSeries = {3: {type: "line"}};

	$scope.columnChart = 'column';
	$scope.pieChart = 'pie';

	$scope.chartTitleReporteTarifas = "Conteo de tarifas por código";
	$scope.chartWidthReporteTarifas = 1200;
	$scope.chartHeightReporteTarifas = 600;
	$scope.chartDataReporteTarifas = [];

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

	$scope.isCollapsedDesde = true;
	$scope.isCollapsedHasta = true;

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
	
	$scope.armarGraficoTarifas = function () {
		$scope.tarifasGraficar = {
			"field": "code",
			"data": []
		};
		$scope.tablaGrafico = {
			"terminales": [],
			"data": []
		};
		$scope.pricelist.forEach(function (price) {
			if (price.graficar){
				$scope.tarifasGraficar.data.push(price.code);
				$scope.tablaGrafico.data.push(price);
			}
		});
		var base = [
			['Códigos']
		];
		var nuevaLinea = [];
		var contarTerminales = 0;
		var terminales = [];
		reportsFactory.getReporteTarifas($scope.tarifasGraficar, function(data){
			contarTerminales = data.data.length;
			data.data.forEach(function(resultado){
				nuevaLinea.push(resultado.terminal);
				base.push(nuevaLinea.slice());
				terminales.push(resultado.terminal);
				nuevaLinea = [];
			});
			var i = 1;
			$scope.tablaGrafico.terminales = terminales;
			$scope.tablaGrafico.data.forEach(function(tarifa){
				var total = 0;
				var code = tarifa.code;
				tarifa.conteo = [];
				tarifa.porcentaje = [];
				base[0].push(code);
				for (i=1; i<=contarTerminales; i++){
					base[i].push(data.data[i-1].data[code]);
					tarifa.conteo.push(data.data[i-1].data[code]);
					total += data.data[i-1].data[code];
				}
				tarifa.conteo.push(total);
				for (i=0; i<=contarTerminales-1; i++){
					var cuenta = (tarifa.conteo[i]*100)/tarifa.conteo[contarTerminales];
					tarifa.porcentaje.push(cuenta);
				}
			});
			$scope.chartDataReporteTarifas = base;
			$scope.mostrarGrafico = true;
		});
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
							arrayCodigos.push(item.id);
							arrayCantidad.push(0);
						}
						var pos = arrayCodigos.indexOf(item.id);
						arrayCantidad[pos] += 1;
					});
				});
			});

			invoiceFactory.getDescriptionItem(function(losMatches){
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
				['Ausencias', 0],
				['Tardes', 0],
				['Sin turno', 0],
				['Cumplidos', 0]
			];
			var tortaTerminal4 = [
				['Ausencias', 0],
				['Tardes', 0],
				['Sin turno', 0],
				['Cumplidos', 0]
			];
			var tortaTrp = [
				['Ausencias', 0],
				['Tardes', 0],
				['Sin turno', 0],
				['Cumplidos', 0]
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
						tortaBactssa[0][1] += datosHorarios.ausencias;
						tortaBactssa[1][1] += datosHorarios.fueraDeHorario;
						tortaBactssa[2][1] += datosHorarios.gatesSinTurno;
						tortaBactssa[3][1] += datosHorarios.turnosPlanificados - datosHorarios.ausencias - datosHorarios.fueraDeHorario;
						break;
					case "TERMINAL4":
						barrasTerminal4.push(filaBarras.slice());
						tortaTerminal4[0][1] += datosHorarios.ausencias;
						tortaTerminal4[1][1] += datosHorarios.fueraDeHorario;
						tortaTerminal4[2][1] += datosHorarios.gatesSinTurno;
						tortaTerminal4[3][1] += datosHorarios.turnosPlanificados - datosHorarios.ausencias - datosHorarios.fueraDeHorario;
						break;
					case "TRP":
						barrasTrp.push(filaBarras.slice());
						tortaTrp[0][1] += datosHorarios.ausencias;
						tortaTrp[1][1] += datosHorarios.fueraDeHorario;
						tortaTrp[2][1] += datosHorarios.gatesSinTurno;
						tortaTrp[3][1] += datosHorarios.turnosPlanificados - datosHorarios.ausencias - datosHorarios.fueraDeHorario;
						break;
				}
			});
			$scope.chartDataBarrasBactssa = barrasBactssa.slice();
			$scope.chartDataBarrasTerminal4 = barrasTerminal4.slice();
			$scope.chartDataBarrasTrp = barrasTrp.slice();

			$scope.chartDataTortaBactssa = tortaBactssa.slice();
			$scope.chartDataTortaTerminal4 = tortaTerminal4.slice();
			$scope.chartDataTortaTrp = tortaTrp.slice();
		});

	};
});
