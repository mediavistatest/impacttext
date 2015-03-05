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
            GetPagedDataAsync : function(controller, $scope, $http, $cookieStore) {
                console.log(controller.Status)
                var pageSize = $scope.pagingOptions.pageSize;
                var page = $scope.pagingOptions.currentPage;

                var searchText = $scope.filterOptions.filterText;
                var params = {
                    apikey : $cookieStore.get('inspinia_auth_token'),
                    accountID : $cookieStore.get('inspinia_account_id'),
                    limit : pageSize,
                    offset : (page - 1) * pageSize,
                    status : controller.Status
                };

                if (searchText){
                    params.search = searchText.toLowerCase();
                }

                var $param = $.param(params);

                //POST
                $http.post(inspiniaNS.wsUrl + controller.Action, $param)
                // success function
                .success(function(result) {
                    console.log(result)
                    $scope.setPagingDataSliced($scope, result.apidata, result.apicount);
                })
                // error function
                .error(function(data, status, headers, config) {
                    alert(ngInbox._internal.ErrorMsg);
                });
            }
        }
    },
    InboxList : {
        Action : 'messages_inbound',
        Status : 'U',
        Controller : function($scope, $http, $cookieStore) {
            var inboxList = this;
            ngInbox._internal.ErrorMsg = 'Unexpected error occurred when trying to fetch inbox messages list!';

            $scope.mySelections = [];
            $scope.totalServerItems = 0;
            $scope.pagingOptions = new ngInbox._internal.DataConstructors.PageOptions();
            $scope.filterOptions = new ngInbox._internal.DataConstructors.FilterOptions();

            //GET DATA
            $scope.setPagingDataSliced = ngInbox._internal.Methods.SetPagingDataSliced;
            $scope.getPagedDataAsync = ngInbox._internal.Methods.GetPagedDataAsync;

            //WHATCH
            $scope.$watch('pagingOptions', function() {
                $scope.getPagedDataAsync(ngInbox.InboxList, $scope, $http, $cookieStore);
            }, true);

            $scope.$watch('filterOptions', function() {
                $scope.getPagedDataAsync(ngInbox.InboxList, $scope, $http, $cookieStore);
            }, true);

            //INITIAL GET DATA
            $scope.getPagedDataAsync(ngInbox.InboxList, $scope, $http, $cookieStore);

            //TABLE OPTIONS
            $scope.ngOptions = {
                data : 'ngData',
                enableSorting : true,
                sortInfo : $scope.sortOptions,
                rowHeight : 60,
                selectedItems : $scope.mySelections,
                showSelectionCheckbox : true,
                multiSelect : true,
                selectWithCheckboxOnly : true,
                enablePaging : true,
                showFooter : true,
                footerTemplate : 'views/table/footerTemplate.html',
                totalServerItems : 'totalServerItems',
                pagingOptions : $scope.pagingOptions,
                filterOptions : $scope.filterOptions,
                columnDefs : [{
                    field : 'sourceANI',
                    displayName : 'Contact'
                }, {
                    field : 'message',
                    displayName : 'Message'
                }, {
                    field : 'createdDate',
                    displayName : 'Date',
                }, {
                    field : '',
                    displayName : 'List'
                }]
            };
        }
    },
    SentList : {
        Action : 'messages_outbound',
        Status : 'C',
        Controller : function($scope, $http, $cookieStore) {
            var inboxList = this;
            ngInbox._internal.ErrorMsg = 'Unexpected error occurred when trying to fetch sent messages list!';

            $scope.mySelections = [];
            $scope.totalServerItems = 0;
            $scope.pagingOptions = new ngInbox._internal.DataConstructors.PageOptions();
            $scope.filterOptions = new ngInbox._internal.DataConstructors.FilterOptions();

            //GET DATA
            $scope.setPagingDataSliced = ngInbox._internal.Methods.SetPagingDataSliced;
            $scope.getPagedDataAsync = ngInbox._internal.Methods.GetPagedDataAsync;

            //WHATCH
            $scope.$watch('pagingOptions', function() {
                $scope.getPagedDataAsync(ngInbox.SentList, $scope, $http, $cookieStore);
            }, true);

            $scope.$watch('filterOptions', function() {
                $scope.getPagedDataAsync(ngInbox.SentList, $scope, $http, $cookieStore);
            }, true);

            //INITIAL GET DATA
            $scope.getPagedDataAsync(ngInbox.SentList, $scope, $http, $cookieStore);

            //TABLE OPTIONS
            $scope.ngOptions = {
                data : 'ngData',
                enableSorting : true,
                sortInfo : $scope.sortOptions,
                rowHeight : 60,
                selectedItems : $scope.mySelections,
                showSelectionCheckbox : true,
                multiSelect : true,
                selectWithCheckboxOnly : true,
                enablePaging : true,
                showFooter : true,
                footerTemplate : 'views/table/footerTemplate.html',
                totalServerItems : 'totalServerItems',
                pagingOptions : $scope.pagingOptions,
                filterOptions : $scope.filterOptions,
                columnDefs : [{
                    field : 'contactListID',
                    displayName : 'Contact/List'
                }, {
                    field : 'message',
                    displayName : 'Message'
                }, {
                    field : 'sendEndDate',
                    displayName : 'Date sent',
                }]
            };
        }
    },
    ScheduledList : {
        Action : 'messages_outbound',
        Status : 'S',
        Controller : function($scope, $http, $cookieStore) {
            var inboxList = this;
            ngInbox._internal.ErrorMsg = 'Unexpected error occurred when trying to fetch scheduled messages list!';

            $scope.mySelections = [];
            $scope.totalServerItems = 0;
            $scope.pagingOptions = new ngInbox._internal.DataConstructors.PageOptions();
            $scope.filterOptions = new ngInbox._internal.DataConstructors.FilterOptions();

            //GET DATA
            $scope.setPagingDataSliced = ngInbox._internal.Methods.SetPagingDataSliced;
            $scope.getPagedDataAsync = ngInbox._internal.Methods.GetPagedDataAsync;

            //WHATCH
            $scope.$watch('pagingOptions', function() {
                $scope.getPagedDataAsync(ngInbox.SentList, $scope, $http, $cookieStore);
            }, true);

            $scope.$watch('filterOptions', function() {
                $scope.getPagedDataAsync(ngInbox.SentList, $scope, $http, $cookieStore);
            }, true);

            //INITIAL GET DATA
            $scope.getPagedDataAsync(ngInbox.SentList, $scope, $http, $cookieStore);

            //TABLE OPTIONS
            $scope.ngOptions = {
                data : 'ngData',
                enableSorting : true,
                sortInfo : $scope.sortOptions,
                rowHeight : 60,
                selectedItems : $scope.mySelections,
                showSelectionCheckbox : true,
                multiSelect : true,
                selectWithCheckboxOnly : true,
                enablePaging : true,
                showFooter : true,
                footerTemplate : 'views/table/footerTemplate.html',
                totalServerItems : 'totalServerItems',
                pagingOptions : $scope.pagingOptions,
                filterOptions : $scope.filterOptions,
                columnDefs : [{
                    field : 'contactListID',
                    displayName : 'Contact/List'
                }, {
                    field : 'message',
                    displayName : 'Message'
                }, {
                    field : 'createdDate',
                    displayName : 'Date created',
                }, {
                    field : 'scheduledDate',
                    displayName : 'Date scheduled',
                }]
            };
        }
    },
    DraftsList : {
        Action : 'messages_outbound',
        Status : 'D',
        Controller : function($scope, $http, $cookieStore) {
            var inboxList = this;
            ngInbox._internal.ErrorMsg = 'Unexpected error occurred when trying to fetch scheduled messages list!';

            $scope.mySelections = [];
            $scope.totalServerItems = 0;
            $scope.pagingOptions = new ngInbox._internal.DataConstructors.PageOptions();
            $scope.filterOptions = new ngInbox._internal.DataConstructors.FilterOptions();

            //GET DATA
            $scope.setPagingDataSliced = ngInbox._internal.Methods.SetPagingDataSliced;
            $scope.getPagedDataAsync = ngInbox._internal.Methods.GetPagedDataAsync;

            //WHATCH
            $scope.$watch('pagingOptions', function() {
                $scope.getPagedDataAsync(ngInbox.DraftsList, $scope, $http, $cookieStore);
            }, true);

            $scope.$watch('filterOptions', function() {
                $scope.getPagedDataAsync(ngInbox.DraftsList, $scope, $http, $cookieStore);
            }, true);

            //INITIAL GET DATA
            $scope.getPagedDataAsync(ngInbox.SentList, $scope, $http, $cookieStore);

            //TABLE OPTIONS
            $scope.ngOptions = {
                data : 'ngData',
                enableSorting : true,
                sortInfo : $scope.sortOptions,
                rowHeight : 60,
                selectedItems : $scope.mySelections,
                showSelectionCheckbox : true,
                multiSelect : true,
                selectWithCheckboxOnly : true,
                enablePaging : true,
                showFooter : true,
                footerTemplate : 'views/table/footerTemplate.html',
                totalServerItems : 'totalServerItems',
                pagingOptions : $scope.pagingOptions,
                filterOptions : $scope.filterOptions,
                columnDefs : [{
                    field : 'contactListID',
                    displayName : 'Contact/List'
                }, {
                    field : 'message',
                    displayName : 'Message'
                }, {
                    field : 'statusDate',
                    displayName : 'Date & Time Saved',
                }]
            };
        }
    },
    TrashList : {
        Action : 'messages_inbound',
        Status : 'D',
        Controller : function($scope, $http, $cookieStore) {
            var inboxList = this;
            ngInbox._internal.ErrorMsg = 'Unexpected error occurred when trying to fetch scheduled messages list!';

            $scope.mySelections = [];
            $scope.totalServerItems = 0;
            $scope.pagingOptions = new ngInbox._internal.DataConstructors.PageOptions();
            $scope.filterOptions = new ngInbox._internal.DataConstructors.FilterOptions();

            //GET DATA
            $scope.setPagingDataSliced = ngInbox._internal.Methods.SetPagingDataSliced;
            $scope.getPagedDataAsync = ngInbox._internal.Methods.GetPagedDataAsync;

            //WHATCH
            $scope.$watch('pagingOptions', function() {
                $scope.getPagedDataAsync(ngInbox.TrashList, $scope, $http, $cookieStore);
            }, true);

            $scope.$watch('filterOptions', function() {
                $scope.getPagedDataAsync(ngInbox.TrashList, $scope, $http, $cookieStore);
            }, true);

            //INITIAL GET DATA
            $scope.getPagedDataAsync(ngInbox.SentList, $scope, $http, $cookieStore);

            //TABLE OPTIONS
            $scope.ngOptions = {
                data : 'ngData',
                enableSorting : true,
                sortInfo : $scope.sortOptions,
                rowHeight : 60,
                selectedItems : $scope.mySelections,
                showSelectionCheckbox : true,
                multiSelect : true,
                selectWithCheckboxOnly : true,
                enablePaging : true,
                showFooter : true,
                footerTemplate : 'views/table/footerTemplate.html',
                totalServerItems : 'totalServerItems',
                pagingOptions : $scope.pagingOptions,
                filterOptions : $scope.filterOptions,
                columnDefs : [{
                    field : 'contactListID',
                    displayName : 'Contact/List'
                }, {
                    field : 'message',
                    displayName : 'Message'
                }, {
                    field : 'statusDate',
                    displayName : 'Date & Time Deleted',
                }]
            };
        }
    }
};

