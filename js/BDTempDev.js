var profile = {
    Controller : function($scope, $http) {
        var pCtrl = this;

        pCtrl.bucketOfMessages = null;
        pCtrl.messageCount = null;

        //DOUGHNUT DATA FOR PROFILE
        pCtrl.doughnutData = [{
            value : pCtrl.bucketOfMessages,
            color : "#a3d7ff",
            highlight : "#a3d7ff",
            label : "Messages available"
        }, {
            value : pCtrl.messageCount,
            color : "#005fab",
            highlight : "#005fab",
            label : "Messages sent"
        }];

        /**
         * Options for Doughnut chart
         */
        pCtrl.doughnutOptions = {
            segmentShowStroke : true,
            segmentStrokeColor : "#fff",
            segmentStrokeWidth : 2,
            percentageInnerCutout : 70, // This is 0 for Pie charts
            animationSteps : 100,
            animationEasing : "easeOutBounce",
            animateRotate : true,
            animateScale : false
        };

        var updateDouhnutOptions = function() {
            pCtrl.doughnutData[0].value = pCtrl.bucketOfMessages - pCtrl.messageCount;
            pCtrl.doughnutData[1].value = pCtrl.messageCount;
        };

        $scope.$watch('pCtrl.messageCount', updateDouhnutOptions, true);
        //$scope.$watch('pCtrl.bucketOfMessages', updateDouhnutOptions, true);

        //get messages count
        var $param = $.param({
            apikey : $scope.main.authToken,
            accountID : $scope.main.accountID
        });
        $http.post(inspiniaNS.wsUrl + 'reporting_getbom', $param)
        // success function
        .success(function(result) {
            pCtrl.bucketOfMessages = result.apidata.bucketOfMessages;
            pCtrl.messageCount = result.apidata.messageCount;
        })
        // error function
        .error(function(data, status, headers, config) {
            console.log('reporting_getbom error');
        });
    }
};

