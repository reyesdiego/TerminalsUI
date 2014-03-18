/**
 * Created by Diego Reyes on 1/29/14.
 */
function matchPricesCtrl($scope, priceFactory, $rootScope, $dialogs){
	'use strict';
	$scope.listaMatch = false;
	$scope.nuevoConcepto = true;

	priceFactory.getMatchPrices($rootScope.dataUser.terminal, function (data) {

		$scope.pricelist = data;

		$scope.agregarCodigo = function(price) {
			if (price.match == null){
				$scope.nuevoMatch = { codes:[{
											terminal: $rootScope.dataUser.terminal,
											codes: []}],
									id: price.id
									};
				$scope.nuevoMatch.codes[0].codes.push(price.new);
				price.match = $scope.nuevoMatch;
			} else {
				if (!price.match.codes[0].codes.contains(price.new) && !(angular.equals(price.new, undefined) || angular.equals(price.new,''))){
					price.match.codes[0].codes.push(price.new);
				}
			}
			price.new = ''
		};

		$scope.borrar = function(price, codigo) {
			var pos = price.match.codes[0].codes.indexOf(codigo);
			pos > -1 && price.match.codes[0].codes.splice( pos, 1 );
		}

		$scope.hitEnter = function(evt, price){
			if(angular.equals(evt.keyCode,13))
				$scope.agregarCodigo(price);
		} // end hitEnter

		$scope.abrirNuevoConcepto = function(){
			$scope.listaMatch = true;
			$scope.nuevoConcepto = false;
		}

		$scope.guardar = function() {
			$scope.match = [];

			var prices = $scope.pricelist
			prices.forEach(function(item){
				if (item.match != null){
					if (item.match.codes[0].codes.length>0){
						item.match._id = item.match.id;
						$scope.match.push(item.match);
					}
				}
			});

			priceFactory.addMatchPrice($scope.match, function(datos){
				console.log(datos);
				$dialogs.notify("Asociar","Los datos se han guardado correctamente");
			});

		}

		$scope.guardarNuevoConcepto = function() {

			var formData = {
				"description":	$scope.descripcion,
				"topPrice":		$scope.precio,
				"match": null,
				"unit": $scope.unidad,
				"currency": $scope.moneda,
				"_id": $scope.codigo,
				"terminal": $rootScope.dataUser.terminal
			};

			priceFactory.addPrice(formData, function(nuevoPrecio){

				var nuevoMatch = { codes:[{
					terminal: $rootScope.dataUser.terminal,
					codes: []}],
					id: nuevoPrecio.id
				};

				nuevoMatch.codes[0].codes.push($scope.codigo);
				nuevoPrecio.match = nuevoMatch;

				$scope.match = [];
				nuevoPrecio.match._id = nuevoPrecio.match.id;
				$scope.match.push(nuevoPrecio.match);

				priceFactory.addMatchPrice($scope.match, function(trash){
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
		}
	});




}