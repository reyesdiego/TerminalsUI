/**
 * Created by Diego Reyes on 1/29/14.
 */
function matchPricesCtrl($scope, priceFactory){
	'use strict';

	priceFactory.getMatchPrices("BACTSSA", function (data) {

		$scope.pricelist = data;

		$scope.agregarCodigo = function(price) {
			if (price.match == null){
				$scope.nuevoMatch = { codes:[{
											terminal: "BACTSSA",
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
			console.log($scope.match);
			priceFactory.addMatchPrice($scope.match, function(data){
				console.log(data);
			});
		}
	});




}