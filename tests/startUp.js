/**
 * Created by artiom on 30/09/15.
 */

describe('inicio de la aplicación', function(){

	var loginService, $httpBackend, $rootScope;
	beforeEach(module('myapp'));
	beforeEach(inject(function(_loginService_){
		loginService = _loginService_;
	}));
	beforeEach(inject(function($injector) {
		// Set up the mock http service responses
		$httpBackend = $injector.get('$httpBackend');
		// backend definition common for all tests
		$httpBackend.whenGET('view/login.html')
			.respond(200);
		// Get hold of a scope (i.e. the root scope)
		$rootScope = $injector.get('$rootScope');
	}));

	it('terminales definidas', function(){
		expect($rootScope.listaTerminales).toBeDefined();
		expect($rootScope.listaTerminales.length).toBe(3);
	});

	it('al iniciar por primera vez no debe haber usuario logueado', function(){
		expect(loginService.getStatus()).toBeFalsy();
	});

	it('prueba el ruteo de la aplicación', inject(['$state', '$rootScope', '$location', function($state, $rootScope, $location){


		$rootScope.$apply(function(){
			$state.transitionTo('login');
		});

		console.log($state.current);
		//expect($state.current.templateUrl).toBe("view/login.html");
	}]));

});