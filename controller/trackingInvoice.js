/**
 * Created by artiom on 03/09/14.
 */

function trackingInvoiceCtrl($scope, $modalInstance, estado) {

	$scope.interfazModal = {
		titulo: '',
		tipoModal: ''
	};

	switch (estado){
		case 'Y':
			$scope.interfazModal.titulo = 'Cambio de estado: Revisar';
			$scope.interfazModal.tipoModal = 'btn-warning';
			break;
		case 'G':
			$scope.interfazModal.titulo = 'Cambio de estado: OK';
			$scope.interfazModal.tipoModal = 'btn-success';
			break;
		case 'R':
			$scope.interfazModal.titulo = 'Cambio de estado: Error';
			$scope.interfazModal.tipoModal = 'btn-danger';
			break;
	}

	$scope.comentario = '';

	$scope.guardar = function () {
		$modalInstance.close($scope.comentario);
	};

	$scope.cancelar = function () {
		$modalInstance.dismiss('cancel');
	};
};