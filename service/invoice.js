/**
 * Created by artiom on 16/07/15.
 */

myapp.service('invoiceService', ['invoiceFactory', 'downloadFactory', '$q', '$filter', 'generalCache', '$modal', 'loginService',
	function (invoiceFactory, downloadFactory, $q, $filter, generalCache, $modal, loginService) {

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
			var itemsDescription = generalCache.get('descripciones' + loginService.getFiltro());
			return angular.isDefined(itemsDescription[itemId]);
		};

		this.mostrarDetalle = function(comprobanteId, comprobantesVistos, datosInvoices) {
			var deferred = $q.defer();
			invoiceFactory.getInvoiceById(comprobanteId, function (comprobDetalle) {
				var response = {
					detalle: comprobDetalle,
					commentsInvoice: []
				};
				response.noMatch = controlarTarifas(comprobDetalle);
				var checkResult = internalCheckComprobantes(comprobDetalle, comprobantesVistos, datosInvoices);
				response.datosInvoices = checkResult.datosInvoices;
				response.comprobantesVistos = checkResult.comprobantesVistos;

				invoiceFactory.getTrackInvoice(comprobanteId, function(dataTrack){
					if (dataTrack.status == 'OK'){
						dataTrack.data.forEach(function(comment){
							if (comment.group == loginService.getGroup()){
								response.commentsInvoice.push(comment);
							}
						});
					}
					deferred.resolve(response);
				});
			});
			return deferred.promise;
		};

		var controlarTarifas = function(comprobante){

			var matchesTerminal = generalCache.get('matches' + loginService.getFiltro());
			var tasaCargasTerminal = generalCache.get('ratesMatches' + loginService.getFiltro());

			var valorTomado;
			var tarifaError;

			var precioALaFecha;
			var monedaALaFecha;

			comprobante.controlTarifas = [];
			comprobante.tarifasSinMatch = [];
			comprobante.interfazLiquidada = '';
			comprobante.tieneTasa = false;
			var lookup = {};
			for (var i = 0, len = matchesTerminal.length; i < len; i++) {
				lookup[matchesTerminal[i].code] = matchesTerminal[i];
			}

			var response = false;
			var precioEncontrado = false;
			comprobante.noMatch = false;

			if (angular.isDefined(comprobante.detalle)){
				comprobante.detalle.forEach(function(detalle){
					detalle.items.forEach(function(item){
						precioEncontrado = false;
						if (angular.isDefined(lookup[item.id])){
							valorTomado = item.impUnit;
							lookup[item.id].topPrices.forEach(function(precioMatch){
								if (comprobante.fecha.emision >= precioMatch.from){
									precioEncontrado = true;
									precioALaFecha = precioMatch.price;
									monedaALaFecha = precioMatch.currency
								}
							});
							if (monedaALaFecha != 'DOL'){
								valorTomado = item.impUnit * comprobante.cotiMoneda
							}
							if (tasaCargasTerminal.indexOf(item.id) >= 0){
								comprobante.tieneTasa = true;
								if (angular.isDefined(comprobante.payment) && comprobante.payment != null){
									if (angular.isDefined(comprobante.payment.number)){
										comprobante.interfazLiquidada = 'text-success';
									} else {
										comprobante.interfazLiquidada = 'text-warning';
									}
								} else {
									comprobante.interfazLiquidada = 'text-danger';
								}
								if (precioEncontrado){
									if (valorTomado != precioALaFecha){
										tarifaError = {
											codigo: item.id,
											currency: monedaALaFecha,
											topPrice: precioALaFecha,
											current: item.impUnit,
											topPrices: lookup[item.id].topPrices,
											emision: comprobante.fecha.emision,
											container: detalle.contenedor
										};
										comprobante.controlTarifas.push(tarifaError);
									}
								} else {
									tarifaError = {
										codigo: item.id,
										tieneMatch: true,
										topPrices: lookup[item.id].topPrices,
										emision: comprobante.fecha.emision,
										container: detalle.contenedor
									};
									comprobante.tarifasSinMatch.push(tarifaError);
									response = true;
									comprobante.noMatch = true;
								}
							} else {
								if (precioEncontrado){
									if (valorTomado > precioALaFecha){
										tarifaError = {
											codigo: item.id,
											currency: monedaALaFecha,
											topPrice: precioALaFecha,
											current: item.impUnit,
											topPrices: lookup[item.id].topPrices,
											emision: comprobante.fecha.emision,
											container: detalle.contenedor
										};
										comprobante.controlTarifas.push(tarifaError);
									}
								} else {
									tarifaError = {
										codigo: item.id,
										tieneMatch: true,
										topPrices: lookup[item.id].topPrices,
										emision: comprobante.fecha.emision,
										container: detalle.contenedor
									};
									comprobante.tarifasSinMatch.push(tarifaError);
									response = true;
									comprobante.noMatch = true;
								}
							}
						} else {
							tarifaError = {
								codigo: item.id,
								tieneMatch: false,
								topPrices: [],
								emision: comprobante.fecha.emision,
								container: detalle.contenedor
							};
							comprobante.tarifasSinMatch.push(tarifaError);
							response = true;
							comprobante.noMatch = true;
						}
					});
				});
			}
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
				comprobante.tieneTasa = comprobantesControlados[comprobante._id].tieneTasa;
				response.retValue = comprobantesControlados[comprobante._id].tarifas;
			} else {
				response.noMatch = controlarTarifas(comprobante);
				comprobantesControlados[comprobante._id] = {
					tarifas: (comprobante.controlTarifas.length > 0),
					codigos: comprobante.noMatch,
					liquidada: comprobante.interfazLiquidada,
					tieneTasa: comprobante.tieneTasa
				};
				response.retValue = comprobante.controlTarifas.length > 0;
			}
			response.data = comprobantesControlados;
			return response;
		};

		var setResend = function(resend, comprobante){
			var deferred = $q.defer();
			var message;
			var data = {
				resend: resend
			};
			invoiceFactory.setResendInvoice(data, comprobante._id, function(data){
				if (data.status == 'OK'){
					comprobante.resend = resend;
					deferred.resolve()
				} else {
					message = 'Se ha producido un error al establecer el estado del comprobante.';
					deferred.reject(message);
				}
			});
			return deferred.promise;
		};

		var ponerComentario = function(dataComment, logInvoice, comprobante){
			var deferred = $q.defer();
			var message;
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
					deferred.resolve();
				} else {
					message = 'Se ha producido un error al agregar el comentario en el comprobante.';
					deferred.reject(message);
				}
			});
			return deferred.promise;
		};

		var cambiarEstado = function(comprobanteId, nuevoEstado){
			var deferred = $q.defer();
			invoiceFactory.putCambiarEstado(comprobanteId, nuevoEstado, function(data, status) {
				if (status == 'OK'){
					deferred.resolve();
				} else {
					deferred.reject(data);
				}
			});
			return deferred.promise;
		};

		this.trackInvoice = function(comprobante){
			var deferred = $q.defer();
			var estado;
			var message;
			if (!angular.isDefined(comprobante.resend)) comprobante.resend = 0;
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
							},
							resend: function() {
								return comprobante.resend;
							}
						}
					});
					dataTrack = [];
					modalInstance.result.then(function (dataComment) {
						var logInvoice = {
							title: dataComment.title,
							state: dataComment.newState._id,
							comment: dataComment.comment,
							invoice: comprobante._id
						};
						var llamadas = [];
						if (dataComment.setState){
							llamadas.push(cambiarEstado(comprobante._id, dataComment.newState._id));
							llamadas.push(ponerComentario(dataComment, logInvoice, comprobante));
						}
						if (dataComment.setResend){
							llamadas.push(setResend(dataComment.resend, comprobante));
						}
						$q.all(llamadas)
							.then(function(){
								deferred.resolve(comprobante);
							}, function(error){
								console.log(error);
								deferred.reject(error);
							});
					}, function(){
						deferred.resolve();
					});
				} else {
					message = 'Se ha producido un error al cargar los comentarios del comprobante';
					deferred.reject(message);
				}
			});
			return deferred.promise;
		};

		this.verPdf = function(invoice){
			//$scope.disablePdf = true;
			var deferred = $q.defer();
			var imprimirComprobante = {};
			var nombreReporte = $filter('nombreComprobante')(invoice.codTipoComprob, true) + invoice.nroComprob + '_' + loginService.getFiltro() + '.pdf';
			angular.copy(invoice, imprimirComprobante);
			imprimirComprobante.codTipoComprob = $filter('nombreComprobante')(imprimirComprobante.codTipoComprob, false);
			imprimirComprobante.fecha.emision = $filter('date')(imprimirComprobante.fecha.emision, 'dd/MM/yyyy', 'UTC');
			imprimirComprobante.fecha.vcto = $filter('date')(imprimirComprobante.fecha.vcto, 'dd/MM/yyyy', 'UTC');
			imprimirComprobante.fecha.desde = $filter('date')(imprimirComprobante.fecha.desde, 'dd/MM/yyyy', 'UTC');
			imprimirComprobante.fecha.hasta = $filter('date')(imprimirComprobante.fecha.hasta, 'dd/MM/yyyy', 'UTC');
			imprimirComprobante.detalle.forEach(function(detalle){
				detalle.buque.fecha = $filter('date')(detalle.buque.fecha, 'dd/MM/yyyy', 'UTC');
			});
			downloadFactory.convertToPdf(imprimirComprobante, 'invoiceToPdf', function(data, status){
				if (status == 'OK'){
					var file = new Blob([data], {type: 'application/pdf'});
					var fileURL = URL.createObjectURL(file);

					var anchor = angular.element('<a/>');
					anchor.css({display: 'none'}); // Make sure it's not visible
					angular.element(document.body).append(anchor); // Attach to document

					anchor.attr({
						href: fileURL,
						target: '_blank',
						download: nombreReporte
					})[0].click();

					anchor.remove(); // Clean it up afterwards
					//window.open(fileURL);
					deferred.resolve();
				} else {
					deferred.reject();
				}
			});
			return deferred.promise;
		};

	}]);