/**
 * Created by kolesnikov-a on 23/05/2017.
 */
myapp.controller('turnosConsultaCtrl', ['turnosFactory', 'dialogs', function(turnosFactory, dialogs){

	this.containerSearch = '';
	this.turno = null;

	this.getTurno = () => {
		this.turno = null;
		turnosFactory.consultarTurno(this.containerSearch).then((turno) => {
			this.turno = turno;
		}).catch((error) => {
			dialogs.error('Consulta de turnos', error.message);
		});
	}

}]);