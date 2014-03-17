/**
 * Created by gutierrez-g on 18/02/14.
 */
myapp.factory('priceFactory', function($http){
	var factory = {};

	factory.getPrice = function(callback) {
		var inserturl = serverUrl + '/agp/prices';
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(){
				console.log("Error al cargar la lista PriceList")
			});
	};

	factory.getMatchPrices = function(terminal, callback) {
		var inserturl = serverUrl + '/agp/matchprices/' + terminal;
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(){
				console.log("Error al cargar la lista PriceList")
			});
		};

	factory.addMatchPrice = function (data, callback) {
		var inserturl = serverUrl + '/agp/matchprice';
		$http({
			method: "POST",
			url: inserturl,
			data: JSON.stringify(data),
			headers:{"Content-Type":"application/json"}
		}).success(function (response) {
				console.log("success");
				callback(response);
			}).error(function () {
				console.log("error");
			});
	};

	factory.addPrice = function (data, callback) {
		var inserturl = serverUrl + '/agp/price';
		$http({
			method: 'POST',
			url: inserturl,
			data: data
		}).
			success(function(response) {
				console.log("success");
				callback(response);
			}).
			error(function(response) {
				console.log("error");
			});
	};

	/*factory.getPriceWithMatch = function(terminal){
		this.getPrice(function(price){
			var priceList = price;
			console.log(priceList);
		});
		this.getMatchPrices(terminal, function(match){
			var matchList = match;
			console.log(matchList);
		})
	}*/

	return factory;

});

myapp.factory('invoiceFactory', function($http){
	var factory = {};

	factory.getInvoice = function(page, callback) {
		var inserturl = serverUrl + '/invoices/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InJleWVzZGllZ29AaG90bWFpbC5jb20ifQ.hpgNN2-eae3CPYvZFupIHctKW9ZWwLwvVA7HiFsr2rA'}
		}).success(function(data) {
				callback(data);
			}).error(function(response) {
				console.log(response);
				console.log("Error al cargar la lista Invoice");
			});
	};

	factory.getByDate = function(page, desde, hasta, terminal, callback) {
		//Por ahora trabaja solo con un mock
		$http.get('correlativo.json')
			.success(function (data){
				callback(data);
			}).error(function(){
				console.log("Error al cargar la lista PriceList")
			});
	};

	return factory;

});

myapp.factory('controlFactory', function($http){
	var factory = {};

	factory.getByDay = function(dia, callback){
		//var inserturl = serverUrl + '/controldia/' + dia; // El que realmente se va a usar
		var inserturl = 'controlday.json';
		$http.get(inserturl)
			.success(function(data){
				callback(data);
			}).error(function(){
				console.log('Error al cargar lista por día')
			});
	};

	return factory;
});

myapp.factory('userService', function($http, $dialogs){
	var factory = {};

	factory.loginApp = function(user, pass, callback){
		"use strict";
		var formData = {
			"email": user,
			"password": pass
		};
		console.log(formData);
		var inserturl = serverUrl + '/login';
		$http({
			method: 'POST',
			url: inserturl,
			data: formData
		}).success(function(data) {
				console.log("success");
				callback(data)
			}).error(function(response) {
				console.log("error");
				$dialogs.error("Ha ocurrido un error al conectarse con el servidor, inténtelo nuevamente más tarde")
			});
	};

	return factory;
});