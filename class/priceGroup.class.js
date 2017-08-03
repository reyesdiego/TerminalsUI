/**
 * Created by kolesnikov-a on 01/08/2017.
 */
myapp.factory('PriceGroup', ['$http', '$q', 'APP_CONFIG', 'Price', 'loginService', function($http, $q, APP_CONFIG, Price, loginService){

	class PriceGroup {

		constructor(groupData){
			if (groupData){
				angular.extend(this, groupData);
			} else {
				this.emptyGroup();
			}
		}

		emptyGroup(){
			this.tarifas = [];
			this.idTarifas = [];
			this.nombre = 'Nuevo Grupo';
			this.terminal = loginService.filterTerminal;
		}

		addRate(rate){
			if (this.idTarifas.indexOf(rate._id) == -1){
				this.tarifas.push(rate);
				this.idTarifas.push(rate._id);
			}
		}

		guardar(){
			if (this.id){
				this.actualizar();
			} else {
				this.crearNuevo();
			}
		}

		actualizar(){
			console.log('acá un put o un pacth');
		}

		crearNuevo(){
			console.log('acá un post');
		}

	}

	return PriceGroup;

}]);