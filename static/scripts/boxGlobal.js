/*==================================
    
       BoxGlobal Scripts
        
====================================*/

CruiseEvent.onDOMReady(function() {
});

var BoxGlobal = {

	ValueContainer : {},
	IndividualData : {
		BoxDatatablePageSize : 10
	},
	DefaultPaginatorConfig : function () {
		return {
		"customPageLinks" : 5,
		"template" : "{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink} {RowsPerPageDropdown}",
		"rowsPerPageOptions" : [10, 30, 50],
		"firstPageLinkLabel" : l10nMsg["text_16"],
		"lastPageLinkLabel" : l10nMsg["text_19"],
		"previousPageLinkLabel" : l10nMsg["text_17"],
		"nextPageLinkLabel" : l10nMsg["text_18"]};
	},
	BoxPageResourceMan : new OPResourceManager(),
	BoxSectionResourceMan : new OPResourceManager(),
	
	//Functions
	SetValue : function (key, value)
	{
		BoxGlobal.ValueContainer[key] = value;
	},
	GetValue : function (key)
	{
		return BoxGlobal.ValueContainer[key];
	},
	ShowLoading : function ()
	{
		CruiseGlobal.SHOWLOADING.show();
	},
	HideLoading : function ()
	{
		CruiseGlobal.SHOWLOADING.hide();
	},
	ShowInnerLoading : function (parentDiv)
	{
		CruiseGlobal.CreateElement("div", "InnerLoadingDiv_" + parentDiv.id, parentDiv, "InnerLoadingDiv");
		CruiseGlobal.SetHTML("InnerLoadingDiv_" + parentDiv.id, iconsIMG.loader_mid2, true);
	},
	HideInnerLoading : function (parentDiv)
	{
		CruiseGlobal.RemoveElement("InnerLoadingDiv_" + parentDiv.id, parentDiv);
	},
	InitQuickMenuContainer : function ()
	{
		var baseLeft = CruiseGlobal.GetEl("baseLeft");
		CruiseGlobal.CreateElement("DIV", "leftMenuStatus", baseLeft, null, {paddingTop : "1px", body: "<br><center><b>" + l10nMsg["msg_12"] + "</center></b>"});
	},
	GetCodeText : function (codeName, value)
	{
		return l10nMsg["code_" + codeName + "_" + value];
	},
	GetPaneText : function (key)
	{
		return l10nMsg["PaneText_" + key.toString() ];
	},
	ValidateResponse : function (response, config)
	{
		if (response == null || response.returnCode == null){
			return false;
		}
		
		if (!BoxErrorCode.IsSuccess(response.returnCode))
		{
			if (response.exceptionFlag == 1){
				SHOW_ERROR_PANEL(response);
				return false;
			}
			
			if (BoxGlobal.GetValue("IsAlreadyShowMsg") == true){
				return;
			}
			
			retCode = response.returnCode;
			var errMsg = BoxErrorCode.GetErrorMsg(retCode);
			var errHeader = l10nMsg["text_11"];
			var rtnFocusID = null;
			
			if (config)
			{
				if (config.errMsg)
					errMsg = config.errMsg;
				if (config.errHeader)
					errHeader = config.errHeader;
				if (config.noMsgBox && retCode != BoxErrorCode.SESSION_EXPIRED)
					return false;
				if (config.exceptionReturnCode)
					for (index in config.exceptionReturnCode)
						if (config.exceptionReturnCode[index] == retCode)
							return true;
							
				if (config.returnFocusID)
					rtnFocusID = config.returnFocusID;
					
				if (config.redirectPage)
					redirectPage = config.redirectPage;
			}
						
			var msgBox = new OPMsgBox ("ResponseError",
		    							errMsg,
		    							errHeader,
		    							{isFixedCenter: true,
		    							isDraggable: true,
		    							isClose: false,
		    							isModal: true
		             					});
		    
			BoxGlobal.SetValue("IsAlreadyShowMsg", true);
			
			var msgBoxHandler = function(){
				msgBox.OK();
				BoxGlobal.SetValue("IsAlreadyShowMsg", false);
			};
			if (retCode == BoxErrorCode.SESSION_EXPIRED)
			{	
				msgBoxHandler = function() {
					msgBox.OK();
					window.location = "./";
				};
			}
			if (config && config.redirectPage)
			{
				msgBoxHandler = function() {
					msgBox.OK();
					window.location = redirectPage;
				};
			}	
			
		    msgBox.SetButtons([	{ text: l10nMsg["text_09"], handler:msgBoxHandler, isDefault:true }]);
		    msgBox.SetICON("alarm");
		    msgBox.Show();
		   
		    return false;
		}
		return true;
	},
	FixOverLimitInputValue : function (id, len)
	{
		var text = CruiseGlobal.GetEl(id).value;
		if (text.length > len)
		{
			CruiseGlobal.GetEl(id).value = text.substr(0, len);
			return false;
		}
		return true;
	},
	MakeSearchLayoutHTMLTable : function (arrDivInsideTD, parentDiv)
	{
		var elTable = CruiseGlobal.CreateElement("TABLE", "SearchTable", parentDiv, "searchTable");
		var elTR = CruiseGlobal.CreateElement("TR", "SearchTableTR", elTable);
		
		for (index in arrDivInsideTD)
		{
			var newTD = CruiseGlobal.CreateElement("TD", "SearchTableTD_" + index, elTR, "searchTableTD");
			newTD.appendChild(arrDivInsideTD[index]);
		}
		return elTable;
	},
	MakeLayoutHTMLTable : function (arrDivInsideTD, parentDiv, tableClass, tdClass)
	{
		var elTable = CruiseGlobal.CreateElement("TABLE", "HtmlTable", parentDiv, tableClass);
		var elTR = CruiseGlobal.CreateElement("TR", "HtmlTableTR", elTable);
		
		for (index in arrDivInsideTD)
		{
			var newTD = CruiseGlobal.CreateElement("TD", "HtmlTableTD_" + index, elTR, tdClass);
			newTD.appendChild(arrDivInsideTD[index]);
		}
		return elTable;
	},
	MakeLayoutTR_HTML : function (arrHTMLInsideTD, elParentTable)
	{
		var elTR = CruiseGlobal.CreateElement("TR", "HtmlTableTR", elParentTable, "BoxInfoTR");
		for (index in arrHTMLInsideTD)
		{
			var newTD = CruiseGlobal.CreateElement("TD", "HtmlTableTD_" + index, elTR, "BoxInfoTD");
			newTD.innerHTML = arrHTMLInsideTD[index];
		}
		return elTR;
	},
	MakeLayoutTR_INPUT : function (LabelText, htmlTag, elParentTable)
	{
		var elTR = CruiseGlobal.CreateElement("TR", "HtmlTableTR", elParentTable, "BoxInputTR");
		if (LabelText != null){
			var labelTD = CruiseGlobal.CreateElement("TD", "HtmlTableTD_Label", elTR, "BoxInputLabelTD");
			labelTD.innerHTML = LabelText;
		}
		tagTD = CruiseGlobal.CreateElement("TD", "HtmlTableTD_" + htmlTag.id, elTR, "BoxInputTD");
		tagTD.appendChild(htmlTag);
		
		if (LabelText == null) {
			tagTD.colSpan = "2";
		}
		
		return elTR;
	}
};