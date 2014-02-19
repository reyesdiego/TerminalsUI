/**
 * Created by kolesnikov-a on 17/02/14.
 */

function matchPricesModalCtrl ($scope, $modalInstance,  data, priceFactory){
	$scope.tarifa = data.itemTarifa;

	/*$scope.match= { terminal: "BACTSSA",
					codes: { codeAgp: data.itemTarifa.code,
					codeNew: [ "PROBANDO1", "PROBANDO2", "PROBANDO3"]
					}*/

	priceFactory.getMatchPrices( function (matchPrice){
		$scope.match = matchPrice;
		var method = (!matchPrice)?"PUT":"POST";
		priceFactory.addMatchPrice(method)
	})

	$scope.agregarCodigo = function(unCodigo) {
		$scope.match.codes.codeNew.push( unCodigo );

	};

	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');
	}; // end cancel

	$scope.save = function(){
		$modalInstance.close($scope.match);
	}; // end save

	$scope.hitEnter = function(evt, unCodigo){
		if(angular.equals(evt.keyCode,13) && !(angular.equals(unCodigo,null) || angular.equals(unCodigo,'')))
			$scope.agregarCodigo(unCodigo);
	} // end hitEnter

}