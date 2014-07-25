/**
 * Created by kolesnikov-a on 21/02/14.
 */

function cfacturasCtrl($scope, invoiceFactory, priceFactory, vouchersFactory, loginService){
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

	$scope.currentPageCodigos = 1;
	$scope.totalItemsCodigos = 0;
	$scope.pageCodigos = {
		skip: 0,
		limit: $scope.itemsPerPage
	};

	$scope.hayFiltros = false;
	$scope.currentPageFiltros = 1;
	$scope.totalItemsFiltros = 0;
	$scope.pageFiltros = {
		skip:0,
		limit: $scope.itemsPerPage
	};
	$scope.codigoFiltrado = '';

	$scope.cargar = function(){
		//Traigo todos los códigos de la terminal y me los guardo

		invoiceFactory.getTarifasTerminal(loginService.getFiltro(), function(dataTarifas){
			$scope.tarifasTerminal = dataTarifas;

			priceFactory.getMatchPrices(loginService.getFiltro(), null, function(data){
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

				invoiceFactory.getByDate($scope.desde, $scope.hasta, loginService.getFiltro(), $scope.tipoComprobante, function(dataComprob) {

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

					var flagErrorTarifas = false;
					var tarifa;

					priceFactory.noMatches(function(dataNoMatches){

						$scope.pantalla.resultadoCodigos = dataNoMatches.data;
						if ($scope.pantalla.resultadoCodigos.length > 0){
							$scope.pantalla.mensajeCodigos = "Se hallaron códigos sin asociar: ";
							$scope.pantalla.cartelCodigos = "panel-danger";
							$scope.pantalla.tituloCodigos = "Error";
							$scope.pantalla.mostrarResultado = 1;

							invoiceFactory.getInvoicesNoMatches($scope.pageCodigos, function(invoicesNoMatches){
								invoicesNoMatches.data.forEach(function(unComprobante){
									unComprobante._id.fecha = {
										emision: unComprobante._id.fecha
									};
									unComprobante._id.importe = {
										total: unComprobante._id.impTot
									};
									$scope.pantalla.comprobantesRotos.push(unComprobante._id);
								});
								//$scope.totalItemsCodigos = invoicesNoMatches.totalCount;
							});
						}
					});

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

						/*Aca control de tarifas*/
						comprob.detalle.forEach(function(detalle){
							detalle.items.forEach(function(item){

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
			invoiceFactory.getSinTasaCargas($scope.desde, $scope.hasta, loginService.getFiltro(), $scope.page, function(data){
				if (data.status == "ERROR"){
					$scope.tasaCargas.titulo = "Error";
					$scope.tasaCargas.cartel = "panel-danger";
					$scope.tasaCargas.mensaje = "La terminal seleccionada no tiene códigos asociados.";
					$scope.tasaCargas.mostrarResultado = 0;
				} else {
					$scope.tasaCargas.resultado = data.data;
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
		invoiceFactory.invoiceById(unaFactura._id, function(comprobante){
			$scope.verDetalle = comprobante;
		});
	};

	$scope.$watch('currentPageTasaCargas', function(){
		if ($scope.flagWatch){
			$scope.page.skip = (($scope.currentPageTasaCargas - 1) * $scope.itemsPerPage);
			invoiceFactory.getSinTasaCargas($scope.desde, $scope.hasta, loginService.getFiltro(), $scope.page, function(data){
				if (data.status == "ERROR"){
					$scope.tasaCargas.titulo = "Error";
					$scope.tasaCargas.cartel = "panel-danger";
					$scope.tasaCargas.mensaje = "La terminal seleccionada no tiene códigos asociados.";
					$scope.tasaCargas.mostrarResultado = 0;
				} else {
					$scope.tasaCargas.resultado = data.data;
					if ($scope.tasaCargas.resultado.length > 0) {
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

	$scope.pageChangedCodigos = function(){
		$scope.pageCodigos.skip = (($scope.currentPageCodigos - 1) * $scope.itemsPerPage);
		invoiceFactory.getInvoicesNoMatches($scope.pageCodigos, function(data){
			data.data.forEach(function(unComprobante){
				unComprobante._id.fecha = {
					emision: unComprobante._id.fecha
				};
				unComprobante._id.importe = {
					total: unComprobante._id.impTot
				};
				$scope.pantalla.comprobantesRotos.push(unComprobante._id);
			});
		});
	};

	$scope.filtrarCodigo = function(codigo){
		$scope.codigoFiltrado = codigo;
		$scope.hayFiltros = true;
		invoiceFactory.getByCode($scope.pageFiltros, codigo, function(data){
			$scope.totalItemsFiltros = data.totalCount;
			$scope.pantalla.comprobantesRotos = data.data;
		});
	};

	$scope.pageChangedFiltros = function(){
		$scope.pageFiltros.skip = (($scope.currentPageFiltros - 1) * $scope.itemsPerPage);
		$scope.filtrarCodigo($scope.codigoFiltrado);
	};

	$scope.quitarFiltro = function () {
		$scope.codigoFiltrado = '';
		$scope.pantalla.comprobantesRotos = [];
		invoiceFactory.getInvoicesNoMatches($scope.pageCodigos, function(data){
			data.data.forEach(function(unComprobante){
				unComprobante._id.fecha = {
					emision: unComprobante._id.fecha
				};
				unComprobante._id.importe = {
					total: unComprobante._id.impTot
				};
				$scope.pantalla.comprobantesRotos.push(unComprobante._id);
			});
			$scope.hayFiltros = false;
		});
	}

}