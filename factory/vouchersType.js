/**
 * Created by Artiom on 12/06/14.
 */

myapp.factory('vouchersFactory', ['$http', function($http){
	var factory = {};

	factory.getVouchersType = function(terminal, callback){
		var inserturl = serverUrl + '/voucherTypes/' + terminal;
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	return factory;
}]);
