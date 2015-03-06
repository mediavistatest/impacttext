var ngInbox = {
    _internal : {
        ErrorMsg : '',
        DataConstructors : {
            PageOptions : function() {
                var self = this;
                self.pageSizes = [2, 5, 10];
                self.pageSize = 5;
                self.currentPage = 1;
            },
            FilterOptions : function() {
                var self = this;
                self.filterText = '';
            }
        },
        Methods : {
            SetPagingDataSliced : function($scope, data, totalResultsCount) {
                $scope.ngData = data;
                $scope.totalServerItems = totalResultsCount;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            },
            GetPagedDataAsync : function(controllerParent) {
                console.log(controllerParent.Status)
                var pageSize = controllerParent.$scope.pagingOptions.pageSize;
                var page = controllerParent.$scope.pagingOptions.currentPage;

                var searchText = controllerParent.$scope.filterOptions.filterText;
                var params = {
                    apikey : controllerParent.$cookieStore.get('inspinia_auth_token'),
                    accountID : controllerParent.$cookieStore.get('inspinia_account_id'),
                    limit : pageSize,
                    offset : (page - 1) * pageSize,
                    status : controllerParent.Status
                };

                if (searchText) {
                    params.search = searchText.toLowerCase();
                }

                var $param = $.param(params);

                //POST
                controllerParent.$http.post(inspiniaNS.wsUrl + controllerParent.Action, $param)
                // success function
                .success(function(result) {
                    console.log(result)
                    // Contact/List repack
                    for (var i in result.apidata) {
                        var message = result.apidata[i];
                        if (message.contactListID == '0') {
                            message.con_lis = message.ANI;
                        } else {
                            message.con_lis = message.contactListName;
                        }
                    }
                    controllerParent.$scope.setPagingDataSliced(controllerParent.$scope, result.apidata, result.apicount);
                })
                // error function
                .error(function(data, status, headers, config) {
                    alert(ngInbox._internal.ErrorMsg);
                });
            },
            PopulateScope : function(controllerParent) {
                ngInbox._internal.ErrorMsg = controllerParent.errorMessage;

                controllerParent.$scope.mySelections = [];
                controllerParent.$scope.totalServerItems = 0;
                controllerParent.$scope.pagingOptions = new ngInbox._internal.DataConstructors.PageOptions();
                controllerParent.$scope.filterOptions = new ngInbox._internal.DataConstructors.FilterOptions();

                //GET DATA
                controllerParent.$scope.setPagingDataSliced = ngInbox._internal.Methods.SetPagingDataSliced;
                controllerParent.$scope.getPagedDataAsync = ngInbox._internal.Methods.GetPagedDataAsync;

                //WHATCH
                controllerParent.$scope.$watch('pagingOptions', function() {
                    controllerParent.$scope.getPagedDataAsync(controllerParent);
                }, true);

                controllerParent.$scope.$watch('filterOptions', function() {
                    controllerParent.$scope.getPagedDataAsync(controllerParent);
                }, true);

                //INITIAL GET DATA
                controllerParent.$scope.getPagedDataAsync(controllerParent);

                //TABLE OPTIONS
                controllerParent.$scope.ngOptions = {
                    data : 'ngData',
                    enableSorting : true,
                    useExternalSorting: true,
                    sortInfo : controllerParent.$scope.sortOptions,
                    rowHeight : 60,
                    selectedItems : controllerParent.$scope.mySelections,
                    showSelectionCheckbox : true,
                    multiSelect : true,
                    selectWithCheckboxOnly : true,
                    enablePaging : true,
                    showFooter : true,
                    footerTemplate : 'views/table/footerTemplate.html',
                    totalServerItems : 'totalServerItems',
                    pagingOptions : controllerParent.$scope.pagingOptions,
                    filterOptions : controllerParent.$scope.filterOptions,
                    columnDefs : controllerParent.columnDefs,
                };

                controllerParent.$scope.controllerParent = controllerParent;
            }
        }
    },
    InboxList : {
        Action : 'messages_inbound',
        Status : 'U',
        columnDefs : [{
            field : 'sourceANI',
            displayName : 'Contact',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            field : 'message',
            displayName : 'Message',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            field : 'createdDate',
            displayName : 'Date',
        }, {
            field : '',
            displayName : 'List'
        }],
        errorMessage : 'Unexpected error occurred when trying to fetch inbox messages list!',
        hashUrlviewMessage : 'messages.view_inbox',
        $scope : null,
        $http : null,
        $cookieStore : null,
        clickedMessage : null,
        list : true,
        Events : {
            Message_onClick : function(inParent, row) {
                inParent.clickedMessage = row.entity;
                inParent.list = false;
                //console.log(row,controllerParent.clickedMessage)
                console.log(inParent.$scope.controllerParent.clickedMessage)
            },
            InitialiseEvents : function(controllerParent) {
            }
        },
        Controller : function($scope, $http, $cookieStore) {
            //Controler parrent setting !!!!
            var controllerParent = ngInbox.InboxList;

            controllerParent.$scope = $scope;
            controllerParent.$http = $http;
            controllerParent.$cookieStore = $cookieStore;

            ngInbox._internal.Methods.PopulateScope(controllerParent);
            controllerParent.Events.InitialiseEvents(controllerParent);
        }
    },
    SentList : {
        Action : 'messages_outbound',
        Status : 'C',
        columnDefs : [{
            field : 'con_lis',
            displayName : 'Contact/List',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            field : 'message',
            displayName : 'Message',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            field : 'sendEndDate',
            displayName : 'Date sent',
        }, {
            cellTemplate : 'views/table/ManageTemplateCol.html'
        }],
        errorMessage : 'Unexpected error occurred when trying to fetch sent messages list!',
        hashUrlviewMessage : 'messages.view_sent',
        $scope : null,
        $http : null,
        $cookieStore : null,
        clickedMessage : null,
        list : true,
        Events : {
            Message_onClick : function(inParent, row) {
                inParent.clickedMessage = row.entity;
                inParent.list = false;
                //console.log(row,controllerParent.clickedMessage)
                console.log(inParent.$scope.controllerParent.clickedMessage)
            },
            InitialiseEvents : function(controllerParent) {
            }
        },
        Controller : function($scope, $http, $cookieStore) {
            //Controler parrent setting !!!!
            var controllerParent = ngInbox.SentList;

            controllerParent.$scope = $scope;
            controllerParent.$http = $http;
            controllerParent.$cookieStore = $cookieStore;

            ngInbox._internal.Methods.PopulateScope(controllerParent);
            controllerParent.Events.InitialiseEvents(controllerParent);
        }
    },
    // SentList : {
    // Action : 'messages_outbound',
    // Status : 'C',
    // columnDefs : [{
    // field : 'con_lis',
    // displayName : 'Contact/List',
    // cellTemplate : 'views/table/MessageTableTemplate.html'
    // }, {
    // field : 'message',
    // displayName : 'Message',
    // cellTemplate : 'views/table/MessageTableTemplate.html'
    // }, {
    // field : 'sendEndDate',
    // displayName : 'Date sent',
    // }, {
    // cellTemplate : 'views/table/ManageTemplateCol.html'
    // }],
    // errorMessage : 'Unexpected error occurred when trying to fetch sent messages list!',
    // hashUrlviewMessage : '#/messages/messages_view_sent',
    // $scope : null,
    // $http : null,
    // $cookieStore : null,
    // Events : {
    //
    // InitialiseEvents : function(controllerParent) {
    // }
    // },
    // Controller : function($scope, $http, $cookieStore) {
    // //Controler parrent setting !!!!
    // var controllerParent = ngInbox.SentList;
    //
    // controllerParent.$scope = $scope;
    // controllerParent.$http = $http;
    // controllerParent.$cookieStore = $cookieStore;
    //
    // ngInbox._internal.Methods.PopulateScope(controllerParent);
    // controllerParent.Events.InitialiseEvents(controllerParent);
    // }
    // },
    ScheduledList : {
        Action : 'messages_outbound',
        Status : 'S',
        columnDefs : [{
            field : 'con_lis',
            displayName : 'Contact/List',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            field : 'message',
            displayName : 'Message',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            field : 'createdDate',
            displayName : 'Date created',
        }, {
            field : 'scheduledDate',
            displayName : 'Date scheduled',
        }, {
            cellTemplate : 'views/table/ManageTemplateCol.html'
        }],
        errorMessage : 'Unexpected error occurred when trying to fetch scheduled messages list!',
        hashUrlviewMessage : 'messages.view_scheduled',
        $scope : null,
        $http : null,
        $cookieStore : null,
        clickedMessage : null,
        list : true,
        Events : {
            Message_onClick : function(inParent, row) {
                inParent.clickedMessage = row.entity;
                inParent.list = false;
                //console.log(row,controllerParent.clickedMessage)
                console.log(inParent.$scope.controllerParent.clickedMessage)
            },
            InitialiseEvents : function(controllerParent) {
            }
        },
        Controller : function($scope, $http, $cookieStore) {
            //Controler parrent setting !!!!
            var controllerParent = ngInbox.ScheduledList;

            controllerParent.$scope = $scope;
            controllerParent.$http = $http;
            controllerParent.$cookieStore = $cookieStore;

            ngInbox._internal.Methods.PopulateScope(controllerParent);
            controllerParent.Events.InitialiseEvents(controllerParent);
        }
    },
    // ScheduledList : {
    // Action : 'messages_outbound',
    // Status : 'S',
    // columnDefs : [{
    // field : 'con_lis',
    // displayName : 'Contact/List',
    // cellTemplate : 'views/table/MessageTableTemplate.html'
    // }, {
    // field : 'message',
    // displayName : 'Message',
    // cellTemplate : 'views/table/MessageTableTemplate.html'
    // }, {
    // field : 'createdDate',
    // displayName : 'Date created',
    // }, {
    // field : 'scheduledDate',
    // displayName : 'Date scheduled',
    // }, {
    // cellTemplate : 'views/table/ManageTemplateCol.html'
    // }],
    // errorMessage : 'Unexpected error occurred when trying to fetch scheduled messages list!',
    // hashUrlviewMessage : '#/messages/messages_view_scheduled',
    // $scope : null,
    // $http : null,
    // $cookieStore : null,
    // Events : {
    //
    // InitialiseEvents : function(controllerParent) {
    // }
    // },
    // Controller : function($scope, $http, $cookieStore) {
    // //Controler parrent setting !!!!
    // var controllerParent = ngInbox.ScheduledList;
    //
    // controllerParent.$scope = $scope;
    // controllerParent.$http = $http;
    // controllerParent.$cookieStore = $cookieStore;
    //
    // ngInbox._internal.Methods.PopulateScope(controllerParent);
    // controllerParent.Events.InitialiseEvents(controllerParent);
    // }
    // },
    DraftsList : {
        Action : 'messages_outbound',
        Status : 'D',
        columnDefs : [{
            field : 'con_lis',
            displayName : 'Contact/List',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            field : 'message',
            displayName : 'Message',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            field : 'statusDate',
            displayName : 'Date & Time Saved',
        }, {
            cellTemplate : 'views/table/ManageTemplateCol.html'
        }],
        errorMessage : 'Unexpected error occurred when trying to fetch draft messages list!',
        hashUrlviewMessage : 'messages.view_drafts',
        $scope : null,
        $http : null,
        $cookieStore : null,
        clickedMessage : null,
        list : true,
        Events : {
            Message_onClick : function(inParent, row) {
                inParent.clickedMessage = row.entity;
                inParent.list = false;
                //console.log(row,controllerParent.clickedMessage)
                console.log(inParent.$scope.controllerParent.clickedMessage)
            },
            InitialiseEvents : function(controllerParent) {
            }
        },
        Controller : function($scope, $http, $cookieStore) {
            //Controler parrent setting !!!!
            var controllerParent = ngInbox.DraftsList;

            controllerParent.$scope = $scope;
            controllerParent.$http = $http;
            controllerParent.$cookieStore = $cookieStore;

            ngInbox._internal.Methods.PopulateScope(controllerParent);
            controllerParent.Events.InitialiseEvents(controllerParent);
        }
    },
    // DraftsList : {
    // Action : 'messages_outbound',
    // Status : 'D',
    // columnDefs : [{
    // field : 'con_lis',
    // displayName : 'Contact/List',
    // cellTemplate : 'views/table/MessageTableTemplate.html'
    // }, {
    // field : 'message',
    // displayName : 'Message',
    // cellTemplate : 'views/table/MessageTableTemplate.html'
    // }, {
    // field : 'statusDate',
    // displayName : 'Date & Time Saved',
    // }, {
    // cellTemplate : 'views/table/ManageTemplateCol.html'
    // }],
    // errorMessage : 'Unexpected error occurred when trying to fetch draft messages list!',
    // hashUrlviewMessage : '#/messages/messages_view_drafts',
    // $scope : null,
    // $http : null,
    // $cookieStore : null,
    // Events : {
    //
    // InitialiseEvents : function(controllerParent) {
    // }
    // },
    // Controller : function($scope, $http, $cookieStore) {
    // //Controler parrent setting !!!!
    // var controllerParent = ngInbox.DraftsList;
    //
    // controllerParent.$scope = $scope;
    // controllerParent.$http = $http;
    // controllerParent.$cookieStore = $cookieStore;
    //
    // ngInbox._internal.Methods.PopulateScope(controllerParent);
    // controllerParent.Events.InitialiseEvents(controllerParent);
    // }
    // },
    TrashList : {
        Action : 'messages_inbound',
        Status : 'D',
        columnDefs : [{
            field : 'con_lis',
            displayName : 'Contact/List',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            field : 'message',
            displayName : 'Message',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            field : 'statusDate',
            displayName : 'Date & Time Deleted',
        }],
        errorMessage : 'Unexpected error occurred when trying to fetch trash messages list!',
        hashUrlviewMessage : 'messages.view_trash',
        $scope : null,
        $http : null,
        $cookieStore : null,
        clickedMessage : null,
        list : true,
        Events : {
            Message_onClick : function(inParent, row) {
                inParent.clickedMessage = row.entity;
                inParent.list = false;
                //console.log(row,controllerParent.clickedMessage)
                console.log(inParent.$scope.controllerParent.clickedMessage)
            },
            InitialiseEvents : function(controllerParent) {
            }
        },
        Controller : function($scope, $http, $cookieStore) {
            //Controler parrent setting !!!!
            var controllerParent = ngInbox.DraftsList;

            controllerParent.$scope = $scope;
            controllerParent.$http = $http;
            controllerParent.$cookieStore = $cookieStore;

            ngInbox._internal.Methods.PopulateScope(controllerParent);
            controllerParent.Events.InitialiseEvents(controllerParent);
        }
    }
    // TrashList : {
    // Action : 'messages_inbound',
    // Status : 'D',
    // columnDefs : [{
    // field : 'con_lis',
    // displayName : 'Contact/List',
    // cellTemplate : 'views/table/MessageTableTemplate.html'
    // }, {
    // field : 'message',
    // displayName : 'Message',
    // cellTemplate : 'views/table/MessageTableTemplate.html'
    // }, {
    // field : 'statusDate',
    // displayName : 'Date & Time Deleted',
    // }],
    // errorMessage : 'Unexpected error occurred when trying to fetch trash messages list!',
    // hashUrlviewMessage : '#/messages/messages_view_trash',
    // $scope : null,
    // $http : null,
    // $cookieStore : null,
    // Events : {
    //
    // InitialiseEvents : function(controllerParent) {
    // }
    // },
    // Controller : function($scope, $http, $cookieStore) {
    // //Controler parrent setting !!!!
    // var controllerParent = ngInbox.TrashList;
    //
    // controllerParent.$scope = $scope;
    // controllerParent.$http = $http;
    // controllerParent.$cookieStore = $cookieStore;
    //
    // ngInbox._internal.Methods.PopulateScope(controllerParent);
    // controllerParent.Events.InitialiseEvents(controllerParent);
    // }
    // }
};

