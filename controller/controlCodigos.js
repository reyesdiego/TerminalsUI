/**
 * Created by artiom on 23/09/14.
 */

function codigosCtrl($scope, invoiceFactory, priceFactory){

	$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codComprobante', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque'];

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
		'estado': 'N',
		'codigo': '',
		'order': '',
		'buque': ''
	};

	// Puntos de Ventas
	$scope.puntosDeVentas = [];
	$scope.todosLosPuntosDeVentas = [];

	$scope.controlFiltros = 'codigos';
	$scope.hayFiltros = false;

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
		"tituloCodigos": "Éxito",
		"mensajeCodigos": "No se hallaron códigos sin asociar",
		"cartelCodigos": "panel-success",
		"resultadoCodigos": [],
		"comprobantesRotos":[],
		"mostrarResultado": 0
	};

	$scope.loadingControlCodigos = false;
	$scope.cargandoPaginaComprobantes = false;
	$scope.anteriorCargaCodigos = [];

	$scope.comprobantesVistosCodigos = [];

	$scope.$on('cambioPagina', function(event, data){
		if ($scope.controlFiltros == 'codigos'){
			$scope.currentPageCodigos = data;
			$scope.pageChangedCodigos();
		} else {
			$scope.currentPageFiltros = data;
			$scope.pageChangedFiltros();
		}
	});

	$scope.filtrar = function (filtro, contenido){
		console.log('hola que tal');
		var recargar = true;
		switch (filtro){
			case 'codigo':
				switch ($scope.controlFiltros){
					case 'codigos':
						$scope.anteriorCargaCodigos = $scope.pantalla.comprobantesRotos.slice();
						$scope.controlFiltros = 'codigosFiltrados';
						$scope.ocultarFiltros = [];
						$scope.model.codigo = contenido;
						$scope.hayFiltros = true;
						recargar = false;
						$scope.cargaTodosLosPuntosDeVentas();
						break;
					case 'codigosFiltrados':
						if (angular.isDefined(contenido) && contenido != ''){
							$scope.model.codigo = contenido;
						} else {
							$scope.hayFiltros = false;
							$scope.model.codigo = '';
							$scope.controlFiltros = 'codigos';
							$scope.pantalla.comprobantesRotos = $scope.anteriorCargaCodigos;
							$scope.ocultarFiltros = ['nroComprobante', 'nroPtoVenta', 'codComprobante', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque'];
							$scope.model = {
								'nroPtoVenta': '',
								'codTipoComprob': 0,
								'nroComprobante': '',
								'razonSocial': '',
								'documentoCliente': '',
								'fechaDesde': $scope.desde,
								'fechaHasta': $scope.hasta,
								'contenedor': '',
								'estado': 'N',
								'codigo': '',
								'order': ''
							};
							recargar = false;
						}
						break;
					default:
						$scope.model.codigo = contenido;
						break;
				}
				break;
			case 'nroPtoVenta':
				$scope.model.nroPtoVenta = contenido;
				break;
		}
		if (recargar){
			console.log('cargamos');
			$scope.filtrarCargar();
		}
	};

	$scope.filtrarCargar = function(){
		switch ($scope.controlFiltros){
			case 'codigos':
				$scope.controlDeCodigos();
				break;
			case 'codigosFiltrados':
				$scope.cargaPuntosDeVenta();
				break;
		}
	};

	$scope.mostrarDetalle = function(comprobante){
		var encontrado = false;

		$scope.comprobantesVistosCodigos.forEach(function(unComprobante){
			if (unComprobante._id == comprobante._id){
				encontrado = true;
			}
		});
		if (!encontrado){
			$scope.comprobantesVistosCodigos.push(comprobante);
		}

		invoiceFactory.invoiceById(comprobante._id, function(miComprobante){
			$scope.verDetalle = miComprobante;
			$scope.$emit('recargarDetalle', $scope.verDetalle);
		});
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
							invoiceFactory.invoiceById(unComprobante._id._id, function(realData){
								$scope.pantalla.comprobantesRotos.push(realData);
							});
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

	$scope.controlCodigosFiltrados = function(){
		invoiceFactory.getInvoice(cargaDatos(), $scope.pageFiltros, function(data){
			$scope.totalItemsFiltros = data.totalCount;
			$scope.pantalla.comprobantesRotos = data.data;
		});
	};

	$scope.pageChangedCodigos = function(){
		$scope.cargandoPaginaComprobantes = true;
		$scope.pantalla.comprobantesRotos = [];
		$scope.pageCodigos.skip = (($scope.currentPageCodigos - 1) * $scope.itemsPerPage);
		invoiceFactory.getInvoicesNoMatches(cargaDatos(), $scope.pageCodigos, function(data){
			data.data.forEach(function(unComprobante){
				invoiceFactory.invoiceById(unComprobante._id._id, function(realData){
					$scope.pantalla.comprobantesRotos.push(realData);
				});
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
			$scope.controlCodigosFiltrados();
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
			$scope.filtrarCargar();
		})
	};

	function cargaDatos(){
		return {
			'nroPtoVenta': $scope.model.nroPtoVenta,
			'codigo': $scope.model.codigo,
			'codTipoComprob': $scope.model.codTipoComprob,
			'nroComprobante': $scope.model.nroComprobante,
			'razonSocial': $scope.model.razonSocial,
			'documentoCliente': $scope.model.documentoCliente,
			'fechaDesde': $scope.model.fechaDesde,
			'fechaHasta': $scope.model.fechaHasta,
			'contenedor': $scope.model.contenedor,
			'order': $scope.model.order,
			'estado': $scope.model.estado,
			'buque': $scope.model.buque
		};
	}

	function cargaDatosSinPtoVenta(){
		var datos = cargaDatos();
		datos.nroPtoVenta = '';
		return datos;
	}

	$scope.filtrarCargar();

}
