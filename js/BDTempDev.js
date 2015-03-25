var ngInbox = {
	_internal : {
		ErrorMsg : '',
		getDataTimeout: 200,
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
					setTimeout(function(){
						controllerParent.getDataBlocked = false;
					}, ngInbox._internal.getDataTimeout);
					
					console.log(controllerParent.getListAction)
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
					columnDefs : controllerParent.columnDefs,
					primaryKey : controllerParent.primaryKey
				};

				controllerParent.$scope.controllerParent = controllerParent;
			},
			StatusChange : function(controllerParent, messageToChangeStatusArray, changeToStatus, callback) {
				var params = {
					apikey : controllerParent.$cookieStore.get('inspinia_auth_token'),
					accountID : controllerParent.$cookieStore.get('inspinia_account_id'),
					status : changeToStatus,
					sethttp : 1
				};
				var successfullRequestsCount_ = 0;
				var totalNumberOfMessages_ = messageToChangeStatusArray.length;
				for (var j = 0; j < messageToChangeStatusArray.length; j++) {
					switch (controllerParent.getListAction) {
					case 'messages_inbound' :
						params.inboundMessageId = messageToChangeStatusArray[j].inboundMessageID;
						break;
					case 'messages_outbound' :
						// NOT DEFINED YET
						params.outboundMessageID = messageToChangeStatusArray[j].outboundMessageID;
						break;
					}
					var $param = $.param(params);

					//POST
					controllerParent.$http.post(inspiniaNS.wsUrl + controllerParent.statusChangeAction, $param)
					// success function
					.success(function(result) {
						successfullRequestsCount_++;
						if (totalNumberOfMessages_ == successfullRequestsCount_) {
							callback();
						}
					})
					// error function
					.error(function(data, status, headers, config) {
						controllerParent.$scope.$broadcast("ErrorOnMessages", ngInbox._internal.ErrorMsg);
					});
				}
			},
			SendMessage : function(controllerParent, messageToSendArray, changeToStatus, callback) {
				var params = {
					apikey : controllerParent.$cookieStore.get('inspinia_auth_token'),
					accountID : controllerParent.$cookieStore.get('inspinia_account_id'),
					sethttp : 1
				};

				var successfullRequestsCount_ = 0;
				var totalNumberOfMessages_ = messageToSendArray.length;
				for (var j = 0; j < messageToSendArray.length; j++) {
					params.message = messageToSendArray[j].message;
					params.contactListID == messageToSendArray[j].contactListID;
					params.ANI = messageToSendArray[j].ANI;
					params.DID = messageToSendArray[j].DID;

					//Send request to the server
					controllerParent.$http.post(inspiniaNS.wsUrl + "message_send", $.param(params))
					//Successful request to the server
					.success(function(data, status, headers, config) {
						if (data == null || typeof data.apicode == 'undefined') {
							//This should never happen
							controllerParent.$scope.$broadcast("ErrorOnMessages", 'Unidentified error occurred when sending your message!');
							return;
						}
						if (data.apicode == 0) {
							//Reset form and inform user about success
							// controllerParent.$scope.$broadcast("SendingMessageSucceeded", data.apidata);
						} else {
							controllerParent.$scope.$broadcast("ErrorOnMessages", 'An error occurred when sending your message! Error code: ' + data.apicode);
						}
						successfullRequestsCount_++;

						if (totalNumberOfMessages_ == successfullRequestsCount_) {
							callback();

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
				$scope.DeleteMsg();
			});
			$scope.$on('MarkAsReadMessageSucceeded', function(event, args) {
				$scope.MarkAsReadMsg();
			});
			$scope.$on('MarkAsUnreadMessageSucceeded', function(event, args) {
				$scope.MarkAsUnreadMsg();
			});
			$scope.$on('RestoreToInboxMessageSucceeded', function(event, args) {
				$scope.RestoreToInboxMsg();
			});
			$scope.$on('ResendMessageSucceeded', function(event, args) {
				$scope.ResendMsg();
			});

			$scope.$on('ErrorOnMessages', function(event, args) {
				$scope.ErrorOnMsg(args);
			});

		}
	},
	InboxList : {
		getListAction : 'messages_inbound',
		getListStatus : 'U',
		statusChangeAction : 'message_changeinboundstatus',
		deleteMessageStatus : 'D',
		markAsReadMessageStatus : 'R',
		markAsUnreadMessageStatus : 'U',
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
			field : 'createdDate',
			displayName : 'Date',
		}, {
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
		radioModel : '',
		Events : {
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
			},
			ShowView : function(inParent) {
				inParent.list = false;
				inParent.view = true;
				inParent.add = false;
			},
			ShowAdd : function(inParent) {
				inParent.list = false;
				inParent.view = false;
				inParent.add = true;
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
		getListAction : 'messages_outbound',
		getListStatus : 'C',
		statusChangeAction : 'message_changeoutboundstatus',
		primaryKey : 'outboundMessageID',
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
		radioModel : '',
		Events : {
			Message_onClick : function(inParent, row) {
				inParent.clickedMessage = row.entity;
				inParent.list = false;
			},
			Send_onClick : function(inScope) {
				// delete clicked message
				inScope.controllerParent.list = true;
				inScope.controllerParent.radioModel = '';
			},
			ShowList : function(inParent) {
				inParent.list = true;
			},
			InitialiseEvents : function(controllerParent) {
			}
		},
		Controller : function($scope, $http, $cookieStore) {
			//Controler parrent setting !!!!
			var controllerParent = ngInbox.SentList;
			controllerParent.list = true;

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
				$sendScope.ToNumber = '';
				//$sendScope.controllerParent.clickedMessage.ANI;
				$sendScope.OptOutMsg = '';
				$sendScope.OptOutTxt3 = $sendScope.initial;
				$sendScope.MessageTxt = $sendScope.controllerParent.clickedMessage.message;
				$sendScope.ScheduleCheck = false;
				$sendScope.SetDate = new Date($sendScope.controllerParent.clickedMessage.scheduledDate.substring(0, 4), $sendScope.controllerParent.clickedMessage.scheduledDate.substring(5, 7), $sendScope.controllerParent.clickedMessage.scheduledDate.substring(8, 10));
				$sendScope.SetTimeHour = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(11, 13);
				$sendScope.SetTimeMinute = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(14, 16);
			} catch(e) {
				//TODO skloniti ovaj try-catch kada se odradi inicijalna clickedMessage
			}

		},
		PostSuccess : function(controllerParent, result) {
			ngInbox._internal.Methods.PostSuccess(controllerParent, result);
		}
	},
	ScheduledList : {
		getListAction : 'messages_outbound',
		getListStatus : 'S',
		statusChangeAction : null, //'message_changeoutboundstatus',
		primaryKey : 'outboundMessageID',
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
		view : true,
		send : false,
		Events : {
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
			},
			ShowView : function(inParent) {
				inParent.list = false;
				inParent.view = true;
				inParent.send = false;
			},
			ShowSend : function(inParent) {
				inParent.list = false;
				inParent.view = false;
				inParent.send = true;
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
				$sendScope.FromNumber = $.grep($sendScope.fromNumbers, function(member) {
				return member.DID == $sendScope.controllerParent.clickedMessage.DID;
				})[0];
				$sendScope.ToList = $.grep($sendScope.contactLists, function(member) {
				return member.contactListID == $sendScope.controllerParent.clickedMessage.contactListID;
				})[0];
				$sendScope.ToNumber = $sendScope.controllerParent.clickedMessage.ANI;
				$sendScope.ToNumber = $sendScope.ToNumber.replace(' ...', '');
				if ($sendScope.ToNumber.length > 10 && $sendScope.ToNumber[0] == '1') {
					$sendScope.ToNumber = $sendScope.ToNumber.substring(1);
				}
				$sendScope.OptOutMsg = '';
				$sendScope.OptOutTxt3 = $sendScope.initial;
				$sendScope.MessageTxt = $sendScope.controllerParent.clickedMessage.message;
				$sendScope.ScheduleCheck = true;
				$sendScope.SetDate = new Date($sendScope.controllerParent.clickedMessage.scheduledDate.substring(0, 4), $sendScope.controllerParent.clickedMessage.scheduledDate.substring(5, 7), $sendScope.controllerParent.clickedMessage.scheduledDate.substring(8, 10));
				$sendScope.SetTimeHour = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(11, 13);
				$sendScope.SetTimeMinute = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(14, 16);
			} catch(e) {
				//TODO skloniti ovaj try-catch kada se odradi inicijalna clickedMessage
			}

		},
		PostSuccess : function(controllerParent, result) {
			ngInbox._internal.Methods.PostSuccess(controllerParent, result);
		}
	},
	DraftsList : {
		getListAction : 'messages_outbound',
		getListStatus : 'D',
		statusChangeAction : null, //'message_changeoutboundstatus',
		primaryKey : 'outboundMessageID',
		columnDefs : [{
			field : 'message',
			displayName : 'Message',
			cellTemplate : 'views/table/MessageTableTemplate.html'
		}, {
			field : 'statusDate',
			displayName : 'Date & Time Saved',
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
		view : true,
		send : false,
		Events : {
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
			},
			ShowView : function(inParent) {
				inParent.list = false;
				inParent.view = true;
				inParent.send = false;
			},
			ShowSend : function(inParent) {
				inParent.list = false;
				inParent.view = false;
				inParent.send = true;
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
				$sendScope.ToNumber = $sendScope.controllerParent.clickedMessage.ANI;
				$sendScope.OptOutMsg = '';
				$sendScope.OptOutTxt3 = $sendScope.initial;
				$sendScope.MessageTxt = $sendScope.controllerParent.clickedMessage.message;
				$sendScope.ScheduleCheck = false;
				$sendScope.SetDate = new Date($sendScope.controllerParent.clickedMessage.scheduledDate.substring(0, 4), $sendScope.controllerParent.clickedMessage.scheduledDate.substring(5, 7), $sendScope.controllerParent.clickedMessage.scheduledDate.substring(8, 10));
				$sendScope.SetTimeHour = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(11, 13);
				$sendScope.SetTimeMinute = $sendScope.controllerParent.clickedMessage.scheduledDate.substring(14, 16);
			} catch(e) {
				//TODO skloniti ovaj try-catch kada se odradi inicijalna clickedMessage
			}

		},
		PostSuccess : function(controllerParent, result) {
			ngInbox._internal.Methods.PostSuccess(controllerParent, result);
		}
	},
	TrashList : {
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
		Events : {
			Message_onClick : function(inParent, row) {
				inParent.clickedMessage = row.entity;
				inParent.list = false;
			},
			Send_onClick : function(inScope) {
				// delete clicked message
				inScope.controllerParent.list = true;
			},
			InitialiseEvents : function(controllerParent) {
			}
		},
		Controller : function($scope, $http, $cookieStore) {
			//Controler parrent setting !!!!
			var controllerParent = ngInbox.TrashList;
			controllerParent.list = true;

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

