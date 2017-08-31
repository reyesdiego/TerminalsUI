/**
 * Created by Diego Reyes on 1/29/14.
 */

class PricelistCtrl {
	constructor(priceFactory, loginService, downloadFactory, dialogs, downloadService, $filter){
		this._priceFactory = priceFactory;
		this._loginService = loginService;
		this._downloadFactory = downloadFactory;
		this._dialogs = dialogs;
		this._downloadService = downloadService;
		this._$filter = $filter;

		this.tiposTarifas = [
			{nombre: 'AGP', active: true},
			{nombre: 'Servicios', active: false},
			{nombre: 'Propios', active: false}
		];

		this.pricelist = [];
		this.filteredPrices = [];

		this.pricelistAgp = [];
		this.pricelistTerminal = [];
		this.servicios = [];

		this.listaElegida = [];
		this.tasas = false;
		this.medida = false;
		this.norma = false;
		this.itemsPerPage = 10;
		this.hayError = false;

		this.procesando = false;

		this.search = '';

		this.predicate = '';
		this.reverse = false;

		this.currentPage = 1;
		this.itemsPerPage = 10;

		if (loginService.isLoggedIn) this.cargaPricelist();
	}

	cargaPricelist(){
		this.pricelistAgp = [];
		this.pricelistTerminal = [];
		this.servicios = [];

		this.listaElegida = [];
		this._priceFactory.getMatchPrices(this.tasas, this.medida, this.norma).then((data) => {
			this.hayError = false;
			this.pricelist = data.data;
			this.pricelist.forEach((tarifa) => {
				if (tarifa.tarifaAgp) this.pricelistAgp.push(tarifa);
				if (tarifa.tarifaTerminal) this.pricelistTerminal.push(tarifa);
				if (tarifa.servicio) this.servicios.push(tarifa);
			});
			this.cambiarTarifas();
		}).catch((error) => {
			this.hayError = true;
			this.mensajeResultado = {
				titulo: 'Tarifario',
				mensaje: 'Se ha producido un error al cargar los datos del tarifario.',
				tipo: 'panel-danger'
			};
		});
	}

	cambiarTarifas(tipoTarifa = {nombre: 'AGP', active: true}){
		this.tiposTarifas.forEach((unaTarifa) => {
			unaTarifa.active = (unaTarifa.nombre == tipoTarifa.nombre);
		});
		if (tipoTarifa.nombre == 'AGP'){
			this.listaElegida = this.pricelistAgp;
		} else if (tipoTarifa.nombre == 'Servicios'){
			this.listaElegida = this.servicios;
		} else {
			this.listaElegida = this.pricelistTerminal;
		}
		this.totalItems = this.listaElegida.length
	};

	exportarAPdf(){
		this.procesando = true;
		let pricesData = angular.copy(this.pricelist);
		pricesData.forEach((aPrice) => {
			aPrice.tipo = aPrice.tipoTarifa;
		});
		const data = {
			terminal: this._loginService.filterTerminal,
			pricelist: pricesData
		};
		const nombreReporte = 'Tarifario' + this._$filter('date')(new Date(), 'ddMMyyyy', 'UTC') + '.pdf';
		this._downloadFactory.convertToPdf(data, 'pricelistToPdf', nombreReporte).then().catch(() => {
			this._dialogs.error('Tarifario', 'Se ha producido un error al intentar exportar el tarifario a PDF');
		}).finally(() => {
			this.procesando = false;
		});
	};

	exportarAExcel(){
		this.procesando = true;
		const nombreReporte = 'Tarifario' + this._$filter('date')(new Date(), 'ddMMyyyy', 'UTC') + '.csv';
		const csvContent = this.armarCsv();
		this._downloadService.setDownloadCsv(nombreReporte, csvContent);
		this.procesando = false;
	};

	armarCsv(){
		let csvContent = "Tipo|Código|Descripción|Unidad|Tope";

		this.pricelist.forEach((price) => {
			csvContent += "\n";
			csvContent += price.tipoTarifa + "|" + price.code + "|" + price.description + "|" + price.unit + "|" + price.price;
		});

		return csvContent;
	}

}

PricelistCtrl.$inject = ['priceFactory', 'loginService', 'downloadFactory', 'dialogs', 'downloadService', '$filter'];

myapp.controller('pricelistCtrl', PricelistCtrl);