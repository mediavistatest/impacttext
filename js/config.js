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
            templateUrl: "views/common/content.html"
        })
        .state('lists.view', {
            url: "/lists_view",
            templateUrl: "views/lists_view.html",
            data: { pageTitle: 'Lists' }
            //resolve: {
            //    loadPlugin: function ($ocLazyLoad) {
            //        return $ocLazyLoad.load([
            //            {
            //                serie: true,
            //                name: 'angular-flot',
            //                files: [ 'js/plugins/flot/jquery.flot.js', 'js/plugins/flot/jquery.flot.time.js', 'js/plugins/flot/jquery.flot.tooltip.min.js', 'js/plugins/flot/jquery.flot.spline.js', 'js/plugins/flot/jquery.flot.resize.js', 'js/plugins/flot/jquery.flot.pie.js', 'js/plugins/flot/curvedLines.js', 'js/plugins/flot/angular-flot.js', ]
            //            }
            //        ]);
            //    }
            //}
        })
        .state('lists.manage', {
            url: "/lists_manage",
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
            templateUrl: "views/common/content.html"
        })
        .state('messages.inbox', {
            url: "/messages_inbox",
            templateUrl: "views/messages_inbox.html",
            data: { pageTitle: 'Inbox' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css','js/plugins/iCheck/icheck.min.js']
                        }
                    ]);
                }
            }
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
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css','js/plugins/datapicker/datePicker.js']
                        },
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
        .state('messages.scheduled', {
            url: "/messages_scheduled",
            templateUrl: "views/messages_scheduled.html",
            data: { pageTitle: 'Scheduled' }
        })
        .state('messages.sent', {
            url: "/messages_sent",
            templateUrl: "views/messages_sent.html",
            data: { pageTitle: 'Sent Messages' }
        })
        .state('messages.drafts', {
            url: "/messages_drafts",
            templateUrl: "views/messages_drafts.html",
            data: { pageTitle: 'Draft Messages' }
        })
        .state('messages.trash', {
            url: "/messages_trash",
            templateUrl: "views/messages_trash.html",
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
angular
    .module('inspinia')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });

//Some global variables
var inspiniaNS = {};
inspiniaNS.wsUrl = "http://tlsionweb01.excel.com/mercury/cmp/";
//inspiniaNS.wsUrl = "http://impacttext.localhost.rs/ajax.php?todo=";
//inspiniaNS.wsUrl = "ajax.php?todo=";
