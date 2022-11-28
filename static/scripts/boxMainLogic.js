/*==================================
    
    Box System Logic Scripts
    By Daesup, Lee

	* Example:
		this.GetFunctionList = function (action, event, obj)
		{
			var columns = [
				{key:"globalUniqueFunctionIDint", label:"GUFID", sortable:false},
				{key:"serverType", label:"서버타입", sortable:false}
				//... more columns
			];
			
			this.GetFunctionInfo = function (selectedValues)
			{
			    var msgBox = new OPMsgBox ("steerGetFunctionInfo", 
			    							"steerGetFunctionInfo: " + selectedValues[0].globalUniqueFunctionIDint, 
			    							"Row Selected",
			    							{isFixedCenter: true,
			    							isDraggable: true,
			    							isClose: false,
			    							isModal: false
			             					});
			    msgBox.Show();
			}
			
			LoadCenter3PaneLayout();
			this.paginator = new OPPaginator("DataListPaginateSection", 20, true);
			new OPDataTable("getFunctionList", "/ajaxHandler?", columns, "DataListSection", this.GetFunctionInfo, null, this.paginator);	
		}
====================================*/

var _BoxMainLogic = function () {};
var BoxMainLogic = new _BoxMainLogic();

/////////////////////////////////
// Common Functions
/////////////////////////////////

_BoxMainLogic.prototype.BoxBaseFormatter = function(elTr, oRecord)
{
	// Do not change order
	oRecord.setData('serviceItemTagEnableFlag_hidden', oRecord.getData('serviceItemTagEnableFlag'));
	oRecord.setData('serviceItemTgEnableFlag', BoxGlobal.GetCodeText('enableFlag', oRecord.getData('serviceItemTagEnableFlag')));
	oRecord.setData('serviceItemEnableFlag_hidden', oRecord.getData('serviceItemEnableFlag'));
//	oRecord.setData('serviceItemEnableFlag', BoxGlobal.GetCodeText('enableFlag', oRecord.getData('serviceItemEnableFlag')));
	
	oRecord.setData('boxStateCode', BoxGlobal.GetCodeText('boxStateCode', oRecord.getData('boxStateCode')));
	oRecord.setData('createDateTime', CruiseGlobal.GetLocalTimeString(oRecord.getData('createDateTime')));
	
	oRecord.setData('serviceItemStartActivationDateTime_hidden', oRecord.getData('serviceItemStartActivationDateTime'));
	oRecord.setData('serviceItemStartActivationDateTime', CruiseGlobal.GetLocalTimeString(oRecord.getData('serviceItemStartActivationDateTime')));
	
	oRecord.setData('boxTemplateCreateDateTime_hidden', oRecord.getData('boxTemplateCreateDateTime'));
	oRecord.setData('boxTemplateCreateDateTime', CruiseGlobal.GetLocalTimeString(oRecord.getData('boxTemplateCreateDateTime')));
	
	oRecord.setData('boxTemplateStartActivationDateTime_hidden', oRecord.getData('boxTemplateStartActivationDateTime'));
	oRecord.setData('boxTemplateStartActivationDateTime', CruiseGlobal.GetLocalTimeString(oRecord.getData('boxTemplateStartActivationDateTime')));
	
	oRecord.setData('boxTemplateEndActivationDateTime_hidden', oRecord.getData('boxTemplateEndActivationDateTime'));
	oRecord.setData('boxTemplateEndActivationDateTime', CruiseGlobal.GetLocalTimeString(oRecord.getData('boxTemplateEndActivationDateTime')));
	
	oRecord.setData('serviceItemRegisterDateTime', CruiseGlobal.GetLocalTimeString(oRecord.getData('serviceItemRegisterDateTime')));
	
	oRecord.setData('serviceItemValidationRuleSN_show', BoxGlobal.GetCodeText('serviceItemValidationRuleSN', oRecord.getData('serviceItemValidationRuleSN')));
	oRecord.setData('serviceItemValidationValue_show', BoxGlobal.GetCodeText('serviceItemValidationValue', oRecord.getData('serviceItemValidationValue')));
	return true;
};

