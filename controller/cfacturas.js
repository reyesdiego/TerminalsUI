/**
 * Created by kolesnikov-a on 21/02/14.
 */

function cfacturasCtrl($scope, invoiceFactory, priceFactory, vouchersFactory){
	'use strict';
	vouchersFactory.getVouchersType(function(data){
		$scope.comprobantesTipos = data.data;
	});

	// Fecha (dia y hora)
	$scope.hasta = new Date();
	$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());
	$scope.terminoCarga = false;
	$scope.dateOptions = { 'startingDay': 0, 'showWeeks': false };
	$scope.format = 'yyyy-MM-dd';
	$scope.terminalFacturas = "BACTSSA";
	$scope.verDetalle = "";
	$scope.tipoComprobante = "0";
	$scope.flagWatch = false;

	$scope.open = function($event, fecha) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.openFechaDesde = (fecha === 'desde');
		$scope.openFechaHasta = (fecha === 'hasta');
	};

	$scope.currentPageTasaCargas = 1;
	$scope.totalItemsTasaCargas = 0;

	$scope.cargar = function(){
		//Traigo todos los códigos de la terminal y me los guardo

		invoiceFactory.getTarifasTerminal($scope.terminalFacturas, function(dataTarifas){
			$scope.tarifasTerminal = dataTarifas;

			priceFactory.getMatchPrices($scope.terminalFacturas, null, function(data){
				$scope.chartData = [
					['Tipo de comprobante', 'Total']
				];

				$scope.matchPrices = data.data;
				$scope.codigosTerminal = [];

				$scope.matchPrices.forEach(function(match){
					if (match.matches != null && match.matches.length > 0){
						match.matches[0].match.forEach(function(codigo){
							$scope.codigosTerminal.push(codigo);
						});
					}
				});

				invoiceFactory.getByDate($scope.desde, $scope.hasta, $scope.terminalFacturas, $scope.tipoComprobante, function(dataComprob) {

					$scope.result = dataComprob;

					$scope.pantalla = {
						"tituloCorrelativo":  "Éxito",
						"mensajeCorrelativo": "No se hallaron facturas faltantes",
						"cartelCorrelativo": "panel-success",
						"resultadoCorrelativo": [],
						"tituloCodigos": "Éxito",
						"mensajeCodigos": "No se hallaron códigos sin asociar",
						"cartelCodigos": "panel-success",
						"resultadoCodigos": [],
						"tituloTarifas": "Éxito",
						"mensajeTarifas": "No se hallaron tarifas mal cobradas",
						"cartelTarifas": "panel-success",
						"resultadoTarifas": [],
						"totalFacturas": $scope.result.data.length,
						"totalFaltantes": 0,
						"active": 0,
						"mostrarResultado": 0,
						"mostrarResultadoTarifas": 0,
						"comprobantesRotos":[],
						"comprobantesMalCobrados": []
					};

					var contador = 0;
					$scope.control = 0;

					//Por ahora se esta realizando el chequeo contra el mock, el algoritmo está hecho suponiendo que
					//el rango de facturas por fecha viene ordenado, tampoco hay nada que me permita comprobar que el primer
					//comprobante sea el correcto...
					$scope.result.data.forEach(function(comprob){
						comprob.codigosFaltantes = [];
						comprob.tarifasMalCobradas = [];
						contador+=1;
						if ($scope.control == 0) {
							$scope.control = comprob.nroComprob;
						} else {
							$scope.control += 1;
							if ($scope.control != comprob.nroComprob){
								$scope.pantalla.resultadoCorrelativo.push($scope.control);
								$scope.control = comprob.nroComprob;
								$scope.pantalla.mensajeCorrelativo = "Se hallaron facturas faltantes: ";
								$scope.pantalla.cartelCorrelativo = "panel-danger";
								$scope.pantalla.tituloCorrelativo = "Error";
								$scope.pantalla.totalFaltantes += 1;
							}
						}

						var flagError = false;
						var flagErrorTarifas = false;
						var tarifa;
						/*Aca control de codigos y de tarifas*/
						comprob.detalle.forEach(function(detalle){
							detalle.items.forEach(function(item){
								if (!in_array(item.id, $scope.codigosTerminal)){
									if (!in_array(item.id, comprob.codigosFaltantes)){
										comprob.codigosFaltantes.push(item.id);
									}
									$scope.pantalla.mensajeCodigos = "Se hallaron códigos sin asociar: ";
									$scope.pantalla.cartelCodigos = "panel-danger";
									$scope.pantalla.tituloCodigos = "Error";
									$scope.pantalla.mostrarResultado = 1;
									flagError = true;
								}

								if (angular.isDefined($scope.tarifasTerminal[item.id])){
									tarifa = $scope.tarifasTerminal[item.id] * item.cnt;

									if (tarifa < item.impTot){
										$scope.pantalla.mensajeTarifas = "Se hallaron tarifas mal cobradas";
										$scope.pantalla.cartelTarifas = "panel-danger";
										$scope.pantalla.tituloTarifas = "Error";
										$scope.pantalla.mostrarResultadoTarifas = 1;
										comprob.tarifasMalCobradas.push("Codigo: " + item.id + " (Esperado: " + tarifa + " - Cobrado: " + item.impTot + ")");
										flagErrorTarifas = true;
									}
								}
							})
						});

						if (flagError){
							$scope.pantalla.comprobantesRotos.push(comprob);
						}

						if (flagErrorTarifas){
							$scope.pantalla.comprobantesMalCobrados.push(comprob);
						}

					});
				});
				$scope.terminoCarga = true;
			});

			$scope.tasaCargas = {
				"titulo":"Éxito",
				"cartel": "panel-success",
				"mensaje": "No se hallaron facturas sin tasa a las cargas.",
				"resultado": [],
				"mostrarResultado": 0
			};

			/*Acá control de tasa a las cargas*/
			invoiceFactory.getSinTasaCargas($scope.desde, $scope.hasta, $scope.terminalFacturas, $scope.page, function(data){
				if (data.status == "ERROR"){
					$scope.tasaCargas.titulo = "Error";
					$scope.tasaCargas.cartel = "panel-danger";
					$scope.tasaCargas.mensaje = "La terminal seleccionada no tiene códigos asociados.";
					$scope.tasaCargas.mostrarResultado = 0;
				} else {
					$scope.tasaCargas.resultado = data.data;
					console.log($scope.tasaCargas.resultado);
					if ($scope.tasaCargas.resultado.length > 0){
						$scope.totalItemsTasaCargas = data.totalCount;
						$scope.tasaCargas.titulo = "Error";
						$scope.tasaCargas.cartel = "panel-danger";
						$scope.tasaCargas.mensaje = "Se hallaron facturas sin tasa a las cargas.";
						$scope.tasaCargas.mostrarResultado = 1;
					}
				}
			})
		});
	};

	$scope.cargar();

	$scope.mostrarDetalle = function(unaFactura){
		$scope.verDetalle = unaFactura;
	};

	$scope.$watch('currentPageTasaCargas', function(){
		if ($scope.flagWatch){
			$scope.page.skip = (($scope.currentPageTasaCargas - 1) * $scope.itemsPerPage);
			invoiceFactory.getSinTasaCargas($scope.desde, $scope.hasta, $scope.terminalFacturas, $scope.page, function(data){
				if (data.status == "ERROR"){
					$scope.tasaCargas.titulo = "Error";
					$scope.tasaCargas.cartel = "panel-danger";
					$scope.tasaCargas.mensaje = "La terminal seleccionada no tiene códigos asociados.";
					$scope.tasaCargas.mostrarResultado = 0;
				} else {
					$scope.tasaCargas.resultado = data.data;
					console.log($scope.tasaCargas.resultado);
					if ($scope.tasaCargas.resultado.length > 0){
						$scope.totalItemsTasaCargas = data.totalCount;
						$scope.tasaCargas.titulo = "Error";
						$scope.tasaCargas.cartel = "panel-danger";
						$scope.tasaCargas.mensaje = "Se hallaron facturas sin tasa a las cargas.";
						$scope.tasaCargas.mostrarResultado = 1;
					}
				}
			});
		} else {
			$scope.flagWatch = true;
		}
	});

}