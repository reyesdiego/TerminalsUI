/**
 * Created by kolesnikov-a on 21/02/14.
 */

function cfacturasCtrl($scope, invoiceFactory, priceFactory, vouchersFactory, loginService){
	'use strict';
	// Fecha (dia y hora)
	$scope.hasta = new Date();
	$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());

	$scope.ocultarFiltros = ['nroComprobante', 'codComprobante', 'documentoCliente', 'codigo', 'fechaDesde', 'fechaHasta'];

	$scope.model = {
		'codTipoComprob': '',
		'nroComprobante': '',
		'razonSocial': '',
		'documentoCliente': '',
		'fechaDesde': $scope.desde,
		'fechaHasta': $scope.hasta,
		'contenedor': '',
		'codigo': ''
	};

	vouchersFactory.getVouchersType(function(data){
		$scope.comprobantesTipos = data.data;
	});

	$scope.controlFiltros = 'tasas';

	$scope.terminoCarga = false;
	$scope.dateOptions = {
		'startingDay': 0,
		'showWeeks': false
	};
	$scope.format = 'yyyy-MM-dd';
	$scope.verDetalle = "";
	$scope.tipoComprobante = "0";
	$scope.flagWatch = false;

	$scope.currentPageTasaCargas = 1;
	$scope.totalItemsTasaCargas = 0;

	$scope.currentPageCodigos = 1;
	$scope.totalItemsCodigos = 0;
	$scope.pageCodigos = {
		skip: 0,
		limit: $scope.itemsPerPage
	};

	$scope.currentPageFiltros = 1;
	$scope.totalItemsFiltros = 0;
	$scope.pageFiltros = {
		skip:0,
		limit: $scope.itemsPerPage
	};

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
		"totalFacturas": 0,
		"totalFaltantes": 0,
		"active": 0,
		"mostrarResultado": 0,
		"mostrarResultadoTarifas": 0,
		"comprobantesRotos":[],
		"comprobantesMalCobrados": []
	};

	$scope.tasaCargas = {
		"titulo":"Éxito",
		"cartel": "panel-success",
		"mensaje": "No se hallaron facturas sin tasa a las cargas.",
		"resultado": [],
		"mostrarResultado": 0
	};

	$scope.loadingControlCodigos = true;
	$scope.cargandoPaginaComprobantes = true;
	$scope.anteriorCargaCodigos = [];

	$scope.loadingTasaCargas = true;

	$scope.filtrar = {
		codigo : function(filtro){
			if (angular.isDefined(filtro) && filtro != ''){
				if ($scope.controlFiltros == 'codigos'){
					$scope.anteriorCargaCodigos = $scope.pantalla.comprobantesRotos.slice();
				}
				$scope.controlFiltros = 'codigosFiltrados';
				$scope.ocultarFiltros = [];
				$scope.model.codigo = filtro;
				$scope.filtrar.cargar();
			} else{
				$scope.model.codigo = '';
				$scope.controlFiltros = 'codigos';
				$scope.pantalla.comprobantesRotos = $scope.anteriorCargaCodigos;
				$scope.ocultarFiltros = ['nroComprobante', 'codComprobante', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial'];
				$scope.model = {
					'codTipoComprob': '',
					'nroComprobante': '',
					'razonSocial': '',
					'documentoCliente': '',
					'fechaDesde': $scope.model.fechaDesde,
					'fechaHasta': $scope.model.fechaHasta,
					'contenedor': ''
				};
			}
		},
		codComprobante : function(filtro){
			$scope.model.codTipoComprob = filtro;
			$scope.filtrar.cargar();
		},
		nroComprobante : function(filtro){
			$scope.model.nroComprobante = filtro;
			$scope.filtrar.cargar();
		},
		razonSocial : function(filtro){
			$scope.model.razonSocial = $scope.filtrarCaracteresInvalidos(filtro);
			$scope.filtrar.cargar();
		},
		documentoCliente : function(filtro){
			$scope.model.documentoCliente = filtro;
			$scope.filtrar.cargar();
		},
		fechaDesde : function(filtro){
			$scope.model.fechaDesde = filtro;
			$scope.filtrar.cargar();
		},
		fechaHasta : function(filtro){
			$scope.model.fechaHasta = filtro;
			$scope.filtrar.cargar();
		},
		contenedor : function(filtro){
			$scope.model.contenedor = filtro;
			$scope.filtrar.cargar();
		},
		cargar : function(){
			switch ($scope.controlFiltros){
				case 'codigos':
					$scope.controlDeCodigos();
					break;
				case 'codigosFiltrados':
					invoiceFactory.getInvoice(cargaDatos(), $scope.pageFiltros, function(data){
						$scope.totalItemsFiltros = data.totalCount;
						$scope.pantalla.comprobantesRotos = data.data;
					});
					break;
				case 'tasas':
					$scope.controlTasaCargas();
					break;
			};
		}
	};

	$scope.hitEnter = function(evt){
		if(angular.equals(evt.keyCode,13)){
			$scope.filtrar.cargar();
		}
	};

	$scope.filtrarCaracteresInvalidos = function(palabra){
		if (angular.isDefined(palabra) && palabra.length > 0){
			var palabraFiltrada;
			var caracteresInvalidos = ['*', '(', ')', '+', ':', '?'];
			palabraFiltrada = palabra;
			for (var i = 0; i <= caracteresInvalidos.length - 1; i++){
				if (palabraFiltrada.indexOf(caracteresInvalidos[i], 0) > 0){
					palabraFiltrada = palabraFiltrada.substring(0, palabraFiltrada.indexOf(caracteresInvalidos[i], 0));
				}
			}
			return palabraFiltrada.toUpperCase();
		} else {
			return palabra;
		}
	};

	$scope.controlDeCodigos = function(){
		$scope.controlFiltros = 'codigos';
		$scope.loadingControlCodigos = true;
		$scope.hayFiltros = false;
		$scope.model.codigo = '';
		$scope.pantalla.comprobantesRotos = [];
		priceFactory.noMatches($scope.model.fechaDesde, $scope.model.fechaHasta, function(dataNoMatches){
			$scope.pantalla.resultadoCodigos = dataNoMatches.data;
			if ($scope.pantalla.resultadoCodigos.length > 0){
				$scope.pantalla.mensajeCodigos = "Se hallaron códigos sin asociar: ";
				$scope.pantalla.cartelCodigos = "panel-danger";
				$scope.pantalla.tituloCodigos = "Error";
				$scope.pantalla.mostrarResultado = 1;
				$scope.cargandoPaginaComprobantes = true;

				invoiceFactory.getInvoicesNoMatches(cargaDatos(), $scope.pageCodigos, function(invoicesNoMatches){
					if (invoicesNoMatches.data != null){
						invoicesNoMatches.data.forEach(function(unComprobante){
							unComprobante._id.fecha = {
								emision: unComprobante._id.fecha
							};
							unComprobante._id.importe = {
								total: unComprobante._id.impTot
							};
							$scope.pantalla.comprobantesRotos.push(unComprobante._id);
						});
						$scope.totalItemsCodigos = invoicesNoMatches.totalCount;
					}
					$scope.cargandoPaginaComprobantes = false;
					$scope.loadingControlCodigos = false;
				});
			} else {
				$scope.pantalla.mensajeCodigos = "No se hallaron códigos sin asociar";
				$scope.pantalla.cartelCodigos = "panel-success";
				$scope.pantalla.tituloCodigos = "Éxito";
				$scope.pantalla.mostrarResultado = 0;
				$scope.totalItemsCodigos = 0;
				$scope.loadingControlCodigos = false;
				$scope.cargandoPaginaComprobantes = false;
			}
		});
	};

	$scope.controlTasaCargas = function(){
		/*Acá control de tasa a las cargas*/
		$scope.loadingTasaCargas = true;
		invoiceFactory.getSinTasaCargas(cargaDatos(), $scope.desde, $scope.hasta, loginService.getFiltro(), $scope.page, function(data){
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
			$scope.loadingTasaCargas = false;
		});
	};

	$scope.cargar = function(){
		//Traigo todos los códigos de la terminal y me los guardo

		invoiceFactory.getTarifasTerminal(loginService.getFiltro(), function(dataTarifas){
			$scope.tarifasTerminal = dataTarifas;

				invoiceFactory.getByDate($scope.desde, $scope.hasta, loginService.getFiltro(), $scope.tipoComprobante, function(dataComprob) {
					$scope.result = dataComprob;
					$scope.totalFacturas= $scope.result.data.length;

					var contador = 0;
					$scope.control = 0;

					var flagErrorTarifas = false;
					var tarifa;

					//Por ahora se esta realizando el chequeo contra el mock, el algoritmo está hecho suponiendo que
					//el rango de facturas por fecha viene ordenado, tampoco hay nada que me permita comprobar que el primer
					//comprobante sea el correcto...
					$scope.result.data.forEach(function(comprob){
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
	};

	$scope.controlDeCodigos();
	$scope.controlTasaCargas();
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
		$scope.cargandoPaginaComprobantes = true;
		$scope.pantalla.comprobantesRotos = [];
		$scope.pageCodigos.skip = (($scope.currentPageCodigos - 1) * $scope.itemsPerPage);
		invoiceFactory.getInvoicesNoMatches(cargaDatos(), $scope.pageCodigos, function(data){
			data.data.forEach(function(unComprobante){
				unComprobante._id.fecha = {
					emision: unComprobante._id.fecha
				};
				unComprobante._id.importe = {
					total: unComprobante._id.impTot
				};
				$scope.pantalla.comprobantesRotos.push(unComprobante._id);
			});
			$scope.cargandoPaginaComprobantes = false;
		});
	};

	$scope.pageChangedFiltros = function(){
		$scope.pageFiltros.skip = (($scope.currentPageFiltros - 1) * $scope.itemsPerPage);
		invoiceFactory.getInvoice(cargaDatos(), $scope.pageFiltros, function(data){
			$scope.pantalla.comprobantesRotos = data.data;
		});
	};

	$scope.cambioTab = function(unTab){
		$scope.controlFiltros = unTab;
		switch ($scope.controlFiltros){
			case 'codigos':
				$scope.ocultarFiltros = ['nroComprobante', 'codComprobante', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial'];
				break;
			case 'tasas':
				$scope.ocultarFiltros = ['nroComprobante', 'codComprobante', 'documentoCliente', 'codigo', 'fechaDesde', 'fechaHasta'];
				break;
		}
		$scope.model = {
			'codTipoComprob': '',
			'nroComprobante': '',
			'razonSocial': '',
			'documentoCliente': '',
			'fechaDesde': $scope.desde,
			'fechaHasta': $scope.hasta,
			'contenedor': ''
		};
	};

	function cargaDatos(){
		return {
			'codigo': $scope.model.codigo,
			'codTipoComprob': $scope.model.codTipoComprob,
			'nroComprobante': $scope.model.nroComprobante,
			'razonSocial': $scope.model.razonSocial,
			'documentoCliente': $scope.model.documentoCliente,
			'fechaDesde': $scope.model.fechaDesde,
			'fechaHasta': $scope.model.fechaHasta,
			'contenedor': $scope.model.contenedor
		};
	};

}