_BoxMainLogic.prototype.GetColumns = function(key)
{
	switch (key)
	{
		case "GetPageServiceItemTag":
			return [
					{key:"serviceItemTagSN", label:l10nMsg["col_serviceItemTagSN"], sortable:true},
					{key:"serviceItemTagName", label:l10nMsg["col_serviceItemTagName"], sortable:true, resizeable: true, width: 100},
					{key:"serviceItemTagDescription", label:l10nMsg["col_serviceItemTagDescription"], sortable:false, resizeable: true, width: 200},
					{key:"serviceItemValidationRuleSN", label:l10nMsg["col_serviceItemValidationRuleSN"], sortable:false},
					{key:"serviceItemTagEnableFlag", label:l10nMsg["col_serviceItemTagEnableFlag"], sortable:true},
					{key:"serviceItemTagEnableFlag_hidden", label:l10nMsg["col_serviceItemTagEnableFlag"], hidden: true},
				   ];
		case "ServiceItemTagForExport":
			return [{key:"serviceItemTagSN", label:l10nMsg["col_serviceItemTagSN"], sortable:true},
					{key:"serviceItemTagName", label:l10nMsg["col_serviceItemTagName"], sortable:true, resizeable: true, width: 100},
					{key:"serviceItemValidationRuleSN", label:l10nMsg["col_serviceItemValidationRuleSN"], sortable:false},
					{key:"serviceItemTagEnableFlag", label:l10nMsg["col_serviceItemTagEnableFlag"], sortable:true,
				     editor: new OPRadioCellEditor(null, [{label: "Enable", value: "1"},{label: "Disable", value: "0"}], null)}];
		case "GetPageServiceItemTagForAddItem":
			return [
					{key:"serviceItemTagSN", label:l10nMsg["col_serviceItemTagSN"], sortable:true},
					{key:"serviceItemTagName", label:l10nMsg["col_serviceItemTagName"], sortable:true, resizeable: true, width: 150},
					{key:"serviceItemTagDescription", label:l10nMsg["col_serviceItemTagDescription"], sortable:false, resizeable: true, width: 300},
					{key:"serviceItemValidationRuleSN_show", label:l10nMsg["col_serviceItemValidationRuleSN"], sortable:false, width: 150},
					{key:"serviceItemValidationRuleSN", label:l10nMsg["col_serviceItemValidationRuleSN"], sortable:false, width: 70, hidden: true},  
				   ];
		case "GetServiceItemTagForAddItemSelection":
			return [
					{key:"serviceItemTagSN", label:l10nMsg["col_serviceItemTagSN"], sortable:false},
					{key:"serviceItemTagName", label:l10nMsg["col_serviceItemTagName"], sortable:false, resizeable: false, width: 100},
					{key:"serviceItemTagDescription", label:l10nMsg["col_serviceItemTagDescription"], sortable:false, resizeable: false, width: 200},
					{key:"serviceItemValidationRuleSN_show", label:l10nMsg["col_serviceItemValidationRuleSN"], sortable:false},
					{key:"serviceItemValidationRuleSN", label:l10nMsg["col_serviceItemValidationRuleSN"], sortable:false, hidden:true, resizeable: false},
					{key:"serviceItemValidationValue", label:l10nMsg["col_serviceItemValidationValue"], sortable:false,
						editor : new OPTextboxCellEditor(function(value){ return BoxMainLogic.ServiceItemValidateRuleValue(value, this.wrapper.GetSelectedRows());},
								{LABEL_SAVE : l10nMsg["text_09"], LABEL_CANCEL : l10nMsg["text_10"]})}
				   ];
		case "GetPageBoxTag":
			return [{key:"boxTagSN", label:l10nMsg["col_boxTagSN"], sortable:true},
			        {key:"boxTagName", label:l10nMsg["col_boxTagName"], sortable:true, resizeable:true, width: 200},
			        {key:"boxTagDescription", label:l10nMsg["col_boxTagDescription"], sortable:true, resizeable:true, width: 300},
			        {key:"boxTagEnableFlag", label:l10nMsg["col_boxTagEnableFlag"], sortable:true}];
		case "BoxTagForExport":
			return [{key:"boxTagSN", label:l10nMsg["col_boxTagSN"], sortable:true},
			        {key:"boxTagName", label:l10nMsg["col_boxTagName"], sortable:true, resizeable:true, width: 200},
			        {key:"boxTagEnableFlag", label:l10nMsg["col_boxTagEnableFlag"], sortable:true,
			         editor: new OPRadioCellEditor(null, [{label: "Enable", value: "1"},{label: "Disable", value: "0"}], null)}];
		case "GetPageServiceItem":
			return [{key:"serviceItemSN", label:l10nMsg["col_serviceItemSN"], sortable:true},
			        {key:"serviceItemServiceSN", label:l10nMsg["col_serviceItemServiceSN"], sortable:true, resizeable: true},
			        {key:"serviceItemMappingItemSN", label:l10nMsg["col_serviceItemMappingItemSN"], sortable:true, resizeable: true},
			        {key:"serviceItemEnableFlag", label:l10nMsg["col_serviceItemEnableFlag"], sortable:true, resizeable: true},
			        {key:"serviceItemStartActivationDateTime", label:l10nMsg["col_serviceItemStartActivationDateTime"], sortable:true, resizeable: true, width: 150},
			        {key:"serviceItemName", label:l10nMsg["col_serviceItemName"], sortable:true, resizeable: true, width: 200},
			        {key:"serviceItemDescription", label:l10nMsg["col_serviceItemDescription"], sortable:false, resizeable: true, width: 300},
			        {key:"serviceItemEnableFlag_hidden", label:l10nMsg["col_serviceItemEnableFlag"], hidden: true},
					{key:"serviceItemStartActivationDateTime_hidden", label:l10nMsg["col_serviceItemStartActivationDateTime"], hidden: true}];
		case "ServiceItemForExport":
			return [{key:"serviceItemSN", label:l10nMsg["col_serviceItemSN"], sortable:true},
			        {key:"serviceItemMappingItemSN", label:l10nMsg["col_serviceItemMappingItemSN"], sortable:true, resizeable: true},
			        {key:"serviceItemName", label:l10nMsg["col_serviceItemName"], sortable:true, resizeable: true, width: 200},
			        {key:"serviceItemEnableFlag", label:l10nMsg["col_serviceItemEnableFlag"], sortable:true, resizeable: true,
				     editor: new OPRadioCellEditor(null, [{label: "Enable", value: "1"},{label: "Disable", value: "0"}], null)}];
		case "GetPageBox":
			return [{key:"boxSN", label:l10nMsg["col_boxSN"], sortable:true},
			        {key:"receiverServiceSN", label:l10nMsg["col_receiverServiceSN"], resizeable: true},
			        {key:"receiverUserSN", label:l10nMsg["col_receiverUserSN"], sortable:true, resizeable: true},
			        {key:"receiverGUSID", label:l10nMsg["col_receiverGUSID"], sortable:true, resizeable: true},
			        {key:"receiverCharacterSN", label:l10nMsg["col_receiverCharacterSN"], sortable:true, resizeable: true},
			        {key:"boxStateCode", label:l10nMsg["col_boxStateCode"], sortable:true, resizeable: true},
			        {key:"createDateTime", label:l10nMsg["col_createDateTime"], sortable:true, resizeable: true}];
		case "BoxTagDataTable":
			return [{key: "boxTagName", label: l10nMsg["col_boxTagName"], sortable: false},
			        {key: "boxTagValue", label: l10nMsg["col_boxTagValue"], sortable: false}];
		case "ServiceItemDataTable":
			return [{key: "mappingItemSN", label: l10nMsg["col_mappingItemSN"], sortable: false},
			        {key: "serviceItemTagName", label: l10nMsg["col_serviceItemTagName"], sortable: false},
			        {key: "serviceItemTagValue", label: l10nMsg["col_serviceItemTagValue"], sortable: false}];
		case "BoxItemDataTable":
			return [{key: "boxItemSN", label: l10nMsg["col_boxItemSN"], sortable: false},
			        {key: "mappingItemSN", label: l10nMsg["col_mappingItemSN"], sortable: false},
			        {key: "internalItemKey", label: l10nMsg["col_internalItemKey"], sortable: false}];
		case "ServiceItemTagDataTable":
			return [{key:"serviceItemTagSN", label:l10nMsg["col_serviceItemTagSN"], sortable:false},
			        {key:"serviceItemTagName", label:l10nMsg["col_serviceItemTagName"], sortable:true, resizeable: true, width: 100},
					{key:"serviceItemTagDescription", label:l10nMsg["col_serviceItemTagDescription"], sortable:false, resizeable: false, width: 200},
					{key:"serviceItemValidationRuleSN", label:l10nMsg["col_serviceItemValidationRuleSN"], sortable:false}, 
					{key:"serviceItemValidationValue", label:l10nMsg["col_serviceItemValidationValue"], sortable:false}
			        ];
		case "GetServiceItemForAddBoxSelection":
			return [{key:"serviceItemMappingItemSN", label:l10nMsg["col_serviceItemMappingItemSN"], sortable:true, resizeable: true},
			        {key:"serviceItemStartActivationDateTime", label:l10nMsg["col_serviceItemStartActivationDateTime"], sortable:true, resizeable: true},
			        {key:"serviceItemTagName", label:l10nMsg["col_serviceItemTagName"], sortable:true, resizeable: true},
			        {key:"serviceItemValidationValue_show", label:l10nMsg["col_serviceItemValidationValue"], sortable:false},
			        {key:"serviceItemValidationValue", label:l10nMsg["col_serviceItemValidationValue"], sortable:false, hidden: true},
			        {key:"serviceItemTagValue", label:l10nMsg["col_serviceItemTagValue"], sortable:false,
						editor : new OPTextboxCellEditor(function(value){ return BoxMainLogic.ServiceItemTagValidateValue(value, this.wrapper.GetSelectedRows());},
								{LABEL_SAVE : l10nMsg["text_09"], LABEL_CANCEL : l10nMsg["text_10"]})}
			        ];
		case "GetPageServiceItemForAddBox":
			return [{key:"serviceItemSN", label:l10nMsg["col_serviceItemSN"], sortable:true},
			        {key:"serviceItemMappingItemSN", label:l10nMsg["col_serviceItemMappingItemSN"], sortable:true, resizeable: false},
			        {key:"serviceItemStartActivationDateTime", label:l10nMsg["col_serviceItemStartActivationDateTime"], sortable:true, resizeable: false},
			        {key:"serviceItemRegisterUserSN", label:l10nMsg["col_serviceItemRegisterUserSN"], sortable:true, resizeable: false},
			        {key:"serviceItemRegisterDateTime", label:l10nMsg["col_serviceItemRegisterDateTime"], sortable:true, resizeable: false}
			        ];
		case "GetPageBoxTagForAddBox":
			return [{key:"boxTagSN", label:l10nMsg["col_boxTagSN"], sortable:true},
			        {key:"boxTagName", label:l10nMsg["col_boxTagName"], sortable:true, resizeable:true, width:200},
			        {key:"boxTagDescription", label:l10nMsg["col_boxTagDescription"], sortable:true, resizeable:true, width:400}];
		case "GetBoxTagForAddBoxSelection":
			return [
					{key:"boxTagSN", label:l10nMsg["col_boxTagSN"], sortable:true},
			        {key:"boxTagName", label:l10nMsg["col_boxTagName"], sortable:true, resizeable:true, width:100},
			        {key:"boxTagDescription", label:l10nMsg["col_boxTagDescription"], sortable:true, resizeable:true, width:200},  
					{key:"boxTagValue", label:l10nMsg["col_boxTagValue"], sortable:false,
						editor : new OPTextboxCellEditor(function(value){ return BoxMainLogic.BoxTagValidateValue(value, this.wrapper.GetSelectedRows());},
								{LABEL_SAVE : l10nMsg["text_09"], LABEL_CANCEL : l10nMsg["text_10"]})}
				   ];
		case "GetPageBoxTemplate":
			return [{key:"boxTemplateSN", label:l10nMsg["col_boxTemplateSN"], sortable:true},
			        {key:"boxTemplateTitle", label:l10nMsg["col_boxTemplateTitle"], sortable:true, resizeable: true},
			        {key:"boxTemplateCreateUserSN", label:l10nMsg["col_boxTemplateCreateUserSN"], sortable:true, resizeable: true},
			        {key:"boxTemplateCreateDateTime", label:l10nMsg["col_boxTemplateCreateDateTime"], sortable:true, resizeable: true, width: 150},
			        {key:"boxTemplateStartActivationDateTime", label:l10nMsg["col_boxTemplateStartActivationDateTime"], sortable:true, resizeable: true, width: 150},
					{key:"boxTemplateEndActivationDateTime", label:l10nMsg["col_boxTemplateEndActivationDateTime"], sortable:true, resizeable: true, width: 150},
					{key:"boxTemplateEnableFlag", label:l10nMsg["col_boxTemplateEnableFlag"], sortable:true, resizeable: true, width: 150},
			        {key:"boxTemplateCreateDateTime_hidden", label:l10nMsg["col_boxTemplateCreateDateTime"], hidden: true},
			        {key:"boxTemplateStartActivationDateTime_hidden", label:l10nMsg["col_boxTemplateStartActivationDateTime"], hidden: true},
					{key:"boxTemplateEndActivationDateTime_hidden", label:l10nMsg["col_boxTemplateEndActivationDateTime"], hidden: true}];
		case "BoxTemplateForExport":
			return [{key:"boxTemplateSN", label:l10nMsg["col_boxTemplateSN"], sortable:true},
			        {key:"boxTemplateTitle", label:l10nMsg["col_boxTemplateTitle"], sortable:true, resizeable: true},
					{key:"boxTemplateEnableFlag", label:l10nMsg["col_boxTemplateEnableFlag"], sortable:true, resizeable:true,
					 editor: new OPRadioCellEditor(null, [{label: "Enable", value: "1"},{label: "Disable", value: "0"}], null)}];
		case "GetPageExportHistory":
			return [{key:"exportHistorySN", label:l10nMsg["col_exportHistorySN"], sortable:true},
			        {key:"exportHistoryName", label:l10nMsg["col_exportHistoryName"], sortable:true, resizeable: true},
			        {key:"createDateTime", label:l10nMsg["col_boxTemplateCreateDateTime"], sortable:true, resizeable: true, width: 150},
			        {key:"createUserSN", label:l10nMsg["col_createUserSN"], sortable:true, resizeable: true, width: 150}];
	}
};

