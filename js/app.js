/**
 * INSPINIA - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 */
(function () {
    angular.module('inspinia', [
    	'ngCookies',					//Cookies
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
        'pascalprecht.translate',        // Angular Translate
        'ui.bootstrap.datetimepicker',        // Datetimepicker
        'ajoslin.promise-tracker',			//promise tracker
        //'angular-momentjs'					//momentjs
    ])
})();

// Other libraries are loaded dynamically in the config.js file using the library ocLazyLoad