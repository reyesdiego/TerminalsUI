/**
 * Created by Diego Reyes on 1/29/14.
 */
function matchPricesCtrl($scope, $http, $dialogs, priceFactory){
	'use strict';

	var inserturl = serverUrl + '/agp/prices';

	priceFactory.getPrice(function (data) {

		console.log("success");
		$scope.pricelist = data;
		$scope.open = function (precio){
			var dlg = $dialogs.create('view/matchprices.modal.html','matchPricesModalCtrl',{itemTarifa: precio},{key: false, back: 'static'});
			dlg.result.then(function(match, method){
				console.log(match);
				priceFactory.addMatchPrice(method, match);
			},function(){
				console.log("se eligio cancelar");
			})

		}
	});

}
