/**
 * Created by leo on 02/02/15.
 */
(function(){
	myapp.controller('usersCtrl', function($scope, ctrlUsersFactory) {
		ctrlUsersFactory.getUsers(function(data) {
			if (data.status === 'OK'){
				$scope.datosUsers = data.data;
				console.log(data);
			}
		});

		$scope.convertirIdAFecha = function(id) {
			return idToDate(id);
		};

		$scope.cambiaUsuario = function(id, check) {
			if (check) {
				ctrlUsersFactory.userEnabled(id, function(data) {
					console.log(data);
				})
			} else {
				ctrlUsersFactory.userDisabled(id, function(data) {
					console.log(data);
				})
			}
		}
	})
})();