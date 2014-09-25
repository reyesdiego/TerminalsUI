/**
 * Created by artiom on 24/09/14.
 */

function comprobantesErrorCtrl($scope, invoiceFactory){

	$scope.ocultarFiltros = ['nroPtoVenta', 'estado'];

	// Fecha (dia y hora)
	$scope.hasta = new Date();
	$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());

	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': 0,
		'nroComprobante': '',
		'razonSocial': '',
		'documentoCliente': '',
		'fechaDesde': $scope.desde,
		'fechaHasta': $scope.hasta,
		'contenedor': '',
		'estado': 'R',
		'codigo': '',
		'order': '',
		'buque': ''
	};

	// Puntos de Ventas
	$scope.puntosDeVentas = [];
	$scope.todosLosPuntosDeVentas = [];

	$scope.comprobantesError = [];
	$scope.comprobantesVistosError = [];

	$scope.loadingError = false;

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
		$scope.pageChanged();
	});

	$scope.filtrar = function(filtro, contenido){
		switch (filtro) {
			case 'nroPtoVenta':
				$scope.model.nroPtoVenta = contenido;
				break;
			case 'codigo':
				$scope.model.codigo = contenido;
				break;
		}
		$scope.cargaPuntosDeVenta();
	};

	$scope.traerComprobantes = function(){
		$scope.loadingError = true;
		invoiceFactory.getInvoice(cargaDatos(), $scope.page, function(invoiceRevisar){
			$scope.comprobantesError = invoiceRevisar.data;
			$scope.totalItems = invoiceRevisar.totalCount;
			$scope.loadingError = false;
		})
	};

	$scope.mostrarDetalle = function(comprobante){
		var encontrado = false;

		$scope.comprobantesVistosRevisar.forEach(function(unComprobante){
			if (unComprobante._id == comprobante._id){
				encontrado = true;
			}
		});
		if (!encontrado){
			$scope.comprobantesVistosRevisar.push(comprobante);
		}

		invoiceFactory.invoiceById(comprobante._id, function(miComprobante){
			$scope.verDetalle = miComprobante;
			$scope.$emit('recargarDetalle', $scope.verDetalle);
		});
	};

	$scope.pageChanged = function(){
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.traerComprobantes();
	};

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
			$scope.traerComprobantes();
		});
	};

	$scope.cargaTodosLosPuntosDeVentas = function(){
		$scope.todosLosPuntosDeVentas = [];
		invoiceFactory.getCashbox('', function(data){
			var dato = {'heading': 'Todos los Puntos de Ventas', 'punto': '', 'active': true, 'hide': false};
			$scope.todosLosPuntosDeVentas.push(dato);
			data.data.forEach(function(punto){
				dato = {'heading': punto, 'punto': punto, 'active': false, 'hide': true};
				$scope.todosLosPuntosDeVentas.push(dato);
			});
			$scope.cargaPuntosDeVenta();
		})
	};

	function cargaDatos(){
		return {
			'nroPtoVenta':		$scope.model.nroPtoVenta,
			'codTipoComprob':	$scope.model.codTipoComprob,
			'nroComprobante':	$scope.model.nroComprobante,
			'razonSocial':		$scope.model.razonSocial,
			'documentoCliente':	$scope.model.documentoCliente,
			'estado':			'R',
			'fechaDesde':		$scope.model.fechaDesde,
			'fechaHasta':		$scope.model.fechaHasta,
			'contenedor':		$scope.model.contenedor,
			'buque':			$scope.model.buque,
			'codigo':			$scope.model.codigo,
			'order':			$scope.model.order
		};
	}

	function cargaDatosSinPtoVenta(){
		var datos = cargaDatos();
		datos.nroPtoVenta = '';
		return datos;
	}

	$scope.cargaTodosLosPuntosDeVentas();

}