/**
 * Created by artiom on 17/03/15.
 */

myapp.controller('cambioTerminalCtrl', ['$rootScope', '$scope', 'cacheFactory', '$state', 'authFactory', 'loginService', function($rootScope, $scope, cacheFactory, $state, authFactory, loginService){

	$scope.max = 60;
	$scope.progreso = 0;
	$scope.mostrarMensaje = 'Actualizando datos de la aplicación...';

	$scope.$on('progreso', function(e, mensaje){
		$scope.progreso += 10;
		$scope.porcentaje = ($scope.progreso * 100 /60).toFixed();
	});

	$scope.cerrarSesión = function(){
		$scope.hayError = true;
		$scope.barType = 'progress-bar-danger';
		$scope.mostrarMensaje = 'Se ha producido un error...';
		authFactory.logout();
		$rootScope.esUsuario = '';
		loginService.unsetLogin();
		$rootScope.filtroTerminal = '';
		$rootScope.switchTheme('BACTSSA');
		$scope.volver();
	};

	$scope.volver = function(){
		$timeout(function(){
			if ($scope.progreso > 0){
				$scope.progreso -= 10;
				$scope.mostrarMensaje = 'Cerrando sesiónn';
				$scope.volver();
			} else {
				$scope.entrando = false;
				$scope.hayError = false;
			}
		}, 1000);
	};

	cacheFactory.cambioTerminal()
		.then(function(){
			$state.transitionTo($rootScope.previousState);
		},
		function(){
			$scope.cerrarSesión();
		})

}]);
