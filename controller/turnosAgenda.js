/**
 * Created by artiom on 27/04/15.
 */

myapp.controller('turnosAgendaCtrl', ['$scope', 'moment', function($scope, moment){

	var currentYear = moment().year();
	var currentMonth = moment().month();

	//These variables MUST be set as a minimum for the calendar to work
	$scope.calendarView = 'month';
	$scope.calendarDay = new Date();
	$scope.events = [
		{
			title: 'Event 1',
			type: 'warning',
			starts_at: new Date(currentYear,currentMonth,25,8,30),
			ends_at: new Date(currentYear,currentMonth,25,30)
		},
		{
			title: 'Event 2',
			type: 'info',
			starts_at: new Date(currentYear,currentMonth,19,7,30),
			ends_at: new Date(currentYear,currentMonth,25,9,30)
		},
		{
			title: 'This is a really long event title',
			type: 'important',
			starts_at: new Date(currentYear,currentMonth,25,6,30),
			ends_at: new Date(currentYear,currentMonth,25,6,60)
		}
	];

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
		console.log(calendarDate);
	};

}]);