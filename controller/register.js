/**
 * Created by artiom on 29/01/15.
 */

myapp.controller('registerCtrl', function ($scope, dialogs, userFactory, $state) {

	$scope.nombre = '';
	$scope.apellido = '';
	$scope.email = '';
	$scope.password = '';
	$scope.usuario = '';
	$scope.confirmPassword = '';
	$scope.confirmEmail = '';

	$scope.entidad = '';
	$scope.role = '';
	$scope.terminal = '';

	$scope.validEmail = false;
	$scope.disableForm = true;

	$scope.$watch('[nombre, apellido]', function(){
		if ($scope.nombre != '' && $scope.apellido != ''){
			$scope.usuario = ($scope.apellido + '-' + $scope.nombre.substr(0, 1)).toLowerCase();
		}
	}, true);

	$scope.$watch('[email,entidad]', function(){
		if ($scope.entidad != ''){
			$scope.disableForm = false;
		}
		var expr = new RegExp("^([a-zA-Z0-9_\\.\\-])+\\@(" + $scope.entidad + ")\\.([a-zA-Z0-9]{2,4})+(\\.[a-zA-Z]{2})?$");
		//var expr = /^([a-zA-Z0-9_\.\-])+\@(bactssa|trp|apmterminals|puertobuenosaires)\.([a-zA-Z0-9]{2,4})+(\.[a-zA-Z]{2})?$/;
		$scope.validEmail = expr.test($scope.email);
		if ($scope.entidad == 'puertobuenosaires'){
			$scope.role = 'agp';
			$scope.terminal = 'AGP'
		} else {
			$scope.role = 'terminal';
			$scope.terminal = $scope.entidad.toUpperCase();
		}
		if ($scope.entidad == 'apmterminals'){
			$scope.terminal = 'TERMINAL4';
		}
	}, true);

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
			lastname: $scope.apellido,
			firstname: $scope.nombre,
			full_name: $scope.nombre + ' ' + $scope.apellido,
			email: $scope.email,
			password: $scope.password,
			user: $scope.usuario,
			role: $scope.role,
			terminal: $scope.terminal
		};
		userFactory.newUser(formData, function(data){
			if (data.status == 'OK'){
				var dl = dialogs.notify('Registro', 'El usuario ' + $scope.usuario + ' ha sido registrado exitosamente. En breve recibirá un mail en la cuenta ' + $scope.email + ' para poder habilitarlo.');
				dl.result.then(function(){
					$state.transitionTo('login');
				})
			} else {
				console.log(data);
				dialogs.error('Registro', data.data);
			}
		})
	};

});
