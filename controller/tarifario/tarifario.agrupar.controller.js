/**
 * Created by kolesnikov-a on 01/08/2017.
 */
myapp.controller('agruparTarifarioCtrl', ['PriceGroup', '$uibModal', 'priceFactory', '$scope', '$q', 'dialogs', function(PriceGroup, $uibModal, priceFactory, $scope, $q, dialogs){

	this.grupoSeleccionado = null;
	this.listadoGrupos = [];

	this.filteredPrices = [];
	this.listadoTarifas = [];

	this.filtroTerminal = 'AGP';

	this.currentPage = 1;
	this.itemsPerPage = 8;

	this.dragging = false;

	this.searchText = '';
	this.filterGroups = '';

	this.divAlert = {
		show: false,
		class: 'alert-success',
		message: 'OK'
	};

	this.tabsTerminales = [
		{nombre: 'AGP', active: true},
		{nombre: 'BACTSSA', active: false},
		{nombre: 'TERMINAL4', active: false},
		{nombre: 'TRP', active: false}
	];

	priceFactory.getAllPricelist().then(pricelistData => {
		this.listadoTarifas = pricelistData;
	}).catch(error => {
		dialogs.error('Agrupar tarifario', `Se produjo un error al cargar los tarifarios de las terminales.\r\n${error.message}`);
	});

	priceFactory.getGroupPrices().then(groupsData => {
		this.listadoGrupos = groupsData;
	}).catch(error => {
		dialogs.error('Agrupar tarifario', `Se produjo un error al cargar los grupos existentes.\r\n${error.message}`);
	});

	this.guardarGrupo = (groupData) => {
		//this.grupoSeleccionado.code = groupData.code;
		this.grupoSeleccionado.description = groupData.description;
		this.grupoSeleccionado.guardar().then(() => {
			this.listadoGrupos.push(this.grupoSeleccionado);
		}).catch(error => {
			this.grupoSeleccionado = null;
			dialogs.error('Agrupar tarifario', `Se produjo un error al intentar guardar el nuevo grupo. \n ${error.message}`);
		});
	};

	this.nuevoGrupo = () => {
		this.grupoSeleccionado = new PriceGroup();
		let modalInstance = $uibModal.open({
			templateUrl: 'view/tarifario/grupo.nuevo.modal.html',
			controller: 'nuevoGrupoModalCtrl',
			controllerAs: 'vmNuevo'
		});
		modalInstance.result.then(this.guardarGrupo).catch(() => {
			this.grupoSeleccionado = null;
		});
	};

	this.guardarTarifas = () => {
		this.grupoSeleccionado.guardarTarifas().then(() => {
			this.divAlert.show = true;
			this.divAlert.message = `Las tarifas para el grupo ${this.grupoSeleccionado.nombreGrupo} han sido guardadas correctamente.`;
			this.divAlert.class = 'alert-success';
		}).catch(error => {
			this.divAlert.show = true;
			this.divAlert.message = `Se produjo un error al intentar guardar las tarifas para el grupo ${this.grupoSeleccionado.nombreGrupo}.\n${error.message}`;
			this.divAlert.class = 'alert-danger';
		});
	};

	this.filtrarListado = (terminal) => {
		this.filtroTerminal = terminal;
		this.currentPage = 1;
		this.tabsTerminales.forEach(tab => {
			tab.active = tab.nombre == terminal;
		})
	};

	this.agregarTarifa = (priceId) => {
		const indice = this.listadoTarifas.findIndex((current) => {
			return current._id == priceId
		});
		const tarifa = this.listadoTarifas[indice];
		this.grupoSeleccionado.addRate(tarifa);
	};

	$scope.$on('dragstart', (e) => {
		this.dragging = true;
	});

	$scope.$on('dragend', (e) => {
		this.dragging = false;
	});

}]);

myapp.controller('nuevoGrupoModalCtrl', ['$uibModalInstance', function($uibModalInstance){

	this.datosGrupo = {
		code: '',
		description: ''
	};

	this.guardar = () => {
		$uibModalInstance.close(this.datosGrupo);
	};

	this.cancelar = () => {
		$uibModalInstance.dismiss();
	}

}]);