/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('controlPanelFactory', function($http, $dialogs){
	var factory = {};

	factory.getByDay = function(dia, callback){
		//var inserturl = serverUrl + '/controlDia/' + dia; // El que realmente se va a usar
		var inserturl = 'mocks/controlday.json';
		$http.get(inserturl)
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				$dialogs.error('Error al cargar lista por día');
			});
	};

	factory.getTotales = function(fecha, callback){
		//Por ahora trabaja solo con un mock
		var inserturl = serverUrl + '/aggregate';
		$http.get(inserturl)
//		$http.get('mocks/totales.json')
			.success(function (data){
				callback(data.data);
			}).error(function(errorText){
				console.log(errorText);
				$dialogs.error('Error al cargar la lista PriceList');
			});

	};

	factory.getFacturasMeses = function(callback){
			$http.get('mocks/mesesFacturas.json')
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				$dialogs.error('Error al cargar la lista PriceList');
			});

	}

	factory.getGatesMeses = function(callback){
		$http.get('mocks/mesesGates.json')
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				$dialogs.error('Error al cargar la lista PriceList');
			});

	}

	factory.getTurnosMeses = function(callback){
		$http.get('mocks/mesesTurnos.json')
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				$dialogs.error('Error al cargar la lista PriceList');
			});

	}

	return factory;
});