/**
 * Created by kolesnikov-a on 23/05/2017.
 */
myapp.controller('turnosConsultaCtrl', ['$scope', 'turnosFactory', 'consultaTurnosSocket', 'dialogs', 'containersList', 'patentesList', '$uibModal',
	function($scope, turnosFactory, consultaTurnosSocket, dialogs, containersList, patentesList, $uibModal){

		this.containersList = containersList;
		this.patentesList = patentesList;

		this.searchBy = 'C';

		this.patenteSearch = '';
		this.containerSearch = '';

		this.turnos = [];

		this.patenteDataFlag = false;

		this.getTurno = () => {
			this.patenteDataFlag = false;
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
		};

		this.detalleCamion = () => {
			$uibModal.open({
				templateUrl: 'view/turnos/camion.detalle.modal.html',
				scope: $scope
			});
		};

		consultaTurnosSocket.on('cnrt', (data) => {
			$scope.patenteData = data;
			this.patenteDataFlag = true;
		})

	}]);