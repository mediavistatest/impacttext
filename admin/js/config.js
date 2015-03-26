// configure our routes
    superAdmin.config(function($routeProvider) {
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
    });