var ngInbox = {
    _internal : {
        ErrorMsg : '',
        getDataTimeout : 200,
        DataConstructors : {
            PageOptions : function(settings) {
                var self = this;
                self.pageSizes = [10, 20, 50, 100];
                self.pageSize = Number(settings.defaultPageSize);
                self.currentPage = 1;
            },
            ThreadPageOptions : function(settings) {
                var self = this;
                self.pageSize = Number(settings.defaultPageSize);
                self.currentPage = 1;
                self.threadMessagesCount = 0;
                self.lastPage = 1;
            },
            FilterOptions : function() {
                var self = this;
                self.filterText = '';
                var monthBeforeToday = new Date();
                monthBeforeToday.setMonth(monthBeforeToday.getMonth() - 1);
                self.startDate = monthBeforeToday;
                var monthAfterToday = new Date();
                monthAfterToday.setMonth(monthAfterToday.getMonth() + 1);
                self.endDate = monthAfterToday;
            }
        },
        Methods : {
            GenerateOrderByField : function(controllerParent) {
                var orderBy = '';
                for (var i in controllerParent.$scope.sortOptions.fields) {
                    if (controllerParent.$scope.sortOptions.fields[i] == '') {
                        continue;
                    }
                    var sortOrder = typeof controllerParent.$scope.sortOptions.directions[i] == 'undefined' || controllerParent.$scope.sortOptions.directions[i] == null ? 'asc' : controllerParent.$scope.sortOptions.directions[i].toLowerCase();
                    if (orderBy != '') {
                        orderBy += ', ';
                    }
                    if (controllerParent.$scope.sortOptions.fields[i].toLowerCase() == 'con_lis') {
                        //TODO srediti ovo kad api bude podrzavao vise kolona u sortu
                        //orderBy += 'ani,';
                        orderBy += 'contactlistname' + " " + sortOrder;
                    } else {
                        orderBy += controllerParent.$scope.sortOptions.fields[i].toLowerCase() + " " + sortOrder;
                    }
                }
                if (orderBy == '') {
                    orderBy = controllerParent.defaultSortField;
                }

                return orderBy;
            },
            GetLocalDateTimeString : function(utcDateTime) {
                var dateOutputFormat = 'YYYY-mm-DD HH:MM:SS';
                if (utcDateTime) {
                    var dateStr = '';
                    var resDate = '';
                    var datePart = utcDateTime.substring(0, 10);
                    var hourPart = utcDateTime.substring(11, 13);
                    var minPart = utcDateTime.substring(14, 16);
                    var secPart = utcDateTime.substring(17, 19);

                    var tmpDate = new Date(datePart);
                    tmpDate.setUTCHours(hourPart);
                    tmpDate.setUTCMinutes(minPart);
                    tmpDate.setUTCSeconds(secPart);
                    // dateStr = tmpDate.toLocaleDateString();

                    var year;
                    var month;
                    var day;
                    var hour;
                    var minutes;
                    var seconds;

                    switch (dateOutputFormat) {
                    case 'YYYY-mm-DD HH:MM:SS' :
                        var year = '' + tmpDate.getFullYear();
                        var month = ('0' + (tmpDate.getMonth() + 1)).substr(-2);
                        var day = ('0' + tmpDate.getDate()).substr(-2);
                        var hour = ('0' + tmpDate.getHours()).substr(-2);
                        var minutes = ('0' + tmpDate.getMinutes()).substr(-2);
                        var seconds = ('0' + tmpDate.getSeconds()).substr(-2);

                        resDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;

                        // console.log('resDate:' + resDate)
                        break;
                    }

                    // console.log(dateStr)

                    // while (dateStr.indexOf('/') > -1) {
                    // if (resDate) {
                    // resDate =(dateStr.substring(0, dateStr.indexOf('/'))).slice(-2) + '-' + resDate;
                    // } else {
                    // resDate = (dateStr.substring(0, dateStr.indexOf('/'))).slice(-2);
                    // }
                    //
                    // dateStr = dateStr.substring(dateStr.indexOf('/') + 1, dateStr.length);
                    // }
                    //
                    // while (dateStr.indexOf('/') > -1) {
                    // dateStr
                    // }

                    // resDate = dateStr.replace(/\//g, "-");
                    // resDate = resDate + ' ' + tmpDate.toLocaleTimeString();

                    // console.log('---------------' + resDate)
                    return resDate;
                }
            },
            IsDate : function(possibleDate) {
                var parsedDate = Date.parse(possibleDate);

                if (possibleDate && possibleDate.length == 19 && !possibleDate.match("[a-zA-Z]+")) {
                    //If here than its date
                    return true;
                } else {
                    return false;
                }

                // // You want to check again for !isNaN(parsedDate) here because Dates can be converted
                // // to numbers, but a failed Date parse will not.
                // //exclude strings with letters in them, those are not dates
                // if (isNaN(possibleDate) && !isNaN(parsedDate) && !possibleDate.match("[a-zA-Z]+")) {
                // //If here than its date
                // return true;
                // } else {
                // return false;
                // }
            },
            ConvertDateToYYYYmmDD : function(inDate, inFormat) {
                var tmpDate = new Date(inDate);
                if (isNaN(tmpDate)) {
                    var dateInYYYYmmDD;
                    switch (inFormat) {
                    case 'YYYY-DD-mm' :
                        dateInYYYYmmDD = inDate.substring(0, 4) + '-' + inDate.substring(8, 10) + '-' + inDate.substring(5, 7);
                        break;
                    default:
                        break;
                    }
                    return dateInYYYYmmDD;
                } else {
                    return inDate;
                }
            },
            ConvertObjectUTCDateTimePropsToLocalTime : function(objectToconvertDates) {
                var data = objectToconvertDates;
                if (data.length) {
                    for (var i = 0; i < data.length; i++) {
                        for (var key in data[i]) {
                            if (data[i].hasOwnProperty(key)) {
                                // console.log(key + ':' + data[i][key])
                                if (ngInbox._internal.Methods.IsDate(data[i][key])) {
                                    // console.log(key + ':' + data[i][key])
                                    // console.log('BEFORE CONVERSION: ' + key + ':' + data[i][key]);
                                    data[i][key] = ngInbox._internal.Methods.GetLocalDateTimeString(data[i][key]);
                                    // console.log('AFTER CONVERSION: ' + key + ':' + data[i][key]);
                                }
                            }
                        }
                    }
                } else {
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            // console.log(key + ':' + ngInbox._internal.Methods.GetLocalDateTimeString(data[key]))
                            if (ngInbox._internal.Methods.IsDate(data[key])) {
                                // console.log(key + ':' + ngInbox._internal.Methods.GetLocalDateTimeString(data[key]))
                                // console.log('BEFORE CONVERSION: ' + key + ':' + data[key]);
                                data[i][key] = ngInbox._internal.Methods.GetLocalDateTimeString(data[key]);
                                // console.log('AFTER CONVERSION: ' + key + ':' + data[key]);
                            }
                        }
                    }
                }

                return data;
            },
            SetPagingDataSliced : function($scope, data, totalResultsCount) {
                $scope.ngData = ngInbox._internal.Methods.ConvertObjectUTCDateTimePropsToLocalTime(data);
                // $scope.ngData = data;
                $scope.totalServerItems = totalResultsCount;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                setTimeout(function() {
                    $scope.ngOptions.selectAll(false);
                }, 100);
            },
            GetPagedDataAsync : function(controllerParent) {
                if (!controllerParent.getDataBlocked) {
                    controllerParent.getDataBlocked = true;
                    setTimeout(function() {
                        controllerParent.getDataBlocked = false;
                    }, ngInbox._internal.getDataTimeout);

                    var pageSize = controllerParent.$scope.pagingOptions.pageSize;
                    var page = controllerParent.$scope.pagingOptions.currentPage;

                    var searchText = controllerParent.$scope.filterOptions.filterText;
                    var startDate = controllerParent.$scope.filterOptions.startDate;
                    var endDate = controllerParent.$scope.filterOptions.endDate;

                    var params = {
                        apikey : controllerParent.$scope.main.authToken,
                        accountID : controllerParent.$scope.main.accountID,
                        //companyID : controllerParent.$scope.main.accountInfo.companyID,
                        limit : pageSize,
                        offset : (page - 1) * pageSize,
                        status : controllerParent.getListStatus,
                        orderby : ngInbox._internal.Methods.GenerateOrderByField(controllerParent),
                        sethttp : 1
                    };

                    if (String(searchText).length > 3) {
                        params.search = String(searchText).toLowerCase();
                    } else {
                        if (String(searchText).length != 0)
                            return;
                    }

                    if (startDate) {
                        params.startDate = startDate.toISOString().substring(0, 10) + ' 00:00:00';
                    }
                    if (endDate) {
                        params.endDate = endDate.toISOString().substring(0, 10) + ' 00:00:00';

                    }

                    var $param = $.param(params);

                    //POST
                    controllerParent.$http.post(inspiniaNS.wsUrl + controllerParent.getListAction, $param)
                    // success function
                    .success(function(result) {
                        controllerParent.PostSuccess(controllerParent, result);
                    })
                    // error function
                    .error(function(data, status, headers, config) {
                        console.log(ngInbox._internal.ErrorMsg);
                    });
                }

            },
            GetThread : function(controllerParent, getFullThread, continueFunction) {
                var pageSize = controllerParent.ThreadPageOptions.pageSize;
                var page = controllerParent.ThreadPageOptions.currentPage;
                var ani = controllerParent.clickedMessage.sourceANI ? controllerParent.clickedMessage.sourceANI : controllerParent.clickedMessage.ANI;

                var params = {
                    apikey : controllerParent.$scope.main.authToken,
                    accountID : controllerParent.$scope.main.accountID,
                    companyID : controllerParent.$scope.main.accountInfo.companyID,
                    sethttp : 1,
                    ani : ani,
                    desc : 'Y'
                };

                if (!getFullThread) {
                    params.limit = pageSize;
                    params.offset = (page - 1) * pageSize;
                }

                var $param = $.param(params);

                //POST
                controllerParent.$http.post(inspiniaNS.wsUrl + 'messages_messagelog', $param)
                // success function
                .success(function(result) {
                    controllerParent.ThreadPageOptions.threadMessagesCount = result.apicount;
                    controllerParent.ThreadPageOptions.lastPage = Math.ceil(Number(controllerParent.ThreadPageOptions.threadMessagesCount) / controllerParent.ThreadPageOptions.pageSize);
                    controllerParent.clickedMessage.threadMessages = result.apidata;

                    if (continueFunction) {
                        continueFunction(controllerParent);
                    }
                })
                // error function
                .error(function(data, status, headers, config) {
                    console.log('GetThread error');
                });

            },
            PopulateScope : function(controllerParent) {
                var cookie = ngInbox._internal.Settings.GetCookie(controllerParent);
                if (cookie != null) {
                    var parentCookie = $.grep(cookie, function(member) {
                        return member.Name == controllerParent.Name;
                    });
                    if (parentCookie.length != 0) {
                        controllerParent.columnDefs = parentCookie[0].columnDefs;
                    }
                }
                ngInbox._internal.ErrorMsg = controllerParent.errorMessage;

                controllerParent.$scope.mySelections = [];
                controllerParent.$scope.totalServerItems = 0;
                controllerParent.$scope.sortOptions = controllerParent.sortOptions;
                controllerParent.$scope.pagingOptions = new ngInbox._internal.DataConstructors.PageOptions(controllerParent.$scope.main.Settings);
                controllerParent.$scope.filterOptions = new ngInbox._internal.DataConstructors.FilterOptions();

                //GET DATA
                controllerParent.$scope.setPagingDataSliced = ngInbox._internal.Methods.SetPagingDataSliced;
                controllerParent.$scope.getPagedDataAsync = ngInbox._internal.Methods.GetPagedDataAsync;
                controllerParent.$scope.DeleteMessage = ngInbox._internal.Methods.DeleteMessage;
                controllerParent.$scope.DeleteMessages = ngInbox._internal.Methods.DeleteMessages;
                controllerParent.$scope.MarkAsReadMessage = ngInbox._internal.Methods.MarkAsReadMessage;
                controllerParent.$scope.MarkAsReadMessages = ngInbox._internal.Methods.MarkAsReadMessages;
                controllerParent.$scope.RestoreToInboxMessage = ngInbox._internal.Methods.RestoreToInboxMessage;
                controllerParent.$scope.RestoreToInboxMessages = ngInbox._internal.Methods.RestoreToInboxMessages;
                controllerParent.$scope.ResendMessage = ngInbox._internal.Methods.ResendMessage;
                controllerParent.$scope.ResendMessages = ngInbox._internal.Methods.ResendMessages;
                controllerParent.$scope.MarkAsUnreadMessage = ngInbox._internal.Methods.MarkAsUnreadMessage;
                controllerParent.$scope.MarkAsUnreadMessages = ngInbox._internal.Methods.MarkAsUnreadMessages;
                controllerParent.$scope.ExportMessages = ngInbox._internal.Methods.ExportMessages;
                controllerParent.$scope.ExportMessage = ngInbox._internal.Methods.ExportMessage;
                controllerParent.$scope.ExportThread = ngInbox._internal.Methods.ExportThread;

                //WHATCH
                controllerParent.$scope.$watch('pagingOptions', function() {
                    controllerParent.$scope.getPagedDataAsync(controllerParent);
                }, true);

                controllerParent.$scope.$watch('filterOptions', function() {
                    controllerParent.$scope.getPagedDataAsync(controllerParent);
                }, true);

                controllerParent.$scope.$watch('sortOptions.fields', function() {
                    controllerParent.$scope.getPagedDataAsync(controllerParent);
                }, true);

                controllerParent.$scope.$watch('sortOptions.directions', function() {
                    controllerParent.$scope.getPagedDataAsync(controllerParent);
                }, true);

                controllerParent.$scope.$watch('ngData', function() {
                    $('.gridStyle').trigger('resize');
                });

                // INITIAL GET DATA
                controllerParent.$scope.getPagedDataAsync(controllerParent);

                //TABLE OPTIONS
                controllerParent.$scope.columnDefs = ngInbox._internal.Settings.GrepColumnDefs(controllerParent.columnDefs);
                controllerParent.$scope.ngOptions = {
                    data : 'ngData',
                    enableSorting : true,
                    useExternalSorting : true,
                    sortInfo : controllerParent.$scope.sortOptions, //'sortOptions',
                    rowHeight : 35,
                    selectedItems : controllerParent.$scope.mySelections,
                    showSelectionCheckbox : true,
                    multiSelect : true,
                    selectWithCheckboxOnly : true,
                    enablePaging : true,
                    showFooter : true,
                    footerTemplate : 'views/table/footerTemplate.html',
                    totalServerItems : 'totalServerItems',
                    pagingOptions : controllerParent.$scope.pagingOptions, //'pagingOptions',
                    filterOptions : controllerParent.$scope.filterOptions, //'filterOptions',
                    columnDefs : 'columnDefs', //controllerParent.columnDefs,
                    primaryKey : controllerParent.primaryKey
                };

                controllerParent.$scope.controllerParent = controllerParent;
            },

            GetANIorList : function(controllerParent, continueFunction) {
                try {
                    if (controllerParent.$scope.fromNumbers == null) {
                        controllerParent.$scope.fromNumbers = controllerParent.$scope.main.fromNumbers;
                    }
                    if (controllerParent.$scope.contactLists == null) {
                        controllerParent.$scope.contactLists = controllerParent.$scope.main.contactLists;
                    }
                    if (controllerParent.clickedMessage) {
                        if (controllerParent.clickedMessage.ANI) {
                            if (controllerParent.clickedMessage.ANI.length == 10) {
                                controllerParent.ANIList = controllerParent.clickedMessage.ANI;
                                controllerParent.ANIListForSending = '1' + controllerParent.clickedMessage.ANI;
                                continueFunction(controllerParent);
                            } else {

                                if (controllerParent.clickedMessage.ANI.length == 11) {
                                    if (controllerParent.clickedMessage.ANI[0] == '1') {
                                        controllerParent.ANIList = controllerParent.clickedMessage.ANI.substring(1);
                                    }
                                    controllerParent.ANIListForSending = controllerParent.clickedMessage.ANI;
                                    continueFunction(controllerParent);

                                } else {
                                    var callback = function(data) {
                                        controllerParent.ANIList = '';
                                        controllerParent.ANIListForSending = data.apidata;
                                        var tmpANIList_ = data.apidata;

                                        while (tmpANIList_.indexOf(',') != -1) {
                                            var commaPosition_ = tmpANIList_.indexOf(',');
                                            var currentPhoneNumber_ = tmpANIList_.substring(0, commaPosition_);

                                            var tmpANI_ = tmpANIList_.substring(0, commaPosition_);
                                            tmpANIList = tmpANIList_.substring(commaPosition + 1);
                                            if (tmpANI_.length == 11) {
                                                tmpANIForSending_ = tmpANI_;
                                                tmpANI_ = tmpANI_.substring(1);
                                            }

                                            if (controllerParent.ANIList == '') {
                                                controllerParent.ANIList = tmpANI_;
                                            } else {
                                                controllerParent.ANIList = controllerParent.ANIList + ', ' + tmpANI_;
                                            }

                                        };
                                        if (tmpANIList_.length == 11) {
                                            tmpANIList_ = tmpANIList_.substring(1);
                                        }

                                        controllerParent.ANIList = controllerParent.ANIList + ', ' + tmpANIList_;

                                        continueFunction(controllerParent);
                                    };

                                    var params = {
                                        apikey : controllerParent.$cookieStore.get('inspinia_auth_token'),
                                        accountID : controllerParent.$cookieStore.get('inspinia_account_id'),
                                        outboundMessageID : controllerParent.clickedMessage.outboundMessageID
                                    };

                                    //Send request to the server
                                    controllerParent.$http.post(inspiniaNS.wsUrl + "messages_outboundmessageani_get", $.param(params))
                                    //Successful request to the server
                                    .success(function(data, status, headers, config) {
                                        if (data == null || typeof data.apicode == 'undefined') {
                                            //This should never happen
                                            controllerParent.$scope.$broadcast("ErrorOnMessages", 'Unidentified error occurred when trying to get ANI!');
                                            return;
                                        }
                                        if (data.apicode == 0) {
                                            //Reset form and inform user about success
                                            // controllerParent.$scope.$broadcast("SendingMessageSucceeded", data.apidata);
                                            return callback(data);
                                        } else {
                                            controllerParent.$scope.$broadcast("ErrorOnMessages", 'An error occurred when trying to get ANI! Error code: ' + data.apicode);
                                        }
                                    }).error(
                                    //An error occurred with this request
                                    function(data, status, headers, config) {
                                        if (status == 400) {
                                            if (data.apicode == 1) {
                                                controllerParent.$scope.$broadcast("ErrorOnMessages", 'ANI that you are trying to send message to is opted-out!');
                                            } else {
                                                //Just non handled errors by optout are counted
                                                controllerParent.$scope.$broadcast("ErrorOnMessages", ngInbox._internal.ErrorMsg);
                                            }
                                        }
                                    });

                                }
                            }
                        } else if (controllerParent.clickedMessage.contactListName) {
                            continueFunction(controllerParent);
                        }
                    }
                } catch(e) {
                    console.log('GetANI catch ' + e.message + ' ' + e.stack);
                }
            },
            StatusChange : function(controllerParent, messageToChangeStatusArray, changeToStatus, callback) {
                var params = {
                    apikey : controllerParent.$cookieStore.get('inspinia_auth_token'),
                    accountID : controllerParent.$cookieStore.get('inspinia_account_id')
                    // status : changeToStatus,
                };

                var msgList_ = '';
                for (var j = 0; j < messageToChangeStatusArray.length; j++) {
                    var tempId_;
                    switch (controllerParent.getListAction) {
                    case 'messages_inbound' :
                        tempId_ = messageToChangeStatusArray[j].inboundMessageID;
                        break;
                    case 'messages_outbound' :
                        // NOT DEFINED YET
                        tempId_ = messageToChangeStatusArray[j].outboundMessageID;
                        break;
                    }

                    if (msgList_ == '') {
                        msgList_ = tempId_;
                    } else {
                        msgList_ = msgList_ + ',' + tempId_;
                    }

                }
                var apiCallAction_ = '';
                switch (controllerParent.getListAction) {
                case 'messages_inbound' :
                    params.inboundMessageId = msgList_;
                    params.status = changeToStatus;
                    params.sethttp = 1;
                    apiCallAction_ = controllerParent.statusChangeAction;
                    break;
                case 'messages_outbound' :
                    // NOT DEFINED YET
                    params.outboundMessageID = msgList_;
                    apiCallAction_ = controllerParent.deleteMessagesChangeAction;
                    break;
                }
                var $param = $.param(params);

                //POST
                controllerParent.$http.post(inspiniaNS.wsUrl + apiCallAction_, $param)
                // success function
                .success(function(result) {
                    if (result == null || typeof result.apicode == 'undefined') {
                        //This should never happen
                        controllerParent.$scope.$broadcast("ErrorOnMessages", ngInbox._internal.ErrorMsg);
                        return;
                    }
                    if (result.apicode == 0) {
                        //Reset form and inform user about success
                        callback();
                    } else {
                        controllerParent.$scope.$broadcast("ErrorOnMessages", ngInbox._internal.ErrorMsg + ' Error code: ' + result.apicode + ' ' + result.apitext);
                    }
                })
                // error function
                .error(function(data, status, headers, config) {
                    controllerParent.$scope.$broadcast("ErrorOnMessages", 'Request error: ' + ngInbox._internal.ErrorMsg);
                });
            },
            DeleteMessage : function(controllerParent, messageList) {
                ngInbox._internal.ErrorMsg = 'Delete message(s) failed!';
                var callback = function() {
                    controllerParent.$scope.$broadcast("DeleteMessageSucceeded");
                    controllerParent.$scope.getPagedDataAsync(controllerParent);
                    controllerParent.Events.ShowList(controllerParent);
                };
                if (!messageList) {
                    messageList = [controllerParent.clickedMessage];
                }

                ngInbox._internal.Methods.StatusChange(controllerParent, messageList, controllerParent.deleteMessageStatus, callback);
            },
            DeleteMessages : function(controllerParent) {
                ngInbox._internal.Methods.DeleteMessage(controllerParent, controllerParent.$scope.mySelections);
            },
            MarkAsReadMessage : function(controllerParent, messageList) {
                ngInbox._internal.ErrorMsg = 'Mark as read message(s) failed!';
                var callback = function() {
                    controllerParent.$scope.$broadcast("MarkAsReadMessageSucceeded");
                    controllerParent.$scope.getPagedDataAsync(controllerParent);
                    controllerParent.Events.ShowList(controllerParent);
                };
                if (!messageList) {
                    messageList = [controllerParent.clickedMessage];
                }

                ngInbox._internal.Methods.StatusChange(controllerParent, messageList, controllerParent.markAsReadMessageStatus, callback);
            },
            MarkAsReadMessages : function(controllerParent) {
                ngInbox._internal.Methods.MarkAsReadMessage(controllerParent, controllerParent.$scope.mySelections);
            },
            MarkAsUnreadMessage : function(controllerParent, messageList) {
                ngInbox._internal.ErrorMsg = 'Mark as unread message(s) failed!';
                var callback = function() {
                    controllerParent.$scope.$broadcast("MarkAsUnreadMessageSucceeded");
                    controllerParent.$scope.getPagedDataAsync(controllerParent);
                    controllerParent.Events.ShowList(controllerParent);
                };
                if (!messageList) {
                    messageList = [controllerParent.clickedMessage];
                }

                ngInbox._internal.Methods.StatusChange(controllerParent, messageList, controllerParent.markAsUnreadMessageStatus, callback);
            },
            MarkAsUnreadMessages : function(controllerParent) {
                ngInbox._internal.Methods.MarkAsUnreadMessage(controllerParent, controllerParent.$scope.mySelections);
            },
            RestoreToInboxMessage : function(controllerParent, messageList) {
                ngInbox._internal.ErrorMsg = 'Restoring message(s) from trash failed!';
                var callback = function() {
                    controllerParent.$scope.$broadcast("RestoreToInboxMessageSucceeded");
                    controllerParent.$scope.getPagedDataAsync(controllerParent);
                    controllerParent.Events.ShowList(controllerParent);
                };
                if (!messageList) {
                    messageList = [controllerParent.clickedMessage];
                }

                ngInbox._internal.Methods.StatusChange(controllerParent, messageList, controllerParent.restoreMessageStatus, callback);
            },
            RestoreToInboxMessages : function(controllerParent) {
                ngInbox._internal.Methods.RestoreToInboxMessage(controllerParent, controllerParent.$scope.mySelections);
            },
            SendMessage : function(controllerParent, messageToSendArray, changeToStatus, callback, broadcastOutside) {
                // var successfullRequestsCount_ = 0;
                // var totalNumberOfMessages_ = messageToSendArray.length;
                for (var j = 0; j < messageToSendArray.length; j++) {
                    var params = {
                        apikey : controllerParent.$cookieStore.get('inspinia_auth_token'),
                        accountID : controllerParent.$cookieStore.get('inspinia_account_id')
                        // sethttp : 1
                    };
                    params.message = messageToSendArray[j].message;

                    if (parseInt(messageToSendArray[j].contactListID)) {
                        params.contactListID = parseInt(messageToSendArray[j].contactListID);
                    }

                    params.DID = messageToSendArray[j].DID;
                    controllerParent.params = params;

                    continueFunction = function(controllerParent) {
                        controllerParent.params.ANI = controllerParent.ANIListForSending;

                        //Send request to the server
                        controllerParent.$http.post(inspiniaNS.wsUrl + "message_send", $.param(controllerParent.params))
                        //Successful request to the server
                        .success(function(data, status, headers, config) {
                            if (data == null || typeof data.apicode == 'undefined') {
                                //This should never happen
                                controllerParent.$scope.$broadcast("ErrorOnMessages", 'Unidentified error occurred when sending your message!');
                                return;
                            }
                            if (data.apicode == 0) {
                                //Reset form and inform user about success
                                callback();
                                if (!broadcastOutside) {
                                    controllerParent.$scope.$broadcast("SendingMessageSucceeded", data.apidata);
                                }

                            } else {
                                controllerParent.$scope.$broadcast("ErrorOnMessages", 'An error occurred when sending your message! Error code: ' + data.apicode);
                            }
                        }).error(
                        //An error occurred with this request
                        function(data, status, headers, config) {
                            // if (status == 400) {
                            if (data.apicode == 1) {
                                controllerParent.$scope.$broadcast("ErrorOnMessages", 'ANI that you are trying to send message to is opted-out!');
                            } else {
                                //Just non handled errors by optout are counted
                                controllerParent.$scope.$broadcast("ErrorOnMessages", ngInbox._internal.ErrorMsg + ', ' + data.apitext);
                            }
                            // }
                        });
                    };
                    ngInbox._internal.Methods.GetANIorList(controllerParent, continueFunction);

                }
            },
            ResendMessage : function(controllerParent, messageList) {
                ngInbox._internal.ErrorMsg = 'Resending message(s) failed!';
                var callback = function() {
                    controllerParent.$scope.$broadcast("ResendMessageSucceeded");
                    controllerParent.$scope.getPagedDataAsync(controllerParent);
                    controllerParent.Events.ShowList(controllerParent);
                };
                if (!messageList) {
                    messageList = [controllerParent.clickedMessage];
                }
                ngInbox._internal.Methods.SendMessage(controllerParent, messageList, controllerParent.restoreMessageStatus, callback, true);
            },
            ResendMessages : function(controllerParent) {
                ngInbox._internal.Methods.ResendMessage(controllerParent, controllerParent.$scope.mySelections);
            },
            PostSuccess : function(controllerParent, result) {
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
            },
            ThreadNextPage_onClick : function(inParent) {
                inParent.ThreadPageOptions.currentPage++;
                ngInbox._internal.Methods.GetThread(inParent);
            },
            ThreadPreviousPage_onClick : function(inParent) {
                inParent.ThreadPageOptions.currentPage--;
                ngInbox._internal.Methods.GetThread(inParent);
            },
            ExportMessage : function(controllerParent, messageObject, exportSingle, callback) {
                ngInbox._internal.ErrorMsg = 'Exporting message(s) failed!';
                var message = '';
                if (!callback) {
                    var callback = function() {
                        controllerParent.$scope.$broadcast("ExportToTextMessageSucceeded");
                    };
                }

                if (!messageObject) {
                    message = controllerParent.clickedMessage.sourceANI + ': ' + controllerParent.clickedMessage.message;
                } else {
                    //console.log(messageObject);
                    message = messageObject.sourceANI + ': ' + messageObject.message;
                }

                var enter = '%0D%0A';

                if (!controllerParent.mesageTextToExport) {
                    controllerParent.mesageTextToExport = message;
                } else {
                    controllerParent.mesageTextToExport = controllerParent.mesageTextToExport + enter + enter + message;
                }

                if (exportSingle) {
                    ngInbox._internal.Methods.ExportToFile(controllerParent, callback);
                }
            },
            ExportMessages : function(controllerParent) {
                var callback = function() {
                    controllerParent.$scope.$broadcast("ExportToTextMessageSucceeded");
                };
                if (controllerParent.$scope.mySelections.length > 0) {
                    for (var i = 0; i < controllerParent.$scope.mySelections.length; i++) {
                        ngInbox._internal.Methods.ExportMessage(controllerParent, controllerParent.$scope.mySelections[i], false, callback);
                    }
                }
                ngInbox._internal.Methods.ExportToFile(controllerParent, callback);
            },
            ExportThread : function(controllerParent) {
                ngInbox._internal.ErrorMsg = 'Exporting thread failed!';
                if (!callback) {
                    var callback = function() {
                        controllerParent.$scope.$broadcast("ExportThreadToTextMessageSucceeded");
                    };
                }

                var moveToRightWithBlanks = '                                        ';
                var enter = '%0D%0A';

                continueFunction = function(controllerParent) {
                    controllerParent.mesageTextToExport = '';
                    for (var i = 0; i < controllerParent.clickedMessage.threadMessages.length; i++) {
                        // console.log(controllerParent.clickedMessage.threadMessages[i])
                        if (controllerParent.clickedMessage.threadMessages[i].messageType == 'Outbound') {
                            controllerParent.mesageTextToExport = controllerParent.mesageTextToExport + enter + enter + moveToRightWithBlanks + controllerParent.clickedMessage.threadMessages[i].DID + ':' + controllerParent.clickedMessage.threadMessages[i].message;
                        } else {
                            controllerParent.mesageTextToExport = controllerParent.mesageTextToExport + enter + enter + controllerParent.clickedMessage.threadMessages[i].ANI + ':' + controllerParent.clickedMessage.threadMessages[i].message;
                        }
                    }

                    ngInbox._internal.Methods.ExportToFile(controllerParent, callback);
                };

                ngInbox._internal.Methods.GetThread(controllerParent, true, continueFunction);
            },
            ExportToFile : function(controllerParent, callback) {
                var txtDiv_ = document.createElement('div');
                txtDiv_.setAttribute('id', 'itExportedMessagesText');
                txtDiv_.innerText = controllerParent.mesageTextToExport;
                document.getElementsByTagName("body")[0].appendChild(txtDiv_);

                var link = document.createElement('a');
                link.setAttribute('id', 'itExportedMessages');
                var mimeType = 'text/plain';

                link.setAttribute('download', 'ExportedMessages.txt');
                link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + txtDiv_.innerText);

                document.getElementsByTagName("body")[0].appendChild(link);

                link.click();
                controllerParent.mesageTextToExport = '';
                callback();

            }
        },
        Settings : {
            Settings : function(inParent) {
                inParent.Events.ShowSettings(inParent);
            },
            ColumnCanBeClicked_onChange : function(inParent, column, index) {
                if (column.canBeClicked) {
                    column.cellTemplate = 'views/table/MessageTableTemplate.html';
                } else {
                    column.cellTemplate = null;
                }
            },
            ColumnUp_onClick : function(inParent, column, index) {
                var temp = inParent.columnDefs[index];
                inParent.columnDefs[index] = inParent.columnDefs[index - 1];
                inParent.columnDefs[index - 1] = temp;
            },
            ColumnDown_onClick : function(inParent, column, index) {
                var temp = inParent.columnDefs[index];
                inParent.columnDefs[index] = inParent.columnDefs[index + 1];
                inParent.columnDefs[index + 1] = temp;
            },
            UpdateColumns : function(inParent) {
                ngInbox._internal.Settings.SetCookie(inParent);
                inParent.Events.ShowList(inParent);
                inParent.$scope.columnDefs = ngInbox._internal.Settings.GrepColumnDefs(inParent.columnDefs);
                inParent.$scope.getPagedDataAsync(inParent);
            },
            GrepColumnDefs : function(columnDefs) {
                var defs = $.grep(columnDefs, function(member) {
                    return (member.canBeClicked || (!member.canBeClicked && member.checked));
                });
                function clone(obj) {
                    if (null == obj || "object" != typeof obj)
                        return obj;
                    var copy = obj.constructor();
                    for (var attr in obj) {
                        if (obj.hasOwnProperty(attr))
                            copy[attr] = obj[attr];
                    }
                    return copy;
                }

                return clone(defs);
            },
            GetCookie : function(inParent) {
                var columnDefsCookie = inParent.$scope.main.ipCookie('itInboxColumnDefs');
                if (columnDefsCookie == null) {
                    columnDefsCookie = [];
                    inParent.$scope.main.ipCookie('itInboxColumnDefs', columnDefsCookie, {
                        expires : 365,
                        expirationUnit : 'days'
                    });
                }
                return columnDefsCookie;
            },
            SetCookie : function(inParent) {
                var columnDefsCookie = ngInbox._internal.Settings.GetCookie(inParent);
                if (columnDefsCookie == null) {
                    columnDefsCookie = [];
                } else {
                    columnDefsCookie = $.grep(columnDefsCookie, function(member) {
                        return member.Name != inParent.Name;
                    });
                }
                columnDefsCookie.push({
                    Name : inParent.Name,
                    columnDefs : inParent.columnDefs
                });
                inParent.$scope.main.ipCookie('itInboxColumnDefs', columnDefsCookie, {
                    expires : 365,
                    expirationUnit : 'days'
                });
            },
            DefaultCookie : function(inParent) {
                var columnDefsCookie = ngInbox._internal.Settings.GetCookie(inParent);
                if (columnDefsCookie == null) {
                    columnDefsCookie = [];
                } else {
                    columnDefsCookie = $.grep(columnDefsCookie, function(member) {
                        return member.Name != inParent.Name;
                    });
                }
                inParent.$scope.main.ipCookie('itInboxColumnDefs', columnDefsCookie, {
                    expires : 365,
                    expirationUnit : 'days'
                });
                location.reload();
            }
        },
        ngInboxNotifyCtrl : function($scope, notify) {
            $scope.DeleteMsg = function() {
                notify({
                    message : 'Your message(s) has been deleted!',
                    classes : 'alert-success'
                });
            };
            $scope.MarkAsReadMsg = function() {
                notify({
                    message : 'Your message(s) has been marked as read!',
                    classes : 'alert-success'
                });
            };
            $scope.MarkAsUnreadMsg = function() {
                notify({
                    message : 'Your message(s) has been marked as unread!',
                    classes : 'alert-success'
                });
            };
            $scope.RestoreToInboxMsg = function() {
                notify({
                    message : 'Your message(s) has been restored to inbox!',
                    classes : 'alert-success'
                });
            };
            $scope.ResendMsg = function() {
                notify({
                    message : 'Your message(s) has been resent!',
                    classes : 'alert-success'
                });
            };
            $scope.ExportToTextMsg = function() {
                notify({
                    message : 'Your message(s) has been exported to txt file!',
                    classes : 'alert-success'
                });
            };
            $scope.ExportThreadToTextMsg = function() {
                notify({
                    message : 'Your thread has been exported to txt file!',
                    classes : 'alert-success'
                });
            };
            $scope.ErrorOnMsg = function(errorText) {
                notify({
                    message : errorText,
                    classes : 'alert-danger',
                    templateUrl : 'views/common/notify.html'
                });
            };
            $scope.$on('DeleteMessageSucceeded', function(event, args) {
                if (!$scope.controllerParent.DontShowMessage) {
                    $scope.DeleteMsg();
                }
            });
            $scope.$on('MarkAsReadMessageSucceeded', function(event, args) {
                if (!$scope.controllerParent.DontShowMessage) {
                    $scope.MarkAsReadMsg();
                }
            });
            $scope.$on('MarkAsUnreadMessageSucceeded', function(event, args) {
                if (!$scope.controllerParent.DontShowMessage) {
                    $scope.MarkAsUnreadMsg();
                }
            });
            $scope.$on('RestoreToInboxMessageSucceeded', function(event, args) {
                if (!$scope.controllerParent.DontShowMessage) {
                    $scope.RestoreToInboxMsg();
                }
            });
            $scope.$on('ResendMessageSucceeded', function(event, args) {
                if (!$scope.controllerParent.DontShowMessage) {
                    $scope.ResendMsg();
                }
            });
            $scope.$on('ExportToTextMessageSucceeded', function(event, args) {
                if (!$scope.controllerParent.DontShowMessage) {
                    $scope.ExportToTextMsg();
                }
            });
            $scope.$on('ExportThreadToTextMessageSucceeded', function(event, args) {
                if (!$scope.controllerParent.DontShowMessage) {
                    $scope.ExportThreadToTextMsg();
                }
            });
            $scope.$on('ErrorOnMessages', function(event, args) {
                if (!$scope.controllerParent.DontShowMessage) {
                    $scope.ErrorOnMsg(args);
                }
            });
            $scope.$on('itMessage', function(event, args) {
                notify({
                    message : args.message,
                    classes : 'alert-success'
                });
            });
            $scope.$on('itError', function(event, args) {
                notify({
                    message : args.message,
                    classes : 'alert-danger',
                    templateUrl : 'views/common/notify.html'
                });
            });
        }
    },
    InboxList : {
        Name : 'Inbox',
        getListAction : 'messages_inbound',
        getListStatus : 'U',
        statusChangeAction : 'message_changeinboundstatus',
        deleteMessageStatus : 'D',
        markAsReadMessageStatus : 'R',
        markAsUnreadMessageStatus : 'U',
        primaryKey : 'inboundMessageID',
        columnDefs : [{
            checked : true,
            canBeClicked : true,
            field : 'sourceANI',
            displayName : 'Contact',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            checked : true,
            canBeClicked : true,
            field : 'message',
            displayName : 'Message',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            checked : true,
            canBeClicked : false,
            field : 'createdDate',
            displayName : 'Date/Time'
        }, {
            checked : true,
            canBeClicked : false,
            field : 'ContactLists',
            displayName : 'List'
        }],
        sortOptions : {
            fields : ['createdDate'],
            directions : ['DESC'],
            useExternalSorting : true
        },
        defaultSortField : 'createdDate',
        errorMessage : 'Unexpected error occurred when trying to fetch inbox messages list!',
        hashUrlviewMessage : 'messages.view_inbox',
        $scope : null,
        $http : null,
        $cookieStore : null,
        clickedMessage : null,
        list : true,
        view : false,
        add : false,
        settings : false,
        thread : false,
        radioModel : '',
        Events : {
            Settings_onClick : function(inParent) {
                ngInbox._internal.Settings.Settings(inParent);
            },
            ColumnCanBeClicked_onChange : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnCanBeClicked_onChange(inParent, column, index);
            },
            ColumnUp_onClick : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnUp_onClick(inParent, column, index);
            },
            ColumnDown_onClick : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnDown_onClick(inParent, column, index);
            },
            ThreadNextPage_onClick : function(inParent) {
                ngInbox._internal.Methods.ThreadNextPage_onClick(inParent);
            },
            ThreadPreviousPage_onClick : function(inParent) {
                ngInbox._internal.Methods.ThreadPreviousPage_onClick(inParent);
            },
            UpdateColumns : function(inParent) {
                ngInbox._internal.Settings.UpdateColumns(inParent);
            },
            DefaultColumns : function(inParent) {
                ngInbox._internal.Settings.DefaultCookie(inParent);
            },
            Message_onClick : function(inParent, row) {
                inParent.clickedMessage = row.entity;
                inParent.Events.ShowView(inParent);
                ngInbox._internal.Methods.GetThread(inParent);
            },
            Add_onClick : function(inScope) {
                inScope.controllerParent.Events.ShowView(inScope.controllerParent);
            },
            Send_onClick : function(inScope) {
                // delete clicked message
                inScope.controllerParent.Events.ShowList(inScope.controllerParent);
                inScope.controllerParent.radioModel = '';
            },
            ShowList : function(inParent) {
                inParent.list = true;
                inParent.view = false;
                inParent.add = false;
                inParent.settings = false;
                inParent.thread = false;
            },
            ShowView : function(inParent) {
                inParent.list = false;
                inParent.view = true;
                inParent.add = false;
                inParent.settings = false;
                inParent.thread = false;
            },
            ShowAdd : function(inParent) {
                inParent.list = false;
                inParent.view = false;
                inParent.add = true;
                inParent.settings = false;
                inParent.thread = false;
            },
            ShowSettings : function(inParent) {
                inParent.list = false;
                inParent.view = false;
                inParent.add = false;
                inParent.settings = true;
                inParent.thread = false;
            },
            ShowThread : function(inParent) {
                inParent.list = false;
                inParent.view = false;
                inParent.add = false;
                inParent.settings = false;
                inParent.thread = true;
            },
            InitialiseEvents : function(inParent) {
                inParent.$scope.$watch('controllerParent.getListStatus', function() {
                    inParent.$scope.getPagedDataAsync(inParent);
                }, true);
            }
        },
        Controller : function($scope, $http, $cookieStore) {
            //Controler parrent setting !!!!
            var controllerParent = ngInbox.InboxList;
            controllerParent.Events.ShowList(controllerParent);

            controllerParent.$scope = $scope;
            controllerParent.$http = $http;
            controllerParent.$cookieStore = $cookieStore;

            controllerParent.ThreadPageOptions = new ngInbox._internal.DataConstructors.ThreadPageOptions(controllerParent.$scope.main.Settings);
            ngInbox._internal.Methods.PopulateScope(controllerParent);
            controllerParent.Events.InitialiseEvents(controllerParent);
        },
        PopulateAdd : function($addScope) {
            try {
                $addScope.UploadType = 'single';
                $addScope.PhoneNumber = $addScope.controllerParent.clickedMessage.sourceANI;
            } catch(e) {
                //TODO skloniti ovaj try-catch kada se odradi inicijalna clickedMessage
            }
        },
        PopulateSend : function($sendScope) {
            try {
                $sendScope.FromNumber = $.grep($sendScope.fromNumbers, function(member) {
                return member.DID == $sendScope.controllerParent.clickedMessage.DID;
                })[0];
            } catch(e) {
                //TODO skloniti ovaj try-catch kada se odradi inicijalna clickedMessage
            }

        },
        PostSuccess : function(controllerParent, result) {
            var messages = result.apidata;
            controllerParent.$scope.setPagingDataSliced(controllerParent.$scope, messages, result.apicount);
        }
    },
    SentList : {
        Name : 'Sent',
        getListAction : 'messages_outbound',
        getListStatus : 'C',
        // statusChangeAction : 'message_changeoutboundstatus',
        deleteMessagesChangeAction : 'message_deleteoutbound',
        primaryKey : 'outboundMessageID',
        columnDefs : [{
            checked : true,
            canBeClicked : true,
            field : 'con_lis',
            displayName : 'Contact/List',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            checked : true,
            canBeClicked : true,
            field : 'message',
            displayName : 'Message',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            checked : true,
            canBeClicked : false,
            field : 'sendEndDate',
            displayName : 'Date sent'
        }, {
            checked : true,
            canBeClicked : false,
            field : 'DID',
            displayName : 'From'
        }],
        sortOptions : {
            fields : ['sendEndDate'],
            directions : ['DESC'],
            useExternalSorting : true
        },
        defaultSortField : 'sendEndDate',
        errorMessage : 'Unexpected error occurred when trying to fetch sent messages list!',
        hashUrlviewMessage : 'messages.view_sent',
        $scope : null,
        $http : null,
        $cookieStore : null,
        clickedMessage : null,
        list : true,
        view : false,
        settings : false,
        thread : false,
        radioModel : '',
        Events : {
            Settings_onClick : function(inParent) {
                ngInbox._internal.Settings.Settings(inParent);
            },
            ColumnCanBeClicked_onChange : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnCanBeClicked_onChange(inParent, column, index);
            },
            ColumnUp_onClick : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnUp_onClick(inParent, column, index);
            },
            ColumnDown_onClick : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnDown_onClick(inParent, column, index);
            },
            ThreadNextPage_onClick : function(inParent) {
                ngInbox._internal.Methods.ThreadNextPage_onClick(inParent);
            },
            ThreadPreviousPage_onClick : function(inParent) {
                ngInbox._internal.Methods.ThreadPreviousPage_onClick(inParent);
            },
            UpdateColumns : function(inParent) {
                ngInbox._internal.Settings.UpdateColumns(inParent);
            },
            DefaultColumns : function(inParent) {
                ngInbox._internal.Settings.DefaultCookie(inParent);
            },
            Message_onClick : function(inParent, row) {
                inParent.clickedMessage = row.entity;
                inParent.Events.ShowView(inParent);
                ngInbox._internal.Methods.GetThread(inParent);
            },
            Send_onClick : function(inScope) {
                // delete clicked message
                inScope.controllerParent.Events.ShowList(inScope.controllerParent);
                inScope.controllerParent.radioModel = '';
            },
            ShowList : function(inParent) {
                inParent.list = true;
                inParent.view = false;
                inParent.settings = false;
                inParent.thread = false;
            },
            ShowView : function(inParent) {
                inParent.list = false;
                inParent.view = true;
                inParent.settings = false;
                inParent.thread = false;
            },
            ShowSettings : function(inParent) {
                inParent.list = false;
                inParent.view = false;
                inParent.settings = true;
                inParent.thread = false;
            },
            ShowThread : function(inParent) {
                inParent.list = false;
                inParent.view = false;
                inParent.settings = false;
                inParent.thread = true;
            },
            InitialiseEvents : function(controllerParent) {
            }
        },
        Controller : function($scope, $http, $cookieStore) {
            //Controler parrent setting !!!!
            var controllerParent = ngInbox.SentList;
            controllerParent.Events.ShowList(controllerParent);

            controllerParent.$scope = $scope;
            controllerParent.$http = $http;
            controllerParent.$cookieStore = $cookieStore;
            controllerParent.$scope.fromNumbers = $scope.main.fromNumbers;

            controllerParent.ThreadPageOptions = new ngInbox._internal.DataConstructors.ThreadPageOptions(controllerParent.$scope.main.Settings);
            ngInbox._internal.Methods.PopulateScope(controllerParent);
            controllerParent.Events.InitialiseEvents(controllerParent);
        },
        PopulateSend : function($sendScope) {
            try {
                continueFunction = function() {
                    $sendScope.FromName = $sendScope.initial;
                    $sendScope.MessageType = 'SMS';

                    $sendScope.ToNumber = $sendScope.controllerParent.ANIList;
                    $sendScope.controllerParent.clickedMessage.con_lis = $sendScope.controllerParent.ANIList;
                    $sendScope.FromNumber = $.grep($sendScope.fromNumbers, function(member) {
                    return member.DID == $sendScope.controllerParent.clickedMessage.DID;
                    })[0];
                    $sendScope.ToList = $.grep($sendScope.contactLists, function(member) {
                    return member.contactListID == $sendScope.controllerParent.clickedMessage.contactListID;
                    })[0];

                    $sendScope.OptOutMsg = '';
                    $sendScope.OptOutTxt3 = $sendScope.initial;
                    $sendScope.MessageTxt = $sendScope.controllerParent.clickedMessage.message;
                    $sendScope.ScheduleCheck = false;
                    $sendScope.ArrayScheduledDateTime = [];
                    var scheduledDateTime = new $sendScope.main.DataConstructors.ScheduledDateTime();
                    scheduledDateTime.SetDate = new Date($sendScope.controllerParent.clickedMessage.scheduledDate.substring(0, 10));
                    scheduledDateTime.SetTimeHour = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(11, 13);
                    scheduledDateTime.SetTimeMinute = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(14, 16);
                    $sendScope.ArrayScheduledDateTime.push(scheduledDateTime);
                };

                ngInbox._internal.Methods.GetANIorList($sendScope.controllerParent, continueFunction);
            } catch(e) {
                //TODO skloniti ovaj try-catch kada se odradi inicijalna clickedMessage
            }
        },
        PostSuccess : function(controllerParent, result) {
            ngInbox._internal.Methods.PostSuccess(controllerParent, result);
        }
    },
    ScheduledList : {
        Name : 'Scheduled',
        getListAction : 'messages_outbound',
        getListStatus : 'S',
        statusChangeAction : null, //'message_changeoutboundstatus',
        deleteMessagesChangeAction : 'message_deleteoutbound',
        primaryKey : 'outboundMessageID',
        columnDefs : [{
            checked : true,
            canBeClicked : true,
            field : 'con_lis',
            displayName : 'Contact/List',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            checked : true,
            canBeClicked : true,
            field : 'message',
            displayName : 'Message',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            checked : true,
            canBeClicked : false,
            field : 'createdDate',
            displayName : 'Date created'
        }, {
            checked : true,
            canBeClicked : false,
            field : 'scheduledDate',
            displayName : 'Date scheduled'
        }, {
            button : 'Edit',
            checked : true,
            canBeClicked : false,
            cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()"><a class="btn" ng-click="controllerParent.Events.Message_onClick(controllerParent,row)"><i class="fa fa-pencil"></i> Edit </a></div>'
        }],
        sortOptions : {
            fields : ['createdDate'],
            directions : ['DESC'],
            useExternalSorting : true
        },
        defaultSortField : 'scheduledDate',
        errorMessage : 'Unexpected error occurred when trying to fetch scheduled messages list!',
        hashUrlviewMessage : 'messages.view_scheduled',
        $scope : null,
        $http : null,
        $cookieStore : null,
        clickedMessage : null,
        list : true,
        view : false,
        send : false,
        settings : false,
        Events : {
            Settings_onClick : function(inParent) {
                ngInbox._internal.Settings.Settings(inParent);
            },
            ColumnCanBeClicked_onChange : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnCanBeClicked_onChange(inParent, column, index);
            },
            ColumnUp_onClick : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnUp_onClick(inParent, column, index);
            },
            ColumnDown_onClick : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnDown_onClick(inParent, column, index);
            },
            UpdateColumns : function(inParent) {
                ngInbox._internal.Settings.UpdateColumns(inParent);
            },
            Message_onClick : function(inParent, row) {
                inParent.clickedMessage = row.entity;
                inParent.Events.ShowView(inParent);
            },
            Send_onClick : function(inScope) {
                // delete clicked message
                inScope.controllerParent.Events.ShowList(inScope.controllerParent);
            },
            ShowList : function(inParent) {
                inParent.list = true;
                inParent.view = false;
                inParent.send = false;
                inParent.settings = false;
            },
            ShowView : function(inParent) {
                inParent.list = false;
                inParent.view = true;
                inParent.send = false;
                inParent.settings = false;
            },
            ShowSend : function(inParent) {
                inParent.list = false;
                inParent.view = false;
                inParent.send = true;
                inParent.settings = false;
            },
            ShowSettings : function(inParent) {
                inParent.list = false;
                inParent.view = false;
                inParent.send = false;
                inParent.settings = true;
            },
            InitialiseEvents : function(controllerParent) {
            }
        },
        Controller : function($scope, $http, $cookieStore) {
            //Controler parrent setting !!!!
            var controllerParent = ngInbox.ScheduledList;
            controllerParent.Events.ShowList(controllerParent);

            controllerParent.$scope = $scope;
            controllerParent.$http = $http;
            controllerParent.$cookieStore = $cookieStore;

            ngInbox._internal.Methods.PopulateScope(controllerParent);
            controllerParent.Events.InitialiseEvents(controllerParent);
        },
        PopulateSend : function($sendScope) {
            try {
                $sendScope.FromName = $sendScope.initial;
                $sendScope.MessageType = 'SMS';

                continueFunction = function() {
                    $sendScope.FromNumber = $.grep($sendScope.fromNumbers, function(member) {
                    return member.DID == $sendScope.controllerParent.clickedMessage.DID;
                    })[0];

                    $sendScope.FromName = $sendScope.FromNumber.fromName;

                    if ($sendScope.controllerParent.ANIList) {
                        $sendScope.SendToList = false;
                        $sendScope.ToNumber = $sendScope.controllerParent.ANIList;
                        $sendScope.controllerParent.clickedMessage.con_lis = $sendScope.controllerParent.ANIList;
                    } else {
                        $sendScope.SendToList = true;
                        $sendScope.ToList = $.grep($sendScope.contactLists, function(member) {
                        return member.contactListID == $sendScope.controllerParent.clickedMessage.contactListID;
                        })[0];
                        $sendScope.controllerParent.clickedMessage.con_lis = $sendScope.controllerParent.clickedMessage.contactListName;
                    }

                    $sendScope.OptOutMsg = '';
                    $sendScope.OptOutTxt3 = $sendScope.initial;
                    $sendScope.MessageTxt = $sendScope.controllerParent.clickedMessage.message;
                    $sendScope.ScheduleCheck = true;

                    $sendScope.RecurringTypes = [{
                        value : '',
                        label : "No"
                    }, {
                        value : 'D',
                        label : 'Every day'
                    }, {
                        value : 'W',
                        label : 'Every week'
                    }, {
                        value : 'M',
                        label : 'Every month'
                    }];

                    // console.log('GetLocalDateTimeString: ' + ngInbox._internal.Methods.GetLocalDateTimeString($sendScope.controllerParent.clickedMessage.scheduledDate + ' UTC'))
                    var scheduledDateTime = new $sendScope.main.DataConstructors.ScheduledDateTime();
                    // GetLocalDateTimeString
                    // console.log($sendScope.controllerParent.clickedMessage.scheduledDate.substring(0, 10))

                    scheduledDateTime.SetDate = new Date(ngInbox._internal.Methods.ConvertDateToYYYYmmDD($sendScope.controllerParent.clickedMessage.scheduledDate.substring(0, 10), 'YYYY-DD-mm'));
                    scheduledDateTime.SetTimeHour = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(11, 13);
                    scheduledDateTime.SetTimeMinute = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(14, 16);
                    scheduledDateTime.SetRecurringType = $sendScope.controllerParent.clickedMessage.recurringtype;
                    if ($sendScope.controllerParent.clickedMessage.recurringend != null) {
                        scheduledDateTime.SetRecurringEndDate = new Date($sendScope.controllerParent.clickedMessage.recurringend.substring(0, 10));
                    } else {
                        scheduledDateTime.SetRecurringEndDate = new Date();
                    }

                    $sendScope.ArrayScheduledDateTime = [];
                    $sendScope.ArrayScheduledDateTime.push(scheduledDateTime);
                };

                ngInbox._internal.Methods.GetANIorList($sendScope.controllerParent, continueFunction);
            } catch(e) {
                //TODO skloniti ovaj try-catch kada se odradi inicijalna clickedMessage
                console.log(e);
            }

        },
        PostSuccess : function(controllerParent, result) {
            ngInbox._internal.Methods.PostSuccess(controllerParent, result);
        }
    },
    RecurringList : {
        Name : 'Recurring',
        getListAction : 'messages_outbound',
        getListStatus : 'T',
        statusChangeAction : null, //'message_changeoutboundstatus',
        deleteMessagesChangeAction : 'message_deleteoutbound',
        primaryKey : 'outboundMessageID',
        columnDefs : [{
            checked : true,
            canBeClicked : true,
            field : 'con_lis',
            displayName : 'Contact/List',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            checked : true,
            canBeClicked : true,
            field : 'message',
            displayName : 'Message',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            checked : true,
            canBeClicked : false,
            field : 'createdDate',
            displayName : 'Date created'
        }, {
            checked : true,
            canBeClicked : false,
            field : 'scheduledDate',
            displayName : 'Date scheduled'
        }, {
            checked : true,
            canBeClicked : false,
            field : 'recurringtype',
            displayName : 'Repeat',
            cellTemplate : 'views/table/RecurringType.html'
        }, {
            checked : true,
            canBeClicked : false,
            field : 'recurringend',
            displayName : 'Until'
        }, {
            button : 'Edit',
            checked : true,
            canBeClicked : false,
            cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()"><a class="btn" ng-click="controllerParent.Events.Message_onClick(controllerParent,row)"><i class="fa fa-pencil"></i> Edit </a></div>'
        }],
        sortOptions : {
            fields : ['createdDate'],
            directions : ['DESC'],
            useExternalSorting : true
        },
        defaultSortField : 'scheduledDate',
        errorMessage : 'Unexpected error occurred when trying to fetch recurring messages list!',
        hashUrlviewMessage : 'messages.view_recurring',
        $scope : null,
        $http : null,
        $cookieStore : null,
        clickedMessage : null,
        list : true,
        view : false,
        send : false,
        settings : false,
        Events : {
            Settings_onClick : function(inParent) {
                ngInbox._internal.Settings.Settings(inParent);
            },
            ColumnCanBeClicked_onChange : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnCanBeClicked_onChange(inParent, column, index);
            },
            ColumnUp_onClick : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnUp_onClick(inParent, column, index);
            },
            ColumnDown_onClick : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnDown_onClick(inParent, column, index);
            },
            UpdateColumns : function(inParent) {
                ngInbox._internal.Settings.UpdateColumns(inParent);
            },
            Message_onClick : function(inParent, row) {
                inParent.clickedMessage = row.entity;
                inParent.Events.ShowView(inParent);
            },
            Send_onClick : function(inScope) {
                // delete clicked message
                inScope.controllerParent.Events.ShowList(inScope.controllerParent);
            },
            ShowList : function(inParent) {
                inParent.list = true;
                inParent.view = false;
                inParent.send = false;
                inParent.settings = false;
            },
            ShowView : function(inParent) {
                inParent.list = false;
                inParent.view = true;
                inParent.send = false;
                inParent.settings = false;
            },
            ShowSend : function(inParent) {
                inParent.list = false;
                inParent.view = false;
                inParent.send = true;
                inParent.settings = false;
            },
            ShowSettings : function(inParent) {
                inParent.list = false;
                inParent.view = false;
                inParent.send = false;
                inParent.settings = true;
            },
            InitialiseEvents : function(controllerParent) {
            }
        },
        Controller : function($scope, $http, $cookieStore) {
            //Controler parrent setting !!!!
            var controllerParent = ngInbox.RecurringList;
            controllerParent.Events.ShowList(controllerParent);

            controllerParent.$scope = $scope;
            controllerParent.$http = $http;
            controllerParent.$cookieStore = $cookieStore;

            ngInbox._internal.Methods.PopulateScope(controllerParent);
            controllerParent.Events.InitialiseEvents(controllerParent);

            controllerParent.$scope.RecurringTypeLabels = {
                D : 'Every day',
                W : 'Every week',
                M : 'Every month'
            };
        },
        PopulateSend : function($sendScope) {
            try {
                $sendScope.FromName = $sendScope.initial;
                $sendScope.MessageType = 'SMS';

                continueFunction = function() {
                    $sendScope.FromNumber = $.grep($sendScope.fromNumbers, function(member) {
                    return member.DID == $sendScope.controllerParent.clickedMessage.DID;
                    })[0];

                    $sendScope.FromName = $sendScope.FromNumber.fromName;

                    if ($sendScope.controllerParent.ANIList) {
                        $sendScope.SendToList = false;
                        $sendScope.ToNumber = $sendScope.controllerParent.ANIList;
                        $sendScope.controllerParent.clickedMessage.con_lis = $sendScope.controllerParent.ANIList;
                    } else {
                        $sendScope.SendToList = true;
                        $sendScope.ToList = $.grep($sendScope.contactLists, function(member) {
                        return member.contactListID == $sendScope.controllerParent.clickedMessage.contactListID;
                        })[0];
                        $sendScope.controllerParent.clickedMessage.con_lis = $sendScope.controllerParent.clickedMessage.contactListName;
                    }

                    $sendScope.OptOutMsg = '';
                    $sendScope.OptOutTxt3 = $sendScope.initial;
                    $sendScope.MessageTxt = $sendScope.controllerParent.clickedMessage.message;
                    $sendScope.ScheduleCheck = true;

                    $sendScope.RecurringTypes = [{
                        value : '',
                        label : "No"
                    }, {
                        value : 'D',
                        label : 'Every day'
                    }, {
                        value : 'W',
                        label : 'Every week'
                    }, {
                        value : 'M',
                        label : 'Every month'
                    }];

                    var scheduledDateTime = new $sendScope.main.DataConstructors.ScheduledDateTime();
                    scheduledDateTime.SetDate = new Date($sendScope.controllerParent.clickedMessage.scheduledDate.substring(0, 10));
                    scheduledDateTime.SetTimeHour = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(11, 13);
                    scheduledDateTime.SetTimeMinute = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(14, 16);
                    scheduledDateTime.SetRecurringType = $sendScope.controllerParent.clickedMessage.recurringtype;
                    if ($sendScope.controllerParent.clickedMessage.recurringend != null) {
                        scheduledDateTime.SetRecurringEndDate = new Date($sendScope.controllerParent.clickedMessage.recurringend.substring(0, 10));
                    } else {
                        scheduledDateTime.SetRecurringEndDate = new Date();
                    }

                    $sendScope.ArrayScheduledDateTime = [];
                    $sendScope.ArrayScheduledDateTime.push(scheduledDateTime);
                };

                ngInbox._internal.Methods.GetANIorList($sendScope.controllerParent, continueFunction);
            } catch(e) {
                //TODO skloniti ovaj try-catch kada se odradi inicijalna clickedMessage
                console.log(e);
            }

        },
        PostSuccess : function(controllerParent, result) {
            ngInbox._internal.Methods.PostSuccess(controllerParent, result);
        }
    },
    DraftsList : {
        Name : 'Drafts',
        getListAction : 'messages_outbound',
        getListStatus : 'D',
        statusChangeAction : null, //'message_changeoutboundstatus',
        deleteMessagesChangeAction : 'draft_delete',
        primaryKey : 'outboundMessageID',
        columnDefs : [{
            checked : true,
            canBeClicked : true,
            field : 'message',
            displayName : 'Message',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            checked : true,
            canBeClicked : false,
            field : 'statusDate',
            displayName : 'Date & Time Saved'
        }],
        sortOptions : {
            fields : ['statusDate'],
            directions : ['DESC'],
            useExternalSorting : true
        },
        defaultSortField : 'statusDate',
        errorMessage : 'Unexpected error occurred when trying to fetch draft messages list!',
        hashUrlviewMessage : 'messages.view_drafts',
        $scope : null,
        $http : null,
        $cookieStore : null,
        clickedMessage : null,
        list : true,
        view : false,
        send : false,
        settings : false,
        Events : {
            Settings_onClick : function(inParent) {
                ngInbox._internal.Settings.Settings(inParent);
            },
            ColumnCanBeClicked_onChange : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnCanBeClicked_onChange(inParent, column, index);
            },
            ColumnUp_onClick : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnUp_onClick(inParent, column, index);
            },
            ColumnDown_onClick : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnDown_onClick(inParent, column, index);
            },
            UpdateColumns : function(inParent) {
                ngInbox._internal.Settings.UpdateColumns(inParent);
            },
            Message_onClick : function(inParent, row) {
                inParent.clickedMessage = row.entity;
                inParent.Events.ShowView(inParent);
            },
            Send_onClick : function(inScope) {
                // delete clicked message
                inScope.controllerParent.Events.ShowList(inScope.controllerParent);
            },
            ShowList : function(inParent) {
                inParent.list = true;
                inParent.view = false;
                inParent.send = false;
                inParent.settings = false;
            },
            ShowView : function(inParent) {
                inParent.list = false;
                inParent.view = true;
                inParent.send = false;
                inParent.settings = false;
            },
            ShowSend : function(inParent) {
                inParent.list = false;
                inParent.view = false;
                inParent.send = true;
                inParent.settings = false;
            },
            ShowSettings : function(inParent) {
                inParent.list = false;
                inParent.view = false;
                inParent.send = false;
                inParent.settings = true;
            },
            InitialiseEvents : function(controllerParent) {
            }
        },
        Controller : function($scope, $http, $cookieStore) {
            //Controler parrent setting !!!!
            var controllerParent = ngInbox.DraftsList;
            controllerParent.Events.ShowList(controllerParent);

            controllerParent.$scope = $scope;
            controllerParent.$http = $http;
            controllerParent.$cookieStore = $cookieStore;

            ngInbox._internal.Methods.PopulateScope(controllerParent);
            controllerParent.Events.InitialiseEvents(controllerParent);
        },
        PopulateSend : function($sendScope) {
            try {
                $sendScope.FromName = $sendScope.initial;
                $sendScope.MessageType = 'SMS';
                $sendScope.FromNumber = $.grep($sendScope.fromNumbers, function(member) {
                return member.DID == $sendScope.controllerParent.clickedMessage.DID;
                })[0];
                $sendScope.ToList = $.grep($sendScope.contactLists, function(member) {
                return member.contactListID == $sendScope.controllerParent.clickedMessage.contactListID;
                })[0];
                $sendScope.MessageTxt = $sendScope.controllerParent.clickedMessage.message;
                continueFunction = function() {
                    $sendScope.ToNumber = $sendScope.controllerParent.ANIList;
                    $sendScope.controllerParent.clickedMessage.con_lis = $sendScope.ToNumber;
                    $sendScope.OptOutMsg = '';
                    $sendScope.OptOutTxt3 = $sendScope.initial;
                    $sendScope.ScheduleCheck = false;

                    var scheduledDateTime = new $sendScope.main.DataConstructors.ScheduledDateTime();
                    scheduledDateTime.SetDate = new Date($sendScope.controllerParent.clickedMessage.scheduledDate.substring(0, 10));
                    scheduledDateTime.SetTimeHour = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(11, 13);
                    scheduledDateTime.SetTimeMinute = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(14, 16);
                    $sendScope.ArrayScheduledDateTime.push(scheduledDateTime);
                };
                ngInbox._internal.Methods.GetANIorList($sendScope.controllerParent, continueFunction);
            } catch(e) {
                //TODO skloniti ovaj try-catch kada se odradi inicijalna clickedMessage
            }

        },
        PostSuccess : function(controllerParent, result) {
            ngInbox._internal.Methods.PostSuccess(controllerParent, result);
        }
    },
    TrashList : {
        Name : 'Trash',
        getListAction : 'messages_inbound',
        getListStatus : 'D',
        // getListAction : 'messages_outbound',
        // getListStatus : 'X',
        statusChangeAction : 'message_changeinboundstatus',
        deleteMessageStatus : null,
        restoreMessageStatus : 'U',
        primaryKey : 'inboundMessageID',
        columnDefs : [{
            checked : true,
            canBeClicked : true,
            field : 'sourceANI',
            displayName : 'Contact',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            checked : true,
            canBeClicked : true,
            field : 'message',
            displayName : 'Message',
            cellTemplate : 'views/table/MessageTableTemplate.html'
        }, {
            checked : true,
            canBeClicked : false,
            field : 'statusDate',
            displayName : 'Date & Time Deleted'
        }],
        sortOptions : {
            fields : ['statusDate'],
            directions : ['DESC'],
            useExternalSorting : true
        },
        defaultSortField : 'statusDate',
        errorMessage : 'Unexpected error occurred when trying to fetch trash messages list!',
        hashUrlviewMessage : 'messages.view_trash',
        $scope : null,
        $http : null,
        $cookieStore : null,
        clickedMessage : null,
        list : true,
        view : false,
        settings : false,
        Events : {
            Settings_onClick : function(inParent) {
                ngInbox._internal.Settings.Settings(inParent);
            },
            ColumnCanBeClicked_onChange : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnCanBeClicked_onChange(inParent, column, index);
            },
            ColumnUp_onClick : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnUp_onClick(inParent, column, index);
            },
            ColumnDown_onClick : function(inParent, column, index) {
                ngInbox._internal.Settings.ColumnDown_onClick(inParent, column, index);
            },
            UpdateColumns : function(inParent) {
                ngInbox._internal.Settings.UpdateColumns(inParent);
            },
            Message_onClick : function(inParent, row) {
                inParent.clickedMessage = row.entity;
                inParent.Events.ShowView(inParent);
            },
            Send_onClick : function(inScope) {
                // delete clicked message
                inScope.controllerParent.Events.ShowList(inScope.controllerParent);
            },
            ShowList : function(inParent) {
                inParent.list = true;
                inParent.view = false;
                inParent.settings = false;
            },
            ShowView : function(inParent) {
                inParent.list = false;
                inParent.view = true;
                inParent.settings = false;
            },
            ShowSettings : function(inParent) {
                inParent.list = false;
                inParent.view = false;
                inParent.settings = true;
            },
            InitialiseEvents : function(inParent) {
                inParent.$scope.$watch('controllerParent.getListStatus', function() {
                    inParent.$scope.getPagedDataAsync(inParent);
                }, true);
            }
        },
        Controller : function($scope, $http, $cookieStore) {
            //Controler parrent setting !!!!
            var controllerParent = ngInbox.TrashList;
            controllerParent.Events.ShowList(controllerParent);

            controllerParent.$scope = $scope;
            controllerParent.$http = $http;
            controllerParent.$cookieStore = $cookieStore;

            ngInbox._internal.Methods.PopulateScope(controllerParent);
            controllerParent.Events.InitialiseEvents(controllerParent);

        },
        PostSuccess : function(controllerParent, result) {
            ngInbox._internal.Methods.PostSuccess(controllerParent, result);
        }
    }
};

