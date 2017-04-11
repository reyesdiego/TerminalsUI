/**
 * Created by artiom on 12/03/15.
 */


myapp.controller('ratesCtrl',['$rootScope', '$scope', 'invoiceFactory', 'generalFunctions', 'cacheService', 'loginService', 'downloadFactory', 'dialogs', '$filter',
	function ($rootScope, $scope, invoiceFactory, generalFunctions, cacheService, loginService, downloadFactory, dialogs, $filter) {

		const barColors = {
			"bactssa": cacheService.colorTerminalesCache.get('Bactssa'),
			"terminal4": cacheService.colorTerminalesCache.get('Terminal4'),
			"trp": cacheService.colorTerminalesCache.get('Trp')
		};

		$rootScope.predicate = 'terminal';

		$scope.tarifasElegidas = 1;
		$scope.total = 0;
		$scope.totalAgp = 0;
		$scope.totalPeso = 0;
		$scope.totalPesoAgp = 0;

		$scope.datepickerOptions = [
			{maxDate: new Date()},
			{maxDate: new Date(), datepickerMode: 'month', minMode: 'month'},
			{maxDate: new Date(), datepickerMode: 'year', minMode: 'year'}
		];

		$scope.meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

		$scope.chartReporteTarifas = {
			options: {
				title: "Detalle por tarifas",
				width: 1400,
				height: 600,
				series: {},
				//columns: 8,
				currency: true,
				stacked: false,
				is3D: false,
				money: 'PES',
				id: 1,
				image: null
			},
			data: [
				['Fecha', '1465', '1466', '1467', 'NAGPI', 'NAGPE', 'TASAI', 'TASAE', 'Promedio']
			]
		};

		$scope.chartTotalesPorTerminal = {
			options: {
				title: "Totales por terminal",
				width: 500,
				height: 500,
				currency: true,
				stacked: false,
				is3D: true,
				colors: [barColors.bactssa, barColors.terminal4, barColors.trp],
				money: 'PES',
				id: 2,
				image: null
			},
			data: [
				['Terminal', 'Total']
			]
		};

		$scope.configPanel = {
			tipo: 'panel-info',
			titulo: 'Tasas a las cargas',
			mensaje: 'No se han encontrado datos para los filtros seleccionados.'
		};

		// Fecha (dia y hora)
		$scope.fechaInicio = new Date();
		$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

		// Variable para almacenar la info principal que trae del factory
		$scope.rates = [];
		$scope.detalleRates = {};

		$scope.model = {
			'period': 'date',
			'tasaAgp': 0,
			'fechaInicio': $scope.fechaInicio,
			'fechaFin': $scope.fechaFin
		};

		$scope.modelDetalle = {
			//tipo: 'date',
			contarHaciaAtras: 0,
			fechaInicio: new Date(),
			fechaFin: new Date()
		};

		$scope.cargando = false;
		$scope.mostrarGrafico = false;

		$scope.detallarTerminal = '';
		$scope.detallarFecha = '';

		$scope.selectRow = (index, id) => {

		};

		$scope.actualizarDetalle = function(){
			$scope.mostrarGrafico = false;
			let params = {
				period: $scope.model.period,
				fechaInicio: new Date($scope.model.fechaInicio),
				fechaFin: new Date($scope.model.fechaInicio)
			};
			switch ($scope.model.period){
				case 'date':
					params.fechaInicio = new Date(params.fechaFin.getFullYear(), params.fechaFin.getMonth(), params.fechaFin.getDate() - $scope.modelDetalle.contarHaciaAtras);
					params.fechaFin.setDate(params.fechaFin.getDate() + 1);
					break;
				case 'month':
					params.fechaInicio = new Date(params.fechaFin.getFullYear(), params.fechaFin.getMonth() - $scope.modelDetalle.contarHaciaAtras, params.fechaFin.getDate());
					params.fechaFin.setMonth(params.fechaFin.getMonth() + 1);
					break;
				case 'year':
					params.fechaInicio = new Date(params.fechaFin.getFullYear() - $scope.modelDetalle.contarHaciaAtras, params.fechaFin.getMonth(), params.fechaFin.getDate());
					params.fechaFin.setFullYear(params.fechaFin.getFullYear() + 1);
					break;
			}
			invoiceFactory.getDetailRates(params, function(data){
				if (data.status == 'OK'){
					$scope.detalleRates = data.data;
					armarGraficoDetalle();
					$scope.mostrarGrafico = true;
				}
			});
		};

		function armarGrafico(){

			$scope.total = 0;
			$scope.totalAgp = 0;
			$scope.totalPeso = 0;
			$scope.totalPesoAgp = 0;

			let base = [
				['Terminal', 'Total'],
				['BACTSSA', 0],
				['TERMINAL 4', 0],
				['TRP', 0]
			];

			let row;
			$scope.rates[0].codes.forEach((tasa) => {
				switch (tasa.terminal){
					case 'BACTSSA':
						row = 2;
						break;
					case 'TERMINAL4':
						row = 3;
						break;
					case 'TRP':
						row = 4;
						break;
				}
				if ($scope.model.tasaAgp){
					base[row - 1][1] += tasa.totalPesoAgp;
					$scope.totalAgp += tasa.totalAgp;
					$scope.totalPesoAgp += tasa.totalPesoAgp;
				} else {
					base[row - 1][1] += tasa.totalPeso;
					$scope.total += tasa.total;
					$scope.totalPeso += tasa.totalPeso;
				}

			});
			$scope.chartTotalesPorTerminal.data = base;
		};

		$scope.openDate = (event) => {
			generalFunctions.openDate(event);
		};

		$scope.$on('errorInesperado', (e, mensaje) => {
			$scope.cargando = false;
			$scope.rates = [];
			$scope.configPanel = mensaje;
		});

		function armarGraficoDetalle(){
			//Matriz base de los datos del gráfico, ver alternativa al hardcodeo de los nombres de las terminales
			$scope.chartReporteTarifas.data = [
				['Fecha']
			];
			let filaMayor;
			let cantTarifas = 0;
			let indice = 0;
			$scope.detalleRates.forEach((datosDia) => {
				if (datosDia.codes.length > cantTarifas) {
					cantTarifas = datosDia.codes.length;
					filaMayor = indice;
				}
				indice++;
			});
			$scope.detalleRates[filaMayor].codes.forEach((datosCode) => {
				$scope.chartReporteTarifas.data[0].push(datosCode.code);
			});
			$scope.chartReporteTarifas.data[0].push('Promedio');
			$scope.chartReporteTarifas.options.series[$scope.chartReporteTarifas.data[0].length-2] = {type: 'line'};
			//Para cambiar entre columnas
			let lugarFila = 1;
			//Para cargar promedio
			//var acum = 0;
			let fila = new Array(cantTarifas+2);
			let filaEncontrada = false;
			let ponerFecha;
			//Los datos vienen agrupados por fecha (date), un array con los códigos y las propiedades pertinentes
			//ordenados por fecha (?)
			$scope.detalleRates.forEach((datosDia) => {
				for (let i = 0; i < fila.length; i++){
					fila[i] = 0;
				}
				switch ($scope.model.period){
					case 'date':
						ponerFecha = $filter('date')(datosDia.date, 'dd/MM/yyyy');
						break;
					case 'month':
						//ponerFecha = ($scope.meses[datosDia.month-1] + ' del ' + datosDia.year);
						ponerFecha = $filter('date')(datosDia.date, 'MM/yyyy');
						break;
					case 'year':
						ponerFecha = datosDia.date;
						break;
				}
				fila[0] = ponerFecha;
				datosDia.codes.forEach((datosCode) => {
					lugarFila = $scope.chartReporteTarifas.data[0].indexOf(datosCode.code);
					if ($scope.model.tasaAgp){
						fila[lugarFila] += datosCode.totalPesoAgp;
						fila[fila.length-1] += datosCode.totalPesoAgp;
					} else {
						fila[lugarFila] += datosCode.totalPeso;
						fila[fila.length-1] += datosCode.totalPeso;
					}
				});
				$scope.chartReporteTarifas.data.push(fila.slice());
			});
			for (let i = 1;i<$scope.chartReporteTarifas.data.length;i++){
				$scope.chartReporteTarifas.data[i][$scope.chartReporteTarifas.data[i].length-1] = $scope.chartReporteTarifas.data[i][$scope.chartReporteTarifas.data[i].length-1]/($scope.chartReporteTarifas.data[i].length-2)
			}
			$scope.chartReporteTarifas.options.columns = $scope.chartReporteTarifas.data[0].length-1;
		}

		$scope.cargaRates = () =>{
			switch ($scope.model.period){
				case 'date': //diario
					$scope.model.fechaFin = new Date($scope.model.fechaInicio.getTime() + 24 * 60 * 60 * 1000);
					break;
				case 'month': //mensual
					$scope.model.fechaInicio.setDate(1);
					$scope.model.fechaFin = new Date($scope.model.fechaInicio.getFullYear(), $scope.model.fechaInicio.getMonth()+1, $scope.model.fechaInicio.getDate());
					break;
				case 'year': //anual
					$scope.model.fechaInicio.setDate(1);
					$scope.model.fechaInicio.setMonth(0);
					$scope.model.fechaFin = new Date($scope.model.fechaInicio.getFullYear()+1, $scope.model.fechaInicio.getMonth(), $scope.model.fechaInicio.getDate());
					break;
			}
			$scope.modelDetalle.fechaFin = new Date($scope.model.fechaInicio);
			if (!angular.isDefined($scope.model['fechaInicio'])) $scope.model.fechaInicio = $scope.fechaInicio;
			$scope.total = 0;
			$scope.chartTotalesPorTerminal.data = [
				['Terminal', 'Totales'],
				['BACTSSA', 0],
				['TERMINAL 4', 0],
				['TRP', 0]
			];
			$scope.cargando = true;
			$scope.configPanel = {
				tipo: 'panel-info',
				titulo: 'Tasas a las cargas',
				mensaje: 'No se han encontrado datos para los filtros seleccionados.'
			};
			invoiceFactory.getRatesInvoices($scope.model, (data) => {
				if (data.status === "OK") {
					$scope.rates = data.data;
					if (data.data.length > 0){
						armarGrafico();
					}
				} else {
					$scope.configPanel = {
						tipo: 'panel-danger',
						titulo: 'Tasas a las cargas',
						mensaje: 'Se ha producido un error al cargar los datos de tasas a las cargas.'
					};
				}
				$scope.cargando = false;
				$scope.actualizarDetalle();
			})
		};

		$scope.descargarPdf = () => {
			let data = {
				id: $scope.$id,
				rates: $scope.rates,
				tasaAgp: $scope.model.tasaAgp,
				tipo: $scope.model.period,
				fecha: $scope.model.fechaInicio,
				hoy: new Date(),
				totales: $scope.chartTotalesPorTerminal.data,
				charts: [
					{filename: $scope.chartReporteTarifas.options.id, image: $scope.chartReporteTarifas.options.image, h: $scope.chartReporteTarifas.options.height, w: $scope.chartReporteTarifas.options.width},
					{filename: $scope.chartTotalesPorTerminal.options.id, image: $scope.chartTotalesPorTerminal.options.image, h: $scope.chartTotalesPorTerminal.options.height, w: $scope.chartTotalesPorTerminal.options.width},
					{filename: $scope.chartDetallePorTerminalFecha.options.id, image: $scope.chartDetallePorTerminalFecha.options.image, h: $scope.chartDetallePorTerminalFecha.options.height, w: $scope.chartDetallePorTerminalFecha.options.width},
					{filename: $scope.chartDetallePorTerminalPeriodo.options.id, image: $scope.chartDetallePorTerminalPeriodo.options.image, h: $scope.chartDetallePorTerminalPeriodo.options.height, w: $scope.chartDetallePorTerminalPeriodo.options.width}
				]
			};
			let nombreReporte = 'Reporte_tasas.pdf';
			downloadFactory.convertToPdf(data, 'reporteRatesPdf', nombreReporte).then(() => {

			}).catch(() => {
				dialogs.error('Tarifario', 'Se ha producido un error al intentar exportar el tarifario a PDF');
			});
		};

		$scope.$watch('model.period', () => {
			if ($scope.model.period == 'date') $scope.model.fechaInicio = new Date();
		});

		if (loginService.isLoggedIn) $scope.cargaRates();

	}]);
