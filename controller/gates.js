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
		'codigo': $scope.codigo
	};

	$scope.filtrar = {
		codigo : function(filtro){
			$scope.model.codigo = filtro;
			$scope.cargaFacturas();
		},
		codComprobante : function(filtro){
			$scope.model.codTipoComprob = filtro;
			$scope.cargaFacturas();
		},
		nroComprobante : function(filtro){
			$scope.model.nroComprobante = filtro;
			$scope.cargaFacturas();
		},
		razonSocial : function(filtro){
			$scope.model.razonSocial = $scope.filtrarCaracteresInvalidos(filtro);
			$scope.cargaFacturas();
		},
		documentoCliente : function(filtro){
			$scope.model.documentoCliente = filtro;
			$scope.cargaFacturas();
		},
		fechaDesde : function(filtro){
			$scope.model.fechaDesde = filtro;
			$scope.cargaFacturas();
		},
		fechaHasta : function(filtro){
			$scope.model.fechaHasta = filtro;
			$scope.cargaFacturas();
		},
		contenedor : function(filtro){
			$scope.model.contenedor = filtro;
			$scope.cargaFacturas();
		},
		cargar: function(){
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

	$scope.cargaGatesPorFiltros = function(){
		$scope.isCollapsed = !$scope.isCollapsed;
		$scope.currentPage = 1;
		$scope.cargaGates();
	};

	$scope.cargaFacturasPorContenedor = function(container){
		var datos = { 'contenedor': container };
		$scope.model.contenedor = container;
		invoiceFactory.getInvoice(datos, { skip:0, limit: $scope.itemsPerPage }, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
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
			'codigo': $scope.model.codigo
		};
	}

	// Carga los gates del día hasta la hora del usuario
	$scope.cargaGates();
}