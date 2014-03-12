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

	return factory;

});

myapp.factory('invoiceFactory', function($http, $templateCache, utils){
	var factory = {};

	/*var invoices =
		$http({
			method: 'GET',
			url: inserturl,
			cache: $templateCache,
			headers:
			{token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InJleWVzZGllZ29AaG90bWFpbC5jb20ifQ.hpgNN2-eae3CPYvZFupIHctKW9ZWwLwvVA7HiFsr2rA'}
		}).success(function(data) {
				console.log('Llego a los datos');
				return data;
			}).error(function() {
				console.log("Error al cargar la lista Invoice");
			});

	factory.all = function(){
		console.log('llego');
		return invoices;
	};

	factory.get = function (id) {
		return invoices.then(function(){
			return utils.findById(invoices, id)
		})
	};*/

	factory.getInvoice = function(page, callback) {
		var inserturl = serverUrl + '/invoices/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			//cache: $templateCache,
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
	}

	return factory;

});

myapp.factory('utils', function(){
	return{
		findById: function findById(a, id){
			for (var i = 0; i < a.length; i++) {
				if (a[i]._id == id) return a[i];
			}
			return null;
		}
	};
});