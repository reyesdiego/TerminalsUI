/**
 * Created by Diego Reyes on 1/29/14.
 */

myapp.controller('matchPricesCtrl', ['$rootScope', '$scope', 'priceFactory', '$timeout', 'dialogs', 'loginService', '$filter', 'generalCache', 'cacheFactory', '$state',
	function($rootScope, $scope, priceFactory, $timeout, dialogs, loginService, $filter, generalCache, cacheFactory, $state) {
		'use strict';

		//Array con los tipos de tarifas para establecer filtros
		$scope.tiposTarifas = [
			{nombre: 'AGP', active: true},
			{nombre: 'Servicios', active: false},
			{nombre: 'Propios', active: false},
			{nombre: 'Con match', active: false}
		];

		$scope.newTopPrice = {
			from: new Date(),
			currency: 'DOL',
			price: ''
		};

		$scope.newPrice = {
			code: '',
			unit: '',
			topPrices:[],
			terminal: ''
		};

		$scope.newMatches = {
			array: []
		};

		$scope.nombre = loginService.getFiltro();

		$scope.flagGuardado = true;
		$scope.flagCambios = false;

		$scope.nuevoConcepto = false;

		$scope.pricelist = [];
		$scope.filteredPrices = [];
		$scope.pricelistAgp = [];
		$scope.matchesTerminal = [];
		$scope.servicios = [];
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
		$scope.tasas = false;

		$scope.tipoFiltro = 'AGP';

		$scope.propiosTerminal = [];

		$scope.preciosHistoricos = [];

		$scope.puedeEditar = function(){
			if ($scope.acceso == 'agp'){
				return in_array('modificarTarifario', $rootScope.rutas);
			}
		};

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
			//$scope.pageChanged();
		});

		$scope.$on('errorInesperado', function(e, mensaje){
			$scope.hayError = true;
			$scope.mensajeResultado = mensaje;
			$scope.totalItems = 0;
			$scope.pricelist = [];
		});

		$scope.prepararDatos = function(){
			priceFactory.getMatchPrices({onlyRates: $scope.tasas}, loginService.getFiltro(), function (data) {
				console.log(data);
				if (data.status == 'OK'){
					$scope.pricelist = data.data;
					$scope.pricelistAgp = [];
					$scope.servicios = [];
					$scope.codigosConMatch = [];
					$scope.propiosTerminal = [];
					//Cargo todos los códigos ya asociados de la terminal para control
					$scope.pricelist.forEach(function(price){
						var propioTerminal = false;
						$scope.matchesTerminal.push(price.code);
						if (angular.isDefined(price.matches) && price.matches != null && price.matches.length > 0 && price.matches[0].match.length > 0){
							$scope.codigosConMatch.push(price);
							price.matches[0].match.forEach(function(codigo){
								$scope.matchesTerminal.push(codigo);
							});
							if (price.terminal == 'AGP'){
								$scope.pricelistAgp.push(price);
							} else {
								if (price.matches[0].match.length >= 1){
									price.matches[0].match.forEach(function(unMatch){
										if (unMatch == price.code){
											propioTerminal = true;
											//$scope.propiosTerminal.push(price);
										}
									});
									propioTerminal ? $scope.propiosTerminal.push(price) : $scope.servicios.push(price);
								} else {
									$scope.servicios.push(price);
								}
							}
						} else {
							if (price.terminal == 'AGP'){
								$scope.pricelistAgp.push(price);
							} else {
								$scope.servicios.push(price);
							}
						}
					});
					switch ($scope.tipoFiltro){
						case 'AGP':
							$scope.listaSeleccionada = $scope.pricelistAgp;
							break;
						case 'Servicios':
							$scope.listaSeleccionada = $scope.servicios;
							break;
						case 'Propios':
							$scope.listaSeleccionada = $scope.propiosTerminal;
							break;
						case 'Con match':
							$scope.listaSeleccionada = $scope.codigosConMatch;
							break;
					}
					$scope.totalItems = $scope.pricelist.length;
				} else {
					dialogs.error('Asociar', 'Se ha producido un error al cargar los datos de códigos asociados. ' + data.data);
					$scope.pricelist = [];
					$scope.totalItems = 0;
				}
			});
		};

		$scope.cambiarTarifas = function(tipoTarifa){
			$scope.tipoFiltro = tipoTarifa.nombre;
			$scope.tiposTarifas.forEach(function(unaTarifa){
				unaTarifa.active = (unaTarifa.nombre == tipoTarifa.nombre);
			});
			if (tipoTarifa.nombre == 'AGP'){
				$scope.listaSeleccionada = angular.copy($scope.pricelistAgp);
			} else if (tipoTarifa.nombre == 'Servicios'){
				$scope.listaSeleccionada = angular.copy($scope.servicios);
			} else if (tipoTarifa.nombre == 'Propios') {
				$scope.listaSeleccionada = angular.copy($scope.propiosTerminal);
			} else {
				$scope.listaSeleccionada = angular.copy($scope.codigosConMatch);
			}
			$scope.totalItems = $scope.listaSeleccionada.length
		};

		//Verifica que un codigo no se encuentre ya asociado antes de agregarlo
		$scope.checkMatch = function(matchCode){
			matchCode.text = matchCode.text.toUpperCase();
			return (!$scope.matchesTerminal.contains(matchCode.text))
		};

		$scope.abrirNuevoConcepto = function(tipo){
			$scope.nuevoConcepto = true;
			$scope.esRequerido = true;
			$scope.flagNuevoConcepto = true;
			if (!(tipo == 'editar')){
				$scope.newPrice = {
					code: '',
					unit: '',
					topPrices: [],
					terminal: ''
				}
			}
			$scope.flagEditando = (tipo == 'editar');
			$state.transitionTo('modificarTarifario');
		};

		//Saca el top price de una tarifa
		$scope.removeTopPrice = function(index){
			console.log(index);
			$scope.newPrice.topPrices.splice(index, 1);
		};

		//Agrega el top price a una tarifa
		$scope.addTopPrice = function(){
			if (validateTopPrice()){
				$scope.newPrice.topPrices.push($scope.newTopPrice);
				$scope.newTopPrice = {
					from: new Date(),
					currency: 'DOL',
					price: ''
				}
			}
		};

		//Se fija que el top price sea válido antes de agregarlo a una tarifa
		function validateTopPrice(){
			$scope.newTopPrice.price = parseFloat($scope.newTopPrice.price);
			return ($scope.newTopPrice.from != '' && $scope.newTopPrice.currency != '' && $scope.newTopPrice.price > 0);
		}

		//Guarda los cambios realizados sobre una tarifa
		$scope.savePrice = function(){
			var dlg = null;
			if (verificarEditado()){
				$scope.newPrice.terminal = loginService.getInfo().terminal;
				if ($scope.flagEditando){
					dlg = dialogs.confirm('Guardar', 'Se guardarán todos los cambios realizados sobre la tarifa, ¿confirma la operación?');
					dlg.result.then(function(){
						$scope.newPrice.unit = String($scope.newPrice.unit);
						priceFactory.savePriceChanges($scope.newPrice, $scope.newPrice._id, function(data){
							if (data.status == 'OK'){
								if ($scope.newMatches.array.length > 0){
									saveMatchPrices();
								} else {
									dialogs.notify('Tarifacio', 'Los cambios se han guardado exitosamente.');
									$scope.prepararDatos();
								}
							} else {
								dialogs.error('Asociar', 'Se ha producido un error al guardar los datos asociados. ' + data.data);
							}
						})
					})
				} else {
					dlg = dialogs.confirm('Nueva tarifa', 'Se agregará una nueva tarifa, ¿confirma la operación?');
					dlg.result.then(function(){
						$scope.newPrice.unit = String($scope.newPrice.unit);
						priceFactory.addPrice($scope.newPrice, function(nuevoPrecio){
							if (nuevoPrecio.status == 'OK'){
								if ($scope.newMatches.array.length > 0){
									saveMatchPrices();
								} else {
									dialogs.notify('Tarifacio', 'Los cambios se han guardado exitosamente.');
									$scope.prepararDatos();
								}
							} else {
								dialogs.error('Asociar', 'Se ha producido un error al agregar el nuevo valor. ' + nuevoPrecio.data);
							}
						})
					})

				}
			}
		};

		function saveMatchPrices (){
			var array= [];
			$scope.newPrice.matches[0].match = $scope.newMatches.array.map(function(matchCode){
				return matchCode.text;
			});
			console.log($scope.newPrice.matches[0]);
			array.push($scope.newPrice.matches[0]);
			priceFactory.addMatchPrice(array, function(data){
				if (data.status == 'OK'){
					cacheFactory.actualizarMatchesArray(loginService.getFiltro());
					dialogs.notify("Asociar","Los cambios se han guardado exitosamente.");
					$scope.prepararDatos();
				} else {
					dialogs.error('Asociar', 'Se ha producido un error al intentar guardar los cambios.');
				}
			});
		}

		//Carga la tarifa completa antes de poder editarla
		$scope.editarTarifa = function(tarifa){
			$scope.posicionTarifa = $scope.pricelist.indexOf(tarifa);

			if (tarifa.matches == null || tarifa.matches.length === 0) {
				$scope.nuevoMatch = [{
					terminal: loginService.getInfo().terminal,
					match: [],
					_idPrice: tarifa._id,
					code: tarifa.code
				}];

				tarifa.matches = $scope.nuevoMatch;
			}
			$scope.newPrice = angular.copy(tarifa);
			$scope.newMatches.array = angular.copy(tarifa.matches[0].match);

			$scope.abrirNuevoConcepto('editar');
		};

		//Verifica que al modificar un código no coincida con otro ya existente
		var verificarEditado = function(){
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

		//Elimina una tarifa
		$scope.eliminarTarifa = function(){
			var dlg = dialogs.confirm('Eliminar', 'Se eliminará la tarifa, ¿confirma la operación?');
			dlg.result.then(function(){
				priceFactory.removePrice($scope.newPrice._id, function(data){
					if (data.status == 'OK'){
						dialogs.notify("Eliminar","La tarifa ha sido eliminada");
						$scope.prepararDatos();
						$scope.salir();
					} else {
						dialogs.error('Asociar', 'Se ha producido un error al intentar eliminar la tarifa. ' + data.data);
					}
				})
			})
		};

		//Borra el valor de un campo de la nueva tarifa
		$scope.eraseField = function(field){
			$scope.newPrice[field] = ''
		};

		//Descarga CSV
		$scope.descargarCSV = function(){
			var alterModel = {
				onlyRates: $scope.tasas,
				output: 'csv'
			};

			priceFactory.getMatchPricesCSV(alterModel, loginService.getFiltro(), function(data, status){
				if (status == 'OK'){
					var anchor = angular.element('<a/>');
					anchor.css({display: 'none'}); // Make sure it's not visible
					angular.element(document.body).append(anchor); // Attach to document

					anchor.attr({
						href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
						target: '_blank',
						download: 'Asociacion_tarifario.csv'
					})[0].click();

					anchor.remove(); // Clean it up afterwards
				} else {
					dialogs.error('Asociar', 'Se ha producido un error al descargar los datos.');
				}
			})
		};

		if (loginService.getStatus()) $scope.prepararDatos();

		$scope.$on('terminoLogin', function(){
			$scope.acceso = $rootScope.esUsuario;
			$scope.nombre = loginService.getFiltro();
			$scope.prepararDatos();
		});

		$scope.$on('cambioTerminal', function(){
			$scope.nombre = loginService.getFiltro();
			$scope.prepararDatos();
		})

	}]);