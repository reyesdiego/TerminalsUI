/**
 * Created by Artiom on 12/06/14.
 */

myapp.factory('vouchersFactory', ['$http', function($http){
	var factory = {};

	factory.getVouchersType = function(callback){
		var inserturl = serverUrl + '/voucherTypes';
		console.log('Cargo ruta: ' + inserturl);
		$http.get(inserturl)
			.success(function (data){
				console.log('OK ruta: ' + inserturl);
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	return factory;
}]);
