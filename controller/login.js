/**
 * Created by Diego Reyes on 1/23/14.
 */
function loginCtrl($scope, $rootScope, userFactory, $state, invoiceFactory, loginService){
	'use strict';
	$scope.entrando = false;

	if (loginService.getStatus()){
		$state.transitionTo('tarifario');
	}

	$scope.login = function(){
		$scope.entrando = true;
		userFactory.login($scope.email, $scope.password, function(data, error){
				if (error){
					$scope.entrando = false;
				} else {
					loginService.setInfo(data);
					loginService.setStatus(true);
					loginService.setType(data.role);
					loginService.setToken(data.token.token);
					data.acceso.push("reports")
					loginService.setAcceso(data.acceso);
					$state.transitionTo('tarifario');

					$rootScope.esUsuario = loginService.getType();
					$rootScope.terminal = loginService.getInfo();

					// Se carga el array de la descripcion de los items de las facturas
					invoiceFactory.getDescriptionItem(loginService.getInfo.terminal, function(data){
						$rootScope.itemsDescriptionInvoices = data.data;
					});
				}
			}
		)};

	$scope.hitEnter = function(evt){
		if(angular.equals(evt.keyCode,13))
			$scope.login();
	}; // end hitEnter
}
