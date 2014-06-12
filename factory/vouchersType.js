/**
 * Created by Artiom on 12/06/14.
 */
myapp.factory('vouchersFactory', function($http){
	var factory = {};

	factory.getVouchersArray = function(callback){
		"use strict";
		var inserturl = serverUrl + '/voucherTypes?type=array';

		$http({
			method: 'GET',
			url: inserturl
		}).success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
		});
	};

	factory.getVouchersType = function(callback){
		"use strict";
		var inserturl = serverUrl + '/voucherTypes';

		$http({
			method: 'GET',
			url: inserturl
		}).success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
			});
	};

	return factory;
});
