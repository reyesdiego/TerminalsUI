/**
 * Created by kolesnikov-a on 21/02/14.
 */
myapp.controller('controlCtrl', ['$rootScope', '$scope', 'controlPanelFactory', 'formatService', 'generalFunctions', 'colorTerminalesCache', 'loginService',
	function ($rootScope, $scope, controlPanelFactory, formatService, generalFunctions, colorTerminalesCache, loginService){

		var fecha = formatService.formatearFechaISOString(new Date());

		$scope.openDate = function(event){
			generalFunctions.openDate(event);
		};
		$scope.hitEnter = function(evt){
			if(angular.equals(evt.keyCode,13))
				$scope.filtrar();
		};
		$scope.maxDate = new Date();

		/*$scope.prefijo = 'AR$';
		$scope.otraMoneda = 'DOL';*/

		$scope.control = {
			"invoicesCount": 0,
			"ratesCount": 0,
			"ratesTotal": 0
		};

		$scope.barColors = {
			"bactssa": colorTerminalesCache.get('Bactssa'),
			"terminal4": colorTerminalesCache.get('Terminal4'),
			"trp": colorTerminalesCache.get('Trp')
		};

		$scope.radioModel = 'Gates';

		$scope.chartFacturas = {
			width: 380,
			height: 320,
			series: {3: {type: "line"}},
			type: 'column',
			currency: true,
			stacked: false,
			is3D: false,
			money: 'PES',
			columns: 4,
			data: [
				['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ]
			],
			id: 2,
			image: null
		};

		$scope.chartGates = {
			width: 410,
			height: 320,
			series: {3: {type: "line"}},
			type: 'column',
			currency: false,
			stacked: false,
			is3D: false,
			data: [
				['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ]
			],
			id: 3,
			image: null
		};

		$scope.chartTurnos = {
			width: 410,
			height: 320,
			series: {3: {type: "line"}},
			type: 'column',
			currency: false,
			stacked: false,
			is3D: false,
			data: [
				['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ]
			],
			id: 4,
			image: null
		};

		$scope.chartFacturado = {
			width: 460,
			height: 320,
			series: {3: {type: "line"}},
			type: 'column',
			currency: true,
			stacked: false,
			is3D: false,
			money: 'PES',
			columns: 4,
			data: [
				['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ]
			],
			id: 1,
			image: null
		};

		$scope.chartDiaGatesTurnos = {
			width: 1120,
			height: 320,
			series: {3: {type: "line"}},
			type: 'column',
			currency: false,
			stacked: false,
			is3D: false,
			data: [
				['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ]
			],
			id: 5,
			image: null
		};

		$scope.isCollapsedMonth = true;
		$scope.isCollapsedDay = true;
		$scope.isCollapsedGates = true;
		$scope.isCollapsedTurnos = true;
		$scope.isCollapsedDayTasas = true;
		$scope.isCollapsedDayGatesTurnos = true;
		$scope.isCollapsedDayGatesTurnosFin = true;

		// Fecha (dia y hora)
		$scope.desde = new Date();
		$scope.desdeTasas = new Date();
		$scope.mesDesde = new Date($scope.desde.getFullYear(), ($scope.desde.getMonth()), '01' );
		$scope.mesDesdeGates = new Date($scope.desde.getFullYear(), ($scope.desde.getMonth()), '01' );
		$scope.mesDesdeTurnos = new Date($scope.desde.getFullYear(), ($scope.desde.getMonth()), '01' );
		$scope.diaGatesTurnos = new Date();
		$scope.diaGatesTurnosFin = new Date();
		$scope.maxDate = new Date();
		$scope.maxDateTurnos = new Date($scope.maxDate.getFullYear(), ($scope.maxDate.getMonth() + 1), '01' );
		$scope.maxDateGatesTurnos = new Date($scope.maxDate.getFullYear(), ($scope.maxDate.getMonth() + 2), 0 );

		$scope.monthMode = 'month';
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

		var prepararDatosMes = function(datosGrafico, traerTotal){
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

		var prepararDatosFacturadoDia = function(datosGrafico){
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

		var prepararDatosGatesTurnosDia = function(datosGrafico){
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

		$scope.$on('socket:invoice', function (ev, data) {
			if (data.status === 'OK') {
				var fecha1 = formatService.formatearFechaISOString($scope.desde);
				var fecha2 = data.data.emision.substring(0,10);
				if (fecha1 == fecha2) {
					var response = Enumerable.From($scope.comprobantesCantidad)
						.Where('$.codTipoComprob==' + data.data.codTipoComprob)
						.ToArray();
					if (response.length == 1) {
						response[0].total++;
						if (angular.isDefined(response[0][data.data.terminal][0]) && angular.isNumber(response[0][data.data.terminal][0])) {
							response[0][data.data.terminal][0]++;
						} else {
							response[0][data.data.terminal][0] = 1;
						}
						for (var obj in response[0]){
							if (typeof response[0][obj] === 'object'){
								response[0][obj][1] = response[0][obj][0] * 100 / response[0].total;
							}
						}
					} else {
						var nuevoComprobante = {
							codTipoComprob : data.data.codTipoComprob,
							total : 1,
							BACTSSA : [ 0, 0 ],
							TERMINAL4 : [ 0, 0 ],
							TRP : [ 0, 0 ]
						};
						nuevoComprobante[data.data.terminal][0] = 1;
						nuevoComprobante[data.data.terminal][1] = 100;
						$scope.comprobantesCantidad.push(nuevoComprobante);
					}
					$scope.comprobantesCantidad.invoicesCount++;
					$scope.$apply();
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
			controlPanelFactory.getByDay({ fecha: $scope.desde }, function(data){
				$scope.loadingTotales = false;
				$scope.control.invoicesCount = data.invoicesCount;
				$scope.fecha = fecha;
				$scope.comprobantesCantidad = data.data;
			});
		};

		$scope.traerDatosFacturadoMes = function(){
			var datos = {
				fecha: $scope.mesDesde
			};
			$scope.errorFacturadoMes = false;
			$scope.isCollapsedMonth = true;
			$scope.loadingFacturadoMes = true;
			$scope.recargarFacturadoMes = false;
			controlPanelFactory.getFacturasMeses(datos, function(graf){
				$scope.chartFacturas.data = prepararDatosMes(graf.data, true);
				$scope.loadingFacturadoMes = false;
			});
		};

		$scope.traerDatosGates = function(){
			$scope.errorGates = false;
			$scope.isCollapsedGates = true;
			$scope.loadingGates = true;
			controlPanelFactory.getGatesMeses({'fecha': $scope.mesDesdeGates}, function(graf){
				$scope.chartGates.data = prepararDatosMes(graf, false);
				$scope.loadingGates = false;
			});
		};

		$scope.traerDatosTurnos = function(){
			$scope.errorTurnos = false;
			$scope.isCollapsedTurnos = true;
			$scope.loadingTurnos = true;
			controlPanelFactory.getTurnosMeses({ fecha: $scope.mesDesdeTurnos }, function(graf){
				$scope.loadingTurnos = false;
				$scope.chartTurnos.data = prepararDatosMes(graf, false);
			});
		};

		$scope.traerDatosFacturadoDia = function(){
			var datos = {
				fecha: $scope.desde
			};
			$scope.traerTotales();
			$scope.errorFacturadoDia = false;
			$scope.isCollapsedDay = true;
			$scope.loadingFacturadoDia = true;
			$scope.recargarFacturadoDia = false;
			controlPanelFactory.getFacturadoPorDia(datos, function(graf){
				$scope.chartFacturado.data = prepararDatosFacturadoDia(graf.data);
				$scope.loadingFacturadoDia = false;
			});
		};

		$scope.traerDatosGatesTurnosDia = function(){
			$scope.errorGatesTurnos = false;
			$scope.isCollapsedDayGatesTurnos = true;
			$scope.isCollapsedDayGatesTurnosFin = true;
			$scope.loadingGatesTurnos = true;
			$scope.diaGatesTurnos.setHours(0, 0, 0);
			$scope.diaGatesTurnosFin.setHours(0, 0, 0);
			if ($scope.radioModel == 'Gates'){
				controlPanelFactory.getGatesDia({ fechaInicio: $scope.diaGatesTurnos, fechaFin: $scope.diaGatesTurnosFin, fechaConGMT: true }, function(graf){
					$scope.loadingGatesTurnos = false;
					$scope.chartDiaGatesTurnos.data = prepararDatosGatesTurnosDia(graf);
					$scope.labelPorHora = 'Gates por hora'
				});
			}
			else if ($scope.radioModel == 'Turnos'){
				controlPanelFactory.getTurnosDia({ fechaInicio: $scope.diaGatesTurnos, fechaFin: $scope.diaGatesTurnosFin, fechaConGMT: true }, function(graf){
					$scope.loadingGatesTurnos = false;
					$scope.chartDiaGatesTurnos.data = prepararDatosGatesTurnosDia(graf);
					$scope.labelPorHora = 'Turnos por hora'
				});
			}
		};

		if (loginService.getStatus()){
			$scope.traerTotales();
			$scope.traerDatosFacturadoMes();
			//$scope.traerDatosFacturadoDiaTasas();
			$scope.traerDatosFacturadoDia();
			$scope.traerDatosGates();
			$scope.traerDatosTurnos();
			$scope.traerDatosGatesTurnosDia();
		}

		$scope.$on('terminoLogin', function(){
			$scope.traerTotales();
			$scope.traerDatosFacturadoMes();
			//$scope.traerDatosFacturadoDiaTasas();
			$scope.traerDatosFacturadoDia();
			$scope.traerDatosGates();
			$scope.traerDatosTurnos();
			$scope.traerDatosGatesTurnosDia();
		});

		$scope.$on('$destroy', function(){
			controlPanelFactory.cancelRequest();
		});

	}]);

