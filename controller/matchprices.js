/**
 * Created by Diego Reyes on 1/29/14.
 */
function matchPricesCtrl($scope, priceFactory, $timeout, dialogs, loginService){
	'use strict';

	$scope.flagGuardado = true;
	$scope.flagCambios = false;

	$scope.listaMatch = false;
	$scope.nuevoConcepto = true;

	$scope.pricelist = [];
	$scope.filteredPrices = [];
	$scope.matchesTerminal = [];

	$scope.codigoVacio = true;

	$scope.search = "";

	$scope.esRequerido = true;
	$scope.flagNuevoConcepto = true;
	$scope.unidad = "CONTAINER";
	$scope.moneda = "PES";

	$scope.acceso = loginService.getType();

	$scope.anteriorDescripcion = '';
	$scope.anteriorCodigo = '';
	$scope.tarifaEditando = '';
	$scope.flagEditando = false;
	$scope.volviendoEditar = false;

	$scope.prepararDatos = function(){
		priceFactory.getMatchPrices(loginService.getFiltro(), null, function (data) {
			$scope.pricelist = data.data;
			//Cargo todos los códigos ya asociados de la terminal para control
			$scope.pricelist.forEach(function(price){
				if (price.matches != null && price.matches.length > 0){
					price.matches[0].match.forEach(function(codigo){
						$scope.matchesTerminal.push(codigo);
					})
				}
			});

			$scope.totalItems = $scope.pricelist.length;

		});
	};

	$scope.prepararDatos();

	$scope.pageChanged = function(){
		$scope.guardar();
		$scope.flagCambios = false;
	};

	$scope.$watch('search', function(){
		if ($scope.search != "" && $scope.search != null){
			//Se supone que siempre que busca se limiten los resultados a una sola página, por eso seteo
			//el totalItems en 1
			$scope.totalItems = 1;
			if ($scope.search.length <= 1){
				//Una búsqueda con un solo caracter producía demasiados resultados, por lo que solo muestro los 10 primeros
				$scope.itemsPerPage = 10;
			} else {
				//Si los resultados estaban originalmente en una página distinta de la currentPage no se veían,
				//de este modo todos los resultados van hasta la única página
				$scope.itemsPerPage = $scope.pricelist.length;
			}
		} else {
			$scope.totalItems = $scope.pricelist.length;
			$scope.itemsPerPage = 10;
		}
	});

	$scope.agregarCodigo = function(price){
		$scope.cancelarEditado(price);
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
		} else{
			dialogs.notify("Asociar","El código ingresado ya se encuentra asociado a otra tarifa");
		}
		price.new = ''
		price.disabled = true;
	};

	$scope.borrar = function(price, codigo){
		$scope.cancelarEditado(price);
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

	$scope.hitEnterEditar = function(evt, price){
		if(angular.equals(evt.keyCode,13))
			$scope.editado(price);
			$scope.volviendoEditar = false;
		if(angular.equals(evt.keyCode, 27))
			$scope.cancelarEditado(price);
	};

	$scope.abrirNuevoConcepto = function(){
		$scope.listaMatch = true;
		$scope.nuevoConcepto = false;
		$scope.esRequerido = true;
		$scope.flagNuevoConcepto = true;
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
			priceFactory.addMatchPrice($scope.match, function(){
				$scope.flagGuardado = false;
				//Muestro cartel con el resultado de la operación y desaparece después de 3 segundos
				$timeout(function(){
					$scope.flagGuardado = true;
					$scope.flagCambios = false;
				}, 3000);
			});
		}
	};

	$scope.guardarNuevoConcepto = function(){
		if ($scope.flagNuevoConcepto){
			var formData = {
				"description":$scope.descripcion,
				"topPrice":$scope.precio,
				"matches": null,
				"unit": $scope.unidad,
				"currency": $scope.moneda,
				"code": $scope.codigo,
				"terminal": loginService.getInfo().terminal
			};

			priceFactory.addPrice(formData, function(nuevoPrecio){

				if (nuevoPrecio.status === 'OK'){
					var nuevoMatch = {
						code: nuevoPrecio.data.code,
						terminal: nuevoPrecio.data.terminal,
						_idPrice: nuevoPrecio.data._id,
						match:[]
					};
					nuevoMatch.match.push(nuevoPrecio.data.code);

					$scope.match = [];
					$scope.match.push(nuevoMatch);

					priceFactory.addMatchPrice($scope.match, function(){
						dialogs.notify("Asociar","El nuevo concepto ha sido añadido correctamente");
						$scope.salir();
						$scope.prepararDatos();
					});
				}
			})
		}
	};

	$scope.salir = function(){
		$scope.flagNuevoConcepto = false;
		$scope.esRequerido = false;

		$scope.listaMatch = false;
		$scope.nuevoConcepto = true;

		$scope.descripcion = "";
		$scope.codigo = "";
		$scope.unidad = "";
		$scope.moneda = "";
		$scope.precio = "";
	};

	$scope.esconderAlerta = function(){
		$scope.flagGuardado = true;
	};

	$scope.editarTarifa = function(tarifa, campo){
		if (!$scope.volviendoEditar){
			if($scope.flagEditando){
				$scope.cancelarEditado($scope.tarifaEditando);
			}

			if (tarifa.terminal != 'AGP' && loginService.getType() == 'terminal'){
				var elemento;

				switch (campo) {
					case 'code':
						elemento = document.getElementById(tarifa.code);
						break;
					case 'description':
						elemento = document.getElementById(tarifa.description);
						break;
				}
				$timeout(function(){
					elemento.focus();
				},500);
				$scope.flagEditando = true;
				tarifa.editar = true;
				$scope.anteriorDescripcion = tarifa.description;
				$scope.anteriorCodigo = tarifa.code;
				$scope.tarifaEditando = tarifa;
			}
		} else {
			$scope.volviendoEditar = false;
		}
	};

	$scope.editado = function(price){
		var flagCodigo = false;
		var flagDescripcion = false;
		if (!(angular.equals(price.code, '') || angular.equals(price.description,''))){
			$scope.pricelist.forEach(function(tarifa){
				if (price.code == tarifa.code) flagCodigo = true;
				if (price.description == tarifa.description) flagDescripcion = true;
			})
			price.editar = false;
			price.claseFila = "info";
			price.flagGuardar = true;
			$scope.flagEditando = false;
			$scope.volviendoEditar = true;
		} else {
			dialogs.error('Error', 'El código y/o la descripción de la tarifa no pueden ser vacíos.');
		}
	};

	$scope.cancelarEditado = function(price){
		if ($scope.flagEditando){
			price.code = $scope.anteriorCodigo;
			price.description = $scope.anteriorDescripcion;
			price.editar = false;
			$scope.flagEditando = false;
		}
	};

}