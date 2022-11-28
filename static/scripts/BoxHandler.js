/*==================================
    
     BoxHandler Scripts
        
====================================*/

var BoxHandler = {
	elActionPaneDiv : null,
	elBasePaneDiv : null,
	objParentOPTable : null,
	boxSN : null,
	// OPDataTable에서 클릭했을 경우, DataTable에서의 호출을 받아주는 인터페이스
	ISelectedDataTable : function (selectedValues, tableObj)
	{
		BoxHandler.objParentOPTable = tableObj;
		BoxHandler.GetDetailBox(selectedValues[0].boxSN);
		BoxHandler.boxSN = selectedValues[0].boxSN;
	},
	// Box에서는 오른쪽 패널에 대한 Layout initialize를 해 준다.
	InitializePane : function ()
	{
		PaneArray = BoxLayout.LoadDefaultRightLayout ({ paneCode : 10 });
		BoxHandler.elActionPaneDiv = PaneArray[0];
		BoxHandler.elBasePaneDiv = PaneArray[1];
	},
	// ISelectedDataTable을 요청하기전 DataTable을 등록해야 하는 경우.
	SetOPTable : function (tableObj)
	{
		BoxHandler.objParentOPTable = tableObj;
	},
	// 하나의 Box에 대한 정보를 요청
	GetDetailBox : function (boxSN)
	{
		var _callback = function(o, messages) {
			if (!BoxGlobal.ValidateResponse(messages)) return;
			BoxHandler.GetDetailBox_Layout(messages.returnTables);
		};
		OPAjaxRequest("POST", "getDetailBox", _callback, "boxSN=" + boxSN);
	},
	GetDetailBox_Layout : function (dataTables)
	{
		BoxHandler.InitializePane();
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		var boxDetail = dataTables[0][0][0];
		var boxTags = dataTables[1][0];
		var serviceItems = dataTables[2][0];
		var boxUseLog = null;
		if (dataTables[3][0].length > 0) {
			boxUseLog = dataTables[3][0][0];
		}
		var boxItems = dataTables[4][0];
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "RemoveButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, BoxHandler.elActionPaneDiv);
		
		//Remove Button
		var btnRemove = new OPButton("RemoveButton",
									l10nMsg["text_20"], 
									BoxHandler.elActionPaneDiv,
									BoxHandler.RemoveBox,
									{ boxSN : boxDetail.boxSN });
		BoxGlobal.BoxSectionResourceMan.Add("btnRemove", btnRemove);
		
		if (boxDetail.boxStateCode == 4)
		{
			btnRemove.Disabled(true);
		}

		//Display Data
		var elTable = CruiseGlobal.CreateElement("TABLE", "BoxInfoTable", BoxHandler.elBasePaneDiv, "BoxInfoTable");
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_boxSN"], boxDetail.boxSN], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_receiverServiceSN"], boxDetail.receiverServiceSN], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_receiverUserSN"], boxDetail.receiverUserSN], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_receiverGUSID"], boxDetail.receiverGUSID], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_receiverCharacterSN"], boxDetail.receiverCharacterSN], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_receiverCharacterName"], boxDetail.receiverCharacterName], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_boxStateCode"], BoxGlobal.GetCodeText("boxStateCode", boxDetail.boxStateCode)], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_createDateTime"], CruiseGlobal.GetLocalTimeString(boxDetail.createDateTime)], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_openDateTime"], CruiseGlobal.GetLocalTimeString(boxDetail.openDateTime)], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_useDateTime"], CruiseGlobal.GetLocalTimeString(boxDetail.useDateTime)], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_deleteDateTime"], CruiseGlobal.GetLocalTimeString(boxDetail.deleteDateTime)], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_externalTransactionKey"], boxDetail.externalTransactionKey], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_startActivationDateTime"], CruiseGlobal.GetLocalTimeString(boxDetail.startActivationDateTime)], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_endActivationDateTime"], CruiseGlobal.GetLocalTimeString(boxDetail.endActivationDateTime)], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_activateDurationAfterOpen"], boxDetail.activateDurationAfterOpen], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_visableFlagBeforeActivation"], BoxGlobal.GetCodeText('visableFlagBeforeActivation', boxDetail.visableFlagBeforeActivation)], elTable);
		BoxGlobal.MakeLayoutTR_HTML(["", ""], elTable);
		
		if (boxUseLog != null) {
			BoxGlobal.MakeLayoutTR_HTML([l10nMsg["text_52"], ""], elTable);
			BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_receiverGUSID"], boxUseLog.receiverGUSID], elTable);
			BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_receiverCharacterSN"], boxUseLog.receiverCharacterSN], elTable);
			BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_receiverCharacterName"], boxUseLog.receiverCharacterName], elTable);
		}
		
		var boxTagData = [];
		var serviceItemData = [];
		var boxItemData = [];
		
		for (boxTag in boxTags) {
			boxTagData.push({boxTagName: boxTags[boxTag].boxTagName,
						     boxTagValue: boxTags[boxTag].boxTagValue});
		}
		
		for (serviceItem in serviceItems) {
			serviceItemData.push({mappingItemSN: serviceItems[serviceItem].itemSN,
								  serviceItemTagName: serviceItems[serviceItem].serviceItemTagName,
								  serviceItemTagValue: serviceItems[serviceItem].serviceItemTagValue});
		}
		
		for (boxItem in boxItems) {
			boxItemData.push({boxItemSN: boxItems[boxItem].boxItemSN,
				              mappingItemSN: boxItems[boxItem].itemSN,
				              internalItemKey: boxItems[boxItem].internalItemKey});
		}
		
		var boxTagDataTableDIV = CruiseGlobal.CreateElement("DIV", "BoxTagDataTableDIV");
		BoxGlobal.MakeLayoutTR_INPUT(null, boxTagDataTableDIV, elTable);
		
		var BoxTagDataTable = new OPDataTable( "BoxTagDataTable",
				 null,
				 BoxMainLogic.GetColumns("BoxTagDataTable"),
				 "BoxTagDataTableDIV",
				 {	JSArrayObejct : { data : boxTagData },
	    			l10nObj : l10nMsg,
					formatRow : BoxMainLogic.BoxBaseFormatter,
					selectionMode : "null"});
		
		var serviceItemDataTableDIV = CruiseGlobal.CreateElement("DIV", "ServiceItemDataTableDIV");
		BoxGlobal.MakeLayoutTR_INPUT(null, serviceItemDataTableDIV, elTable);
		
		var ServiceItemDataTable = new OPDataTable( "ServiceItemDataTable",
				 null,
				 BoxMainLogic.GetColumns("ServiceItemDataTable"),
				 "ServiceItemDataTableDIV",
				 {	JSArrayObejct : { data : serviceItemData },
	    			l10nObj : l10nMsg,
					formatRow : BoxMainLogic.BoxBaseFormatter,
					selectionMode : "null"});
		
		var boxItemDataTableDIV = CruiseGlobal.CreateElement("DIV", "BoxItemDataTableDIV");
		BoxGlobal.MakeLayoutTR_INPUT(null, boxItemDataTableDIV, elTable);
		
		var BoxItemDataTable = new OPDataTable( "BoxItemDataTable",
				 null,
				 BoxMainLogic.GetColumns("BoxItemDataTable"),
				 "BoxItemDataTableDIV",
				 {	JSArrayObejct : { data : boxItemData },
	    			l10nObj : l10nMsg,
					formatRow : BoxMainLogic.BoxBaseFormatter,
					selectionMode : "null"});
		
		BoxGlobal.BoxSectionResourceMan.Add("BoxTagDataTable", BoxTagDataTable);
		BoxGlobal.BoxSectionResourceMan.Add("ServiceItemDataTable", ServiceItemDataTable);
		BoxGlobal.BoxSectionResourceMan.Add("BoxItemDataTable", BoxItemDataTable);
	},
	RemoveBox : function (event, objs)
	{
	    var RemoveProcess = function (){
			var _callback = function(o, messages) {
				if (!BoxGlobal.ValidateResponse(messages)) return;
				CruiseGlobal.SHOWINFO (l10nMsg["text_20"], objs.boxSN + l10nMsg["msg_36"], l10nMsg["text_09"]);
				BoxHandler.GetDetailBox(objs.boxSN);
				BoxHandler.objParentOPTable.Refresh();
			};
			
			OPAjaxRequest("POST", "removeBox", _callback, "boxSN=" + objs.boxSN);
			this.hide();
			BoxGlobal.ShowLoading();
	    };
	    
	    var qstBox = new OPMsgBox ("ConfirmRemove", 
	    							objs.boxSN + l10nMsg["msg_37"],
	    							l10nMsg["text_20"],
	    							{isFixedCenter: true,
	    							isDraggable: false,
	    							isClose: true,
	    							isModal: true,
	    							width: 300
	             					});
	    qstBox.SetICON("warn");
	    qstBox.SetButtons([{ text:l10nMsg["text_09"], handler:RemoveProcess, isDefault:true }, { text:l10nMsg["text_10"],  handler: function () {this.hide();} }]);
	    qstBox.Show();
	    return;
	},
	ModifyServiceItem : function (event, objs)
	{
		BoxHandler.ModifyServiceItem_Layout(objs.aBox);

	},
	ModifyServiceItem_Layout : function (aBox)
	{
		BoxHandler.InitializePane();
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "ConfirmButton"));
		elArray.push(CruiseGlobal.CreateElement("SPAN", "CancelButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, BoxHandler.elActionPaneDiv);
		
		//Confirm Button callback
		var btnConfirm_Callback = function () {
			modify_boxSN = aBox.boxSN;
			newServiceItemServiceSN = CruiseGlobal.GetElementValue("inputServiceItemServiceSN");
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
			
			BoxHandler.ModifyBoxTag_Confirm(modify_boxTagSN, newBoxTagName, newBoxTagDescription);
		};
		//Confirm Button
		var btnConfirm = new OPButton("ConfirmButton",
									l10nMsg["text_09"], 
									BoxHandler.elActionPaneDiv,
									btnConfirm_Callback);
		BoxGlobal.BoxSectionResourceMan.Add("btnConfirm", btnConfirm);

		//Cancel Button
		var btnCancel = new OPButton("CancelButton",
									l10nMsg["text_10"], 
									BoxHandler.elActionPaneDiv,
									function () { BoxHandler.GetDetailBox(BoxHandler.boxSN); });
		BoxGlobal.BoxSectionResourceMan.Add("btnCancel", btnCancel);
		
		//Input Area
		var elTable = CruiseGlobal.CreateElement("TABLE", "BoxInfoTable", BoxHandler.elBasePaneDiv, "BoxInfoTable");
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemSN"],
									CruiseGlobal.CreateElement("LABEL", "serviceItem_label", null, null, { body: aBox.serviceItemSN } ), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemServiceSN"],
									CruiseGlobal.CreateElement("INPUT", "inputServiceItemServiceSN", null, "txtInputNormal", { maxlength : 50, value : aBox.serviceItemServiceSN }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemMappingItemSN"],
									CruiseGlobal.CreateElement("INPUT", "inputServiceItemMappingItemSN", null, "txtInputNormal", { maxlength : 500, value : aBox.serviceItemMappingItemSN }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemEnableFlag"],
									CruiseGlobal.CreateElement("INPUT", "inputServiceItemEnableFlag", null, "txtInputNormal", { maxlength : 500, value : aBox.serviceItemEnableFlag }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemStartActivationDateTime"],
									CruiseGlobal.CreateElement("INPUT", "inputServiceItemStartActivationDateTime", null, "txtInputNormal", { maxlength : 500, value : aBox.serviceItemStartActivationDateTime }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemRegisterUserSN"],
									CruiseGlobal.CreateElement("INPUT", "inputServiceItemRegisterUserSN", null, "txtInputNormal", { maxlength : 500, value : aBox.serviceItemRegisterUserSN }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemRegisterDateTime"],
									CruiseGlobal.CreateElement("INPUT", "inputServiceItemRegisterDateTime", null, "txtInputNormal", { maxlength : 500, value : aBox.serviceItemRegisterDateTime }), elTable);
	},
	ModifyServiceItem_Confirm : function (boxTagSN, newBoxTagName, newBoxTagDescription)
	{												
	    var ModifyProcess = function (){
			var _callback = function(o, messages) {
				BoxHandler.objParentOPTable.Refresh();
				if (!BoxGlobal.ValidateResponse(messages)) 
				{ 
					//CruiseGlobal.SHOWINFO (l10nMsg["text_11"], l10nMsg["msg_20"], l10nMsg["text_09"]); 
					return;
				}
				BoxHandler.GetBoxTag(messages.newBoxTagSN);
				CruiseGlobal.SHOWINFO (l10nMsg["text_21"], messages.newBoxTagSN + l10nMsg["msg_21"], l10nMsg["text_09"]);
			};
			OPAjaxRequest("POST", "modifyBoxTag", _callback, "boxTagSN=" + boxTagSN
															+ "&boxTagName=" + CruiseGlobal.ReplaceToSpecialChar(newBoxTagName)
															+ "&boxTagDescription=" + CruiseGlobal.ReplaceToSpecialChar(newBoxTagDescription));
			this.hide();
			BoxGlobal.ShowLoading();
	    };
	    
	    var qstBox = new OPMsgBox ("ConfirmModify", 
	    							boxTagSN + l10nMsg["msg_19"],
	    							l10nMsg["text_21"],
	    							{isFixedCenter: true,
	    							isDraggable: false,
	    							isClose: true,
	    							isModal: true,
	    							width: 300
	             					});
	    qstBox.SetICON("warn");
	    qstBox.SetButtons([{ text:l10nMsg["text_09"], handler:ModifyProcess, isDefault:true }, { text:l10nMsg["text_10"],  handler: function () {this.hide();} }]);
	    qstBox.Show();
	    return;
	}
};