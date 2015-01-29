/**
 * Created by artiom on 29/01/15.
 */

myapp.controller('registerCtrl', function ($scope, dialogs, userFactory) {

	$scope.nombre = '';
	$scope.apellido = '';
	$scope.email = '';
	$scope.password = '';
	$scope.usuario = '';
	$scope.confirmPassword = '';
	$scope.confirmEmail = '';

	$scope.validEmail = false;

	$scope.$watch('[nombre, apellido]', function(){
		if ($scope.nombre != '' && $scope.apellido != ''){
			$scope.usuario = ($scope.apellido + '-' + $scope.nombre.substr(0, 1)).toLowerCase();
		}
	}, true);

	$scope.$watch('email', function(){
		var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		$scope.validEmail = expr.test($scope.email);
	});

	$scope.register = function(){
		if (!$scope.validEmail){
			dialogs.error('Error', 'La dirección de correo electrónico ingresada no es válida');
			return;
		}
		if ($scope.email != $scope.confirmEmail){
			dialogs.error('Error', 'Las direccciones de correo electrónico no coinciden');
			return;
		}
		if ($scope.password != $scope.confirmPassword){
			dialogs.error('Error', 'Las contraseñas ingresadas no coinciden');
			return;
		}
		console.log('hola');
	};

});
