/**
 * Created by artiom on 17/03/15.
 */

myapp.controller('cambioTerminalCtrl', ['$rootScope', '$scope', 'cacheFactory', '$state', 'authFactory', 'loginService', '$timeout', 'generalFunctions', 'dialogs', function($rootScope, $scope, cacheFactory, $state, authFactory, loginService, $timeout, generalFunctions, dialogs){

	//$scope.max = 70; //sin metodos oracle
	$scope.max = 80;
	$scope.progreso = 0;
	$scope.mostrarMensaje = 'Actualizando datos de la aplicación...';
	$scope.porcentaje = 0;

	$scope.$on('progreso', function(e, mensaje){
		$scope.progreso += 10;
		$scope.porcentaje = ($scope.progreso * 100 / $scope.max).toFixed();
	});

	$scope.cerrarSesion = function(){
		$rootScope.cargandoCache = false;
		$scope.hayError = true;
		$scope.barType = 'progress-bar-danger';
		$scope.mostrarMensaje = 'Se ha producido un error...';
		authFactory.logout();
		$rootScope.esUsuario = '';
		$rootScope.filtroTerminal = '';
		$scope.volver();
	};

	$scope.volver = function(){
		$timeout(function(){
			if ($scope.progreso > 0){
				$scope.progreso -= 10;
				$scope.porcentaje = ($scope.progreso * 100 / $scope.max).toFixed();
				$scope.mostrarMensaje = 'Cerrando sesiónn';
				$scope.volver();
			} else {
				$state.transitionTo('login');
			}
		}, 1000);
	};

	$rootScope.rutas = loginService.getAcceso();
	switch (loginService.getFiltro()){
		case 'BACTSSA':
			$rootScope.logoTerminal = 'images/logo_bactssa.png';
			break;
		case 'TERMINAL4':
			$rootScope.logoTerminal = 'images/logo_terminal4.png';
			break;
		case 'TRP':
			$rootScope.logoTerminal = 'images/logo_trp.png';
			break;
	}
	$rootScope.cargandoCache = true;

	cacheFactory.cambioTerminal()
		.then(function(){
			$timeout(function(){
				$rootScope.cargandoCache = false;
				$state.transitionTo($rootScope.previousState);
			}, 500)
		},
		function(){
			var dlg = dialogs.confirm('Error', 'Se producido un error al cargar los datos, puede que alguna funcionalidad de la aplicación no esté disponible. ¿Desea ingresar a la aplicación de todos modos?');
			dlg.result.then(function(){
					$rootScope.cargandoCache = false;
					$state.transitionTo($rootScope.previousState);
				},
				function(){
					$scope.cerrarSesion();
				})
		});

}]);
