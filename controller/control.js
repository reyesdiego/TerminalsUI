/**
 * Created by kolesnikov-a on 21/02/14.
 */

var controlCtrl = myapp.controller('controlCtrl', function ($rootScope, $scope, datosGraficoPorMes, datosFacturadoPorDiaTasas, datosGraficoGatesTurnosDias, controlPanelFactory, socket, formatDate){

	var fecha = formatDate.formatearFecha(new Date());

	$scope.prefijo = 'AR$';
	$scope.otraMoneda = 'DOL';

	$scope.control = {
		"invoicesCount": 0,
		"ratesCount": 0,
		"ratesTotal": 0
	};

	$scope.barColors = {
		"bactssa":$scope.colorBactssa,
		"terminal4": $scope.colorTerminal4,
		"trp": $scope.colorTrp
	};

	$scope.radioModel = 'Gates';

	$scope.chartTitle = "Datos enviados";
	$scope.chartWidth = 300;
	$scope.chartHeight = 380;

	$scope.chartsWidthTasas = 390;

	$scope.chartsWidthFacturado = 460;

	$scope.chartsWidthFacturadoMes = 380;

	$scope.columnChart = 'column';

	$scope.chartsHeight = 320;
	$scope.chartsWidth = 410;
	$scope.chartSeries = {3: {type: "line"}};

	$scope.chartTitleFacturas = "Facturado por mes";
	$scope.chartDataFacturas = datosGraficoPorMes;
	$scope.chartDataFacturasAR = datosGraficoPorMes;
	$scope.chartDataFacturasUS = datosGraficoPorMes;

	$scope.chartTitleGates = "Gates cargados";
	$scope.chartDataGates = datosGraficoPorMes;

	$scope.chartTitleTurnos = "Turnos cargados";
	$scope.chartDataTurnos = datosGraficoPorMes;

	$scope.chartTitleFacturadoTasas = "Importe de tasa a las cargas por día";
	$scope.chartDataFacturadoTasas = datosFacturadoPorDiaTasas.dataGraf;
	$scope.chartDataFacturadoTasasAR = datosFacturadoPorDiaTasas.dataGraf;
	$scope.chartDataFacturadoTasasUS = datosFacturadoPorDiaTasas.dataGraf;

	$scope.chartTitleFacturado = "Facturado por día";
	$scope.chartDataFacturado = datosGraficoPorMes;
	$scope.chartDataFacturadoAR = datosGraficoPorMes;
	$scope.chartDataFacturadoUS = datosGraficoPorMes;

	$scope.chartTitleDiaGatesTurnos = "Cantidad por día";
	$scope.chartWidthDiaGatesTurnos = 1140;
	$scope.chartDataDiaGatesTurnos = datosGraficoGatesTurnosDias;

	$scope.isCollapsedMonth = true;
	$scope.isCollapsedDay = true;
	$scope.isCollapsedGates = true;
	$scope.isCollapsedTurnos = true;
	$scope.isCollapsedDayTasas = true;
	$scope.isCollapsedDayGatesTurnos = true;

	// Fecha (dia y hora)
	$scope.desde = new Date();
	$scope.desdeTasas = new Date();
	$scope.mesDesde = new Date($scope.desde.getFullYear(), ($scope.desde.getMonth()), '01' );
	$scope.mesDesdeGates = new Date($scope.desde.getFullYear(), ($scope.desde.getMonth()), '01' );
	$scope.mesDesdeTurnos = new Date($scope.desde.getFullYear(), ($scope.desde.getMonth()), '01' );
	$scope.diaGatesTurnos = new Date();
	$scope.maxDate = new Date();
	$scope.maxDateTurnos = new Date($scope.maxDate.getFullYear(), ($scope.maxDate.getMonth() + 1), '01' );
	$scope.maxDateGatesTurnos = new Date($scope.maxDate.getFullYear(), ($scope.maxDate.getMonth() + 2), 0 );

	$scope.monthMode = 'month';
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate', 'yyyy-MM'];
	$scope.format = $scope.formats['yyyy-MM-dd'];
	$scope.formatSoloMes = $scope.formats[3];
	//Flag para mostrar los tabs con los resultados una vez recibidos los datos
	$scope.terminoCarga = false;

	$scope.control.ratesCount = 0;
	$scope.control.ratesTotal = 0;

	$scope.loadingTotales = false;
	$scope.errorTotales = false;
	$scope.mensajeErrorTotales = '';

	$scope.loadingTasas = false;
	$scope.errorCargaTasas = false;
	$scope.mensajeErrorCargaTasas = '';
	$scope.recargarTasas = false;

	$scope.loadingFacturadoDia = false;
	$scope.errorFacturadoDia = false;
	$scope.mensajeErrorFacturadoDia = '';
	$scope.recargarFacturadoDia = false;

	$scope.loadingFacturadoMes = false;
	$scope.errorFacturadoMes = false;
	$scope.mensajeErrorFacturadoMes = '';
	$scope.recargarFacturadoMes = false;

	$scope.loadingGates = false;
	$scope.errorGates = false;
	$scope.mensajeErrorGates = '';

	$scope.loadingTurnos = false;
	$scope.errorTurnos = false;
	$scope.mensajeErrorTurnos = '';

	$scope.loadingGatesTurnos = false;
	$scope.errorGatesTurnos = false;
	$scope.mensajeErrorGatesTurnos = '';
	$scope.visibleTurnos = 'hidden';
	$scope.visibleGates = 'hidden';
	$scope.visibleGatesTurnos = 'hidden';

	socket.on('invoice', function (data) {
		if (data.status === 'OK') {
			var fecha1 = formatDate.formatearFecha($scope.desde);
			var fecha2 = data.data.emision.substring(0,10);
			if (fecha1 == fecha2) {
				var response = Enumerable.From($scope.comprobantesCantidad)
					.Where('$.codTipoComprob==' + data.data.codTipoComprob)
					.ToArray();
				if (response.length == 1) {
					response[0].total++;
					response[0][data.data.terminal][0]++;
					for (var obj in response[0]){
						if (typeof response[0][obj] === 'object'){
							response[0][obj][1] = response[0][obj][0] * 100 / response[0].total;
						}
					}
				} else {
					var nuevoComprobante = {
						codTipoComprob : data.data.codTipoComprob,
						total : 1,
						BACTSSA : [
							0, 0
						],
						TERMINAL4 : [
							0, 0
						],
						TRP : [
							0, 0
						]
					};
					nuevoComprobante[data.data.terminal][0] = 1;
					nuevoComprobante[data.data.terminal][1] = 100;
					$scope.comprobantesCantidad.push(nuevoComprobante);
				}
				$scope.comprobantesCantidad.invoicesCount++;
				$scope.$apply();
			} else {
				console.log('La fecha no coincide')
			}
		}
	});

	$scope.$on('errorGetByDay', function(event, error){
		$scope.loadingTotales = false;
		$scope.errorTotales = true;
		$scope.mensajeErrorTotales = error;
	});

	$scope.$on('errorTasas', function(event, error){
		$scope.loadingTasas = false;
		$scope.errorCargaTasas = true;
		$scope.mensajeErrorCargaTasas = error;
		$scope.recargarTasas = true;
	});

	$scope.$on('gatesMeses', function(event, error){
		$scope.loadingGates = false;
		$scope.errorGates = true;
		$scope.mensajeErrorGates = error;
	});

	$scope.$on('turnosMeses', function(event, error){
		$scope.loadingTurnos = false;
		$scope.errorTurnos = true;
		$scope.mensajeErrorTurnos = error;
	});

	$scope.$on('errorFacturadoPorDia', function(event, error){
		$scope.loadingFacturadoDia = false;
		$scope.errorFacturadoDia = true;
		$scope.mensajeErrorFacturadoDia = error;
		$scope.recargarFacturadoDia = true;
	});

	$scope.$on('errorFacturasMeses', function(event, error){
		$scope.loadingFacturadoMes = false;
		$scope.errorFacturadoMes = true;
		$scope.mensajeErrorFacturadoMes = error;
		$scope.recargarFacturadoMes = true;
	});

	$scope.$on('errorGatesTurnosDia', function(event, error){
		$scope.loadingGatesTurnos = false;
		$scope.errorGatesTurnos = true;
		$scope.mensajeErrorGatesTurnos = error;
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

	$scope.traerTotales = function(){
		$scope.errorTotales = false;
		$scope.loadingTotales = true;
		controlPanelFactory.getByDay(formatDate.formatearFecha($scope.desde), function(data){
			$scope.loadingTotales = false;
			$scope.control.invoicesCount = data.invoicesCount;
			$scope.fecha = fecha;
			$scope.comprobantesCantidad = data.data;
		});
	};

	$scope.traerDatosFacturadoMes = function(){
		$scope.errorFacturadoMes = false;
		$scope.isCollapsedMonth = true;
		$scope.loadingFacturadoMes = true;
		$scope.recargarFacturadoMes = false;
		controlPanelFactory.getFacturasMeses($scope.mesDesde, $rootScope.moneda, function(graf){
			$scope.loadingFacturadoMes = false;
			var datosPreparados = controlCtrl.prepararDatosMes(graf.data, true);
			switch ($rootScope.moneda){
				case 'PES':
					$scope.chartDataFacturasAR = datosPreparados;
					break;
				case 'DOL':
					$scope.chartDataFacturasUS = datosPreparados;
					break;
			}
			$scope.chartDataFacturas = controlCtrl.prepararDatosMes(graf.data, true);
		});
		controlPanelFactory.getFacturasMeses($scope.mesDesde, $scope.otraMoneda, function(graf){
			var datosPreparados = controlCtrl.prepararDatosMes(graf.data, true);
			switch ($scope.otraMoneda){
				case 'PES':
					$scope.chartDataFacturasAR = datosPreparados;
					break;
				case 'DOL':
					$scope.chartDataFacturasUS = datosPreparados;
					break;
			}
		});
	};

	$scope.traerDatosGates = function(){
		$scope.errorGates = false;
		$scope.isCollapsedGates = true;
		$scope.loadingGates = true;
		$scope.visibleGates = 'hidden';
		controlPanelFactory.getGatesMeses($scope.mesDesdeGates, function(graf){
			$scope.loadingGates = false;
			$scope.visibleGates = 'block';
			$scope.chartDataGates = controlCtrl.prepararDatosMes(graf, false);
		});
	};

	$scope.traerDatosTurnos = function(){
		$scope.errorTurnos = false;
		$scope.isCollapsedTurnos = true;
		$scope.loadingTurnos = true;
		$scope.visibleTurnos = 'hidden';
		controlPanelFactory.getTurnosMeses($scope.mesDesdeTurnos, function(graf){
			$scope.loadingTurnos = false;
			$scope.visibleTurnos = 'block';
			$scope.chartDataTurnos = controlCtrl.prepararDatosMes(graf, false);
		});
	};

	$scope.traerDatosFacturadoDiaTasas = function(){
		$scope.errorCargaTasas = false;
		$scope.loadingTasas = true;
		$scope.isCollapsedDayTasas = true;
		$scope.recargarTasas = false;
		controlPanelFactory.getTasas($scope.desdeTasas, $rootScope.moneda, function(graf){
			$scope.loadingTasas = false;
			var result = controlCtrl.prepararDatosFacturadoDiaTasas(graf);
			switch ($rootScope.moneda){
				case 'PES':
					$scope.chartDataFacturadoTasasAR = result.dataGraf;
					break;
				case 'DOL':
					$scope.chartDataFacturadoTasasUS = result.dataGraf;
					break;
			}
			$scope.chartDataFacturadoTasas = result.dataGraf;
			$scope.control.ratesCount = result.ratesCount;
			$scope.control.ratesTotal = result.ratesTotal;
		});
		controlPanelFactory.getTasas($scope.desdeTasas, $scope.otraMoneda, function(graf){
			var result = controlCtrl.prepararDatosFacturadoDiaTasas(graf);
			switch ($scope.otraMoneda){
				case 'PES':
					$scope.chartDataFacturadoTasasAR = result.dataGraf;
					break;
				case 'DOL':
					$scope.chartDataFacturadoTasasUS = result.dataGraf;
					break;
			}
		});
	};

	$scope.traerDatosFacturadoDia = function(){
		$scope.traerTotales();
		$scope.errorFacturadoDia = false;
		$scope.isCollapsedDay = true;
		$scope.loadingFacturadoDia = true;
		$scope.recargarFacturadoDia = false;
		controlPanelFactory.getFacturadoPorDia($scope.desde, $rootScope.moneda, function(graf){
			$scope.loadingFacturadoDia = false;
			var datosPreparados = controlCtrl.prepararDatosFacturadoDia(graf.data);
			switch ($rootScope.moneda){
				case 'PES':
					$scope.chartDataFacturadoAR = datosPreparados;
					break;
				case 'DOL':
					$scope.chartDataFacturadoUS = datosPreparados;
			}
			$scope.chartDataFacturado = datosPreparados;
		});
		controlPanelFactory.getFacturadoPorDia($scope.desde, $scope.otraMoneda, function(graf){
			var datosPreparados = controlCtrl.prepararDatosFacturadoDia(graf.data);
			switch ($scope.otraMoneda){
				case 'PES':
					$scope.chartDataFacturadoAR = datosPreparados;
					break;
				case 'DOL':
					$scope.chartDataFacturadoUS = datosPreparados;
			}
		});
	};

	$scope.traerDatosGatesTurnosDia = function(){
		$scope.errorGatesTurnos = false;
		$scope.isCollapsedDayGatesTurnos = true;
		$scope.loadingGatesTurnos = true;
		$scope.visibleGatesTurnos = 'hidden';
		if ($scope.radioModel == 'Gates'){
			controlPanelFactory.getGatesDia($scope.diaGatesTurnos, function(graf){
				$scope.loadingGatesTurnos = false;
				$scope.visibleGatesTurnos = 'block';
				$scope.chartDataDiaGatesTurnos = controlCtrl.prepararDatosGatesTurnosDia(graf);
			});
		}
		else if ($scope.radioModel == 'Turnos'){
			controlPanelFactory.getTurnosDia($scope.diaGatesTurnos, function(graf){
				$scope.loadingGatesTurnos = false;
				$scope.visibleGatesTurnos = 'block';
				$scope.chartDataDiaGatesTurnos = controlCtrl.prepararDatosGatesTurnosDia(graf);
			});
		}
	};

	$scope.$watch('moneda', function(){
		switch ($rootScope.moneda){
			case 'PES':
				$scope.prefijo = 'AR$';
				$scope.otraMoneda = 'DOL';
				$scope.chartDataFacturado = $scope.chartDataFacturadoAR;
				$scope.chartDataFacturadoTasas = $scope.chartDataFacturadoTasasAR;
				$scope.chartDataFacturas = $scope.chartDataFacturasAR;
				break;
			case 'DOL':
				$scope.prefijo = 'US$';
				$scope.otraMoneda = 'PES';
				$scope.chartDataFacturado = $scope.chartDataFacturadoUS;
				$scope.chartDataFacturadoTasas = $scope.chartDataFacturadoTasasUS;
				$scope.chartDataFacturas = $scope.chartDataFacturasUS;
				break;
		}
		if ($scope.recargarFacturadoDia){
			$scope.traerDatosFacturadoDia();
		}
		if ($scope.recargarTasas){
			$scope.traerDatosFacturadoDiaTasas();
		}
		if ($scope.recargarFacturadoMes){
			$scope.traerDatosFacturadoMes();
		}
	});

	$scope.traerTotales();
	$scope.traerDatosFacturadoMes();
	$scope.traerDatosFacturadoDiaTasas();
	$scope.traerDatosFacturadoDia();
	$scope.traerDatosGates();
	$scope.traerDatosTurnos();
	$scope.traerDatosGatesTurnosDia();

});

controlCtrl.prepararMatrizVacía = function($q){
	var defer = $q.defer();
	var base = [
		['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ]
	];
	defer.resolve(base);
	return defer.promise;
};

controlCtrl.prepararMatrizTasas = function($q){
	var defer = $q.defer();

	var result = {
		"ratesCount": 0,
		"ratesTotal": 0,
		"dataGraf": []
	};

	result.dataGraf = [
		['Datos', 'Facturado', { role: 'annotation' } ],
		['BACTSSA', 0, ''],
		['TERMINAL 4', 0, ''],
		['TRP', 0, '']
	];

	defer.resolve(result);
	return defer.promise;
};

controlCtrl.prepararMatrizVaciaGatesTurnos = function($q){
	var defer = $q.defer();
	var base = [
		['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ],
		['00', 0, 0, 0, 0, ''], ['01', 0, 0, 0, 0, ''], ['02', 0, 0, 0, 0, ''], ['03', 0, 0, 0, 0, ''], ['04', 0, 0, 0, 0, ''],
		['05', 0, 0, 0, 0, ''], ['06', 0, 0, 0, 0, ''], ['07', 0, 0, 0, 0, ''], ['08', 0, 0, 0, 0, ''], ['09', 0, 0, 0, 0, ''],
		['10', 0, 0, 0, 0, ''], ['11', 0, 0, 0, 0, ''], ['12', 0, 0, 0, 0, ''], ['13', 0, 0, 0, 0, ''], ['14', 0, 0, 0, 0, ''],
		['15', 0, 0, 0, 0, ''], ['16', 0, 0, 0, 0, ''], ['17', 0, 0, 0, 0, ''], ['18', 0, 0, 0, 0, ''], ['19', 0, 0, 0, 0, ''],
		['20', 0, 0, 0, 0, ''], ['21', 0, 0, 0, 0, ''], ['22', 0, 0, 0, 0, ''], ['23', 0, 0, 0, 0, '']
	];
	defer.resolve(base);
	return defer.promise;
};

/*controlCtrl.primerCargaComprobantes = function(controlPanelFactory, $q){
	var defer = $q.defer();
	var fecha = new Date();
	controlPanelFactory.getTotales(fecha, function(graf){
		var base = [
			['Datos', 'Comprobantes', { role: 'annotation' } ],
			['BACTSSA', 0, ''],
			['TRP', 0, ''],
			['TERMINAL 4', 0, '']
		];
		var i = 1;
		graf.forEach(function(terminal){
			console.log(terminal);
			base[i] = [terminal._id.terminal, terminal.cnt,''];
			i++;
		});
		defer.resolve(base);
	});
	return defer.promise;
};*/

controlCtrl.prepararDatosMes = function(datosGrafico, traerTotal){
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
		if (traerTotal){
			fila[contarTerminal] = datosDia.total;
			acum += datosDia.total;
		} else {
			fila[contarTerminal] = datosDia.cnt;
			acum += datosDia.cnt;
		}
	});
	fila[4] = acum/3;
	base.push(fila.slice());
	//Finalmente devuelvo la matriz generada con los datos para su asignación
	return base;
};

controlCtrl.prepararDatosFacturadoDiaTasas = function(datos){
	//Matriz base de los datos del gráfico, ver alternativa al hardcodeo de los nombres de las terminales
	var base = [
		['Datos', 'Facturado', { role: 'annotation' } ],
		['BACTSSA', 0, ''],
		['TERMINAL 4', 0, ''],
		['TRP', 0, '']
	];
	//Para cambiar entre columnas
	var contarTerminal = 1;
	//Para cargar promedio
	//Los datos vienen en objetos que incluyen la terminal, y la suma facturada(cnt)
	if (datos.dataGraf.length){
		datos.dataGraf.forEach(function(datosDia){
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
			base[contarTerminal][1] = datosDia.total;
		});
	}
	datos.dataGraf = base;
	//Finalmente devuelvo la matriz generada con los datos para su asignación
	return datos;
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
		}
		fila[contarTerminal] = datosDia.total;
		acum += datosDia.total;
	});
	//Meto la última fila generada
	fila[4] = acum/3;
	base.push(fila.slice());
	//Finalmente devuelvo la matriz generada con los datos para su asignación
	return base;
};

controlCtrl.prepararDatosGatesTurnosDia = function(datosGrafico){
	var matAux = [];
	matAux[0] = ['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ];
	for (var i = 0; i <= 23; i++){
		if (i<10){
			matAux[i+1] = ['0' + i, 0, 0, 0, 0, ''];
		}
		else {
			matAux[i+1] = [i, 0, 0, 0, 0, ''];
		}
	}
	datosGrafico.forEach(function(datosDia){
		switch (datosDia._id.terminal){
			case "BACTSSA":
				matAux[datosDia._id.hour+1][1] = datosDia.cnt;
				break;
			case "TERMINAL4":
				matAux[datosDia._id.hour+1][2] = datosDia.cnt;
				break;
			case "TRP":
				matAux[datosDia._id.hour+1][3] = datosDia.cnt;
				break;
		}
	});
	for (var e = 0; e <= 23; e++){
		matAux[e+1][4] = (matAux[e+1][1] + matAux[e+1][2] + matAux[e+1][3]) / 3;
	}
	return matAux;
};