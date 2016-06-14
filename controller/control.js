/**
 * Created by kolesnikov-a on 21/02/14.
 */
myapp.controller('controlCtrl', ['$rootScope', '$scope', 'controlPanelFactory', 'formatService', 'generalFunctions', 'colorTerminalesCache', 'loginService',
	function ($rootScope, $scope, controlPanelFactory, formatService, generalFunctions, colorTerminalesCache, loginService){

		var fecha = formatService.formatearFechaISOString(new Date());

		$scope.tipoFiltro = 'cantidad';

		$scope.openfechaInicio = false;

		$scope.hitEnter = function(evt){
			if(angular.equals(evt.keyCode,13))
				$scope.filtrar();
		};
		$scope.maxDate = new Date();

		$scope.datepickerNormal = {
			formatYear: 'yyyy',
			maxDate: new Date(),
			minDate: new Date(2015,0,1),
			startingDay: 1
		};

		$scope.datepickerMonth = {
			minMode: 'month',
			datepickerMode: 'month',
			showWeeks: false,
			maxDate: new Date()
		};

		$scope.datepickerMonthTurnos = {
			minMode: 'month',
			datepickerMode: 'month',
			showWeeks: false,
			maxDate: new Date($scope.maxDate.getFullYear(), ($scope.maxDate.getMonth() + 1), '01' )
		};

		$scope.datepickerGatesTurnos = {
			showWeeks: false,
			maxDate: new Date($scope.maxDate.getFullYear(), ($scope.maxDate.getMonth() + 2), 0 )
		};

		$scope.control = {
			"invoicesCount": 0,
			"totalCount": 0,
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
			width: 450,
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
			width: 450,
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
			width: 450,
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
			width: 1200,
			height: 350,
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

		$scope.isOpenMonth = false;
		$scope.isOpenGates = false;
		$scope.isOpenTurnos = false;
		$scope.isOpenDayTasas = false;
		$scope.isOpenDayGatesTurnos = false;
		$scope.isOpenDayGatesTurnosFin = false;

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

		//Flag para mostrar los tabs con los resultados una vez recibidos los datos
		$scope.terminoCarga = false;

		$scope.control.ratesCount = 0;
		$scope.control.ratesTotal = 0;

		$scope.facturadoDia = {
			loading: false,
			error: false,
			mensaje: ''
		};

		$scope.facturadoMes = {
			loading: false,
			error: false,
			mensaje: ''
		};

		$scope.cantGates = {
			loading: false,
			error: false,
			mensaje: ''
		};

		$scope.cantTurnos = {
			loading: false,
			error: false,
			mensaje: ''
		};

		$scope.gatesTurnos = {
			loading: false,
			error: false,
			mensaje: ''
		};

		var prepararDatosMes = function(datosGrafico, traerTotal){
			//Matriz base de los datos del gráfico, ver alternativa al hardcodeo de los nombres de las terminales
			var base = [
				['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ]
			];
			//Para cambiar entre columnas
			var contarTerminal = 1;
			//Para cargar promedio
			var acum = 0;
			var meses = ["01","02","03","04","05","06","07","08","09","10","11", "12"];
			//Los datos vienen en objetos que incluyen la fecha, la terminal, y la suma facturada(cnt)
			//ordenados por fecha, y siguiendo el orden de terminales "BACTSSA", "Terminal 4", "TRP"???????
			var flagPrimero = true;
			var fechaAnterior;
			var fila = ['', 0, 0, 0, 0, ''];
			datosGrafico.forEach(function(datosDia){
				if (flagPrimero){
					flagPrimero = false;
					fila[0] = meses[datosDia._id.month - 1] + '/' + datosDia._id.year;
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
					fila[0] = meses[datosDia._id.month - 1] + '/' + datosDia._id.year;
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
					fila[0] = datosDia.date.substr(0, 10).replace(/-/g, '/');
					fechaAnterior = datosDia.date;
					//fila[0] = datosDia._id.day + '/' + datosDia._id.month + '/' + datosDia._id.year;
					//fechaAnterior = datosDia._id.day;
					flagPrimero = false;
				}
				if (fechaAnterior != datosDia.date){
					//Al haber un cambio en la fecha cargo el promedio de ese día, avanzo una fila y reseteo las columnas
					fila[4] = acum/3;
					base.push(fila.slice());
					//Meto la fila en la matriz y vuelvo a empezar
					fila = ['', 0, 0, 0, 0, ''];
					fila[0] = datosDia.date.substr(0, 10).replace(/-/g, '/');
					fechaAnterior = datosDia.date;
					acum = 0;
				}
				switch (datosDia.terminal){
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
						response[0].cnt++;
						response[0].total += data.data.importe.total;
						if (angular.isDefined(response[0][data.data.terminal].cnt[0]) && angular.isNumber(response[0][data.data.terminal].cnt[0])) {
							response[0][data.data.terminal].cnt[0]++;
						} else {
							response[0][data.data.terminal].cnt[0] = 1;
						}
						if (angular.isDefined(response[0][data.data.terminal].total[0]) && angular.isNumber(response[0][data.data.terminal].total[0])) {
							response[0][data.data.terminal].total[0] += data.data.importe.total;
						} else {
							response[0][data.data.terminal].cnt[0] = data.data.importe.total;
						}
						for (var obj in response[0]){
							if (typeof response[0][obj] === 'object'){
								response[0][obj].cnt[1] = response[0][obj].cnt[0] * 100 / response[0].cnt;
								response[0][obj].total[1] = response[0][obj].total[0] * 100 / response[0].total;
							}
						}
					} else {
						var nuevoComprobante = {
							codTipoComprob : data.data.codTipoComprob,
							cnt : 1,
							total: data.data.importe.total,
							BACTSSA : {
								cnt: [0, 0],
								total: [0, 0]
							},
							TERMINAL4 : {
								cnt: [0, 0],
								total: [0, 0]
							},
							TRP : {
								cnt: [0, 0],
								total: [0, 0]
							}
						};
						nuevoComprobante[data.data.terminal].cnt[0] = 1;
						nuevoComprobante[data.data.terminal].cnt[1] = 100;
						nuevoComprobante[data.data.terminal].total[0] = data.data.importe.total;
						nuevoComprobante[data.data.terminal].total[1] = 100;
						$scope.comprobantesCantidad.push(nuevoComprobante);
					}
					$scope.comprobantesCantidad.invoicesCount++;
					$scope.comprobantesCantidad.totalCount += data.data.importe.total;
					$scope.$apply();
				}
			}
		});

		$scope.$on('gatesMeses', function(event, error){
			$scope.cantGates = {
				loading: false,
				error: true,
				mensaje: error
			};
		});

		$scope.$on('turnosMeses', function(event, error){
			$scope.cantTurnos = {
				loading: false,
				error: true,
				mensaje: error
			};
		});

		$scope.$on('errorFacturadoPorDia', function(event, error){
			$scope.facturadoDia = {
				loading: false,
				error: true,
				mensaje: error
			};
		});

		$scope.$on('errorFacturasMeses', function(event, error){
			$scope.facturadoMes = {
				loading: false,
				error: true,
				mensaje: error
			};
		});

		$scope.$on('errorGatesTurnosDia', function(event, error){
			$scope.gatesTurnos = {
				loading: false,
				error: true,
				mensaje: error
			};
		});

		$scope.selectRow = function (index) {
			$scope.selected = index;
		};

		$scope.traerTotales = function(){
			controlPanelFactory.getByDay({ fecha: $scope.desde }, function(data){
				$scope.control.invoicesCount = data.invoicesCount;
				$scope.fecha = fecha;
				$scope.comprobantesCantidad = data.data;
			});
		};

		$scope.traerDatosFacturadoMes = function(){
			var datos = {
				fecha: $scope.mesDesde
			};
			$scope.facturadoMes.error = false;
			$scope.facturadoMes.loading = true;
			$scope.isOpenMonth = false;
			controlPanelFactory.getFacturasMeses(datos, function(graf){
				$scope.chartFacturas.data = prepararDatosMes(graf.data, true);
				$scope.facturadoMes.loading = false;
			});
		};

		$scope.traerDatosGates = function(){
			$scope.isOpenGates = false;
			$scope.cantGates.error = false;
			$scope.cantGates.loading = true;
			controlPanelFactory.getGatesMeses({'fecha': $scope.mesDesdeGates}, function(graf){
				$scope.chartGates.data = prepararDatosMes(graf, false);
				$scope.cantGates.loading = false;
			});
		};

		$scope.traerDatosTurnos = function(){
			$scope.isOpenTurnos = false;
			$scope.cantTurnos.error = false;
			$scope.cantTurnos.loading = true;
			controlPanelFactory.getTurnosMeses({ fecha: $scope.mesDesdeTurnos }, function(graf){
				$scope.cantTurnos.loading = false;
				$scope.chartTurnos.data = prepararDatosMes(graf, false);
			});
		};

		$scope.traerDatosFacturadoDia = function(){
			var datos = {
				fecha: $scope.desde
			};
			$scope.traerTotales();
			$scope.facturadoDia.error = false;
			$scope.facturadoDia.loading = true;
			controlPanelFactory.getFacturadoPorDia(datos, function(graf){
				$scope.chartFacturado.data = prepararDatosFacturadoDia(graf.data);
				$scope.facturadoDia.loading = false;
			});
		};

		$scope.traerDatosGatesTurnosDia = function(){
			$scope.isOpenDayGatesTurnos = false;
			$scope.isOpenDayGatesTurnosFin = false;

			$scope.gatesTurnos.error = false;
			$scope.gatesTurnos.loading = true;

			$scope.diaGatesTurnos.setHours(0, 0, 0);
			$scope.diaGatesTurnosFin.setHours(0, 0, 0);
			if ($scope.radioModel == 'Gates'){
				controlPanelFactory.getGatesDia({ fechaInicio: $scope.diaGatesTurnos, fechaFin: $scope.diaGatesTurnosFin, fechaConGMT: true }, function(graf){
					$scope.gatesTurnos.loading = false;
					$scope.chartDiaGatesTurnos.data = prepararDatosGatesTurnosDia(graf);
					$scope.labelPorHora = 'Gates por hora'
				});
			}
			else if ($scope.radioModel == 'Turnos'){
				controlPanelFactory.getTurnosDia({ fechaInicio: $scope.diaGatesTurnos, fechaFin: $scope.diaGatesTurnosFin, fechaConGMT: true }, function(graf){
					$scope.gatesTurnos.loading = false;
					$scope.chartDiaGatesTurnos.data = prepararDatosGatesTurnosDia(graf);
					$scope.labelPorHora = 'Turnos por hora'
				});
			}
		};

		if (loginService.getStatus()){
			$scope.traerDatosFacturadoMes();
			$scope.traerDatosFacturadoDia();
			$scope.traerDatosGates();
			$scope.traerDatosTurnos();
			$scope.traerDatosGatesTurnosDia();
		}

		$scope.$on('terminoLogin', function(){
			$scope.traerDatosFacturadoMes();
			$scope.traerDatosFacturadoDia();
			$scope.traerDatosGates();
			$scope.traerDatosTurnos();
			$scope.traerDatosGatesTurnosDia();
		});

		$scope.$on('$destroy', function(){
			controlPanelFactory.cancelRequest();
		});

	}]);

