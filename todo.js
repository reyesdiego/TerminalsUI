var myApp = angular.module('myApp', []);
//var  serverUrl = 'http://200.5.223.9:8080';
var  serverUrl = 'http://localhost:8081';

myApp.config(['$httpProvider', function($httpProvider) {
//	$httpProvider.defaults.useXDomain = true;
//	delete $httpProvider.defaults.headers.common['X-Requested-With'];

	// Use x-www-form-urlencoded Content-Type
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	// Override $http service's default transformRequest
	$httpProvider.defaults.transformRequest = [function(data)
	{

		/**
		 * The workhorse; converts an object to x-www-form-urlencoded serialization.
		 * @param {Object} obj
		 * @return {String}
		 */
		var param = function(obj)
		{
			var query = '';
			var name, value, fullSubName, subName, subValue, innerObj, i;

			for(name in obj)
			{
				value = obj[name];

				if(value instanceof Array)
				{
					for(i=0; i<value.length; ++i)
					{
						subValue = value[i];
						fullSubName = name + '[' + i + ']';
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += param(innerObj) + '&';
					}
				}
				else if(value instanceof Object)
				{
					for(subName in value)
					{
						subValue = value[subName];
						fullSubName = name + '[' + subName + ']';
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += param(innerObj) + '&';
					}
				}
				else if(value !== undefined && value !== null)
				{
					query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
				}
			}

			return query.length ? query.substr(0, query.length - 1) : query;
		};

		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];

}
]);

function TodoCtrl($scope, $http, $templateCache) {

	$http({
		method:	'GET',
		url:	serverUrl + '/agp/prices'
	}).success(function(data){
			$scope.todos = data;

	});

	$scope.addTodo = function() {

		var formData = {
							"code":			$scope.todoCode,
							"description":	$scope.todoText,
							"topPrice":		$scope.todoPrice,
							"unit":			$scope.unit,
							"currency":		$scope.currency
						};

		var inserturl = serverUrl + '/agp/price';
		$http({
			method: 'POST',
			url: inserturl,
			data: formData
		}).
			success(function(response) {
				console.log("success");
				$scope.codeStatus = response.data;
				console.log($scope.codeStatus);
				$scope.todos.push(formData);
				formClean();
			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});
	};

	$scope.remaining = function() {
		var count = 0;
		angular.forEach($scope.todos, function(todo) {
			count += todo.done ? 0 : 1;
		});
		return count;
	};

	$scope.archive = function() {
		var oldTodos = $scope.todos;
		$scope.todos = [];
		angular.forEach(oldTodos, function(todo) {
			if (!todo.done) $scope.todos.push(todo);
			else console.log(todo);
		});
	};

	function formClean(){
		$scope.todoText = '';
		$scope.todoCode = '';
		$scope.todoPrice = '';
	}
}