/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('controlPanelFactory', function($http, dialogs, formatDate){
	var factory = {};

	factory.getByDay = function(dia, callback){
		var inserturl = serverUrl + '/counts?fecha=' + dia;
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
		var inserturl = serverUrl + '/counts';
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

	//Método hecho para probar actualización en gráfico
	factory.getFacturasMeses2 = function(mes, callback){
		$http.get('mocks/mesesFacturas2.json')
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar la lista PriceList');
			});
	};
	//Borrar al tener terminado el original

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

	//A partir de la fecha pasada, devuelve la facturación por día, de la fecha y 4 fechas hacia atrás
	factory.getFacturadoPorDia = function(fecha, callback){
		var inserturl = serverUrl + '/countsByDate?fecha=' + formatDate.formatearFecha(fecha);
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar la lista PriceList');
			});

	}

	return factory;
});