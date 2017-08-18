/**
 * Created by kolesnikov-a on 16/08/2017.
 */

class ContainerDetail {

	constructor(Container, $state, $stateParams){

		console.log($stateParams.containerId);

		this.container = new Container({contenedor: $stateParams.containerId});
		this.state = $state;

		this.itemsPerPage = 50;

		/*this.model = {
			'nroPtoVenta': '',
			'codTipoComprob': 0,
			'nroComprobante': '',
			'razonSocial': '',
			'documentoCliente': '',
			'fechaInicio': '',
			'fechaFin': '',
			'contenedor': '',
			'buqueNombre': '',
			'viaje': '',
			'estado': 'N',
			'code': '',
			'filtroOrden': 'gateTimestamp',
			'filtroOrdenAnterior': '',
			'filtroOrdenReverse': false,
			'order': '',
			'itemsPerPage': 15,
			'carga': '',
			'ontime': ''
		};*/

		this.model = {};

		this.loadingInvoices = false;
		this.loadingGates = false;
		this.loadingTurnos = false;
		this.loadingTasas = false;
		this.loadingGiro = false;

		this.detalleGates = false;
		this.volverAPrincipal = false;

		this.filtrosComprobantes = ['codTipoComprob', 'nroComprobante', 'razonSocial', 'fechaInicio', 'nroPtoVentaOrden', 'codTipoComprobOrden', 'nroComprobOrden', 'razonOrden', 'fechaOrden', 'importeOrden', 'codigo', 'contenedor', 'comprobantes', 'buque', 'rates'];

		this.mensajeResultado = {
			titulo: 'Comprobantes',
			mensaje: 'No se encontraron comprobantes para el contenedor seleccionado.',
			tipo: 'panel-info'
		};
		this.configPanelTasas = {
			tipo: 'panel-info',
			titulo: 'Tasas a las cargas',
			mensaje: 'No se encontraron tasas facturadas para el contenedor ingresado.'
		};
		this.configPanelGiro = {
			tipo: 'panel-info',
			titulo: 'Giro de buques',
			mensaje: 'No se encontraron datos de giros de buques para el contenedor ingresado.'
		};
		this.configPanelGates = {
			tipo: 'panel-info',
			titulo: 'Gates',
			mensaje: 'No se encontraron gates para el contenedor ingresado.'
		};
		this.configPanelTurnos = {
			tipo: 'panel-info',
			titulo: 'Turnos',
			mensaje: 'No se encontraron turnos para el contenedor ingresado.'
		};
		this.sumariaConfigPanel = {
			tipo: 'panel-info',
			titulo: 'A.F.I.P. sumaria',
			mensaje: 'No se encontraron datos en los registros de A.F.I.P. para el contenedor ingresado.'
		};

		this.cargarDatos();

	}

	cargarDatos(){
		this.loadingInvoices = true;
		this.loadingGates = true;
		this.loadingTurnos = true;
		this.loadingTasas = true;

		//this.pageComprobantes.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
		//this.pageComprobantes.limit = $scope.model.itemsPerPage;
		this.container.getInvoicesByContainer().then(() => {
			this.container.getGiroBuque().then().catch((error) => {
				this.loadingGiro = true;
				this.configPanelGiro = {
					tipo: 'panel-danger',
					titulo: 'Giro de buques',
					mensaje: 'Se produjo un error al cargar los datos de giro de buques.'
				}
			}).finally(() => this.loadingGiro = false);
		}).catch(() => {
			this.mensajeResultado = {
				titulo: 'Comprobantes',
				mensaje: 'Se ha producido un error al cargar los datos de los comprobantes.',
				tipo: 'panel-danger'
			};
		}).finally(() => this.loadingInvoices = false);

		this.container.getRates(this.state.current.name, this.moneda).then().catch((error) => {
			this.configPanelTasas = {
				tipo: 'panel-danger',
				titulo: 'Tasas',
				mensaje: 'Se ha producido un error al cargar los datos de las tasas.'
			};
		}).finally(() => this.loadingTasas = false);

		let page = {
			skip: 0,
			limit: this.itemsPerPage
		};
		//if (pageGates.skip == 0){ $scope.currentPage = 1}
		this.container.getGates(page).then().catch(() => {
			this.configPanelGates = {
				tipo: 'panel-danger',
				titulo: 'Gates',
				mensaje: 'Se ha producido un error al cargar los gates.'
			};
		}).finally(() => this.loadingGates = false);

		this.container.getAppointments(page).then().catch(() => {
			this.configPanelTurnos = {
				tipo: 'panel-danger',
				titulo: 'Turnos',
				mensaje: 'Se ha producido un error al cargar los turnos.'
			};
		}).finally(() => this.loadingTurnos = false);

		this.container.getAfipData().then().catch((error) => {
			this.sumariaConfigPanel = {
				tipo: 'panel-danger',
				titulo: 'A.F.I.P. sumaria',
				mensaje: 'Se produjo un error al cargar los datos de AFIP.'
			};
		}).finally(() => this.cargandoSumaria = false);

	}

}

ContainerDetail.$inject = ['Container', '$state', '$stateParams'];

myapp.controller('containerDetailCtrl', ContainerDetail);