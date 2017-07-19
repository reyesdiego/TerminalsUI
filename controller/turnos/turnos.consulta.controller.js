/**
 * Created by kolesnikov-a on 23/05/2017.
 */
myapp.controller('turnosConsultaCtrl', ['turnosFactory', 'dialogs', 'containersList', 'patentesList', function(turnosFactory, dialogs, containersList, patentesList){

	this.containersList = containersList;
	this.patentesList = patentesList;

	this.searchBy = 'C';

	this.patenteSearch = '';
	this.containerSearch = '';

	this.turnos = [];

	this.getTurno = () => {
		this.turnos = [];
		let promise;
		if (this.searchBy == 'C'){
			promise = turnosFactory.consultarTurno(this.containerSearch)
		} else {
			promise = turnosFactory.consultarTurnoCamion(this.patenteSearch)
		}
		promise.then((turnos) => {
			this.turnos = turnos;
		}).catch((error) => {
			dialogs.error('Consulta de turnos', error.message);
		});

	}

}]);