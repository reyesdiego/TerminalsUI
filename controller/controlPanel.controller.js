/**
 * Created by kolesnikov-a on 21/02/14.
 */
myapp.controller('controlCtrl', ['$rootScope', '$scope', 'controlPanelFactory', 'formatService', 'generalFunctions', 'cacheService', 'loginService',
	function ($rootScope, $scope, controlPanelFactory, formatService, generalFunctions, cacheService, loginService){

		const maxDate = new Date();

		$scope.tipoFiltro = 'cantidad';

		$scope.openfechaInicio = false;

		$scope.hitEnter = function(evt){
			if(angular.equals(evt.keyCode,13))
				$scope.filtrar();
		};

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
			maxDate: new Date(maxDate.getFullYear(), (maxDate.getMonth() + 1), '01' )
		};

		$scope.datepickerGatesTurnos = {
			showWeeks: false,
			maxDate: new Date(maxDate.getFullYear(), (maxDate.getMonth() + 2), 0 )
		};

		$scope.barColors = {
			"bactssa": cacheService.colorTerminalesCache.get('Bactssa'),
			"terminal4": cacheService.colorTerminalesCache.get('Terminal4'),
			"trp": cacheService.colorTerminalesCache.get('Trp')
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
		$scope.mesDesde = new Date($scope.desde.getFullYear(), ($scope.desde.getMonth()), '01' );
		$scope.mesDesdeGates = new Date($scope.desde.getFullYear(), ($scope.desde.getMonth()), '01' );
		$scope.mesDesdeTurnos = new Date($scope.desde.getFullYear(), ($scope.desde.getMonth()), '01' );
		$scope.diaGatesTurnos = new Date();
		$scope.diaGatesTurnosFin = new Date();

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

		$scope.selectRow = function (index) {
			$scope.selected = index;
		};

		$scope.traerTotales = function(){
			const fecha = new Date();
			controlPanelFactory.getByDay({ fecha: $scope.desde }).then(data => {
				$scope.fecha = fecha;
				$scope.comprobantesCantidad = data.data;
			}).catch(error => {
				//TODO ver que hacer aca
			});
		};

		$scope.traerDatosFacturadoMes = function(){
			const datos = {
				fecha: $scope.mesDesde
			};
			$scope.facturadoMes.error = false;
			$scope.facturadoMes.loading = true;
			$scope.isOpenMonth = false;
			controlPanelFactory.getFacturasMeses(datos).then((graf) => {
				if (graf){
					$scope.chartFacturas.data = graf.data;
					$scope.facturadoMes.loading = false;
				} else {
					$scope.facturadoMes.error = true;
					$scope.facturadoMes.loading = false;
				}
			}).catch(error => {
				console.log(error);
				if (error.status != -5){
					$scope.facturadoMes = {
						loading: false,
						error: true,
						mensaje: error.data
					};
				}
			});
		};

		$scope.traerDatosGates = function(){
			$scope.isOpenGates = false;
			$scope.cantGates.error = false;
			$scope.cantGates.loading = true;
			controlPanelFactory.getGatesMeses({'fecha': $scope.mesDesdeGates}).then((graf) => {
				if (graf.status == 'OK'){
					$scope.chartGates.data = graf.data;
					$scope.cantGates.loading = false;
				} else {
					$scope.cantGates.error = true;
					$scope.cantGates.loading = false;
				}
			}).catch(error => {
				if (error.status != -5){
					$scope.cantGates = {
						loading: false,
						error: true,
						mensaje: error.data
					};
				}
			});
		};

		$scope.traerDatosTurnos = function(){
			$scope.isOpenTurnos = false;
			$scope.cantTurnos.error = false;
			$scope.cantTurnos.loading = true;
			controlPanelFactory.getTurnosMeses({ fecha: $scope.mesDesdeTurnos }).then((graf) => {
				if (graf.status == 'OK'){
					$scope.cantTurnos.loading = false;
					$scope.chartTurnos.data = graf.data;
				} else {
					$scope.cantTurnos.error = true;
					$scope.cantTurnos.loading = false;
				}
			}).catch(error => {
				if (error.status != -5){
					$scope.cantTurnos = {
						loading: false,
						error: true,
						mensaje: error.data
					};
				}
			});
		};

		$scope.traerDatosFacturadoDia = function(){
			const datos = {
				fecha: $scope.desde
			};
			$scope.traerTotales();
			$scope.facturadoDia.error = false;
			$scope.facturadoDia.loading = true;
			controlPanelFactory.getFacturadoPorDia(datos).then((graf) => {
				if (graf){
					$scope.chartFacturado.data = graf.data;
					$scope.facturadoDia.loading = false;
				} else {
					$scope.facturadoDia.error = true;
					$scope.facturadoDia.loading = false;
				}
			}).catch(error => {
				if (error.status != -5){
					$scope.facturadoDia = {
						loading: false,
						error: true,
						mensaje: error.data
					};
				}
			});
		};

		$scope.traerDatosGatesTurnosDia = function(){
			let promise = null;
			$scope.isOpenDayGatesTurnos = false;
			$scope.isOpenDayGatesTurnosFin = false;

			$scope.gatesTurnos.error = false;
			$scope.gatesTurnos.loading = true;

			$scope.diaGatesTurnos.setHours(0, 0, 0);
			$scope.diaGatesTurnosFin.setHours(0, 0, 0);

			const params = {
				fechaInicio: $scope.diaGatesTurnos,
				fechaFin: $scope.diaGatesTurnosFin,
				fechaConGMT: true
			};

			if ($scope.radioModel == 'Gates'){
				promise = controlPanelFactory.getGatesDia(params);
			} else if ($scope.radioModel == 'Turnos'){
				promise = controlPanelFactory.getTurnosDia(params);
			}
			promise.then((graf) => {
				if (graf){
					$scope.gatesTurnos.loading = false;
					$scope.chartDiaGatesTurnos.data = graf;
					if ($scope.radioModel == 'Gates'){
						$scope.labelPorHora = 'Gates por hora'
					} else {
						$scope.labelPorHora = 'Turnos por hora'
					}
				} else {
					$scope.gatesTurnos.error = true;
					$scope.gatesTurnos.loading = false;
				}
			}).catch(error => {
				if (error.status != -5){
					$scope.gatesTurnos = {
						loading: false,
						error: true,
						mensaje: error.data
					};
				}
			});
		};

		if (loginService.isLoggedIn){
			$scope.traerDatosFacturadoMes();
			$scope.traerDatosFacturadoDia();
			$scope.traerDatosGates();
			$scope.traerDatosTurnos();
			$scope.traerDatosGatesTurnosDia();
		}

	}]);

