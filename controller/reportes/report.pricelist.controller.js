/**
 * Created by kolesnikov-a on 09/08/2017.
 */
/**
 * Created by artiom on 02/10/14.
 */

class ReporteTarifasCtrl {

	constructor(reportsFactory, priceFactory, dialogs, loginService){
		this.dialogs = dialogs;
		this.reportsFactory = reportsFactory;
		this.loginService = loginService;

		this.tabsTerminales = [
			{nombre: 'AGP', active: true},
			{nombre: 'BACTSSA', active: false},
			{nombre: 'TERMINAL4', active: false},
			{nombre: 'TRP', active: false}
		];

		this.pivotTableFields = {
			"Terminal": (item) => (item.terminal),
			"Total": (item) => (item.total),
			"Movimiento": (item) => (item.mov ? item.mov : 'Indefinido'),
			"Tipo": (item) => (item.tipo),
			"Medida": (item) => (item.largo),
			"Año": (item) => (item.anio),
			"Mes": (item) => (item.mes)
		};

		this.tablePivot = {
			data: [],
			options: {
				derivedAttributes: this.pivotTableFields,
				hiddenAttributes: ["largo", "terminal", "total", "cantidad", "norma", "code", "anio", "mes", "iso3Id", "iso3Name", "mov", "teus", "tipo"],
				rows: ["Terminal"],
				cols: ["Movimiento", "Medida", "Tipo"],
				vals: ["Total"],
				rendererName: "Tabla",
				aggregatorName: "Cuenta"
			}
		};

		this.currentPage = 1;
		this.itemsPerPage = 15;

		this.listadoTarifas = [];
		this.filteredPrices = [];
		this.filtroTerminal = 'AGP';
		this.searchText = '';

		this.errorTarifario = false;
		this.loadingReporteTarifas = false;
		this.mostrarGrafico = false;

		this.configPanel = {
			tipo: 'panel-danger',
			titulo: 'Error',
			mensaje: 'Error al cargar los datos necesarios para generar el reporte.'
		};

		this.tarifasGraficar = [];

		this.model = {
			fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth()),
			fechaFin: new Date()
		};

		priceFactory.getAllPricelist().then(pricelistData => {
			this.listadoTarifas = pricelistData;
		}).catch(error => {
			this.errorTarifario = true;
		});
	}

	filtrarListado(terminal){
		this.filtroTerminal = terminal;
		this.currentPage = 1;
		this.tabsTerminales.forEach(tab => {
			tab.active = tab.nombre == terminal;
		})
	}

	armarGraficoTarifas() {
		this.loadingReporteTarifas = true;
		this.listadoTarifas.forEach(tarifa => {
			if (tarifa.graficar) this.tarifasGraficar.push(tarifa.code)
		});

		this.reportsFactory.getReporteTarifasPivot(this.model, this.tarifasGraficar).then((data) => {
			this.tablePivot.data = data.data;
			this.mostrarGrafico = true;
		}).catch((err) => {
			this.mostrarGrafico = false;
			this.dialogs.error('Reporte Tarifas', err.message);
		}).finally(() => {
			this.loadingReporteTarifas = false;
		});
	}

}

ReporteTarifasCtrl.$inject = ['reportsFactory', 'priceFactory', 'dialogs', 'loginService'];

myapp.controller('reporteTarifasCtrl', ReporteTarifasCtrl);