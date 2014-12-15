/**
 * Created by artiom on 03/09/14.
 */

function trackingInvoiceCtrl($scope, $modalInstance, estado, track, states) {

	$scope.states = states;

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

	states.forEach(function(unEstado){
		if (unEstado.description == $scope.estado.description){
			unEstado.ticked = true;
		}
	});

	switch ($scope.estado.type){
		case 'UNKNOWN':
			$scope.interfazModal.tipoModal = 'bg-info';
			$scope.interfazModal.divCuerpo = 'bg-info';
			$scope.interfazModal.imagen = 'images/unknown.png';
			break;
		case 'OK':
			$scope.interfazModal.tipoModal = 'bg-success';
			$scope.interfazModal.divCuerpo = 'bg-success';
			$scope.interfazModal.imagen = 'images/ok.png';
			break;
		case 'ERROR':
			$scope.interfazModal.tipoModal = 'bg-danger';
			$scope.interfazModal.divCuerpo = 'bg-danger';
			$scope.interfazModal.imagen = 'images/error.png';
			break;
		case 'WARN':
			$scope.interfazModal.tipoModal = 'bg-danger';
			$scope.interfazModal.divCuerpo = 'bg-danger';
			$scope.interfazModal.imagen = 'images/warn.png';
			break;
	}

	$scope.interfazModal.titulo = 'Estado: ' + $scope.estado.description;
	$scope.interfazModal.estado = $scope.estado.description;

	$scope.trackInvoice = function(estado){
		$scope.interfazModal.nuevoEstado = estado;

		var btnClass = '';
		var cuerpoClass = '';
		if (estado.type === 'ERROR'){
			cuerpoClass = 'bg-danger';
		} else if (estado.type === 'WARN'){
			cuerpoClass = 'bg-warning';
		}
		else if (estado.type === 'OK'){
			cuerpoClass = 'bg-success';
		}
		else if (estado.type === 'UNKNOWN'){
			cuerpoClass = 'bg-warning';
		}
		$scope.interfazModal.estado = estado.description;
		$scope.interfazModal.divCuerpo = cuerpoClass;
	};

	$scope.guardar = function () {
		if ($scope.interfazModal.comentario == '' && $scope.interfazModal.nuevoEstado.description == $scope.estado.description){
			$scope.cancelar();
		} else {
			var commentData = {
				title: 'Nuevo estado: ' + $scope.interfazModal.estado,
				comment: $scope.interfazModal.comentario,
				newState: $scope.interfazModal.nuevoEstado
			};
			if ($scope.interfazModal.nuevoEstado._id == $scope.estado){
				commentData.title = $scope.interfazModal.estado
			}
			$modalInstance.close(commentData);
		}
	};

	$scope.cancelar = function () {
		$modalInstance.dismiss('cancel');
	};
}