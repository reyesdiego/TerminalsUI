/**
 * Created by kolesnikov-a on 01/08/2017.
 */
myapp.controller('agruparTarifarioCtrl', ['PriceGroup', '$uibModal', 'priceFactory', '$scope', function(PriceGroup, $uibModal, priceFactory, $scope){

	this.grupoSeleccionado = null;
	this.listadoGrupos = [];
	this.tarifasTerminal = [];

	priceFactory.getMatchPrices().then(data => {
		this.tarifasTerminal = data.data;
	}).catch(error => {
		console.log(error)
	});

	this.nuevoGrupo = () => {
		this.grupoSeleccionado = new PriceGroup();
		let modalInstance = $uibModal.open({
			templateUrl: 'view/tarifario/grupo.nuevo.modal.html',
			controller: 'nuevoGrupoModalCtrl',
			controllerAs: 'vmNuevo'
		});
		modalInstance.result.then(nombre => {
			this.grupoSeleccionado.nombre = nombre;
			this.grupoSeleccionado.guardar();
		}).catch(() => {
			this.grupoSeleccionado = null;
		});
	};

	this.agregarTarifa = (priceId) => {
		console.log('agregamos la tarifa ' + priceId);
	};

	$scope.$on('dragstart', (e) => {
		console.log('me llego el evento de que se esta moviendo algo');
	})

}]);

myapp.controller('nuevoGrupoModalCtrl', ['$uibModalInstance', function($uibModalInstance){

	this.nombreGrupo = '';


	this.guardar = () => {
		$uibModalInstance.close(this.nombreGrupo);
	};

	this.cancelar = () => {
		$uibModalInstance.dismiss();
	}

}]);