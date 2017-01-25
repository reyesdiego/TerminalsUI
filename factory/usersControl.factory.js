/**
 * Created by leo on 02/02/15.
 */

myapp.factory('ctrlUsersFactory', ['$http', 'APP_CONFIG', 'User', function($http, APP_CONFIG, User){

	class ctrlUsersFactory {

		retrieveUsers(usersData){
			let usersArray = [];
			for (let user of usersData){
				usersArray.push(new User(user));
			}
			return usersArray;
		}

		getUsers(callback){
			const inserturl = `${APP_CONFIG.SERVER_URL}/agp/accounts`;
			$http.get(inserturl).then((response) => {
				response.data.data = this.retrieveUsers(response.data.data);
				callback(response.data);
			}).catch((response) => {
				callback(response.data);
			});
		}

		userEnabled(id, callback) {
			const inserturl = `${APP_CONFIG.SERVER_URL}/agp/account/${id}/enable`;
			$http.put(inserturl).then((response) => {
				callback(response.data);
			}).catch((response) => {
				callback(response.data);
			});
		}

		userDisabled(id, callback) {
			const inserturl = `${APP_CONFIG.SERVER_URL}/agp/account/${id}/disable`;
			$http.put(inserturl).then((response) => {
				callback(response.data);
			}).catch((response) => {
				callback(response.data);
			});
		}

		getRoutes(callback){
			const inserturl = `${APP_CONFIG.SERVER_URL}/tasks`;
			$http.get(inserturl).then((response) => {
				callback(response.data);
			}).catch((response) => {
				callback(response.data);
			});
		}
	}

	return new ctrlUsersFactory();
}]);