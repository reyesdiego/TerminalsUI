/**
 * Created by artiom on 02/10/14.
 */

class ReporteCuboCtrl {

	constructor(reportsFactory, priceFactory, loginService, dialogs) {
		this.listadoGrupos = [];

		priceFactory.getGroupPrices().then(groupsData => {
			this.listadoGrupos = groupsData;
		}).catch(error => {
			this.errorTarifario = true;
		});

		this.dialogs = dialogs;
		this.reportsFactory = reportsFactory;
		this.loginService = loginService;

		this.pivotTableFields = {
			"Terminal": (item) => (item.terminal),
			"Total": (item) => (item.total),
			"Movimiento": (item) => (item.mov ? item.mov : 'Indefinido'),
			"Tipo": (item) => (item.tipo),
			"Medida": (item) => (item.largo),
			"Año": (item) => (item.anio),
			"Mes": (item) => (item.mes),
			"Tarifa": (item) => (item.code)
		};

		this.tablePivot = {
			data: [],
			options: {
				derivedAttributes: this.pivotTableFields,
				hiddenAttributes: ["largo", "terminal", "total", "cantidad", "norma", "code", "anio", "mes", "iso3Id", "iso3Name", "mov", "teus"],
				rows: ["Terminal"],
				cols: ["Medida"],
				vals: ["Total"],
				rendererName: "Tabla",
				aggregatorName: "Suma de moneda"
			}
		};

		this.loadingReporteTarifas = false;

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

	}

	armarGraficoTarifas() {
		this.loadingReporteTarifas = true;
		this.listadoGrupos.forEach(grupo => {
			if (grupo.graficar) this.tarifasGraficar.push(grupo._id)
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

};

ReporteCuboCtrl.$inject = ['reportsFactory', 'priceFactory', 'loginService', 'dialogs'];

myapp.controller('reporteCuboCtrl', ReporteCuboCtrl);
