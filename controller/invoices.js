/**
 * Created by Diego Reyes on 2/3/14.
*/

function invoicesCtrl($scope, invoiceFactory, loginService) {
	'use strict';
	// Fecha (dia y hora)
	$scope.fechaDesde = new Date();

	$scope.model = {
		'codTipoComprob': $scope.codTipoComprob,
		'nroComprobante': $scope.nroComprobante,
		'razonSocial': $scope.razonSocial,
		'documentoCliente': $scope.documentoCliente,
		'fechaDesde': $scope.fechaDesde,
		'contenedor': $scope.contenedor
	};

	$scope.comprobantesVistos = [];

	$scope.nombre = loginService.getFiltro();

	$scope.filtrar = {
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
		contenedor : function(filtro){
			$scope.model.contenedor = filtro;
			$scope.cargaFacturas();
		},
		cargar: function(){
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
		console.log(cargaDatos());
		page = page || { skip:0, limit: $scope.itemsPerPage };
		if (page.skip == 0){ $scope.currentPage = 1}
		invoiceFactory.getInvoice(cargaDatos(), page, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
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
			'codTipoComprob': $scope.model.codTipoComprob,
			'nroComprobante': $scope.model.nroComprobante,
			'razonSocial': $scope.model.razonSocial,
			'documentoCliente': $scope.model.documentoCliente,
			'fecha': $scope.model.fechaDesde,
			'contenedor': $scope.model.contenedor
		};
	};

	$scope.cargaFacturas();

}