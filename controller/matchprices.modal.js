/**
 * Created by kolesnikov-a on 17/02/14.
 */
function matchPricesModalCtrl ($scope, $modalInstance, $http, $templateCache, data){
	console.log(data.unId);
	var inserturl = serverUrl + '/agp/prices/' + data.unId;
	$http({
		method: 'GET',
		url: inserturl,
		cache: $templateCache
	}).success(function(data) {
			$scope.tarifa = data;

			$scope.cancel = function(){
				$modalInstance.dismiss('canceled');
			}; // end cancel

			$scope.save = function(){
				$modalInstance.close($scope.user.name);
			}; // end save

			$scope.hitEnter = function(evt){
				if(angular.equals(evt.keyCode,13) && !(angular.equals($scope.name,null) || angular.equals($scope.name,'')))
					$scope.save();
			}; // end hitEnter

		}).error(function(response) {
			console.log("error");
		})


}
