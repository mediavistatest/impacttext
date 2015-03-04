var ngInbox = {
    InboxList : function($scope, $http, $cookieStore) {
        var inboxList = this;

        $scope.mySelections = [];

        $scope.filterOptions = {
            filterText : ''
        };

        $scope.totalServerItems = 0;

        $scope.pagingOptions = {
            pageSizes : [2, 5, 10],
            pageSize : 5,
            currentPage : 1
        };

        //GET DATA

        $scope.setPagingData = function(data, page, pageSize) {
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.ngData = pagedData;
            $scope.totalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.setPagingDataSliced = setPagingDataSliced;

        $scope.getPagedDataAsync = function(pageSize, page, searchText) {
            setTimeout(function() {
                var data;

                $http.post(inspiniaNS.wsUrl + "messages_inbound", $.param({
                    apikey : $cookieStore.get('inspinia_auth_token'),
                    accountID : $cookieStore.get('inspinia_account_id')
                })).success(function(largeLoad) {
                    if (searchText) {
                        var ft = searchText.toLowerCase();
                        data = largeLoad.apidata.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
                        $scope.setPagingData(data, page, pageSize);
                    } else{
                        data = largeLoad;
                        $scope.setPagingDataSliced($scope, data.apidata, data.apicount);
                    }
                    console.log(data.apidata)
                }).error(
                //An error occurred with this request
                function(data, status, headers, config) {
                    alert('Unexpected error occurred when trying to fetch contact lists!');
                });
            }, 100);
        };

        //WHATCH
        $scope.$watch('pagingOptions', function() {
            if (!self.poInit || self.gettingData) {
                self.poInit = true;
                return;
            }
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }, true);

        $scope.$watch('filterOptions', function() {
            if (!self.foInit || self.gettingData) {
                self.foInit = true;
                return;
            }
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }, true);

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);

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
                field : 'createdBy',
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
};
