/**
 * Created by kolesnikov-a on 01/08/2017.
 */
myapp.controller('agruparTarifarioCtrl', ['PriceGroup', '$uibModal', 'priceFactory', '$scope', function(PriceGroup, $uibModal, priceFactory, $scope){

	this.grupoSeleccionado = null;
	this.listadoGrupos = [];

	this.filteredPrices = [];
	this.listadoTarifas = [];

	this.filtroTerminal = 'AGP';

	this.currentPage = 1;
	this.itemsPerPage = 8;

	this.dragging = false;

	this.searchText = '';

	this.tabsTerminales = [
		{nombre: 'AGP', active: true},
		{nombre: 'BACTSSA', active: false},
		{nombre: 'TERMINAL4', active: false},
		{nombre: 'TRP', active: false}
	];

	priceFactory.getAllPricelist().then(pricelistData => {
		this.listadoTarifas = pricelistData;
	}).catch(error => {

	});

	priceFactory.getGroupPrices().then(groupsData => {
		this.listadoGrupos = groupsData;
	}).catch(error => {

	});

	this.nuevoGrupo = () => {
		this.grupoSeleccionado = new PriceGroup();
		let modalInstance = $uibModal.open({
			templateUrl: 'view/tarifario/grupo.nuevo.modal.html',
			controller: 'nuevoGrupoModalCtrl',
			controllerAs: 'vmNuevo'
		});
		modalInstance.result.then(groupData => {
			this.grupoSeleccionado.code = groupData.code;
			this.grupoSeleccionado.description = groupData.description;
			this.grupoSeleccionado.guardar();
			this.listadoGrupos.push(this.grupoSeleccionado);
		}).catch(() => {
			this.grupoSeleccionado = null;
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