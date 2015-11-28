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
superAdmin.controller('AccountListCtrl', ['$scope', '$cookieStore', '$http', '$location', '$window', function($scope, $cookieStore, $http, $location, $window) {
	var base_url = $location.absUrl();
	var dashboard_url = base_url.replace('/admin/#', '/#') + "dashboard";

	var self = this;
	$scope.mySelections = [];
	$scope.filterOptions = {
		filterText: '',
		filterBy: 'accountName',
		useExternalFilter: true
	};
	$scope.totalServerItems = 0;
	$scope.pagingOptions = {
		pageSizes: [2, 5, 10, 20, 50, 100],
		pageSize: 50,
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
		showSelectionCheckbox: false,
		multiSelect: false,
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
					field: 'status',
					displayName: 'Status'
				},
				{
					field: '',
					displayName: '',
					cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/manage_account/{{row.entity.accountID}}" class="btn"><i class="fa fa-pencil"></i> Manage Account </a></div>'
				},
				{
					field: '',
					displayName: '',
					cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a ng-click="enterAccount(row.entity.accountID, row.entity.companyID)" class="btn"><i class="fa fa-external-link"></i> Enter Account </a></div>',
					width: 130
				}
			]
	};

	$scope.enterAccount = function(account_id, company_id){
		$http.post(inspiniaAdminNS.wsUrl + "account_adminlogin", $.param({
			apikey: $cookieStore.get('inspinia_auth_token'),
			accountid : account_id
		})).success(
			function(data) {
				if (data == null || typeof data.apicode == 'undefined') {
					alert("Unknown error occurred when trying to sign in! Please try again.");
					return;
				}
				if (data.apicode == 0) {
					if ( typeof data.apidata != 'undefined' && data.apidata != null && data.apidata != null != '') {
						document.cookie = 'inspinia_auth_token' + '="' + data.apidata.apikey + '";path=/';
						document.cookie = 'inspinia_account_id' + '="' + account_id + '";path=/';
						document.cookie = 'inspinia_company_id' + '="' + company_id + '";path=/';
						$window.open(dashboard_url, "_blank");
					}else{
						alert("Failed to sign in! Please try again.");
					}
				} else {
					if(data.apitext != ''){
						alert(data.apitext);
					}else{
						alert("An error occurred when trying to sign in. Error code: " + data.apicode);
					}
				}
		}).error(
			function() {
				alert("Failed to sign in! Please try again.");
		});
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
	
	$scope.$watch('gridData', function() {
		$('.gridStyle').trigger('resize');
	});

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
						if (status != 401) {
							alert("An error occurred when getting accounts! Error code: " + data.apicode);
							alert(JSON.stringify(data));
						}
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
superAdmin.controller('ManageAccountCtrl', function($scope, $http, $cookieStore, $routeParams, notify, $q) {
	var waitForData = $q.defer();
	var waitFor = ['PRODUCTPACKAGES', 'COUNTRIES'];
	var doneWaitingFor = [];
	function doneWaiting(){
		for(var i in waitFor){
			if(doneWaitingFor.indexOf(waitFor[i]) == -1){
				return false;
			}
		}
		return true;
	}

	$scope.smsCode = {};
	$scope.smsCode.AccCode = 'Long';
	$scope.smsCode.ShortCode = '766337';
	$scope.smsCode.ShortKeyword = 'Automatically Generated';
	$scope.CompanyID = 1;
	$scope.accountId = typeof $routeParams.accountId == 'undefined' ? null : $routeParams.accountId;
	$scope.DidList = [];
	$scope.UsersList = [];
	$scope.ProductPackageList = [];
	$scope.CountriesList = [];

	/*$scope.msg = 'Hello! This is a sample message!';
	 $scope.template = '';
	 $scope.template = '';

	 $scope.demo = function() {
	 notify({
	 message: $scope.msg,
	 classes: $scope.classes,
	 templateUrl: $scope.template,
	 duration: 3000
	 });
	 };*/

	$scope.closeAll = function() {
		notify.closeAll();
	};

	$scope.saveAccount = function() {
		if (typeof $scope.PrimaryDID == 'undefined' || $scope.PrimaryDID == null || $.trim($scope.PrimaryDID) == '') {
			notify("Please enter the valid long code.");
			return;
		}

		if($scope.UseShortPrimary == 0){
			if($scope.PrimaryDID[0] == '1' && $scope.PrimaryDID.length != 11){
				notify("Long code that starts with '1' must be 11 digits long!");
				return;
			}else if($scope.PrimaryDID[0] != '1' && $scope.PrimaryDID.length != 10){
				notify("Long code length must be 10 digits!");
				return;
			}
		}

		//Setting request parameters
		var request = {
			companyID: $scope.CompanyID,
			accountName: $scope.AccountName,
			productPackage: $scope.ProductPackage,
			cycleGroupID: $scope.BillingCycle,
			firstName: $scope.FirstName,
			lastName: $scope.LastName,
			emailAddress: $scope.EmailAddress,
			address1: $scope.Address1,
			city: $scope.City,
			state: $scope.State,
			zip: $scope.Zip,
			country: $scope.Country,
			externalAccountNumber: $scope.ExternalAccount,
			primaryDID: $scope.PrimaryDID,
			compliance: $scope.Compliance,
			apikey: $cookieStore.get('inspinia_auth_token'),
			sethttp: 1
		};

		if($scope.Address2){
			request['address2'] = $scope.Address2;
		}

		var requestPage = "account_add";
		//Checking if this is modify account request
		var modify = $scope.accountId != null && $scope.accountId != '';
		if (modify) {
			request.accountID = $scope.accountId;
			requestPage = "account_modify";
		}

		$http.post(
			inspiniaAdminNS.wsUrl + requestPage, $.param(request)
		).success(
			function (data) {
				if (data.apicode == 0) {
					if (modify) {
						notify("Account data is successfully updated!");
					} else {
						notify("New account is successfully created!");
						$scope.accountId = data.apidata.accountID;
						$scope.accountStatus = data.apidata.status;
						$scope.createOptInList();
					}
					$scope.updatePreviousAccountData();
					$scope.refreshDidList();
				} else {
					notify("Creating accounts failed! Please try again!");
				}
			}).error(
			//An error occurred with this request
			function(data, status, headers, config) {
				if (status == 422) {
					//some input parameters are invalid
					var invalidParameter = '';
					var invalidParameterName = null;
					var operation = modify ? 'update' : 'create';
					if (data.apitext) {
						var errorParamsMap = [];
						errorParamsMap['accountname'] = "Account Name";
						errorParamsMap['productpackage'] = "Product Package";
						errorParamsMap['cyclegroupid'] = "Billing Cycle";
						errorParamsMap['firstname'] = "First Name";
						errorParamsMap['lastname'] = "Last Name";
						errorParamsMap['emailaddress'] = "Email Address";
						errorParamsMap['address1'] = "Address 1";
						errorParamsMap['address2'] = "Address 2";
						errorParamsMap['city'] = "City";
						errorParamsMap['state'] = "State";
						errorParamsMap['zip'] = "Zip code";
						errorParamsMap['country'] = "Country";
						errorParamsMap['primarydid'] = "Primary DID";
						errorParamsMap['externalaccountnumber'] = "Extenral Account Number";
						invalidParameter = data.apitext.split(':')[0];
						invalidParameterName = errorParamsMap[invalidParameter];
					}
					if (typeof invalidParameterName != 'undefined' && invalidParameterName != null && invalidParameterName != '') {
						notify({message: "Failed to " + operation + " account. Invalid parameter " + invalidParameterName + "!", classes : 'alert-danger'});
					} else {
						notify({message: "Failed to " + operation + " account. Please check your input parameters and try again!", classes : 'alert-danger'});
					}
					//alert(JSON.stringify(data));
					return;
				}
				notify("Unexpected error occurred when trying to " + operation + " an account!");
			}
		);
	};

	$scope.resetAccount = function() {
		$scope.accountId = null;
		$scope.AccountName = null;
		$scope.ProductPackage = null;
		$scope.CompanyID = 1;
		$scope.smsCode.AccCode = 'Long';
		$scope.BillingCycle = null;
		$scope.FirstName = null;
		$scope.LastName = null;
		$scope.EmailAddress = null;
		$scope.Address1 = null;
		$scope.Address2 = null;
		$scope.City = null;
		$scope.State = null;
		$scope.Zip = null;
		$scope.Country = null;
		$scope.ExternalAccount = null;
		$scope.PrimaryDID = null;
		$scope.UseShortPrimary = 0;
		$scope.Compliance = 'CA';
	};

	$scope.restorePreviousAccountData = function() {
		if (typeof $scope.accountId == 'undefined' || $scope.accountId == null || $scope.accountId == '') {
			$scope.resetAccount();
			return;
		}
		$scope.updateAccountFields($scope.previousAccountData);
	};

	$scope.updatePreviousAccountData = function() {
		if (typeof $scope.previousAccountData == 'undefined') {
			$scope.previousAccountData = {};
		}
		$scope.previousAccountData.accountName = $scope.AccountName;
		$scope.previousAccountData.productPackage = $scope.ProductPackage;
		$scope.previousAccountData.cycleGroupID = $scope.BillingCycle;
		$scope.previousAccountData.firstName = $scope.FirstName;
		$scope.previousAccountData.lastName = $scope.LastName;
		$scope.previousAccountData.emailAddress = $scope.EmailAddress;
		$scope.previousAccountData.address1 = $scope.Address1;
		$scope.previousAccountData.address2 = $scope.Address2;
		$scope.previousAccountData.city = $scope.City;
		$scope.previousAccountData.state = $scope.State;
		$scope.previousAccountData.zip = $scope.Zip;
		$scope.previousAccountData.country = $scope.Country;
		$scope.previousAccountData.externalAccountNumber = $scope.ExternalAccount;
		$scope.previousAccountData.primaryDIDID = $scope.primaryDidId;
		$scope.previousAccountData.status = $scope.accountStatus;
		$scope.previousAccountData.compliance = $scope.Compliance;
	};

	$scope.updateAccountFields = function(accountData) {
		if (typeof accountData == 'undefined' || accountData == null) {
			return;
		}
		$scope.AccountName = accountData.accountName;
		$scope.ProductPackage = accountData.productPackage;
		$scope.BillingCycle = accountData.cycleGroupID;
		$scope.FirstName = accountData.firstName;
		$scope.LastName = accountData.lastName;
		$scope.EmailAddress = accountData.emailAddress;
		$scope.Address1 = accountData.address1;
		$scope.Address2 = accountData.address2;
		$scope.City = accountData.city;
		$scope.State = accountData.state;
		$scope.Zip = accountData.zip;
		$scope.Country = accountData.country;
		$scope.ExternalAccount = accountData.externalAccountNumber;
		$scope.primaryDidId = accountData.primaryDIDID;
		$scope.refreshPrimaryDID();
		$scope.accountStatus = accountData.status;
		$scope.Compliance = accountData.compliance;
		$scope.previousAccountData = accountData;
	};

	$scope.refreshAccount = function() {
		if ($scope.accountId == null) {
			//this is creating new account. Refresh all data means resetting all inputs.
			$scope.resetAccount();
		} else {
			//Getting the account info data
			$http.post(
				inspiniaAdminNS.wsUrl + "account_get",
				$.param({
					apikey : $cookieStore.get('inspinia_auth_token'),
					accountID : $scope.accountId,
					sethttp : 1
				})
			).success(
				function (data) {
					if (data.apicode == 0) {
						var accountData = data.apidata[0];
						$scope.updateAccountFields(accountData);
					}
				}).error(
				//An error occurred with this request
				function(data, status, headers, config) {
					if (status == 422) {
						alert("An error occurred when getting account data! Error code: " + data.apicode);
						alert(JSON.stringify(data));
					}
				}
			);
		}
	};

	$scope.cancelAccount = function() {
		if ($scope.accountId == null) {
			return;
		}
		//Cancelling the account
		$http.post(
			inspiniaAdminNS.wsUrl + "account_cancel",
			$.param({
				apikey : $cookieStore.get('inspinia_auth_token'),
				accountID : $scope.accountId,
				sethttp : 1
			})
		).success(
			function (data) {
				if (data.apicode == 0) {
					notify("Account is successfully canceled.");
					$scope.refreshAccount();
				}
			}).error(
			//An error occurred with this request
			function(data, status, headers, config) {
				if (status == 422) {
					alert("An error occurred when canceling account! Error code: " + data.apicode);
					alert(JSON.stringify(data));
				}
			}
		);
	};

	$scope.activateAccount = function() {
		if ($scope.accountId == null) {
			return;
		}
		//Cancelling the account
		$http.post(
			inspiniaAdminNS.wsUrl + "account_activate",
			$.param({
				apikey : $cookieStore.get('inspinia_auth_token'),
				accountID : $scope.accountId,
				sethttp : 1
			})
		).success(
			function (data) {
				if (data.apicode == 0) {
					notify("Account is successfully activated.");
					$scope.refreshAccount();
				}
			}).error(
			//An error occurred with this request
			function(data, status, headers, config) {
				if (status == 422) {
					alert("An error occurred when canceling account! Error code: " + data.apicode);
					alert(JSON.stringify(data));
				}
			}
		);
	};

	$scope.refreshPrimaryDID = function() {
		if (typeof $scope.primaryDidId == 'undefined' || $scope.primaryDidId == null || $scope.primaryDidId == '') {
			$scope.UseShortPrimary = 0;
			return;
		}

		//Getting the account info data
		$http.post(
			inspiniaAdminNS.wsUrl + "did_get",
			$.param({
				apikey : $cookieStore.get('inspinia_auth_token'),
				DIDID : $scope.primaryDidId,
				accountID: $scope.accountId,
				sethttp : 1
			})
		).success(
			function (data) {
				if (data.apicode == 0) {
					$scope.PrimaryDID = data.apidata[0].DID;
					if($scope.PrimaryDID.length == 10 || $scope.PrimaryDID.length == 11){
						$scope.UseShortPrimary = 0;
					}else{
						$scope.UseShortPrimary = 1;
					}
				}
			}).error(
			//An error occurred with this request
			function(data, status, headers, config) {
				$scope.UseShortPrimary = 0;
				if (status == 422) {
					alert("An error occurred when getting primary data! Error code: " + data.apicode);
					alert(JSON.stringify(data));
				}
			}
		);
	};

	$scope.createOptInList = function() {
		if (typeof $scope.accountId == 'undefined' || $scope.accountId == null || $scope.accountId == '') {
			return;
		}

		//Send request to the server to add list named Opt-In List for the newly created account
		$http.post(inspiniaAdminNS.wsUrl + "contactlist_add", $.param({
			sethttp : 1,
			apikey : $cookieStore.get('inspinia_auth_token'),
			accountID : $scope.accountId,
			companyID : $scope.CompanyID,
			contactListName : 'Opt-In List'
		}))
			.success(
			//Successful request to the server
			function(data, status, headers, config) {
				if (data == null || typeof data.apicode == 'undefined') {
					//This should never happen
					notify("Unidentified error occurred when creating Opt-In contact list!");
					return;
				}
				if (data.apicode == 0) {
					//Do nothing, all is OK
				} else {
					notify("An error occurred when adding Opt-In contact list! Error code: " + data.apicode);
				}
			}
		)
			.error(
			//An error occurred with this request
			function(data, status, headers, config) {
				notify({message: "An error occurred when creating Opt-In List!", classes : 'alert-danger'})
			}
		);
	};

	$scope.refreshDidList = function() {
		if (typeof $scope.accountId == 'undefined' || $scope.accountId == null) {
			return;
		}
		//Cancelling the account
		$http.post(
			inspiniaAdminNS.wsUrl + "did_get",
			$.param({
				apikey : $cookieStore.get('inspinia_auth_token'),
				accountID : $scope.accountId,
				sethttp : 1
			})
		).success(
			function (data) {
				if (data.apicode == 0) {
					$scope.DidList = data.apidata;
					$.each(data.apidata, function(key, value) {
						if (value.DID.length < 10) {
							$scope.shortCodeDisabled = true;
						}
					});
				}
			}
		).error(
			//An error occurred with this request
			function(data, status, headers, config) {
				notify("An error occurred when getting DID list! Error code: " + data.apicode);
				alert(JSON.stringify(data));
			}
		);
	};

	$scope.resetDIDFields = function() {
		if (typeof $scope.smsCode == 'undefined') {
			$scope.smsCode = {};
		}
		$scope.smsCode.selectedDidId = null;
		$scope.smsCode.AccCode = 'Long';
		$scope.smsCode.LongCode = null;
		$scope.smsCode.LongCodeName = null;
		$scope.smsCode.LongPriorities = 0;
		$scope.smsCode.ShortPriorities = 0;
		$scope.smsCode.LongKeyword = 'YES';
		$scope.smsCode.ShortCode = 766337;
		$scope.smsCode.ShortCodeName = null;
		$scope.smsCode.ShortKeyword = 'Automatically Generated';
		$scope.smsCode.status = null;
	};

	$scope.saveDID = function() {
		if (typeof $scope.smsCode.selectedDidId == 'undefined' || $scope.smsCode.selectedDidId == null || $scope.smsCode.selectedDidId == '') {
			$scope.addDID();
		} else {
			$scope.editDID();
		}
	};

	$scope.addDID = function() {
		var request = {
			apikey : $cookieStore.get('inspinia_auth_token'),
			accountID : $scope.accountId,
			companyID: $scope.CompanyID,
			sethttp : 1
		};

		if ($scope.smsCode.AccCode == 'Short') {
			if (typeof $scope.smsCode.ShortCode == 'undefined' || $scope.smsCode.ShortCode == null || $.trim($scope.smsCode.ShortCode) == '') {
				notify("Please enter the valid short code.");
				return;
			}
			if (typeof $scope.smsCode.ShortCodeName == 'undefined' || $scope.smsCode.ShortCodeName == null || $.trim($scope.smsCode.ShortCodeName) == '') {
				notify("Please enter the valid short code name.");
				return;
			}
			request.DID = $scope.smsCode.ShortCode;
			request.DIDName = $scope.smsCode.ShortCodeName;
			request.priorityMessaging = $scope.smsCode.ShortPriorities;
		} else {
			if (typeof $scope.smsCode.LongCode == 'undefined' || $scope.smsCode.LongCode == null || $.trim($scope.smsCode.LongCode) == '') {
				notify("Please enter the valid long code.");
				return;
			}
			if($scope.smsCode.LongCode[0] == '1' && $scope.smsCode.LongCode.length != 11){
				notify("Long code that starts with '1' must be 11 digits long!");
				return;
			}else if($scope.smsCode.LongCode[0] != '1' && $scope.smsCode.LongCode.length != 10){
				notify("Long code length must be 10 digits!");
				return;
			}
			if (typeof $scope.smsCode.LongCodeName == 'undefined' || $scope.smsCode.LongCodeName == null || $.trim($scope.smsCode.LongCodeName) == '') {
				notify("Please enter the valid long code name.");
				return;
			}
			request.DID = $scope.smsCode.LongCode;
			request.DIDName = $scope.smsCode.LongCodeName;
			request.priorityMessaging = $scope.smsCode.LongPriorities;
		}
		//Set the start date
		var now = new Date();
		var timezoneOffsetMinutes = now.getTimezoneOffset();
		var startDate = new Date(now.getTime() + 60000 * timezoneOffsetMinutes);
		if (inspiniaAdminNS.developmentEnvironment) {
			//Development environment is not set to GMT, so we need to move start date to the past...
			startDate = new Date(startDate.getTime() - 24 * 60 * 60000);
		}
		//Date is in format MM/dd/yyyy
		var dateParts = [];
		dateParts[0] = startDate.getFullYear();
		dateParts[1] = "" + (startDate.getMonth() + 1);
		dateParts[2] = "" + startDate.getDate();
		dateParts[3] = "" + startDate.getHours();
		dateParts[4] = "" + startDate.getMinutes();
		//Fix month
		if (dateParts[1].length < 2) {
			dateParts[1] = "0" + dateParts[1];
		}
		//Fix day
		if (dateParts[2].length < 2) {
			dateParts[2] = "0" + dateParts[2];
		}
		//Fix hours
		if (dateParts[3].length < 2) {
			dateParts[3] = "0" + dateParts[3];
		}
		//Fix minutes
		if (dateParts[4].length < 2) {
			dateParts[4] = "0" + dateParts[4];
		}
		request.startDate = dateParts[0] + "-" + dateParts[1] + "-" + dateParts[2] + " " + dateParts[3] + ":" + dateParts[4];

		$http
			.post(inspiniaAdminNS.wsUrl + "did_add", $.param(request))
			.success(
			function (data) {
				if (data.apicode == 0) {
					//If DID is successfully added, add the keyword as well
					$scope.addKeyword(10);
				}
			}
		).error(
			//An error occurred with this request
			function(data, status, headers, config) {
				notify({message: "Failed to add new DID! Error code: " + data.apicode, classes: "alert-danger"});
			}
		);
	};

	$scope.editDID = function() {
		var request = {
			apikey : $cookieStore.get('inspinia_auth_token'),
			accountID : $scope.accountId,
			companyID: $scope.CompanyID,
			DIDID: $scope.smsCode.selectedDidId,
			sethttp: 1
		};

		if ($scope.smsCode.AccCode == 'Short') {
			if (typeof $scope.smsCode.ShortCodeName == 'undefined' || $scope.smsCode.ShortCodeName == null || $.trim($scope.smsCode.ShortCodeName) == '') {
				notify("Please enter the valid short code name.");
				return;
			}
			request.DIDName = $scope.smsCode.ShortCodeName;
			request.priorityMessaging = $scope.smsCode.ShortPriorities;
		} else {
			if (typeof $scope.smsCode.LongCodeName == 'undefined' || $scope.smsCode.LongCodeName == null || $.trim($scope.smsCode.LongCodeName) == '') {
				notify("Please enter the valid long code name.");
				return;
			}
			request.DIDName = $scope.smsCode.LongCodeName;
			request.priorityMessaging = $scope.smsCode.LongPriorities;
		}

		$http
			.post(inspiniaAdminNS.wsUrl + "did_modify", $.param(request))
			.success(
			function (data) {
				if (data.apicode == 0) {
					notify("SMS code is successfully saved!");
					$scope.refreshDidList();
					$scope.resetDIDFields();
				} else {
					notify({message: "Failed to save DID! Error message: " + data.apitext, classes: "alert-danger"});
				}
			}
		).error(
			//An error occurred with this request
			function(data, status, headers, config) {
				notify({message: "Failed to save DID! Error code: " + data.apicode, classes: "alert-danger"});
			}
		);
	};

	$scope.addKeyword = function(maxRetries) {
		maxRetries--;
		var keyword = '';
		var did;
		if ($scope.smsCode.AccCode == 'Long') {
			if (typeof $scope.smsCode.LongCode == 'undefined' || $scope.smsCode.LongCode == null || $.trim($scope.smsCode.LongCode) == '') {
				return;
			}
			did = $scope.smsCode.LongCode;
			//Long codes have a default keyword YES
			keyword = 'YES';
		} else {
			if (typeof $scope.smsCode.ShortCode == 'undefined' || $scope.smsCode.ShortCode == null || $.trim($scope.smsCode.ShortCode) == '') {
				return;
			}
			did = $scope.smsCode.ShortCode;
			//for short codes we have a random 5 letter keyword
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			for (var i = 0; i < 5; i++) {
				keyword += possible.charAt(Math.floor(Math.random() * possible.length));
			}
		}

		$http.post(inspiniaAdminNS.wsUrl + "accountkeyword_add",
			$.param({
				apikey : $cookieStore.get('inspinia_auth_token'),
				accountID : $scope.accountId,
				companyID: $scope.CompanyID,
				did: did,
				keyword: keyword,
				status: 'A',
				sethttp : 1
			})
		).success(
			function (data) {
				if (data.apicode == 0) {
					if ($scope.smsCode.AccCode == 'Long') {
						notify("Long code successfully added!")
					} else {
						notify("Short code successfully added!")
					}
					$scope.refreshDidList();
					$scope.resetDIDFields();
				}
			}
		).error(
			//An error occurred with this request
			function(data, status, headers, config) {
				if ($scope.smsCode.AccCode == 'Long') {
					notify({message: "Failed to add long code! Error code " + data.apicode, classes: "alert-danger"});
					return;
				}
				if (maxRetries <= 0) {
					notify({message: "Failed to add keyword, maximum number of retries reached! Error code: " + data.apicode, classes: "alert-danger"});
					return;
				}
				//recursively try to add keyword
				$scope.addKeyword(maxRetries);
			}
		);
	};

	$scope.cancelDID = function() {
		if (typeof $scope.smsCode.selectedDidId == 'undefined' || $scope.smsCode.selectedDidId == null) {
			return;
		}
		$http
			.post(inspiniaAdminNS.wsUrl + "did_cancel", $.param({
			apikey : $cookieStore.get('inspinia_auth_token'),
			accountID : $scope.accountId,
			DIDID: $scope.smsCode.selectedDidId,
			sethttp : 1
		}))
			.success(
			function (data) {
				if (data.apicode == 0) {
					//If DID is successfully deleted
					notify("SMS Code is successfully canceled.");
					$scope.refreshDidList();
					$scope.resetDIDFields();
				}
			}
		).error(
			//An error occurred with this request
			function(data, status, headers, config) {
				notify({message: "Failed to cancel SMS code! Error code: " + data.apicode, classes: "alert-danger"});
			}
		);
	};

	$scope.activateDID = function() {
		if (typeof $scope.smsCode.selectedDidId == 'undefined' || $scope.smsCode.selectedDidId == null) {
			return;
		}
		$http
			.post(inspiniaAdminNS.wsUrl + "did_activate", $.param({
			apikey : $cookieStore.get('inspinia_auth_token'),
			accountID : $scope.accountId,
			DIDID: $scope.smsCode.selectedDidId,
			sethttp : 1
		}))
			.success(
			function (data) {
				if (data.apicode == 0) {
					//If DID is successfully deleted
					notify("SMS Code is successfully activated.");
					$scope.refreshDidList();
					$scope.resetDIDFields();
				}
			}
		).error(
			//An error occurred with this request
			function(data, status, headers, config) {
				notify({message: "Failed to activate SMS code! Error code: " + data.apicode, classes: "alert-danger"});
			}
		);
	};

	$scope.populateSmsCode = function (smsCodeData) {
		$scope.resetDIDFields();
		if (typeof smsCodeData == 'undefined' || smsCodeData == null) {
			return;
		}
		if (smsCodeData.DID.length < 11) {
			//This is short code
			$scope.smsCode.AccCode = 'Short';
			$scope.smsCode.ShortCode = smsCodeData.DID;
			$scope.smsCode.ShortCodeName = smsCodeData.DIDName;
			$scope.smsCode.ShortPriorities = smsCodeData.priorityMessaging;
		} else {
			//This is long code
			$scope.smsCode.AccCode = 'Long';
			$scope.smsCode.LongCode = smsCodeData.DID;
			$scope.smsCode.LongCodeName = smsCodeData.DIDName;
			$scope.smsCode.LongPriorities = smsCodeData.priorityMessaging;
		}
		$scope.smsCode.selectedDidId = smsCodeData.DIDID;
		$scope.smsCode.status = smsCodeData.status;
	};

	$scope.refreshUsersList = function() {
		if (typeof $scope.accountId == 'undefined' || $scope.accountId == null) {
			return;
		}
		//Cancelling the account
		$http.post(
			inspiniaAdminNS.wsUrl + "user_get",
			$.param({
				apikey : $cookieStore.get('inspinia_auth_token'),
				accountID : $scope.accountId,
				sethttp : 1
			})
		).success(
			function (data) {
				if (data.apicode == 0) {
					$scope.UsersList = data.apidata;
				}
			}
		).error(
			//An error occurred with this request
			function(data, status, headers, config) {
				notify("An error occurred when getting users list! Error code: " + data.apicode);
				alert(JSON.stringify(data));
			}
		);
	};

	$scope.resetUserData = function() {
		if (typeof $scope.userData == 'undefined' || $scope.userData == '') {
			$scope.userData = {};
		}
		$scope.userData.UserName = null;
		$scope.userData.UserPassword = null;
		$scope.userData.UserEmail = null;
		$scope.userData.UserFirstName = null;
		$scope.userData.UserLastName = null;
		$scope.userData.Role = 'accountadmin';
		$scope.userData.selectedUserId = null;
		$scope.userData.active = 1;
	};

	$scope.populateUser = function(userData) {
		if (typeof $scope.userData == 'undefined' || $scope.userData == '') {
			$scope.userData = {};
		}
		$scope.userData.UserName = userData.userName;
		$scope.userData.UserPassword = null;
		$scope.userData.UserEmail = userData.emailAddress;
		$scope.userData.UserFirstName = userData.firstName;
		$scope.userData.UserLastName = userData.lastName;
		$scope.userData.Role = 'accountadmin';
		$scope.userData.selectedUserId = userData.userId;
		$scope.userData.active = userData.active;
	};

	$scope.saveUser = function() {
		//Setting request parameters
		var request = {
			companyID: $scope.CompanyID,
			accountID: $scope.accountId,
			emailAddress: $scope.userData.UserEmail,
			firstName: $scope.userData.UserFirstName,
			lastName: $scope.userData.UserLastName,
			role: $scope.userData.Role,
			apikey: $cookieStore.get('inspinia_auth_token'),
			sethttp: 1
		};

		var requestPage = "user_add";
		//Checking if this is modify account request
		var modify = $scope.userData.selectedUserId != null && $scope.userData.selectedUserId != '';
		if (modify) {
			request.userID = $scope.userData.selectedUserId;
			requestPage = "user_modify";
		} else {
			request.newUsername = $scope.userData.UserName;
			request.newUserPassword = $scope.userData.UserPassword;
		}

		$http.post(
			inspiniaAdminNS.wsUrl + requestPage, $.param(request)
		).success(
			function (data) {
				if (data.apicode == 0) {
					if (modify) {
						notify("User data is successfully updated!");
					} else {
						notify("New user is successfully created!");
					}
					$scope.resetUserData();
					$scope.refreshUsersList();
				} else {
					if (modify) {
						notify("Updating user data failed! Please try again!");
					} else {
						notify("Creating user failed! Please try again!");
					}
				}
			}).error(
			//An error occurred with this request
			function(data, status, headers, config) {
				if (status == 422) {
					//some input parameters are invalid
					var invalidParameter = '';
					var invalidParameterName = null;
					var operation = modify ? 'update' : 'create';
					var errorDescription = '';
					if (data.apitext) {
						var errorParamsMap = [];
						errorParamsMap['newusername'] = "User Name";
						errorParamsMap['newuserpassword'] = "User Password";
						errorParamsMap['firstname'] = "First Name";
						errorParamsMap['lastname'] = "Last Name";
						errorParamsMap['emailaddress'] = "Email Address";
						errorParamsMap['role'] = "Role";
						var errorMessageParts = data.apitext.split(':');
						invalidParameter = errorMessageParts[0];
						errorDescription = $.trim(errorMessageParts[1]);
						invalidParameterName = errorParamsMap[invalidParameter];
					}
					if (typeof invalidParameterName != 'undefined' && invalidParameterName != null && invalidParameterName != '') {
						if (invalidParameter == 'newusername' && errorDescription == 'already exists') {
							notify({message: "Failed to " + operation + " user. User with the specified username already exists!", classes : 'alert-danger'});
						} else {
							notify({message: "Failed to " + operation + " user. Invalid parameter " + invalidParameterName + "!", classes : 'alert-danger'});
						}
					} else {
						notify({message: "Failed to " + operation + " user. Please check your input parameters and try again!", classes : 'alert-danger'});
					}
					//alert(JSON.stringify(data));
					return;
				}
				notify("Unexpected error occurred when trying to " + operation + " user!");
			}
		);
	};

	$scope.activateDeactivateUser = function(activate) {
		//Checking input parameters
		if (typeof activate == 'undefined' || (activate != 1 && activate != 0)) {
			return;
		}
		//Checking if user data is set
		if (typeof $scope.userData == 'undefined' || typeof $scope.userData.selectedUserId == 'undefined' || $scope.userData.selectedUserId == null || $scope.userData.selectedUserId == null) {
			return;
		}

		var request = {
			companyID: $scope.CompanyID,
			accountID: $scope.accountId,
			active: activate,
			userID: $scope.userData.selectedUserId,
			apikey: $cookieStore.get('inspinia_auth_token'),
			sethttp: 1
		};
		var requestPage = "user_modify";

		$http.post(
			inspiniaAdminNS.wsUrl + requestPage, $.param(request)
		).success(
			function (data) {
				if (data.apicode == 0) {
					if (activate == 1) {
						notify("User is successfully activated!");
					} else {
						notify("User is successfully deactivated!");
					}
					$scope.resetUserData();
					$scope.refreshUsersList();
				} else {
					if (activate == 1) {
						notify("Activating user failed! Please try again!");
					} else {
						notify("Deactivating user failed! Please try again!");
					}
				}
			}).error(
			//An error occurred with this request
			function(data, status, headers, config) {
				if (status == 422) {
					//some input parameters are invalid
					notify("Invalid input parameters!");
					alert(JSON.stringify(data));
					return;
				}
				notify("Unexpected error occurred when trying to " + operation + " user!");
			}
		);
	};

	$scope.loadProductPackages = function(){
		var request = {
			apikey: $cookieStore.get('inspinia_auth_token'),
			companyID: $scope.CompanyID,
			status: 'A',
			sethttp: 1
		};
		var requestPage = 'productpackage_get';

		$http.post(
			inspiniaAdminNS.wsUrl + requestPage, $.param(request)
		).success(
			function (data) {
				$scope.ProductPackageList = data.apidata;
				doneWaitingFor.push('PRODUCTPACKAGES');
				if(doneWaiting()){
					waitForData.resolve();
				}
			}
		).error(
				function(){
					doneWaitingFor.push('PRODUCTPACKAGES');
					if(doneWaiting()){
						waitForData.resolve();
					}
				}
		);
	};

	$scope.loadCountries = function(){
		var request = {
			apikey: $cookieStore.get('inspinia_auth_token'),
			sethttp: 1
		};
		var requestPage = 'countries_get';

		$http.post(
				inspiniaAdminNS.wsUrl + requestPage, $.param(request)
			).success(
			function (data) {
				$scope.CountriesList = data.apidata;
				doneWaitingFor.push('COUNTRIES');
				if(doneWaiting()){
					waitForData.resolve();
				}
			}
		).error(
			function(){
				doneWaitingFor.push('COUNTRIES');
				if(doneWaiting()){
					waitForData.resolve();
				}
			}
		);
	};

	$scope.loadProductPackages();
	$scope.loadCountries();

	waitForData.promise.then(function(){
		doneWaitingFor = [];
		$scope.refreshAccount();
		$scope.refreshDidList();
		$scope.refreshUsersList();
		$scope.resetUserData();
	});

	$scope.$watch('UseShortPrimary', function(newValue, oldValue){
		if(newValue == 1){
			/*angular.forEach($scope.DidList, function(value, key){
			 if(value.status == 'A' && value.DID.length < 10){
			 $scope.PrimaryDID = value.DID;
			 }
			 });*/
			$scope.PrimaryDID = HARDCODED.globalShortCode;
		}
	});
});


//Login
superAdmin.controller('loginCtrl', function($scope, $cookieStore, $http, $window) {
	$scope.invalidCredentials = false;
	//Reset authentication token
	$cookieStore.put('inspinia_auth_token', '');
	$cookieStore.put('inspinia_account_id', '');
	$cookieStore.put('inspinia_company_id', '');
	//Login function
	$scope.login = function() {
		$scope.invalidCredentials = false;
		//Checking if username and password are provided
		if (typeof $scope.username == 'undefined' || $scope.username == null || $scope.username == '') {
			return;
		}
		if (typeof $scope.password == 'undefined' || $scope.password == null || $scope.password == '') {
			return;
		}
		//Calling rest service to sign in
		$http.post(inspiniaAdminNS.wsUrl + "login", $.param({
			username : $scope.username,
			password : $scope.password
		})).success(
			//Successful request to the server
			function(data, status, headers, config) {
				if (data == null || typeof data.apicode == 'undefined') {
					//This should never happen
					alert("Unknown error occurred when trying to sign in! Please try again.");
					return;
				}
				if (data.apicode == 0) {
					//User signed in successfully
					$cookieStore.put('inspinia_auth_token', data.apikey);
					$cookieStore.put('inspinia_account_id', data.apidata.accountID);
					$cookieStore.put('inspinia_company_id', data.apidata.companyID);
					$window.location.href = "/admin/#/";
				} else if (data.apicode == 2) {
					//Invalid credentials
					$scope.invalidCredentials = true;
				} else {
					alert("An error occurred when trying to sign in. Error code: " + data.apicode);
				}
			}).error(
			//An error occurred with this request
			function(data, status, headers, config) {
				if (status != 401) {
					alert("Failed to sign in! Please try again.");
				}
			});
	};
});