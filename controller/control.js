/**
 * Created by kolesnikov-a on 21/02/14.
 */

var controlCtrl = myapp.controller('ControlCtrl', function ($scope, datosGrafico, datosGraficoFacturas, datosGraficoGates, datosGraficoTurnos, datosFacturadoPorDia, controlPanelFactory, socket, formatDate){

	var fecha = formatDate.formatearFecha(new Date());

	$scope.chartTitle = "Datos enviados";
	$scope.chartWidth = 300;
	$scope.chartHeight = 380;
	$scope.chartData = datosGrafico;

	$scope.chartTitleFacturas = "Facturado por mes";
	$scope.chartWidthFacturas = 410;
	$scope.chartHeightFacturas = 320;
	$scope.chartDataFacturas = datosGraficoFacturas;

	$scope.chartTitleGates = "Gates";
	$scope.chartWidthGates = 580;
	$scope.chartHeightGates = 320;
	$scope.chartDataGates = datosGraficoGates;

	$scope.chartTitleTurnos = "Turnos";
	$scope.chartWidthTurnos = 580;
	$scope.chartHeightTurnos = 320;
	$scope.chartDataTurnos = datosGraficoTurnos;

	$scope.chartTitleFacturado = "Facturado por día";
	$scope.chartWidthFacturado = 410;
	$scope.chartHeightFacturado = 320;
	$scope.chartDataFacturado = datosFacturadoPorDia;

	$scope.isCollapsedMonth = true;
	$scope.isCollapsedDay = true;

	// Fecha (dia y hora)
	$scope.desde = new Date();
	$scope.mesDesde = new Date($scope.desde.getFullYear() + '-' + ($scope.desde.getMonth() + 1) + '-01' );
	$scope.monthMode = 'month';
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate', 'yyyy-MM'];
	$scope.format = $scope.formats['yyyy-MM-dd'];
	$scope.formatSoloMes = $scope.formats[3];
	//Flag para mostrar los tabs con los resultados una vez recibidos los datos
	$scope.terminoCarga = false;

	socket.on('invoice', function (message) {
		$scope.chartData[2][1]++;
		$scope.control.invoicesCount++;
	});

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

	controlPanelFactory.getByDay(fecha, function(data){
		$scope.control = data[0];
		$scope.fecha = fecha;
	});

	$scope.traerDatosFacturadoMes = function(){
		$scope.isCollapsedMonth = !$scope.isCollapsedMonth;
		controlPanelFactory.getFacturasMeses($scope.mesDesde, function(graf){
			$scope.chartDataFacturas = controlCtrl.prepararDatosFacturadoMes(graf);
		});
	}

	$scope.traerDatosFacturadoDia = function(){
		$scope.isCollapsedDay = !$scope.isCollapsedDay;
		controlPanelFactory.getFacturadoPorDia($scope.desde, function(graf){
			$scope.chartDataFacturado = controlCtrl.prepararDatosFacturadoDia(graf);
		});
	}
});

controlCtrl.primerCargaComprobantes = function(controlPanelFactory, $q){
	var defer = $q.defer();
	var fecha = new Date();
	controlPanelFactory.getTotales(fecha, function(graf){
		var base = [
//							['Datos', 'Facturas', 'Gates', 'Turnos', { role: 'annotation' } ],
			['Datos', 'Facturas', { role: 'annotation' } ],
//							['BACTSSA', 0, 0, 0, ''],
//							['TRP', 0, 0, 0, ''],
//							['TERMINAL 4', 0, 0, 0, '']
			['BACTSSA', 0, ''],
			['TRP', 0, ''],
			['TERMINAL 4', 0, '']
		];
		var i = 1;
		graf.forEach(function(terminal){
//							base[i] = [terminal.nombre, terminal.invoices, terminal.gates, terminal.turnos, ''];
//							base[i] = [terminal._id.terminal, terminal.invoicesCount, terminal.invoicesCount, terminal.invoicesCount, ''];
			base[i] = [terminal._id.terminal, terminal.cnt,''];
			i++;
		});
		defer.resolve(base);
	});
	return defer.promise;
};

