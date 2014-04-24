/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('controlPanelFactory', function($http){
	var factory = {};

	factory.getByDay = function(dia, callback){
		//var inserturl = serverUrl + '/controlDia/' + dia; // El que realmente se va a usar
		var inserturl = 'mocks/controlday.json';
		$http.get(inserturl)
			.success(function(data){
				callback(data);
			}).error(function(){
				console.log('Error al cargar lista por día')
			});
	};

	return factory;
});