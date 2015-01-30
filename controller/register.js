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
	$scope.entidad = 'bactssa';

	$scope.validEmail = false;

	$scope.$watch('[nombre, apellido]', function(){
		if ($scope.nombre != '' && $scope.apellido != ''){
			$scope.usuario = ($scope.apellido + '-' + $scope.nombre.substr(0, 1)).toLowerCase();
		}
	}, true);

	$scope.$watch('email', function(){
		var expr = new RegExp("^([a-zA-Z0-9_\\.\\-])+\\@(" + $scope.entidad + ")\\.([a-zA-Z0-9]{2,4})+(\\.[a-zA-Z]{2})?$");
		//var expr = /^([a-zA-Z0-9_\.\-])+\@(bactssa|trp|apmterminals|puertobuenosaires)\.([a-zA-Z0-9]{2,4})+(\.[a-zA-Z]{2})?$/;
		$scope.validEmail = expr.test($scope.email);
	});

	$scope.register = function(){
		if (!$scope.validEmail){
			dialogs.error('Error', 'La dirección de correo electrónico ingresada no es válida o no corresponde con la entidad elegida');
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
		var formData = {
			nombre: $scope.nombre,
			apellido: $scope.apellido,
			email: $scope.email,
			password: $scope.password,
			usuario: $scope.usuario,
			entidad: $scope.entidad
		};
		userFactory.newUser(formData, function(data){
			console.log(data);
		})
	};

});
