/**
 * Created by Diego Reyes on 2/3/14.
*/

function invoicesCtrl($scope, invoiceFactory, loginService) {
	'use strict';
	// Fecha (dia y hora)
	$scope.fechaDesde = new Date();
	$scope.fechaHasta = new Date();
	$scope.fechaHasta.setDate($scope.fechaHasta.getDate() + 1);
	$scope.maxDateD = new Date();
	$scope.maxDateH = new Date();
	$scope.maxDateH.setDate($scope.maxDateH.getDate() + 1);

	$scope.model = {
		'nroPtoVenta': $scope.nroPtoVenta,
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

	$scope.invoiceEstado = {
		'estado': 'Revisar',
		'btnEstado': 'btn-warning'
	};

	$scope.comprobantesVistos = [];

	$scope.nombre = loginService.getFiltro();

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
		$scope.filtrar.cargar();
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
		cargar: function(){
			if ($scope.model.fechaDesde > $scope.model.fechaHasta && $scope.model.fechaHasta != ''){
				$scope.model.fechaHasta = new Date($scope.model.fechaDesde);
				$scope.model.fechaHasta.setDate($scope.model.fechaHasta.getDate() + 1);
			}
			$scope.cargaFacturas();
		}
	};

	$scope.hitEnter = function(evt){
		if(angular.equals(evt.keyCode,13))
			$scope.cargaFacturas();
	};

	$scope.pageChanged = function(){
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.cargaFacturas($scope.page);
	};

	$scope.cargaFacturas = function(page){
		page = page || { skip:0, limit: $scope.itemsPerPage };
		if (page.skip == 0){ $scope.currentPage = 1}
		invoiceFactory.getInvoice(cargaDatos(), page, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
				$scope.invoices.forEach(function(comprobante){
					comprobante.estado = $scope.invoiceEstado;
				});
				$scope.totalItems = data.totalCount;
			}
		});
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

	function cargaDatos(){
		return {
			'nroPtoVenta': $scope.model.nroPtoVenta,
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

	$scope.cargaFacturas();

	$scope.revisarComprobante = function(comprobante){
		comprobante.estado = {
			'estado': 'Revisar',
			'btnEstado': 'btn-warning'
		};
	};

	$scope.comprobanteOk = function(comprobante){
		comprobante.estado = {
			'estado': 'Ok',
			'btnEstado': 'btn-success'
		};
	};

	$scope.comprobanteError = function(comprobante){
		comprobante.estado = {
			'estado': 'Error',
			'btnEstado': 'btn-danger'
		};
	};

}