controlCtrl.primerCargaFacturadoMes = function (controlPanelFactory, $q){
	var defer = $q.defer();
	var fechaActual = new Date();
	var fecha = new Date(fechaActual.getFullYear() + '-' + (fechaActual.getMonth()+1) + '-01');
	controlPanelFactory.getFacturasMeses(fecha, function(graf){
		defer.resolve(controlCtrl.prepararDatosFacturadoMes(graf));
	});
	return defer.promise;
};

controlCtrl.primerCargaGates = function (controlPanelFactory, $q){
	var defer = $q.defer();
	var fecha = new Date();
	controlPanelFactory.getGatesMeses(fecha.getMonth()+1, function(graf){
		defer.resolve(controlCtrl.prepararDatos(graf));
	});
	return defer.promise;
}

controlCtrl.primerCargaTurnos = function (controlPanelFactory, $q){
	var defer = $q.defer();
	var fecha = new Date();
	controlPanelFactory.getTurnosMeses(fecha.getMonth()+1, function(graf){
		defer.resolve(controlCtrl.prepararDatos(graf));
	});
	return defer.promise;
}

controlCtrl.primerCargaFacturadoDia = function (controlPanelFactory, $q){
	var defer = $q.defer();
	var fecha = new Date();
	controlPanelFactory.getFacturadoPorDia(fecha, function(graf){
		defer.resolve(controlCtrl.prepararDatosFacturadoDia(graf));
	});
	return defer.promise;
}

controlCtrl.prepararDatos = function(datosGrafico){
	console.log(datosGrafico);
	var base = [
		['Terminales', 'BACTSSA', 'TRP', 'Terminal 4', 'Promedio', { role: 'annotation'} ]
	];
	var i = 1;
	datosGrafico.data.forEach(function(datosMes){
		var fila = [datosMes.mes, 0, 0, 0, 0, ''];
		var acum = 0;
		datosMes.datos.forEach(function(terminal){
			fila[i] = terminal.total;
			i++;
			acum += terminal.total;
		});
		fila[4] = acum/3;
		base.push(fila);
		i = 1;
	});
	return base;
};

controlCtrl.prepararDatosFacturadoMes = function(datosGrafico){
	//Matriz base de los datos del gráfico, ver alternativa al hardcodeo de los nombres de las terminales
	var base = [
		['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ]
	];
	//Para cambiar entre columnas
	var contarTerminal = 1;
	//Para cargar promedio
	var acum = 0;
	var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre", "Diciembre");
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
		};
		fila[contarTerminal] = datosDia.cnt;
		acum += datosDia.cnt;
	});
	fila[4] = acum/3;
	base.push(fila.slice());
	//Finalmente devuelvo la matriz generada con los datos para su asignación
	return base;
};

controlCtrl.prepararDatosFacturadoDia = function(datosGrafico){
	//Matriz base de los datos del gráfico, ver alternativa al hardcodeo de los nombres de las terminales
	var base = [
		['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ]
	];
	//Para cambiar entre columnas
	var contarTerminal = 1;
	//Para cargar promedio
	var acum = 0;
	var fila = ['', 0, 0, 0, 0, ''];
	var flagPrimero = true;
	var fechaAnterior;
	//Los datos vienen en objetos que incluyen la fecha, la terminal, y la suma facturada(cnt)
	//ordenados por fecha
	datosGrafico.forEach(function(datosDia){
		if (flagPrimero){
			//Primera iteración, cargo el día y lo establezco como fecha para comparar
			fila[0] = datosDia._id.day + '/' + datosDia._id.month + '/' + datosDia._id.year;
			fechaAnterior = datosDia._id.day;
			flagPrimero = false;
		}
		if (fechaAnterior != datosDia._id.day){
			//Al haber un cambio en la fecha cargo el promedio de ese día, avanzo una fila y reseteo las columnas
			fila[4] = acum/3;
			base.push(fila.slice());
			//Meto la fila en la matriz y vuelvo a empezar
			fila = ['', 0, 0, 0, 0, ''];
			fechaAnterior = datosDia._id.day;
			fila[0] = datosDia._id.day + '/' + datosDia._id.month + '/' + datosDia._id.year;
			acum = 0;
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
		};
		fila[contarTerminal] = datosDia.cnt;
		acum += datosDia.cnt;
	});
	//Meto la última fila generada
	fila[4] = acum/3;
	base.push(fila.slice());
	//Finalmente devuelvo la matriz generada con los datos para su asignación
	return base;
};