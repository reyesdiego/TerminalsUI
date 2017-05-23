/**
 * Created by kolesnikov-a on 23/05/2017.
 */
myapp.controller('turnosConsultaCtrl', ['turnosFactory', function(turnosFactory){

	this.containerSearch = '';

	this.getTurno = () => {
		turnosFactory.consultarTurno(this.containerSearch).then((turnosData) => {
			console.log(turnosData);
		}).catch((error) => {
			console.log(error);
		});
	}

}]);