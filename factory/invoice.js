/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('invoiceFactory', function($http, loginService, formatDate){
	var factory = {};

	factory.getInvoice = function(page, callback) {
		var inserturl = serverUrl + '/invoices/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data) {
			console.log(data);
			callback(data);
		}).error(function(response) {
			console.log(response);
			console.log("Error al cargar la lista Invoice");
		});
	};

	factory.getInvoiceByContainer = function(container, page, callback) {
		//var inserturl = serverUrl + '/invoices?contenedor=' + container; // El que se va a usar
		var inserturl = serverUrl + '/invoices/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data) {
			console.log(data);
			callback(data);
		}).error(function(response) {
			console.log(response);
			console.log("Error al cargar la lista Invoice");
		});
	};

	factory.getByDate = function(desde, hasta, terminal, callback) {
		//Por ahora trabaja solo con un mock
		$http.get('mocks/correlativo.json')
			.success(function (data){
				callback(data);
			}).error(function(){
				console.log("Error al cargar la lista PriceList")
			});
	};

	factory.getSinTasaCargas = function(desde, hasta, terminal, callback){
		"use strict";
		$http.get('mocks/correlativo.json')
			.success(function (data){
				callback(data);
			}).error(function(){
				console.log("Error al cargar la lista PriceList")
			});
	};

	factory.searchInvoice = function(datos, page, callback){
		var inserturl = serverUrl + '/invoices/' + page.skip + '/' + page.limit + '?'; // El que se va a usar
		var insertAux = inserturl;
		if(angular.isDefined(datos.nroComprobante)){
			inserturl = inserturl + 'nroComprobante=' + datos.nroComprobante;
		}
		if(angular.isDefined(datos.razonSocial)){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'razonSocial=' + datos.razonSocial;
		}
		if(angular.isDefined(datos.documentoCliente)){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'documentoCliente=' + datos.documentoCliente;
		}
		if(angular.isDefined(datos.fecha) && datos.fecha != null){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'fechaInicio=' + formatDate.formatearFecha(datos.fecha);
			var fechaFin = new Date(datos.fecha);
			fechaFin.setDate(fechaFin.getDate() + 1);
			inserturl = inserturl + '&fechaFin=' + formatDate.formatearFecha(fechaFin);
		}
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data) {
			console.log(data);
			callback(data);
		}).error(function(response) {
			console.log(response);
			console.log("Error al buscar Invoice");
		});
	};

	return factory;

});