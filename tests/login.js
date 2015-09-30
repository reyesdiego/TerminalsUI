/**
 * Created by artiom on 29/09/15.
 */

describe('login del usuario', function(){

	var scope, loginCtrl;
	beforeEach(module('myapp'));
	beforeEach(inject(function($controller, $rootScope){
		scope = $rootScope.$new();
		loginCtrl = $controller('loginCtrl', {
			$scope: scope
		});
	}));

	it('asegurar que esté definido el loginCtl', function(){
		expect(loginCtrl).toBeDefined();
	});

	it('asegurar que el $scope defina un nombre de usuario y un password', function(){

	})

});
