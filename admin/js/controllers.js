// create the controller and inject Angular's $scope
superAdmin.controller('mainController', function($scope) {
    // create a messCompanyID to display in our view
});


// Account List
superAdmin.controller('AccountListCtrl',['$scope', '$cookieStore', '$http', function($scope, $cookieStore, $http) {
    $scope.mySelections = [];
    $scope.filterOptions = {
        filterText: '',
        filterBy: ''
        //filterText2: '',
        //externalFilter: '',
        //useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [5, 10, 20],
        pageSize: 5,
        currentPage: 1
    };
    // sort
    $scope.sortOptions = {
        fields: ['accountName'],
        directions: ['ASC'],
        useExternalSorting: true
    };

    $scope.gridOptions = {
        data: 'accounts',
        enableSorting: true,
        useExternalSorting: true,
        sortInfo: $scope.sortOptions,
        rowHeight: 35,
        selectedItems: $scope.mySelections,
        showSelectionCheckbox: true,
        multiSelect: true,
        selectWithCheckboxOnly: true,
        enablePaging: true,
        showFooter: false,
        pagingOptions: $scope.pagingOptions,
        columnDefs: [{
            field: 'accountName',
            displayName: 'Account Name'
        }, {
            field: 'companyID',
            displayName: 'Company ID'
        }, {
            field: 'firstName',
            displayName: 'Name',
            cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.entity.firstName}} {{row.entity.lastName}}</div>'
        }, {
            field: 'emailAddress',
            displayName: 'Email Address'
        }, {
            field: '',
            displayName: '',
            cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a class="btn"><i class="fa fa-pencil"></i> Manage Account </a></div>'
        }]
    };

	$scope.refresh = function() {
		$http.post(inspiniaAdminNS.wsUrl + "accounts", $.param({
			apikey : $cookieStore.get('inspinia_auth_token'),
			sethttp : 1
		}))
			//Successful request to the server
			.success(function(data, status, headers, config) {
				if (data == null || typeof data.apicode == 'undefined') {
					//This should never happen
					alert("Unidentified error occurred when getting account info!");
					return;
				}
				if (data.apicode == 0) {
					$scope.accounts = data.apidata;
				} else {
					alert("Error occured while getting account info!");
				}
			})
			//An error occurred with this request
			.error(function(data, status, headers, config) {
				alert("Error occured while getting account info!");
			});
	};

	$scope.refresh();
}]);


//Manage Account
superAdmin.controller('ManageAccountCtrl', function($scope, notify) {
    
    $scope.AccCode = 'Long';

    $scope.msg = 'Hello! This is a sample message!';
    $scope.template = '';

    $scope.demo = function(){
        notify({
            message: $scope.msg,
            classes: $scope.classes,
            templateUrl: $scope.template,
            duration: 3000
        });
    };

    $scope.closeAll = function(){
        notify.closeAll();
    };

});


//Login
superAdmin.controller('loginCtrl', function($scope) {

});