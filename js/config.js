function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $httpProvider) {
    $urlRouterProvider.otherwise("/dashboard");
    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug : false
    });
    $stateProvider.state('dashboard', {
        url : "/dashboard",
        templateUrl : "views/dashboard.html",
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore : '#loadBefore',
                    name : 'angles',
                    files : ['js/plugins/chartJs/Chart.min.js', 'js/plugins/chartJs/angles.js']
                }, {
                    insertBefore : '#loadBefore',
                    files : ['css/plugins/fullcalendar/fullcalendar.css', 'js/plugins/fullcalendar/fullcalendar.min.js'
                    //'js/plugins/fullcalendar/gcal.js'
                    ]
                }, {
                    name : 'ui.calendar',
                    files : ['js/plugins/fullcalendar/calendar.js']
                }
                //{
                //    insertBefore: '#loadBefore',
                //    name: 'chart.js',
                //    files: ['js/plugins/chartJs/angular-chart.css' , 'js/plugins/chartJs/Chart.min.js' , 'js/plugins/chartJs/angular-chart.js']
                //}
                ]);
            }
        }
    }).state('profile', {
        url : "/profile",
        templateUrl : "views/profile.html",
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore : '#loadBefore',
                    name : 'angles',
                    files : ['js/plugins/chartJs/Chart.min.js', 'js/plugins/chartJs/angles.js']
                }
                //{
                //    insertBefore: '#loadBefore',
                //    name: 'chart.js',
                //    files: ['js/plugins/chartJs/angular-chart.css' , 'js/plugins/chartJs/Chart.min.js' , 'js/plugins/chartJs/angular-chart.js']
                //}
                ]);
            }
        }
    }).state('change-plan', {
        url : "/change_plan",
        templateUrl : "views/change_plan.html",
        data : {
            pageTitle : 'Change Plan'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    files : ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                }, {
                    insertBefore : '#loadBefore',
                    name : 'localytics.directives',
                    files : ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
                },
                //  {
                //      name: 'datePicker',
                //      files: ['css/plugins/datapicker/angular-datapicker.css','js/plugins/datapicker/datePicker.js']
                //  },
                {
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('contacts', {
        url : "/contacts",
        templateUrl : "views/contacts.html",
        data : {
            pageTitle : 'Contacts'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }, {
                    name : 'ngGrid',
                    files : ['js/plugins/nggrid/ng-grid-2.0.14.min.js']
                }, {
                    insertBefore : '#loadBefore',
                    files : ['js/plugins/nggrid/ng-grid.css']
                }, {
                    files : ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                }, {
                    files : ['js/plugins/nggrid/plugins/ng-grid-csv-export.js']
                }, {
                    insertBefore : '#loadBefore',
                    name : 'localytics.directives',
                    files : ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
                }]);
            }
        }
    }).state('lists', {
        abstract : true,
        url : "/lists",
        templateUrl : "views/common/content.html",
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'ngGrid',
                    files : ['js/plugins/nggrid/ng-grid-2.0.14.min.js']
                }, {
                    insertBefore : '#loadBefore',
                    files : ['js/plugins/nggrid/ng-grid.css']
                }, {
                    files : ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                }, {
                    files : ['js/plugins/nggrid/plugins/ng-grid-csv-export.js']
                }, {
                    insertBefore : '#loadBefore',
                    name : 'localytics.directives',
                    files : ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
                }]);
            }
        }
    }).state('lists.view', {
        url : "/lists_view",
        templateUrl : "views/lists_view.html",
        data : {
            pageTitle : 'Lists'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
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
    }).state('lists.manage', {
        url : "/lists_manage/:id",
        templateUrl : "views/lists_manage.html",
        data : {
            pageTitle : 'Manage List'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
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
    }).state('lists.segments', {
        url : "/lists_segments/:id",
        templateUrl : "views/lists_segments.html",
        data : {
            pageTitle : 'Manage Segments'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('lists.add_segment', {
        url : "/lists_add_segment",
        templateUrl : "views/lists_add_segment.html",
        data : {
            pageTitle : 'Add Segment'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('lists.manage_segment', {
        url : "/lists_manage_segment/:id",
        templateUrl : "views/lists_manage_segment.html",
        data : {
            pageTitle : 'Manage Segment'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('lists.add', {
        url : "/lists_add",
        templateUrl : "views/lists_add.html",
        data : {
            pageTitle : 'Add List'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('lists.add_contact', {
        url : "/lists_add_contact",
        templateUrl : "views/lists_add_contact.html",
        data : {
            pageTitle : 'Add Contact'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('lists.manage_contact', {
        url : "/lists_manage_contact/:id",
        templateUrl : "views/lists_manage_contact.html",
        data : {
            pageTitle : 'Manage Contact'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('lists.upload', {
        url : "/lists_upload",
        templateUrl : "views/lists_upload.html",
        data : {
            pageTitle : 'Upload list (file)'
        }
    }).state('messages', {
        abstract : true,
        url : "/messages",
        templateUrl : "views/common/content.html",
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'ngGrid',
                    files : ['js/plugins/nggrid/ng-grid-2.0.14.min.js']
                }, {
                    insertBefore : '#loadBefore',
                    files : ['js/plugins/nggrid/ng-grid.css']
                }, {
                    files : ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                }, {
                    files : ['js/plugins/nggrid/plugins/ng-grid-csv-export.js']
                }, {
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }, {
                    insertBefore : '#loadBefore',
                    name : 'localytics.directives',
                    files : ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
                }]);
            }
        }
    }).state('messages.inbox', {
        url : "/messages_inbox",
        templateUrl : "views/messages_inbox_container.html",
        data : {
            pageTitle : 'Inbox'
        }
    }).state('send', {
        url : "/messages_send",
        templateUrl : "views/messages_send.html",
        data : {
            pageTitle : 'Compose Message'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    files : ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                }, {
                    insertBefore : '#loadBefore',
                    name : 'localytics.directives',
                    files : ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
                },
                //  {
                //      name: 'datePicker',
                //      files: ['css/plugins/datapicker/angular-datapicker.css','js/plugins/datapicker/datePicker.js']
                //  },
                {
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('messages.view', {
        url : "/messages_view",
        templateUrl : "views/messages_view.html",
        data : {
            pageTitle : 'View Message'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('messages.view_inbox', {
        url : "/messages_view_inbox",
        templateUrl : "views/messages_view_inbox.html",
        data : {
            pageTitle : 'View Message'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('messages.view_sent', {
        url : "/messages_view_sent",
        templateUrl : "views/messages_view_sent.html",
        data : {
            pageTitle : 'View Message'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('messages.view_scheduled', {
        url : "/messages_view_scheduled",
        templateUrl : "views/messages_view_scheduled.html",
        data : {
            pageTitle : 'View Message'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('messages.view_recurring', {
        url : "/messages_view_recurring",
        templateUrl : "views/messages_view_recurring.html",
        data : {
            pageTitle : 'View Message'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('messages.view_drafts', {
        url : "/messages_view_drafts",
        templateUrl : "views/messages_view_drafts.html",
        data : {
            pageTitle : 'View Message'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('messages.view_trash', {
        url : "/messages_view_trash",
        templateUrl : "views/messages_view_trash.html",
        data : {
            pageTitle : 'View Message'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('messages.scheduled', {
        url : "/messages_scheduled",
        templateUrl : "views/messages_scheduled_container.html",
        data : {
            pageTitle : 'Scheduled'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('messages.recurring', {
        url : "/messages_recurring",
        templateUrl : "views/messages_recurring_container.html",
        data : {
            pageTitle : 'Recurring'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('messages.sent', {
        url : "/messages_sent",
        templateUrl : "views/messages_sent_container.html",
        data : {
            pageTitle : 'Sent Messages'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('messages.drafts', {
        url : "/messages_drafts",
        templateUrl : "views/messages_drafts_container.html",
        data : {
            pageTitle : 'Draft Messages'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('messages.trash', {
        url : "/messages_trash",
        templateUrl : "views/messages_trash_container.html",
        data : {
            pageTitle : 'Trash'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('tools', {
        abstract : true,
        url : "/tools",
        templateUrl : "views/common/content.html"
    }).state('tools.general', {
        url : "/tools_general",
        templateUrl : "views/tools/general.html",
        data : {
            pageTitle : 'Tools'
        }
    }).state('tools.activity_log', {
        url : "/tools_activity_log",
        templateUrl : "views/tools/activity_log.html",
        data : {
            pageTitle : 'Activity Log'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }, {
                    name : 'ngGrid',
                    files : ['js/plugins/nggrid/ng-grid-2.0.14.min.js']
                }, {
                    insertBefore : '#loadBefore',
                    files : ['js/plugins/nggrid/ng-grid.css']
                }, {
                    files : ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                }, {
                    insertBefore : '#loadBefore',
                    name : 'localytics.directives',
                    files : ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
                }]);
            }
        }
    })
    // .state('settings', {
    // url: "/settings",
    // templateUrl: "views/settings.html",
    // data: { pageTitle: 'Settings' }
    // })
    .state('settings', {
        abstract : true,
        url : "/settings",
        templateUrl : "views/common/content.html",
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'ngGrid',
                    files : ['js/plugins/nggrid/ng-grid-2.0.14.min.js']
                }, {
                    insertBefore : '#loadBefore',
                    files : ['js/plugins/nggrid/ng-grid.css']
                }, {
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }, {
                    files : ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                }, {
                    insertBefore : '#loadBefore',
                    name : 'localytics.directives',
                    files : ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
                }]);
            }
        }
    }).state('settings.basic', {
        url : "/settings_account",
        templateUrl : "views/settings_basic_container.html",
        data : {
            pageTitle : 'Settings Basic'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('settings.numbers', {
        url : "/settings_numbers",
        templateUrl : "views/settings_numbers_container.html",
        data : {
            pageTitle : 'Settings Numbers'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('settings.messages', {
        url : "/settings_messages",
        templateUrl : "views/settings_messages_container.html",
        data : {
            pageTitle : 'Message Settings'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).state('settings.autoresponders', {
        url : "/settings_autoresponders",
        templateUrl : "views/settings_autoresponders_container.html",
        data : {
            pageTitle : 'Settings Autoresponders'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    }).
    // Reports -------------------
    state('reports', {
        abstract : true,
        url : "/reports",
        templateUrl : "views/common/content.html",
        data : {
            pageTitle : 'Reports'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'ngGrid',
                    files : ['js/plugins/nggrid/ng-grid-2.0.14.min.js']
                }, {
                    insertBefore : '#loadBefore',
                    files : ['js/plugins/nggrid/ng-grid.css']
                }, {
                    files : ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                }, {
                    files : ['js/plugins/nggrid/plugins/ng-grid-csv-export.js']
                }, {
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }, {
                    insertBefore : '#loadBefore',
                    name : 'localytics.directives',
                    files : ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
                }, {
                    insertBefore : '#loadBefore',
                    name : 'angles',
                    files : ['js/plugins/chartJs/Chart.min.js', 'js/plugins/chartJs/angles.js']
                }]);
            }
        }
    }).state('reports.new', {
        url : "/reports_new",
        templateUrl : "views/reports_new.html",
        data : {
            pageTitle : 'View report'
        }
    }).state('reports.scheduled', {
        url : "/reports_scheduled",
        templateUrl : "views/reports_scheduled_container.html",
        data : {
            pageTitle : 'Scheduled reports'
        }
    // Support -------------------
    }).state('support', {
        url : "/support",
        templateUrl : "views/support.html",
        data : {
            pageTitle : 'Support'
        }
    // Account -------------------
    }).state('account', {
        url : "/account",
        templateUrl : "views/account.html",
        data : {
            pageTitle : 'My account'
        },
        resolve : {
            loadPlugin : function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name : 'ngGrid',
                    files : ['js/plugins/nggrid/ng-grid-2.0.14.min.js']
                }, {
                    insertBefore : '#loadBefore',
                    files : ['js/plugins/nggrid/ng-grid.css']
                }, {
                    files : ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                }, {
                    files : ['js/plugins/nggrid/plugins/ng-grid-csv-export.js']
                }, {
                    insertBefore : '#loadBefore',
                    name : 'localytics.directives',
                    files : ['css/plugins/chosen/chosen.css', 'js/plugins/chosen/chosen.jquery.js', 'js/plugins/chosen/chosen.js']
                },{
                    name : 'cgNotify',
                    files : ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/notify.js']
                }]);
            }
        }
    });
    //Setting defaults for http requests
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
}

var app = angular.module('inspinia').config(config).factory('authInterceptor', ['$rootScope', '$q', '$window',
function($rootScope, $q, $window) {
    return {
        request : function(request) {
            return request;
        },
        response : function(response) {
            if (response.status == 401) {
                $window.location.href = "/login.html";
            }
            return response || $q.when(response);
        },
        responseError : function(response) {
            if (response.status === 401) {
                $window.location.href = "/login.html";
            }
            return $q.reject(response);
        }
    };
}]).config(['$httpProvider',
function($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authInterceptor');
}]).run(function($rootScope, $state, $cookieStore) {
    $rootScope.$state = $state;
    $rootScope.hide_loading = Boolean($cookieStore.get('inspinia_account_id'));
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $rootScope.hide_loading = Boolean($cookieStore.get('inspinia_account_id'));
    });
});
app.filter('iif', function() {
    return function(input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
    };
});
//Some global variables
var inspiniaNS = {};
inspiniaNS.wsUrl = "http://tlsionweb01.excel.com/mercury/cmp/";
inspiniaNS.maUrl = 'http://dalmw01.matrixvalue.com:83/us/MyAccount/LogOn';
if ((window.location.href.indexOf('portal.impacttext.com') > -1) || (window.location.href.indexOf('tceng.workingpanel.com') > -1)) {
    inspiniaNS.wsUrl = 'http://tc-api.impacttext.com/';
    inspiniaNS.maUrl = 'https://myaccount.impacttelecom.com/us/MyAccount/LogOn';
}
//inspiniaNS.wsUrl = "http://api.impacttext.com/";
//inspiniaNS.wsUrl = "http://impacttext.localhost.rs/ajax.php?todo=";
//inspiniaNS.wsUrl = "ajax.php?todo=";