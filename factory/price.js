/**
 * Created by gutierrez-g on 18/02/14.
 */
myapp.factory('priceFactory', function($http){
	var factory = {};
	factory.getPrice = function(cn) {
		$http.get('price.json')
			.success(function (data){
				cn(data);
			}).error(function(){
				console.log("Error al cargar la lista PriceList")
			});
	};
	return factory;
});