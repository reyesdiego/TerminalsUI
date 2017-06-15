/**
 * Created by Diego Reyes on 3/19/14.
 */

myapp.factory('controlPanelFactory', ['$http', 'formatService', 'loginService', '$q', 'HTTPCanceler', 'APP_CONFIG', 'downloadService',
	function($http, formatService, loginService, $q, HTTPCanceler, APP_CONFIG, downloadService){

		class controlPanelFactory {

			constructor(){
				this.namespace = 'control';
			}

			prepararDatosMes(datosGrafico, traerTotal){
				//Matriz base de los datos del gráfico, ver alternativa al hardcodeo de los nombres de las terminales
				let base = [
					['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ]
				];
				//Para cambiar entre columnas
				let contarTerminal = 1;
				//Para cargar promedio
				let acum = 0;
				const meses = ["01","02","03","04","05","06","07","08","09","10","11", "12"];
				//Los datos vienen en objetos que incluyen la fecha, la terminal, y la suma facturada(cnt)
				//ordenados por fecha, y siguiendo el orden de terminales "BACTSSA", "Terminal 4", "TRP"???????
				let flagPrimero = true;
				let fechaAnterior;
				let fila = ['', 0, 0, 0, 0, ''];
				datosGrafico.forEach((datosDia) => {
					if (flagPrimero){
						flagPrimero = false;
						fila[0] = meses[datosDia.month - 1] + '/' + datosDia.year;
						fechaAnterior = datosDia.month;
					}
					if (fechaAnterior != datosDia.month){
						//Al llegar a la tercer terminal cargo el promedio de ese día, meto la fila en la matriz y reseteo las columnas
						fila[4] = acum/3;
						base.push(fila.slice());
						//Meto la fila en la matriz y vuelvo a empezar
						fila = ['', 0, 0, 0, 0, ''];
						acum = 0;
						fechaAnterior = datosDia.month;
						fila[0] = meses[datosDia.month - 1] + '/' + datosDia.year;
					}
					switch (datosDia.terminal){
						case "BACTSSA":
						case "BACTSSA_OLD":
							contarTerminal = 1;
							break;
						case "TERMINAL4":
						case "TERMINAL4_OLD":
							contarTerminal = 2;
							break;
						case "TRP":
						case "TRP_OLD":
						case "TRP_X":
							contarTerminal = 3;
							break;
					}
					if (traerTotal){
						fila[contarTerminal] = datosDia.total;
						acum += datosDia.total;
					} else {
						fila[contarTerminal] += datosDia.cnt;
						acum += datosDia.cnt;
					}
				});
				fila[4] = acum/3;
				base.push(fila.slice());
				//Finalmente devuelvo la matriz generada con los datos para su asignación
				return base;
			}

			prepararDatosFacturadoDia(datosGrafico){
				//Matriz base de los datos del gráfico, ver alternativa al hardcodeo de los nombres de las terminales
				let base = [
					['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ]
				];
				//Para cambiar entre columnas
				let contarTerminal = 1;
				//Para cargar promedio
				let acum = 0;
				let fila = ['', 0, 0, 0, 0, ''];
				let flagPrimero = true;
				let fechaAnterior;
				//Los datos vienen en objetos que incluyen la fecha, la terminal, y la suma facturada(cnt)
				//ordenados por fecha
				datosGrafico.forEach((datosDia) => {
					if (flagPrimero){
						//Primera iteración, cargo el día y lo establezco como fecha para comparar
						fila[0] = datosDia.date.substr(0, 10).replace(/-/g, '/');
						fechaAnterior = datosDia.date;
						//fila[0] = datosDia._id.day + '/' + datosDia._id.month + '/' + datosDia._id.year;
						//fechaAnterior = datosDia._id.day;
						flagPrimero = false;
					}
					if (fechaAnterior != datosDia.date){
						//Al haber un cambio en la fecha cargo el promedio de ese día, avanzo una fila y reseteo las columnas
						fila[4] = acum/3;
						base.push(fila.slice());
						//Meto la fila en la matriz y vuelvo a empezar
						fila = ['', 0, 0, 0, 0, ''];
						fila[0] = datosDia.date.substr(0, 10).replace(/-/g, '/');
						fechaAnterior = datosDia.date;
						acum = 0;
					}
					switch (datosDia.terminal){
						case "BACTSSA":
							contarTerminal = 1;
							break;
						case "TERMINAL4":
							contarTerminal = 2;
							break;
						case "TRP":
							contarTerminal = 3;
							break;
					}
					fila[contarTerminal] = datosDia.total;
					acum += datosDia.total;
				});
				//Meto la última fila generada
				fila[4] = acum/3;
				base.push(fila.slice());
				//Finalmente devuelvo la matriz generada con los datos para su asignación
				return base;
			}

			prepararDatosGatesTurnosDia(datosGrafico){
				let matAux = [];
				matAux[0] = ['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ];
				for (let i = 0; i <= 23; i++){
					if (i<10){
						matAux[i+1] = ['0' + i, 0, 0, 0, 0, ''];
					}
					else {
						matAux[i+1] = [i, 0, 0, 0, 0, ''];
					}
				}
				datosGrafico.forEach((datosDia) => {
					if (datosDia._id){
						switch (datosDia._id.terminal){
							case "BACTSSA":
								matAux[datosDia._id.hour+1][1] = datosDia.cnt;
								break;
							case "TERMINAL4":
								matAux[datosDia._id.hour+1][2] = datosDia.cnt;
								break;
							case "TRP":
								matAux[datosDia._id.hour+1][3] = datosDia.cnt;
								break;
						}
					} else {
						switch (datosDia.terminal){
							case "BACTSSA":
								matAux[datosDia.hour+1][1] = datosDia.cnt;
								break;
							case "TERMINAL4":
								matAux[datosDia.hour+1][2] = datosDia.cnt;
								break;
							case "TRP":
								matAux[datosDia.hour+1][3] = datosDia.cnt;
								break;
						}
					}
				});
				for (let e = 0; e <= 23; e++){
					matAux[e+1][4] = (matAux[e+1][1] + matAux[e+1][2] + matAux[e+1][3]) / 3;
				}
				return matAux;
			}

			getByDay(dia){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace, 'getByDay');
				const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/counts`;
				$http.get(inserturl, { params: formatService.formatearDatos(dia), timeout: canceler.promise }).then((response) => {
					if (response.statusText === 'OK'){
						let invoicesCount = 0, totalCount = 0;
						for (let i = 0, len=response.data.data.length; i< len; i++){
							invoicesCount += response.data.data[i].cnt;
							totalCount += response.data.data[i].total;
						}
						response.data.data.invoicesCount = invoicesCount;
						response.data.data.totalCount = totalCount;
						response.data.invoicesCount = invoicesCount;
						response.data.totalCount = totalCount;
					}
					defer.resolve(response.data);
				}).catch((response) => {
					defer.reject(response);
				});
				return defer.promise;
			}

			getFacturasMeses(datos){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace, 'getFacturasMeses');
				const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/countsByMonth`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					response.data.data = this.prepararDatosMes(response.data.data, true);
					defer.resolve(response.data);
				}).catch((response) => {
					defer.reject(response);
				});
				return defer.promise;
			}

			getGatesMeses(datos){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace, 'getGatesMeses');
				const inserturl = APP_CONFIG.SERVER_URL + '/gates/ByMonth';
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					response.data.data = this.prepararDatosMes(response.data.data, false);
					defer.resolve(response.data);
				}).catch((response) => {
					defer.reject(response);
				});
				return defer.promise;
			}

			getTurnosMeses(datos){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace, 'getTurnosMeses');
				const inserturl = `${APP_CONFIG.SERVER_URL}/appointments/ByMonth`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					response.data.data = this.prepararDatosMes(response.data.data, false);
					defer.resolve(response.data);
				}).catch((response) => {
					defer.reject(response);
				});
				return defer.promise;
			}

			//A partir de la fecha pasada, devuelve la facturación por día, de la fecha y 4 fechas hacia atrás
			getFacturadoPorDia(datos){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace, 'getFacturadoPorDia');
				const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/countsByDate`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					response.data.data = this.prepararDatosFacturadoDia(response.data.data);
					defer.resolve(response.data);
				}).catch((response) => {
					defer.reject(response);
				});
				return defer.promise;
			}

			getGatesDia(datos){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace, 'getGatesDia');
				const inserturl = `${APP_CONFIG.SERVER_URL}/gates/ByHour`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					response.data.data = this.prepararDatosGatesTurnosDia(response.data.data);
					defer.resolve(response.data);
				}).catch((response) => {
					defer.reject(response);
				});
				return defer.promise;
			}

			getTurnosDia(datos){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace, 'getTurnosDia');
				const inserturl = `${APP_CONFIG.SERVER_URL}/appointments/ByHour`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					response.data.data = this.prepararDatosGatesTurnosDia(response.data.data);
					defer.resolve(response.data);
				}).catch((response) => {
					defer.reject(response);
				});
				return defer.promise;
			}

		}

		return new controlPanelFactory();
	}]);