/**
 * Created by kolesnikov-a on 11/08/2017.
 */

class ManifiestoController {

	constructor(afipFactory){
		this.factory = afipFactory;

		this.model = {
			sumaria: '',
			buqueNombre: '',
			fechaInicio: new Date(),
			fechaFin: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
			currentPage: 1
		};

		this.page = {
			skip: 0,
			limit: 10
		};

		this.itemsPerPage = 10;

		this.fechaInicio = {
			open: false,
		};

		this.fechaFin = {
			open: false
		};

		this.panelMensaje = {
			titulo: 'Manifiestos',
			mensaje: 'No se encontraron datos de manifiestos para los filtros seleccionados.',
			tipo: 'panel-info'
		};

		this.listaBuques = cacheService.afipCache.get('SumImpoBuques');
		//this.listaBuques = cacheService.afipCache.get('SumExpoBuques');
		//manifiests/impo/container/:idcontenedor

		this.cargaDatos();
	}

	filtrado(filtro, contenido){
		this.model.currentPage = 1;
		this.model[filtro] = contenido;
		if (this.model.fechaInicio > this.model.fechaFin && this.model.fechaFin != ''){
			this.model.fechaFin = new Date(this.model.fechaInicio);
			this.model.fechaFin.setDate(this.model.fechaFin.getDate() + 1);
		}
	};

	buqueSelected(selected){
		console.log('hola');
		if (angular.isDefined(selected) && selected.title != this.model.buqueNombre){
			this.model.buqueNombre = selected.originalObject.D;
		}
		console.log(this.model);
	};

	hitEnter(evt){
		if(angular.equals(evt.keyCode,13))
			this.cargaDatos();
	};

	cargaDatos(){
		this.sumariaDetalle = {};
		this.cargando = true;
		this.panelMensaje = {
			titulo: 'Manifiestos',
			mensaje: 'No se encontraron datos de manifiestos para los filtros seleccionados.',
			tipo: 'panel-info'
		};

		this.page.skip = ((this.model.currentPage - 1) * this.itemsPerPage);
		this.page.limit = this.itemsPerPage;
		this.datosRegistro = [];
		//this.$broadcast('checkAutoComplete');
		this.factory.getAfip('afip.sumatorias.impo1', this.model, this.page, (data) => {
			if(data.status === 'OK'){
				this.datosRegistro = data.data;
				this.totalItems = data.totalCount;
				this.cargando = false;
			} else {
				this.panelMensaje = {
					titulo: 'AFIP',
					mensaje: 'Se ha producido un error al cargar los datos.',
					tipo: 'panel-danger'
				};
				this.datosRegistro = [];
				this.totalItems = 0;
				this.cargando = false;
			}
		});
	};

}

ManifiestoController.$inject = ['afipFactory'];

myapp.controller('manifiestoCtrl', ManifiestoController);