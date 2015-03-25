/**
 * Created by Diego Reyes on 1/29/14.
 */

myapp.controller('matchPricesCtrl', ['$rootScope', '$scope', 'priceFactory', '$timeout', 'dialogs', 'loginService', '$filter', 'generalCache', function($rootScope, $scope, priceFactory, $timeout, dialogs, loginService, $filter, generalCache) {
	'use strict';
	$scope.nombre = loginService.getFiltro();

	$scope.flagGuardado = true;
	$scope.flagCambios = false;

	$scope.nuevoConcepto = false;

	$scope.pricelist = [];
	$scope.filteredPrices = [];
	$scope.matchesTerminal = [];
	$scope.listaSeleccionada = [];

	$scope.codigoVacio = true;

	$scope.search = "";

	$scope.esRequerido = true;
	$scope.flagNuevoConcepto = true;
	$scope.unidad = "CONTAINER";
	$scope.moneda = "PES";

	$scope.acceso = loginService.getType();

	$scope.flagEditando = false;
	$scope.codigosConMatch = [];
	$scope.conMatch = false;
	$scope.tasas = false;

	$scope.preciosHistoricos = [];

	$scope.puedeEditar = (loginService.getType() == 'terminal');

	$scope.itemsPerPage = 10;

	$scope.newFrom = new Date();
	$scope.newCurrency = 'DOL';

	$scope.unidadesTarifas = generalCache.get('unitTypes');

	$scope.openFechaTarifa = false;
	$scope.openDate = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
	};

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
		$scope.pageChanged();
	});

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.hayError = true;
		$scope.mensajeResultado = mensaje;
		$scope.totalItems = 0;
		$scope.pricelist = [];
	});

	$scope.prepararDatos = function(){
		priceFactory.getMatchPrices({onlyRates: $scope.tasas}, function (data) {
			if (data.status == 'OK'){
				$scope.pricelist = data.data;
				$scope.codigosConMatch = [];
				//Cargo todos los códigos ya asociados de la terminal para control
				$scope.pricelist.forEach(function(price){
					$scope.matchesTerminal.push(price.code);
					if (price.matches != null && price.matches.length > 0){
						$scope.codigosConMatch.push(price);
						price.matches[0].match.forEach(function(codigo){
							$scope.matchesTerminal.push(codigo);
						})
					}
				});
				if ($scope.conMatch){
					$scope.listaSeleccionada = $scope.codigosConMatch;
				} else {
					$scope.listaSeleccionada = $scope.pricelist;
				}
				$scope.totalItems = $scope.pricelist.length;
			} else {
				dialogs.error('Asociar', 'Se ha producido un error al cargar los datos de códigos asociados. ' + data.data);
				$scope.pricelist = [];
				$scope.totalItems = 0;
			}
		});
	};

	if (loginService.getStatus()){
		$scope.prepararDatos();
	}

	$scope.pageChanged = function(){
		$scope.guardar();
		$scope.flagCambios = false;
	};

	$scope.$watch('conMatch', function(){
		if ($scope.conMatch){
			$scope.listaSeleccionada = $scope.codigosConMatch;
		} else {
			$scope.listaSeleccionada = $scope.pricelist;
		}
		if ($scope.search != ""){
			$scope.totalItems = 1
		} else {
			$scope.totalItems = $scope.listaSeleccionada.length;
		}
	});

	$scope.agregarCodigo = function(price){
		if (!$scope.matchesTerminal.contains(price.new)){
			if (!(angular.equals(price.new, undefined) || angular.equals(price.new,''))){
				if ((price.matches == null || price.matches.length === 0)){
					$scope.nuevoMatch = [{
						terminal: loginService.getInfo().terminal,
						match: [],
						_idPrice: price._id,
						code: price.code
					}];
					price.flagGuardar= true;
					price.claseFila= "success";
					$scope.nuevoMatch[0].match.push(price.new);
					price.matches = $scope.nuevoMatch;
				} else {
					price.matches[0]._idPrice= price._id;
					price.matches[0].match.push(price.new);
					price.flagGuardar = true;
					price.claseFila = "success";
				}
				$scope.matchesTerminal.push(price.new);
				$scope.flagCambios = true;
			}
		} else {
			dialogs.notify("Asociar","El código ingresado ya se encuentra asociado a otra tarifa");
		}
		price.new = '';
		price.disabled = true;
	};

	$scope.borrar = function(price, codigo){
		//Elimino el código del match
		var pos = price.matches[0].match.indexOf(codigo);
		price.matches[0].match.splice( pos, 1 );
		price.matches[0]._idPrice = price._id;
		price.new = codigo;
		price.disabled = false;

		//Elimino el código de la lista de todos los códigos asociados
		pos = $scope.matchesTerminal.indexOf(codigo);
		$scope.matchesTerminal.splice(pos, 1);

		price.claseFila = "warning";
		price.flagGuardar = true;
		$scope.flagCambios = true;
	};

	//El hitEnter para el cuadro donde ponen los códigos nuevos
	$scope.hitEnter = function(evt, price){
		if(angular.equals(evt.keyCode,13))
			$scope.agregarCodigo(price);
		price.disabled = !(angular.isDefined(price.new) && price.new != '');
	};

	$scope.abrirNuevoConcepto = function(tipo){
		$scope.nuevoConcepto = true;
		$scope.esRequerido = true;
		$scope.flagNuevoConcepto = true;
		if (tipo == 'editar'){
			$scope.flagEditando = true;
		}
	};

	$scope.guardar = function(){
		$scope.match = [];
		var prices = $scope.filteredPrices;
		//Guardo todos matches en un array nuevo, siempre y cuando hayan sufrido cambios
		prices.forEach(function(item){
			if (item.matches != null && item.matches.length > 0 && item.flagGuardar){
				$scope.match.push(item.matches[0]);
				item.flagGuardar = false;
				item.claseFila = "";
			}
		});
		//Envío la información al servidor
		if ($scope.flagCambios){
			priceFactory.addMatchPrice($scope.match, function(data){
				if (data.status == 'OK'){
					$scope.flagGuardado = false;
					//Muestro cartel con el resultado de la operación y desaparece después de 3 segundos
					$timeout(function(){
						$scope.flagGuardado = true;
						$scope.flagCambios = false;
					}, 3000);
				} else {
					dialogs.error('Asociar', 'Se ha producido un error al guardar los datos asociados. ' + data.data);
				}
			});
		}
	};

	$scope.guardarNuevoConcepto = function(){
		if ($scope.flagNuevoConcepto){
			var formData = {
				"description":$scope.descripcion,
				"topPrices": [{price: $scope.precio, currency: $scope.moneda}],
				"matches": null,
				"unit": $scope.unidad,
				"code": $scope.codigo,
				"terminal": loginService.getInfo().terminal
			};

			if ($scope.verificarEditado()){
				if ($scope.flagEditando){
					formData.topPrices = angular.copy($scope.tarifaCompleta.topPrices);
					if (angular.isDefined($scope.newPrice) && $scope.newPrice > 0){
						var dlg = dialogs.confirm("Nuevo precio", "¿Agregar nuevo precio a la tarifa? Fecha: " + $filter('date')($scope.newFrom, 'yyyy-MM-dd')  + ', moneda: ' + $filter('formatCurrency')($scope.newCurrency) + ', precio: ' + $scope.newPrice);
						dlg.result.then(function(){
							var nuevoTopPrice = {
								price: $scope.newPrice,
								currency: $scope.newCurrency,
								from: $scope.newFrom
							};
							formData.topPrices.push(nuevoTopPrice);
							priceFactory.savePriceChanges(formData, $scope.tarifaCompleta._id, function(data){
								if (data.status == 'OK'){
									$scope.newPrice = '';
									$scope.newFrom = new Date();
									dialogs.notify("Asociar","Se ha asignado el nuevo valor a la tarifa y se han guardado los cambios.");
									$scope.tarifaCompleta = data.data;
									$scope.preciosHistoricos = $scope.tarifaCompleta.topPrices;
									$scope.preciosHistoricos.forEach(function(precio){
										precio.from = new Date(precio.from);
									});
									$scope.prepararDatos();
								} else {
									dialogs.error('Asociar', 'Se ha producido un error al guardar los datos asociados. ' + data.data);
								}
							})
						});
					} else {
						priceFactory.savePriceChanges(formData, $scope.tarifaCompleta._id, function(data){
							if (data.status == 'OK'){
								$scope.newPrice = '';
								$scope.newFrom = new Date();
								dialogs.notify("Asociar","La tarifa ha sido modificada correctamente.");
								$scope.tarifaCompleta = data.data;
								$scope.preciosHistoricos = $scope.tarifaCompleta.topPrices;
								$scope.preciosHistoricos.forEach(function(precio){
									precio.from = new Date(precio.from);
								});
								$scope.prepararDatos();
							} else {
								dialogs.error('Asociar', 'Se ha producido un error al guardar los datos asociados. ' + data.data);
							}
						})
					}
				} else {
					priceFactory.addPrice(formData, function(nuevoPrecio){
						if (nuevoPrecio.status == 'OK'){
							var nuevoMatch = {
								code: nuevoPrecio.data.code,
								terminal: nuevoPrecio.data.terminal,
								_idPrice: nuevoPrecio.data._id,
								match:[]
							};
							nuevoMatch.match.push(nuevoPrecio.data.code);

							$scope.match = [];
							$scope.match.push(nuevoMatch);

							priceFactory.addMatchPrice($scope.match, function(data){
								if (data.status == 'OK'){
									dialogs.notify("Asociar","El nuevo concepto ha sido añadido correctamente.");
									$scope.salir();
									$scope.prepararDatos();
								} else {
									dialogs.error('Asociar', 'Se ha producido un error al intentar asociar el nuevo valor. ' + data.data);
								}
							});
						} else {
							dialogs.error('Asociar', 'Se ha producido un error al agregar el nuevo valor. ' + nuevoPrecio.data);
						}
					})
				}
			}
		}
	};

	$scope.salir = function(){
		$scope.preciosHistoricos = [];
		$scope.flagNuevoConcepto = false;
		$scope.flagEditando = false;
		$scope.esRequerido = false;

		$scope.nuevoConcepto = false;

		$scope.descripcion = "";
		$scope.codigo = "";
		$scope.unidad = "";
		$scope.moneda = "";
		$scope.precio = "";
	};

	$scope.esconderAlerta = function(){
		$scope.flagGuardado = true;
	};

	$scope.editarTarifa = function(tarifa){
		$scope.posicionTarifa = $scope.pricelist.indexOf(tarifa);
		priceFactory.getPriceById(tarifa._id, function(data){
			if (data.status == 'OK'){
				$scope.tarifaCompleta = data.data;
				$scope.codigo = $scope.tarifaCompleta.code;
				$scope.descripcion = $scope.tarifaCompleta.description;
				$scope.unidad = $scope.tarifaCompleta.unit;
				$scope.moneda = tarifa.topPrices[0].currency;
				$scope.precio = tarifa.topPrices[0].price;
				$scope.preciosHistoricos = $scope.tarifaCompleta.topPrices;
				$scope.preciosHistoricos.forEach(function(precio){
					precio.from = new Date(precio.from);
				});
				$scope.abrirNuevoConcepto('editar');
			} else {
				dialogs.error('Asociar', 'Se ha producido un error al cargar los datos de la tarifa. ' + data.data);
			}
		});
	};

	$scope.verificarEditado = function(){
		var flagCodigo = false;

		//Comparo que con los cambios hechos, no coincida el código con otra tarifa de la lista
		var listaSinCodigo = $scope.pricelist.slice();
		listaSinCodigo.splice($scope.posicionTarifa, 1);
		listaSinCodigo.forEach(function(tarifa){
			if ($scope.codigo == tarifa.code){
				flagCodigo = true;
			}
			if (tarifa.matches != null && tarifa.matches.length > 0){
				tarifa.matches[0].match.forEach(function(codigo){
					if (codigo == $scope.codigo){
						flagCodigo = true;
					}
				})
			}
		});

		//Si hubo coincidencia muestro mensaje de error
		if (flagCodigo){
			dialogs.error('Error', 'El código de la tarifa no puede coincidir con el de una tarifa existente.');
			return false;
		} else {
			return true;
		}
	};

	$scope.eliminarTarifa = function(){
		var dlg = dialogs.confirm('Eliminar', 'Se eliminará la tarifa, ¿confirma la operación?');
		dlg.result.then(function(){
			priceFactory.removePrice($scope.tarifaCompleta._id, function(data){
				if (data.status == 'OK'){
					dialogs.notify("Eliminar","La tarifa ha sido eliminada");
					$scope.prepararDatos();
					$scope.salir();
				} else {
					dialogs.error('Asociar', 'Se ha producido un error al intentar eliminar la tarifa. ' + data.data);
				}
			})
		})
	}
}]);