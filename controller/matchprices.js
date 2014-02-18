/**
 * Created by Diego Reyes on 1/29/14.
 */
function matchPricesCtrl($scope, $http, $templateCache, $dialogs){
	'use strict';

	var inserturl = serverUrl + '/agp/prices';
	$http({
		method: 'GET',
		url: 'price.json',
		//url: inserturl,
		cache: $templateCache
	}).success(function(data) {
			console.log("success");
			$scope.pricelist = data;

			$scope.items = ['item1', 'item2', 'item3'];

			$scope.open = function (id){
				$scope.id = id;
				console.log($scope.id);
				var dlg = $dialogs.create('view/matchprices.modal.html','matchPricesModalCtrl',{unId: $scope.id},{key: false,back: 'static'});
				dlg.result.then(function(name){
					$scope.name = name;
				},function(){
					$scope.name = 'You decided not to enter in your name, that makes me sad.';
				});

			};

		}).error(function(response) {
			console.log("error");
		})

}
