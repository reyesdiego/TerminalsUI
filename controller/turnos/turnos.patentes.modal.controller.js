/**
 * Created by kolesnikov-a on 05/05/2017.
 */
myapp.controller('turnosPatenteCtrl', ['$uibModalInstance', 'turno', function($uibModalInstance, turno){
	console.log(turno);
	this.turno = turno;
	const patenteAnterior = turno.patenteCamion;

	this.actualizarPatente = () => {
		console.log('hola');
		//turno.guardarPatente().then()

	};

	this.cancelar = () => {
		turno.patenteCamion = patenteAnterior;
		$uibModalInstance.dismiss('cancel');
	};

}]);