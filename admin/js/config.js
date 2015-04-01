// configure our routes
    superAdmin.config(function($routeProvider, $httpProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'views/home.html',
                controller  : 'mainController'
            })

            // route for the about page
            .when('/manage_account', {
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