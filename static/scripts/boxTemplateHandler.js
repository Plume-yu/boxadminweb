/*==================================
    
     BoxTemplateHandler Scripts
        
====================================*/

var BoxTemplateHandler = {
	elActionPaneDiv : null,
	elBasePaneDiv : null,
	objParentOPTable : null,
	boxTemplateSN : null,
	// OPDataTable에서 클릭했을 경우, DataTable에서의 호출을 받아주는 인터페이스
	ISelectedDataTable : function (selectedValues, tableObj)
	{
		BoxTemplateHandler.objParentOPTable = tableObj;
		BoxTemplateHandler.GetDetailBoxTemplate(selectedValues[0].boxTemplateSN);
		BoxTemplateHandler.boxTemplateSN = selectedValues[0].boxTemplateSN;
	},
	// Box에서는 오른쪽 패널에 대한 Layout initialize를 해 준다.
	InitializePane : function ()
	{
		PaneArray = BoxLayout.LoadDefaultRightLayout ({ paneCode : 20 });
		BoxTemplateHandler.elActionPaneDiv = PaneArray[0];
		BoxTemplateHandler.elBasePaneDiv = PaneArray[1];
	},
	// ISelectedDataTable을 요청하기전 DataTable을 등록해야 하는 경우.
	SetOPTable : function (tableObj)
	{
		BoxTemplateHandler.objParentOPTable = tableObj;
	},
	// 하나의 Box에 대한 정보를 요청
	GetDetailBoxTemplate : function (boxTemplateSN)
	{
		var _callback = function(o, messages) {
			if (!BoxGlobal.ValidateResponse(messages)) return;
			BoxTemplateHandler.GetDetailBoxTemplate_Layout(messages.returnTables);
		};
		OPAjaxRequest("POST", "getDetailBoxTemplate", _callback, "boxTemplateSN=" + boxTemplateSN);
	},
	GetDetailBoxTemplate_Layout : function (dataTables)
	{
		BoxTemplateHandler.InitializePane();
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		var boxTemplateDetail = dataTables[0][0][0];
		var boxTags = dataTables[1][0];
		var boxItems = dataTables[2][0];
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "RemoveButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, BoxTemplateHandler.elActionPaneDiv);
		
		//Remove Button
		var btnRemove = new OPButton("RemoveButton",
									l10nMsg["text_20"], 
									BoxTemplateHandler.elActionPaneDiv,
									BoxTemplateHandler.RemoveBoxTemplate,
									{ boxTemplateSN : boxTemplateDetail.boxTemplateSN });
		BoxGlobal.BoxSectionResourceMan.Add("btnRemove", btnRemove);

		//Display Data
		var elTable = CruiseGlobal.CreateElement("TABLE", "BoxInfoTable", BoxTemplateHandler.elBasePaneDiv, "BoxInfoTable");
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_boxTemplateSN"], boxTemplateDetail.boxTemplateSN], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_boxTemplateTitle"], boxTemplateDetail.boxTemplateTitle], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_boxTemplateServiceSN"], boxTemplateDetail.boxTemplateServiceSN], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_boxTemplateCreateUserSN"], boxTemplateDetail.boxTemplateCreateUserSN], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_boxTemplateCreateDateTime"], boxTemplateDetail.boxTemplateCreateDateTime], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_boxTemplateStartActivationDateTime"], boxTemplateDetail.boxTemplateStartActivationDateTime], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_boxTemplateEndActivationDateTime"], boxTemplateDetail.boxTemplateEndActivationDateTime], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_boxTemplateActivateDurationAfterOpen"], boxTemplateDetail.boxTemplateActivateDurationAfterOpen], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_boxTemplateVisableFlagBeforeActivation"], boxTemplateDetail.boxTemplateVisableFlagBeforeActivation], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_boxTemplateEnableFlag"], BoxGlobal.GetCodeText('enableFlag', boxTemplateDetail.boxTemplateEnableFlag)], elTable);
		
		var boxTagData = [];
		var boxItemData = [];
		
		for (boxTag in boxTags) {
			boxTagData.push({boxTagName: boxTags[boxTag].boxTagName,
						     boxTagValue: boxTags[boxTag].boxTagValue});
		}
		
		for (boxItem in boxItems) {
			boxItemData.push({mappingItemSN: boxItems[boxItem].itemSN,
							  serviceItemTagName: boxItems[boxItem].serviceItemTagName,
							  serviceItemTagValue: boxItems[boxItem].serviceItemTagValue});
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
				 {	JSArrayObejct : { data : boxItemData },
	    			l10nObj : l10nMsg,
					formatRow : BoxMainLogic.BoxBaseFormatter,
					selectionMode : "null"});
		
		BoxGlobal.BoxPageResourceMan.Add("BoxTagDataTable", BoxTagDataTable);
		BoxGlobal.BoxPageResourceMan.Add("ServiceItemDataTable", ServiceItemDataTable);
	},
	RemoveBoxTemplate : function (event, objs)
	{
	    var RemoveProcess = function (){
			var _callback = function(o, messages) {
				if (!BoxGlobal.ValidateResponse(messages)) return;
				CruiseGlobal.SHOWINFO(l10nMsg["text_20"], objs.boxTemplateSN + l10nMsg["msg_55"], l10nMsg["text_09"]);
				BoxTemplateHandler.GetDetailBoxTemplate(objs.boxTemplateSN);
				BoxTemplateHandler.objParentOPTable.Refresh();
			};
			
			OPAjaxRequest("POST", "removeBoxTemplate", _callback, "boxTemplateSN=" + objs.boxTemplateSN);
			this.hide();
			BoxGlobal.ShowLoading();
	    };
	    
	    var qstBox = new OPMsgBox ("ConfirmRemove", 
	    							objs.boxTemplateSN + l10nMsg["msg_54"],
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
		BoxTemplateHandler.ModifyServiceItem_Layout(objs.aBox);

	},
	ModifyServiceItem_Layout : function (aBox)
	{
		BoxTemplateHandler.InitializePane();
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "ConfirmButton"));
		elArray.push(CruiseGlobal.CreateElement("SPAN", "CancelButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, BoxTemplateHandler.elActionPaneDiv);
		
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
			
			BoxTemplateHandler.ModifyBoxTag_Confirm(modify_boxTagSN, newBoxTagName, newBoxTagDescription);
		};
		//Confirm Button
		var btnConfirm = new OPButton("ConfirmButton",
									l10nMsg["text_09"], 
									BoxTemplateHandler.elActionPaneDiv,
									btnConfirm_Callback);
		BoxGlobal.BoxSectionResourceMan.Add("btnConfirm", btnConfirm);

		//Cancel Button
		var btnCancel = new OPButton("CancelButton",
									l10nMsg["text_10"], 
									BoxTemplateHandler.elActionPaneDiv,
									function () { BoxTemplateHandler.GetDetailBox(BoxTemplateHandler.boxSN); });
		BoxGlobal.BoxSectionResourceMan.Add("btnCancel", btnCancel);
		
		//Input Area
		var elTable = CruiseGlobal.CreateElement("TABLE", "BoxInfoTable", BoxTemplateHandler.elBasePaneDiv, "BoxInfoTable");
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
				BoxTemplateHandler.objParentOPTable.Refresh();
				if (!BoxGlobal.ValidateResponse(messages)) 
				{ 
					//CruiseGlobal.SHOWINFO (l10nMsg["text_11"], l10nMsg["msg_20"], l10nMsg["text_09"]); 
					return;
				}
				BoxTemplateHandler.GetBoxTag(messages.newBoxTagSN);
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