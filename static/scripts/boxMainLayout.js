/*==================================
    
    Box Layout Scripts
        
====================================*/

CruiseEvent.onDOMReady(function() {
	CruiseGlobal.SetElHide("BoxBaseDIV");
    CheckLoadingProcess(BoxLayout.LoadBaseLayout);
});

BoxGlobal.baseLayout = null;
BoxGlobal.baseInnerLayout = null;
BoxGlobal.leftCenterLayout = null;
BoxGlobal.rightCenterLayout = null;

var BoxLayout = {
	InitBaseLayoutCenter : function ()
	{
		var center = BoxGlobal.baseLayout.GetUnitByPosition("center");
		center.get("element").appendChild(center.get("wrap"));
		center.body = center.get("wrap").firstChild;
		BoxGlobal.baseLayout.Resize();
	},
	InitBoxLayoutCenter : function ()
	{
		var center = BoxGlobal.baseInnerLayout.GetUnitByPosition("center");
		center.get("element").appendChild(center.get("wrap"));
		center.body = center.get("wrap").firstChild;
		BoxGlobal.baseInnerLayout.Resize();
	},
	InitBoxLayoutRight : function ()
	{
		var right = BoxGlobal.baseInnerLayout.GetUnitByPosition("right");
		right.get("element").appendChild(right.get("wrap"));
		right.body = right.get("wrap").firstChild;
		BoxGlobal.baseInnerLayout.Resize();
	},
	LoadBaseLayout : function (eventLoadBaseLayoutReady)
	{
		CruiseGlobal.SetHTML("releaseName", l10nMsg["productTitle"]);
		CruiseGlobal.SetHTML("version", l10nMsg["version"]);
		CruiseGlobal.RemoveElement("loadingParentDiv");
	    BoxGlobal.baseLayout = new OPLayout ("baseLayout", 
	        [
	            { position: 'top', height: 94, body: 'baseTop', scroll: null, zIndex: 2 },
	            { position: 'bottom', height: 40, gutter: '2 0 0 0', body: 'baseBottom'},
	            { position: 'left', width: 150, gutter: '2 2 1 1', header: l10nMsg['text_12'], body: 'baseLeft', collapse: true, scroll: true, zIndex: 1 },
	            { position: 'center', scroll: false, resize: true}
	        ]);
	        
	    BoxLayout.InitBaseLayoutCenter();

		function ResizeEventFired (event, args, isInit)
		{
			CruiseLog.Debug("LoadDefaultLayout.ResizeEventFired :: Resize event fired");
			//Resize Logic needed
			if (BoxGlobal.baseInnerLayout.GetWidth('right') > BoxGlobal.baseLayout.GetWidth('center') - 200)
				BoxGlobal.baseInnerLayout.SetWidth('right', BoxGlobal.baseLayout.GetWidth('center') - 200);
		}
		
		var leftPaneDefaultDiv = CruiseGlobal.CreateElement("div", "leftPaneDefaultDiv", null, "PaneDefaultDiv", { body : l10nMsg['msg_13'] });
		var rightPaneDefaultDiv = CruiseGlobal.CreateElement("div", "rightPaneDefaultDiv", null, "PaneDefaultDiv", { body : l10nMsg['msg_14'] });
		
		BoxGlobal.baseInnerLayout = new OPLayout ("BoxGlobal.baseInnerLayout",
			[
				{ position: 'center', body: leftPaneDefaultDiv, gutter: '2 2 2 2', scroll: false, resize: false},
			    { position: 'right', body: rightPaneDefaultDiv, gutter: '2 2 2 5', minWidth: 200, scroll: true, resize: true}
			    
			],
			BoxGlobal.baseLayout.GetWrap("center"),
			ResizeEventFired,
			BoxGlobal.baseLayout);
			
		BoxGlobal.baseInnerLayout.SetWidth('right', BoxGlobal.baseLayout.GetWidth("center") / 1.9);

	 	//Logout div
	 	var elArray = new Array();
	 	elArray.push(CruiseGlobal.CreateElement("DIV", "AccountInfo", CruiseGlobal.GetEl("loginStatusDiv"), "AccountInfoDiv",
	 											{body: BoxGlobal.GetValue("userAccount") + l10nMsg["msg_09"]}));

	 	elArray.push(CruiseGlobal.CreateElement("DIV", "LogoutButton", CruiseGlobal.GetEl("loginStatusDiv")));
		var btnEndWork = new OPButton("LogoutButton", l10nMsg["text_08"], null , BoxLogout);
		
		var elTable = BoxGlobal.MakeLayoutHTMLTable(elArray, CruiseGlobal.GetEl("loginStatusDiv"), "logoutTable", "logoutTableTD");
		elTable.align = "right";

		if (eventLoadBaseLayoutReady)
			eventLoadBaseLayoutReady(BoxGlobal.baseLayout);
			
		// Menu Loading
		LoadMenuBar();
	    LoadLeftMenu();
	},
	LoadLeftCenterLayout : function (panes, arrResizable)
	{
		BoxLayout.InitBoxLayoutCenter();
		function ResizeEventFired (event, args, isInit)
		{
			CruiseLog.Debug("LoadLeftCenterLayout.ResizeEventFired :: Resize event fired");
			document.getElementById("DataListSection").style.height = (BoxGlobal.baseInnerLayout.GetHeight("center") - 108).toString() + "px";
			//Resize Logic needed
		}

		if (!panes)
			panes = new Array();
		panes.push({ position: 'center', body: 'innerLeftCenter', gutter: '0 0 0 0', scroll: true, resize: false});
		
	    BoxGlobal.leftCenterLayout = new OPLayout ("leftCenterLayout",
			panes,
	        BoxGlobal.baseInnerLayout.GetWrap("center"),
	        ResizeEventFired,
	        BoxGlobal.baseInnerLayout);
	        
	    ResizeEventFired(null, null, true);
	    
	    BoxGlobal.BoxPageResourceMan.Add("leftCenterLayout", BoxGlobal.leftCenterLayout);
	},
	LoadRightCenterLayout : function (panes, arrResizable)
	{
		BoxLayout.InitBoxLayoutRight();
		function ResizeEventFired (event, args, isInit)
		{
			CruiseLog.Debug("LoadRightCenterLayout.ResizeEventFired :: Resize event fired");
			//Resize Logic needed	
		}

		if (!panes)
			panes = new Array();
		panes.push({ position: 'center', body: 'innerRightCenter', gutter: '0 0 0 0', scroll: true, resize: false});
		
	    BoxGlobal.rightCenterLayout = new OPLayout ("rightCenterLayout",
			panes,
	        BoxGlobal.baseInnerLayout.GetWrap("right"),
	        ResizeEventFired,
	        BoxGlobal.baseInnerLayout);
	        
	    ResizeEventFired(null, null, true);
	    
	    BoxGlobal.BoxPageResourceMan.Add("rightCenterLayout", BoxGlobal.rightCenterLayout);
	},
	CommonInnerLeft : function () {
		var newDiv = CruiseGlobal.CreateElement("div", "innerLeftCenter");
		CruiseGlobal.CreateElement("div", "LeftPaneNameArea", newDiv, "PaneNameArea");
		CruiseGlobal.CreateElement("div", "DataListActionSection", newDiv, "DataListAction");
		CruiseGlobal.CreateElement("div", "DataListSection", newDiv, "DataListSection");
	},
	LoadDefaultRightLayout : function (config) {
		BoxGlobal.BoxPageResourceMan.Remove("rightCenterLayout");
		
		var newDiv = CruiseGlobal.CreateElement("div", "innerRightCenter");
		CruiseGlobal.CreateElement("div", "RightPaneNameArea", newDiv, "PaneNameArea");
		var actionPane = CruiseGlobal.CreateElement("div", "DataHandlerActionSection", newDiv, "DataHandlerActionSection");
		var basePane = CruiseGlobal.CreateElement("div", "ManipulationSection", newDiv, "ManipulationSection");
		var bottomPane = CruiseGlobal.CreateElement("div", "BottomSection", newDiv, "BottomSection");
		
		CruiseGlobal.SetHTML("RightPaneNameArea", BoxGlobal.GetPaneText(config.paneCode), true);
		
		BoxLayout.LoadRightCenterLayout();
		
		return [actionPane, basePane, bottomPane];
	},
	// config.paneCode : PaneName text resource number
	LoadTagListLayout : function (btnClickCallback, config) {
		BoxGlobal.BoxPageResourceMan.Remove("leftCenterLayout");

		this.CommonInnerLeft();
		CruiseGlobal.SetHTML("LeftPaneNameArea", BoxGlobal.GetPaneText(config.paneCode), true);
		
		var innerCallback = function ()
		{
			btnClickCallback ({ enableFlag : CruiseGlobal.GetElementValue("enableFlagSelect"),
								tagName : CruiseGlobal.GetElementValue("SearchText") });
		};
		
		//Build Divs
		var dataPaginationDIV = CruiseGlobal.CreateElement("DIV", "DataListPaginateSection", CruiseGlobal.GetEl("DataListActionSection"), null, {paddingLeft : "30px"});
		var searchCriteriaDIV = CruiseGlobal.CreateElement("DIV", "searchCriteriaDIV", CruiseGlobal.GetEl("DataListActionSection"));

		var elArray = new Array();
		elArray.push(searchCriteriaDIV);
		elArray.push(CruiseGlobal.CreateElement("SPAN", "SearchButton"));
		elArray.push(dataPaginationDIV);
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, document.getElementById("DataListActionSection"));
		
		//Option Tag
		var enableFlagSelect = CruiseGlobal.CreateElement("SELECT", "enableFlagSelect", searchCriteriaDIV);
		CruiseGlobal.CreateElement("OPTION", null, enableFlagSelect, null, {value: 1, body: l10nMsg["text_14"]});
		CruiseGlobal.CreateElement("OPTION", null, enableFlagSelect, null, {value: 0, body: l10nMsg["text_15"]});		
		var selectKeyListener = new CruiseEvent.CreateKeyListener (enableFlagSelect, 13, innerCallback, this, false, false, this);
		selectKeyListener.enable();
		
		//Input Tag
		var elInputArea = CruiseGlobal.CreateElement("INPUT", "SearchText", searchCriteriaDIV, "txtInputVerySmall");
		var keyListener = new CruiseEvent.CreateKeyListener (elInputArea, 13, innerCallback, this, false, false, this);
		keyListener.enable();
		
		//Search Button
		var btnSearch = new OPButton("SearchButton", l10nMsg["text_13"], null, function (){ innerCallback(); });
		btnSearch.SetHeight(20);
		
		//Resource Regiatration
		BoxGlobal.BoxPageResourceMan.Add("btnSearch", btnSearch);			
	},
	LoadCreateItemTagLayout : function (btnConfirmCallback) {
		PaneArray = BoxLayout.LoadDefaultRightLayout ({ paneCode : 3 });
		elActionPaneDiv = PaneArray[0];
		elBasePaneDiv = PaneArray[1];
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "ConfirmButton"));
		elArray.push(CruiseGlobal.CreateElement("SPAN", "CancelButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, elActionPaneDiv);
		
		//Confirm Button
		var btnConfirm = new OPButton("ConfirmButton",
									l10nMsg["text_23"], 
									elActionPaneDiv,
									btnConfirmCallback);
		BoxGlobal.BoxSectionResourceMan.Add("btnConfirm", btnConfirm);
	
		//Input Area
		var elTable = CruiseGlobal.CreateElement("TABLE", "BoxInfoTable", elBasePaneDiv, "BoxInfoTable");
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemTagName"],
									CruiseGlobal.CreateElement("INPUT", "inputServiceItemTagName", null, "txtInputNormal", { maxlength : 50 }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemTagDescription"],
									CruiseGlobal.CreateElement("INPUT", "inputServiceItemTagDescription", null, "txtInputBig", { maxlength : 500 }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemValidationRuleSN"],
									CruiseGlobal.CreateElement("INPUT", "inputServiceItemValidationRuleSN", null, "txtInputVerySmall", { maxlength : 1 }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT('', CruiseGlobal.CreateElement("SPAN", "spanServiceItemValidationRuleSN", null, null, { body: l10nMsg["text_56"] }), elTable);
	},
	LoadCreateBoxTagLayout : function (btnConfirmCallback) {
		PaneArray = BoxLayout.LoadDefaultRightLayout ({ paneCode : 6 });
		elActionPaneDiv = PaneArray[0];
		elBasePaneDiv = PaneArray[1];
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "ConfirmButton"));
		elArray.push(CruiseGlobal.CreateElement("SPAN", "CancelButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, elActionPaneDiv);
		
		//Confirm Button
		var btnConfirm = new OPButton("ConfirmButton",
									l10nMsg["text_23"], 
									elActionPaneDiv,
									btnConfirmCallback);
		BoxGlobal.BoxSectionResourceMan.Add("btnConfirm", btnConfirm);
	
		//Input Area
		var elTable = CruiseGlobal.CreateElement("TABLE", "BoxInfoTable", elBasePaneDiv, "BoxInfoTable");
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_boxTagName"],
									CruiseGlobal.CreateElement("INPUT", "inputBoxTagName", null, "txtInputNormal", { maxlength : 50 }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_boxTagDescription"],
									CruiseGlobal.CreateElement("INPUT", "inputBoxTagDescription", null, "txtInputBig", { maxlength : 500 }), elTable);
	},
	// config.paneCode : PaneName text resource number
	LoadServiceItemListLayout : function (btnClickCallback, config) {
		BoxGlobal.BoxPageResourceMan.Remove("leftCenterLayout");

		this.CommonInnerLeft();
		CruiseGlobal.SetHTML("LeftPaneNameArea", BoxGlobal.GetPaneText(config.paneCode), true);
		
		var innerCallback = function ()
		{
			btnClickCallback ({ enableFlag : CruiseGlobal.GetElementValue("enableFlagSelect"),
								searchText : CruiseGlobal.GetElementValue("SearchText") });
		};
		
		//Build Divs
		var dataPaginationDIV = CruiseGlobal.CreateElement("DIV", "DataListPaginateSection", CruiseGlobal.GetEl("DataListActionSection"), null, {paddingLeft : "30px"});
		var searchCriteriaDIV = CruiseGlobal.CreateElement("DIV", "searchCriteriaDIV", CruiseGlobal.GetEl("DataListActionSection"));

		var elArray = new Array();
		elArray.push(searchCriteriaDIV);
		elArray.push(CruiseGlobal.CreateElement("SPAN", "SearchButton"));
		elArray.push(dataPaginationDIV);
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, document.getElementById("DataListActionSection"));
		
		//Option Tag
		var enableFlagSelect = CruiseGlobal.CreateElement("SELECT", "enableFlagSelect", searchCriteriaDIV);
		CruiseGlobal.CreateElement("OPTION", null, enableFlagSelect, null, {value: 1, body: l10nMsg["text_14"]});
		CruiseGlobal.CreateElement("OPTION", null, enableFlagSelect, null, {value: 0, body: l10nMsg["text_15"]});		
		var selectKeyListener = new CruiseEvent.CreateKeyListener (enableFlagSelect, 13, innerCallback, this, false, false, this);
		selectKeyListener.enable();
		
		//Input Tag
		var elInputArea = CruiseGlobal.CreateElement("INPUT", "SearchText", searchCriteriaDIV, "txtInputVerySmall");
		var keyListener = new CruiseEvent.CreateKeyListener (elInputArea, 13, innerCallback, this, false, false, this);
		keyListener.enable();
		
		//Search Button
		var btnSearch = new OPButton("SearchButton", l10nMsg["text_13"], null, function (){ innerCallback(); });
		btnSearch.SetHeight(20);
		
		//Resource Regiatration
		BoxGlobal.BoxPageResourceMan.Add("btnSearch", btnSearch);
	},
	// config.paneCode : PaneName text resource number
	LoadBoxListLayout : function (btnClickCallback, config) {
		BoxGlobal.BoxPageResourceMan.Remove("leftCenterLayout");

		this.CommonInnerLeft();
		CruiseGlobal.SetHTML("LeftPaneNameArea", BoxGlobal.GetPaneText(config.paneCode), true);
		
		var innerCallback = function ()
		{	
			if (CruiseGlobal.GetElementValue("SearchTextReceiverUserSN") == "" || CruiseGlobal.GetElementValue("SearchTextReceiverUserSN") == null){
				CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_93"], l10nMsg["text_09"]);
				return;
			}
			if (!btnUnopened.GetChecked() && !btnOpened.GetChecked() && !btnUsed.GetChecked() && !btnDeleted.GetChecked()){
				CruiseGlobal.SHOWINFO (l10nMsg["text_22"], l10nMsg["msg_92"], l10nMsg["text_09"]);
				return;
			}
			
			var boxStateSearchCode = 0;
			if (btnUnopened.GetChecked())
				boxStateSearchCode += 1;
			if (btnOpened.GetChecked())
				boxStateSearchCode += 2;
			if (btnUsed.GetChecked())
				boxStateSearchCode += 4;
			if (btnDeleted.GetChecked())
				boxStateSearchCode += 8;
			
			btnClickCallback ({receiverUserSN : CruiseGlobal.GetElementValue("SearchTextReceiverUserSN"),
							   receiverGUSID : CruiseGlobal.GetElementValue("SearchTextReceiverGUSID"),
							   receiverCharacterSN : CruiseGlobal.GetElementValue("SearchTextReceiverCharacterSN"),
							   boxStateSearchCode : boxStateSearchCode});
		};
		
		//Build Divs
		var searchCriteriaDIV = CruiseGlobal.CreateElement("DIV", "searchCriteriaDIV", CruiseGlobal.GetEl("DataListActionSection"));
		
		var elArray = new Array();
		elArray.push(searchCriteriaDIV);
		elArray.push(CruiseGlobal.CreateElement("SPAN", "SearchButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, document.getElementById("DataListActionSection"));
		
		var dataPaginationDIV = CruiseGlobal.CreateElement("DIV", "DataListPaginateSection", CruiseGlobal.GetEl("DataListActionSection"), null, {paddingLeft : "10px"});
		var stateCriteriaDIV = CruiseGlobal.CreateElement("DIV", "stateCriteriaDIV", CruiseGlobal.GetEl("DataListActionSection"));
		
		var elArray = new Array();
		elArray.push(stateCriteriaDIV);
		elArray.push(dataPaginationDIV);
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, document.getElementById("DataListActionSection"));
		
		var btnUnopened = new OPCheckedButton("GetUnopened", "Unopened", "GetUnopened", stateCriteriaDIV, true, innerCallback);
		var btnOpened = new OPCheckedButton("GetOpened", "Opened", "GetOpened", stateCriteriaDIV, true, innerCallback);
		var btnUsed = new OPCheckedButton("GetUsed", "Used", "GetUsed", stateCriteriaDIV, true, innerCallback);
		var btnDeleted = new OPCheckedButton("GetDeleted", "Deleted", "GetDeleted", stateCriteriaDIV, false, innerCallback);
		
		//Input Tag
		CruiseGlobal.CreateElement("LABEL", "receiverUserSN_label", searchCriteriaDIV, null, { body: l10nMsg["text_30"], paddingRight: "10px" });
		var elInputArea = CruiseGlobal.CreateElement("INPUT", "SearchTextReceiverUserSN", searchCriteriaDIV, "txtInputVerySmall");
		var keyListener = new CruiseEvent.CreateKeyListener (elInputArea, 13, innerCallback, this, false, false, this);
		keyListener.enable();
		
		CruiseGlobal.CreateElement("LABEL", "receiverGUSID_label", searchCriteriaDIV, null, {body: l10nMsg["text_31"], paddingRight: "10px", paddingLeft: "10px"});
		var elInputArea = CruiseGlobal.CreateElement("INPUT", "SearchTextReceiverGUSID", searchCriteriaDIV, "txtInputVerySmall");
		var keyListener = new CruiseEvent.CreateKeyListener(elInputArea, 13, innerCallback, this, false, false, this);
		keyListener.enable();
		
		CruiseGlobal.CreateElement("LABEL", "receiverCharacterSN_label", searchCriteriaDIV, null, {body: l10nMsg["text_32"], paddingRight: "10px", paddingLeft: "10px"});
		var elInputArea = CruiseGlobal.CreateElement("INPUT", "SearchTextReceiverCharacterSN", searchCriteriaDIV, "txtInputVerySmall");
		var keyListener = new CruiseEvent.CreateKeyListener(elInputArea, 13, innerCallback, this, false, false, this);
		keyListener.enable();
		
		//Search Button
		var btnSearch = new OPButton("SearchButton", l10nMsg["text_13"], null, innerCallback);
		btnSearch.SetHeight(20);
		
		//Resource Regiatration
		BoxGlobal.BoxPageResourceMan.Add("btnSearch", btnSearch);
//		BoxGlobal.BoxPageResourceMan.Add("keyListener", keyListener);
		BoxGlobal.BoxPageResourceMan.Add("btnUnopened", btnUnopened);
		BoxGlobal.BoxPageResourceMan.Add("btnOpened", btnOpened);
		BoxGlobal.BoxPageResourceMan.Add("btnUsed", btnUsed);
		BoxGlobal.BoxPageResourceMan.Add("btnDeleted", btnDeleted);
	},
	LoadCreateServiceItemLayout : function (btnConfirmCallback, config) {
		PaneArray = BoxLayout.LoadDefaultRightLayout ({ paneCode : config.paneCode });
		elActionPaneDiv = PaneArray[0];
		elBasePaneDiv = PaneArray[1];
		
		var ItemTagDataTable = null;
		var ItemTagSelectDataTable = null;
		
		var elItemMappingSN = null;
		var elServiceSN = null;
		var elYear = null, elMonth = null, elDay = null, elHour = null, elMinute = null;
		var elEnableFlag = null;
		var elItemName = null;
		var ItemTagSelectedData = [];
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "ConfirmButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, elActionPaneDiv);
		
		var btnBeforeConfirmCallback = function (event)
		{
			btnConfirmCallback (event, {
											itemMappingSN : elItemMappingSN.value,
											serviceSN : elServiceSN.value,
											startActivationTime : CruiseGlobal.ToTimeFormatString(elYear.value, elMonth.value, elDay.value, elHour.value, elMinute.value, 0),
											enableFlag : (elEnableFlag.checked) ? elEnableFlag.value : 0,
											itemName : elItemName.value,
											itemDescription : (elItemDescription.value.length > 0) ? elItemDescription.value : "",
											tagData : ItemTagSelectedData
										});
		}
		//Confirm Button
		var btnConfirm = new OPButton("ConfirmButton",
									l10nMsg["text_23"], 
									elActionPaneDiv,
									btnBeforeConfirmCallback);
		BoxGlobal.BoxSectionResourceMan.Add("btnConfirm", btnConfirm);
		
		//Input Area
		var elTable = CruiseGlobal.CreateElement("TABLE", "ServiceItemRegisterTable", elBasePaneDiv, "BoxInfoTable");
		
		// serviceSN
		elServiceSN = CruiseGlobal.CreateElement("SELECT", "inputServiceSN", null, "txtInputVerySmall");
		CruiseGlobal.CreateElement("OPTION", null, elServiceSN, null, {value: 1, body: l10nMsg["text_24"]});	
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemServiceSN"], elServiceSN, elTable);
		
		// itemMappingSN
		elItemMappingSN = CruiseGlobal.CreateElement("INPUT", "inputServiceItemMappingItemSN", null, "txtInputSmall", { maxlength : 18 });
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemMappingItemSN"], elItemMappingSN, elTable);
		
		// itemName
		elItemName = CruiseGlobal.CreateElement("INPUT", "inputServiceItemName", null, "txtInputSmall", { maxlength : 255 });
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemName"], elItemName, elTable);
		
		// itemDescription
		elItemDescription = CruiseGlobal.CreateElement("INPUT", "inputServiceItemDescription", null, "txtInputBig", { maxlength : 1024 });
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemDescription"], elItemDescription, elTable);
		
		// DateTime Section
		var elActivationDatetime = CruiseGlobal.CreateElement("DIV", "activationDatetime");
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemStartActivationDateTime"], elActivationDatetime, elTable);
		
		// Calendar Section
		var elDate = CruiseGlobal.CreateElement("DIV", "DateSectionDiv", elActivationDatetime);
		var elDateTimeButton = CruiseGlobal.CreateElement("DIV", "divActivationDateTimePicker", elActivationDatetime);
		var elTime = CruiseGlobal.CreateElement("DIV", "TimeSectionDiv", elActivationDatetime);
		
		// Positioning DateTime Section
		var elArray = new Array();
		elArray.push(elDate);
		elArray.push(elDateTimeButton);
		elArray.push(elTime);
		BoxGlobal.MakeLayoutHTMLTable(elArray, elActivationDatetime);
		
		// Create DateTime Picker
		var dateLabel = CruiseGlobal.CreateElement("LABEL", "lblDate", elDate, null, {body: l10nMsg["text_25"], paddingRight: "10px"});
		var objDate = OPCalendar.MakeDatePicker ("serviceItemDatePicker", elDate, elDateTimeButton, { headerLabel : l10nMsg["msg_31"] });
		elYear = objDate.elementYear;
		elMonth = objDate.elementMonth;
		elDay = objDate.elementDay;
		BoxGlobal.BoxSectionResourceMan.Add("dateCalendar", objDate.objCalendar);
		
		var timeLabel = CruiseGlobal.CreateElement("LABEL", "lblTime", elTime, null, {body: l10nMsg["text_26"], paddingLeft: "10px", paddingRight: "10px"});
		var objTime = OPCalendar.MakeTimePicker ("serviceItemTimePicker", elTime, { isUseSeconds : false });
		elHour = objTime.elementHour;
		elMinute = objTime.elementMinute;
		
		// useFlag Section
		var elEnableFlagRadio = CruiseGlobal.CreateElement("DIV", "serviceItemEnableFlag");
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemEnableFlag"], elEnableFlagRadio, elTable);
		elEnableFlag = CruiseGlobal.CreateElement("INPUT", null, elEnableFlagRadio, null, {type: "RADIO", name: "serviceItemEnableFlag[]", value : 1});
		elEnableFlag.checked = true;
		CruiseGlobal.CreateElement("SPAN", "enableFlagRadio", elEnableFlagRadio, null, {body: BoxGlobal.GetCodeText("enableFlag", 1), paddingRight: "10px"});
		CruiseGlobal.CreateElement("INPUT", null, elEnableFlagRadio, null, {type: "RADIO", name: "serviceItemEnableFlag[]", value : 0});
		CruiseGlobal.CreateElement("SPAN", "disableFlagRadio", elEnableFlagRadio, null, {body: BoxGlobal.GetCodeText("enableFlag", 0)});
		
		var serviceItemTagDIV = CruiseGlobal.CreateElement("DIV", "serviceItemTagDIV");
		var addServiceItemTagSPAN = CruiseGlobal.CreateElement("SPAN", "addServiceItemTagSPAN", serviceItemTagDIV);
		var initServiceItemTagSPAN = CruiseGlobal.CreateElement("SPAN", "initServiceItemTagSPAN", serviceItemTagDIV);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemTag"], serviceItemTagDIV, elTable);
		
		var callback_getServiceItemTag = function(o, messages) {
			if (!BoxGlobal.ValidateResponse(messages))
				return;
			
			var info = messages.returnTables[0][0][0];
			
			ItemTagSelectedData.push({
				serviceItemTagSN : info.serviceItemTagSN,
				serviceItemTagName : info.serviceItemTagName,
				serviceItemTagDescription : info.serviceItemTagDescription,
				serviceItemValidationRuleSN : info.serviceItemValidationRuleSN,
				serviceItemValidationValue : '1'
			});
			
			ItemTagDataTable.Refresh();
		}
		
		OPAjaxRequest("POST", "getServiceItemTag", callback_getServiceItemTag, "serviceItemTagSN=1");
		
		// Add Item Tag Panel
		var btnAddItemTagCallback = function (){
			var ItemTagSelectLayout = function (btnClickCallback, config){
				var layoutWrapper = CruiseGlobal.CreateElement("div", "addItemTagDialogLayout");
				var layoutBody = CruiseGlobal.CreateElement("div", "addItemTagDialogLayoutBody", layoutWrapper, "bd");
				var ItemTagSelectInnerCallback = function (){
					ItemTagSelectDataTable = BoxMainLogic.GetPageServiceItemTagForAddItem(CruiseGlobal.GetElementValue("ItemTagSearchText"));
				};
				
				//Build Divs
				var dataPaginationDIV = CruiseGlobal.CreateElement("DIV", "ItemTagDataListPaginateSection", layoutBody, null);
				var searchCriteriaDIV = CruiseGlobal.CreateElement("DIV", "ItemTagSearchCriteriaDIV", layoutBody);
		
				var elArray = new Array();
				elArray.push(searchCriteriaDIV);
				elArray.push(CruiseGlobal.CreateElement("SPAN", "ItemTagSearchButton"));
				elArray.push(dataPaginationDIV);
				BoxGlobal.MakeSearchLayoutHTMLTable(elArray, layoutBody);
				
				var datatableDIV = CruiseGlobal.CreateElement("DIV", "ItemTagSearchDatatableDIV", layoutBody);
				datatableDIV.style.height = "370px";
				datatableDIV.style.width = "780px";

				//Input Tag
				var elInputArea = CruiseGlobal.CreateElement("INPUT", "ItemTagSearchText", searchCriteriaDIV, "txtInputNormal");
				var keyListener = new CruiseEvent.CreateKeyListener (elInputArea, 13, ItemTagSelectInnerCallback, this , false, false, this);
				keyListener.enable();

				//Search Button
				var btnSearch = new OPButton("ItemTagSearchButton", l10nMsg["text_13"], null, ItemTagSelectInnerCallback);
				btnSearch.SetHeight(20);

				//Resource Regiatration
				BoxGlobal.BoxSectionResourceMan.Add("ItemTagSearchButton", btnSearch);
				return layoutWrapper.innerHTML;
			}
			
			var oTagDialog = new OPDialog ("addItemTagDialog", ItemTagSelectLayout(), null, l10nMsg["text_27"], null,
					{ width : 800,
					  height : 500 });
			
			var ClearDialogResources = function(){
				oTagDialog.Hide();
				CruiseGlobal.RemoveElement("addItemTagDialogLayout");
				BoxGlobal.BoxSectionResourceMan.Remove("ItemTagSearchButton");
				BoxGlobal.BoxSectionResourceMan.Remove("addItemTagDialog");
			}
			oTagDialog.SetButtons([{ text:l10nMsg["text_28"], width: 100, handler:function(o, msg) {
								var selectedRows = ItemTagSelectDataTable.GetSelectedRows();
								for (var i = 0; i < selectedRows.length; i++){
									var isSelected = false;
									for (var j = 0; j < ItemTagSelectedData.length; j++){
										if (ItemTagSelectedData[j].serviceItemTagSN == selectedRows[i].serviceItemTagSN){
											isSelected = true;
											break;
										}
									}
									if (isSelected == false){
										ItemTagSelectedData.push({serviceItemTagSN : selectedRows[i].serviceItemTagSN,
											serviceItemTagName : selectedRows[i].serviceItemTagName,
											serviceItemTagDescription : selectedRows[i].serviceItemTagDescription,
											serviceItemValidationRuleSN : selectedRows[i].serviceItemValidationRuleSN,
											serviceItemValidationValue : selectedRows[i].serviceItemTagSN == 1 ? '1' : ''});
									}
								}
								ItemTagDataTable.Refresh();
								ClearDialogResources();
							}}, { text:l10nMsg["text_10"], width: 100, handler:function(o, msg) {
								ClearDialogResources();
							}}])
			oTagDialog.SetModal(true);
			oTagDialog.Show();
			
			BoxGlobal.BoxSectionResourceMan.Add("addItemTagDialog", oTagDialog);
			ItemTagSelectDataTable = BoxMainLogic.GetPageServiceItemTagForAddItem();
		}
		
		var btnInitItemTagCallback = function (){
			var len = ItemTagSelectedData.length;
			for (var i = 0; i < len; i++){
				ItemTagSelectedData.pop();
			}
			ItemTagDataTable.Refresh();
		};
		
		// Add Item Tag
		var btnAddItemTag = new OPButton("AddItemTag",
									l10nMsg["text_27"], 
									addServiceItemTagSPAN,
									btnAddItemTagCallback);
		BoxGlobal.BoxSectionResourceMan.Add("btnAddItemTag", btnAddItemTag);
		
		// init Item Tag
		var btnInitItemTag = new OPButton("InitItemTag",
									l10nMsg["text_29"], 
									initServiceItemTagSPAN,
									btnInitItemTagCallback);
		BoxGlobal.BoxSectionResourceMan.Add("btnInitItemTag", btnInitItemTag);
		
		var serviceItemTagSelectedDIV = CruiseGlobal.CreateElement("DIV", "serviceItemTagSelected");
		BoxGlobal.MakeLayoutTR_INPUT(null, serviceItemTagSelectedDIV, elTable);
		
	    var ItemTagDataTable = new OPDataTable( "GetServiceItemTagForAddItemSelection",
												 null,
												 BoxMainLogic.GetColumns("GetServiceItemTagForAddItemSelection"),
												 "serviceItemTagSelected",
												 {	JSArrayObejct : { data : ItemTagSelectedData },
									    			l10nObj : l10nMsg,
													formatRow : BoxMainLogic.BoxBaseFormatter,
													selectionMode : "single",
													width : "105%",
													height : "105%"});
		BoxGlobal.BoxPageResourceMan.Add("GetServiceItemTagForAddItemSelection_serviceItemTagSelected", ItemTagDataTable);
	},
	LoadCreateBoxLayout : function (btnConfirmCallback, config) {
		PaneArray = BoxLayout.LoadDefaultRightLayout ({ paneCode : config.paneCode });
		elActionPaneDiv = PaneArray[0];
		elBasePaneDiv = PaneArray[1];
		
		var ItemDataTable = null;
		var ItemSelectDataTable = null;
		var BoxTagDataTable = null;
		var BoxTagSelectDataTable = null;
		
		var elReceiverServiceSN = null;
		var elReceiverUserSN = null;
		var elReceiverGUSID = null;
		var elReceiverCharacterSN = null;
		var elReceiverCharacterName = null;
		
		var elStartYear = null, elStartMonth = null, elStartDay = null, elStartHour = null, elStartMinute = null;
		var elEndYear = null, elEndMonth = null, elEndDay = null, elEndHour = null, elEndMinute = null;
		
		var elUsableTimeAfterOpen = null;
		var elVisibleFlag = null;
		
		var ItemSelectedData = [];
		var BoxTagSelectedData = [];
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "ConfirmButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, elActionPaneDiv);
		
		var btnBeforeConfirmCallback = function (event)
		{
			btnConfirmCallback (event, {
											receiverServiceSN : elReceiverServiceSN.value,
											receiverUserSN : elReceiverUserSN.value,
											receiverGUSID : elReceiverGUSID.value,
											receiverCharacterSN : elReceiverCharacterSN.value,
											receiverCharacterName : elReceiverCharacterName.value,
											startActivationTime : CruiseGlobal.ToTimeFormatString(elStartYear.value, elStartMonth.value, elStartDay.value, elStartHour.value, elStartMinute.value, 0, '/'),
											endActivationTime : CruiseGlobal.ToTimeFormatString(elEndYear.value, elEndMonth.value, elEndDay.value, elEndHour.value, elEndMinute.value, 0, '/'),
											usableTimeAfterOpen : elUsableTimeAfterOpen.value,
											visibleFlag : (elVisibleFlag.checked) ? elVisibleFlag.value : 0,
											itemData : ItemSelectedData,
											boxTagData : BoxTagSelectedData
										});
		}

		//Confirm Button
		var btnConfirm = new OPButton("ConfirmButton",
									l10nMsg["text_23"], 
									elActionPaneDiv,
									btnBeforeConfirmCallback);
		BoxGlobal.BoxSectionResourceMan.Add("btnConfirm", btnConfirm);
		
		//Input Area
		var elTable = CruiseGlobal.CreateElement("TABLE", "BoxCreateTable", elBasePaneDiv, "BoxInfoTable");
		
		// receiverServiceSN
		elReceiverServiceSN = CruiseGlobal.CreateElement("SELECT", "inputReceiverServiceSN", null, "txtInputVerySmall");
		CruiseGlobal.CreateElement("OPTION", null, elReceiverServiceSN, null, {value: 1, body: l10nMsg["text_24"]});	
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_receiverServiceSN"], elReceiverServiceSN, elTable);
		
		// receiverUserSN
		elReceiverUserSN = CruiseGlobal.CreateElement("INPUT", "inputReceiverUserSN", null, "txtInputVerySmall", { maxlength : 10 });
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_receiverUserSN"], elReceiverUserSN, elTable);
		
		// receiverGUSID
		elReceiverGUSID = CruiseGlobal.CreateElement("INPUT", "inputReceiverGUSID", null, "txtInputVerySmall", { maxlength : 10 });
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_receiverGUSID"], elReceiverGUSID, elTable);
		
		// receiverCharacterSN
		elReceiverCharacterSN = CruiseGlobal.CreateElement("INPUT", "inputReceiverCharacterSN", null, "txtInputVerySmall", { maxlength : 10 });
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_receiverCharacterSN"], elReceiverCharacterSN, elTable);
		
		// receiverCharacterName
		elReceiverCharacterName = CruiseGlobal.CreateElement("INPUT", "inputReceiverCharacterName", null, "txtInputSmall", { maxlength : 20 });
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_receiverCharacterName"], elReceiverCharacterName, elTable);
		
		
		// Start Activation DateTime Section /////////////////////////////
		var elStartActivationDatetime = CruiseGlobal.CreateElement("DIV", "startActivationDatetime");
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_startActivationDateTime"], elStartActivationDatetime, elTable);
		
		// Calendar Section
		var elStartDate = CruiseGlobal.CreateElement("DIV", "startDateSectionDiv", elStartActivationDatetime);
		var elStartDateTimeButton = CruiseGlobal.CreateElement("DIV", "divStartActivationDateTimePicker", elStartActivationDatetime);
		var elStartTime = CruiseGlobal.CreateElement("DIV", "startTimeSectionDiv", elStartActivationDatetime);
		
		// Positioning DateTime Section
		var elArray = new Array();
		elArray.push(elStartDate);
		elArray.push(elStartDateTimeButton);
		elArray.push(elStartTime);
		BoxGlobal.MakeLayoutHTMLTable(elArray, elStartActivationDatetime);
		
		// Create DateTime Picker
		CruiseGlobal.CreateElement("LABEL", "lblStartDate", elStartDate, null, {body: l10nMsg["text_25"], paddingRight: "10px"});
		var objStartDate = OPCalendar.MakeDatePicker ("startActivationDatePicker", elStartDate, elStartDateTimeButton, { headerLabel : l10nMsg["msg_31"] });
		elStartYear = objStartDate.elementYear;
		elStartMonth = objStartDate.elementMonth;
		elStartDay = objStartDate.elementDay;
		BoxGlobal.BoxSectionResourceMan.Add("startDateCalendar", objStartDate.objCalendar);
		
		CruiseGlobal.CreateElement("LABEL", "lblStartTime", elStartTime, null, {body: l10nMsg["text_26"], paddingLeft: "10px", paddingRight: "10px"});
		var objStartTime = OPCalendar.MakeTimePicker ("startActivationTimePicker", elStartTime, { isUseSeconds : false });
		elStartHour = objStartTime.elementHour;
		elStartMinute = objStartTime.elementMinute;
		// End DateTime Section /////////////////////////////
		
		
		// End Activation DateTime Section
		var elEndActivationDatetime = CruiseGlobal.CreateElement("DIV", "endActivationDatetime");
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_endActivationDateTime"], elEndActivationDatetime, elTable);
		
		// Calendar Section
		var elEndDate = CruiseGlobal.CreateElement("DIV", "endDateSectionDiv", elEndActivationDatetime);
		var elEndDateTimeButton = CruiseGlobal.CreateElement("DIV", "divEndActivationDateTimePicker", elEndActivationDatetime);
		var elEndTime = CruiseGlobal.CreateElement("DIV", "endTimeSectionDiv", elEndActivationDatetime);
		
		// Positioning DateTime Section
		var elArray = new Array();
		elArray.push(elEndDate);
		elArray.push(elEndDateTimeButton);
		elArray.push(elEndTime);
		BoxGlobal.MakeLayoutHTMLTable(elArray, elEndActivationDatetime);
		
		// Create DateTime Picker
		CruiseGlobal.CreateElement("LABEL", "lblEndDate", elEndDate, null, {body: l10nMsg["text_25"], paddingRight: "10px"});
		var objEndDate = OPCalendar.MakeDatePicker ("endActivationDatePicker", elEndDate, elEndDateTimeButton, { headerLabel : l10nMsg["msg_31"], initDay: parseInt(elStartDay.value) + 1 });
		elEndYear = objEndDate.elementYear;
		elEndMonth = objEndDate.elementMonth;
		elEndDay = objEndDate.elementDay;
		BoxGlobal.BoxSectionResourceMan.Add("endDateCalendar", objEndDate.objCalendar);
		
		CruiseGlobal.CreateElement("LABEL", "lblEndTime", elEndTime, null, {body: l10nMsg["text_26"], paddingLeft: "10px", paddingRight: "10px"});
		var objEndTime = OPCalendar.MakeTimePicker ("endActivationTimePicker", elEndTime, { isUseSeconds : false });
		elEndHour = objEndTime.elementHour;
		elEndMinute = objEndTime.elementMinute;
		// End DateTime Section /////////////////////////////
		
		
		// usableTimeAfterOpen
		elUsableTimeAfterOpen = CruiseGlobal.CreateElement("INPUT", "InputUsableTimeAfterOpen", null, "txtInputVerySmall", { maxlength : 10 });
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_activateDurationAfterOpen"], elUsableTimeAfterOpen, elTable);
		
		// useFlag Section
		var elVisibleFlagRadio = CruiseGlobal.CreateElement("DIV", "visibleFlag");
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_visableFlagBeforeActivation"], elVisibleFlagRadio, elTable);
		elVisibleFlag = CruiseGlobal.CreateElement("INPUT", null, elVisibleFlagRadio, null, {type: "RADIO", name: "visibleFlag[]", value : 1});
		elVisibleFlag.checked = false;
		CruiseGlobal.CreateElement("SPAN", "visibleFlagRadio", elVisibleFlagRadio, null, {body: BoxGlobal.GetCodeText("visableFlagBeforeActivation", 1), paddingRight: "10px"});
		elInvisibleFlag = CruiseGlobal.CreateElement("INPUT", null, elVisibleFlagRadio, null, {type: "RADIO", name: "visibleFlag[]", value : 0});
		elInvisibleFlag.checked = true;
		CruiseGlobal.CreateElement("SPAN", "invisibleFlagRadio", elVisibleFlagRadio, null, {body: BoxGlobal.GetCodeText("visableFlagBeforeActivation", 0)});
		
		var serviceItemDIV = CruiseGlobal.CreateElement("DIV", "serviceItemDIV");
		var addServiceItemSPAN = CruiseGlobal.CreateElement("SPAN", "addServiceItemSPAN", serviceItemDIV);
		var initServiceItemSPAN = CruiseGlobal.CreateElement("SPAN", "initServiceItemSPAN", serviceItemDIV);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItem"], serviceItemDIV, elTable);
		
		// Add Item  Panel
		var btnAddItemCallback = function (){
			var ItemSelectLayout = function (btnClickCallback, config){
				var layoutWrapper = CruiseGlobal.CreateElement("div", "addItemDialogLayout");
				var layoutBody = CruiseGlobal.CreateElement("div", "addItemDialogLayoutBody", layoutWrapper, "bd");
				var ItemSelectInnerCallback = function (){
					ItemSelectDataTable = BoxMainLogic.GetPageServiceItemForAddBox(elReceiverServiceSN.value, CruiseGlobal.GetElementValue("ItemSearchText"));
				};
				
				//Build Divs
				var dataPaginationDIV = CruiseGlobal.CreateElement("DIV", "ItemDataListPaginateSection", layoutBody, null);
				var searchCriteriaDIV = CruiseGlobal.CreateElement("DIV", "ItemSearchCriteriaDIV", layoutBody);
		
				var elArray = new Array();
				elArray.push(searchCriteriaDIV);
				elArray.push(CruiseGlobal.CreateElement("SPAN", "ItemSearchButton"));
				elArray.push(dataPaginationDIV);
				BoxGlobal.MakeSearchLayoutHTMLTable(elArray, layoutBody);
				
				var datatableDIV = CruiseGlobal.CreateElement("DIV", "ItemSearchDatatableDIV", layoutBody);
				datatableDIV.style.height = "370px";
				datatableDIV.style.width = "780px";

				//Input 
				var elInputArea = CruiseGlobal.CreateElement("INPUT", "ItemSearchText", searchCriteriaDIV, "txtInputNormal");
				var keyListener = new CruiseEvent.CreateKeyListener (elInputArea, 13, ItemSelectInnerCallback, this , false, false, this);
				keyListener.enable();

				//Search Button
				var btnSearch = new OPButton("ItemSearchButton", l10nMsg["text_13"], null, ItemSelectInnerCallback);
				btnSearch.SetHeight(20);

				//Resource Regiatration
				BoxGlobal.BoxSectionResourceMan.Add("ItemSearchButton", btnSearch);
				return layoutWrapper.innerHTML;
			}
			
			var oDialog = new OPDialog ("addItemDialog", ItemSelectLayout(), null, l10nMsg["text_33"], null,
					{ width : 800,
					  height : 500 });
			
			var ClearDialogResources = function(){
				oDialog.Hide();
				CruiseGlobal.RemoveElement("addItemDialogLayout");
				BoxGlobal.BoxSectionResourceMan.Remove("ItemSearchButton");
				BoxGlobal.BoxSectionResourceMan.Remove("addItemDialog");
			}
			
			var loadingCount = 0;
			oDialog.SetButtons([{ text:l10nMsg["text_28"], width: 100, handler:function(o, msg) {
								var selectedRows = ItemSelectDataTable.GetSelectedRows();
								for (var i = 0; i < selectedRows.length; i++){
									var isSelected = false;
									for (var j = 0; j < ItemSelectedData.length; j++){
										if (ItemSelectedData[j].serviceItemSN == selectedRows[i].serviceItemSN){
											isSelected = true;
											CruiseGlobal.SHOWINFO (l10nMsg["text_09"], l10nMsg["msg_39"], l10nMsg["text_09"]);
											loadingCount++;
											break;
										}
									}
									if (isSelected == false){
										var _callback = function(o, messages) {
											var serviceItem = messages.returnTables[0][0][0];
											var serviceItemAndItemTags = messages.returnTables[1][0];
											
											if (serviceItemAndItemTags.length > 0){
												for (k in serviceItemAndItemTags) {
													ItemSelectedData.push({ serviceItemSN : serviceItem.serviceItemSN,
														serviceItemMappingItemSN : serviceItem.serviceItemMappingItemSN,
														serviceItemStartActivationDateTime : serviceItem.serviceItemStartActivationDateTime,
														serviceItemTagSN : serviceItemAndItemTags[k].serviceItemTagSN,
														serviceItemTagName : serviceItemAndItemTags[k].serviceItemTagName,
														serviceItemValidationValue : serviceItemAndItemTags[k].serviceItemValidationValue,
														serviceItemTagValue : ''});
												}
											}
											else{
												ItemSelectedData.push({ serviceItemSN : selectedRows[loadingCount].serviceItemSN,
													serviceItemMappingItemSN : selectedRows[loadingCount].serviceItemMappingItemSN,
													serviceItemStartActivationDateTime : selectedRows[loadingCount].serviceItemStartActivationDateTime,
													serviceItemTagSN : '-',
													serviceItemTagName : '-',
													serviceItemValidationValue : '-',
													serviceItemTagValue : '-'});
											}
											ItemDataTable.Refresh();
											if (loadingCount < selectedRows.length){
												BoxGlobal.ShowLoading();
											}
											if (loadingCount + 1 == selectedRows.length){
												BoxGlobal.HideLoading();
											}
											loadingCount++;
										};
										OPAjaxRequest("POST", "getDetailServiceItemAndServiceItemTag", _callback, "serviceItemSN=" + selectedRows[i].serviceItemSN);
										BoxGlobal.ShowLoading();
									}
								}
								ClearDialogResources();
							}}, { text:l10nMsg["text_10"], width: 100, handler:function(o, msg) {
								ClearDialogResources();
							}}])
			oDialog.SetModal(true);
			oDialog.Show();
			
			BoxGlobal.BoxSectionResourceMan.Add("addItemDialog", oDialog);
			ItemSelectDataTable = BoxMainLogic.GetPageServiceItemForAddBox(elReceiverServiceSN.value);
		}
		
		var btnInitItemCallback = function (){
			var len = ItemSelectedData.length;
			for (var i = 0; i < len; i++){
				ItemSelectedData.pop();
			}
			ItemDataTable.Refresh();
		};
		
		// Add Item
		var btnAddItem = new OPButton("AddItem",
									l10nMsg["text_33"], 
									addServiceItemSPAN,
									btnAddItemCallback);
		BoxGlobal.BoxSectionResourceMan.Add("btnAddItem", btnAddItem);
		
		// init Item 
		var btnInitItem = new OPButton("InitItem",
									l10nMsg["text_29"], 
									initServiceItemSPAN,
									btnInitItemCallback);
		BoxGlobal.BoxSectionResourceMan.Add("btnInitItem", btnInitItem);
		
		var serviceItemSelectedDIV = CruiseGlobal.CreateElement("DIV", "serviceItemSelected");
		BoxGlobal.MakeLayoutTR_INPUT(null, serviceItemSelectedDIV, elTable);
		
	    var ItemDataTable = new OPDataTable( "GetServiceItemForAddBoxSelection",
												 null,
												 BoxMainLogic.GetColumns("GetServiceItemForAddBoxSelection"),
												 "serviceItemSelected",
												 {	JSArrayObejct : { data : ItemSelectedData },
									    			l10nObj : l10nMsg,
													formatRow : BoxMainLogic.BoxBaseFormatter,
													selectionMode : "single",
													width : "105%",
													height : "105%",
													columnEditorIgnoreInfo : { ignoreColumnName : "serviceItemTagValue", ignoreColumnValue : "-"}
												 });
		BoxGlobal.BoxSectionResourceMan.Add("GetServiceItemForAddBoxSelection_serviceItemSelected", ItemDataTable);
		
		
		var boxTagDIV = CruiseGlobal.CreateElement("DIV", "boxTagDIV");
		var addBoxTagSPAN = CruiseGlobal.CreateElement("SPAN", "addBoxTagSPAN", boxTagDIV);
		var initBoxTagSPAN = CruiseGlobal.CreateElement("SPAN", "initBoxTagSPAN", boxTagDIV);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_boxTag"], boxTagDIV, elTable);
		
		// Add Box Tag Panel
		var btnAddBoxTagCallback = function (){
			var BoxTagSelectLayout = function (btnClickCallback, config){
				var layoutWrapper = CruiseGlobal.CreateElement("div", "addBoxTagDialogLayout");
				var layoutBody = CruiseGlobal.CreateElement("div", "addBoxTagDialogLayoutBody", layoutWrapper, "bd");
				var BoxTagSelectInnerCallback = function (){
					BoxTagSelectDataTable = BoxMainLogic.GetPageBoxTagForAddItem(CruiseGlobal.GetElementValue("BoxTagSearchText"));
				};
				
				//Build Divs
				var dataPaginationDIV = CruiseGlobal.CreateElement("DIV", "BoxTagDataListPaginateSection", layoutBody, null);
				var searchCriteriaDIV = CruiseGlobal.CreateElement("DIV", "BoxTagSearchCriteriaDIV", layoutBody);
		
				var elArray = new Array();
				elArray.push(searchCriteriaDIV);
				elArray.push(CruiseGlobal.CreateElement("SPAN", "BoxTagSearchButton"));
				elArray.push(dataPaginationDIV);
				BoxGlobal.MakeSearchLayoutHTMLTable(elArray, layoutBody);
				
				var datatableDIV = CruiseGlobal.CreateElement("DIV", "BoxTagSearchDatatableDIV", layoutBody);
				datatableDIV.style.height = "370px";
				datatableDIV.style.width = "780px";

				//Input Tag
				var elInputArea = CruiseGlobal.CreateElement("INPUT", "BoxTagSearchText", searchCriteriaDIV, "txtInputNormal");
				var keyListener = new CruiseEvent.CreateKeyListener (elInputArea, 13, BoxTagSelectInnerCallback, this , false, false, this);
				keyListener.enable();

				//Search Button
				var btnSearch = new OPButton("BoxTagSearchButton", l10nMsg["text_13"], null, BoxTagSelectInnerCallback);
				btnSearch.SetHeight(20);

				//Resource Regiatration
				BoxGlobal.BoxSectionResourceMan.Add("BoxTagSearchButton", btnSearch);
				return layoutWrapper.innerHTML;
			}
			
			var oTagDialog = new OPDialog ("addBoxTagDialog", BoxTagSelectLayout(), null, l10nMsg["text_27"], null,
					{ width : 800,
					  height : 500 });
			
			var ClearDialogResources = function(){
				oTagDialog.Hide();
				CruiseGlobal.RemoveElement("addBoxTagDialogLayout");
				BoxGlobal.BoxSectionResourceMan.Remove("BoxTagSearchButton");
				BoxGlobal.BoxSectionResourceMan.Remove("addBoxTagDialog");
			}
			oTagDialog.SetButtons([{ text:l10nMsg["text_28"], width: 100, handler:function(o, msg) {
								var selectedRows = BoxTagSelectDataTable.GetSelectedRows();
								for (var i = 0; i < selectedRows.length; i++){
									var isSelected = false;
									for (var j = 0; j < BoxTagSelectedData.length; j++){
										if (BoxTagSelectedData[j].boxTagSN == selectedRows[i].boxTagSN){
											isSelected = true;
											break;
										}
									}
									if (isSelected == false){
										BoxTagSelectedData.push({boxTagSN : selectedRows[i].boxTagSN,
											boxTagName : selectedRows[i].boxTagName,
											boxTagDescription : selectedRows[i].boxTagDescription,
											boxTagValue : ''});
									}
								}
								BoxTagDataTable.Refresh();
								ClearDialogResources();
							}}, { text:l10nMsg["text_10"], width: 100, handler:function(o, msg) {
								ClearDialogResources();
							}}])
			oTagDialog.SetModal(true);
			oTagDialog.Show();
			
			BoxGlobal.BoxSectionResourceMan.Add("addBoxTagDialog", oTagDialog);
			BoxTagSelectDataTable = BoxMainLogic.GetPageBoxTagForAddItem();
		}
		
		var btnInitBoxTagCallback = function (){
			var len = BoxTagSelectedData.length;
			for (var i = 0; i < len; i++){
				BoxTagSelectedData.pop();
			}
			BoxTagDataTable.Refresh();
		};
		
		// Add Item Tag
		var btnAddBoxTag = new OPButton("AddBoxTag",
									l10nMsg["text_27"], 
									addBoxTagSPAN,
									btnAddBoxTagCallback);
		BoxGlobal.BoxSectionResourceMan.Add("btnAddBoxTag", btnAddBoxTag);
		
		// init Item Tag
		var btnInitBoxTag = new OPButton("InitBoxTag",
									l10nMsg["text_29"], 
									initBoxTagSPAN,
									btnInitBoxTagCallback);
		BoxGlobal.BoxSectionResourceMan.Add("btnInitBoxTag", btnInitBoxTag);
		
		var boxTagSelectedDIV = CruiseGlobal.CreateElement("DIV", "BoxTagSelected");
		BoxGlobal.MakeLayoutTR_INPUT(null, boxTagSelectedDIV, elTable);
		
	    var BoxTagDataTable = new OPDataTable( "GetBoxTagForAddBoxSelection",
												 null,
												 BoxMainLogic.GetColumns("GetBoxTagForAddBoxSelection"),
												 "BoxTagSelected",
												 {	JSArrayObejct : { data : BoxTagSelectedData },
									    			l10nObj : l10nMsg,
													formatRow : BoxMainLogic.BoxBaseFormatter,
													selectionMode : "null",
													width : "105%",
													height : "105%"});
		BoxGlobal.BoxSectionResourceMan.Add("GetBoxTagForAddBoxSelection_BoxTagSelected", BoxTagDataTable);
	},
	// config.paneCode : PaneName text resource number
	LoadBoxTemplateListLayout : function (btnClickCallback, config) {
		BoxGlobal.BoxPageResourceMan.Remove("leftCenterLayout");

		this.CommonInnerLeft();
		CruiseGlobal.SetHTML("LeftPaneNameArea", BoxGlobal.GetPaneText(config.paneCode), true);
		
		var innerCallback = function ()
		{
			btnClickCallback ({enableFlag : CruiseGlobal.GetElementValue("enableFlagSelect"), searchCondition : CruiseGlobal.GetElementValue("searchCondition")});
		};
		
		//Build Divs
		var dataPaginationDIV = CruiseGlobal.CreateElement("DIV", "DataListPaginateSection", CruiseGlobal.GetEl("DataListActionSection"), null, {paddingLeft : "30px"});
		var searchCriteriaDIV = CruiseGlobal.CreateElement("DIV", "searchCriteriaDIV", CruiseGlobal.GetEl("DataListActionSection"));

		var elArray = new Array();
		elArray.push(searchCriteriaDIV);
		elArray.push(CruiseGlobal.CreateElement("SPAN", "SearchButton"));
		elArray.push(dataPaginationDIV);
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, document.getElementById("DataListActionSection"));
		
		//Option Tag
		var enableFlagSelect = CruiseGlobal.CreateElement("SELECT", "enableFlagSelect", searchCriteriaDIV);
		CruiseGlobal.CreateElement("OPTION", null, enableFlagSelect, null, {value: 1, body: l10nMsg["text_14"]});
		CruiseGlobal.CreateElement("OPTION", null, enableFlagSelect, null, {value: 0, body: l10nMsg["text_15"]});		
		var selectKeyListener = new CruiseEvent.CreateKeyListener (enableFlagSelect, 13, innerCallback, this, false, false, this);
		selectKeyListener.enable();
		
		//Input Tag
		var elInputArea = CruiseGlobal.CreateElement("INPUT", "searchCondition", searchCriteriaDIV, "txtInputVerySmall");
		var keyListener = new CruiseEvent.CreateKeyListener (elInputArea, 13, innerCallback, this, false, false, this);
		keyListener.enable();
		
		//Search Button
		var btnSearch = new OPButton("SearchButton", l10nMsg["text_13"], null, function (){ innerCallback(); });
		btnSearch.SetHeight(20);
		
		//Resource Regiatration
		BoxGlobal.BoxPageResourceMan.Add("btnSearch", btnSearch);
	},
	LoadAddBoxTemplateLayout : function (btnConfirmCallback, config) {
		PaneArray = BoxLayout.LoadDefaultRightLayout ({ paneCode : config.paneCode });
		elActionPaneDiv = PaneArray[0];
		elBasePaneDiv = PaneArray[1];
		
		var ItemDataTable = null;
		var ItemSelectDataTable = null;
		var BoxTagDataTable = null;
		var BoxTagSelectDataTable = null;
		
		var elBoxTemplateServiceSN = null;
		var elBoxTemplateTitle = null;
//		var elReceiverUserSN = null;
//		var elReceiverGUSID = null;
//		var elReceiverCharacterSN = null;
//		var elReceiverCharacterName = null;
		
		var elStartYear = null, elStartMonth = null, elStartDay = null, elStartHour = null, elStartMinute = null;
		var elEndYear = null, elEndMonth = null, elEndDay = null, elEndHour = null, elEndMinute = null;
		
		var elUsableTimeAfterOpen = null;
		var elVisibleFlag = null;
		
		var ItemSelectedData = [];
		var BoxTagSelectedData = [];
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "ConfirmButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, elActionPaneDiv);
		
		var btnBeforeConfirmCallback = function (event)
		{
			btnConfirmCallback (event, {
											boxTemplateTitle : elBoxTemplateTitle.value,
											boxTemplateServiceSN : elBoxTemplateServiceSN.value,
//											receiverUserSN : elReceiverUserSN.value,
//											receiverGUSID : elReceiverGUSID.value,
//											receiverCharacterSN : elReceiverCharacterSN.value,
//											receiverCharacterName : elReceiverCharacterName.value,
											startActivationTime : CruiseGlobal.ToTimeFormatString(elStartYear.value, elStartMonth.value, elStartDay.value, elStartHour.value, elStartMinute.value, 0, '/'),
											endActivationTime : CruiseGlobal.ToTimeFormatString(elEndYear.value, elEndMonth.value, elEndDay.value, elEndHour.value, elEndMinute.value, 0, '/'),
											usableTimeAfterOpen : elUsableTimeAfterOpen.value,
											visibleFlag : (elVisibleFlag.checked) ? elVisibleFlag.value : 0,
											itemData : ItemSelectedData,
											boxTagData : BoxTagSelectedData
										});
		}

		//Confirm Button
		var btnConfirm = new OPButton("ConfirmButton",
									l10nMsg["text_23"], 
									elActionPaneDiv,
									btnBeforeConfirmCallback);
		BoxGlobal.BoxSectionResourceMan.Add("btnConfirm", btnConfirm);
		
		//Input Area
		var elTable = CruiseGlobal.CreateElement("TABLE", "BoxCreateTable", elBasePaneDiv, "BoxInfoTable");
		
		// boxTemplateTitle
		elBoxTemplateTitle = CruiseGlobal.CreateElement("INPUT", "inputBoxTemplateTitle", null, "txtInputSmall", { maxlength : 50 });
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_boxTemplateTitle"], elBoxTemplateTitle, elTable);
		
		// receiverServiceSN
		elBoxTemplateServiceSN = CruiseGlobal.CreateElement("SELECT", "inputReceiverServiceSN", null, "txtInputVerySmall");
		CruiseGlobal.CreateElement("OPTION", null, elBoxTemplateServiceSN, null, {value: 1, body: l10nMsg["text_24"]});	
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_receiverServiceSN"], elBoxTemplateServiceSN, elTable);
		
//		// receiverUserSN
//		elReceiverUserSN = CruiseGlobal.CreateElement("INPUT", "inputReceiverUserSN", null, "txtInputVerySmall", { maxlength : 10 });
//		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_receiverUserSN"], elReceiverUserSN, elTable);
//		
//		// receiverGUSID
//		elReceiverGUSID = CruiseGlobal.CreateElement("INPUT", "inputReceiverGUSID", null, "txtInputVerySmall", { maxlength : 10 });
//		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_receiverGUSID"], elReceiverGUSID, elTable);
//		
//		// receiverCharacterSN
//		elReceiverCharacterSN = CruiseGlobal.CreateElement("INPUT", "inputReceiverCharacterSN", null, "txtInputVerySmall", { maxlength : 10 });
//		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_receiverCharacterSN"], elReceiverCharacterSN, elTable);
//		
//		// receiverCharacterName
//		elReceiverCharacterName = CruiseGlobal.CreateElement("INPUT", "inputReceiverCharacterName", null, "txtInputSmall", { maxlength : 20 });
//		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_receiverCharacterName"], elReceiverCharacterName, elTable);
		
		
		// Start Activation DateTime Section /////////////////////////////
		var elStartActivationDatetime = CruiseGlobal.CreateElement("DIV", "startActivationDatetime");
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_startActivationDateTime"], elStartActivationDatetime, elTable);
		
		// Calendar Section
		var elStartDate = CruiseGlobal.CreateElement("DIV", "startDateSectionDiv", elStartActivationDatetime);
		var elStartDateTimeButton = CruiseGlobal.CreateElement("DIV", "divStartActivationDateTimePicker", elStartActivationDatetime);
		var elStartTime = CruiseGlobal.CreateElement("DIV", "startTimeSectionDiv", elStartActivationDatetime);
		
		// Positioning DateTime Section
		var elArray = new Array();
		elArray.push(elStartDate);
		elArray.push(elStartDateTimeButton);
		elArray.push(elStartTime);
		BoxGlobal.MakeLayoutHTMLTable(elArray, elStartActivationDatetime);
		
		// Create DateTime Picker
		CruiseGlobal.CreateElement("LABEL", "lblStartDate", elStartDate, null, {body: l10nMsg["text_25"], paddingRight: "10px"});
		var objStartDate = OPCalendar.MakeDatePicker ("startActivationDatePicker", elStartDate, elStartDateTimeButton, { headerLabel : l10nMsg["msg_31"] });
		elStartYear = objStartDate.elementYear;
		elStartMonth = objStartDate.elementMonth;
		elStartDay = objStartDate.elementDay;
		BoxGlobal.BoxSectionResourceMan.Add("startDateCalendar", objStartDate.objCalendar);
		
		CruiseGlobal.CreateElement("LABEL", "lblStartTime", elStartTime, null, {body: l10nMsg["text_26"], paddingLeft: "10px", paddingRight: "10px"});
		var objStartTime = OPCalendar.MakeTimePicker ("startActivationTimePicker", elStartTime, { isUseSeconds : false });
		elStartHour = objStartTime.elementHour;
		elStartMinute = objStartTime.elementMinute;
		// End DateTime Section /////////////////////////////
		
		
		// End Activation DateTime Section
		var elEndActivationDatetime = CruiseGlobal.CreateElement("DIV", "endActivationDatetime");
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_endActivationDateTime"], elEndActivationDatetime, elTable);
		
		// Calendar Section
		var elEndDate = CruiseGlobal.CreateElement("DIV", "endDateSectionDiv", elEndActivationDatetime);
		var elEndDateTimeButton = CruiseGlobal.CreateElement("DIV", "divEndActivationDateTimePicker", elEndActivationDatetime);
		var elEndTime = CruiseGlobal.CreateElement("DIV", "endTimeSectionDiv", elEndActivationDatetime);
		
		// Positioning DateTime Section
		var elArray = new Array();
		elArray.push(elEndDate);
		elArray.push(elEndDateTimeButton);
		elArray.push(elEndTime);
		BoxGlobal.MakeLayoutHTMLTable(elArray, elEndActivationDatetime);
		
		// Create DateTime Picker
		CruiseGlobal.CreateElement("LABEL", "lblEndDate", elEndDate, null, {body: l10nMsg["text_25"], paddingRight: "10px"});
		var objEndDate = OPCalendar.MakeDatePicker ("endActivationDatePicker", elEndDate, elEndDateTimeButton, { headerLabel : l10nMsg["msg_31"], initDay: parseInt(elStartDay.value) + 1 });
		elEndYear = objEndDate.elementYear;
		elEndMonth = objEndDate.elementMonth;
		elEndDay = objEndDate.elementDay;
		BoxGlobal.BoxSectionResourceMan.Add("endDateCalendar", objEndDate.objCalendar);
		
		CruiseGlobal.CreateElement("LABEL", "lblEndTime", elEndTime, null, {body: l10nMsg["text_26"], paddingLeft: "10px", paddingRight: "10px"});
		var objEndTime = OPCalendar.MakeTimePicker ("endActivationTimePicker", elEndTime, { isUseSeconds : false });
		elEndHour = objEndTime.elementHour;
		elEndMinute = objEndTime.elementMinute;
		// End DateTime Section /////////////////////////////
		
		
		// usableTimeAfterOpen
		elUsableTimeAfterOpen = CruiseGlobal.CreateElement("INPUT", "InputUsableTimeAfterOpen", null, "txtInputVerySmall", { maxlength : 10 });
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_activateDurationAfterOpen"], elUsableTimeAfterOpen, elTable);
		
		// useFlag Section
		var elVisibleFlagRadio = CruiseGlobal.CreateElement("DIV", "visibleFlag");
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_visableFlagBeforeActivation"], elVisibleFlagRadio, elTable);
		elVisibleFlag = CruiseGlobal.CreateElement("INPUT", null, elVisibleFlagRadio, null, {type: "RADIO", name: "visibleFlag[]", value : 1});
		elVisibleFlag.checked = false;
		CruiseGlobal.CreateElement("SPAN", "visibleFlagRadio", elVisibleFlagRadio, null, {body: BoxGlobal.GetCodeText("visableFlagBeforeActivation", 1), paddingRight: "10px"});
		elInvisibleFlag = CruiseGlobal.CreateElement("INPUT", null, elVisibleFlagRadio, null, {type: "RADIO", name: "visibleFlag[]", value : 0});
		elInvisibleFlag.checked = true;
		CruiseGlobal.CreateElement("SPAN", "invisibleFlagRadio", elVisibleFlagRadio, null, {body: BoxGlobal.GetCodeText("visableFlagBeforeActivation", 0)});
		
		var serviceItemDIV = CruiseGlobal.CreateElement("DIV", "serviceItemDIV");
		var addServiceItemSPAN = CruiseGlobal.CreateElement("SPAN", "addServiceItemSPAN", serviceItemDIV);
		var initServiceItemSPAN = CruiseGlobal.CreateElement("SPAN", "initServiceItemSPAN", serviceItemDIV);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItem"], serviceItemDIV, elTable);
		
		// Add Item  Panel
		var btnAddItemCallback = function (){
			var ItemSelectLayout = function (btnClickCallback, config){
				var layoutWrapper = CruiseGlobal.CreateElement("div", "addItemDialogLayout");
				var layoutBody = CruiseGlobal.CreateElement("div", "addItemDialogLayoutBody", layoutWrapper, "bd");
				var ItemSelectInnerCallback = function (){
					ItemSelectDataTable = BoxMainLogic.GetPageServiceItemForAddBox(elBoxTemplateServiceSN.value, CruiseGlobal.GetElementValue("ItemSearchText"));
				};
				
				//Build Divs
				var dataPaginationDIV = CruiseGlobal.CreateElement("DIV", "ItemDataListPaginateSection", layoutBody, null);
				var searchCriteriaDIV = CruiseGlobal.CreateElement("DIV", "ItemSearchCriteriaDIV", layoutBody);
		
				var elArray = new Array();
				elArray.push(searchCriteriaDIV);
				elArray.push(CruiseGlobal.CreateElement("SPAN", "ItemSearchButton"));
				elArray.push(dataPaginationDIV);
				BoxGlobal.MakeSearchLayoutHTMLTable(elArray, layoutBody);
				
				var datatableDIV = CruiseGlobal.CreateElement("DIV", "ItemSearchDatatableDIV", layoutBody);
				datatableDIV.style.height = "370px";
				datatableDIV.style.width = "780px";

				//Input 
				var elInputArea = CruiseGlobal.CreateElement("INPUT", "ItemSearchText", searchCriteriaDIV, "txtInputNormal");
				var keyListener = new CruiseEvent.CreateKeyListener (elInputArea, 13, ItemSelectInnerCallback, this , false, false, this);
				keyListener.enable();

				//Search Button
				var btnSearch = new OPButton("ItemSearchButton", l10nMsg["text_13"], null, ItemSelectInnerCallback);
				btnSearch.SetHeight(20);

				//Resource Regiatration
				BoxGlobal.BoxSectionResourceMan.Add("ItemSearchButton", btnSearch);
				return layoutWrapper.innerHTML;
			}
			
			var oDialog = new OPDialog ("addItemDialog", ItemSelectLayout(), null, l10nMsg["text_33"], null,
					{ width : 800,
					  height : 500 });
			
			var ClearDialogResources = function(){
				oDialog.Hide();
				CruiseGlobal.RemoveElement("addItemDialogLayout");
				BoxGlobal.BoxSectionResourceMan.Remove("ItemSearchButton");
				BoxGlobal.BoxSectionResourceMan.Remove("addItemDialog");
			}
			
			var loadingCount = 0;
			oDialog.SetButtons([{ text:l10nMsg["text_28"], width: 100, handler:function(o, msg) {
								var selectedRows = ItemSelectDataTable.GetSelectedRows();
								for (var i = 0; i < selectedRows.length; i++){
									var isSelected = false;
									for (var j = 0; j < ItemSelectedData.length; j++){
										if (ItemSelectedData[j].serviceItemSN == selectedRows[i].serviceItemSN){
											isSelected = true;
											CruiseGlobal.SHOWINFO (l10nMsg["text_09"], l10nMsg["msg_39"], l10nMsg["text_09"]);
											loadingCount++;
											break;
										}
									}
									if (isSelected == false){
										var _callback = function(o, messages) {
											itemTagRows = messages.returnTables[0][0];
											
											var serviceItem = messages.returnTables[0][0][0];
											var serviceItemAndItemTags = messages.returnTables[1][0];
											
											if (serviceItemAndItemTags.length > 0){
												for (k in serviceItemAndItemTags) {
													ItemSelectedData.push({ serviceItemSN : serviceItem.serviceItemSN,
														serviceItemMappingItemSN : serviceItem.serviceItemMappingItemSN,
														serviceItemStartActivationDateTime : serviceItem.serviceItemStartActivationDateTime,
														serviceItemTagSN : serviceItemAndItemTags[k].serviceItemTagSN,
														serviceItemTagName : serviceItemAndItemTags[k].serviceItemTagName,
														serviceItemValidationValue : serviceItemAndItemTags[k].serviceItemValidationValue,
														serviceItemTagValue : ''});
												}
											}
											else{
												ItemSelectedData.push({ serviceItemSN : selectedRows[loadingCount].serviceItemSN,
													serviceItemMappingItemSN : selectedRows[loadingCount].serviceItemMappingItemSN,
													serviceItemStartActivationDateTime : selectedRows[loadingCount].serviceItemStartActivationDateTime,
													serviceItemTagSN : '-',
													serviceItemTagName : '-',
													serviceItemValidationValue : '-',
													serviceItemTagValue : '-'});
											}
											ItemDataTable.Refresh();
											if (loadingCount < selectedRows.length){
												BoxGlobal.ShowLoading();
											}
											if (loadingCount + 1 == selectedRows.length){
												BoxGlobal.HideLoading();
											}
											loadingCount++;
										};
										OPAjaxRequest("POST", "getDetailServiceItemAndServiceItemTag", _callback, "serviceItemSN=" + selectedRows[i].serviceItemSN);
										BoxGlobal.ShowLoading();
									}
								}
								ClearDialogResources();
							}}, { text:l10nMsg["text_10"], width: 100, handler:function(o, msg) {
								ClearDialogResources();
							}}])
			oDialog.SetModal(true);
			oDialog.Show();
			
			BoxGlobal.BoxSectionResourceMan.Add("addItemDialog", oDialog);
			ItemSelectDataTable = BoxMainLogic.GetPageServiceItemForAddBox(elBoxTemplateServiceSN.value);
		}
		
		var btnInitItemCallback = function (){
			var len = ItemSelectedData.length;
			for (var i = 0; i < len; i++){
				ItemSelectedData.pop();
			}
			ItemDataTable.Refresh();
		};
		
		// Add Item
		var btnAddItem = new OPButton("AddItem",
									l10nMsg["text_33"], 
									addServiceItemSPAN,
									btnAddItemCallback);
		BoxGlobal.BoxSectionResourceMan.Add("btnAddItem", btnAddItem);
		
		// init Item 
		var btnInitItem = new OPButton("InitItem",
									l10nMsg["text_29"], 
									initServiceItemSPAN,
									btnInitItemCallback);
		BoxGlobal.BoxSectionResourceMan.Add("btnInitItem", btnInitItem);
		
		var serviceItemSelectedDIV = CruiseGlobal.CreateElement("DIV", "serviceItemSelected");
		BoxGlobal.MakeLayoutTR_INPUT(null, serviceItemSelectedDIV, elTable);
		
	    var ItemDataTable = new OPDataTable( "GetServiceItemForAddBoxSelection",
												 null,
												 BoxMainLogic.GetColumns("GetServiceItemForAddBoxSelection"),
												 "serviceItemSelected",
												 {	JSArrayObejct : { data : ItemSelectedData },
									    			l10nObj : l10nMsg,
													formatRow : BoxMainLogic.BoxBaseFormatter,
													selectionMode : "single",
													width : "105%",
													height : "105%",
													columnEditorIgnoreInfo : { ignoreColumnName : "serviceItemTagValue", ignoreColumnValue : "-"}
												 });
		BoxGlobal.BoxPageResourceMan.Add("GetServiceItemForAddBoxSelection_serviceItemSelected", ItemDataTable);
		
		
		var boxTagDIV = CruiseGlobal.CreateElement("DIV", "boxTagDIV");
		var addBoxTagSPAN = CruiseGlobal.CreateElement("SPAN", "addBoxTagSPAN", boxTagDIV);
		var initBoxTagSPAN = CruiseGlobal.CreateElement("SPAN", "initBoxTagSPAN", boxTagDIV);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_boxTag"], boxTagDIV, elTable);
		
		// Add Box Tag Panel
		var btnAddBoxTagCallback = function (){
			var BoxTagSelectLayout = function (btnClickCallback, config){
				var layoutWrapper = CruiseGlobal.CreateElement("div", "addBoxTagDialogLayout");
				var layoutBody = CruiseGlobal.CreateElement("div", "addBoxTagDialogLayoutBody", layoutWrapper, "bd");
				var BoxTagSelectInnerCallback = function (){
					BoxTagSelectDataTable = BoxMainLogic.GetPageBoxTagForAddItem(CruiseGlobal.GetElementValue("BoxTagSearchText"));
				};
				
				//Build Divs
				var dataPaginationDIV = CruiseGlobal.CreateElement("DIV", "BoxTagDataListPaginateSection", layoutBody, null);
				var searchCriteriaDIV = CruiseGlobal.CreateElement("DIV", "BoxTagSearchCriteriaDIV", layoutBody);
		
				var elArray = new Array();
				elArray.push(searchCriteriaDIV);
				elArray.push(CruiseGlobal.CreateElement("SPAN", "BoxTagSearchButton"));
				elArray.push(dataPaginationDIV);
				BoxGlobal.MakeSearchLayoutHTMLTable(elArray, layoutBody);
				
				var datatableDIV = CruiseGlobal.CreateElement("DIV", "BoxTagSearchDatatableDIV", layoutBody);
				datatableDIV.style.height = "370px";
				datatableDIV.style.width = "780px";

				//Input Tag
				var elInputArea = CruiseGlobal.CreateElement("INPUT", "BoxTagSearchText", searchCriteriaDIV, "txtInputNormal");
				var keyListener = new CruiseEvent.CreateKeyListener (elInputArea, 13, BoxTagSelectInnerCallback, this , false, false, this);
				keyListener.enable();

				//Search Button
				var btnSearch = new OPButton("BoxTagSearchButton", l10nMsg["text_13"], null, BoxTagSelectInnerCallback);
				btnSearch.SetHeight(20);

				//Resource Regiatration
				BoxGlobal.BoxSectionResourceMan.Add("BoxTagSearchButton", btnSearch);
				return layoutWrapper.innerHTML;
			}
			
			var oTagDialog = new OPDialog ("addBoxTagDialog", BoxTagSelectLayout(), null, l10nMsg["text_27"], null,
					{ width : 800,
					  height : 500 });
			
			var ClearDialogResources = function(){
				oTagDialog.Hide();
				CruiseGlobal.RemoveElement("addBoxTagDialogLayout");
				BoxGlobal.BoxSectionResourceMan.Remove("BoxTagSearchButton");
				BoxGlobal.BoxSectionResourceMan.Remove("addBoxTagDialog");
			}
			oTagDialog.SetButtons([{ text:l10nMsg["text_28"], width: 100, handler:function(o, msg) {
								var selectedRows = BoxTagSelectDataTable.GetSelectedRows();
								for (var i = 0; i < selectedRows.length; i++){
									var isSelected = false;
									for (var j = 0; j < BoxTagSelectedData.length; j++){
										if (BoxTagSelectedData[j].boxTagSN == selectedRows[i].boxTagSN){
											isSelected = true;
											break;
										}
									}
									if (isSelected == false){
										BoxTagSelectedData.push({boxTagSN : selectedRows[i].boxTagSN,
											boxTagName : selectedRows[i].boxTagName,
											boxTagDescription : selectedRows[i].boxTagDescription,
											boxTagValue : ''});
									}
								}
								BoxTagDataTable.Refresh();
								ClearDialogResources();
							}}, { text:l10nMsg["text_10"], width: 100, handler:function(o, msg) {
								ClearDialogResources();
							}}])
			oTagDialog.SetModal(true);
			oTagDialog.Show();
			
			BoxGlobal.BoxSectionResourceMan.Add("addBoxTagDialog", oTagDialog);
			BoxTagSelectDataTable = BoxMainLogic.GetPageBoxTagForAddItem();
		}
		
		var btnInitBoxTagCallback = function (){
			var len = BoxTagSelectedData.length;
			for (var i = 0; i < len; i++){
				BoxTagSelectedData.pop();
			}
			BoxTagDataTable.Refresh();
		};
		
		// Add Item Tag
		var btnAddBoxTag = new OPButton("AddBoxTag",
									l10nMsg["text_27"], 
									addBoxTagSPAN,
									btnAddBoxTagCallback);
		BoxGlobal.BoxSectionResourceMan.Add("btnAddBoxTag", btnAddBoxTag);
		
		// init Item Tag
		var btnInitBoxTag = new OPButton("InitBoxTag",
									l10nMsg["text_29"], 
									initBoxTagSPAN,
									btnInitBoxTagCallback);
		BoxGlobal.BoxSectionResourceMan.Add("btnInitBoxTag", btnInitBoxTag);
		
		var boxTagSelectedDIV = CruiseGlobal.CreateElement("DIV", "BoxTagSelected");
		BoxGlobal.MakeLayoutTR_INPUT(null, boxTagSelectedDIV, elTable);
		
	    var BoxTagDataTable = new OPDataTable( "GetBoxTagForAddBoxSelection",
												 null,
												 BoxMainLogic.GetColumns("GetBoxTagForAddBoxSelection"),
												 "BoxTagSelected",
												 {	JSArrayObejct : { data : BoxTagSelectedData },
									    			l10nObj : l10nMsg,
													formatRow : BoxMainLogic.BoxBaseFormatter,
													selectionMode : "single",
													width : "105%",
													height : "105%"});
		BoxGlobal.BoxPageResourceMan.Add("GetBoxTagForAddBoxSelection_BoxTagSelected", BoxTagDataTable);
	},
	LoadCreateBoxFromTemplateLayout : function (btnConfirmCallback) {
		PaneArray = BoxLayout.LoadDefaultRightLayout ({ paneCode : 19 });
		elActionPaneDiv = PaneArray[0];
		elBasePaneDiv = PaneArray[1];
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "ConfirmButton"));
		elArray.push(CruiseGlobal.CreateElement("SPAN", "CancelButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, elActionPaneDiv);
		
		//Confirm Button
		var btnConfirm = new OPButton("ConfirmButton",
									l10nMsg["text_23"], 
									elActionPaneDiv,
									btnConfirmCallback);
		BoxGlobal.BoxSectionResourceMan.Add("btnConfirm", btnConfirm);
	
		//Input Area
		var elTable = CruiseGlobal.CreateElement("TABLE", "BoxInfoTable", elBasePaneDiv, "BoxInfoTable");
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_boxTemplateSN"],
				CruiseGlobal.CreateElement("INPUT", "inputBoxTemplateSN", null, "txtInputSmall", { maxlength : 10 }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_receiverUserSN"],
				CruiseGlobal.CreateElement("INPUT", "inputReceiverUserSN", null, "txtInputSmall", { maxlength : 10 }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_receiverGUSID"],
				CruiseGlobal.CreateElement("INPUT", "inputReceiverGUSID", null, "txtInputSmall", { maxlength : 10 }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_receiverCharacterSN"],
				CruiseGlobal.CreateElement("INPUT", "inputReceiverCharacterSN", null, "txtInputSmall", { maxlength : 10 }), elTable);
		BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_receiverCharacterName"],
				CruiseGlobal.CreateElement("INPUT", "inputReceiverCharacterName", null, "txtInputNormal", { maxlength : 50 }), elTable);
	}
};



