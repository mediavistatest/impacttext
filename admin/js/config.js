// configure our routes
superAdmin.config(function($routeProvider, $httpProvider) {
	$routeProvider

		// route for the home page
		.when('/', {
		templateUrl : 'views/home.html',
		controller  : 'mainController'
	})

		// route for the add account page
		.when('/manage_account', {
			templateUrl : 'views/manage_account.html'
		})
		// route for the edit account page
		.when('/manage_account/:accountId', {
			templateUrl : 'views/manage_account.html'
		});

	// route for the contact page
	//.when('/contact', {
	//    templateUrl : 'views/contact.html',
	//    controller  : 'contactController'
	//});

	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
})
.factory('authInterceptor', ['$rootScope', '$q', '$window', function($rootScope, $q, $window) {
	return {
		request: function(request) {
			return request;
		},
		response: function(response) {
			if (response.status == 401) {
				$window.location.href = "/admin/login.html";
			}
			return response || $q.when(response);
		},
		responseError: function (response) {
			if (response.status === 401) {
				$window.location.href = "/admin/login.html";
			}
			return $q.reject(response);
		}
	};
}])
.config(['$httpProvider',function($httpProvider) {
	//Http Intercpetor to check auth failures for xhr requests
	$httpProvider.interceptors.push('authInterceptor');
}]);

var inspiniaAdminNS = {};
inspiniaAdminNS.wsUrl = "http://tlsionweb01.excel.com/mercury/cmp/";
inspiniaAdminNS.developmentEnvironment = true; //this MUST be set to false when moving to production

if(window.location.href.indexOf('xchangetel.impacttext.com') > -1){
	inspiniaAdminNS.wsUrl = 'http://api.impacttext.com/';
	inspiniaAdminNS.developmentEnvironment = false; //this MUST be set to false when moving to production
}

var HARDCODED = {
	globalShortCode: '97996'
};