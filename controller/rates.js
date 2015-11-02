/**
 * Created by artiom on 12/03/15.
 */


myapp.controller('ratesCtrl',['$rootScope', '$scope', 'invoiceFactory', 'generalFunctions', 'generalCache', 'colorTerminalesCache', 'loginService', 'downloadFactory', 'dialogs', '$filter',
	function ($rootScope, $scope, invoiceFactory, generalFunctions, generalCache, colorTerminalesCache, loginService, downloadFactory, dialogs, $filter) {

		$scope.tasaAgp = false;

		$rootScope.predicate = 'terminal';

		$scope.tarifasElegidas = 1;
		$scope.total = 0;
		$scope.totalAgp = 0;
		$scope.totalPeso = 0;
		$scope.totalPesoAgp = 0;

		$scope.meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

		$scope.chartReporteTarifas = {
			title: "Detalle por tarifas",
			width: 1200,
			height: 500,
			series: {7: {type: "line"}},
			type: 'column',
			columns: 7,
			currency: true,
			stacked: false,
			is3D: false,
			money: 'PES',
			data: [
				['Fecha', '1465', '1466', '1467', 'NAGPI', 'NAGPE', 'TASAI', 'TASAE']
			],
			id: 1,
			image: null
		};

		$scope.chartTotalesPorTerminal = {
			title: "Totales por terminal",
			width: 500,
			height: 500,
			type: 'pie',
			currency: true,
			stacked: false,
			is3D: true,
			money: 'PES',
			data: [
				['BACTSSA', 0],
				['TERMINAL 4', 0],
				['TRP', 0]
			],
			id: 2,
			image: null
		};

		$scope.chartDetallePorTerminalFecha = {
			title: "",
			width: 500,
			height: 500,
			type: 'pie',
			currency: true,
			stacked: false,
			is3D: true,
			money: 'PES',
			data: [],
			id: 3,
			image: null
		};

		$scope.chartDetallePorTerminalPeriodo = {
			title: "",
			width: 500,
			height: 500,
			type: 'pie',
			currency: true,
			stacked: false,
			is3D: true,
			money: 'PES',
			data: [],
			id: 4,
			image: null
		};

		$scope.barColors = {
			"bactssa": colorTerminalesCache.get('Bactssa'),
			"terminal4": colorTerminalesCache.get('Terminal4'),
			"trp": colorTerminalesCache.get('Trp')
		};

		$scope.allRates = generalCache.get('allRates');

		$scope.configPanel = {
			tipo: 'panel-info',
			titulo: 'Tasas a las cargas',
			mensaje: 'No se han encontrado datos para los filtros seleccionados.'
		};

		// Fecha (dia y hora)
		$scope.fechaInicio = new Date();
		$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

		// Variable para almacenar la info principal que trae del factory
		$scope.rates = {};
		$scope.detalleRates = {};

		$scope.model = {
			'fechaInicio': $scope.fechaInicio,
			'fechaFin': $scope.fechaFin
		};

		$scope.modelDetalle = {
			tipo: 'date',
			contarHaciaAtras: 1,
			fechaInicio: new Date(),
			fechaFin: new Date()
		};

		$scope.cargando = false;
		$scope.mostrarGrafico = false;
		$scope.verDetalleTerminal = false;

		var obtenerDescripcionFecha = function(datosDia){
			switch ($scope.modelDetalle.tipo){
				case 'date':
					return $filter('date')(datosDia.date, 'dd/MM/yyyy');
					break;
				case 'month':
					return ($scope.meses[datosDia.month-1] + ' del ' + datosDia.year);
					break;
				case 'year':
					return $filter('date')(datosDia.date, 'yyyy');
					break;
			}
		};

		$scope.detallar = function(){
			$scope.verDetalleTerminal = false;
			switch ($scope.detallarTerminal){
				case 'BACTSSA':
					$scope.chartDetallePorTerminalFecha.data = [
						['1465', 0],
						['1466', 0],
						['1467', 0]
					];
					$scope.chartDetallePorTerminalPeriodo.data = [
						['1465', 0],
						['1466', 0],
						['1467', 0]
					];
					break;
				case 'TERMINAL4':
					$scope.chartDetallePorTerminalFecha.data = [
						['NAGPI', 0],
						['NAGPE', 0]
					];
					$scope.chartDetallePorTerminalPeriodo.data = [
						['NAGPI', 0],
						['NAGPE', 0]
					];
					break;
				case 'TRP':
					$scope.chartDetallePorTerminalFecha.data = [
						['TASAI', 0],
						['TASAE', 0]
					];
					$scope.chartDetallePorTerminalPeriodo.data = [
						['TASAI', 0],
						['TASAE', 0]
					];
					break;
			}
			var row;
			var ponerFecha;
			$scope.detalleRates.forEach(function(datosDia){
				if (datosDia.terminal == $scope.detallarTerminal){
					ponerFecha = obtenerDescripcionFecha(datosDia);
					switch (datosDia.code){
						case '1465':
						case 'NAGPI':
						case 'TASAI':
							row = 0;
							break;
						case '1466':
						case 'NAGPE':
						case 'TASAE':
							row = 1;
							break;
						case '1467':
							row = 2;
					}
					if ($scope.tasaAgp){
						$scope.chartDetallePorTerminalPeriodo.data[row][1] += datosDia.totalPesoAgp;
					} else {
						$scope.chartDetallePorTerminalPeriodo.data[row][1] += datosDia.totalPeso;
					}
					if ($scope.detallarFecha == ponerFecha){
						if ($scope.tasaAgp){
							$scope.chartDetallePorTerminalFecha.data[row][1] += datosDia.totalPesoAgp;
						} else {
							$scope.chartDetallePorTerminalFecha.data[row][1] += datosDia.totalPeso;
						}
					}
				}
			});
			$scope.chartDetallePorTerminalPeriodo.title = 'Total de ' + $scope.detallarTerminal + ' para el período graficado';
			switch ($scope.modelDetalle.tipo){
				case 'date':
					$scope.chartDetallePorTerminalFecha.title = 'Total de ' + $scope.detallarTerminal + ' para el día ' + $scope.detallarFecha;
					break;
				case 'month':
					$scope.chartDetallePorTerminalFecha.title = 'Total de ' + $scope.detallarTerminal + ' para ' + $scope.detallarFecha;
					break;
				case 'year':
					$scope.chartDetallePorTerminalFecha.title = 'Total de ' + $scope.detallarTerminal + ' para el año ' + $scope.detallarFecha;
					break;
			}
			$scope.verDetalleTerminal = true;
		};

		$scope.detallarTerminal = '';
		$scope.detallarFecha = '';

		$scope.selectRow = function (index, id) {
			if (angular.isDefined(index) && id == 1 && index.column < 8){
				var rate = $scope.chartReporteTarifas.data[0][index.column];
				switch (rate){
					case '1465':
					case '1466':
					case '1467':
						$scope.detallarTerminal = 'BACTSSA';
						break;
					case 'NAGPI':
					case 'NAGPE':
						$scope.detallarTerminal = 'TERMINAL4';
						break;
					case 'TASAI':
					case 'TASAE':
						$scope.detallarTerminal = 'TRP';
						break;
				}
				if (angular.isDefined(index.row)){
					$scope.detallarFecha = $scope.chartReporteTarifas.data[index.row + 1][0];
				} else {
					switch ($scope.modelDetalle.tipo){
						case 'date':
							$scope.detallarFecha = $filter('date')($scope.modelDetalle.fechaFin, 'dd/MM/yyyy');
							break;
						case 'month':
							$scope.detallarFecha = $scope.meses[$scope.modelDetalle.fechaFin.getMonth()] + ' del ' + $scope.modelDetalle.fechaFin.getFullYear();
							break;
						case 'year':
							$scope.detallarFecha = $filter('date')($scope.modelDetalle.fechaFin, 'yyyy');
							break;
					}
				}
				$scope.detallar();
			}
		};

		$scope.actualizarDetalle = function(){
			$scope.mostrarGrafico = false;
			switch ($scope.modelDetalle.tipo){
				case 'date':
					$scope.modelDetalle.fechaInicio = new Date($scope.modelDetalle.fechaFin.getFullYear(), $scope.modelDetalle.fechaFin.getMonth(), $scope.modelDetalle.fechaFin.getDate() - $scope.modelDetalle.contarHaciaAtras);
					break;
				case 'month':
					$scope.modelDetalle.fechaInicio = new Date($scope.modelDetalle.fechaFin.getFullYear(), $scope.modelDetalle.fechaFin.getMonth() - $scope.modelDetalle.contarHaciaAtras, $scope.modelDetalle.fechaFin.getDate());
					$scope.modelDetalle.fechaFin.setMonth($scope.modelDetalle.fechaFin.getMonth() + 1);
					break;
				case 'year':
					$scope.modelDetalle.fechaInicio = new Date($scope.modelDetalle.fechaFin.getFullYear() - $scope.modelDetalle.contarHaciaAtras, $scope.modelDetalle.fechaFin.getMonth(), $scope.modelDetalle.fechaFin.getDate());
					$scope.modelDetalle.fechaFin.setFullYear($scope.modelDetalle.fechaFin.getFullYear() + 1);
					break;
			}
			invoiceFactory.getDetailRates($scope.modelDetalle, function(data){
				if (data.status == 'OK'){
					$scope.detalleRates = data.data;
					$scope.armarGraficoDetalle();
					$scope.mostrarGrafico = true;
				}
			});
		};

		$scope.armarGrafico = function(){

			$scope.total = 0;
			$scope.totalAgp = 0;
			$scope.totalPeso = 0;
			$scope.totalPesoAgp = 0;

			var base = [
				['BACTSSA', 0],
				['TERMINAL 4', 0],
				['TRP', 0]
			];

			var row;
			$scope.rates.forEach(function(tasa){
				switch (tasa.terminal){
					case 'BACTSSA':
						row = 1;
						break;
					case 'TERMINAL4':
						row = 2;
						break;
					case 'TRP':
						row = 3;
						break;
				}
				if ($scope.tasaAgp){
					base[row - 1][1] += tasa.totalPesoAgp;
				} else {
					base[row - 1][1] += tasa.totalPeso;
				}
				$scope.total += tasa.total;
				$scope.totalAgp += tasa.totalAgp;
				$scope.totalPeso += tasa.totalPeso;
				$scope.totalPesoAgp += tasa.totalPesoAgp;

			});
			$scope.chartTotalesPorTerminal.data = base;
		};

		$scope.openDate = function(event){
			generalFunctions.openDate(event);
		};

		$scope.hitEnter = function(evt){
			if(angular.equals(evt.keyCode,13))
				$scope.filtrar();
		};

		$scope.maxDate = new Date();

		$scope.$on('errorInesperado', function(e, mensaje){
			$scope.cargando = false;
			$scope.rates = [];
			$scope.configPanel = mensaje;
		});

		$scope.ponerDescripcion = function(codigo){
			return $scope.allRates[codigo];
		};

		$scope.cambioTasa = function(){
			$scope.tasaAgp = !$scope.tasaAgp;
			$scope.armarGrafico();
			$scope.armarGraficoDetalle();
			if ($scope.verDetalleTerminal){
				$scope.detallar();
			}
		};

		$scope.armarGraficoDetalle = function(){
			//Matriz base de los datos del gráfico, ver alternativa al hardcodeo de los nombres de las terminales
			$scope.chartReporteTarifas.data = [
				['Fecha', '1465', '1466', '1467', 'NAGPI', 'NAGPE', 'TASAI', 'TASAE', 'Promedio']
			];
			//Para cambiar entre columnas
			var lugarFila = 1;
			//Para cargar promedio
			//var acum = 0;
			var fila = ['', 0, 0, 0, 0, 0, 0, 0, 0];
			var filaEncontrada = false;
			var ponerFecha;
			//Los datos vienen en objetos que incluyen la fecha, la terminal, y la suma facturada(cnt)
			//ordenados por fecha
			$scope.detalleRates.forEach(function(datosDia){
				switch ($scope.modelDetalle.tipo){
					case 'date':
						ponerFecha = $filter('date')(datosDia.date, 'dd/MM/yyyy');
						break;
					case 'month':
						ponerFecha = ($scope.meses[datosDia.month-1] + ' del ' + datosDia.year);
						break;
					case 'year':
						ponerFecha = $filter('date')(datosDia.date, 'yyyy');
						break;
				}
				switch (datosDia.code){
					case "1465":
						lugarFila = 1;
						break;
					case "1466":
						lugarFila = 2;
						break;
					case "1467":
						lugarFila = 3;
						break;
					case "NAGPI":
						lugarFila = 4;
						break;
					case "NAGPE":
						lugarFila = 5;
						break;
					case "TASAI":
						lugarFila = 6;
						break;
					case "TASAE":
						lugarFila = 7;
						break;
				}
				$scope.chartReporteTarifas.data.forEach(function(unaFila){
					if (unaFila[0] == ponerFecha){
						filaEncontrada = true;
						if ($scope.tasaAgp){
							unaFila[lugarFila] += datosDia.totalPesoAgp;
							unaFila[8] += datosDia.totalPesoAgp;
						} else {
							unaFila[lugarFila] += datosDia.totalPeso;
							unaFila[8] += datosDia.totalPeso;
						}
					}
				});
				if (!filaEncontrada){
					fila = ['', 0, 0, 0, 0, 0, 0, 0, 0];
					fila[0] = ponerFecha;
					if ($scope.tasaAgp){
						fila[lugarFila] += datosDia.totalPesoAgp;
						fila[8] += datosDia.totalPesoAgp;
					} else {
						fila[lugarFila] += datosDia.totalPeso;
						fila[8] += datosDia.totalPeso;
					}
					$scope.chartReporteTarifas.data.push(fila.slice());
				}
				filaEncontrada = false;
			});
			for (i = 1;i<$scope.chartReporteTarifas.data.length;i++){
				$scope.chartReporteTarifas.data[i][8] = $scope.chartReporteTarifas.data[i][8]/7
			}
		};

		$scope.cargaRates = function () {
			$scope.verDetalleTerminal = false;
			switch ($scope.modelDetalle.tipo){
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
			$scope.modelDetalle.fechaFin = $scope.model.fechaInicio;
			if (!angular.isDefined($scope.model['fechaInicio'])) $scope.model.fechaInicio = $scope.fechaInicio;
			$scope.total = 0;
			$scope.chartTotalesPorTerminal.data = [
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
			invoiceFactory.getRatesInvoices($scope.model, function (data) {
				if (data.status === "OK") {
					$scope.rates = data.data;
					if (data.data.length > 0){
						$scope.armarGrafico();
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
			});
		};

		$scope.descargarPdf = function(){
			var data = {
				id: $scope.id,
				rates: $scope.rates,
				charts: [
					{filename: $scope.chartReporteTarifas.id, image: $scope.chartReporteTarifas.image},
					{filename: $scope.chartTotalesPorTerminal.id, image: $scope.chartTotalesPorTerminal.image}
				]
			};
			var nombreReporte = 'rates.pdf';
			downloadFactory.convertToPdf(data, 'reporteRatesPdf', function(data, status){
				if (status == 'OK'){
					var file = new Blob([data], {type: 'application/pdf'});
					var fileURL = URL.createObjectURL(file);

					var anchor = angular.element('<a/>');
					anchor.css({display: 'none'}); // Make sure it's not visible
					angular.element(document.body).append(anchor); // Attach to document

					anchor.attr({
						href: fileURL,
						target: '_blank',
						download: nombreReporte
					})[0].click();

					anchor.remove(); // Clean it up afterwards
					//window.open(fileURL);
				} else {
					dialogs.error('Tarifario', 'Se ha producido un error al intentar exportar el tarifario a PDF');
				}
			})
		};

		if (loginService.getStatus()) $scope.cargaRates();

		$scope.$on('terminoLogin', function(){
			$scope.cargaRates();
		});

	}]);
