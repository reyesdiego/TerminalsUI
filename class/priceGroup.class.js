/**
 * Created by kolesnikov-a on 01/08/2017.
 */
myapp.factory('PriceGroup', ['$http', '$q', 'APP_CONFIG', 'Price', 'loginService', function($http, $q, APP_CONFIG, Price, loginService){

	class PriceGroup {

		constructor(groupData){
			this.tarifas = [];
			this.idTarifas = [];
			if (groupData){
				angular.extend(this, groupData);
			} else {
				this.emptyGroup();
			}
		}

		emptyGroup(){
			this._id = 'NEW';
			this.mov = '';
			this.description = 'Sin descripción';
		}

		get nombreGrupo(){
			return `${this._id} - ${this.description}`
		}

		addRate(rate){
			if (this.idTarifas.indexOf(rate._id) == -1){
				this.tarifas.push(rate);
				this.idTarifas.push(rate._id);
			}
		}

		removeRate(rateId){
			const indice = this.tarifas.findIndex((curr) => {
				return curr._id == rateId;
			});
			this.tarifas.splice(indice, 1);
			this.idTarifas.splice(indice, 1);
		}

		guardar(){
			const deferred = $q.defer();
			const inserturl = `${APP_CONFIG.SERVER_URL}/prices/header/add`;
			const body = {
				description: this.description
			};
			$http.post(inserturl, body).then(response => {
				this._id = response.data.data._id;
				deferred.resolve();
			}).catch(error => {
				deferred.reject();
			});
			return deferred.promise;
		}

		actualizar(){
			console.log('acá un put o un patch');
		}

		crearNuevo(){
			console.log('acá un post');
		}

	}

	return PriceGroup;

}]);