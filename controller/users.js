/**
 * Created by leo on 02/02/15.
 */
(function(){
	myapp.controller('usersCtrl', function($scope, ctrlUsersFactory) {
		ctrlUsersFactory.getUsers(function(data) {
			$scope.datosUsers = data.data;
			console.log(data);
		})
	})
})();