/**
 * Created by artiom on 03/09/14.
 */

function trackingInvoiceCtrl($scope, $modalInstance, estado) {

	$scope.interfazModal = {
		titulo: '',
		tipoModal: '',
		comentario: ''
	};

	switch (estado){
		case 'Y':
			$scope.interfazModal.titulo = 'Cambio de estado: Revisar';
			$scope.interfazModal.tipoModal = 'bg-warning';
			break;
		case 'G':
			$scope.interfazModal.titulo = 'Cambio de estado: Controlada';
			$scope.interfazModal.tipoModal = 'bg-success';
			break;
		case 'R':
			$scope.interfazModal.titulo = 'Cambio de estado: Error';
			$scope.interfazModal.tipoModal = 'bg-danger';
			break;
	}

	$scope.guardar = function () {
		console.log($scope.interfazModal.comentario);
		if ($scope.interfazModal.comentario != ''){
			$scope.interfazModal.comentario = $scope.interfazModal.titulo + ' - ' + $scope.interfazModal.comentario;
			console.log($scope.interfazModal.comentario);
		}
		$modalInstance.close($scope.interfazModal.comentario);
	};

	$scope.cancelar = function () {
		$modalInstance.dismiss('cancel');
	};
};