/**
 * Created by kolesnikov-a on 23/05/2017.
 */
myapp.controller('turnosConsultaCtrl', ['turnosFactory', 'dialogs', function(turnosFactory, dialogs){

	this.containerSearch = '';
	this.turnos = [];

	this.getTurno = () => {
		this.turnos = [];
		turnosFactory.consultarTurno(this.containerSearch).then((turnos) => {
			this.turnos = turnos;
		}).catch((error) => {
			dialogs.error('Consulta de turnos', error.message);
		});
	}

}]);