_BoxMainLogic.prototype.CreateBoxDatatable = function(id, request, columnKey, container, configs, keyColumnIdx, refreshInterval)
{
	var columns = BoxMainLogic.GetColumns(columnKey);
	configs.returnCodeValidator = function (msg){
												if (!BoxGlobal.ValidateResponse(msg)){
													BoxGlobal.BoxPageResourceMan.Remove(id + "_" + container + "_Interval");
													return false;
												}
												return true;
											};

    var dt = new OPDataTable(id, request, columns, container, configs);
						
	dt.SetKeyColumn(columns[keyColumnIdx].key);
	BoxGlobal.BoxPageResourceMan.Add(id + "_" + container, dt);
	
	if (refreshInterval)
	{
		CruiseTimer.AddInterval(id + "_" + container, function () { dt.Refresh(); }, refreshInterval);
		BoxGlobal.BoxPageResourceMan.Add(id + "_" + container + "_Interval", CruiseTimer.GetDestroyInterface(id + "_" + container) );
	}
	return dt;
};

/////////////////////////////////
// Logic Functions
/////////////////////////////////

_BoxMainLogic.prototype.GetPageServiceItemTag = function (action, event, obj)
{
	//Initalize & Draw
	
	var SearchButtonClick = function (objs)
	{
		//Validation
		var addRequestVal = '';
		if (objs)
		{
			addRequestVal += "&enableFlag=" + objs.enableFlag;
			if (objs.tagName != null && objs.tagName != '')
				addRequestVal += "&serviceItemTagName=" + objs.tagName;
		}
		else
			addRequestVal = '&enableFlag=1';
		
		if (viewBoxDT)
			BoxGlobal.BoxPageResourceMan.Remove("GetPageServiceItemTag_DataListSection");
		
		return BoxMainLogic.CreateBoxDatatable("GetPageServiceItemTag",
												"getPageServiceItemTag?",
												"GetPageServiceItemTag",
												"DataListSection",
												{ selectCallbackFn : BoxItemTagHandler.ISelectedDataTable, 
													addRequestParamFn : function () { return addRequestVal; },
													paginator : new OPPaginator("DataListPaginateSection", BoxGlobal.IndividualData.BoxDatatablePageSize, true, BoxGlobal.DefaultPaginatorConfig()), 
													l10nObj : l10nMsg,
													formatRow : BoxMainLogic.BoxBaseFormatter,
													sortColumn : "serviceItemTagSN",
													sortDir : "asc",
													selectionMode : "single"},
												0);
	};
	
	BoxLayout.LoadTagListLayout(SearchButtonClick, { paneCode : 1 });
	var viewBoxDT = SearchButtonClick ();
	BoxItemTagHandler.SetOPTable(viewBoxDT);
	BoxLayout.LoadLeftCenterLayout(null, [viewBoxDT]);
};

