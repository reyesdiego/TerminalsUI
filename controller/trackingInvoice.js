/**
 * Created by artiom on 03/09/14.
 */

function trackingInvoiceCtrl($scope, $modalInstance, estado, track) {

	$scope.interfazModal = {
		titulo: '',
		tipoModal: '',
		comentario: '',
		btnEstado: '',
		estado: '',
		divCuerpo: '',
		nuevoEstado: ''
	};

	$scope.tracking = track.data;
	$scope.estado = estado;
	$scope.interfazModal.nuevoEstado = estado;

	switch ($scope.estado){
		case 'Y':
			$scope.interfazModal.titulo = 'Estado: Revisar';
			$scope.interfazModal.tipoModal = 'bg-warning';
			$scope.interfazModal.btnEstado = 'btn-warning';
			$scope.interfazModal.estado = 'Revisar';
			$scope.interfazModal.divCuerpo = 'bg-warning';
			break;
		case 'G':
			$scope.interfazModal.titulo = 'Estado: Controlado';
			$scope.interfazModal.tipoModal = 'bg-success';
			$scope.interfazModal.btnEstado = 'btn-success';
			$scope.interfazModal.estado = 'Controlado';
			$scope.interfazModal.divCuerpo = 'bg-success';
			break;
		case 'R':
			$scope.interfazModal.titulo = 'Estado: Error';
			$scope.interfazModal.tipoModal = 'bg-danger';
			$scope.interfazModal.btnEstado = 'btn-danger';
			$scope.interfazModal.estado = 'Error';
			$scope.interfazModal.divCuerpo = 'bg-danger';
			break;
	}

	$scope.hitKey = function(evt){
		if(angular.equals(evt.keyCode,13))
			$scope.guardar();
		if(angular.equals(evt.keyCode, 27))
			$scope.cancelar();
	};

	$scope.trackInvoice = function(estado){
		$scope.interfazModal.nuevoEstado = estado;
		switch (estado){
			case 'Y':
				$scope.interfazModal.btnEstado = 'btn-warning';
				$scope.interfazModal.estado = 'Revisar';
				$scope.interfazModal.divCuerpo = 'bg-warning';
				break;
			case 'G':
				$scope.interfazModal.btnEstado = 'btn-success';
				$scope.interfazModal.estado = 'Controlado';
				$scope.interfazModal.divCuerpo = 'bg-success';
				break;
			case 'R':
				$scope.interfazModal.btnEstado = 'btn-danger';
				$scope.interfazModal.estado = 'Error';
				$scope.interfazModal.divCuerpo = 'bg-danger';
				break;
		}
	};

	$scope.guardar = function () {
		var commentData = {
			title: 'Cambio de estado: ' + $scope.interfazModal.estado,
			comment: $scope.interfazModal.comentario,
			newState: $scope.interfazModal.nuevoEstado
		};
		if ($scope.interfazModal.nuevoEstado == $scope.estado){
			commentData.title = $scope.interfazModal.estado
		}
		$modalInstance.close(commentData);
	};

	$scope.cancelar = function () {
		$modalInstance.dismiss('cancel');
	};
}