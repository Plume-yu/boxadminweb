/*==================================
    
     BoxTagHandler Scripts
        
====================================*/

var BoxTagHandler = {
	elActionPaneDiv : null,
	elBasePaneDiv : null,
	objParentOPTable : null,
	serviceItemTagSN : null,
	// OPDataTable에서 클릭했을 경우, DataTable에서의 호출을 받아주는 인터페이스
	ISelectedDataTable : function (selectedValues, tableObj)
	{
		BoxTagHandler.objParentOPTable = tableObj;
		BoxTagHandler.GetBoxTag(selectedValues[0].boxTagSN);
		BoxTagHandler.boxTagSN = selectedValues[0].boxTagSN;
	},
	// Box에서는 오른쪽 패널에 대한 Layout initialize를 해 준다.
	InitializePane : function ()
	{
		PaneArray = BoxLayout.LoadDefaultRightLayout ({ paneCode : 5 });
		BoxTagHandler.elActionPaneDiv = PaneArray[0];
		BoxTagHandler.elBasePaneDiv = PaneArray[1];
	},
	// ISelectedDataTable을 요청하기전 DataTable을 등록해야 하는 경우.
	SetOPTable : function (tableObj)
	{
		BoxTagHandler.objParentOPTable = tableObj;
	},
	// 하나의 Box에 대한 정보를 요청
	GetBoxTag : function (boxTagSN)
	{
		var _callback = function(o, messages) {
			if (!BoxGlobal.ValidateResponse(messages)) return;
			BoxTagHandler.GetBoxTag_Layout(messages.returnTables[0][0][0]);
		};
		OPAjaxRequest("POST", "getBoxTag", _callback, "boxTagSN=" + boxTagSN);
	},
	GetBoxTag_Layout : function (aBox)
	{
		BoxTagHandler.InitializePane();
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "RemoveButton"));
		elArray.push(CruiseGlobal.CreateElement("SPAN", "ModifyButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, BoxTagHandler.elActionPaneDiv);
		
		//Remove Button
		var btnRemove = new OPButton("RemoveButton",
									l10nMsg["text_20"], 
									BoxTagHandler.elActionPaneDiv,
									BoxTagHandler.RemoveBoxTag,
									{ boxTagSN : aBox.boxTagSN });
		BoxGlobal.BoxSectionResourceMan.Add("btnRemove", btnRemove);

		//Modify Button
		var btnModify = new OPButton("ModifyButton",
									l10nMsg["text_21"], 
									BoxTagHandler.elActionPaneDiv,
									BoxTagHandler.ModifyBoxTag,
									{ aBox : aBox });
		BoxGlobal.BoxSectionResourceMan.Add("btnModify", btnModify);
		
		if (aBox.boxTagEnableFlag != 1)
		{
			btnRemove.Disabled(true);
			btnModify.Disabled(true);
		}

		//Display Data
		var elTable = CruiseGlobal.CreateElement("TABLE", "BoxInfoTable", BoxTagHandler.elBasePaneDiv, "BoxInfoTable");
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_boxTagSN"], aBox.boxTagSN], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_boxTagName"], CruiseGlobal.InjectString(aBox.boxTagName, 50, " <BR>")], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_boxTagDescription"], CruiseGlobal.InjectString(aBox.boxTagDescription, 50, " <BR>")], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_boxTagEnableFlag"], BoxGlobal.GetCodeText('enableFlag', aBox.boxTagEnableFlag)], elTable);
	},
	RemoveBoxTag : function (event, objs)
	{
	    var RemoveProcess = function (){
			var _callback = function(o, messages) {
				if (!BoxGlobal.ValidateResponse(messages)) return;
				CruiseGlobal.SHOWINFO (l10nMsg["text_20"], objs.boxTagSN + l10nMsg["msg_25"], l10nMsg["text_09"]);
				BoxTagHandler.GetBoxTag(objs.boxTagSN);
				BoxTagHandler.objParentOPTable.Refresh();
			};
			
			OPAjaxRequest("POST", "removeBoxTag", _callback, "boxTagSN=" + objs.boxTagSN);
			this.hide();
			BoxGlobal.ShowLoading();
	    };
	    
	    var qstBox = new OPMsgBox ("ConfirmRemove", 
	    							objs.boxTagSN + l10nMsg["msg_24"],
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
	ModifyBoxTag : function (event, objs)
	{
		BoxTagHandler.ModifyBoxTag_Layout(objs.aBox);

	},
	ModifyBoxTag_Layout : function (aBox)
	{
		BoxTagHandler.InitializePane();
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "ConfirmButton"));
		elArray.push(CruiseGlobal.CreateElement("SPAN", "CancelButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, BoxTagHandler.elActionPaneDiv);
		
		//Confirm Button callback
		var btnConfirm_Callback = function () {
			modify_boxTagSN = aBox.boxTagSN;
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
			
			BoxTagHandler.ModifyBoxTag_Confirm(modify_boxTagSN, newBoxTagName, newBoxTagDescription);
		};
		//Confirm Button
		var btnConfirm = new OPButton("ConfirmButton",
									l10nMsg["text_09"], 
									BoxTagHandler.elActionPaneDiv,
									btnConfirm_Callback);
		BoxGlobal.BoxSectionResourceMan.Add("btnConfirm", btnConfirm);

		//Cancel Button
		var btnCancel = new OPButton("CancelButton",
									l10nMsg["text_10"], 
									BoxTagHandler.elActionPaneDiv,
									function () { BoxTagHandler.GetBoxTag(BoxTagHandler.boxTagSN); });
		BoxGlobal.BoxSectionResourceMan.Add("btnCancel", btnCancel);
		
		//Input Area
		var elTable = CruiseGlobal.CreateElement("TABLE", "BoxInfoTable", BoxTagHandler.elBasePaneDiv, "BoxInfoTable");
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_boxTagSN"], 
									CruiseGlobal.CreateElement("LABEL", "boxTagSN_label", null, null, { body: aBox.boxTagSN } ), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_boxTagName"],
									CruiseGlobal.CreateElement("INPUT", "inputBoxTagName", null, "txtInputNormal", { maxlength : 50, value : aBox.boxTagName }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_boxTagDescription"],
									CruiseGlobal.CreateElement("INPUT", "inputBoxTagDescription", null, "txtInputBig", { maxlength : 500, value : aBox.boxTagDescription }), elTable);
	},
	ModifyBoxTag_Confirm : function (boxTagSN, newBoxTagName, newBoxTagDescription)
	{												
	    var ModifyProcess = function (){
			var _callback = function(o, messages) {
				BoxTagHandler.objParentOPTable.Refresh();
				if (!BoxGlobal.ValidateResponse(messages)) 
				{ 
					//CruiseGlobal.SHOWINFO (l10nMsg["text_11"], l10nMsg["msg_20"], l10nMsg["text_09"]); 
					return;
				}
				BoxTagHandler.GetBoxTag(messages.newBoxTagSN);
				CruiseGlobal.SHOWINFO (l10nMsg["text_21"], messages.newBoxTagSN + l10nMsg["msg_27"], l10nMsg["text_09"]);
			};
			OPAjaxRequest("POST", "modifyBoxTag", _callback, "boxTagSN=" + boxTagSN
															+ "&boxTagName=" + CruiseGlobal.ReplaceToSpecialChar(newBoxTagName)
															+ "&boxTagDescription=" + CruiseGlobal.ReplaceToSpecialChar(newBoxTagDescription));
			this.hide();
			BoxGlobal.ShowLoading();
	    };
	    
	    var qstBox = new OPMsgBox ("ConfirmModify", 
	    							boxTagSN + l10nMsg["msg_26"],
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