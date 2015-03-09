/**
 * INSPINIA - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $httpProvider) {
    $urlRouterProvider.otherwise("/dashboard");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider


        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard.html"
        })
        .state('lists', {
            abstract: true,
            url: "/lists",
            templateUrl: "views/common/content.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ngGrid',
                            files: ['js/plugins/nggrid/ng-grid-2.0.14.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            files: ['js/plugins/nggrid/ng-grid.css']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            files: ['js/plugins/nggrid/plugins/ng-grid-csv-export.js']
                        }
                    ]);
                }
            }
        })
        .state('lists.view', {
            url: "/lists_view",
            templateUrl: "views/lists_view.html",
            data: { pageTitle: 'Lists' }
            //resolve: {
            //    loadPlugin: function ($ocLazyLoad) {
            //        return $ocLazyLoad.load([
            //            {
            //                seria: true,
            //                files: ['css/plugins/dataTables/dataTables.bootstrap.css','js/plugins/dataTables/jquery.dataTables.js','js/plugins/dataTables/dataTables.bootstrap.js']
            //            },
            //            {
            //                name: 'datatables',
            //                files: ['js/plugins/dataTables/angular-datatables.min.js']
            //            }
            //        ]);
            //    }
            //}
            //resolve: {
            //    loadPlugin: function ($ocLazyLoad) {
            //        return $ocLazyLoad.load([
            //            {
            //                name: 'ngGrid',
            //                files: ['js/plugins/nggrid/ng-grid-2.0.14.min.js']
            //            },
            //            {
            //                insertBefore: '#loadBefore',
            //                files: ['js/plugins/nggrid/ng-grid.css']
            //            },
            //            {
            //                files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
            //            },
            //            {
            //                files: ['js/plugins/nggrid/plugins/ng-grid-csv-export.js']
            //            }
            //        ]);
            //    }
            //}
        })
        .state('lists.manage', {
            url: "/lists_manage/:id",
            templateUrl: "views/lists_manage.html",
            data: { pageTitle: 'Manage List' }
            //resolve: {
            //    loadPlugin: function ($ocLazyLoad) {
            //        return $ocLazyLoad.load([
            //            {
            //                reconfig: true,
            //                serie: true,
            //                files: ['js/plugins/rickshaw/vendor/d3.v3.js','js/plugins/rickshaw/rickshaw.min.js']
            //            },
            //            {
            //                reconfig: true,
            //                name: 'angular-rickshaw',
            //                files: ['js/plugins/rickshaw/angular-rickshaw.js']
            //            }
            //        ]);
            //    }
            //}
        })
        .state('lists.add', {
            url: "/lists_add",
            templateUrl: "views/lists_add.html",
            data: { pageTitle: 'Add List' }
        })
        .state('lists.add_contact', {
            url: "/lists_add_contact",
            templateUrl: "views/lists_add_contact.html",
            data: { pageTitle: 'Add Contact' }
        })
        .state('lists.upload', {
            url: "/lists_upload",
            templateUrl: "views/lists_upload.html",
            data: { pageTitle: 'Upload list (file)' }
        })
        .state('messages', {
            abstract: true,
            url: "/messages",
            templateUrl: "views/common/content.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ngGrid',
                            files: ['js/plugins/nggrid/ng-grid-2.0.14.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            files: ['js/plugins/nggrid/ng-grid.css']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            files: ['js/plugins/nggrid/plugins/ng-grid-csv-export.js']
                        },
                        {

                            name: 'cgNotify',

                            files: ['css/plugins/angular-notify/angular-notify.min.css','js/plugins/angular-notify/notify.js']

                        }
                    ]);
                }
            }
        })
        .state('messages.inbox', {
            url: "/messages_inbox",
            templateUrl: "views/messages_inbox_container.html",
            data: { pageTitle: 'Inbox' }
        })
        .state('send', {
            url: "/messages_send",
            templateUrl: "views/messages_send.html",
            data: { pageTitle: 'Compose Message' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'localytics.directives',
                            files: ['css/plugins/chosen/chosen.css','js/plugins/chosen/chosen.jquery.js','js/plugins/chosen/chosen.js']
                        },
                      //  {
                      //      name: 'datePicker',
                      //      files: ['css/plugins/datapicker/angular-datapicker.css','js/plugins/datapicker/datePicker.js']
                      //  },
                        {
                            name: 'cgNotify',
                            files: ['css/plugins/angular-notify/angular-notify.min.css','js/plugins/angular-notify/notify.js']
                        }
                    ]);
                }
            }
        })
        .state('messages.view', {
            url: "/messages_view",
            templateUrl: "views/messages_view.html",
            data: { pageTitle: 'View Message' }
        })
        .state('messages.view_inbox', {
            url: "/messages_view_inbox",
            templateUrl: "views/messages_view_inbox.html",
            data: { pageTitle: 'View Message' }
        })
        .state('messages.view_sent', {
            url: "/messages_view_sent",
            templateUrl: "views/messages_view_sent.html",
            data: { pageTitle: 'View Message' }
        })
        .state('messages.view_scheduled', {
            url: "/messages_view_scheduled",
            templateUrl: "views/messages_view_scheduled.html",
            data: { pageTitle: 'View Message' }
        })
        .state('messages.view_drafts', {
            url: "/messages_view_drafts",
            templateUrl: "views/messages_view_drafts.html",
            data: { pageTitle: 'View Message' }
        })
        .state('messages.view_trash', {
            url: "/messages_view_trash",
            templateUrl: "views/messages_view_trash.html",
            data: { pageTitle: 'View Message' }
        })
        .state('messages.scheduled', {
            url: "/messages_scheduled",
            templateUrl: "views/messages_scheduled_container.html",
            data: { pageTitle: 'Scheduled' }
        })
        .state('messages.sent', {
            url: "/messages_sent",
            templateUrl: "views/messages_sent_container.html",
            data: { pageTitle: 'Sent Messages' }
        })
        .state('messages.drafts', {
            url: "/messages_drafts",
            templateUrl: "views/messages_drafts_container.html",
            data: { pageTitle: 'Draft Messages' }
        })
        .state('messages.trash', {
            url: "/messages_trash",
            templateUrl: "views/messages_trash_container.html",
            data: { pageTitle: 'Trash' }
        })
        .state('tools', {
            url: "/tools",
            templateUrl: "views/tools.html",
            data: { pageTitle: 'Tools' }
        })
        .state('reports', {
            url: "/reports",
            templateUrl: "views/reports.html",
            data: { pageTitle: 'Reports' }
        })
        .state('support', {
            url: "/support",
            templateUrl: "views/support.html",
            data: { pageTitle: 'Support' }
        });

   //Setting defaults for http requests
   $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
}
var app = angular
	.module('inspinia')
	.config(config)
	.factory('authInterceptor', ['$rootScope', '$q', '$window', function($rootScope, $q, $window) {
		return {
			request: function(request) {
				return request;
			},
			response: function(response) {
				if(response.status == 401) {
					$window.location.href = "/login.html";
				}
				return response || $q.when(response);
			},
			responseError: function (response) {
				if (response.status === 401) {
					$window.location.href = "/login.html";
				}
				return $q.reject(response);
			}
		};
	}])
	.config(['$httpProvider',function($httpProvider) {
		//Http Intercpetor to check auth failures for xhr requests
		$httpProvider.interceptors.push('authInterceptor');
	}])
	.run(function($rootScope, $state) {
		$rootScope.$state = $state;
	});

//Some global variables
var inspiniaNS = {};
inspiniaNS.wsUrl = "http://tlsionweb01.excel.com/mercury/cmp/";
//inspiniaNS.wsUrl = "http://impacttext.localhost.rs/ajax.php?todo=";
//inspiniaNS.wsUrl = "ajax.php?todo=";
