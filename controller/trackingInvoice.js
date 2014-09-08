/**
 * Created by artiom on 03/09/14.
 */

function trackingInvoiceCtrl($scope, $modalInstance, estado, track) {

	$scope.interfazModal = {
		titulo: '',
		tipoModal: '',
		comentario: ''
	};

	$scope.tracking = track.data;

	switch (estado){
		case 'Y':
			$scope.interfazModal.titulo = 'Cambio de estado: Revisar';
			$scope.interfazModal.tipoModal = 'bg-warning';
			break;
		case 'G':
			$scope.interfazModal.titulo = 'Cambio de estado: Controlado';
			$scope.interfazModal.tipoModal = 'bg-success';
			break;
		case 'R':
			$scope.interfazModal.titulo = 'Cambio de estado: Error';
			$scope.interfazModal.tipoModal = 'bg-danger';
			break;
	}

	$scope.hitKey = function(evt){
		if(angular.equals(evt.keyCode,13))
			$scope.guardar();
		if(angular.equals(evt.keyCode, 27))
			$scope.cancelar();
	};

	$scope.guardar = function () {
		var commentData = {
			title: $scope.interfazModal.titulo,
			comment: $scope.interfazModal.comentario
		};
		$modalInstance.close(commentData);
	};

	$scope.cancelar = function () {
		$modalInstance.dismiss('cancel');
	};
};