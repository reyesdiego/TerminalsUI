/**
 * Created by artiom on 29/09/15.
 */

describe('login del usuario', function(){

	var $httpBackend, $rootScope;
	var scope, loginCtrl, authFactory;
	beforeEach(module('myapp'));
	beforeEach(inject(function($injector, _authFactory_) {
		authFactory = _authFactory_;
		// Set up the mock http service responses
		$httpBackend = $injector.get('$httpBackend');
		// backend definition common for all tests
		$httpBackend.whenGET('view/login.html')
			.respond(200);
		// Get hold of a scope (i.e. the root scope)
		$rootScope = $injector.get('$rootScope');
		var $controller = $injector.get('$controller');
		scope = $rootScope.$new();
		loginCtrl = $controller('loginCtrl', {
			$scope: scope
		});
	}));

	it('asegurar que esté definido el loginCtl', function(){
		expect(loginCtrl).toBeDefined();
	});

	it('asegurar que el $scope defina un nombre de usuario y un password', function(){
		expect(scope.email).toBeDefined();
		expect(scope.password).toBeDefined();
	});

	it('confirma que se haga la llamada con los parámetros correctos', inject(function(_userFactory_){

		var userFactory = _userFactory_;

		spyOn(userFactory, 'login');

		authFactory.login('usuario', 'pass');

		expect(userFactory.login).toHaveBeenCalledWith( {email: 'usuario', password: 'pass'}, jasmine.anything());
	}));

	it('confirma llamada al servicio http', function(){

		$httpBackend.expectPOST('http://terminales.puertobuenosaires.gob.ar:8090/login')
			.respond(200, {status: "OK", data: { token: "askdjsgvdkjaghsvkuv" } });

		authFactory.login('usuario', 'pass')
			.then(function(data){
				expect(data.status).toBe('OK');
				expect(data.data.token).toBeDefined();
			});

		$httpBackend.flush();
	})

});
