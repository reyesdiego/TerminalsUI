/**
 * Created by Diego Reyes on 1/29/14.
 */
function matchPricesCtrl($scope, $http, $templateCache, $dialogs){
	'use strict';

	var inserturl = serverUrl + '/agp/pricelist';
	$http({
		method: 'GET',
		url: inserturl,
		cache: $templateCache
	}).success(function(data) {
			console.log("success");
			$scope.pricelist = data;

			$scope.items = ['item1', 'item2', 'item3'];

			$scope.open = function (){

				var dlg = $dialogs.create('view/matchprices.modal.html','whatsYourNameCtrl',{},{key: false,back: 'static'});
				dlg.result.then(function(name){
					$scope.name = name;
				},function(){
					$scope.name = 'You decided not to enter in your name, that makes me sad.';
				});
				/*$dialogs.create('view/matchprices.modal.html','whatsYourNameCtrl',{},{key: false,back: 'static'});*/

			};

		}).error(function(response) {
			console.log("error");
		})

}
