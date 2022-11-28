/*==================================
    
     BoxItemTagHandler Scripts
        
====================================*/

var BoxItemTagHandler = {
	elActionPaneDiv : null,
	elBasePaneDiv : null,
	objParentOPTable : null,
	serviceItemTagSN : null,
	// OPDataTable에서 클릭했을 경우, DataTable에서의 호출을 받아주는 인터페이스
	ISelectedDataTable : function (selectedValues, tableObj)
	{
		BoxItemTagHandler.objParentOPTable = tableObj;
		BoxItemTagHandler.GetServiceItemTag(selectedValues[0].serviceItemTagSN);
		BoxItemTagHandler.serviceItemTagSN = selectedValues[0].serviceItemTagSN;
	},
	// Box에서는 오른쪽 패널에 대한 Layout initialize를 해 준다.
	InitializePane : function ()
	{
		PaneArray = BoxLayout.LoadDefaultRightLayout ({ paneCode : 2 });
		BoxItemTagHandler.elActionPaneDiv = PaneArray[0];
		BoxItemTagHandler.elBasePaneDiv = PaneArray[1];
	},
	// ISelectedDataTable을 요청하기전 DataTable을 등록해야 하는 경우.
	SetOPTable : function (tableObj)
	{
		BoxItemTagHandler.objParentOPTable = tableObj;
	},
	// 하나의 Box에 대한 정보를 요청
	GetServiceItemTag : function (serviceItemTagSN)
	{
		var _callback = function(o, messages) {
			if (!BoxGlobal.ValidateResponse(messages)) return;
			BoxItemTagHandler.GetServiceItemTag_Layout(messages.returnTables[0][0][0]);
		};
		OPAjaxRequest("POST", "getServiceItemTag", _callback, "serviceItemTagSN=" + serviceItemTagSN);
	},
	GetServiceItemTag_Layout : function (aBox)
	{
		BoxItemTagHandler.InitializePane();
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "RemoveButton"));
		elArray.push(CruiseGlobal.CreateElement("SPAN", "ModifyButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, BoxItemTagHandler.elActionPaneDiv);
		
		//Remove Button
		var btnRemove = new OPButton("RemoveButton",
									l10nMsg["text_20"], 
									BoxItemTagHandler.elActionPaneDiv,
									BoxItemTagHandler.RemoveServiceItemTag,
									{ serviceItemTagSN : aBox.serviceItemTagSN });
		BoxGlobal.BoxSectionResourceMan.Add("btnRemove", btnRemove);

		//Modify Button
		var btnModify = new OPButton("ModifyButton",
									l10nMsg["text_21"], 
									BoxItemTagHandler.elActionPaneDiv,
									BoxItemTagHandler.ModifyServiceItemTag,
									{ aBox : aBox });
		BoxGlobal.BoxSectionResourceMan.Add("btnModify", btnModify);
		
		if (aBox.serviceItemTagEnableFlag != 1)
		{
			btnRemove.Disabled(true);
			btnModify.Disabled(true);
		}

		//Display Data
		var elTable = CruiseGlobal.CreateElement("TABLE", "BoxInfoTable", BoxItemTagHandler.elBasePaneDiv, "BoxInfoTable");
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_serviceItemTagSN"], aBox.serviceItemTagSN], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_serviceItemTagName"], CruiseGlobal.InjectString(aBox.serviceItemTagName, 50, " <BR>")], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_serviceItemTagDescription"], CruiseGlobal.InjectString(aBox.serviceItemTagDescription, 50, " <BR>")], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_serviceItemValidationRuleSN"], aBox.serviceItemValidationRuleSN], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_serviceItemTagEnableFlag"], BoxGlobal.GetCodeText('enableFlag', aBox.serviceItemTagEnableFlag)], elTable);
	},
	RemoveServiceItemTag : function (event, objs)
	{
	    var RemoveProcess = function (){
			var _callback = function(o, messages) {
				if (!BoxGlobal.ValidateResponse(messages)) return;
				CruiseGlobal.SHOWINFO (l10nMsg["text_20"], objs.serviceItemTagSN + l10nMsg["msg_17"], l10nMsg["text_09"]);
				BoxItemTagHandler.GetServiceItemTag(objs.serviceItemTagSN);
				BoxItemTagHandler.objParentOPTable.Refresh();
			};
			
			OPAjaxRequest("POST", "removeItemTag", _callback, "serviceItemTagSN=" + objs.serviceItemTagSN);
			this.hide();
			BoxGlobal.ShowLoading();
	    };
	    
	    var qstBox = new OPMsgBox ("ConfirmRemove", 
	    							objs.serviceItemTagSN + l10nMsg["msg_16"],
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
	ModifyServiceItemTag : function (event, objs)
	{
		BoxItemTagHandler.ModifyServiceItemTag_Layout(objs.aBox);

	},
	ModifyServiceItemTag_Layout : function (aBox)
	{
		BoxItemTagHandler.InitializePane();
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "ConfirmButton"));
		elArray.push(CruiseGlobal.CreateElement("SPAN", "CancelButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, BoxItemTagHandler.elActionPaneDiv);
		
		//Confirm Button callback
		var btnConfirm_Callback = function () {
			modify_serviceItemTagSN = aBox.serviceItemTagSN;
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
			
			BoxItemTagHandler.ModifyServiceItemTag_Confirm(modify_serviceItemTagSN, newServiceItemTagName, newServiceItemTagDescription, newServiceItemValidationRuleSN);
		};
		//Confirm Button
		var btnConfirm = new OPButton("ConfirmButton",
									l10nMsg["text_09"], 
									BoxItemTagHandler.elActionPaneDiv,
									btnConfirm_Callback);
		BoxGlobal.BoxSectionResourceMan.Add("btnConfirm", btnConfirm);

		//Cancel Button
		var btnCancel = new OPButton("CancelButton",
									l10nMsg["text_10"], 
									BoxItemTagHandler.elActionPaneDiv,
									function () { BoxItemTagHandler.GetServiceItemTag(BoxItemTagHandler.serviceItemTagSN); });
		BoxGlobal.BoxSectionResourceMan.Add("btnCancel", btnCancel);
		
		//Input Area
		var elTable = CruiseGlobal.CreateElement("TABLE", "BoxInfoTable", BoxItemTagHandler.elBasePaneDiv, "BoxInfoTable");
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemTagSN"], 
									CruiseGlobal.CreateElement("LABEL", "serviceItemTagSN_label", null, null, { body: aBox.serviceItemTagSN } ), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemTagName"],
									CruiseGlobal.CreateElement("INPUT", "inputServiceItemTagName", null, "txtInputNormal", { maxlength : 50, value : aBox.serviceItemTagName }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemTagDescription"],
									CruiseGlobal.CreateElement("INPUT", "inputServiceItemTagDescription", null, "txtInputBig", { maxlength : 500, value : aBox.serviceItemTagDescription }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemValidationRuleSN"],
									CruiseGlobal.CreateElement("INPUT", "inputServiceItemValidationRuleSN", null, "txtInputVerySmall", { maxlength : 1, value : aBox.serviceItemValidationRuleSN }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT('', CruiseGlobal.CreateElement("SPAN", "spanServiceItemValidationRuleSN", null, null, { body: l10nMsg["text_56"] }), elTable);

	},
	ModifyServiceItemTag_Confirm : function (serviceItemTagSN, newServiceItemTagName, newServiceItemTagDescription, newServiceItemValidationRuleSN)
	{												
	    var ModifyProcess = function (){
			var _callback = function(o, messages) {
				BoxItemTagHandler.objParentOPTable.Refresh();
				if (!BoxGlobal.ValidateResponse(messages)) 
				{ 
					//CruiseGlobal.SHOWINFO (l10nMsg["text_11"], l10nMsg["msg_20"], l10nMsg["text_09"]); 
					return;
				}
				BoxItemTagHandler.GetServiceItemTag(messages.newServiceItemTagSN);
				CruiseGlobal.SHOWINFO (l10nMsg["text_21"], messages.newServiceItemTagSN + l10nMsg["msg_21"], l10nMsg["text_09"]);
			};
			OPAjaxRequest("POST", "modifyItemTag", _callback, "serviceItemTagSN=" + serviceItemTagSN
															+ "&serviceItemTagName=" + CruiseGlobal.ReplaceToSpecialChar(newServiceItemTagName)
															+ "&serviceItemTagDescription=" + CruiseGlobal.ReplaceToSpecialChar(newServiceItemTagDescription)
															+ "&serviceItemValidationRuleSN=" + newServiceItemValidationRuleSN);
			this.hide();
			BoxGlobal.ShowLoading();
	    };
	    
	    var qstBox = new OPMsgBox ("ConfirmModify", 
	    							serviceItemTagSN + l10nMsg["msg_19"],
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