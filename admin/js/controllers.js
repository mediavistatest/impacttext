// create the controller and inject Angular's $scope
superAdmin.controller('mainController', function($scope) {
    // create a messCompanyID to display in our view
});


// Account List
superAdmin.controller('AccountListCtrl', function($scope) {
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
        fields: ['AccountName'],
        directions: ['ASC'],
        useExternalSorting: true
    };
    $scope.myData = [{
        AccountName: "Impact Telecom",
        CompanyID: 50,
        FirstName: "Bill",
        LastName: "Potter",
        EmailAddress: "bpotter@impacttelecom.com"
    }, {
        AccountName: "ImpactConnect",
        CompanyID: 43,
        FirstName: "Ann",
        LastName: "Cooper",
        EmailAddress: "acooper@impacttelecom.com"
    }, {
        AccountName: "Excel",
        CompanyID: 27,
        FirstName: "John",
        LastName: "Doe",
        EmailAddress: "jdoe@impacttelecom.com"
    }, {
        AccountName: "HostedPBX",
        CompanyID: 29,
        FirstName: "Jane",
        LastName: "Doe",
        EmailAddress: "janed@impacttelecom.com"
    }, {
        AccountName: "Global Mobility",
        CompanyID: 34,
        FirstName: "Don",
        LastName: "Draper",
        EmailAddress: "dd@impacttelecom.com"
    }];
    $scope.gridOptions = {
        data: 'myData',
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
            field: 'AccountName',
            displayName: 'Account Name'
        }, {
            field: 'CompanyID',
            displayAccountName: 'Company ID'
        }, {
            field: 'FirstName',
            displayName: 'Name',
            cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.entity.FirstName}} {{row.entity.LastName}}</div>'
        }, {
            field: 'EmailAddress',
            displayName: 'Email Address'
        }, {
            field: '',
            displayName: '',
            cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a class="btn"><i class="fa fa-pencil"></i> Manage Account </a></div>'
        }]
    };
});


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