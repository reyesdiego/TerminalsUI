/**
 * Created by Diego Reyes on 1/23/14.
 */
(function() {
	myapp.controller('loginCtrl', function($scope, $state, loginService, authFactory) {
		'use strict';
		$scope.sesion = false;
		if (loginService.getStatus()){
			$state.transitionTo('tarifario');
		}

		$scope.login = function(){
			if ($scope.sesion){
				authFactory.loginWithCookies($scope.email, $scope.password);
			} else {
				authFactory.loginWithoutCookies($scope.email, $scope.password);
			}
		};
	});
})();