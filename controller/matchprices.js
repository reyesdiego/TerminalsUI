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
			dlg.result.then(function(match){
				console.log(match);
				var inserturl = serverUrl + '/agp/matchPrice';
				$http({
					method: 'POST',
					url: inserturl,
					data: match
				}).success(function(response) {
						console.log("success");
						$scope.codeStatus = response.data;
						console.log($scope.codeStatus);
					}).error(function(response) {
						console.log("error");
						$scope.codeStatus = response || "Request failed";
						console.log($scope.codeStatus);
					});

			},function(){
				console.log("se eligio cancelar");
			})

		}
	});

}
