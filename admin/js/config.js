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
    });

var inspiniaAdminNS = {};
inspiniaAdminNS.wsUrl = "http://tlsionweb01.excel.com/mercury/cmp/";
inspiniaAdminNS.developmentEnvironment = true; //this MUST be set to false when moving to production