_BoxMainLogic.prototype.AddServiceItemTag = function (action, event, obj)
{
	//Confirm Button callback
	var btnConfirm_Callback = function (event, objs) {
		newServiceItemTagName = CruiseGlobal.GetElementValue("inputServiceItemTagName");
		newServiceItemTagDescription = CruiseGlobal.GetElementValue("inputServiceItemTagDescription");
		newServiceItemValidationRuleSN = CruiseGlobal.GetElementValue("inputServiceItemValidationRuleSN");
		
		if (!CruiseValidation.HasValue(newServiceItemTagName))
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_18"], l10nMsg["text_09"], "inputServiceItemTagName");
			return;
		}
		if (!CruiseValidation.HasValue(newServiceItemTagDescription))
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_18"], l10nMsg["text_09"], "inputServiceItemTagDescription");
			return;
		}
		if (!CruiseValidation.HasValue(newServiceItemValidationRuleSN))
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_18"], l10nMsg["text_09"], "inputServiceItemValidationRuleSN");
			return;
		}
		if (CruiseValidation.IsNumber(newServiceItemValidationRuleSN)){
			if (Number(newServiceItemValidationRuleSN) <= 0 || Number(newServiceItemValidationRuleSN) >= 3 ){
				CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_94"], l10nMsg["text_09"], "inputServiceItemValidationRuleSN");
				return;
			}
		}
		else{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["col_serviceItemValidationRuleSN"] + l10nMsg["msg_23"], l10nMsg["text_09"], "inputServiceItemValidationRuleSN");
			return;
		}
		
	    var CreateProcess = function (){
			var _callback = function(o, messages) {
				if (BoxItemTagHandler.objParentOPTable != null)
					BoxItemTagHandler.objParentOPTable.Refresh();
				if (!BoxGlobal.ValidateResponse(messages)) return;
				CruiseGlobal.SHOWINFO (l10nMsg["text_23"], messages.newServiceItemTagSN + l10nMsg["msg_22"], l10nMsg["text_09"]);
			};
			OPAjaxRequest("POST", "createItemTag", _callback, "serviceItemTagName=" + CruiseGlobal.ReplaceToSpecialChar(newServiceItemTagName)
															+ "&serviceItemTagDescription=" + CruiseGlobal.ReplaceToSpecialChar(newServiceItemTagDescription)
															+ "&serviceItemValidationRuleSN=" + newServiceItemValidationRuleSN);
			this.hide();
			BoxGlobal.ShowLoading();
	    };
	    
	    var qstBox = new OPMsgBox ("ConfirmCreate", 
	    							l10nMsg["msg_47"],
	    							l10nMsg["text_23"],
	    							{isFixedCenter: true,
	    							isDraggable: false,
	    							isClose: true,
	    							isModal: true,
	    							width: 300
	             					});
	    qstBox.SetICON("warn");
	    qstBox.SetButtons([{ text:l10nMsg["text_23"], handler:CreateProcess, isDefault:true }, { text:l10nMsg["text_10"],  handler: function () {this.hide();} }]);
	    qstBox.Show();
	    return;
	};
	
	BoxLayout.LoadCreateItemTagLayout(btnConfirm_Callback);
};

_BoxMainLogic.prototype.GetPageBoxTag = function (action, event, obj)
{
	//Initalize & Draw
	
	var SearchButtonClick = function (objs)
	{
		//Validation
		var addRequestVal = '';
		if (objs)
		{
			addRequestVal += "&enableFlag=" + objs.enableFlag;
			if (objs.tagName != null && objs.tagName != '')
				addRequestVal += "&boxTagName=" + objs.tagName;
		}
		else
			addRequestVal = '&enableFlag=1';
		
		if (viewBoxDT)
			BoxGlobal.BoxPageResourceMan.Remove("GetPageBoxTag_DataListSection");
		
		return BoxMainLogic.CreateBoxDatatable("GetPageBoxTag",
												"getPageBoxTag?",
												"GetPageBoxTag",
												"DataListSection",
												{ selectCallbackFn : BoxTagHandler.ISelectedDataTable, 
													addRequestParamFn : function () { return addRequestVal; },
													paginator : new OPPaginator("DataListPaginateSection", BoxGlobal.IndividualData.BoxDatatablePageSize, true, BoxGlobal.DefaultPaginatorConfig()), 
													l10nObj : l10nMsg,
													formatRow : BoxMainLogic.BoxBaseFormatter,
													sortColumn : "boxTagSN",
													sortDir : "asc",
													selectionMode : "single"},
												0);
	};
	
	BoxLayout.LoadTagListLayout(SearchButtonClick, { paneCode : 4 });
	var viewBoxDT = SearchButtonClick ();
	BoxTagHandler.SetOPTable(viewBoxDT);
	BoxLayout.LoadLeftCenterLayout(null, [viewBoxDT]);
};

_BoxMainLogic.prototype.AddBoxTag = function (action, event, obj)
{
	//Confirm Button callback
	var btnConfirm_Callback = function (event, objs) {
		newBoxTagName = CruiseGlobal.GetElementValue("inputBoxTagName");
		newBoxTagDescription = CruiseGlobal.GetElementValue("inputBoxTagDescription");
		
		if (!CruiseValidation.HasValue(newBoxTagName))
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_18"], l10nMsg["text_09"], "inputBoxTagName");
			return;
		}
		if (!CruiseValidation.HasValue(newBoxTagDescription))
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_18"], l10nMsg["text_09"], "inputBoxTagDescription");
			return;
		}
		
	    var CreateProcess = function (){
			var _callback = function(o, messages) {
				if (BoxTagHandler.objParentOPTable != null)
					BoxTagHandler.objParentOPTable.Refresh();
				if (!BoxGlobal.ValidateResponse(messages)) return;
				CruiseGlobal.SHOWINFO (l10nMsg["text_23"], messages.newBoxTagSN + l10nMsg["msg_28"], l10nMsg["text_09"]);
			};
			OPAjaxRequest("POST", "createBoxTag", _callback, "boxTagName=" + CruiseGlobal.ReplaceToSpecialChar(newBoxTagName)
															+ "&boxTagDescription=" + CruiseGlobal.ReplaceToSpecialChar(newBoxTagDescription));
			this.hide();
			BoxGlobal.ShowLoading();
	    };
	    
	    var qstBox = new OPMsgBox ("ConfirmCreate", 
	    							l10nMsg["msg_48"],
	    							l10nMsg["text_23"],
	    							{isFixedCenter: true,
	    							isDraggable: false,
	    							isClose: true,
	    							isModal: true,
	    							width: 300
	             					});
	    qstBox.SetICON("warn");
	    qstBox.SetButtons([{ text:l10nMsg["text_23"], handler:CreateProcess, isDefault:true }, { text:l10nMsg["text_10"],  handler: function () {this.hide();} }]);
	    qstBox.Show();
	    return;
	};
	
	BoxLayout.LoadCreateBoxTagLayout(btnConfirm_Callback);
};

_BoxMainLogic.prototype.GetPageServiceItem = function (action, event, obj)
{
	//Initalize & Draw
	
	var SearchButtonClick = function (objs)
	{
		//Validation	
//		if (objs && CruiseValidation.HasValue(objs.searchText))
//		{
//			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_52"], l10nMsg["text_09"], "SearchText");
//			return;
//		}
		var addRequestVal = '';
		if (objs)
		{			
			addRequestVal += "&enableFlag=" + objs.enableFlag;
			if (objs.searchText != null && objs.searchText != '')
				addRequestVal += "&searchText=" + objs.searchText;
		}
		else
			addRequestVal = '&enableFlag=1';
		
		if (viewBoxDT)
			BoxGlobal.BoxPageResourceMan.Remove("GetPageServiceItem_DataListSection");
		
		return BoxMainLogic.CreateBoxDatatable("GetPageServiceItem",
												"getPageServiceItem?",
												"GetPageServiceItem",
												"DataListSection",
												{ selectCallbackFn : ServiceItemHandler.ISelectedDataTable, 
													addRequestParamFn : function () { return addRequestVal; },
													paginator : new OPPaginator("DataListPaginateSection", BoxGlobal.IndividualData.BoxDatatablePageSize, true, BoxGlobal.DefaultPaginatorConfig()), 
													l10nObj : l10nMsg,
													formatRow : BoxMainLogic.BoxBaseFormatter,
													sortColumn : "serviceItemSN",
													sortDir : "desc",
													selectionMode : "single"},
												0);
	};
	
	BoxLayout.LoadServiceItemListLayout(SearchButtonClick, { paneCode : 7 });
	var viewBoxDT = SearchButtonClick ();
	ServiceItemHandler.SetOPTable(viewBoxDT);
	BoxLayout.LoadLeftCenterLayout(null, [viewBoxDT]);
};

