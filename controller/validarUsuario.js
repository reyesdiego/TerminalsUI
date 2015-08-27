/**
 * Created by artiom on 24/06/15.
 */
myapp.controller('validarUsuarioCtrl', ['$rootScope', '$scope', 'userFactory', 'dialogs', '$state', function($rootScope, $scope, userFactory, dialogs, $state) {

	$scope.datos = {
		salt: $rootScope.salt
	};

	$scope.cargando = false;

	$scope.validar = function(){
		$scope.cargando = true;
		userFactory.validateUser($scope.datos, function(data){
			$scope.cargando = false;
			if (data.status == 'OK'){
				var dl;
				if (data.emailDelivered){
					dl = dialogs.notify('Registro', 'En breve recibirá un mail en su cuenta de correo para poder habilitar su usuario.');
					dl.result.then(function(){
						$scope.volver();
					})
				} else {
					dialogs.error('Registro', 'Se ha producido un error al intentar enviar el mail de habilitación a su cuenta de correo. Vuelva a intentarlo más tarde.');
					$scope.volver();
				}
			} else {
				dialogs.error('Registro', data.data);
			}
		})
	};

	$scope.volver = function(){
		var n = $rootScope.rutasComunes.indexOf('validar');
		$rootScope.rutasComunes.splice(n, 1);
		$state.transitionTo('login');
	};

}]);
