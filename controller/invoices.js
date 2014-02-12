/**
 * Created by Diego Reyes on 2/3/14.
 */

function invoicesCtrl ($scope, $http, $templateCache) {
	'use strict';

//	$scope.invoices = Booking.reviews({token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InJleWVzZGllZ29AaG90bWFpbC5jb20ifQ.hpgNN2-eae3CPYvZFupIHctKW9ZWwLwvVA7HiFsr2rA'});
	var inserturl = serverUrl + '/invoices';
	$http({
		method: 'GET',
		url: inserturl,
		cache: $templateCache,
		headers:
			{token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InJleWVzZGllZ29AaG90bWFpbC5jb20ifQ.hpgNN2-eae3CPYvZFupIHctKW9ZWwLwvVA7HiFsr2rA'}
	}).success(function(data) {
			console.log("success");
			$scope.invoices = data;
		}).error(function(response) {
			console.log("error");
		});

}
