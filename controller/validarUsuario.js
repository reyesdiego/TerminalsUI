/**
 * Created by artiom on 24/06/15.
 */
myapp.controller('validarUsuarioCtrl', ['$rootScope', '$scope', 'ctrlUsersFactory', 'dialogs', '$state', function($rootScope, $scope, ctrlUsersFactory, dialogs, $state) {

	$scope.validar = function(){
		ctrlUsersFactory.validateUser($rootScope.salt, function(data){
			console.log(data);
			if (data.status == 'OK'){
				var dl;
				if (data.emailDeliver){
					dl = dialogs.notify('Registro', 'En breve recibirá un mail en la cuenta ' + $scope.email + ' para poder habilitarlo.');
					dl.result.then(function(){
						$state.transitionTo('login');
					})
				} else {
					dl = dialogs.notify('Registro', 'El usuario ' + $scope.usuario + ' ha sido registrado exitosamente. Inicie sesión en el sistema para solicitar la validación del mismo.')
					dl.result.then(function(){
						$state.transitionTo('login');
					})
				}
			} else {
				console.log(data);
				dialogs.error('Registro', data.data);
			}
		})
	};

	$scope.volver = function(){
		$state.transitionTo('login');
	};

}]);
