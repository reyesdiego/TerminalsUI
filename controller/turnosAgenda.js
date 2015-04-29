/**
 * Created by artiom on 27/04/15.
 */

myapp.controller('turnosAgendaCtrl', ['$scope', 'moment', 'controlPanelFactory', 'loginService', '$filter', function($scope, moment, controlPanelFactory, loginService, $filter){

	var currentYear = moment().year();
	var currentMonth = moment().month();

	$scope.loadingState = false;

	$scope.events = [];
	$scope.eventsMes = [];
	$scope.eventosPorDia = [];
	$scope.diaElegido = '';

	$scope.datosTurnos = {
		fechaInicio: new Date(currentYear, currentMonth, 1),
		fechaFin: new Date(currentYear, currentMonth + 1, 0)
	};

	$scope.actualizarTurnos = function(calendarDate){
		$scope.diaElegido = calendarDate.getDate();
		if ($scope.diaAnterior.getMonth() != calendarDate.getMonth()){
			$scope.datosTurnos = {
				fechaInicio: new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1),
				fechaFin: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0)
			};
			$scope.cargarTurnos();
		} else {
			$scope.seleccionarLista();
		}
		$scope.diaAnterior = calendarDate;
	};

	//These variables MUST be set as a minimum for the calendar to work
	$scope.calendarView = 'month';
	$scope.calendarDay = new Date();
	$scope.diaAnterior = new Date();

	$scope.setCalendarToToday = function() {
		$scope.calendarDay = new Date();
		$scope.actualizarTurnos($scope.calendarDay);
	};

	$scope.eventClicked = function(calendarEvent){
		console.log(calendarEvent);
	};

	$scope.eventEdited = function(calendarEvent){
		console.log(calendarEvent);
	};

	$scope.eventDeleted = function(calendarEvent){
		console.log(calendarEvent);
	};

	$scope.timeSpanClicked = function(calendarDate){
		$scope.actualizarTurnos(calendarDate);
	};

	$scope.seleccionarLista = function(){
		switch ($scope.calendarView){
			case 'month':
			case 'week':
				$scope.events = angular.copy($scope.eventsMes);
				break;
			case 'day':
				var diaSelected = [];
				$scope.eventosPorDia.forEach(function(dia){
					if (dia.dia == $scope.diaElegido){
						diaSelected = angular.copy(dia.eventos);
					}
				});
				$scope.events = angular.copy(diaSelected);
				break;
		}
	};

	$scope.$on('cambioFechaCalendar', function(event, calendarDate){
		$scope.actualizarTurnos(calendarDate);
	});

	$scope.$watch('calendarView', function(){
		$scope.seleccionarLista();
	});

	$scope.cargarTurnos = function(){
		$scope.loadingState = true;
		$scope.events = [];
		$scope.eventsMes = [];
		$scope.eventosPorDia = [];
		var i;
		for (i = 1; i <= $scope.datosTurnos.fechaFin.getDate(); i++){
			var eventosDia = {
				dia: i,
				eventos: []
			};
			$scope.eventosPorDia.push(eventosDia);
		}
		controlPanelFactory.getTurnosDia($scope.datosTurnos, function(graf){
			graf = $filter('filter')(graf, loginService.getFiltro(), false);
			var i = 1, j = 1;
			graf.forEach(function(turno){
				var horaHasta = turno._id.hour + 2;
				if (horaHasta > 24) horaHasta = horaHasta - 24;
				var eventoDia = {
					title: turno.cnt + ' turnos de ' + turno._id.hour + ' a ' + horaHasta,
					type: 'info',
					starts_at: new Date(turno._id.year, turno._id.month - 1, turno._id.day, turno._id.hour),
					ends_at: new Date(turno._id.year, turno._id.month - 1, turno._id.day, turno._id.hour+2),
					editable: false,
					deletable: false
				};
				$scope.eventosPorDia.forEach(function(dia){
					if (dia.dia == turno._id.day){
						dia.eventos.push(eventoDia);
					}
				});
				if (eventoDia.starts_at.getDate() != eventoDia.ends_at.getDate()){
					$scope.eventosPorDia.forEach(function(dia){
						if (dia.dia == eventoDia.ends_at.getDate()){
							dia.eventos.push(eventoDia);
						}
					});
				}
				for (i=1; i <= turno.cnt; i++){
					var nuevoEvento = {
						title: 'Turno ' + j,
						type: 'info',
						starts_at: new Date(turno._id.year, turno._id.month - 1, turno._id.day, turno._id.hour),
						ends_at: new Date(turno._id.year, turno._id.month - 1, turno._id.day, turno._id.hour+2),
						editable: false,
						deletable: false
					};
					j++;
					$scope.eventsMes.push(nuevoEvento);
				}
			});
			$scope.seleccionarLista();
			$scope.loadingState = false;
		});
	};

	$scope.cargarTurnos();

}]);