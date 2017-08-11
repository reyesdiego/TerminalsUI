/**
 * Created by artiom on 02/10/14.
 */

myapp.controller('reporteCuboCtrl', ['$scope', 'reportsFactory', 'priceFactory', 'dialogs', 'loginService',
	function($scope, reportsFactory, priceFactory, dialogs, loginService) {

		//Array con las terminales
		this.tabsTerminales = [
			{nombre: 'AGP', active: true},
			{nombre: 'BACTSSA', active: false},
			{nombre: 'TERMINAL4', active: false},
			{nombre: 'TRP', active: false},
			{nombre: 'Grupos de tarifas', active: false}
		];

		this.tarifasAgrupadas = true;

		function getPivotTableFields(){
			return {
				"Terminal": (item) => (item.terminal),
				"Cantidad": (item) => (item.cantidad),
				"Total": (item) => (item.total),
				"Movimiento": (item) => (item.mov ? item.mov : 'Indefinido'),
				"Tipo": (item) => (item.iso3Name ? item.iso3Name : 'Sin informar'),
				"Medida": (item) => (item.largo),
				"Año": (item) => (item.anio),
				"Mes": (item) => (item.mes),
				"TEUS": (item) => (item.teus)
			}
		}

		this.tablePivot = {
			data: [],
			options: {
				derivedAttributes: getPivotTableFields(),
				hiddenAttributes: ["largo", "terminal", "total", "cantidad", "norma", "code", "anio", "mes", "iso3Id", "iso3Name", "mov", "teus"],
				rows: ["Terminal"],
				cols: ["Medida"],
				vals: ["Total"],
				rendererName: "Tabla",
				aggregatorName: "Suma de moneda"
			}
		};

		this.search = '';
		this.filterLarge20 = false;
		this.filterLarge40 = false;

		this.filteredPrices = [];

		this.datepickerOptions = {
			formatYear: 'yyyy',
			maxDate: new Date(),
			startingDay: 1
		};

		this.loadingReporteTarifas = false;

		this.tarifasElegidas = 1;

		this.paginaAnterior = 1;

		this.errorTarifario = false;

		this.gruposTarifas = false;
		this.listadoGrupos = [];
		this.listadoTarifas = [];

		this.configPanel = {
			tipo: 'panel-danger',
			titulo: 'Error',
			mensaje: 'Error al cargar los datos necesarios para generar el reporte.'
		};

		this.tarifasGraficar = [];

		this.tablaGrafico = {
			"terminales": [],
			"data": []
		};

		this.tasas = false;

		this.totales = [0, 0, 0, 0];

		$scope.$on('errorDatos', () => {
			$scope.errorTarifario = true;
		});

		$scope.$on('cambioPagina', (event, data) => {
			$scope.currentPage = data;
		});

		this.tarifasSeleccionadas = () => {
			let count = 0;
			this.listadoTarifas.forEach(tarifa => {
				count += tarifa.graficar ? 1 : 0;
			});
			this.listadoGrupos.forEach(grupo => {
				count += grupo.graficar ? grupo.tarifas.length : 0;
			});
			return count
		};

		this.searchPrice = function(value, index, array){
			return value.code.toUpperCase().search(this.search) > -1 || value.description.toUpperCase().search(this.search) > -1 || value.largo == this.search;
		};

		function traerDatos () {
			priceFactory.getAllPricelist().then(pricelistData => {
				this.listadoTarifas = pricelistData;
			}).catch(error => {
				this.errorTarifario = true;
				//dialogs.error('Agrupar tarifario', `Se produjo un error al cargar los tarifarios de las terminales.\r\n${error.message}`);
			});

			priceFactory.getGroupPrices().then(groupsData => {
				this.listadoGrupos = groupsData;
			}).catch(error => {
				this.errorTarifario = true;
			});
		}

		this.filtrarListado = (terminal) => {
			if (terminal == 'Grupos de tarifas'){
				this.gruposTarifas = true;
			} else {
				this.gruposTarifas = false;
				this.filtroTerminal = terminal;
			}
			this.currentPage = 1;
			this.tabsTerminales.forEach(tab => {
				tab.active = tab.nombre == terminal;
			})
		};

		if (loginService.isLoggedIn){
			traerDatos();
		}

		this.filtrarMedida = () => {
			//this.selectedList = angular.copy(listaAnterior);
			if (this.filterLarge20 && this.filterLarge40){
				this.selectedList = this.selectedList.filter((price) => {
					return price.largo == 20 || price.largo == 40;
				})
			} else if (this.filterLarge20){
				this.selectedList = this.selectedList.filter((price) => {
					return price.largo == 20;
				})
			} else if (this.filterLarge40){
				this.selectedList = this.selectedList.filter((price) => {
					return price.largo == 40;
				})
			}
			this.totalItems = this.selectedList.length;
			this.currentPage = 1;
		};


		this.mostrarGrafico = false;

		this.model = {
			fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth()),
			fechaFin: new Date()
		};

		this.isCollapsedDesde = false;
		this.isCollapsedHasta = false;

		this.rowClass = (index) => {
			return (this.selected === index) ? "selected" : "";
		};

		this.volver = () => {
			this.mostrarGrafico = false;
		};

		this.armarGraficoTarifas = () => {
			this.loadingReporteTarifas = true;

			this.tarifasAgrupadas = true;
			if (this.tarifasGraficar.length <= 0){
				this.tablePivot.options.derivedAttributes = getPivotTableFields();
			} else {
				this.tablePivot.options.derivedAttributes.Tarifa = (item) => {return item.code};
			}
			reportsFactory.getReporteTarifasPivot(this.model, this.tarifasGraficar).then((data) => {
				this.tablePivot.data = data.data;
				this.mostrarGrafico = true;
			}).catch((err) => {
				this.loadingReporteTarifas = false;
				this.mostrarGrafico = false;
				dialogs.error('Reporte Tarifas', err.message);
			}).finally(() => {
				this.loadingReporteTarifas = false;
			});

		};

	}]);
