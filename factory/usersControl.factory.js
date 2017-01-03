/**
 * Created by leo on 02/02/15.
 */

myapp.factory('ctrlUsersFactory', ['$http', 'APP_CONFIG', function($http, APP_CONFIG){

	class ctrlUsersFactory {

		getUsers(callback){
			const inserturl = `${APP_CONFIG.SERVER_URL}/agp/accounts`;
			$http.get(inserturl).then((response) => {
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

		setAccess(id, acceso, callback){
			const inserturl = `${APP_CONFIG.SERVER_URL}/agp/account/${id}/tasks`;
			$http.put(inserturl, acceso).then((response) => {
				callback(response.data);
			}).catch((response) => {
				callback(response.data);
			});
		}

		setNotifications(id, notif, callback){
			const inserturl = `${APP_CONFIG.SERVER_URL}/agp/account/${id}/emailToApp`;
			$http.put(inserturl, notif).then((response) => {
				callback(response.data);
			}).catch((response) => {
				callback(response.data);
			});
		}
	}

	return new ctrlUsersFactory();
}]);