/**
 * Created by Artiom on 12/06/14.
 */
myapp.factory('vouchersFactory', function($http){
	var factory = {};

	factory.getVouchersArray = function(callback){
		var inserturl = serverUrl + '/voucherTypes?type=array';

		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(error){
				callback(error);
		});
	};

	factory.getVouchersType = function(callback){
		var inserturl = serverUrl + '/voucherTypes';

		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	return factory;
});
