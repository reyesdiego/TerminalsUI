/**
 * Created by leo on 31/03/14.
 */
function gatesCtrl($scope, gatesFactory, invoiceFactory){
	'use strict';

	// Fecha (dia y hora)
	$scope.fechaDesde = new Date();
	$scope.fechaHasta = new Date();
	$scope.fechaDesde.setHours(0,0);
	$scope.fechaHasta.setMinutes(0);
	$scope.maxDate = new Date();

	// Variable para almacenar la info principal que trae del factory
	$scope.gates = {};
	$scope.comprobantesVistos = [];

	$scope.model = {
		'codTipoComprob': $scope.codTipoComprob,
		'nroComprobante': $scope.nroComprobante,
		'razonSocial': $scope.razonSocial,
		'documentoCliente': $scope.documentoCliente,
		'fechaDesde': $scope.fechaDesde,
		'fechaHasta': $scope.fechaHasta,
		'contenedor': $scope.contenedor,
		'codigo': $scope.codigo,
		'order': ''
	};

	$scope.filtrarOrden = function(filtro){
		var filtroModo;
		$scope.filtroOrden = filtro;
		if ($scope.filtroOrden == $scope.filtroAnterior){
			$scope.filtroOrdenReverse = !$scope.filtroOrdenReverse;
		} else {
			$scope.filtroOrdenReverse = false;
		}
		if ($scope.filtroOrdenReverse){
			filtroModo = -1;
		} else {
			filtroModo = 1;
		}
		$scope.model.order = '"' + filtro + '":' + filtroModo;
		$scope.filtroAnterior = filtro;
		$scope.filtrar.cargarSinFechas();
	};

	$scope.filtrar = {
		nroPtoVenta : function(filtro){
			$scope.model.nroPtoVenta = filtro;
			$scope.filtrar.cargar();
		},
		codigo : function(filtro){
			$scope.model.codigo = filtro;
			$scope.filtrar.cargar();
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
		cargarSinFechas : function () {
			$scope.cargaFacturasSinFechas();
		},
		cargar: function(){
			if ($scope.model.fechaDesde > $scope.model.fechaHasta && $scope.model.fechaHasta != ''){
				$scope.model.fechaHasta = new Date($scope.model.fechaDesde);
				$scope.model.fechaHasta.setDate($scope.model.fechaHasta.getDate() + 1);
			}
			$scope.cargaFacturas();
		}
	};

	// Pone estilo al horario de acuerdo si esta o no a tiempo
	$scope.colorHorario = function(gate){
		var horarioGate = new Date(gate.gateTimestamp);
		var horarioInicio = new Date(gate.turnoInicio);
		var horarioFin = new Date(gate.turnoFin);
		if (horarioGate >= horarioInicio && horarioGate <= horarioFin) { return 'green' } else { return 'red' }
	};

	$scope.cargaPorFiltros = function(){
		$scope.status.open = !$scope.status.open;
		$scope.currentPage = 1;
		$scope.cargaGates();
	};

	$scope.cargaFacturasPorContenedor = function(container){
		var datos = { 'contenedor': container };
		$scope.container = container;
		invoiceFactory.getInvoice(datos, { skip:0, limit: $scope.itemsPerPage }, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
				$scope.paginationHide = true
			}
		});
	};

	$scope.cargaGates = function(page){
		page = page || { skip:0, limit: $scope.itemsPerPage };
		gatesFactory.getGate(cargaDatos(), page, function(data){
			if (data.status === "OK"){
				$scope.gates = data.data;
				$scope.totalItems = data.totalCount;
			}
		});
	};

	$scope.cargaFacturas = function(page){
		page = page || { skip:0, limit: $scope.itemsPerPage };
		if (page.skip == 0){ $scope.currentPage = 1}
		invoiceFactory.getInvoice(cargaDatos(), page, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
				$scope.totalItems = data.totalCount;
			}
		});
	};

	$scope.cargaFacturasSinFechas = function(page){
		page = page || { skip:0, limit: $scope.itemsPerPage };
		if (page.skip == 0){ $scope.currentPage = 1}
		invoiceFactory.getInvoice(cargaDatosSinFechas(), page, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
				$scope.totalItems = data.totalCount;
			}
		});
	};

	$scope.mostrarDetalle = function(comprobante){
		var encontrado = false;
		$scope.comprobantesVistos.forEach(function(unComprobante){
			if (unComprobante._id == comprobante._id){
				encontrado = true;
			}
		});
		if (!encontrado){
			$scope.comprobantesVistos.push(comprobante);
		}
		$scope.verDetalle = comprobante;
	};

	$scope.quitarVista = function(comprobante){
		var pos = $scope.comprobantesVistos.indexOf(comprobante);
		$scope.comprobantesVistos.splice(pos, 1);
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

	$scope.pageChanged = function(){
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.cargaGates($scope.page);
	};

	function cargaDatos(){
		return {
			'codTipoComprob': $scope.model.codTipoComprob,
			'nroComprobante': $scope.model.nroComprobante,
			'razonSocial': $scope.model.razonSocial,
			'documentoCliente': $scope.model.documentoCliente,
			'fechaDesde': $scope.model.fechaDesde,
			'fechaHasta': $scope.model.fechaHasta,
			'contenedor': $scope.model.contenedor,
			'codigo': $scope.model.codigo,
			'order': $scope.model.order
		};
	}

	function cargaDatosSinFechas(){
		var datos = cargaDatos();
		datos.fechaDesde = '';
		datos.fechaHasta = '';
		return datos;
	}

}