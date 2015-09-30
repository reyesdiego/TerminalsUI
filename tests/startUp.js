/**
 * Created by artiom on 30/09/15.
 */

describe('inicio de la aplicación', function(){

	beforeEach(module('myapp'));

	it('terminales definidas', inject(['$rootScope', function($rootScope){
		expect($rootScope.listaTerminales).toBeDefined();
		expect($rootScope.listaTerminales.length).toBe(3);
	}]))

});