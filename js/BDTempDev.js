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
			pCtrl.doughnutData[0].value = pCtrl.bucketOfMessages;
			pCtrl.doughnutData[1].value = pCtrl.messageCount;
		};

		$scope.$watch('pCtrl.messageCount', updateDouhnutOptions, true);
        //$scope.$watch('pCtrl.bucketOfMessages', updateDouhnutOptions, true);

		//get messages count
		var $param = $.param({
			apikey : $scope.main.authToken,
			accountID : $scope.main.accountId
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
			PageOptions : function() {
				var self = this;
				self.pageSizes = [2, 5, 10, 20, 50, 100];
				self.pageSize = 10;
				self.currentPage = 1;
			},
			FilterOptions : function() {
				var self = this;
				self.filterText = '';
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
			SetPagingDataSliced : function($scope, data, totalResultsCount) {
				$scope.ngData = data;
				$scope.totalServerItems = totalResultsCount;
				if (!$scope.$$phase) {
					$scope.$apply();
				}
				$scope.ngOptions.selectAll(false);
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
					var params = {
						apikey : controllerParent.$cookieStore.get('inspinia_auth_token'),
						accountID : controllerParent.$cookieStore.get('inspinia_account_id'),
						limit : pageSize,
						offset : (page - 1) * pageSize,
						status : controllerParent.getListStatus,
						orderby : ngInbox._internal.Methods.GenerateOrderByField(controllerParent),
						sethttp : 1
					};

					if (searchText) {
						params.search = searchText.toLowerCase();
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
			PopulateScope : function(controllerParent) {
				var cookie = ngInbox._internal.Settings.GetCookie(controllerParent);
				if (cookie != null) {
					var parentCookie = $.grep(cookie, function(member){
						return member.Name == controllerParent.Name;
					});
					if (parentCookie.length!=0){
						controllerParent.columnDefs = parentCookie[0].columnDefs;
					} 
					
					
				}
				ngInbox._internal.ErrorMsg = controllerParent.errorMessage;

				controllerParent.$scope.mySelections = [];
				controllerParent.$scope.totalServerItems = 0;
				controllerParent.$scope.sortOptions = controllerParent.sortOptions;
				controllerParent.$scope.pagingOptions = new ngInbox._internal.DataConstructors.PageOptions();
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

				//INITIAL GET DATA
				// controllerParent.$scope.getPagedDataAsync(controllerParent);

				//TABLE OPTIONS
				controllerParent.$scope.columnDefs = ngInbox._internal.Settings.GrepColumnDefs(controllerParent.columnDefs);
				controllerParent.$scope.ngOptions = {
					data : 'ngData',
					enableSorting : true,
					useExternalSorting : true,
					sortInfo : controllerParent.$scope.sortOptions,
					rowHeight : 35,
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
					columnDefs : 'columnDefs', //controllerParent.columnDefs,
					primaryKey : controllerParent.primaryKey
				};

				controllerParent.$scope.controllerParent = controllerParent;
			},
			GetANI : function(controllerParent, continueFunction) {
				try {
					if (controllerParent.$scope.fromNumbers == null) {
						controllerParent.$scope.fromNumbers = controllerParent.$scope.main.fromNumbers;
					}
					if (controllerParent.$scope.contactLists == null) {
						controllerParent.$scope.contactLists = controllerParent.$scope.main.contactLists;
					}
					if (controllerParent.clickedMessage && controllerParent.clickedMessage.ANI) {
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
										tmpANIList_ = tmpANIList_.substring(commaPosition_ + 1);
										if (tmpANI_.length == 11) {
											tmpANIForSending_ = tmpANI_;
											tmpANI_ = tmpANI_.substring(1);
										}

										if (controllerParent.ANIList == '') {
											controllerParent.ANIList = tmpANI_;
										} else {
											controllerParent.ANIList = controllerParent.ANIList + ',' + tmpANI_;
										}

									};
									if (tmpANIList_.length == 11) {
										tmpANIList_ = tmpANIList_.substring(1);
									}

									controllerParent.ANIList = controllerParent.ANIList + ',' + tmpANIList_;

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
			SendMessage : function(controllerParent, messageToSendArray, changeToStatus, callback) {
				// var successfullRequestsCount_ = 0;
				// var totalNumberOfMessages_ = messageToSendArray.length;
				for (var j = 0; j < messageToSendArray.length; j++) {
					var params = {
						apikey : controllerParent.$cookieStore.get('inspinia_auth_token'),
						accountID : controllerParent.$cookieStore.get('inspinia_account_id'),
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
								controllerParent.$scope.$broadcast("SendingMessageSucceeded", data.apidata);
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
					ngInbox._internal.Methods.GetANI(controllerParent, continueFunction);

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
				ngInbox._internal.Methods.SendMessage(controllerParent, messageList, controllerParent.restoreMessageStatus, callback);
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
				//setTimeout(function() {
				inParent.$scope.getPagedDataAsync(inParent);
				//}, 200);
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
				return columnDefsCookie;
			},
			SetCookie : function(inParent) {
				var columnDefsCookie = ngInbox._internal.Settings.GetCookie(inParent);
				if (columnDefsCookie == null) {
					columnDefsCookie = [];
				} else{
					columnDefsCookie = $.grep(columnDefsCookie, function(member){
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
			$scope.$on('ErrorOnMessages', function(event, args) {
                if (!$scope.controllerParent.DontShowMessage) {
				$scope.ErrorOnMsg(args);
                }
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
			displayName : 'Date',
		}, {
			checked : true,
			canBeClicked : false,
			field : 'lists',
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
			UpdateColumns : function(inParent) {
				ngInbox._internal.Settings.UpdateColumns(inParent);
			},
			Message_onClick : function(inParent, row) {
				inParent.clickedMessage = row.entity;
				inParent.Events.ShowView(inParent);
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
			},
			ShowView : function(inParent) {
				inParent.list = false;
				inParent.view = true;
				inParent.add = false;
				inParent.settings = false;
			},
			ShowAdd : function(inParent) {
				inParent.list = false;
				inParent.view = false;
				inParent.add = true;
				inParent.settings = false;
			},
			ShowSettings : function(inParent) {
				inParent.list = false;
				inParent.view = false;
				inParent.add = false;
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
			var controllerParent = ngInbox.InboxList;
			controllerParent.Events.ShowList(controllerParent);

			controllerParent.$scope = $scope;
			controllerParent.$http = $http;
			controllerParent.$cookieStore = $cookieStore;

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
				// $sendScope.FromName = $sendScope.initial;
				// $sendScope.MessageType = 'SMS';
				$sendScope.FromNumber = $.grep($sendScope.fromNumbers, function(member) {
				return member.DID == $sendScope.controllerParent.clickedMessage.DID;
				})[0];
				// $sendScope.ToList = $.grep($sendScope.contactLists, function(member) {
				// return member.contactListID == $sendScope.controllerParent.clickedMessage.contactListID;
				// })[0];
				// $sendScope.ToNumber = '';//$sendScope.controllerParent.clickedMessage.ANI;
				// $sendScope.OptOutMsg = '';
				// $sendScope.OptOutTxt3 = $sendScope.initial;
				// $sendScope.MessageTxt = $sendScope.controllerParent.clickedMessage.message;
				// $sendScope.ScheduleCheck = false;
				// $sendScope.SetDate = new Date($sendScope.controllerParent.clickedMessage.scheduledDate.substring(0, 4), $sendScope.controllerParent.clickedMessage.scheduledDate.substring(5, 7), $sendScope.controllerParent.clickedMessage.scheduledDate.substring(8, 10));
				// $sendScope.SetTimeHour = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(11, 13);
				// $sendScope.SetTimeMinute = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(14, 16);
			} catch(e) {
				//TODO skloniti ovaj try-catch kada se odradi inicijalna clickedMessage
			}

		},
		PostSuccess : function(controllerParent, result) {
			var nListsReturned = 0;
			var messages = result.apidata;

			for (var i in messages) {
				var params = {
					apikey : controllerParent.$cookieStore.get('inspinia_auth_token'),
					accountID : controllerParent.$cookieStore.get('inspinia_account_id'),
					ANI : messages[i].sourceANI,
					sethttp : 1
				};

				var $param = $.param(params);
				var success = function(cnt) {
					var lists = '';
					for (var j in cnt.apidata) {
						lists += cnt.apidata[j].contactListName;
						if (j < cnt.apidata.length - 1) {
							lists += ', ';
						}
					}
					messages[nListsReturned].lists = lists;
					nListsReturned++;
				};
				//POST
				controllerParent.$http.post(inspiniaNS.wsUrl + 'contact_get', $param)
				// success function
				.success(function(contacts) {
					success(contacts);
				})
				// error function
				.error(function(data, status, headers, config) {
					nListsReturned++;
				});
				controllerParent.$scope.setPagingDataSliced(controllerParent.$scope, messages, result.apicount);
			}
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
			displayName : 'Date sent',
		}, {
			checked : true,
			canBeClicked : false,
			field : 'DID',
			displayName : 'From',
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
				inScope.controllerParent.radioModel = '';
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

			ngInbox._internal.Methods.PopulateScope(controllerParent);
			controllerParent.Events.InitialiseEvents(controllerParent);
		},
		PopulateSend : function($sendScope) {
			try {
				continueFunction = function(controllerParent) {
					$sendScope = controllerParent.$scope;
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
					$sendScope.SetDate = new Date($sendScope.controllerParent.clickedMessage.scheduledDate.substring(0, 4), $sendScope.controllerParent.clickedMessage.scheduledDate.substring(5, 7), $sendScope.controllerParent.clickedMessage.scheduledDate.substring(8, 10));
					$sendScope.SetTimeHour = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(11, 13);
					$sendScope.SetTimeMinute = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(14, 16);
				};

				ngInbox._internal.Methods.GetANI($sendScope.controllerParent, continueFunction);
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
			displayName : 'Date created',
		}, {
			checked : true,
			canBeClicked : false,
			field : 'scheduledDate',
			displayName : 'Date scheduled',
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

				continueFunction = function(controllerParent) {
					$sendScope = controllerParent.$scope;
					$sendScope.ToNumber = $sendScope.controllerParent.ANIList;
					$sendScope.controllerParent.clickedMessage.con_lis = $sendScope.controllerParent.ANIList;

					$sendScope.FromNumber = $.grep($sendScope.fromNumbers, function(member) {
					return member.DID == $sendScope.controllerParent.clickedMessage.DID;
					})[0];
					$sendScope.ToList = $.grep($sendScope.contactLists, function(member) {
					return member.contactListID == $sendScope.controllerParent.clickedMessage.contactListID;
					})[0];
					// $sendScope.ToNumber = $sendScope.controllerParent.clickedMessage.ANI;
					// $sendScope.ToNumber = $sendScope.ToNumber.replace(' ...', '');
					// if ($sendScope.ToNumber.length > 10 && $sendScope.ToNumber[0] == '1') {
					// $sendScope.ToNumber = $sendScope.ToNumber.substring(1);
					// }

					$sendScope.OptOutMsg = '';
					$sendScope.OptOutTxt3 = $sendScope.initial;
					$sendScope.MessageTxt = $sendScope.controllerParent.clickedMessage.message;
					$sendScope.ScheduleCheck = true;
					$sendScope.SetDate = new Date($sendScope.controllerParent.clickedMessage.scheduledDate.substring(0, 4), $sendScope.controllerParent.clickedMessage.scheduledDate.substring(5, 7), $sendScope.controllerParent.clickedMessage.scheduledDate.substring(8, 10));
					$sendScope.SetTimeHour = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(11, 13);
					$sendScope.SetTimeMinute = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(14, 16);
				};

				ngInbox._internal.Methods.GetANI($sendScope.controllerParent, continueFunction);

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
			field : 'message',
			displayName : 'Message',
			cellTemplate : 'views/table/MessageTableTemplate.html'
		}, {
			field : 'statusDate',
			displayName : 'Date & Time Saved',
		}, {
			cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()"><a class="btn" ng-click="controllerParent.Events.Message_onClick(controllerParent,row)"><i class="fa fa-pencil"></i> Edit </a></div>'
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

				continueFunction = function(controllerParent) {
					$sendScope = controllerParent.$scope;
					$sendScope.ToNumber = $sendScope.controllerParent.ANIList;
					$sendScope.controllerParent.clickedMessage.con_lis = $sendScope.ToNumber;
					$sendScope.OptOutMsg = '';
					$sendScope.OptOutTxt3 = $sendScope.initial;
					$sendScope.MessageTxt = $sendScope.controllerParent.clickedMessage.message;
					$sendScope.ScheduleCheck = false;
					$sendScope.SetDate = new Date($sendScope.controllerParent.clickedMessage.scheduledDate.substring(0, 4), $sendScope.controllerParent.clickedMessage.scheduledDate.substring(5, 7), $sendScope.controllerParent.clickedMessage.scheduledDate.substring(8, 10));
					$sendScope.SetTimeHour = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(11, 13);
					$sendScope.SetTimeMinute = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(14, 16);
				};
				ngInbox._internal.Methods.GetANI($sendScope.controllerParent, continueFunction);

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
			field : 'sourceANI',
			displayName : 'Contact',
			cellTemplate : 'views/table/MessageTableTemplate.html'
		}, {
			field : 'message',
			displayName : 'Message',
			cellTemplate : 'views/table/MessageTableTemplate.html'
		}, {
			field : 'statusDate',
			displayName : 'Date & Time Deleted',
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