var ngSettings = {
    Settings : {
        ServerRequests : {

        },
        Events : {
            Save_onClick : function(cpo) {
                cpo.$scope.main.ipCookie('itSettings', cpo.$scope.main.Settings, {
                    expires : 365,
                    expirationUnit : 'days'
                });
                var addNew = typeof cpo.$scope.main.Settings.defaultOptOutTextId == 'undefined' || cpo.$scope.main.Settings.defaultOptOutTextId == null || cpo.$scope.main.Settings.defaultOptOutTextId == '';
                var request = {
                    sethttp : 1,
                    apikey : cpo.$scope.main.authToken,
                    accountID : cpo.$scope.main.accountID,
                    companyID : cpo.$scope.main.accountInfo.companyID,
                    optOutSignatureText : cpo.$scope.main.Settings.defaultOptOutText
                };
                if (!addNew) {
                    request.optOutSignatureID = cpo.$scope.main.Settings.defaultOptOutTextId;
                }
                cpo.$http.post(inspiniaNS.wsUrl + ( addNew ? "optoutsignature_add" : "optoutsignature_modify"), $.param(request))
                //Successful request to the server
                .success(function(data, status, headers, config) {
                    if (data == null || typeof data.apicode == 'undefined') {
                        //This should never happen
                        alert("Unidentified error occurred when getting account info!");
                        return;
                    }
                    if (data.apicode == 0) {
                        cpo.$scope.main.Settings.defaultOptOutTextId = data.apidata;
                        cpo.$scope.$broadcast('itMessage', {
                            message : 'Basic Settings saved'
                        });
                    } else {
                        cpo.$scope.$broadcast('itMessage', {
                            message : 'Failed to save Basic Settings! Error code: ' + data.apicode,
                            classes : "alert-danger"
                        });
                    }
                })
                //An error occurred with this request
                .error(function(data, status, headers, config) {
                    if (status != 401) {
                        cpo.$scope.$broadcast('itMessage', {
                            message : 'Failed to save Basic Settings! Error description: ' + data.apitext,
                            classes : "alert-danger"
                        });
                    }
                });
            }
        },
        Controller : function($scope, $http, $cookieStore) {
            var cpo = ngSettings.Settings;
            cpo.$scope = $scope;
            cpo.$http = $http;
            cpo.$cookieStore = $cookieStore;
            cpo.$scope.cpo = cpo;
        }
    },
    NumberNames : {
        ServerRequests : {
            GetNumbers : function(cpo, success, error) {
                var params = {
                    apikey : cpo.$scope.main.authToken,
                    accountID : cpo.$scope.main.accountID,
                    companyID : cpo.$scope.main.accountInfo.companyID,
                    sethttp : 1
                };
                var $param = $.param(params);

                cpo.$http.post(inspiniaNS.wsUrl + "did_get", $param).success(function(data) {
                    if (data.apicode == 0) {
                        if ( typeof success == 'function') {
                            success(data);
                        }
                    } else {
                        if ( typeof error == 'function') {
                            error(data);
                        }
                    }
                }).error(function(data, status, headers, config) {
                    if ( typeof error == 'function') {
                        error(data);
                    }
                });
            },
            ModifyNumbers : function(cpo, didid, from_name, success, error) {
                var params = {
                    apikey : cpo.$scope.main.authToken,
                    accountID : cpo.$scope.main.accountID,
                    companyID : cpo.$scope.main.accountInfo.companyID,
                    DIDID : didid,
                    fromName : from_name,
                    sethttp : 1
                };
                var $param = $.param(params);

                cpo.$http.post(inspiniaNS.wsUrl + "did_modify", $param).success(function(data) {
                    if (data.apicode == 0) {
                        if ( typeof success == 'function') {
                            success(data);
                        }
                    } else {
                        if ( typeof error == 'function') {
                            error(data);
                        }
                    }
                }).error(function(data, status, headers, config) {
                    if ( typeof error == 'function') {
                        error(data);
                    }
                });
            }
        },
        Events : {
            DefaultNumber_onChange : function(cpo, Number) {
                if (Number.prefered) {
                    for (var N in cpo.numCtrl.numbers) {
                        if (cpo.numCtrl.numbers[N].DID != Number.DID) {
                            cpo.numCtrl.numbers[N].prefered = false;
                        }
                    }
                }
            },
            Save_onClick : function(cpo) {
                for (var j in cpo.numCtrl.numbers) {
                    if (cpo.numCtrl.numbers[j].fromName && cpo.numCtrl.numbers[j].fromName != '') {
                        ngSettings.NumberNames.ServerRequests.ModifyNumbers(cpo, cpo.numCtrl.numbers[j].DIDID, cpo.numCtrl.numbers[j].fromName, function(data) {
                            cpo.$scope.$broadcast('itMessage', {
                                message : 'ImpactText Number settings saved'
                            });
                        }, function(data) {
                            cpo.$scope.$broadcast('itError', {
                                message : 'Failed to save ImpactText Number settings!'
                            });
                            console.log('did_modify: ' + data.apitext);
                        });
                    }
                }
            }
        },
        Controller : function($scope, $http, $cookieStore, $interval) {
            var numCtrl = this;
            var cpo = ngSettings.NumberNames;
            cpo.numCtrl = numCtrl;
            cpo.$scope = $scope;
            cpo.$http = $http;
            cpo.$cookieStore = $cookieStore;
            cpo.$scope.cpo = cpo;

            var stop;
            cpo.getNumbers = function() {
                if (angular.isDefined(stop))
                    return;

                stop = $interval(function() {
                    if (cpo.$scope.main.accountInfo.companyID && $scope.main.Settings.Numbers) {
                        cpo.stopInterval();
                        numCtrl.numbers = [];

                        cpo.ServerRequests.GetNumbers(cpo,
                        // success
                        function(data) {
                            numCtrl.numbers = $.extend(true, [], data.apidata);

                            // $scope.main.Settings.Numbers
                            for (var i in numCtrl.numbers) {
                                var numCtrl_number = numCtrl.numbers[i];
                                for (var j in $scope.main.Settings.Numbers) {
                                    var number = $scope.main.Settings.Numbers[j];
                                    if (number.DIDID == numCtrl_number.DIDID) {
                                        numCtrl_number['keyword'] = number.keyword;
                                    }
                                }
                            }
                        },
                        // error
                        function(data) {
                            cpo.$scope.$broadcast('itError', {
                                message : 'Failed to get ImpactText Number!'
                            });
                            console.log('did_get: ' + data.apitext);
                        });
                    }
                }, 100);
            };
            cpo.stopInterval = function() {
                if (angular.isDefined(stop)) {
                    $interval.cancel(stop);
                    stop = undefined;
                }
            };

            cpo.$scope.$on('$destroy', function() {
                cpo.stopInterval();
            });

            cpo.getNumbers();
        }
    },
    ForwardEmails : {
        ServerRequests : {
            GetNumbers : function(cpo, callback) {
                var params = {
                    apikey : cpo.$scope.main.authToken,
                    accountID : cpo.$scope.main.accountID,
                    companyID : cpo.$scope.main.accountInfo.companyID
                };

                var $param = $.param(params);

                //POST
                cpo.$http.post(inspiniaNS.wsUrl + 'did_get', $param)
                // success function
                .success(function(result) {
                    callback(result);
                })
                // error function
                .error(function(data, status, headers, config) {
                    console.log('did_get: ' + data.apitext);
                });
            },
            ModifyForwardEmails : function(cpo, didid, email, callback) {
                var params = {
                    apikey : cpo.$scope.main.authToken,
                    accountID : cpo.$scope.main.accountID,
                    companyID : cpo.$scope.main.accountInfo.companyID,
                    DIDID : didid
                };
                params.emailforwardaddress = email;
                var $param = $.param(params);

                //POST
                cpo.$http.post(inspiniaNS.wsUrl + "did_modifyemail", $param).success(function(data) {
                    if (data.apicode == 0) {
                        callback();
                    } else {
                        cpo.$scope.$broadcast('ModifyDIDForwardEmailFailed');
                    }
                }).error(
                //An error occurred with this request
                function(data, status, headers, config) {
                    cpo.$scope.$broadcast('ModifyDIDForwardEmailFailed');
                });
            }
        },
        Events : {
            Save_onClick : function(cpo, key) {
                if (cpo.fwCtrl && cpo.fwCtrl.numbers && cpo.fwCtrl.numbers.hasOwnProperty(key) && cpo.fwCtrl.numbers[key].DIDID) {
                    ngSettings.ForwardEmails.ServerRequests.ModifyForwardEmails(cpo, cpo.fwCtrl.numbers[key].DIDID, cpo.fwCtrl.numbers[key].emailForwardAddress, function() {
                        cpo.fwCtrl.edit[key] = false;
                        cpo.$scope.$broadcast('ModifyDIDForwardEmailSuccess');
                    });
                }
            }
        },
        Controller : function($scope, $http, $cookieStore) {
            var fwCtrl = this;
            var cpo = ngSettings.ForwardEmails;
            cpo.fwCtrl = fwCtrl;
            cpo.$scope = $scope;
            cpo.$http = $http;
            cpo.$cookieStore = $cookieStore;
            cpo.$scope.cpo = cpo;

            fwCtrl.GetNumbersCallback = function(result) {
                if (result.apicode == 0) {
                    if (result.apidata.length > 0) {
                        fwCtrl.numbers = result.apidata;
                    }
                }
            };

            fwCtrl.callGetNumbersRequest = function() {
                if ($scope.main.accountInfo.companyID) {
                    ngSettings.ForwardEmails.ServerRequests.GetNumbers(cpo, fwCtrl.GetNumbersCallback);
                } else {
                    setTimeout(function() {
                        fwCtrl.callGetNumbersRequest();
                    }, 500);
                }
            };

            fwCtrl.callGetNumbersRequest();
        }
    },
    Email2SMS : {
        ServerRequests : {
            GetAccount : function(cpo, callback) {
                var params = {
                    apikey : cpo.$scope.main.authToken,
                    accountID : cpo.$scope.main.accountID,
                    companyID : cpo.$scope.main.accountInfo.companyID
                };

                var $param = $.param(params);

                //POST
                cpo.$http.post(inspiniaNS.wsUrl + 'account_get', $param)
                // success function
                .success(function(result) {
                    callback(result);
                })
                // error function
                .error(function(data, status, headers, config) {
                    console.log('account_get: ' + data.apitext);
                });
            },
            ModifyAccount : function(cpo, emails, callback) {
                if (emails != '') {
                    var params = {
                        apikey : cpo.$scope.main.authToken,
                        accountID : cpo.$scope.main.accountID,
                        email2sms : emails,
                        sethttp : 1

                    };
                    var $param = $.param(params);

                    //POST
                    cpo.$http.post(inspiniaNS.wsUrl + "account_modify", $param).success(function(data) {
                        if (data.apicode == 0) {
                            callback();
                        } else {
                            cpo.$scope.$broadcast('ModifyAccountEmail2SMSFailed');
                        }
                    }).error(
                    //An error occurred with this request
                    function(data, status, headers, config) {
                        cpo.$scope.$broadcast('ModifyAccountEmail2SMSFailed');
                    });
                } else {
                    callback();
                }
            }
        },
        Events : {
            Save_onClick : function(cpo) {
                if (cpo.e2sCtrl) {
                    // API seams to revers the comma separated values so we need to create a reversed copy of cpo.e2sCtrl.newEmail2SMS
                    var newEmail2SMS_reversed = [];
                    angular.copy(cpo.e2sCtrl.newEmail2SMS, newEmail2SMS_reversed);
                    newEmail2SMS_reversed.reverse();

                    // Remove empty
                    newEmail2SMS_reversed = newEmail2SMS_reversed.filter(function(el) {
                        return el !== "";
                    });

                    ngSettings.Email2SMS.ServerRequests.ModifyAccount(cpo, newEmail2SMS_reversed.join(), function() {
                        cpo.$scope.$broadcast('ModifyAccountEmail2SMSSuccess');
                    });
                }
            }
        },
        Controller : function($scope, $http, $cookieStore) {
            var e2sCtrl = this;
            var cpo = ngSettings.Email2SMS;
            cpo.e2sCtrl = e2sCtrl;
            cpo.$scope = $scope;
            cpo.$http = $http;
            cpo.$cookieStore = $cookieStore;
            cpo.$scope.cpo = cpo;

            e2sCtrl.GetAccountCallback = function(result) {
                e2sCtrl.email2sms = [];
                if (result.apicode == 0) {
                    if (result.apidata.length > 0) {
                        e2sCtrl.email2sms = result.apidata[0]['email2sms'].split(",");
                        if (e2sCtrl.email2sms.length > 5) {
                            e2sCtrl.email2sms.splice(5, e2sCtrl.email2sms.length - 5);
                        }

                        e2sCtrl.newEmail2SMS = [];
                        angular.copy(e2sCtrl.email2sms, e2sCtrl.newEmail2SMS);

                        if (e2sCtrl.newEmail2SMS.length < 5) {
                            var missing = 5 - e2sCtrl.newEmail2SMS.length;
                            for (var i = 1; i <= missing; i++) {
                                e2sCtrl.email2sms.push('');
                            }
                        }
                    }
                }
            };

            e2sCtrl.callGetAccountRequest = function() {
                if ($scope.main.accountInfo.companyID) {
                    ngSettings.Email2SMS.ServerRequests.GetAccount(cpo, e2sCtrl.GetAccountCallback);
                } else {
                    setTimeout(function() {
                        e2sCtrl.callGetAccountRequest();
                    }, 500);
                }
            };

            e2sCtrl.callGetAccountRequest();
        }
    },
    Autoresponder : {
        _internal : {
            ResetList : function(cpo) {
                cpo.arCtrl.autoresponderID = null;
                cpo.arCtrl.autoresponderName = '';
                cpo.arCtrl.termKeyword = '';

                cpo.arCtrl.validFrom = new Date();
                cpo.arCtrl.validUntil = null;
                cpo.arCtrl.makeInactive = false;
                cpo.arCtrl.addToList = true;

                cpo.arCtrl.fromName = '';

                cpo.$scope.ngData = [];
                cpo.$scope.totalServerItems = 0;

                cpo.arCtrl.maxLength = 160;
            },
            ResetRules : function(cpo) {
                cpo.arCtrl.inactive = false;
                cpo.keywordActionRules = [{
                    checked : true,
                    name : 'mvDelay0',
                    parameters : '{"message":""}',
                    status : 'A',
                    optOutMsg : '',
                    optFields : {
                        OptOutTxt1 : '',
                        OptOutTxt2 : '',
                        OptOutTxt3 : ''
                    },
                    setTimeHourFrom : '00',
                    setTimeMinuteFrom : '00',
                    OptOutMsg : ''
                }, {
                    checked : false,
                    name : 'mvDelay1',
                    parameters : '{"message":""}',
                    status : 'I',
                    optOutMsg : '',
                    optFields : {
                        OptOutTxt1 : '',
                        OptOutTxt2 : '',
                        OptOutTxt3 : ''
                    },
                    setTimeHourFrom : '00',
                    setTimeMinuteFrom : '00',
                    OptOutMsg : ''
                }, {
                    checked : false,
                    name : 'mvDelay2',
                    parameters : '{"message":""}',
                    status : 'I',
                    optOutMsg : '',
                    optFields : {
                        OptOutTxt1 : '',
                        OptOutTxt2 : '',
                        OptOutTxt3 : ''
                    },
                    setTimeHourFrom : '00',
                    setTimeMinuteFrom : '00',
                    OptOutMsg : ''
                }];
            },
            SetFromNumber : function(cpo) {
                if (cpo.$scope.main.fromNumbers != null) {
                    var defaultNumberDID = '';
                    if (cpo.$scope.main.Settings.Numbers != null) {
                        for (var Number in cpo.$scope.main.Settings.Numbers) {
                            if (cpo.$scope.main.Settings.Numbers[Number].prefered) {
                                defaultNumberDID = cpo.$scope.main.Settings.Numbers[Number].DID;
                                break;
                            }
                        }
                    }
                    if (defaultNumberDID != '') {
                        cpo.arCtrl.fromNumber = $.grep(cpo.$scope.main.fromNumbers, function(number){
                        return number.DID == defaultNumberDID;
                        })[0];
                    } else {
                        cpo.arCtrl.fromNumber = $.grep(cpo.$scope.main.fromNumbers, function(number){
                        return number.DIDID == cpo.$scope.main.accountInfo.primaryDIDID;
                        })[0];
                    }
                    if (!cpo.$scope.$$phase) {
                        cpo.$scope.$apply();
                    }
                } else {
                    setTimeout(function() {
                        ngSettings.Autoresponder._internal.SetFromNumber(cpo);
                    }, 500);
                }
            },
            MaxLengthCalc : function(cpo) {
                cpo.arCtrl.maxLength = 160;
                // cpo.arCtrl.maxLength = cpo.arCtrl.maxLength - cpo.arCtrl.fromName.length;
                // cpo.arCtrl.maxLength = cpo.arCtrl.maxLength - cpo.arCtrl.optFields.OptOutTxt1.length;
                // cpo.arCtrl.maxLength = cpo.arCtrl.maxLength - cpo.arCtrl.optFields.OptOutTxt2.length;
                // cpo.arCtrl.maxLength = cpo.arCtrl.maxLength - cpo.arCtrl.optFields.OptOutTxt3.length;
                // cpo.arCtrl.maxLength = cpo.arCtrl.maxLength - (cpo.arCtrl.fromName.length > 0 ? 2 : 0);
                // cpo.arCtrl.maxLength = cpo.arCtrl.maxLength - (cpo.arCtrl.optFields.OptOutTxt1.length > 0 ? 1 : 0);
                // cpo.arCtrl.maxLength = cpo.arCtrl.maxLength - (cpo.arCtrl.optFields.OptOutTxt2.length > 0 ? 1 : 0);
                // cpo.arCtrl.maxLength = cpo.arCtrl.maxLength - (cpo.arCtrl.optFields.OptOutTxt3.length > 0 ? 1 : 0);
            },
            fillRule : function(rule, inAction) {
                rule = inAction;
                rule.checked = true;
                rule.optOutMsg = '';
                rule.optFields = {
                    OptOutTxt1 : '',
                    OptOutTxt2 : '',
                    OptOutTxt3 : ''
                };
                rule.setTimeHourFrom = '00';
                rule.setTimeMinuteFrom = '00';
                rule.OptOutMsg = '';
            }
        },
        ServerRequests : {
            GetAutoresponder : function(cpo, callback) {
                if (cpo.$scope.main.accountInfo.companyID) {
                    var params = {
                        apikey : cpo.$scope.main.authToken,
                        accountID : cpo.$scope.main.accountID,
                        companyID : cpo.$scope.main.accountInfo.companyID,
                        autoresponderid : parseInt(cpo.arCtrl.fromNumber.autoResponderID)
                        // ,sethttp : 1
                    };

                    var $param = $.param(params);

                    //POST
                    cpo.$http.post(inspiniaNS.wsUrl + 'autoresponder_get', $param)
                    // success function
                    .success(function(result) {
                        callback(cpo, result);
                    })
                    // error function
                    .error(function(data, status, headers, config) {
                        // console.log(data)
                        cpo.$scope.$broadcast('itError', {
                            message : 'Error! ' + data.apitext
                        });
                        console.log('autoresponder_get: ' + data.apitext);
                    });
                } else {
                    setTimeout(function() {
                        ngSettings.Autoresponder.ServerRequests.GetAutoresponder(cpo, callback);
                    }, 500);
                }
            },
            GetAutoresponderCallback : function(cpo, result) {
                if (result.apicode == 0) {
                    if (result.apidata.length > 0) {
                        cpo.arCtrl.autoresponder = result.apidata[0];
                        ngSettings.Autoresponder.ServerRequests.GetKeyword(cpo, ngSettings.Autoresponder.ServerRequests.GetKeywordCallback);
                    }
                } else {
                    cpo.$scope.$broadcast('itError', {
                        message : 'Error! ' + result.apitext
                    });
                }
            },
            GetKeyword : function(cpo, callback) {
                if (cpo.$scope.main.accountInfo.companyID) {
                    var params = {
                        apikey : cpo.$scope.main.authToken,
                        accountID : cpo.$scope.main.accountID,
                        autoresponderid : parseInt(cpo.arCtrl.autoresponder.autoResponderID)
                        // companyID : cpo.$scope.main.accountInfo.companyID,
                        // didid : cpo.arCtrl.fromNumber.DIDID
                        // ,sethttp : 1
                    };
                    var $param = $.param(params);

                    // POST
                    cpo.$http.post(inspiniaNS.wsUrl + 'autoresponder_keyword_get', $param)
                    // success function
                    .success(function(result) {
                        callback(cpo, result);
                    })
                    // error function
                    .error(function(data, status, headers, config) {
                        cpo.$scope.$broadcast('itError', {
                            message : 'Error! ' + data.apitext
                        });
                        console.log('autoresponder_keyword_get: ' + data.apitext);
                    });
                } else {
                    setTimeout(function() {
                        ngSettings.Autoresponder.ServerRequests.GetKeyword(cpo, callback);
                    }, 500);
                }
            },
            GetKeywordCallback : function(cpo, result) {
                if (result.apicode == 0) {
                    if (result.apidata.length > 0) {
                        cpo.$scope.ngData = result.apidata;
                        cpo.$scope.totalServerItems = result.apicount;
                        if (!cpo.$scope.$$phase) {
                            cpo.$scope.$apply();
                        }
                        setTimeout(function() {
                            cpo.$scope.ngRespondersOptions.selectAll(false);
                        }, 100);
                    }
                } else {
                    cpo.$scope.$broadcast('itError', {
                        message : 'autoresponder_keyword_get result error: ' + result.apitext
                    });
                }
            },
            GetKeywordActions : function(cpo, callback) {
                if (cpo.$scope.main.accountInfo.companyID) {
                    var params = {
                        apikey : cpo.$scope.main.authToken,
                        accountID : cpo.$scope.main.accountID,
                        autoresponderkeywordid : parseInt(cpo.clickedKeyword.autoResponderKeywordID)
                    };
                    var $param = $.param(params);

                    // POST
                    cpo.$http.post(inspiniaNS.wsUrl + 'autoresponder_keyword_action_get', $param)
                    // success function
                    .success(function(result) {
                        callback(cpo, result);
                    })
                    // error function
                    .error(function(data, status, headers, config) {
                        cpo.$scope.$broadcast('itError', {
                            message : 'Error! ' + data.apitext
                        });
                        console.log('autoresponder_keyword_action_get: ' + data.apitext);
                    });
                } else {
                    setTimeout(function() {
                        ngSettings.Autoresponder.ServerRequests.GetKeywordActions(cpo, callback);
                    }, 500);
                }
            },
            GetKeywordActionsCallback : function(cpo, result) {
                cpo._internal.ResetRules(cpo);
                cpo.Events.ShowRule(cpo);

                if (result.apicode == 0) {
                    if (result.apidata.length > 0) {
                        for (var i = 0; i < result.apidata.length; i++) {
                            switch (result.apidata[i].name) {
                            case 'mvDelay0':
                                ngSettings.Autoresponder._internal.fillRule(cpo.keywordActionRules[0], result.apidata[i]);
                                break;
                            case 'mvDelay1':
                                ngSettings.Autoresponder._internal.fillRule(cpo.keywordActionRules[1], result.apidata[i]);
                                break;
                            case 'mvDelay2':
                                ngSettings.Autoresponder._internal.fillRule(cpo.keywordActionRules[2], result.apidata[i]);
                                break;
                            default:
                                break;
                            }
                        }
                    }
                    cpo.PopulateRules(cpo);
                } else {
                    cpo.$scope.$broadcast('itError', {
                        message : 'autoresponder_keyword_actions_get result error: ' + result.apitext
                    });
                }
            },
            AddKeyword : function(cpo, callback) {
                var params = {
                    apikey : cpo.$scope.main.authToken,
                    accountID : cpo.$scope.main.accountID,
                    companyID : cpo.$scope.main.accountInfo.companyID,
                    didid : cpo.arCtrl.fromNumber.DIDID,
                    keyword : cpo.arCtrl.termKeyword,
                    fromname : cpo.arCtrl.fromName,
                    message : cpo.arCtrl.messageTxt,
                    addtocontactlist : cpo.arCtrl.addToList ? 1 : 0,
                    optoutmessageid : 1
                    // ,sethttp : 1
                };

                if (cpo.arCtrl.validFrom) {
                    params.startdate = cpo.arCtrl.validFrom.toISOString().substring(0, 10) + ' 00:00:00';
                };
                if (cpo.arCtrl.validUntil) {
                    params.enddate = cpo.arCtrl.validUntil.toISOString().substring(0, 10) + ' 00:00:00';
                };

                var $param = $.param(params);

                //POST
                cpo.$http.post(inspiniaNS.wsUrl + 'keyword_add', $param)
                // success function
                .success(function(result) {
                    callback(cpo, result);
                })
                // error function
                .error(function(data, status, headers, config) {
                    cpo.$scope.$broadcast('itError', {
                        message : 'Error! ' + data.apitext
                    });
                    console.log('keyword_add: ' + data.apitext);
                });
            },
            AddKeywordCallback : function(cpo, result) {
                if (result.apicode == 0) {
                    cpo.$scope.$broadcast('itMessage', {
                        message : 'Autoresponder added'
                    });
                } else {
                    cpo.$scope.$broadcast('itError', {
                        message : 'Error! ' + result.apitext
                    });
                }
            },
            ModifyKeyword : function(cpo, keywordList, callback) {
                for (var i = 0; i < keywordList.length; i++) {
                    var params = {
                        apikey : cpo.$scope.main.authToken,
                        accountID : cpo.$scope.main.accountID,
                        companyID : cpo.$scope.main.accountInfo.companyID,
                        autoresponderkeywordid : keywordList[i].autoResponderKeywordID,
                        name : keywordList[i].name,
                        status : cpo.arCtrl.inactive?"I":"A",
                        startdate : keywordList[i].startDate,
                        enddate : keywordList[i].endDate
                    };

                    // if (cpo.arCtrl.termKeyword) {
                    // params.keyword = cpo.arCtrl.termKeyword;
                    // };

                    // if (cpo.arCtrl.message) {
                    // params.message = cpo.arCtrl.message;
                    // };

                    // if (cpo.arCtrl.fromName) {
                    // params.fromname = cpo.arCtrl.fromName;
                    // };

                    // if (cpo.arCtrl.validFrom) {
                    // params.startdate = cpo.arCtrl.validFrom.toISOString().substring(0, 10) + ' 00:00:00';
                    // };
                    // if (cpo.arCtrl.validUntil) {
                    // params.enddate = cpo.arCtrl.validUntil.toISOString().substring(0, 10) + ' 00:00:00';
                    //};

                    var $param = $.param(params);

                    //POST
                    cpo.$http.post(inspiniaNS.wsUrl + 'autoresponder_keyword_modify', $param)
                    // success function
                    .success(function(result) {
                        callback(cpo, result);
                    })
                    // error function
                    .error(function(data, status, headers, config) {
                        cpo.$scope.$broadcast('itError', {
                            message : 'Error! ' + data.apitext
                        });
                        console.log('autoresponder_keyword_modify: ' + data.apitext);
                    });
                }
            },
            ModifyKeywordCallback : function(cpo, result) {
                if (result.apicode == 0) {
                    cpo.$scope.$broadcast('itMessage', {
                        message : 'Autoresponder modified'
                    });
                } else {
                    cpo.$scope.$broadcast('itError', {
                        message : 'Error! ' + result.apitext
                    });
                }
                ngSettings.Autoresponder.FillAutoresponder(cpo);
            }
        },
        Events : {
            BackToRules_onClick : function(cpo) {
                ngSettings.Autoresponder.FillAutoresponder(cpo);
            },
            FromNumberChange : function(cpo) {
                ngSettings.Autoresponder.FillAutoresponder(cpo);
            },
            FromNameChange : function(cpo) {
                ngSettings.Autoresponder._internal.MaxLengthCalc(cpo);
            },
            OptFieldsChange : function(cpo) {
                ngSettings.Autoresponder._internal.MaxLengthCalc(cpo);
            },
            //New KEYWORD
            AddNewRule_onClick : function(cpo) {

            },
            //ACTIVATE KEYWORD
            ActivateRules_onClick : function(cpo) {
                cpo.arCtrl.inactive = false;
                ngSettings.Autoresponder.ServerRequests.ModifyKeyword(cpo, cpo.$scope.ngRespondersOptions.selectedItems, ngSettings.Autoresponder.ServerRequests.ModifyKeywordCallback);
            },
            //DEACTIVATE KEYWORD
            DeactivateRules_onClick : function(cpo) {
                cpo.arCtrl.inactive = true;
                ngSettings.Autoresponder.ServerRequests.ModifyKeyword(cpo, cpo.$scope.ngRespondersOptions.selectedItems, ngSettings.Autoresponder.ServerRequests.ModifyKeywordCallback);
            },
            Delete_onClick : function(cpo) {

            },
            Save_onClick : function(cpo) {
                ngSettings.Autoresponder.ServerRequests.ModifyKeyword(cpo, [cpo.clickedKeyword], ngSettings.Autoresponder.ServerRequests.ModifyKeywordCallback);
            },
            ShowList : function(cpo) {
                cpo.list = true;
                cpo.rule = false;
            },
            ShowRule : function(cpo) {
                cpo.list = false;
                cpo.rule = true;
            },
            Autoresponder_onClick : function(cpo, row) {
                cpo.clickedKeyword = row.entity;
                ngSettings.Autoresponder.ServerRequests.GetKeywordActions(cpo, ngSettings.Autoresponder.ServerRequests.GetKeywordActionsCallback);
            }
        },
        list : false,
        rule : false,
        columnDefs : [{
            checked : true,
            canBeClicked : true,
            field : 'name',
            displayName : 'Autoresponder Name',
            cellTemplate : 'views/table/AutorespondersTableTemplate.html'
        }, {
            checked : true,
            canBeClicked : false,
            field : 'status',
            displayName : 'Status',
            cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()" style="text-align:center"><span class="{{row.getProperty(col.field)}}">{{row.getProperty(col.field)}}</span></div>'
        }, {
            checked : true,
            canBeClicked : false,
            field : 'actionCount',
            displayName : 'Delays set'
        }, {
            checked : true,
            canBeClicked : false,
            field : 'startDate',
            displayName : 'Valid from'
        }, {
            checked : true,
            canBeClicked : false,
            field : 'endDate',
            displayName : 'Valid to'
        }],
        clickedKeyword : null,
        keywordActionRules : null,
        FillAutoresponder : function(cpo) {
            ngSettings.Autoresponder._internal.ResetList(cpo);
            if (cpo.arCtrl.fromNumber && cpo.arCtrl.fromNumber.DID) {
                //list refresh
                if (cpo.arCtrl.fromNumber.autoResponderID !== '0') {
                    ngSettings.Autoresponder.ServerRequests.GetAutoresponder(cpo, ngSettings.Autoresponder.ServerRequests.GetAutoresponderCallback);
                } else {
                    //TODO assign autoresponder to number
                    // alert('//TODO assign autoresponder to DID')
                }

                //fill number name if needed
                if (cpo.$scope.main.Settings.Numbers && cpo.$scope.main.Settings.Numbers.length > 0 && cpo.arCtrl.fromNumber && cpo.arCtrl.fromNumber.DID) {
                    var Number = $.grep(cpo.$scope.main.Settings.Numbers, function(member){
                    return member.DID == cpo.arCtrl.fromNumber.DID;
                    })[0];
                    if (Number.name != null && Number.name != '') {
                        cpo.arCtrl.fromName = Number.name;
                    }
                }
                //get keywords
                // if (cpo.arCtrl.fromNumber.DIDID) {
                // ngSettings.Autoresponder.ServerRequests.GetKeyword(cpo, ngSettings.Autoresponder.ServerRequests.GetKeywordCallback);
                // }
            }
            cpo.Events.ShowList(cpo);
        },
        PopulateScope : function(cpo) {
            cpo.$scope.columnDefs = ngInbox._internal.Settings.GrepColumnDefs(cpo.columnDefs);

            cpo.$scope.ngRespondersOptions = {
                data : 'ngData',
                enableSorting : true,
                useExternalSorting : true,
                rowHeight : 35,
                selectedItems : [],
                showSelectionCheckbox : true,
                multiSelect : true,
                selectWithCheckboxOnly : true,
                enablePaging : false,
                showFooter : false,
                columnDefs : 'columnDefs'
            };
        },
        PopulateRules : function(cpo) {
            console.log(cpo.clickedKeyword)
            cpo.arCtrl.inactive = (cpo.clickedKeyword.status === "I")
        },
        Controller : function($scope, $http, $cookieStore) {
            var arCtrl = this;
            var cpo = ngSettings.Autoresponder;
            //cpo.Events.ShowList(cpo);

            cpo.$scope = $scope;
            cpo.arCtrl = arCtrl;
            cpo.arCtrl.fromNumber = {};
            cpo.$http = $http;
            cpo.$cookieStore = $cookieStore;
            cpo.$scope.cpo = cpo;

            //reset autoresponder
            ngSettings.Autoresponder._internal.ResetList(cpo);

            //populate scope
            ngSettings.Autoresponder.PopulateScope(cpo);

            //Watchers initialization
            $scope.$watch('arCtrl.fromNumber', function() {
                ngSettings.Autoresponder.Events.FromNumberChange(cpo);
            });
            $scope.$watch('arCtrl.fromName', function() {
                ngSettings.Autoresponder.Events.FromNameChange(cpo);
            }, true);
            $scope.$watch('arCtrl.optFields', function() {
                ngSettings.Autoresponder.Events.OptFieldsChange(cpo);
            }, true);
            $scope.$watch('cpo.clickedKeyword', function() {

            }, true);
            $scope.$watch('ngData', function() {
                $('.gridStyle').trigger('resize');
            });

            //set prefered number
            ngSettings.Autoresponder._internal.SetFromNumber(cpo);
        }
    }
};
