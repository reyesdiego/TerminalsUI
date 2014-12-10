/**
 * Created by artiom on 03/09/14.
 */

function trackingInvoiceCtrl($scope, $modalInstance, estado, track, states) {

	$scope.states = states.data;

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
			$scope.interfazModal.titulo = 'Estado: Sin revisar';
			$scope.interfazModal.tipoModal = 'bg-warning';
			$scope.interfazModal.btnEstado = 'btn-warning';
			$scope.interfazModal.estado = 'Sin revisar';
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

	$scope.trackInvoice = function(estado){
		$scope.interfazModal.nuevoEstado = estado._id;

		var btnClass = '';
		var cuerpoClass = '';
		if (estado.type === 'ERROR'){
			btnClass = 'btn-danger';
			cuerpoClass = 'bg-danger';
		} else if (estado.type === 'WARN'){
			btnClass = 'btn-warning';
			cuerpoClass = 'bg-warning';
		}
		else if (estado.type === 'OK'){
			btnClass = 'btn-success';
			cuerpoClass = 'bg-success';
		}
		else if (estado.type === 'UNKNOWN') {
			btnClass = 'btn-warning';
			cuerpoClass = 'bg-warning';
		}
		$scope.interfazModal.btnEstado = btnClass;
		$scope.interfazModal.estado = estado.description;
		$scope.interfazModal.divCuerpo = cuerpoClass;
	};

	$scope.guardar = function () {
		if ($scope.interfazModal.comentario == '' && $scope.interfazModal.nuevoEstado == $scope.estado){
			$scope.cancelar();
		} else {
			var commentData = {
				title: 'Nuevo estado: ' + $scope.interfazModal.estado,
				comment: $scope.interfazModal.comentario,
				newState: $scope.interfazModal.nuevoEstado
			};
			if ($scope.interfazModal.nuevoEstado == $scope.estado){
				commentData.title = $scope.interfazModal.estado
			}
			$modalInstance.close(commentData);
		}
	};

	$scope.cancelar = function () {
		$modalInstance.dismiss('cancel');
	};
}