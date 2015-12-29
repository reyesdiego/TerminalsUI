/**
 * Created by artiom on 17/11/15.
 */
myapp.controller('matCtrl', ['$scope', 'liquidacionesFactory', 'generalFunctions', 'colorTerminalesCache', 'dialogs', 'downloadFactory',
	function($scope, liquidacionesFactory, generalFunctions, colorTerminalesCache, dialogs, downloadFactory){

		$scope.disableModify = true;

		$scope.barColors = {
			"bactssa": colorTerminalesCache.get('Bactssa'),
			"terminal4": colorTerminalesCache.get('Terminal4'),
			"trp": colorTerminalesCache.get('Trp')
		};

		$scope.chartReporteMat = {
			title: 'MAT por terminal',
			width: 500,
			height: 500,
			type: 'pie',
			columns: 1,
			currency: true,
			stacked: false,
			is3D: true,
			money: 'DOL',
			data: [
				['BACTSSA', 1000],
				['TERMINAL4', 2000],
				['TRP', 4000]
			],
			id: 1,
			image: null
		};

		$scope.chartMatTotal = {
			title: 'MAT total',
			width: 500,
			height: 500,
			type: 'pie',
			columns: 1,
			currency: true,
			stacked: false,
			is3D: true,
			money: 'DOL',
			data: [
				['Total', 7000],
				['Restante', 10000]
			],
			id: 2,
			image: null
		};

		$scope.model = {
			year: new Date(),
			valorMAT: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			},
			actualizar:{
				BACTSSA: false,
				TERMINAL4: false,
				TRP: false
			}
		};

		$scope.matData = {};
		$scope.matMonth = {
			BACTSSA: 0,
			TERMINAL4: 0,
			TRP: 0
		};
		$scope.totales = {
			BACTSSA: 0,
			TERMINAL4: 0,
			TRP: 0
		};
		$scope.dataFacturado = {
			Enero: {
				facturado: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				},
				diferencia: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				}
			},
			Febrero: {
				facturado: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				},
				diferencia: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				}
			},
			Marzo: {
				facturado: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				},
				diferencia: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				}
			},
			Abril: {
				facturado: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				},
				diferencia: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				}
			},
			Mayo: {
				facturado: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				},
				diferencia: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				}
			},
			Junio: {
				facturado: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				},
				diferencia: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				}
			},
			Julio: {
				facturado: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				},
				diferencia: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				}
			},
			Agosto: {
				facturado: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				},
				diferencia: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				}
			},
			Septiembre: {
				facturado: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				},
				diferencia: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				}
			},
			Octubre: {
				facturado: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				},
				diferencia: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				}
			},
			Noviembre: {
				facturado: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				},
				diferencia: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				}
			},
			Diciembre: {
				facturado: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				},
				diferencia: {
					BACTSSA: 0,
					TERMINAL4: 0,
					TRP: 0
				}
			}
		};

		$scope.selectRow = function (index) {
			$scope.selected = index;
		};
		$scope.rowClass = function (index) {
			return ($scope.selected === index) ? "selected" : "";
		};

		$scope.openDate = function(event){
			generalFunctions.openDate(event);
		};

		$scope.verCambios = function(){
			for (var terminal in $scope.model.valorMAT){
				if ($scope.model.valorMAT.hasOwnProperty(terminal)){
					if ($scope.model.valorMAT[terminal] == '') $scope.model.valorMAT[terminal] = 0;
					$scope.model.valorMAT[terminal] = parseFloat($scope.model.valorMAT[terminal]);
				}
			}
			$scope.disableModify = ($scope.model.valorMAT.BACTSSA == $scope.matData.BACTSSA && $scope.model.valorMAT.TERMINAL4 == $scope.matData.TERMINAL4 && $scope.model.valorMAT.TRP == $scope.matData.TRP);
		};

		$scope.actualizarMAT = function(terminal){
			var data = {
				terminal: terminal,
				mat: $scope.model.valorMAT[terminal],
				year: $scope.model.year.getFullYear()
			};
			liquidacionesFactory.saveMat(data, $scope.model.actualizar[terminal], function(data){
				console.log(data);
				if (data.status == 'OK'){
					$scope.matData[terminal] = data.data.mat;
					$scope.model.valorMAT = angular.copy($scope.matData);
				}
			});
		};

		$scope.cargarDatos = function(){
			$scope.model.valorMAT.BACTSSA = 0;
			$scope.model.valorMAT.TERMINAL4 = 0;
			$scope.model.valorMAT.TRP = 0;
			$scope.model.actualizar.BACTSSA = false;
			$scope.model.actualizar.TERMINAL4 = false;
			$scope.model.actualizar.TRP = false;
			$scope.matData = {};
			liquidacionesFactory.getMAT($scope.model.year.getFullYear(), function(data){
				console.log(data);
				if (data.status == 'OK'){
					var totalMat = 0;
					data.data.forEach(function(matData){
						$scope.matData[matData.terminal] = matData.mat;
						$scope.model.actualizar[matData.terminal] = true;
						/*matData.months.forEach(function(mesFacturado){
						 $scope.dataFacturado[mesFacturado.month].
						 });*/
					});
					$scope.model.valorMAT = angular.copy($scope.matData);
				}
			})
		};

		$scope.descargarPdf = function(){
			var data = {
				id: $scope.$id,
				anio: $scope.model.year.getFullYear(),
				hoy: new Date(),
				matData: {
					valorMAT: angular.copy($scope.model.valorMAT),
					dataFacturado: angular.copy($scope.dataFacturado)
				},
				charts: [
					{filename: $scope.chartReporteMat.id, image: $scope.chartReporteMat.image, h: $scope.chartReporteMat.height, w: $scope.chartReporteMat.width},
					{filename: $scope.chartMatTotal.id, image: $scope.chartMatTotal.image, h: $scope.chartMatTotal.height, w: $scope.chartMatTotal.width}
				]
			}

			var nombreReporte = 'Reporte_MAT_' + data.anio + '.pdf';
			downloadFactory.convertToPdf(data, 'reporteMATPdf', function(data, status){
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

		$scope.cargarDatos();

	}]);