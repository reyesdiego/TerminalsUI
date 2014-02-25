/**
 * Created by kolesnikov-a on 21/02/14.
 */

Array.prototype.contains = function (item) {
	var result = false;
	this.forEach(function (data) {
		if (data === item)
			result = true;
		return result;
	});
	return result;
};

var serverUrl = 'http://200.123.104.182:8080';

var myapp = angular.module('myapp', ['ui.router','ui.bootstrap', 'dialogs']);

myapp.config(['$httpProvider', function ($httpProvider) {

	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	$httpProvider.defaults.transformRequest = [function (data) {
		/**
		 * The workhorse; converts an object to x-www-form-urlencoded serialization.
		 * @param {Object} obj
		 * @return {String}
		 */
		var param = function (obj) {
			var query = '';
			var name, value, fullSubName, subName, subValue, innerObj, i;

			for (name in obj) {
				value = obj[name];

				if (value instanceof Array) {
					for (i = 0; i < value.length; ++i) {
						subValue = value[i];
						fullSubName = name + '[' + i + ']';
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += param(innerObj) + '&';
					}
				}
				else if (value instanceof Object) {
					for (subName in value) {
						subValue = value[subName];
						fullSubName = name + '[' + subName + ']';
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += param(innerObj) + '&';
					}
				}
				else if (value !== undefined && value !== null) {
					query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
				}
			}

			return query.length ? query.substr(0, query.length - 1) : query;
		};

		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];
}]);

myapp.config(function ($stateProvider, $urlRouterProvider) {

	// For any unmatched url, send to /route1
	$urlRouterProvider.otherwise("/register");

	//noinspection JSValidateTypes
	$stateProvider
		.state('register', {
			url: "/register",
			templateUrl: "view/register.html",
			controller: registerCtrl
		})
		.state('route1.list', {
			url: "/list",
			templateUrl: "route1.list.html",
			controller: function ($scope) {
				$scope.items = ["A", "List", "Of", "Items"];
			}
		})
		.state('tarifario', {
			url: "/pricelist",
			templateUrl: "view/pricelist.html",
			controller: pricelistCtrl
		})
		.state('route2.list', {
			url: "/list",
			templateUrl: "route2.list.html",
			controller: function ($scope) {
				$scope.things = ["A", "Set", "Of", "Things"];
			}
		})
		.state('invoices', {
			url: "/invoices",
			templateUrl: "view/invoices.html",
			controller: invoicesCtrl
		})
		.state('matches', {
			url: "/match",
			templateUrl: "view/matchprices.html",
			controller: matchPricesCtrl
		})
		.state('control', {
			url: "/control",
			templateUrl: "view/control.html",
			controller: controlCtrl
		})
		.state('correlativo', {
			url: "/correlatividad",
			templateUrl: "view/correlatividad.html",
			controller: correlativoCtrl
		})
});