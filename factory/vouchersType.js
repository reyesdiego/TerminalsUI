/**
 * Created by Artiom on 12/06/14.
 */

myapp.factory('vouchersFactory', ['$http', 'APP_CONFIG', function($http, APP_CONFIG){
	var factory = {};

	factory.getVouchersType = function(terminal, callback){
		var inserturl = APP_CONFIG.SERVER_URL + '/voucherTypes/' + terminal;
		$http.get(inserturl)
			.then(function (response){
				callback(response.data);
			}, function(response){
				callback(response.data);
			});
	};

	return factory;
}]);
