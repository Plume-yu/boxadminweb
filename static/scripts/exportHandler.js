var ExportHandler = {
	opTabView : null,
	elActionPaneDiv : null,
	elBasePaneDiv : null,
	
	objExportServiceItemTagData : [],
	objExportBoxTagData : [],
	objExportServiceItemData : [],
	objExportBoxTemplateData : [],
	
	dtExportServiceItemTag : null,
	dtExportBoxTag : null,
	dtExportServiceItem : null,
	dtExportBoxTemplate : null,
	
	exportHistoryDataTable : null,
	exportHistoryNameTextBox : null,
	
	// Reset 
	ResetServiceItemTagList : function()
	{
		if (!ExportHandler.objExportServiceItemTagData || !ExportHandler.dtExportServiceItemTag)
			return;
		
		var len = ExportHandler.objExportServiceItemTagData.length;
		for (var i = 0; i < len; i++){
			ExportHandler.objExportServiceItemTagData.pop();
		}

		ExportHandler.dtExportServiceItemTag.Refresh();
	},
	ResetBoxTagList : function()
	{
		if (!ExportHandler.objExportBoxTagData || !ExportHandler.dtExportBoxTag)
			return;
		
		var len = ExportHandler.objExportBoxTagData.length;
		for (var i = 0; i < len; i++){
			ExportHandler.objExportBoxTagData.pop();
		}
		ExportHandler.dtExportBoxTag.Refresh();
	},
	ResetServiceItemList : function()
	{
		if (!ExportHandler.objExportServiceItemData || !ExportHandler.dtExportServiceItemTag)
			return;
		
		var len = ExportHandler.objExportServiceItemData.length;
		for (var i = 0; i < len; i++){
			ExportHandler.objExportServiceItemData.pop();
		}
		ExportHandler.dtExportServiceItem.Refresh();
	},
	ResetBoxTemplateList : function()
	{
		if (!ExportHandler.objExportBoxTemplateData || !ExportHandler.dtExportBoxTemplate)
			return;
		
		var len = ExportHandler.objExportBoxTemplateData.length;
		for (var i = 0; i < len; i++){
			ExportHandler.objExportBoxTemplateData.pop();
		}
		ExportHandler.dtExportBoxTemplate.Refresh();		
	},
	ResetAllExportList : function()
	{
		ExportHandler.ResetServiceItemTagList();
		ExportHandler.ResetBoxTagList();
		ExportHandler.ResetServiceItemList();
		ExportHandler.ResetBoxTemplateList();
		ExportHandler.exportHistoryNameTextBox.value = "";
	},
	LoadExportLanguageDataLayout : function()
	{
		var _callback = function(o, messages) {
			if (!BoxGlobal.ValidateResponse(messages)) return;
			
			var DownloadDialogLayout = function (btnClickCallback, config){
				var layoutWrapper = CruiseGlobal.CreateElement("div", "downloadDialogLayout");
				var layoutBody = CruiseGlobal.CreateElement("div", "downloadDialogLayoutBody", layoutWrapper, "bd");
				
				CruiseGlobal.CreateElement("div", null, layoutBody, "downloadTitle", {body: l10nMsg["msg_56"]});
				CruiseGlobal.CreateElement("div", null, layoutBody, "downloadSubTitle", {body: l10nMsg["msg_57"]});
				CruiseGlobal.CreateElement("a", null, layoutBody, "downloadText", {body: l10nMsg["text_45"], href: "./data/export/" + messages.serviceItemFileName});
				CruiseGlobal.CreateElement("a", null, layoutBody, "downloadText", {body: "| " + l10nMsg["text_46"], href: "./data/export/" + messages.serviceItemTagFileName});
				CruiseGlobal.CreateElement("a", null, layoutBody, "downloadText", {body: "| " + l10nMsg["text_57"], href: "./data/export/" + messages.boxTagFileName});
				CruiseGlobal.CreateElement("a", null, layoutBody, "downloadText", {body: "| " + l10nMsg["text_47"], href: "./data/export/" + messages.boxTemplateFileName});
				return layoutWrapper.innerHTML;
			}
			
			var oDialog = new OPDialog ("downloadDialog", DownloadDialogLayout(), null, l10nMsg["text_40"], null,
					{ width : 400,
					  height : 250 });
			
			var ClearDialogResources = function(){
				oDialog.Hide();
				CruiseGlobal.RemoveElement("downloadDialogLayout");
				BoxGlobal.BoxSectionResourceMan.Remove("downloadDialog");
			}
			
			var loadingCount = 0;
			oDialog.SetButtons([{ text:l10nMsg["text_09"], width: 100, handler:function(o, msg) {
								ClearDialogResources();
							}}])
			oDialog.SetModal(true);
			oDialog.Show();
			
			BoxGlobal.BoxSectionResourceMan.Add("downloadDialog", oDialog);
		}
		
		OPAjaxRequest("POST", "exportLanguageDataDownload", _callback, "exportData=");
	},
	LoadExportLayout : function ()
	{
		BoxGlobal.BoxPageResourceMan.Remove("leftCenterLayout");
		var newDiv = CruiseGlobal.CreateElement("div", "innerLeftCenter");
		CruiseGlobal.CreateElement("div", "LeftPaneNameArea", newDiv, "ImportPaneNameArea", {body: BoxGlobal.GetPaneText(15)});
		var tabDiv = CruiseGlobal.CreateElement("div", "DataListSection", newDiv);
		ExportHandler.opTabView = new OPTabView ("exportTabView", tabDiv);

		BoxLayout.LoadLeftCenterLayout();

		var _callback = function(o, messages) {
			if (!BoxGlobal.ValidateResponse(messages)) return;
			
			if (messages.ServiceItemTagExport != null && messages.ServiceItemTagExport){
				ExportHandler.LoadServiceItemTagExportLayout();
			}
			if (messages.BoxTagExport != null && messages.BoxTagExport){
				ExportHandler.LoadBoxTagExportLayout();
			}
			if (messages.ServiceItemExport != null && messages.ServiceItemExport){
				ExportHandler.LoadServiceItemExportLayout();
			}
			if (messages.BoxTemplateExport != null && messages.BoxTemplateExport){
				ExportHandler.LoadBoxTemplateExportLayout();
			}
			if (messages.ExportHistory != null && messages.ExportHistory){
				ExportHandler.LoadExportHistoryLayout();
			}
			
			ExportHandler.opTabView.SelectTab(0);
			ExportHandler.LoadExportListLayout();
		};
		OPAjaxRequest("GET", "checkExportPrivileges", _callback);
		BoxGlobal.ShowLoading();
	},
	LoadExportListLayout : function ()
	{
		PaneArray = BoxLayout.LoadDefaultRightLayout ({ paneCode : 15 });
		ExportHandler.elActionPaneDiv = PaneArray[0];
		ExportHandler.elBasePaneDiv = PaneArray[1];
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		//Build Divs
		var exportHistoryNameTextBox_DIV = CruiseGlobal.CreateElement("DIV", "exportHistoryNameTextBox_DIV", ExportHandler.elActionPaneDiv);
		var createExportHistoryButton_DIV = CruiseGlobal.CreateElement("DIV", "createExportHistoryButton_DIV", ExportHandler.elActionPaneDiv);
		var downloadButton_DIV = CruiseGlobal.CreateElement("DIV", "downloadButton_DIV", ExportHandler.elActionPaneDiv);
		var resetExportListButton_DIV = CruiseGlobal.CreateElement("DIV", "resetExportListButton_DIV", ExportHandler.elActionPaneDiv);

//		var elArray = new Array();
//		elArray.push(CruiseGlobal.CreateElement("DIV", "AddServiceItemButton", null, "ExportAddButton"));
//		elArray.push(searchCriteriaDIV);
//		elArray.push(CruiseGlobal.CreateElement("DIV", "SearchServiceItemButton"));
//		elArray.push(dataPaginationDIV);
//		
//		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, exportActionDiv);
		
		//Display Handler
		var elArray = new Array();
		elArray.push(exportHistoryNameTextBox_DIV);
		elArray.push(createExportHistoryButton_DIV);
		elArray.push(downloadButton_DIV);
		elArray.push(resetExportListButton_DIV);
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, ExportHandler.elActionPaneDiv);
		
		//Label
		var elInputLabel = CruiseGlobal.CreateElement("LABEL", "ExportHistoryNameLabel", exportHistoryNameTextBox_DIV, null, {body: l10nMsg["text_54"], paddingRight: "10px"});
		
		//Input Tag
		var elInputArea = CruiseGlobal.CreateElement("INPUT", "ExportHistoryNameTextBox", exportHistoryNameTextBox_DIV, "txtInputSmall");
		ExportHandler.exportHistoryNameTextBox = elInputArea;
		
		// Buttons
		var btnDownload = new OPButton("CreateExportHistoryButton", l10nMsg["text_58"], downloadButton_DIV, ExportHandler.Download, {mode: "CreateExportHistory"});
		btnDownload.SetHeight(25);
		btnDownload.SetFontBold();
		btnDownload.SetFontSize(12);
		btnDownload.SetFontColor("#FF4444");
		
		var btnDownload = new OPButton("DownloadButton", l10nMsg["text_40"], downloadButton_DIV, ExportHandler.Download, {mode: "CreateExportFile"});
		btnDownload.SetHeight(25);
		btnDownload.SetFontBold();
		btnDownload.SetFontSize(12);
		btnDownload.SetFontColor("#FF4444");
		
		var btnResetExportList = new OPButton("ResetExportListButton", l10nMsg["text_29"], resetExportListButton_DIV, ExportHandler.ResetAllExportList);
		btnResetExportList.SetHeight(25);
//		btnResetExportList.SetFontBold();
		btnResetExportList.SetFontSize(12);
//		btnResetExportList.SetFontColor("#FF4444");
		
		// Resource Registration for clean-up
		BoxGlobal.BoxSectionResourceMan.Add("DownloadButton", btnDownload);
		BoxGlobal.BoxSectionResourceMan.Add("ResetExportListButton", btnResetExportList);
		
		// Contents
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("DIV", null, null, "ExportSectionTextDiv", {body: l10nMsg["text_35"]}));
		elArray.push(CruiseGlobal.CreateElement("DIV", "ResetServiceItemTagButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, ExportHandler.elBasePaneDiv);
		var ServiceItemTagSelectedDIV = CruiseGlobal.CreateElement("DIV", "ServiceItemTagSelected", ExportHandler.elBasePaneDiv, "ExportSelectionDiv");
		
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("DIV", null, null, "ExportSectionTextDiv", {body: l10nMsg["text_36"]}));
		elArray.push(CruiseGlobal.CreateElement("DIV", "ResetBoxTagButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, ExportHandler.elBasePaneDiv);
		var boxTagSelectedDIV = CruiseGlobal.CreateElement("DIV", "BoxTagSelected", ExportHandler.elBasePaneDiv, "ExportSelectionDiv");
		
		
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("DIV", null, null, "ExportSectionTextDiv", {body: l10nMsg["text_37"]}));
		elArray.push(CruiseGlobal.CreateElement("DIV", "ResetServiceItemButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, ExportHandler.elBasePaneDiv);
		var ServiceItemSelectedDIV = CruiseGlobal.CreateElement("DIV", "ServiceItemSelected", ExportHandler.elBasePaneDiv, "ExportSelectionDiv");
		
		
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("DIV", null, null, "ExportSectionTextDiv", {body: l10nMsg["text_38"]}));
		elArray.push(CruiseGlobal.CreateElement("DIV", "ResetBoxTemplateButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, ExportHandler.elBasePaneDiv);
		var boxTemplateSelectedDIV = CruiseGlobal.CreateElement("DIV", "BoxTemplateSelected", ExportHandler.elBasePaneDiv, "ExportSelectionDiv");
		
//		var btnServiceItemTagReset = new OPButton("ResetServiceItemTagButton", l10nMsg["text_29"], null, ExportHandler.ResetServiceItemTagList);
//		var btnBoxTagReset = new OPButton("ResetBoxTagButton", l10nMsg["text_29"], null, ExportHandler.ResetBoxTagList);
//		var btnServiceItemReset = new OPButton("ResetServiceItemButton", l10nMsg["text_29"], null, ExportHandler.ResetServiceItemList);
//		var btnBoxTemplateReset = new OPButton("ResetBoxTemplateButton", l10nMsg["text_29"], null, ExportHandler.ResetBoxTemplateList);
		
		// Resource Registration for clean-up
//		BoxGlobal.BoxSectionResourceMan.Add("ResetServiceItemTagButton", btnServiceItemTagReset);
//		BoxGlobal.BoxSectionResourceMan.Add("ResetBoxTagButton", btnBoxTagReset);
//		BoxGlobal.BoxSectionResourceMan.Add("ResetServiceItemButton", btnServiceItemReset);
//		BoxGlobal.BoxSectionResourceMan.Add("ResetBoxTemplateButton", btnBoxTemplateReset);
		
		// Contents - ServiceItem Tag
		ExportHandler.dtExportServiceItemTag = new OPDataTable("ExportServiceItemTagSelection", null, BoxMainLogic.GetColumns("ServiceItemTagForExport"), "ServiceItemTagSelected",
															 {	JSArrayObejct : { data : ExportHandler.objExportServiceItemTagData },
												    			l10nObj : l10nMsg,
																formatRow : BoxMainLogic.BoxBaseFormatter,
																selectionMode : "null"});

	    // Contents - Box Tag
		ExportHandler.dtExportBoxTag = new OPDataTable("ExportBoxTagSelection", null, BoxMainLogic.GetColumns("BoxTagForExport"), "BoxTagSelected",
														 {	JSArrayObejct : { data : ExportHandler.objExportBoxTagData },
											    			l10nObj : l10nMsg,
															formatRow : BoxMainLogic.BoxBaseFormatter,
															selectionMode : "null"});

		// Contents - ServiceItem
		ExportHandler.dtExportServiceItem = new OPDataTable("ExportServiceItemSelection", null, BoxMainLogic.GetColumns("ServiceItemForExport"), "ServiceItemSelected",
														 {	JSArrayObejct : { data : ExportHandler.objExportServiceItemData },
											    			l10nObj : l10nMsg,
															formatRow : BoxMainLogic.BoxBaseFormatter,
															selectionMode : "null"});

		// Contents - BoxTemplate
		ExportHandler.dtExportBoxTemplate = new OPDataTable("ExportBoxTemplateSelection", null, BoxMainLogic.GetColumns("BoxTemplateForExport"), "BoxTemplateSelected",
														 {	JSArrayObejct : { data : ExportHandler.objExportBoxTemplateData },
											    			l10nObj : l10nMsg,
															formatRow : BoxMainLogic.BoxBaseFormatter,
															selectionMode : "null"});
		
		// Resource Registration for clean-up
		BoxGlobal.BoxSectionResourceMan.Add("ExportServiceItemTagSelection_ServiceItemTagSelected", ExportHandler.dtExportServiceItemTag);
		BoxGlobal.BoxSectionResourceMan.Add("ExportBoxTagSelection_BoxTagSelected", ExportHandler.dtExportBoxTag);
		BoxGlobal.BoxSectionResourceMan.Add("ExportServiceItemSelection_ServiceItemSelected", ExportHandler.dtExportServiceItem);
		BoxGlobal.BoxSectionResourceMan.Add("ExportBoxTemplateSelection_BoxTemplateSelected", ExportHandler.dtExportBoxTemplate);
	},
	// ServiceItem Tag Layout
	LoadServiceItemTagExportLayout : function()
	{
		var ExportDataTable = null;
		var exportActionDiv = CruiseGlobal.CreateElement("div", "ExportServiceItemTagAction", null, "ExportTab");
		ExportHandler.opTabView.AddTab(l10nMsg["text_35"], exportActionDiv, false);
		
		var innerCallback = function ()
		{
			ExportHandler.GetServiceItemTagExportList({ enableFlag : CruiseGlobal.GetElementValue("enableServiceItemTagFlagSelect"),
				tagName : CruiseGlobal.GetElementValue("SearchServiceItemTagText") });
		};
		
		//Build Divs
		var dataPaginationDIV = CruiseGlobal.CreateElement("DIV", "ServiceItemTagPagination", exportActionDiv, null, {paddingLeft : "30px"});
		var searchCriteriaDIV = CruiseGlobal.CreateElement("DIV", "ServiceItemTagSearchCriteriaDIV", exportActionDiv);

		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("DIV", "AddServiceItemTagButton", null, "ExportAddButton"));
		elArray.push(searchCriteriaDIV);
		elArray.push(CruiseGlobal.CreateElement("DIV", "SearchServiceItemTagButton"));
		elArray.push(dataPaginationDIV);
		
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, exportActionDiv);
		
		//Content Div
		CruiseGlobal.CreateElement("div", "ServiceItemTagDataListSection", exportActionDiv);
		
		//Add Button
		var btnSearch = new OPButton("AddServiceItemTagButton", l10nMsg["text_39"], null,
				function (){ 
					var selectedRows = ExportDataTable.GetSelectedRows();
					for (var i = 0; i < selectedRows.length; i++){
						var isSelected = false;
						for (var j = 0; j < ExportHandler.objExportServiceItemTagData.length; j++){
							if (ExportHandler.objExportServiceItemTagData[j].serviceItemTagSN == selectedRows[i].serviceItemTagSN){
								isSelected = true;
								break;
							}
						}
						if (isSelected == false){
							ExportHandler.objExportServiceItemTagData.push({
								serviceItemTagSN : selectedRows[i].serviceItemTagSN,
								serviceItemTagName : selectedRows[i].serviceItemTagName,
								serviceItemTagDescription : selectedRows[i].serviceItemTagDescription,
								serviceItemValidationRuleSN : selectedRows[i].serviceItemValidationRuleSN,
								serviceItemTagEnableFlag : selectedRows[i].serviceItemTagEnableFlag_hidden});
						}
					}
					
					ExportHandler.dtExportServiceItemTag.Refresh();
				});
		btnSearch.SetHeight(25);
		btnSearch.SetFontBold();
		btnSearch.SetFontSize(12);
		btnSearch.SetFontColor("#FF4444");
		
		//Option Tag
		var enableFlagSelect = CruiseGlobal.CreateElement("SELECT", "enableServiceItemTagFlagSelect", searchCriteriaDIV);
		CruiseGlobal.CreateElement("OPTION", null, enableFlagSelect, null, {value: 1, body: l10nMsg["text_14"]});
		CruiseGlobal.CreateElement("OPTION", null, enableFlagSelect, null, {value: 0, body: l10nMsg["text_15"]});		
		var selectKeyListener = new CruiseEvent.CreateKeyListener (enableFlagSelect, 13, innerCallback, this, false, false, this);
		selectKeyListener.enable();
		
		//Input Tag
		var elInputArea = CruiseGlobal.CreateElement("INPUT", "SearchServiceItemTagText", searchCriteriaDIV, "txtInputVerySmall");
		var keyListener = new CruiseEvent.CreateKeyListener (elInputArea, 13, innerCallback, this, false, false, this);
		keyListener.enable();
		
		//Search Button
		var btnSearch = new OPButton("SearchServiceItemTagButton", l10nMsg["text_13"], null, function (){ innerCallback(); });
		btnSearch.SetHeight(20);

		//Resource Regiatration
		BoxGlobal.BoxPageResourceMan.Add("btnExportAddServiceItemTag", btnSearch);
		BoxGlobal.BoxPageResourceMan.Add("btnExportSearchServiceItemTag", btnSearch);
		
		ExportDataTable = ExportHandler.GetServiceItemTagExportList();
	},
	// ServiceItem Tag List
	GetServiceItemTagExportList : function (objs)
	{
		var addRequestVal = '';
		if (objs)
		{
			addRequestVal += "&enableFlag=" + objs.enableFlag;
			if (objs.tagName != null && objs.tagName != '')
				addRequestVal += "&serviceItemTagName=" + objs.tagName;
		}
		else
			addRequestVal = '&enableFlag=1';
		
		BoxGlobal.BoxPageResourceMan.Remove("GetPageServiceItemTag_ServiceItemTagDataListSection");
		
		return BoxMainLogic.CreateBoxDatatable("GetPageServiceItemTag",
												"getPageServiceItemTag?",
												"GetPageServiceItemTag",
												"ServiceItemTagDataListSection",
												{
													addRequestParamFn : function () { return addRequestVal; },
													paginator : new OPPaginator("ServiceItemTagPagination", BoxGlobal.IndividualData.BoxDatatablePageSize, true, BoxGlobal.DefaultPaginatorConfig()), 
													l10nObj : l10nMsg,
													formatRow : BoxMainLogic.BoxBaseFormatter,
													sortColumn : "serviceItemTagSN",
													sortDir : "asc",
													selectionMode : "multi"},
												0);
	},
	//Box Tag Layout
	LoadBoxTagExportLayout : function()
	{
		var ExportDataTable = null;
		var exportActionDiv = CruiseGlobal.CreateElement("div", "ExportBoxTagAction", null, "ExportTab");
		ExportHandler.opTabView.AddTab(l10nMsg["text_36"], exportActionDiv, false);
		
		var innerCallback = function ()
		{
			ExportHandler.GetBoxTagExportList({ enableFlag : CruiseGlobal.GetElementValue("enableBoxTagFlagSelect"),
				tagName : CruiseGlobal.GetElementValue("SearchBoxTagText") });
		};
		
		//Build Divs
		var dataPaginationDIV = CruiseGlobal.CreateElement("DIV", "BoxTagPagination", exportActionDiv, null, {paddingLeft : "30px"});
		var searchCriteriaDIV = CruiseGlobal.CreateElement("DIV", "BoxTagSearchCriteriaDIV", exportActionDiv);

		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("DIV", "AddBoxTagButton", null, "ExportAddButton"));
		elArray.push(searchCriteriaDIV);
		elArray.push(CruiseGlobal.CreateElement("DIV", "SearchBoxTagButton"));
		elArray.push(dataPaginationDIV);
		
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, exportActionDiv);
		
		//Content Div
		CruiseGlobal.CreateElement("div", "BoxTagDataListSection", exportActionDiv);
		
		//Add Button
		var btnSearch = new OPButton("AddBoxTagButton", l10nMsg["text_39"], null,
				function (){ 
					var selectedRows = ExportDataTable.GetSelectedRows();
					for (var i = 0; i < selectedRows.length; i++){
						var isSelected = false;
						for (var j = 0; j < ExportHandler.objExportBoxTagData.length; j++){
							if (ExportHandler.objExportBoxTagData[j].boxTagSN == selectedRows[i].boxTagSN){
								isSelected = true;
								break;
							}
						}
						if (isSelected == false){
							ExportHandler.objExportBoxTagData.push({
								boxTagSN : selectedRows[i].boxTagSN,
								boxTagName : selectedRows[i].boxTagName,
								boxTagDescription : selectedRows[i].boxTagDescription,
								boxTagEnableFlag : selectedRows[i].boxTagEnableFlag});
						}
					}
					
					ExportHandler.dtExportBoxTag.Refresh();
				});
		btnSearch.SetHeight(25);
		btnSearch.SetFontBold();
		btnSearch.SetFontSize(12);
		btnSearch.SetFontColor("#FF4444");
		
		//Option Tag
		var enableFlagSelect = CruiseGlobal.CreateElement("SELECT", "enableBoxTagFlagSelect", searchCriteriaDIV);
		CruiseGlobal.CreateElement("OPTION", null, enableFlagSelect, null, {value: 1, body: l10nMsg["text_14"]});
		CruiseGlobal.CreateElement("OPTION", null, enableFlagSelect, null, {value: 0, body: l10nMsg["text_15"]});		
		var selectKeyListener = new CruiseEvent.CreateKeyListener (enableFlagSelect, 13, innerCallback, this, false, false, this);
		selectKeyListener.enable();
		
		//Input Tag
		var elInputArea = CruiseGlobal.CreateElement("INPUT", "SearchBoxTagText", searchCriteriaDIV, "txtInputVerySmall");
		var keyListener = new CruiseEvent.CreateKeyListener (elInputArea, 13, innerCallback, this, false, false, this);
		keyListener.enable();
		
		//Search Button
		var btnSearch = new OPButton("SearchBoxTagButton", l10nMsg["text_13"], null, function (){ innerCallback(); });
		btnSearch.SetHeight(20);

		//Resource Regiatration
		BoxGlobal.BoxPageResourceMan.Add("btnExportAddBoxTag", btnSearch);
		BoxGlobal.BoxPageResourceMan.Add("btnExportSearchBoxTag", btnSearch);
		
		ExportDataTable = ExportHandler.GetBoxTagExportList();
	},
	//Box Tag List
	GetBoxTagExportList : function (objs)
	{
		var addRequestVal = '';
		if (objs)
		{
			addRequestVal += "&enableFlag=" + objs.enableFlag;
			if (objs.tagName != null && objs.tagName != '')
				addRequestVal += "&boxTagName=" + objs.tagName;
		}
		else
			addRequestVal = '&enableFlag=1';
		
		BoxGlobal.BoxPageResourceMan.Remove("GetPageBoxTag_BoxTagDataListSection");
		
		return BoxMainLogic.CreateBoxDatatable("GetPageBoxTag",
												"getPageBoxTag?",
												"GetPageBoxTag",
												"BoxTagDataListSection",
												{
													addRequestParamFn : function () { return addRequestVal; },
													paginator : new OPPaginator("BoxTagPagination", BoxGlobal.IndividualData.BoxDatatablePageSize, true, BoxGlobal.DefaultPaginatorConfig()), 
													l10nObj : l10nMsg,
													formatRow : BoxMainLogic.BoxBaseFormatter,
													sortColumn : "boxTagSN",
													sortDir : "asc",
													selectionMode : "multi"},
												0);
	},
	//ServiceItem Layout
	LoadServiceItemExportLayout : function()
	{
		var ExportDataTable = null;
		var exportActionDiv = CruiseGlobal.CreateElement("div", "ExportServiceItemAction", null, "ExportTab");
		ExportHandler.opTabView.AddTab(l10nMsg["text_37"], exportActionDiv, false);
		
		var innerCallback = function ()
		{
			ExportHandler.GetServiceItemExportList({ enableFlag : CruiseGlobal.GetElementValue("enableServiceItemFlagSelect"),
				serviceItemMappingItemSN : CruiseGlobal.GetElementValue("SearchServiceItemText") });
		};
		
		//Build Divs
		var dataPaginationDIV = CruiseGlobal.CreateElement("DIV", "ServiceItemPagination", exportActionDiv, null, {paddingLeft : "30px"});
		var searchCriteriaDIV = CruiseGlobal.CreateElement("DIV", "ServiceItemSearchCriteriaDIV", exportActionDiv);

		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("DIV", "AddServiceItemButton", null, "ExportAddButton"));
		elArray.push(searchCriteriaDIV);
		elArray.push(CruiseGlobal.CreateElement("DIV", "SearchServiceItemButton"));
		elArray.push(dataPaginationDIV);
		
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, exportActionDiv);
		
		//Content Div
		CruiseGlobal.CreateElement("div", "ServiceItemDataListSection", exportActionDiv);
		
		//Add Button
		var btnSearch = new OPButton("AddServiceItemButton", l10nMsg["text_39"], null,
				function (){ 
					var selectedRows = ExportDataTable.GetSelectedRows();
					for (var i = 0; i < selectedRows.length; i++){
						var isSelected = false;
						for (var j = 0; j < ExportHandler.objExportServiceItemData.length; j++){
							if (ExportHandler.objExportServiceItemData[j].serviceItemSN == selectedRows[i].serviceItemSN){
								isSelected = true;
								break;
							}
						}
						if (isSelected == false){
							ExportHandler.objExportServiceItemData.push({
								serviceItemSN : selectedRows[i].serviceItemSN,
								serviceItemServiceSN : selectedRows[i].serviceItemServiceSN,
								serviceItemMappingItemSN : selectedRows[i].serviceItemMappingItemSN,
								serviceItemEnableFlag : selectedRows[i].serviceItemEnableFlag_hidden,
								serviceItemStartActivationDateTime : selectedRows[i].serviceItemStartActivationDateTime_hidden,
								serviceItemName : selectedRows[i].serviceItemName,
								serviceItemDescription : selectedRows[i].serviceItemDescription
							});
						}
					}
					
					ExportHandler.dtExportServiceItem.Refresh();
				});
		btnSearch.SetHeight(25);
		btnSearch.SetFontBold();
		btnSearch.SetFontSize(12);
		btnSearch.SetFontColor("#FF4444");
		
		//Option Tag
		var enableFlagSelect = CruiseGlobal.CreateElement("SELECT", "enableServiceItemFlagSelect", searchCriteriaDIV);
		CruiseGlobal.CreateElement("OPTION", null, enableFlagSelect, null, {value: 1, body: l10nMsg["text_14"]});
		CruiseGlobal.CreateElement("OPTION", null, enableFlagSelect, null, {value: 0, body: l10nMsg["text_15"]});		
		var selectKeyListener = new CruiseEvent.CreateKeyListener (enableFlagSelect, 13, innerCallback, this, false, false, this);
		selectKeyListener.enable();
		
		//Input Tag
		var elInputArea = CruiseGlobal.CreateElement("INPUT", "SearchServiceItemText", searchCriteriaDIV, "txtInputVerySmall");
		var keyListener = new CruiseEvent.CreateKeyListener (elInputArea, 13, innerCallback, this, false, false, this);
		keyListener.enable();
		
		//Search Button
		var btnSearch = new OPButton("SearchServiceItemButton", l10nMsg["text_13"], null, function (){ innerCallback(); });
		btnSearch.SetHeight(20);

		//Resource Regiatration
		BoxGlobal.BoxPageResourceMan.Add("btnExportAddServiceItem", btnSearch);
		BoxGlobal.BoxPageResourceMan.Add("btnExportSearchServiceItem", btnSearch);

		ExportDataTable = ExportHandler.GetServiceItemExportList();
	},
	//ServiceItem List
	GetServiceItemExportList : function (objs)
	{
		var addRequestVal = '';
		if (objs)
		{
			addRequestVal += "&enableFlag=" + objs.enableFlag;
			if (objs.serviceItemMappingItemSN != null && objs.serviceItemMappingItemSN != '')
				addRequestVal += "&serviceItemMappingItemSN=" + objs.serviceItemMappingItemSN;
		}
		else
			addRequestVal = '&enableFlag=1';
		
		BoxGlobal.BoxPageResourceMan.Remove("GetPageServiceItem_ServiceItemDataListSection");

		return BoxMainLogic.CreateBoxDatatable("GetPageServiceItem",
												"getPageServiceItem?",
												"GetPageServiceItem",
												"ServiceItemDataListSection",
												{
													addRequestParamFn : function () { return addRequestVal; },
													paginator : new OPPaginator("ServiceItemPagination", BoxGlobal.IndividualData.BoxDatatablePageSize, true, BoxGlobal.DefaultPaginatorConfig()), 
													l10nObj : l10nMsg,
													formatRow : BoxMainLogic.BoxBaseFormatter,
													sortColumn : "serviceItemSN",
													sortDir : "asc",
													selectionMode : "multi"},
												0);
	},
	//BoxTemplate Layout
	LoadBoxTemplateExportLayout : function()
	{
		var ExportDataTable = null;
		var exportActionDiv = CruiseGlobal.CreateElement("div", "ExportBoxTemplateAction", null, "ExportTab");
		ExportHandler.opTabView.AddTab(l10nMsg["text_38"], exportActionDiv, false);
		
		var innerCallback = function ()
		{
			ExportHandler.GetBoxTemplateExportList({ enableFlag : CruiseGlobal.GetElementValue("enableBoxTemplateFlagSelect"),
				searchCondition : CruiseGlobal.GetElementValue("SearchBoxTemplateText") });
		};
		
		//Build Divs
		var dataPaginationDIV = CruiseGlobal.CreateElement("DIV", "BoxTemplatePagination", exportActionDiv, null, {paddingLeft : "30px"});
		var searchCriteriaDIV = CruiseGlobal.CreateElement("DIV", "BoxTemplateSearchCriteriaDIV", exportActionDiv);

		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("DIV", "AddBoxTemplateButton", null, "ExportAddButton"));
		elArray.push(searchCriteriaDIV);
		elArray.push(CruiseGlobal.CreateElement("DIV", "SearchBoxTemplateButton"));
		elArray.push(dataPaginationDIV);
		
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, exportActionDiv);
		
		//Content Div
		CruiseGlobal.CreateElement("div", "BoxTemplateDataListSection", exportActionDiv);
		
		//Add Button
		var btnSearch = new OPButton("AddBoxTemplateButton", l10nMsg["text_39"], null,
				function (){ 
					var selectedRows = ExportDataTable.GetSelectedRows();
					for (var i = 0; i < selectedRows.length; i++){
						var isSelected = false;
						for (var j = 0; j < ExportHandler.objExportBoxTemplateData.length; j++){
							if (ExportHandler.objExportBoxTemplateData[j].boxTemplateSN == selectedRows[i].boxTemplateSN){
								isSelected = true;
								break;
							}
						}
						if (isSelected == false){
							ExportHandler.objExportBoxTemplateData.push({
								boxTemplateSN : selectedRows[i].boxTemplateSN,
								boxTemplateTitle : selectedRows[i].boxTemplateTitle,
								boxTemplateCreateUserSN : selectedRows[i].boxTemplateCreateUserSN,
								boxTemplateCreateDateTime : selectedRows[i].boxTemplateCreateDateTime,
								boxTemplateStartActivationDateTime : selectedRows[i].boxTemplateStartActivationDateTime_hidden,
								boxTemplateEndActivationDateTime : selectedRows[i].boxTemplateEndActivationDateTime_hidden,
								boxTemplateEnableFlag : selectedRows[i].boxTemplateEnableFlag
							});
						}
					}
					
					ExportHandler.dtExportBoxTemplate.Refresh();
				});
		btnSearch.SetHeight(25);
		btnSearch.SetFontBold();
		btnSearch.SetFontSize(12);
		btnSearch.SetFontColor("#FF4444");
		
		//Option Tag
		var enableFlagSelect = CruiseGlobal.CreateElement("SELECT", "enableBoxTemplateFlagSelect", searchCriteriaDIV);
		CruiseGlobal.CreateElement("OPTION", null, enableFlagSelect, null, {value: 1, body: l10nMsg["text_14"]});
		CruiseGlobal.CreateElement("OPTION", null, enableFlagSelect, null, {value: 0, body: l10nMsg["text_15"]});		
		var selectKeyListener = new CruiseEvent.CreateKeyListener (enableFlagSelect, 13, innerCallback, this, false, false, this);
		selectKeyListener.enable();
		
		//Input Tag
		var elInputArea = CruiseGlobal.CreateElement("INPUT", "SearchBoxTemplateText", searchCriteriaDIV, "txtInputVerySmall");
		var keyListener = new CruiseEvent.CreateKeyListener (elInputArea, 13, innerCallback, this, false, false, this);
		keyListener.enable();
		
		//Search Button
		var btnSearch = new OPButton("SearchBoxTemplateButton", l10nMsg["text_13"], null, function (){ innerCallback(); });
		btnSearch.SetHeight(20);

		//Resource Regiatration
		BoxGlobal.BoxPageResourceMan.Add("btnExportAddBoxTemplate", btnSearch);
		BoxGlobal.BoxPageResourceMan.Add("btnExportSearchBoxTemplate", btnSearch);

		ExportDataTable = ExportHandler.GetBoxTemplateExportList();
	},
	//BoxTemplate List
	GetBoxTemplateExportList : function (objs)
	{
		var addRequestVal = '';
		if (objs)
		{
			addRequestVal += "&enableFlag=" + objs.enableFlag;
			if (objs.searchCondition != null && objs.searchCondition != '')
				addRequestVal += "&searchCondition=" + objs.searchCondition;
		}
		else
			addRequestVal = '&enableFlag=1';
		
		BoxGlobal.BoxPageResourceMan.Remove("GetPageBoxTemplate_BoxTemplateDataListSection");
		
		return BoxMainLogic.CreateBoxDatatable("GetPageBoxTemplate",
												"getPageBoxTemplate?",
												"GetPageBoxTemplate",
												"BoxTemplateDataListSection",
												{
													addRequestParamFn : function () { return addRequestVal; },
													paginator : new OPPaginator("BoxTemplatePagination", BoxGlobal.IndividualData.BoxDatatablePageSize, true, BoxGlobal.DefaultPaginatorConfig()), 
													l10nObj : l10nMsg,
													formatRow : BoxMainLogic.BoxBaseFormatter,
													sortColumn : "boxTemplateSN",
													sortDir : "asc",
													selectionMode : "multi"},
												0);
	},
	//ExportHistory Layout
	LoadExportHistoryLayout : function()
	{
		var ExportDataTable = null;
		var exportActionDiv = CruiseGlobal.CreateElement("div", "ExportHistoryAction", null, "ExportTab");
		ExportHandler.opTabView.AddTab(l10nMsg["text_53"], exportActionDiv, false);
		
		var innerCallback = function ()
		{
			ExportHandler.exportHistoryDataTable = ExportHandler.GetExportHistoryList({ enableFlag : CruiseGlobal.GetElementValue("enableExportHistoryFlagSelect"),
				searchCondition : CruiseGlobal.GetElementValue("SearchExportHistoryText") });
		};
		
		//Build Divs
		var dataPaginationDIV = CruiseGlobal.CreateElement("DIV", "ExportHistoryPagination", exportActionDiv, null, {paddingLeft : "30px"});
		var searchCriteriaDIV = CruiseGlobal.CreateElement("DIV", "ExportHistorySearchCriteriaDIV", exportActionDiv);

		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("DIV", "AddExportHistoryButton", null, "ExportAddButton"));
		elArray.push(searchCriteriaDIV);
		elArray.push(CruiseGlobal.CreateElement("DIV", "SearchExportHistoryButton"));
		elArray.push(dataPaginationDIV);
		
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, exportActionDiv);
		
		//Content Div
		CruiseGlobal.CreateElement("div", "ExportHistoryDataListSection", exportActionDiv);
		
		function Callback_AddExportHistoryButton()
		{
			ExportHandler.ResetAllExportList();
			
			function Callback_GetDetailExportHistory(o, message) {
				if (!BoxGlobal.ValidateResponse(message)) return;
				
				var exportHistoryName = message.returnTables[0][0][0].exportHistoryName;
				
				ExportHandler.exportHistoryNameTextBox.value = exportHistoryName;
//				CruiseGlobal.SetElementValue("ExportHistoryNameTextBox", exportHistoryName);
				
				var serviceItemTagData = message.returnTables[1][0];
				
				for (index in serviceItemTagData) {
					ExportHandler.objExportServiceItemTagData.push({
						serviceItemTagSN : serviceItemTagData[index].serviceItemTagSN,
						serviceItemTagName : serviceItemTagData[index].serviceItemTagName,
						serviceItemTagDescription : serviceItemTagData[index].serviceItemTagDescription,
						serviceItemValidationRuleSN : serviceItemTagData[index].serviceItemValidationRuleSN,
						serviceItemTagEnableFlag : serviceItemTagData[index].enableFlag});
				}
				
				ExportHandler.dtExportServiceItemTag.Refresh();
				
				var boxTagData = message.returnTables[2][0];
				
				for (index in boxTagData) {
					ExportHandler.objExportBoxTagData.push({
						boxTagSN : boxTagData[index].boxTagSN,
						boxTagName : boxTagData[index].boxTagName,
						boxTagDescription : boxTagData[index].boxTagDescription,
						boxTagEnableFlag : boxTagData[index].enableFlag});
				}
				
				ExportHandler.dtExportBoxTag.Refresh();
				
				var serviceItemData = message.returnTables[3][0];
				
				for (index in serviceItemData) {
					ExportHandler.objExportServiceItemData.push({
						serviceItemSN : serviceItemData[index].serviceItemSN,
						serviceItemServiceSN : serviceItemData[index].serviceItemServiceSN,
						serviceItemMappingItemSN : serviceItemData[index].serviceItemMappingItemSN,
						serviceItemEnableFlag : serviceItemData[index].enableFlag,
						serviceItemStartActivationDateTime : serviceItemData[index].serviceItemStartActivationDateTime_hidden,
						serviceItemName : serviceItemData[index].serviceItemName,
						serviceItemDescription : serviceItemData[index].serviceItemDescription});
				}
				
				ExportHandler.dtExportServiceItem.Refresh();
				
				var boxTemplateData = message.returnTables[4][0];
				
				for (index in boxTemplateData) {
					ExportHandler.objExportBoxTemplateData.push({
						boxTemplateSN : boxTemplateData[index].boxTemplateSN,
						boxTemplateTitle : boxTemplateData[index].boxTemplateTitle,
						boxTemplateCreateUserSN : boxTemplateData[index].boxTemplateCreateUserSN,
						boxTemplateCreateDateTime : boxTemplateData[index].boxTemplateCreateDateTime,
						boxTemplateStartActivationDateTime : boxTemplateData[index].boxTemplateStartActivationDateTime_hidden,
						boxTemplateEndActivationDateTime : boxTemplateData[index].boxTemplateEndActivationDateTime_hidden,
						boxTemplateEnableFlag : boxTemplateData[index].enableFlag});
				}
				
				ExportHandler.dtExportBoxTemplate.Refresh();
			}
			
			var selectedRows = ExportHandler.exportHistoryDataTable.GetSelectedRows();
			
			if (selectedRows.length > 0) {
				OPAjaxRequest("POST", "getDetailExportHistory", Callback_GetDetailExportHistory, "exportHistorySN=" + selectedRows[0].exportHistorySN);
			}
			else {
				// 선택된 row가 없는 에러처리
			}
		}
		
		//Add Button
		var btnSearch = new OPButton("AddExportHistoryButton", l10nMsg["text_39"], null, Callback_AddExportHistoryButton);
		btnSearch.SetHeight(25);
		btnSearch.SetFontBold();
		btnSearch.SetFontSize(12);
		btnSearch.SetFontColor("#FF4444");
		
		//Option Tag
		var enableFlagSelect = CruiseGlobal.CreateElement("SELECT", "enableExportHistoryFlagSelect", searchCriteriaDIV);
		CruiseGlobal.CreateElement("OPTION", null, enableFlagSelect, null, {value: 1, body: l10nMsg["text_14"]});
		CruiseGlobal.CreateElement("OPTION", null, enableFlagSelect, null, {value: 0, body: l10nMsg["text_15"]});		
		var selectKeyListener = new CruiseEvent.CreateKeyListener (enableFlagSelect, 13, innerCallback, this, false, false, this);
		selectKeyListener.enable();
		
		//Input Tag
		var elInputArea = CruiseGlobal.CreateElement("INPUT", "SearchExportHistoryText", searchCriteriaDIV, "txtInputVerySmall");
		var keyListener = new CruiseEvent.CreateKeyListener (elInputArea, 13, innerCallback, this, false, false, this);
		keyListener.enable();
		
		//Search Button
		var btnSearch = new OPButton("SearchExportHistoryButton", l10nMsg["text_13"], null, function (){ innerCallback(); });
		btnSearch.SetHeight(20);

		//Resource Regiatration
		BoxGlobal.BoxPageResourceMan.Add("btnExportAddExportHistory", btnSearch);
		BoxGlobal.BoxPageResourceMan.Add("btnExportSearchExportHistory", btnSearch);

		ExportHandler.exportHistoryDataTable = ExportHandler.GetExportHistoryList();
	},
	//BoxTemplate List
	GetExportHistoryList : function (objs)
	{
		var addRequestVal = '';
		if (objs)
		{
			addRequestVal += "&enableFlag=" + objs.enableFlag;
			if (objs.searchCondition != null && objs.searchCondition != '')
				addRequestVal += "&searchCondition=" + objs.searchCondition;
		}
		else
			addRequestVal = '&enableFlag=1';
		
		BoxGlobal.BoxPageResourceMan.Remove("GetPageExportHistory_ExportHistoryDataListSection");
		
		return BoxMainLogic.CreateBoxDatatable("GetPageExportHistory",
												"getPageExportHistory?",
												"GetPageExportHistory",
												"ExportHistoryDataListSection",
												{
													addRequestParamFn : function () { return addRequestVal; },
													paginator : new OPPaginator("ExportHistoryPagination", BoxGlobal.IndividualData.BoxDatatablePageSize, true, BoxGlobal.DefaultPaginatorConfig()), 
													l10nObj : l10nMsg,
													formatRow : BoxMainLogic.BoxBaseFormatter,
													sortColumn : "exportHistorySN",
													sortDir : "desc",
													selectionMode : "multi"},
												0);
	},
	Download : function (evt, obj)
	{
		if (ExportHandler.objExportServiceItemTagData.length + 
			ExportHandler.objExportBoxTagData.length +
			ExportHandler.objExportServiceItemData.length +
			ExportHandler.objExportBoxTemplateData.length <= 0)
		{
			CruiseGlobal.SHOWINFO (l10nMsg["text_09"], l10nMsg["msg_51"], l10nMsg["text_09"]);
			return;
		}
		
		var exportServiceItem = [];
		for (var i = 0; i < ExportHandler.objExportServiceItemData.length; i++){
			exportServiceItem.push({
				serviceItemSN : ExportHandler.objExportServiceItemData[i].serviceItemSN,
				serviceItemServiceSN : ExportHandler.objExportServiceItemData[i].serviceItemServiceSN,
				serviceItemEnableFlag : ExportHandler.objExportServiceItemData[i].serviceItemEnableFlag
			});
		}
		
		var exportBoxTemplate = [];
		for (var i = 0; i < ExportHandler.objExportBoxTemplateData.length; i++){
			exportBoxTemplate.push({
				boxTemplateSN : ExportHandler.objExportBoxTemplateData[i].boxTemplateSN,
				boxTemplateEnableFlag : ExportHandler.objExportBoxTemplateData[i].boxTemplateEnableFlag});
		}

		var exportData = {
				itemTag : ExportHandler.objExportServiceItemTagData,
				boxTag : ExportHandler.objExportBoxTagData,
				serviceItem : exportServiceItem,
				boxTemplate : exportBoxTemplate
		}
		var _callback = function(o, messages) {
			if (!BoxGlobal.ValidateResponse(messages)) return;
			
			var DownloadDialogLayout = function (btnClickCallback, config){
				
				var layoutWrapper = CruiseGlobal.CreateElement("div", "downloadDialogLayout");
				var layoutBody = CruiseGlobal.CreateElement("div", "downloadDialogLayoutBody", layoutWrapper, "bd");
				
				CruiseGlobal.CreateElement("div", null, layoutBody, "downloadTitle", {body: l10nMsg["msg_56"]});
				CruiseGlobal.CreateElement("div", null, layoutBody, "downloadText", {body: l10nMsg["msg_58"] + " " + messages.serviceItemTagCount});
				CruiseGlobal.CreateElement("div", null, layoutBody, "downloadText", {body: l10nMsg["msg_59"] + " " + messages.boxTagCount});
				CruiseGlobal.CreateElement("div", null, layoutBody, "downloadText", {body: l10nMsg["msg_60"] + " " + messages.serviceItemCount});
				CruiseGlobal.CreateElement("div", null, layoutBody, "downloadText", {body: l10nMsg["msg_61"] + " " + messages.boxTemplateCount});
				
				CruiseGlobal.CreateElement("div", null, layoutBody, "downloadSubTitle", {body: l10nMsg["msg_57"]});
				CruiseGlobal.CreateElement("A", null, layoutBody, "downloadText", {body: l10nMsg["text_41"], href: "./data/export/" + messages.exportFileName});
				CruiseGlobal.CreateElement("A", null, layoutBody, "downloadText", {body: l10nMsg["text_55"], href: "./data/export/" + messages.scriptExportFileName});
				CruiseGlobal.CreateElement("BR", null, layoutBody, "downloadText");
				CruiseGlobal.CreateElement("BR", null, layoutBody, "downloadText");
				CruiseGlobal.CreateElement("A", null, layoutBody, "downloadText", {body: l10nMsg["text_59"], href: "./data/export/" + messages.jsonFileName});
				CruiseGlobal.CreateElement("A", null, layoutBody, "downloadText", {body: l10nMsg["text_61"], href: "./data/export/" + messages.boxTemplateJsonFileName});
				CruiseGlobal.CreateElement("BR", null, layoutBody, "downloadText");
				CruiseGlobal.CreateElement("BR", null, layoutBody, "downloadText");
				CruiseGlobal.CreateElement("A", null, layoutBody, "downloadText", {body: l10nMsg["text_60"], href: "./data/export/" + messages.languageDataFileName});
				return layoutWrapper.innerHTML;
			}
			
			var oDialog = new OPDialog ("downloadDialog", DownloadDialogLayout(), null, l10nMsg["text_40"], null,
					{ width : 400,
					  height : 250 });
			
			var ClearDialogResources = function(){
				oDialog.Hide();
				CruiseGlobal.RemoveElement("downloadDialogLayout");
				BoxGlobal.BoxSectionResourceMan.Remove("downloadDialog");
			}
			
			oDialog.SetButtons([{ text:l10nMsg["text_09"], width: 100, handler:function(o, msg) {
								ClearDialogResources();
							}}])
			oDialog.SetModal(true);
			oDialog.Show();
			
			ExportHandler.exportHistoryDataTable = ExportHandler.GetExportHistoryList();
			
			BoxGlobal.BoxSectionResourceMan.Add("downloadDialog", oDialog);
		}
		
//		var exportHistoryName = CruiseGlobal.GetElementValue("ExportHistoryNameTextBox");
		var exportHistoryName = ExportHandler.exportHistoryNameTextBox.value;
		
		OPAjaxRequest("POST", "exportDownload", _callback, "exportHistoryName=" + exportHistoryName + "&exportMode=" + obj.mode + "&exportData=" + CruiseGlobal.ReplaceToSpecialChar(CruiseGlobal.ToJsonString(exportData)));
		BoxGlobal.ShowLoading();
	}
};
