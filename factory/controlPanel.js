/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('controlPanelFactory', function($http, dialogs){
	var factory = {};

	factory.getByDay = function(dia, callback){
		var inserturl = serverUrl + '/aggregate?2014-05-20';
		$http.get(inserturl)
			.success(function(data){
				var result = [];
				if (data.status === 'OK'){
					var total = 0;
					for (var i = 0, len=data.data.length; i< len; i++){
						total += data.data[i].invoicesCount;
					}
					result = [
						{"invoicesCount": total}
					];
				}
				callback(result);

			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar lista por día');
			});
	};

	factory.getTotales = function(fecha, callback){
		var inserturl = serverUrl + '/aggregate';
		$http.get(inserturl)
			.success(function (data){
				callback(data.data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar la lista PriceList');
			});
	};

	factory.getFacturasMeses = function(mes, callback){
		$http.get('mocks/mesesFacturas.json')
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar la lista PriceList');
			});
	};

	factory.getGatesMeses = function(mes, callback){
		$http.get('mocks/mesesGates.json')
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar la lista PriceList');
			});
	};

	factory.getTurnosMeses = function(mes, callback){
		$http.get('mocks/mesesTurnos.json')
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar la lista PriceList');
			});
	};

	factory.getFacturadoPorDia = function(fecha, callback)
	{
		$http.get('mocks/facturadoDia.json')
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar la lista PriceList');
			});

	}
	return factory;
});