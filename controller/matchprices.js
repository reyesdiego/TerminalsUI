/**
 * Created by Diego Reyes on 1/29/14.
 */
function matchPricesCtrl($scope, $dialogs, priceFactory){
	'use strict';

	priceFactory.getMatchPrices("BACTSSA", function (data) {

		$scope.pricelist = data;

		/* YA NO SE USA LA VENTANA MODAL
		$scope.open = function (precio){
			var dlg = $dialogs.create('view/matchprices.modal.html','matchPricesModalCtrl',{itemTarifa: precio},{key: false, back: 'static'});
			dlg.result.then(function(match, method){
				console.log(match);
				priceFactory.addMatchPrice(method, match);
			},function(){
				console.log("Se eligio cancelar");
			})
		}*/

		$scope.agregarCodigo = function(price) {

			if (!price.match.contains(price.new)){
				price.match.push(price.new);
			}
			price.new = ''
		};

		$scope.borrar = function(price, codigo) {
			var pos = price.match.indexOf(codigo);
			pos > -1 && price.match.splice( pos, 1 );
		}

		$scope.hitEnter = function(evt, price){
			if(angular.equals(evt.keyCode,13) && !(angular.equals(price.new,null) || angular.equals(price.new,'')))
				$scope.agregarCodigo(price);
		} // end hitEnter

		$scope.guardar = function() {
			$scope.match = { terminal: "BACTSSA",
							codes: []
						};
			var price;
			for (price in $scope.pricelist){
				var nuevoMatch = { codeAgp: price.code,
									codeNew: price.match};
				$scope.match.codes.push(nuevoMatch);
			}
			priceFactory.addMatchPrice($scope.match);
		}
	});




}