/**
 * Created by artiom on 27/04/15.
 */

myapp.controller('turnosAgendaCtrl', ['$scope', 'moment', 'controlPanelFactory', 'loginService', '$filter', 'turnosFactory', 'socket', 'generalFunctions', function($scope, moment, controlPanelFactory, loginService, $filter, turnosFactory, socket, generalFunctions){

	var currentYear = moment().year();
	var currentMonth = moment().month();

	$scope.dayViewStart = '00:00';

	$scope.loadingState = false;

	$scope.events = [];
	$scope.eventsMes = [];
	$scope.eventosPorDia = [];
	$scope.diaElegido = '';

	$scope.watchDayView = false;
	$scope.j = 1;

	$scope.datosTurnos = {
		fechaInicio: new Date(currentYear, currentMonth, 1),
		fechaFin: new Date(currentYear, currentMonth + 1, 0)
	};

	$scope.model = {
		'fechaInicio': $scope.fechaInicio,
		'fechaFin': $scope.fechaFin,
		'fechaConGMT': true,
		'mov': '',
		'filtroOrden': 'gateTimestamp',
		'filtroOrdenAnterior': '',
		'filtroOrdenReverse': false,
		'order': ''
	};

	$scope.verDetalle = false;
	$scope.currentPage = 1;
	$scope.itemsPerPage = 15;
	$scope.totalItems = 0;
	$scope.turnosGates = true;
	$scope.cargando = false;
	$scope.configPanel = {
		tipo: 'panel-info',
		titulo: 'Turnos',
		mensaje: 'No se han encontrado turnos para los filtros seleccionados.'
	};

	socket.on('appointment', function (data) {
		var fecha = new Date(data.data.inicio);
		var fechaCalendario;
		if (moment.isMoment($scope.calendarDay)){
			fechaCalendario = $scope.calendarDay._d;
		} else {
			fechaCalendario = $scope.calendarDay;
		};
		if (fecha.getMonth() == fechaCalendario.getMonth()){
			var horaHasta = fecha.getHours() + 2;
			if (horaHasta > 24) horaHasta = horaHasta - 24;
			var eventoDia = {
				title: '1 turno de ' + fecha.getHours() + ' a ' + horaHasta,
				type: 'info',
				startsAt: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), fecha.getHours()),
				endsAt: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), fecha.getHours()+2),
				editable: false,
				deletable: false,
				cantidad: 1
			};
			if ($scope.eventosPorDia[fecha.getDate() - 1].eventos.length == 0){
				$scope.eventosPorDia[fecha.getDate() - 1].eventos.push(eventoDia);
			} else {
				var coincide = false;
				$scope.eventosPorDia[fecha.getDate() - 1].eventos.forEach(function(evento){
					if (eventoDia.startsAt == evento.startsAt){
						coincide = true;
						evento.cantidad += 1;
						evento.title = evento.cantidad + ' turnos de ' + eventoDia.startsAt.getHours() + ' a ' + eventoDia.endsAt.getHours();
					}
				});
				if (!coincide){
					$scope.eventosPorDia[fecha.getDate() - 1].eventos.push(eventoDia);
				}
			}

			var nuevoEvento = {
				title: 'Turno ' + $scope.j,
				type: 'info',
				startsAt: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), fecha.getHours()),
				endsAt: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), fecha.getHours() + 2),
				editable: false,
				deletable: false
			};
			$scope.eventsMes.push(nuevoEvento);
			$scope.seleccionarLista();
			$scope.$apply();
		}
	});

	$scope.openDate = function(event){
		generalFunctions.openDate(event);
	};

	$scope.actualizarTurnos = function(calendarDate){
		//if (moment.isMoment(calendarDate)) calendarDate = calendarDate._d;
		$scope.verDetalle = false;
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
	$scope.calendarDay = moment();
	$scope.diaAnterior = new Date();

	$scope.setCalendarToToday = function() {
		$scope.calendarDay = moment();
		$scope.actualizarTurnos($scope.calendarDay._d);
	};

	$scope.eventClicked = function(calendarEvent){
		$scope.model.fechaInicio = calendarEvent.startsAt;
		$scope.model.fechaFin = calendarEvent.endsAt;
		$scope.verDetalle = true;
		$scope.detalleTurnos();
	};

	$scope.eventEdited = function(calendarEvent){
		console.log(calendarEvent);
	};

	$scope.eventDeleted = function(calendarEvent){
		console.log(calendarEvent);
	};

	$scope.timeSpanClicked = function(calendarDate){
		$scope.calendarDay = moment(calendarDate);
		$scope.actualizarTurnos(calendarDate);
	};

	$scope.fechaAnterior = function(){
		$scope.calendarDay = $scope.calendarDay.subtract(1, 'day');
		console.log($scope.calendarDay);
	};

	$scope.fechaHoy = function(){
		$scope.calendarDay = moment();
	};

	$scope.fechaSiguiente = function(){
		$scope.calendarDay = $scope.calendarDay.add(1, 'day');
		console.log($scope.calendarDay);
	};

	$scope.seleccionarLista = function(){
		$scope.verDetalle = false;
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
				if ($scope.events.length > 0) $scope.dayViewStart = moment($scope.events[0].startsAt.getHours(), 'H').format('HH:mm');
				break;
		}
	};

	/*$scope.$on('cambioFechaCalendar', function(event, calendarDate){
		$scope.actualizarTurnos(calendarDate);
	});*/

	$scope.$watch('calendarDay', function(){
		if (moment.isMoment($scope.calendarDay)){
			$scope.actualizarTurnos($scope.calendarDay._d);
		} else {
			$scope.actualizarTurnos($scope.calendarDay);
		}
	});

	$scope.$on('cambioFiltro', function(event, data){
		$scope.currentPage = 1;
		$scope.detalleTurnos();
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
			var i = 1;
			$scope.j = 1;
			graf.forEach(function(turno){
				var horaHasta = turno._id.hour + 2;
				if (horaHasta > 24) horaHasta = horaHasta - 24;
				var eventoDia = {
					title: turno.cnt + ' turnos de ' + turno._id.hour + ' a ' + horaHasta,
					type: 'info',
					startsAt: new Date(turno._id.year, turno._id.month - 1, turno._id.day, turno._id.hour),
					endsAt: new Date(turno._id.year, turno._id.month - 1, turno._id.day, turno._id.hour + 2),
					editable: false,
					deletable: false,
					cantidad: turno.cnt
				};
				$scope.eventosPorDia[turno._id.day - 1].eventos.push(eventoDia);
				for (i=1; i <= turno.cnt; i++){
					var nuevoEvento = {
						title: 'Turno ' + $scope.j,
						type: 'info',
						startsAt: new Date(turno._id.year, turno._id.month - 1, turno._id.day, turno._id.hour),
						endsAt: new Date(turno._id.year, turno._id.month - 1, turno._id.day, turno._id.hour+2),
						editable: false,
						deletable: false
					};
					$scope.j++;
					$scope.eventsMes.push(nuevoEvento);
				}
			});
			$scope.seleccionarLista();
			$scope.loadingState = false;
		});
	};

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
		$scope.detalleTurnos();
	});

	$scope.detalleTurnos = function(){
		$scope.cargando = true;
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.configPanel = {
			tipo: 'panel-info',
			titulo: 'Turnos',
			mensaje: 'No se han encontrado turnos para los filtros seleccionados.'
		};
		turnosFactory.getTurnos($scope.model, $scope.page, function(data){
			if (data.status === "OK"){
				$scope.turnos = data.data;
				$scope.totalItems = data.totalCount;
			} else {
				$scope.configPanel = {
					tipo: 'panel-danger',
					titulo: 'Turnos',
					mensaje: 'Se ha producido un error al cargar los turnos.'
				};
			}
			$scope.cargando = false;
		});
	};

	$scope.cargarTurnos();

}]);