_BoxMainLogic.prototype.GetPageBox = function (action, event, obj)
{
	//Initalize & Draw
	
	var SearchButtonClick = function (objs)
	{
		//Validation
		var addRequestVal = '';
		if (objs) {
			addRequestVal += "&boxStateSearchCode=" + objs.boxStateSearchCode;
			if (objs.receiverUserSN != null && objs.receiverUserSN != '') {
				addRequestVal += "&receiverUserSN=" + objs.receiverUserSN;
				if (objs.receiverGUSID != null && objs.receiverGUSID != '') {
					addRequestVal += "&receiverGUSID=" + objs.receiverGUSID;
					if (objs.receiverCharacterSN != null && objs.receiverCharacterSN != '') {
						addRequestVal += "&receiverCharacterSN=" + objs.receiverCharacterSN;
					}
				}
			}
		}
		
		BoxGlobal.BoxPageResourceMan.Remove("GetPageBox_DataListSection");
		var viewBoxDT = BoxMainLogic.CreateBoxDatatable("GetPageBox",
														"getPageBox?",
														"GetPageBox",
														"DataListSection",
														{ selectCallbackFn : BoxHandler.ISelectedDataTable, 
															addRequestParamFn : function () { return addRequestVal; },
															paginator : new OPPaginator("DataListPaginateSection", BoxGlobal.IndividualData.BoxDatatablePageSize, true, BoxGlobal.DefaultPaginatorConfig()), 
															selectionMode : null, 
															l10nObj : l10nMsg,
															formatRow : BoxMainLogic.BoxBaseFormatter,
															sortColumn : "boxSN",
															sortDir : "asc",
															selectionMode : "single"},
														0);
		BoxHandler.SetOPTable(viewBoxDT);
	};
	BoxLayout.LoadBoxListLayout(SearchButtonClick, { paneCode : 9 });
	BoxLayout.LoadLeftCenterLayout(null, null);
};

_BoxMainLogic.prototype.AddServiceItem = function (action, event, obj)
{
	//Confirm Button callback
	var btnConfirm_Callback = function (event, objs) {

		if (!CruiseValidation.HasValue(objs.itemMappingSN))
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_32"], l10nMsg["text_09"], "inputServiceItemTagName");
			return;
		}
		if (!CruiseValidation.IsNumber(objs.itemMappingSN))
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["col_serviceItemMappingItemSN"] + l10nMsg["msg_23"], l10nMsg["text_09"], "inputServiceItemMappingItemSN");
			return;
		}
		var startActivationTime = CruiseGlobal.ToUTCString(objs.startActivationTime);

		if (!CruiseValidation.IsDate(objs.startActivationTime))
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_91"], l10nMsg["text_09"]);
			return;
		}
		
		var tagDataArrayStr = objs.tagData.length;
		for (var i = 0; i < objs.tagData.length; i++){
			tagDataArrayStr += "," + objs.tagData[i].serviceItemTagSN;
			
			if (!CruiseValidation.HasValue( objs.tagData[i].serviceItemValidationValue))
			{
				CruiseGlobal.SHOWINFO (l10nMsg["text_22"], objs.tagData[i].serviceItemTagSN + l10nMsg["msg_34"], l10nMsg["text_09"]);
				return;
			}
			tagDataArrayStr += "," + objs.tagData[i].serviceItemValidationValue;
		}
		
		var CreateProcess = function (){
			var _callback = function(o, messages) {
				if (ServiceItemHandler.objParentOPTable != null)
					ServiceItemHandler.objParentOPTable.Refresh();
				if (!BoxGlobal.ValidateResponse(messages)) return;
				
				CruiseGlobal.SHOWINFO (l10nMsg["text_23"], messages.newServiceItemSN + l10nMsg["msg_33"], l10nMsg["text_09"]);
			}
			
			OPAjaxRequest("POST", "createServiceItem", _callback, "itemMappingSN=" + objs.itemMappingSN
															+ "&serviceSN=" + objs.serviceSN
															+ "&startActivationTime=" + objs.startActivationTime
															+ "&enableFlag=" + objs.enableFlag
															+ "&itemName=" + objs.itemName
															+ "&itemDescription=" + objs.itemDescription
															+ "&tagData=" + tagDataArrayStr
															);
			this.hide();
			BoxGlobal.ShowLoading();
	    };
		
		var CheckExistingMappingItem = function() {
			var _callback = function(o, messages) {
				if (messages.records.length > 0) {
					var qstBox = new OPMsgBox ("ConfirmCreate", 
												l10nMsg["msg_99"],
												l10nMsg["text_23"],
												{isFixedCenter: true,
												isDraggable: false,
												isClose: true,
												isModal: true,
												width: 300
					         					});
					qstBox.SetICON("warn");
					qstBox.SetButtons([{ text:l10nMsg["text_09"], handler:CreateProcess, isDefault:true }, { text:l10nMsg["text_10"],  handler: function () {this.hide();} }]);
					qstBox.Show();
				}
				else {
					var qstBox = new OPMsgBox ("ConfirmCreate", 
												l10nMsg["msg_35"],
												l10nMsg["text_23"],
												{isFixedCenter: true,
												isDraggable: false,
												isClose: true,
												isModal: true,
												width: 300
						     					});
						qstBox.SetICON("warn");
						qstBox.SetButtons([{ text:l10nMsg["text_09"], handler:CreateProcess, isDefault:true }, { text:l10nMsg["text_10"],  handler: function () {this.hide();} }]);
						qstBox.Show();
				}
			}
			
			OPAjaxRequest("POST", "getPageServiceItem", _callback, "key=1&startIndex=0&results=100&sort=serviceItemSN&dir=asc&enableFlag=1&searchText=" + objs.itemMappingSN);
		}
		
		CheckExistingMappingItem();
	};
	
	BoxLayout.LoadCreateServiceItemLayout(btnConfirm_Callback, { paneCode : 11 });
};

// This function is called from LoadCreateServiceItemLayout in boxMainLayout.js
_BoxMainLogic.prototype.GetPageServiceItemTagForAddItem = function (tagName)
{
	addRequestVal = '&enableFlag=1';
	if (tagName != null && tagName != '')
		addRequestVal += "&serviceItemTagName=" + tagName;
	
	BoxGlobal.BoxPageResourceMan.Remove("GetPageServiceItemTagForAddItem_ItemTagSearchDatatableDIV");
	
	return BoxMainLogic.CreateBoxDatatable("GetPageServiceItemTagForAddItem",
											"getPageServiceItemTag?",
											"GetPageServiceItemTagForAddItem",
											"ItemTagSearchDatatableDIV",
											{	addRequestParamFn : function () { return addRequestVal; },
												paginator : new OPPaginator("ItemTagDataListPaginateSection", BoxGlobal.IndividualData.BoxDatatablePageSize, true, BoxGlobal.DefaultPaginatorConfig()), 
												l10nObj : l10nMsg,
												formatRow : BoxMainLogic.BoxBaseFormatter,
												sortColumn : "serviceItemTagSN",
												sortDir : "asc",
												selectionMode : "multi"},
											0);
};

