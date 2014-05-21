/**
 * Created by Diego Reyes on 1/29/14.
 */
function matchPricesCtrl($scope, priceFactory, $timeout, dialogs, loginService){
	'use strict';

	// Paginacion
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;

	$scope.dataUser = loginService.getInfo();

	$scope.flagGuardado = true;
	$scope.flagCambios = false;

	$scope.listaMatch = false;
	$scope.nuevoConcepto = true;

	$scope.filteredPrices = [];
	$scope.matchesTerminal = [];

	$scope.codigoVacio = true;

	priceFactory.getMatchPrices(loginService.getInfo().terminal, null, function (data) {
		$scope.pricelist = data.data;

		//Cargo todos los códigos ya asociados de la terminal para control
		$scope.pricelist.forEach(function(price){
			if (price.matches != null && price.matches.length > 0){
				price.matches[0].match.forEach(function(codigo){
					$scope.matchesTerminal.push(codigo);
				})
			}
		});

		$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage - 1);

		$scope.totalItems = $scope.pricelist.length;

		$scope.$watch('currentPage + itemsPerPage', function(){
			$scope.guardar();
			$scope.flagCambios = false;
			$scope.filtro = '';
		});

	});

	$scope.agregarCodigo = function(price){
		if (!$scope.matchesTerminal.contains(price.new)){
			if (!(angular.equals(price.new, undefined) || angular.equals(price.new,''))){
				if ((price.matches == null || price.matches.length === 0)){
					$scope.nuevoMatch = [{
						terminal: loginService.getInfo().terminal,
						match: [],
						_idPrice: price._id,
						code: price.code,
						flagGuardar: true,
						claseFila: "success"
					}];
					$scope.nuevoMatch[0].match.push(price.new);
					price.matches = $scope.nuevoMatch;
				} else {
					price.matches[0]._idPrice= price._id;
					price.matches[0].match.push(price.new);
					price.matches[0].flagGuardar = true;
					price.matches[0].claseFila = "success";
				}
				$scope.matchesTerminal.push(price.new);
				$scope.flagCambios = true;
			}
		} else{
			dialogs.notify("Asociar","El código ingresado ya se encuentra asociado a otra tarifa");
		}
		price.new = ''
	};

	$scope.borrar = function(price, codigo){
		//Elimino el código del match
		var pos = price.matches[0].match.indexOf(codigo);
		price.matches[0].match.splice( pos, 1 );
		price.matches[0]._idPrice = price._id;

		//Elimino el código de la lista de todos los códigos asociados
		pos = $scope.matchesTerminal.indexOf(codigo);
		$scope.matchesTerminal.splice(pos, 1);

		price.matches[0].claseFila = "warning";
		price.matches[0].flagGuardar = true;
		$scope.flagCambios = true;
	};

	$scope.hitEnter = function(evt, price){
		if(angular.equals(evt.keyCode,13))
			$scope.agregarCodigo(price);
		price.disabled = !(angular.isDefined(price.new) && price.new != '');
	}; // end hitEnter

	$scope.abrirNuevoConcepto = function(){
		$scope.listaMatch = true;
		$scope.nuevoConcepto = false;
	};

	$scope.guardar = function(){
		$scope.match = [];
		var prices = $scope.filteredPrices;
		prices.forEach(function(item){
			if (item.matches != null && item.matches.length > 0 && item.matches[0].flagGuardar){
				//item.match._id = item.match._id;
				$scope.match.push(item.matches[0]);
				item.matches[0].flagGuardar = false;
				item.matches[0].claseFila = "";
			}
		});
		if ($scope.flagCambios){
			priceFactory.addMatchPrice($scope.match, function(){
				$scope.flagGuardado = false;
				$timeout(function(){
					$scope.flagGuardado = true;
				}, 3000);
				$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage - 1);
			});
		} else {
			$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage - 1);
		}
	};

	$scope.guardarNuevoConcepto = function(){

		var formData = {
			"description":$scope.descripcion,
			"topPrice":$scope.precio,
			"matches": null,
			"unit": $scope.unidad,
			"currency": $scope.moneda,
			"code": $scope.codigo,
			"terminal": "AGP"
		};

		priceFactory.addPrice(formData, function(nuevoPrecio){
			var nuevoMatch = { codes:[{
				terminal: loginService.getInfo().terminal,
				codes: []}],
				_id: nuevoPrecio._id
			};

			nuevoMatch.codes.push($scope.codigo);
			nuevoPrecio.match = nuevoMatch;

			$scope.match = [];
			$scope.match.push(nuevoPrecio.match);

			priceFactory.addMatchPrice($scope.match, function(trash){
				console.log('entro al add match');
				console.log(trash);
				$scope.pricelist.push(nuevoPrecio);
				dialogs.notify("Asociar","El nuevo concepto ha sido añadido correctamente");
				$scope.listaMatch = false;
				$scope.nuevoConcepto = true;
			});
		})
	};

	$scope.cancelar = function(){
		$scope.descripcion = "";
		$scope.codigo = "";
		$scope.unidad = "";
		$scope.moneda = "";
		$scope.precio = "";

		$scope.listaMatch = false;
		$scope.nuevoConcepto = true;
	};

	$scope.esconderAlerta = function(){
		$scope.flagGuardado = true;
	};

	// Busca la Tarifa por cualquiera de los datos ingresados
	$scope.search = function (){
		var datos = {
			'codigo': $scope.codigo,
			'codigoAsociado': $scope.codigoAsociado
		};
		priceFactory.getMatchPrices(loginService.getInfo().terminal, datos, function (data) {
			$scope.pricelist = data.data;
			$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage - 1);
			$scope.totalItems = $scope.pricelist.length;
		});
	};

}