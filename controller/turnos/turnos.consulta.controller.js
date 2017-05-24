/**
 * Created by kolesnikov-a on 23/05/2017.
 */
myapp.controller('turnosConsultaCtrl', ['turnosFactory', function(turnosFactory){

	this.containerSearch = '';
	this.turno = null;

	this.getTurno = () => {
		this.turno = null;
		turnosFactory.consultarTurno(this.containerSearch).then((turno) => {
			console.log(turno);
			this.turno = turno;
			console.log(this.turno);
		}).catch((error) => {
			console.log(error);
		});
	}

}]);