_BoxMainLogic.prototype.ServiceItemValidateRuleValue = function (value, objSelectedRows){
	if (Number(objSelectedRows[0]["serviceItemValidationRuleSN"]) == 1){
		if (!CruiseValidation.IsNumber(value) || Number(value) < 0 || Number(value) > 2147483647){
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_96"], l10nMsg["text_09"]);
			return;
		}
	}else if (Number(objSelectedRows[0]["serviceItemValidationRuleSN"]) == 2){
		if (!CruiseValidation.MaxLength(value, 255)){
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_97"], l10nMsg["text_09"]);
			return;
		}
	}else{
		CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_98"], l10nMsg["text_09"]);
		return;
	}
	return value;
}

_BoxMainLogic.prototype.CreateBox = function (action, event, obj)
{
	//Confirm Button callback
	var btnConfirm_Callback = function (event, objs) {
		if (!CruiseValidation.HasValue(objs.receiverUserSN))
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_40"], l10nMsg["text_09"], "inputReceiverUserSN");
			return;
		}
		if (!CruiseValidation.IsNumber(objs.receiverUserSN))
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["col_receiverUserSN"] + l10nMsg["msg_23"], l10nMsg["text_09"], "inputReceiverUserSN");
			return;
		}
		if (objs.receiverGUSID != null && objs.receiverGUSID.length > 0){
			if (!CruiseValidation.IsNumber(objs.receiverGUSID))
			{
				CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["col_receiverGUSID"] + l10nMsg["msg_23"], l10nMsg["text_09"], "inputReceiverGUSID");
				return;
			}
		}
		if (objs.receiverCharacterSN != null && objs.receiverCharacterSN.length > 0){
			if (!CruiseValidation.IsNumber(objs.receiverCharacterSN))
			{
				CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["col_receiverCharacterSN"] + l10nMsg["msg_23"], l10nMsg["text_09"], "inputReceiverCharacterSN");
				return;
			}
		}
		
		// Start/End Activation Validation
		var startDate = new Date(objs.startActivationTime);
		var endDate = new Date(objs.endActivationTime);
		
		if (!CruiseValidation.IsDate(objs.startActivationTime, "/") || !CruiseValidation.IsDate(objs.endActivationTime, "/"))
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_91"], l10nMsg["text_09"]);
			return;
		}
		
		if (startDate >= endDate){
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_41"], l10nMsg["text_09"], "inputReceiverUserSN");
			return;
		}
		
		startDate = CruiseGlobal.ToUTCString(objs.startActivationTime);
		endDate = CruiseGlobal.ToUTCString(objs.endActivationTime);
		
		if (objs.usableTimeAfterOpen != null && objs.usableTimeAfterOpen.length > 0){
			if (!CruiseValidation.IsNumber(objs.usableTimeAfterOpen))
			{
				CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["col_activateDurationAfterOpen"] + l10nMsg["msg_23"], l10nMsg["text_09"], "InputUsableTimeAfterOpen");
				return;
			}
		}
		
		// Item Data
		if (objs.itemData == null || objs.itemData.length <= 0){
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_42"], l10nMsg["text_09"]);
			return;
		}
		
		// Normalize Item Data
		var normItemData = new Array();
		var lenItemData = objs.itemData.length;
		for (var i = 0; i < lenItemData; i++){
			var isFound = false;
			var popData = objs.itemData[i];
			for (var j = 0; j < normItemData.length; j++){
				if (parseInt(normItemData[j].serviceItemSN) == parseInt(popData.serviceItemSN)){
					if (normItemData[j].serviceItemTag == null)
						normItemData[j].serviceItemTag = new Array();
					
					if (popData.serviceItemTagSN != "-" && !popData.serviceItemTagValue != "-")
						normItemData[j].serviceItemTag.push({serviceItemTagSN : popData.serviceItemTagSN, 
																serviceItemTagValue : popData.serviceItemTagValue,
																serviceItemTagName : popData.serviceItemTagName})
					isFound = true;
				}
			}
			if (!isFound){
				var normNewData = {serviceItemSN : popData.serviceItemSN, externalItemKey : popData.serviceItemMappingItemSN, serviceItemTag : new Array()};
				if (popData.serviceItemTagSN != "-" && !popData.serviceItemTagValue != "-"){
					normNewData.serviceItemTag = [{serviceItemTagSN : popData.serviceItemTagSN,
													serviceItemTagValue : popData.serviceItemTagValue,
													serviceItemTagName : popData.serviceItemTagName}];					
				}
				normItemData.push(normNewData);
			}
		}
		
		// Item Validation
		for (var i = 0; i < normItemData.length; i++){
			for (j = 0; j < normItemData[i].serviceItemTag.length; j++){
				if (!CruiseValidation.HasValue(normItemData[i].serviceItemTag[j].serviceItemTagValue))
				{
					CruiseGlobal.SHOWINFO (l10nMsg["text_22"], normItemData[i].serviceItemTag[j].serviceItemTagName + l10nMsg["msg_44"], l10nMsg["text_09"]);
					return;
				}
			}
		}
		
		// Box Tag Validation
		for (var i = 0; i < objs.boxTagData.length; i++){
			if (!CruiseValidation.HasValue( objs.boxTagData[i].boxTagValue))
			{
				CruiseGlobal.SHOWINFO (l10nMsg["text_22"], objs.boxTagData[i].boxTagSN + l10nMsg["msg_43"], l10nMsg["text_09"]);
				return;
			}
		}

	    var CreateProcess = function (){
			var _callback = function(o, messages) {
				if (BoxHandler.objParentOPTable != null)
					BoxHandler.objParentOPTable.Refresh();
				if (!BoxGlobal.ValidateResponse(messages)) return;
				CruiseGlobal.SHOWINFO (l10nMsg["text_34"], messages.newBoxSN + l10nMsg["msg_46"], l10nMsg["text_09"]);
				
				//Initialize Pane
				BoxLayout.LoadCreateBoxLayout(btnConfirm_Callback, { paneCode : 12 });
			};

			OPAjaxRequest("POST", "createBox", _callback, "receiverServiceSN=" + objs.receiverServiceSN
															+ "&receiverUserSN=" + objs.receiverUserSN
															+ "&receiverGUSID=" + objs.receiverGUSID
															+ "&receiverCharacterSN=" + objs.receiverCharacterSN
															+ "&receiverCharacterName=" + CruiseGlobal.ReplaceToSpecialChar(objs.receiverCharacterName)
															+ "&startDate=" + startDate
															+ "&endDate=" + endDate
															+ "&usableTimeAfterOpen=" + objs.usableTimeAfterOpen
															+ "&visibleFlag=" + objs.visibleFlag
															+ "&itemData=" + CruiseGlobal.ReplaceToSpecialChar(CruiseGlobal.ToJsonString(normItemData))
															+ "&boxTagData=" + CruiseGlobal.ReplaceToSpecialChar(CruiseGlobal.ToJsonString(objs.boxTagData))
															);
			this.hide();
			BoxGlobal.ShowLoading();
	    };
	    
	    var qstBox = new OPMsgBox ("ConfirmCreate", 
	    							l10nMsg["msg_45"],
	    							l10nMsg["text_34"],
	    							{isFixedCenter: true,
	    							isDraggable: false,
	    							isClose: true,
	    							isModal: true,
	    							width: 300
	             					});
	    qstBox.SetICON("warn");
	    qstBox.SetButtons([{ text:l10nMsg["text_34"], handler:CreateProcess, isDefault:true }, { text:l10nMsg["text_10"],  handler: function () {this.hide();} }]);
	    qstBox.Show();
	    return;
	};
	
	BoxLayout.LoadCreateBoxLayout(btnConfirm_Callback, { paneCode : 12 });
};

