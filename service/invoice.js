/**
 * Created by artiom on 16/07/15.
 */

myapp.service('invoiceService', ['invoiceFactory', 'downloadFactory', '$q', '$filter', 'generalCache', '$modal', 'loginService', function (invoiceFactory, downloadFactory, $q, $filter, generalCache, $modal, loginService) {


	var estadosComprobantes = generalCache.get('estados');


	var internalCheckComprobantes = function(comprobante, comprobantesVistos, datosInvoices){
		var encontrado = false;
		comprobantesVistos.forEach(function(unComprobante){
			if (unComprobante._id == comprobante._id){
				encontrado = true;
				unComprobante.interfazEstado = comprobante.interfazEstado;
			}
		});
		datosInvoices.forEach(function(otroComprobante){
			if (otroComprobante._id == comprobante._id){
				otroComprobante.interfazEstado = comprobante.interfazEstado;
			}
		});
		if (!encontrado){
			comprobantesVistos.push(comprobante);
		}

		return {
			datosInvoices: datosInvoices,
			comprobantesVistos: comprobantesVistos
		};
	};

	this.checkComprobantes = function(comprobante, comprobantesVistos, datosInvoices){
		return internalCheckComprobantes(comprobante, comprobantesVistos, datosInvoices);
	};

	this.existeDescripcion = function(itemId){
		var itemsDescription = generalCache.get('descripciones');
		return angular.isDefined(itemsDescription[itemId]);
	};

	this.mostrarDetalle = function(comprobanteId, comprobantesVistos, datosInvoices) {
		var deferred = $q.defer();
		invoiceFactory.getInvoiceById(comprobanteId, function (comprobDetalle) {
			var response = {
				detalle: comprobDetalle
			};
			response.noMatch = controlarTarifas(comprobDetalle);
			var checkResult = internalCheckComprobantes(comprobDetalle, comprobantesVistos, datosInvoices);
			response.datosInvoices = checkResult.datosInvoices;
			response.comprobantesVistos = checkResult.comprobantesVistos;
			deferred.resolve(response);

		});
		return deferred.promise;
	};

	var controlarTarifas = function(comprobante){

		var matchesTerminal = generalCache.get('matches');
		var tasaCargasTerminal = generalCache.get('ratesMatches');

		var valorTomado;
		var tarifaError;

		var precioALaFecha;
		var monedaALaFecha;

		comprobante.controlTarifas = [];
		comprobante.interfazLiquidada = '';
		var lookup = {};
		for (var i = 0, len = matchesTerminal.length; i < len; i++) {
			lookup[matchesTerminal[i].code] = matchesTerminal[i];
		}

		var response = false;
		comprobante.noMatch = false;

		comprobante.detalle.forEach(function(detalle){
			detalle.items.forEach(function(item){
				if (angular.isDefined(lookup[item.id])){
					valorTomado = item.impUnit;
					lookup[item.id].topPrices.forEach(function(precioMatch){
						if (comprobante.fecha.emision > precioMatch.from){
							precioALaFecha = precioMatch.price;
							monedaALaFecha = precioMatch.currency
						}
					});
					if (monedaALaFecha != 'DOL'){
						valorTomado = item.impUnit * comprobante.cotiMoneda
					}
					if (tasaCargasTerminal.indexOf(item.id) >= 0){
						if (angular.isDefined(comprobante.payment)){
							comprobante.interfazLiquidada = 'comprobanteLiquidado';
						} else {
							comprobante.interfazLiquidada = 'comprobanteSinLiquidar';
						}
						if (valorTomado != precioALaFecha){
							tarifaError = {
								codigo: item.id,
								currency: monedaALaFecha,
								topPrice: precioALaFecha,
								current: item.impUnit,
								container: detalle.contenedor
							};
							comprobante.controlTarifas.push(tarifaError);
						}
					} else {
						if (valorTomado > precioALaFecha){
							tarifaError = {
								codigo: item.id,
								currency: monedaALaFecha,
								topPrice: precioALaFecha,
								current: item.impUnit,
								container: detalle.contenedor
							};
							comprobante.controlTarifas.push(tarifaError);
						}
					}
				} else {
					response = true;
					comprobante.noMatch = true;
				}
			});
		});
		return response;
	};


	this.chequearTarifas = function(comprobante, comprobantesControlados){
		var response = {
			noMatch: false,
			retValue: null
		};
		if (angular.isDefined(comprobantesControlados[comprobante._id])){
			comprobante.noMatch = comprobantesControlados[comprobante._id].codigos;
			comprobante.interfazLiquidada = comprobantesControlados[comprobante._id].liquidada;
			response.retValue = comprobantesControlados[comprobante._id].tarifas;
		} else {
			response.noMatch = controlarTarifas(comprobante);
			comprobantesControlados[comprobante._id] = {
				tarifas: (comprobante.controlTarifas.length > 0),
				codigos: comprobante.noMatch,
				liquidada: comprobante.interfazLiquidada
			};
			response.retValue = comprobante.controlTarifas.length > 0;
		}
		response.data = comprobantesControlados;
		return response;
	};

	this.trackInvoice = function(comprobante){
		var deferred = $q.defer();
		var estado;
		var message;
		estado = comprobante.interfazEstado;
		invoiceFactory.getTrackInvoice(comprobante._id, function(dataTrack){
			if (dataTrack.status == 'OK'){
				var modalInstance = $modal.open({
					templateUrl: 'view/trackingInvoice.html',
					controller: 'trackingInvoiceCtrl',
					backdrop: 'static',
					resolve: {
						estado: function () {
							return estado;
						},
						track: function() {
							return dataTrack;
						},
						states : function() {
							return angular.copy(estadosComprobantes);
						}
					}
				});

				dataTrack = [];
				modalInstance.result.then(function (dataComment) {
					invoiceFactory.putCambiarEstado(comprobante._id, dataComment.newState._id, function(){
						var logInvoice = {
							title: dataComment.title,
							state: dataComment.newState._id,
							comment: dataComment.comment,
							invoice: comprobante._id
						};
						invoiceFactory.postCommentInvoice(logInvoice, function(dataRes){
							if (dataRes.status == 'OK'){
								comprobante.interfazEstado = dataComment.newState;
								switch (dataComment.newState.type){
									case 'WARN':
										comprobante.interfazEstado.btnEstado = 'text-warning';
										break;
									case 'OK':
										comprobante.interfazEstado.btnEstado = 'text-success';
										break;
									case 'ERROR':
										comprobante.interfazEstado.btnEstado = 'text-danger';
										break;
									case 'UNKNOWN':
										comprobante.interfazEstado.btnEstado = 'text-info';
										break;
								}
								var nuevoEstado = {
									_id: comprobante._id,
									estado: dataComment.newState,
									grupo: loginService.getGroup(),
									user: loginService.getInfo().user
								};
								comprobante.estado.push(nuevoEstado);
								deferred.resolve(comprobante);
							} else {
								message = 'Se ha producido un error al agregar el comentario en el comprobante.';
								deferred.reject(message);
							}
						});
					});
				}, function(){
					deferred.resolve();
				});
			} else {
				message = 'Se ha producido un error al cargar los comentarios del comprobante';
				deferred.reject(message);
				//dialogs.error('Comprobantes', 'Se ha producido un error al cargar los comentarios del comprobante');
			}
		});
		return deferred.promise;
	};

	this.verPdf = function(invoice){
		//$scope.disablePdf = true;
		var deferred = $q.defer();
		var imprimirComprobante = {};
		angular.copy(invoice, imprimirComprobante);
		imprimirComprobante.codTipoComprob = $filter('nombreComprobante')(imprimirComprobante.codTipoComprob);
		imprimirComprobante.fecha.emision = $filter('date')(imprimirComprobante.fecha.emision, 'dd/MM/yyyy', 'UTC');
		imprimirComprobante.fecha.vcto = $filter('date')(imprimirComprobante.fecha.vcto, 'dd/MM/yyyy', 'UTC');
		imprimirComprobante.fecha.desde = $filter('date')(imprimirComprobante.fecha.desde, 'dd/MM/yyyy', 'UTC');
		imprimirComprobante.fecha.hasta = $filter('date')(imprimirComprobante.fecha.hasta, 'dd/MM/yyyy', 'UTC');
		imprimirComprobante.detalle.forEach(function(detalle){
			detalle.buque.fecha = $filter('date')(detalle.buque.fecha, 'dd/MM/yyyy', 'UTC');
		});
		downloadFactory.invoicePDF(imprimirComprobante, function(data, status){
			if (status == 'OK'){
				var file = new Blob([data], {type: 'application/pdf'});
				var fileURL = URL.createObjectURL(file);
				window.open(fileURL);
				deferred.resolve();
			} else {
				deferred.reject();
				//dialogs.error('Comprobantes', 'Se ha producido un error al procesar el comprobante');
			}
		});
		return deferred.promise;
	};

}]);