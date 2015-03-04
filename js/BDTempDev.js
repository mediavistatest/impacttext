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
            // SetPagingData : function(data, page, pageSize, $scope) {
            // var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            // $scope.ngData = pagedData;
            // $scope.totalServerItems = data.length;
            // if (!$scope.$$phase) {
            // $scope.$apply();
            // }
            // },
            SetPagingDataSliced : function($scope, data, totalResultsCount) {
                $scope.ngData = data;
                $scope.totalServerItems = totalResultsCount;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            },
            GetPagedDataAsync : function(action, $scope, $http, $cookieStore) {
                var data;
                var pageSize = $scope.pagingOptions.pageSize;
                var page = $scope.pagingOptions.currentPage;
                var searchText = $scope.filterOptions.filterText;
                if (searchText) {
                    var ft = searchText.toLowerCase();
                    $http.post(inspiniaNS.wsUrl + action, $.param({
                        apikey : $cookieStore.get('inspinia_auth_token'),
                        accountID : $cookieStore.get('inspinia_account_id')
                    })).success(function(largeLoad) {
                        data = largeLoad.apidata.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
                        //console.log(data)
                        $scope.setPagingDataSliced($scope, data, data.lenght);
                    }).error(
                    //An error occurred with this request
                    function(data, status, headers, config) {
                        alert(ngInbox._internal.ErrorMsg);
                    });
                } else {
                    $http.post(inspiniaNS.wsUrl + action, $.param({
                        apikey : $cookieStore.get('inspinia_auth_token'),
                        accountID : $cookieStore.get('inspinia_account_id'),
                        limit : pageSize,
                        offset : (page - 1) * pageSize
                    })).success(function(data) {
                        console.log(data.apidata)
                        $scope.setPagingDataSliced($scope, data.apidata, data.apicount);
                    }).error(
                    //An error occurred with this request
                    function(data, status, headers, config) {
                        alert(ngInbox._internal.ErrorMsg);
                    });
                }
            }
        }
    },
    InboxList : {
        Action : 'messages_inbound',
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
                $scope.getPagedDataAsync(ngInbox.InboxList.Action, $scope, $http, $cookieStore);
            }, true);

            $scope.$watch('filterOptions', function() {
                $scope.getPagedDataAsync(ngInbox.InboxList.Action, $scope, $http, $cookieStore);
            }, true);

            //INITIAL GET DATA
            $scope.getPagedDataAsync(ngInbox.InboxList.Action, $scope, $http, $cookieStore);

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
        ErrorMsg : 'Unexpected error occurred when trying to fetch sent messages list!',
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
                $scope.getPagedDataAsync(ngInbox.SentList.Action, $scope, $http, $cookieStore);
            }, true);

            $scope.$watch('filterOptions', function() {
                $scope.getPagedDataAsync(ngInbox.SentList.Action, $scope, $http, $cookieStore);
            }, true);

            //INITIAL GET DATA
            $scope.getPagedDataAsync(ngInbox.SentList.Action, $scope, $http, $cookieStore);

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
                    displayName : 'Contact/List'
                }, {
                    field : 'message',
                    displayName : 'Message'
                }, {
                    field : 'createdDate',
                    displayName : 'Date',
                }]
            };
        }
    },
    ScheduledList : {

    },
    DraftsList : {

    },
    TrashList : {

    }
};

