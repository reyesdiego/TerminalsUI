/**
 * Created by Diego Reyes on 1/29/14.
 */
'use strict';
var myApp = angular.module('myApp', []);
//var  serverUrl = 'http://200.70.5.169:640';
var  serverUrl = 'http://localhost:3101';

myApp.config(['$httpProvider', function($httpProvider) {

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

function matchCtrl($scope, $http, $templateCache){

	var inserturl = serverUrl + '/agp/pricelist';
	$http({
		method: 'GET',
		url: inserturl,
		cache: $templateCache
	}).success(function(data) {
			console.log("success");
			$scope.pricelist = data;
		}).error(function(response) {
			console.log("error");
		});

}
