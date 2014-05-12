/**
 * Created by Diego Reyes on 1/29/14.
 */
function matchPricesCtrl($scope, priceFactory, $dialogs, $timeout, loginService){
	'use strict';

	// Paginacion
	$scope.maxSize = 5;
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	$scope.setPage = function (pageNo){ $scope.currentPage = pageNo; };
	$scope.numPages = function (){ return Math.ceil($scope.totalItems / $scope.itemsPerPage); };

	$scope.dataUser = loginService.getInfo();

	$scope.flagGuardado = true;
	$scope.flagCambios = false;

	$scope.listaMatch = false;
	$scope.nuevoConcepto = true;

	$scope.filteredPrices = [];

	priceFactory.getPrice(function (data) {
		$scope.pricelist = data.data;
		$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage - 1);

		$scope.totalItems = $scope.pricelist.length;

		$scope.$watch('currentPage + itemsPerPage', function(){
			$scope.guardar();
			$scope.flagCambios = false;
			$scope.filtro = '';
		});

	});

	$scope.agregarCodigo = function(price){
		if (price.match == null){
			$scope.nuevoMatch = {
				terminal: loginService.getInfo().terminal,
				codes: []},
				id: price.id,
				flagGuardar: true,
				claseFila: "success"
			};
			$scope.nuevoMatch.codes.push(price.new);
			price.match = $scope.nuevoMatch;
		} else {
			if (!price.match.codes.contains(price.new) && !(angular.equals(price.new, undefined) || angular.equals(price.new,''))){
				price.match.codes.push(price.new);
				price.match.flagGuardar = true;
				price.match.claseFila = "success";
			}
		}
		$scope.flagCambios = true;
		price.new = ''
	};

	$scope.borrar = function(price, codigo){
		var pos = price.match.codes[0].codes.indexOf(codigo);
		pos > -1 && price.match.codes[0].codes.splice( pos, 1 );
		price.match.claseFila = "warning";
		price.match.flagGuardar = true;
		$scope.flagCambios = true;
	};

	$scope.hitEnter = function(evt, price){
		if(angular.equals(evt.keyCode,13))
			$scope.agregarCodigo(price);
	}; // end hitEnter

	$scope.abrirNuevoConcepto = function(){
		$scope.listaMatch = true;
		$scope.nuevoConcepto = false;
	};

	$scope.guardar = function(){
		$scope.match = [];
		var prices = $scope.filteredPrices;
		prices.forEach(function(item){
			if (item.match != null && item.match.flagGuardar){
				item.match._id = item.match.id;
				$scope.match.push(item.match);
				item.match.flagGuardar = false;
				item.match.claseFila = "";
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
			"match": null,
			"unit": $scope.unidad,
			"currency": $scope.moneda,
			"_id": $scope.codigo,
			"terminal": loginService.getInfo().terminal
		};

		console.log('Antes de entrar al factory de add price');
		priceFactory.addPrice(formData, function(nuevoPrecio){

			console.log('Entro');
			var nuevoMatch = { codes:[{
				terminal: loginService.getInfo().terminal,
				codes: []}],
				id: nuevoPrecio.id
			};

			nuevoMatch.codes[0].codes.push($scope.codigo);
			nuevoPrecio.match = nuevoMatch;

			$scope.match = [];
			nuevoPrecio.match._id = nuevoPrecio.match.id;
			$scope.match.push(nuevoPrecio.match);

			priceFactory.addMatchPrice($scope.match, function(trash){
				console.log('entro al add match');
				console.log(trash);
				$scope.pricelist.push(nuevoPrecio);
				$dialogs.notify("Asociar","El nuevo concepto ha sido añadido correctamente");
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
		priceFactory.searchMatch(datos, function(data){
			if(data.status === 'OK' || data.status == 200){
				$scope.filteredPrices = data.data;
			}
		})
	};

}