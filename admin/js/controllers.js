function setPagingDataSliced($scope, data, totalResultsCount) {
	$scope.gridData = data;
	$scope.totalServerItems = totalResultsCount;
	if (!$scope.$$phase) {
		$scope.$apply();
	}
	$scope.gridOptions.selectAll(false);
}

function generateOrderByField(sortFields, sortOrders) {
	if (typeof sortFields == 'undefined' || sortFields == null) {
		sortFields = [];
	}

	if (typeof sortOrders == 'undefined' || sortOrders == null) {
		sortOrders = [];
	}

	var orderBy = '';
	for (var i in sortFields) {
		if (sortFields[i] == '') {
			continue;
		}

		var sortOrder = typeof sortOrders[i] == 'undefined' || sortOrders[i] == null ? 'asc' : sortOrders[i].toLowerCase();
		if (orderBy != '') {
			orderBy += ', ';
		}
		orderBy += sortFields[i].toLowerCase() + " " + sortOrder;
	}

	return orderBy;
}

function implode(arrayToImplode, delimiter) {
	var result = '';
	if (typeof arrayToImplode == 'undefined' || arrayToImplode == null || arrayToImplode.constructor !== Array) {
		return result;
	}
	if (typeof delimiter == 'undefined' || delimiter == null) {
		delimiter = ',';
	}
	for (var i in arrayToImplode) {
		if (result != '') {
			result += '' + delimiter;
		}
		result += arrayToImplode[i];
	}
	return result;
}

// create the controller and inject Angular's $scope
superAdmin.controller('mainController', function($scope) {
	// create a messCompanyID to display in our view
});

// Account List
superAdmin.controller('AccountListCtrl', ['$scope', '$cookieStore', '$http', function($scope, $cookieStore, $http) {
	var self = this;
	$scope.mySelections = [];
	$scope.filterOptions = {
		filterText: '',
		filterBy: 'accountName',
		useExternalFilter: true
	};
	$scope.totalServerItems = 0;
	$scope.pagingOptions = {
		pageSizes: [2, 5, 10, 20],
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
		data: 'gridData',
		enableSorting: true,
		useExternalSorting: true,
		sortInfo: $scope.sortOptions,
		rowHeight: 35,
		selectedItems: $scope.mySelections,
		showSelectionCheckbox: true,
		multiSelect: true,
		selectWithCheckboxOnly: true,
		enablePaging: true,
		showFooter: true,
		pagingOptions: $scope.pagingOptions,
		totalServerItems: 'totalServerItems',
		primaryKey : 'accountID',
		columnDefs:
		[
			{
				field: 'accountName',
				displayName: 'Account Name'
			},
			{
				field: 'companyID',
				displayName: 'Company ID'
			},
			{
				field: 'firstName',
				displayName: 'Name',
				cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.entity.firstName}} {{row.entity.lastName}}</div>'
			},
			{
				field: 'emailAddress',
				displayName: 'Email Address'
			},
			{
				field: '',
				displayName: '',
				cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a class="btn"><i class="fa fa-pencil"></i> Manage Account </a></div>'
			}
		]
};

$scope.setPagingDataSliced = setPagingDataSliced;

$scope.$watch('pagingOptions', function(newVal, oldVal) {
	if (!self.poInit || self.gettingData) {
		self.poInit = true;
		return;
	}
	if (newVal.currentPage != oldVal.currentPage || newVal.pageSize != oldVal.pageSize) {
		$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText, $scope.filterOptions.filterBy, $scope.sortOptions.fields, $scope.sortOptions.directions);
	}
}, true);

$scope.$watch('sortOptions', function(newVal, oldVal) {
	if (!self.soInit || self.gettingData) {
		self.soInit = true;
		return;
	}
	if (implode(newVal.fields) !== implode(oldVal.fields) || implode(newVal.directions) !== implode(oldVal.directions)) {
		$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText, $scope.filterOptions.filterBy, $scope.sortOptions.fields, $scope.sortOptions.directions);
	}
}, true);

$scope.getPagedDataAsync = function(pageSize, page, searchText, filterBy, sortFields, sortOrders) {
	if (typeof page == 'undefined' || page == null || page == '') {
		page = 0;
	}

	var orderBy = generateOrderByField(sortFields, sortOrders);
	if (orderBy == '') {
		orderBy = "accountName";
	}

	setTimeout(function() {
		var data;
		self.gettingData = true;
		if (searchText) {
			var ft = searchText.toLowerCase();
			var request = {sethttp: 1, apikey: $cookieStore.get('inspinia_auth_token'), orderby: orderBy, limit: pageSize, offset: (page - 1) * pageSize};
			switch (filterBy) {
				case "accountName":
					request.accountName = searchText;
					break;
				case "firstName":
					request.firstName = searchText;
					break;
				case "lastName":
					request.lastName = searchText;
					break;
				case "emailAddress":
					request.emailAddress = searchText;
					break;
			}
			$http.post(
				inspiniaAdminNS.wsUrl + "accounts",
				$.param(request)
			).success(
				function (data) {
					$scope.setPagingDataSliced($scope, data.apidata, data.apicount);
					self.gettingData = false;
				}).error(

				//An error occurred with this request
				function(data, status, headers, config) {
					//if (status == 400) {
					alert("An error occurred when getting account lists! Error code: " + data.apicode);
					alert(JSON.stringify(data));
					//}
					self.gettingData = false;
				}
			);
		} else {
			$http.post(
				inspiniaAdminNS.wsUrl + "accounts", $.param({
					sethttp : 1, apikey : $cookieStore.get('inspinia_auth_token'),
					limit: pageSize, offset: (page - 1) * pageSize, orderby : orderBy
				})
			).success(
				function (data) {
					$scope.setPagingDataSliced($scope, data.apidata, data.apicount);
					self.gettingData = false;
				}).error(
				//An error occurred with this request
				function(data, status, headers, config) {
					//alert('Unexpected error occurred when trying to fetch contact lists!');
					//if (status == 422) {
					alert("An error occurred when getting contact lists! Error code: " + data.apicode);
					alert(JSON.stringify(data));
					//}
					self.gettingData = false;
				}
			);
		}
	}, 100);
};

$scope.refresh = function() {
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText, $scope.filterOptions.filterBy, $scope.sortOptions.fields, $scope.sortOptions.directions);
	$scope.mySelections.length = 0;
};

$scope.refresh();
}])
;


//Manage Account
superAdmin.controller('ManageAccountCtrl', function($scope, notify) {

	$scope.AccCode = 'Long';

	$scope.msg = 'Hello! This is a sample message!';
	$scope.template = '';

	$scope.demo = function() {
		notify({
			message: $scope.msg,
			classes: $scope.classes,
			templateUrl: $scope.template,
			duration: 3000
		});
	};

	$scope.closeAll = function() {
		notify.closeAll();
	};

});


//Login
superAdmin.controller('loginCtrl', function($scope) {

});