//This function is called from LoadCreateBoxLayout in boxMainLayout.js
_BoxMainLogic.prototype.GetPageServiceItemForAddBox = function (receiverServiceSN, tagName)
{
	var addRequestVal = "&enableFlag=1";
	if (receiverServiceSN != null && receiverServiceSN != '')
		addRequestVal += "&serviceItemServiceSN=" + receiverServiceSN;
	if (tagName != null && tagName != '')
		addRequestVal += "&searchText=" + tagName;
	
	BoxGlobal.BoxPageResourceMan.Remove("GetPageServiceItemForAddBox_ItemSearchDatatableDIV");
	
	return BoxMainLogic.CreateBoxDatatable("GetPageServiceItemForAddBox",
											"getPageServiceItem?",
											"GetPageServiceItemForAddBox",
											"ItemSearchDatatableDIV",
											{	addRequestParamFn : function () { return addRequestVal; },
												paginator : new OPPaginator("ItemDataListPaginateSection", BoxGlobal.IndividualData.BoxDatatablePageSize, true, BoxGlobal.DefaultPaginatorConfig()), 
												l10nObj : l10nMsg,
												formatRow : BoxMainLogic.BoxBaseFormatter,
												sortColumn : "serviceItemSN",
												sortDir : "asc",
												selectionMode : "multi"},
											0);
};

_BoxMainLogic.prototype.ServiceItemTagValidateValue = function (value, objSelectedRows){
	if (Number(objSelectedRows[0]["serviceItemValidationValue"]) == 1){
		if (!CruiseValidation.IsNumber(value) || Number(value) < 0 || Number(value) > 2147483647){
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_96"], l10nMsg["text_09"]);
			return;
		}
	}else if (Number(objSelectedRows[0]["serviceItemValidationValue"]) == 2){
		if (!CruiseValidation.MaxLength(value, 255)){
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_97"], l10nMsg["text_09"]);
			return;
		}
	}else{
		CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_98"], l10nMsg["text_09"]);
		return;
	}
	return value;
}


//This function is called from LoadCreateBoxLayout in boxMainLayout.js
_BoxMainLogic.prototype.GetPageBoxTagForAddItem = function (tagName)
{
	addRequestVal = '&enableFlag=1';
	if (tagName != null && tagName != '')
		addRequestVal += "&boxTagName=" + tagName;
	
	BoxGlobal.BoxPageResourceMan.Remove("GetPageBoxTagForAddBox_BoxTagSearchDatatableDIV");
	
	return BoxMainLogic.CreateBoxDatatable("GetPageBoxTagForAddBox",
											"getPageBoxTag?",
											"GetPageBoxTagForAddBox",
											"BoxTagSearchDatatableDIV",
											{	addRequestParamFn : function () { return addRequestVal; },
												paginator : new OPPaginator("BoxTagDataListPaginateSection", BoxGlobal.IndividualData.BoxDatatablePageSize, true, BoxGlobal.DefaultPaginatorConfig()), 
												l10nObj : l10nMsg,
												sortColumn : "boxTagSN",
												sortDir : "asc",
												selectionMode : "multi"},
											0);
};

_BoxMainLogic.prototype.BoxTagValidateValue = function (value, objSelectedRows){
	return value;
}

_BoxMainLogic.prototype.GetPageBoxTemplate = function (action, event, obj)
{
	//Initalize & Draw
	
	var SearchButtonClick = function (objs)
	{
		//Validation
		var addRequestVal = '';
		if (objs)
		{
			addRequestVal += "&enableFlag=" + objs.enableFlag;
			if (objs.searchCondition != null && objs.searchCondition != '')
				addRequestVal += "&searchCondition=" + objs.searchCondition;
		}
		else
			addRequestVal = '&enableFlag=1';
		
		if (viewBoxDT)
			BoxGlobal.BoxPageResourceMan.Remove("GetPageBoxTemplate_DataListSection");
		
		return BoxMainLogic.CreateBoxDatatable("GetPageBoxTemplate",
												"getPageBoxTemplate?",
												"GetPageBoxTemplate",
												"DataListSection",
												{ selectCallbackFn : BoxTemplateHandler.ISelectedDataTable, 
													addRequestParamFn : function () { return addRequestVal; },
													paginator : new OPPaginator("DataListPaginateSection", BoxGlobal.IndividualData.BoxDatatablePageSize, true, BoxGlobal.DefaultPaginatorConfig()), 
													l10nObj : l10nMsg,
													formatRow : BoxMainLogic.BoxBaseFormatter,
													sortColumn : "boxTemplateSN",
													sortDir : "asc",
													selectionMode : "single"},
												0);
	};
	
	BoxLayout.LoadBoxTemplateListLayout(SearchButtonClick, { paneCode : 13 });
	var viewBoxDT = SearchButtonClick();
	BoxTemplateHandler.SetOPTable(viewBoxDT);
	BoxLayout.LoadLeftCenterLayout(null, [viewBoxDT]);
};

