/**
 * Created by Diego Reyes on 2/3/14.
*/

function invoicesCtrl($scope, $modal, invoiceFactory, loginService, $templateCache) {
	'use strict';
	$scope.items = ['item1', 'item2', 'item3'];

	// Fecha (dia y hora)
	$scope.fechaDesde = new Date();
	$scope.fechaHasta = new Date();
	$scope.fechaHasta.setDate($scope.fechaHasta.getDate() + 1);
	$scope.maxDateD = new Date();
	$scope.maxDateH = new Date();
	$scope.maxDateH.setDate($scope.maxDateH.getDate() + 1);

	// Puntos de Ventas
	$scope.puntosDeVentas = [];
	$scope.todosLosPuntosDeVentas = [];

	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': 0,
		'nroComprobante': '',
		'razonSocial': '',
		'documentoCliente': '',
		'fechaDesde': $scope.fechaDesde,
		'fechaHasta': $scope.fechaHasta,
		'contenedor': '',
		'estado': 'N',
		'codigo': '',
		'order': ''
	};

	$scope.invoiceEstado = {
		'estado': 'Y',
		'btnEstado': 'btn-warning'
	};

	$scope.comprobantesVistos = [];

	$scope.nombre = loginService.getFiltro();

	// Funciones de Puntos de Venta
	$scope.cargaPuntosDeVenta = function(){
		invoiceFactory.getCashbox(cargaDatosSinPtoVenta(), function(data){
			var hide;
			$scope.todosLosPuntosDeVentas.forEach(function(todosPtos){
				hide = true;
				data.data.forEach(function(punto){
					if (todosPtos.punto == punto){
						hide = false;
					}
				});
				todosPtos.hide = hide;
				if (todosPtos.punto == $scope.model.nroPtoVenta && todosPtos.hide){
					$scope.model.nroPtoVenta = '';
					$scope.todosLosPuntosDeVentas[0].active = true;
				}
			});
			$scope.todosLosPuntosDeVentas[0].hide = false;
			$scope.cargaFacturas();
		});
	};

	$scope.cargaTodosLosPuntosDeVentas = function(){
		invoiceFactory.getCashbox('', function(data){
			var dato = {'heading': 'Todos los Puntos de Ventas', 'punto': '', 'active': true, 'hide': false};
			$scope.todosLosPuntosDeVentas.push(dato);
			data.data.forEach(function(punto){
				dato = {'heading': punto, 'punto': punto, 'active': false, 'hide': true};
				$scope.todosLosPuntosDeVentas.push(dato);
			});
			$scope.cargaFacturas();
		})
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
		$scope.filtrarCargar();
	};

	$scope.filtrar = function (filtro, contenido){
		switch (filtro){
			case 'nroPtoVenta':
				$scope.model.nroPtoVenta = contenido;
				break;
			case 'codigo':
				$scope.model.codigo = contenido;
				break;
			case 'codComprobante':
				$scope.model.codTipoComprob = contenido;
				break;
			case 'nroComprobante':
				$scope.model.nroComprobante = contenido;
				break;
			case 'razonSocial':
				$scope.model.razonSocial = $scope.filtrarCaracteresInvalidos(contenido);
				break;
			case 'documentoCliente':
				$scope.model.documentoCliente = contenido;
				break;
			case 'estado':
				$scope.model.estado = contenido;
				break;
			case 'fechaDesde':
				$scope.model.fechaDesde = contenido;
				break;
			case 'fechaHasta':
				$scope.model.fechaHasta = contenido;
				break;
			case 'contenedor':
				$scope.model.contenedor = contenido;
				break;
		}
		$scope.filtrarCargar();
	};

	$scope.filtrarCargar = function(){
		if ($scope.model.fechaDesde > $scope.model.fechaHasta && $scope.model.fechaHasta != ''){
			$scope.model.fechaHasta = new Date($scope.model.fechaDesde);
			$scope.model.fechaHasta.setDate($scope.model.fechaHasta.getDate() + 1);
		}
		$scope.cargaPuntosDeVenta();
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
			'estado': $scope.model.estado,
			'fechaDesde': $scope.model.fechaDesde,
			'fechaHasta': $scope.model.fechaHasta,
			'contenedor': $scope.model.contenedor,
			'codigo': $scope.model.codigo,
			'order': $scope.model.order
		};
	}

	function cargaDatosSinPtoVenta(){
		var datos = cargaDatos();
		datos.nroPtoVenta = '';
		return datos;
	}

	$scope.cargaTodosLosPuntosDeVentas();

	$scope.trackInvoice = function(comprobante, estado){
		var estadoAnterior = comprobante.interfazEstado;
		switch (estado){
			case 'Y':
				comprobante.interfazEstado = {
					'estado': 'Revisar',
					'btnEstado': 'btn-warning'
				};
				break;
			case 'G':
				comprobante.interfazEstado = {
					'estado': 'Controlado',
					'btnEstado': 'btn-success'
				};
				break;
			case 'R':
				comprobante.interfazEstado = {
					'estado': 'Error',
					'btnEstado': 'btn-danger'
				};
				break;
		}
		if (estadoAnterior.estado == comprobante.interfazEstado.estado){
			comprobante.interfazEstado = estadoAnterior;
		} else {
			invoiceFactory.getTrackInvoice(comprobante._id, function(dataTrack){
				var modalInstance = $modal.open({
					templateUrl: 'view/trackingInvoice.html',
					controller: trackingInvoiceCtrl,
					backdrop: 'static',
					resolve: {
						estado: function () {
							return estado;
						},
						track: function() {
							return dataTrack;
						}
					}
				});
				dataTrack = [];
				modalInstance.result.then(function (dataComment) {
					invoiceFactory.cambiarEstado(comprobante._id, estado, function(data){
						var logInvoice = {
							title: dataComment.title,
							state: estado,
							comment: dataComment.comment,
							invoice: comprobante._id
						};
						invoiceFactory.commentInvoice(logInvoice, function(dataRes){
						});
					});
				}, function () {
					comprobante.interfazEstado = estadoAnterior;
				});
			});
		}
	};

}