_BoxMainLogic.prototype.AddBoxTemplate = function (action, event, obj)
{
	//Confirm Button callback
	var btnConfirm_Callback = function (event, objs) {
		// Start/End Activation Validation
		var startDate = new Date(objs.startActivationTime);
		var endDate = new Date(objs.endActivationTime);
		
		if (!CruiseValidation.IsDate(objs.startActivationTime, "/") || !CruiseValidation.IsDate(objs.endActivationTime, "/"))
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_91"], l10nMsg["text_09"]);
			return;
		}
		
		if (startDate >= endDate){
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_41"], l10nMsg["text_09"], "inputReceiverUserSN");
			return;
		}
		
		startDate = CruiseGlobal.ToUTCString(objs.startActivationTime);
		endDate = CruiseGlobal.ToUTCString(objs.endActivationTime);
		
		if (objs.usableTimeAfterOpen != null && objs.usableTimeAfterOpen.length > 0){
			if (!CruiseValidation.IsNumber(objs.usableTimeAfterOpen))
			{
				CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["col_activateDurationAfterOpen"] + l10nMsg["msg_23"], l10nMsg["text_09"], "InputUsableTimeAfterOpen");
				return;
			}
		}
		
		// Item Data
		if (objs.itemData == null || objs.itemData.length <= 0){
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_42"], l10nMsg["text_09"]);
			return;
		}
		
		// Normalize Item Data
		var normItemData = new Array();
		var lenItemData = objs.itemData.length;
		for (var i = 0; i < lenItemData; i++){
			var isFound = false;
			var popData = objs.itemData[i];
			for (var j = 0; j < normItemData.length; j++){
				if (parseInt(normItemData[j].serviceItemSN) == parseInt(popData.serviceItemSN)){
					if (normItemData[j].serviceItemTag == null)
						normItemData[j].serviceItemTag = new Array();
					
					if (popData.serviceItemTagSN != "-" && !popData.serviceItemTagValue != "-")
						normItemData[j].serviceItemTag.push({serviceItemTagSN : popData.serviceItemTagSN, 
																serviceItemTagValue : popData.serviceItemTagValue,
																serviceItemTagName : popData.serviceItemTagName})
					isFound = true;
				}
			}
			if (!isFound){
				var normNewData = {serviceItemSN : popData.serviceItemSN, externalItemKey : popData.serviceItemMappingItemSN, serviceItemTag : new Array()};
				if (popData.serviceItemTagSN != "-" && !popData.serviceItemTagValue != "-"){
					normNewData.serviceItemTag = [{serviceItemTagSN : popData.serviceItemTagSN,
													serviceItemTagValue : popData.serviceItemTagValue,
													serviceItemTagName : popData.serviceItemTagName}];					
				}
				normItemData.push(normNewData);
			}
		}
		
		// Item Validation
		for (var i = 0; i < normItemData.length; i++){
			for (j = 0; j < normItemData[i].serviceItemTag.length; j++){
				if (!CruiseValidation.HasValue(normItemData[i].serviceItemTag[j].serviceItemTagValue))
				{
					CruiseGlobal.SHOWINFO (l10nMsg["text_22"], normItemData[i].serviceItemTag[j].serviceItemTagName + l10nMsg["msg_44"], l10nMsg["text_09"]);
					return;
				}
			}
		}
		
		// Box Tag Data
		if (objs.boxTagData == null || objs.boxTagData.length <= 0){
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_89"], l10nMsg["text_09"]);
			return;
		}
		
		// Box Tag Validation
		for (var i = 0; i < objs.boxTagData.length; i++){
			if (!CruiseValidation.HasValue( objs.boxTagData[i].boxTagValue))
			{
				CruiseGlobal.SHOWINFO (l10nMsg["text_22"], objs.boxTagData[i].boxTagSN + l10nMsg["msg_43"], l10nMsg["text_09"]);
				return;
			}
		}

	    var CreateProcess = function (){
			var _callback = function(o, messages) {
				if (BoxTemplateHandler.objParentOPTable != null)
					BoxTemplateHandler.objParentOPTable.Refresh();
				if (!BoxGlobal.ValidateResponse(messages)) return;
				CruiseGlobal.SHOWINFO (l10nMsg["text_34"], messages.newBoxSN + l10nMsg["msg_50"], l10nMsg["text_09"]);
				
				//Initialize Pane
				BoxLayout.LoadAddBoxTemplateLayout(btnConfirm_Callback, { paneCode : 14 });
			};
			
			OPAjaxRequest("POST", "createBoxTemplate", _callback, "boxTemplateTitle=" + CruiseGlobal.ReplaceToSpecialChar(objs.boxTemplateTitle)
					                                        + "&boxTemplateServiceSN=" + objs.boxTemplateServiceSN
															+ "&startDate=" + startDate
															+ "&endDate=" + endDate
															+ "&usableTimeAfterOpen=" + objs.usableTimeAfterOpen
															+ "&visibleFlag=" + objs.visibleFlag
															+ "&boxItemData=" + CruiseGlobal.ReplaceToSpecialChar(CruiseGlobal.ToJsonString(normItemData))
															+ "&boxTagData=" + CruiseGlobal.ReplaceToSpecialChar(CruiseGlobal.ToJsonString(objs.boxTagData))
															);
			this.hide();
			BoxGlobal.ShowLoading();
	    };
	    
	    var qstBox = new OPMsgBox ("ConfirmCreate", 
	    							l10nMsg["msg_49"],
	    							l10nMsg["text_34"],
	    							{isFixedCenter: true,
	    							isDraggable: false,
	    							isClose: true,
	    							isModal: true,
	    							width: 300
	             					});
	    qstBox.SetICON("warn");
	    qstBox.SetButtons([{ text:l10nMsg["text_34"], handler:CreateProcess, isDefault:true }, { text:l10nMsg["text_10"],  handler: function () {this.hide();} }]);
	    qstBox.Show();
	    return;
	};
	
	BoxLayout.LoadAddBoxTemplateLayout(btnConfirm_Callback, { paneCode : 14 });
};

_BoxMainLogic.prototype.CreateBoxFromTemplate = function (action, event, obj)
{
	//Confirm Button callback
	var btnConfirm_Callback = function (event, objs) {
		var boxTemplateSN = CruiseGlobal.GetElementValue("inputBoxTemplateSN");
		var receiverUserSN = CruiseGlobal.GetElementValue("inputReceiverUserSN");
		var receiverGUSID = CruiseGlobal.GetElementValue("inputReceiverGUSID");
		var receiverCharacterSN = CruiseGlobal.GetElementValue("inputReceiverCharacterSN");
		var receiverCharacterName = CruiseGlobal.GetElementValue("inputReceiverCharacterName");

		if (!CruiseValidation.HasValue(boxTemplateSN))
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_53"], l10nMsg["text_09"], "inputBoxTemplateSN");
			return;
		}
		
		if (!CruiseValidation.IsNumber(boxTemplateSN))
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["col_boxTemplateSN"] + l10nMsg["msg_52"], l10nMsg["text_09"], "inputBoxTemplateSN");
			return;
		}
		
		if (!CruiseValidation.HasValue(receiverUserSN))
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_40"], l10nMsg["text_09"], "inputReceiverUserSN");
			return;
		}
		
		if (!CruiseValidation.IsNumber(receiverUserSN))
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["col_receiverUserSN"] + l10nMsg["msg_52"], l10nMsg["text_09"], "inputReceiverUserSN");
			return;
		}
		
		if (!CruiseValidation.HasValue(receiverGUSID))
			receiverGUSID = null;
		if (!CruiseValidation.HasValue(receiverCharacterSN))
			receiverCharacterSN = null;
		if (!CruiseValidation.HasValue(receiverCharacterName))
			receiverCharacterName = null;
		
		var _callback = function(o, messages) {
			if (BoxHandler.objParentOPTable != null)
				BoxHandler.objParentOPTable.Refresh();
			if (!BoxGlobal.ValidateResponse(messages))
				return;
			CruiseGlobal.SHOWINFO (l10nMsg["text_23"], messages.newBoxSN + l10nMsg["msg_46"], l10nMsg["text_09"]);
			
			//Initialize Pane
			BoxLayout.LoadCreateBoxFromTemplateLayout(btnConfirm_Callback);
		};
		
		var stringObj = new String();
		var params = null;
		
		if (receiverGUSID == null && receiverCharacterSN == null && receiverCharacterName == null)
			params = stringObj.concat("boxTemplateSN=", boxTemplateSN, "&receiverUserSN=", receiverUserSN);
		if (receiverGUSID != null && receiverCharacterSN == null && receiverCharacterName == null)
			params = stringObj.concat("boxTemplateSN=", boxTemplateSN, "&receiverUserSN=", receiverUserSN, "&receiverGUSID=", receiverGUSID);
		if (receiverCharacterSN != null && receiverCharacterSN != null && receiverCharacterName == null)
			params = stringObj.concat("boxTemplateSN=", boxTemplateSN, "&receiverUserSN=", receiverUserSN, "&receiverGUSID=", receiverGUSID, "&receiverCharacterSN=", receiverCharacterSN);
		if (receiverCharacterSN != null && receiverCharacterSN != null && receiverCharacterName != null)
			params = stringObj.concat("boxTemplateSN=", boxTemplateSN, "&receiverUserSN=", receiverUserSN, "&receiverGUSID=", receiverGUSID, "&receiverCharacterSN=", receiverCharacterSN, "&receiverCharacterName=", CruiseGlobal.ReplaceToSpecialChar(receiverCharacterName));
		
		OPAjaxRequest("POST", "createBoxFromTemplate", _callback, params);
		this.hide();
		BoxGlobal.ShowLoading();
		
	    return;
	};
	
	BoxLayout.LoadCreateBoxFromTemplateLayout(btnConfirm_Callback);
};
