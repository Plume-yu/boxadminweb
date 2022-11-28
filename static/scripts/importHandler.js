var ImportHandler = {
	elActionPaneDiv : null,
	elBasePaneDiv : null,
	elBottomPaneDiv : null,
	uploadedImportFileName : "",
	
	objImportServiceItemTagData : [],
	objImportBoxTagData : [],
	objImportServiceItemData : [],
	objImportBoxTemplateData : [],
	
	dtImportServiceItemTag : null,
	dtImportBoxTag : null,
	dtImportServiceItem : null,
	dtImportBoxTemplate : null,
	// Reset 
	
	ResetServiceItemTagList : function()
	{
		if (!ImportHandler.objImportServiceItemTagData || !ImportHandler.dtImportServiceItemTag)
			return;

		var len = ImportHandler.objImportServiceItemTagData.length;
		for (var i = 0; i < len; i++){
			ImportHandler.objImportServiceItemTagData.pop();
		}
		ImportHandler.dtImportServiceItemTag.Refresh();
		
	},
	ResetBoxTagList : function()
	{
		if (!ImportHandler.objImportBoxTagData || !ImportHandler.dtImportBoxTag)
			return;
		
		var len = ImportHandler.objImportBoxTagData.length;
		for (var i = 0; i < len; i++){
			ImportHandler.objImportBoxTagData.pop();
		}
		ImportHandler.dtImportBoxTag.Refresh();
	},
	ResetServiceItemList : function()
	{
		if (!ImportHandler.objImportServiceItemData || !ImportHandler.dtImportServiceItemTag)
			return;
		
		var len = ImportHandler.objImportServiceItemData.length;
		for (var i = 0; i < len; i++){
			ImportHandler.objImportServiceItemData.pop();
		}
		ImportHandler.dtImportServiceItem.Refresh();
	},
	ResetBoxTemplateList : function()
	{
		if (!ImportHandler.objImportBoxTemplateData || !ImportHandler.dtImportBoxTemplate)
			return;
		
		var len = ImportHandler.objImportBoxTemplateData.length;
		for (var i = 0; i < len; i++){
			ImportHandler.objImportBoxTemplateData.pop();
		}
		ImportHandler.dtImportBoxTemplate.Refresh();		
	},
	LoadImportLayout : function()
	{
		BoxGlobal.BoxPageResourceMan.Remove("leftCenterLayout");
		var newDiv = CruiseGlobal.CreateElement("div", "innerLeftCenter");
		CruiseGlobal.CreateElement("div", "LeftPaneNameArea", newDiv, "PaneNameArea", {body: BoxGlobal.GetPaneText(16)});
		var dataSectionDiv = CruiseGlobal.CreateElement("div", "DataListSection", newDiv, "ImportLeftDiv");
		BoxLayout.LoadLeftCenterLayout();
		
		// Contents
		CruiseGlobal.CreateElement("DIV", null, dataSectionDiv, "ExportSelectionDiv", {body: l10nMsg["msg_62"]})
		
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("DIV", null, null, "ExportSectionTextDiv", {body: l10nMsg["text_35"]}));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, dataSectionDiv);
		var ServiceItemTagSelectedDIV = CruiseGlobal.CreateElement("DIV", "ServiceItemTagSelected", dataSectionDiv, "ImportSelectionDiv");
		
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("DIV", null, null, "ExportSectionTextDiv", {body: l10nMsg["text_36"]}));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, dataSectionDiv);
		var boxTagSelectedDIV = CruiseGlobal.CreateElement("DIV", "BoxTagSelected", dataSectionDiv, "ImportSelectionDiv");
		
		
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("DIV", null, null, "ExportSectionTextDiv", {body: l10nMsg["text_37"]}));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, dataSectionDiv);
		var ServiceItemSelectedDIV = CruiseGlobal.CreateElement("DIV", "ServiceItemSelected", dataSectionDiv, "ImportSelectionDiv");
		
		
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("DIV", null, null, "ExportSectionTextDiv", {body: l10nMsg["text_38"]}));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, dataSectionDiv);
		var boxTemplateSelectedDIV = CruiseGlobal.CreateElement("DIV", "BoxTemplateSelected", dataSectionDiv, "ImportSelectionDiv");
		
		// Contents - ServiceItem Tag
		ImportHandler.dtImportServiceItemTag = new OPDataTable("ImportServiceItemTagSelection", null, BoxMainLogic.GetColumns("GetPageServiceItemTag"), "ServiceItemTagSelected",
															 {	JSArrayObejct : { data : ImportHandler.objImportServiceItemTagData },
												    			l10nObj : l10nMsg,
																formatRow : BoxMainLogic.BoxBaseFormatter,
																selectionMode : "null"});

	    // Contents - Box Tag
		ImportHandler.dtImportBoxTag = new OPDataTable("ImportBoxTagSelection", null, BoxMainLogic.GetColumns("GetPageBoxTag"), "BoxTagSelected",
														 {	JSArrayObejct : { data : ImportHandler.objImportBoxTagData },
											    			l10nObj : l10nMsg,
															formatRow : BoxMainLogic.BoxBaseFormatter,
															selectionMode : "null"});

		// Contents - ServiceItem
		ImportHandler.dtImportServiceItem = new OPDataTable("ImportServiceItemSelection", null, BoxMainLogic.GetColumns("GetPageServiceItem"), "ServiceItemSelected",
														 {	JSArrayObejct : { data : ImportHandler.objImportServiceItemData },
											    			l10nObj : l10nMsg,
															formatRow : BoxMainLogic.BoxBaseFormatter,
															selectionMode : "null"});

		// Contents - BoxTemplate
		ImportHandler.dtImportBoxTemplate = new OPDataTable("ImportBoxTemplateSelection", null, BoxMainLogic.GetColumns("GetPageBoxTemplate"), "BoxTemplateSelected",
														 {	JSArrayObejct : { data : ImportHandler.objImportBoxTemplateData },
											    			l10nObj : l10nMsg,
															formatRow : BoxMainLogic.BoxBaseFormatter,
															selectionMode : "null"});
		
		// Resource Registration for clean-up
		BoxGlobal.BoxPageResourceMan.Add("ImportServiceItemTagSelection_ServiceItemTagSelected", ImportHandler.dtImportServiceItemTag);
		BoxGlobal.BoxPageResourceMan.Add("ImportBoxTagSelection_BoxTagSelected", ImportHandler.dtImportBoxTag);
		BoxGlobal.BoxPageResourceMan.Add("ImportServiceItemSelection_ServiceItemSelected", ImportHandler.dtImportServiceItem);
		BoxGlobal.BoxPageResourceMan.Add("ImportBoxTemplateSelection_BoxTemplateSelected", ImportHandler.dtImportBoxTemplate);
		
		ImportHandler.LoadImportListLayout();
	},
	LoadImportListLayout : function ()
	{
		PaneArray = BoxLayout.LoadDefaultRightLayout ({ paneCode : 16 });
		ImportHandler.elActionPaneDiv = PaneArray[0];
		ImportHandler.elBasePaneDiv = PaneArray[1];
		ImportHandler.elBottomPaneDiv = PaneArray[2];
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		ImportHandler.ResetServiceItemTagList();
		ImportHandler.ResetBoxTagList();
		ImportHandler.ResetServiceItemList();
		ImportHandler.ResetBoxTemplateList();
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "uploaderDiv"));
		elArray.push(CruiseGlobal.CreateElement("DIV", "uploadProgressBarDiv", null, "uploadProgressBar"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, ImportHandler.elActionPaneDiv);
		
		CruiseGlobal.CreateElement("DIV", "analyzeDiv", ImportHandler.elBasePaneDiv, "analyzeResultDiv");
		CruiseGlobal.AddNewLineHTML("analyzeDiv", l10nMsg["msg_70"], true);
		
		CruiseGlobal.SetElHide("uploadProgressBarDiv");
		var uploadPgb = new OPProgressBar ("upload", "uploadProgressBarDiv", {value:0, minValue:0, maxValue:1, height: 7});
		var upLoader = new OPUploader("importUploader",CruiseGlobal.GetEl("uploaderDiv"), "importUpload", 
				{uploadButtonText: l10nMsg["text_42"],
				allowedExtensions: ['bef'],
				typeErrorMsg: l10nMsg["msg_64"],
		        sizeErrorMsg: l10nMsg["msg_65"],
		        minSizeErrorMsg: l10nMsg["msg_66"],
		        emptyErrorMsg: l10nMsg["msg_67"],
		        onLeave: l10nMsg["msg_68"]}
		);

		upLoader.RegisterEventProgress(function(id, fileName, loaded, total){
			uploadPgb.SetMaxValue(total);
			uploadPgb.SetValue(loaded);
		});
		
		upLoader.RegisterEventSubmit(function(id, fileName){
			upLoader.FlushUploadList();
			uploadPgb.SetMaxValue(1);
			uploadPgb.SetValue(0);
			CruiseGlobal.SetElShow("uploadProgressBarDiv");
			
			//Reset
			BoxGlobal.BoxSectionResourceMan.Remove("RegisterButton");
			ImportHandler.ResetServiceItemTagList();
			ImportHandler.ResetBoxTagList();
			ImportHandler.ResetServiceItemList();
			ImportHandler.ResetBoxTemplateList();
			
			CruiseGlobal.SetHTML("analyzeDiv", l10nMsg["msg_73"], true);
		});
		
		upLoader.RegisterEventComplete(function(id, fileName, messages){
			if (!BoxGlobal.ValidateResponse(messages)) return;

			for (var i = 0; i < messages.returnTables[0].length; i++){
				ImportHandler.objImportServiceItemTagData.push(messages.returnTables[0][i]);
			}
			
			for (var i = 0; i < messages.returnTables[1].length; i++){
				ImportHandler.objImportBoxTagData.push(messages.returnTables[1][i]);
			}
			
			for (var i = 0; i < messages.returnTables[2].length; i++){
				ImportHandler.objImportServiceItemData.push(messages.returnTables[2][i]);
			}
			
			for (var i = 0; i < messages.returnTables[3].length; i++){
				ImportHandler.objImportBoxTemplateData.push(messages.returnTables[3][i]);
			}

			ImportHandler.dtImportServiceItemTag.Refresh();
			ImportHandler.dtImportBoxTag.Refresh();
			ImportHandler.dtImportServiceItem.Refresh();
			ImportHandler.dtImportBoxTemplate.Refresh();
			
			ImportHandler.uploadedImportFileName = messages.importFileName;
			
			CruiseGlobal.AddNewLineHTML("analyzeDiv", l10nMsg["msg_71"]);
			CruiseGlobal.AddNewLineHTML("analyzeDiv", l10nMsg["msg_72"] + ImportHandler.uploadedImportFileName, true);
			
			if (messages.analyzeList.length > 0){
				CruiseGlobal.SHOWINFO (l10nMsg["text_43"], l10nMsg["msg_69"], l10nMsg["text_09"]);
				CruiseGlobal.AddNewLineHTML("analyzeDiv", l10nMsg["msg_69"], true);
			}
			else{
				CruiseGlobal.AddNewLineHTML("analyzeDiv", l10nMsg["msg_74"], true);
			}
			
			for (var i = 0; i < messages.analyzeList.length; i++){
				var category = messages.analyzeList[i].category;
				var type = messages.analyzeList[i].type;
				var keyColumn = messages.analyzeList[i].keyColumn;
				var value = messages.analyzeList[i].value;
				
				switch(category){
				case 'boxTag':
					category = l10nMsg["text_36"];
					break;
				case 'serviceItemTag':
					category = l10nMsg["text_35"];
					break;
				case 'serviceItem':
					category = l10nMsg["text_37"];
					break;
				case 'boxTemplate':
					category = l10nMsg["text_38"];
					break;
				case 'serviceItemTagValue':
					category = l10nMsg["text_48"];
					break;
				case 'boxTemplateTagValue':
					category = l10nMsg["text_49"];
					break;
				case 'boxTemplateItem':
					category = l10nMsg["text_50"];
					break;
				case 'boxTemplateItemTagValue':
					category = l10nMsg["text_51"];
					break;
				}
				
				switch(type){
				case 1:
					CruiseGlobal.AddNewLineHTML("analyzeDiv", 
							CruiseGlobal.ToL10NMsg("<B>" + l10nMsg["msg_76"] + "</B>",
									[category, l10nMsg["col_" + keyColumn], value]));
					break;
				case 2:
					var diffColumn = messages.analyzeList[i].diffColumn;
					var fileVal = messages.analyzeList[i].fileVal;
					var dbVal = messages.analyzeList[i].dbVal;
					CruiseGlobal.AddNewLineHTML("analyzeDiv", 
							"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color='blue'>" + CruiseGlobal.ToL10NMsg(l10nMsg["msg_77"],
									[category, l10nMsg["col_" + keyColumn], value, l10nMsg["col_" + diffColumn], fileVal, dbVal]) + "</font>");
					break;
				case 3:
					var keyColumn2 = messages.analyzeList[i].keyColumn2;
					var value2 = messages.analyzeList[i].value2;
					CruiseGlobal.AddNewLineHTML("analyzeDiv", 
							CruiseGlobal.ToL10NMsg("<B>" + l10nMsg["msg_78"] + "</B>",
									[category, l10nMsg["col_" + keyColumn], value, l10nMsg["col_" + keyColumn2], value2]));
					break;
				case 4:
					var keyColumn2 = messages.analyzeList[i].keyColumn2;
					var value2 = messages.analyzeList[i].value2;
					var diffColumn = messages.analyzeList[i].diffColumn;
					var fileVal = messages.analyzeList[i].fileVal;
					var dbVal = messages.analyzeList[i].dbVal;
					CruiseGlobal.AddNewLineHTML("analyzeDiv", 
							"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color='blue'>" + CruiseGlobal.ToL10NMsg(l10nMsg["msg_79"],
									[category, l10nMsg["col_" + keyColumn], value, l10nMsg["col_" + keyColumn2], value2,
									 l10nMsg["col_" + diffColumn], fileVal, dbVal]) + "</font>");
					break;
					
				}
			}
			
			var CheckRegister = function(){
			    var RegisterProcess = function (){
			        this.hide();
			        ImportHandler.RegisterStart();
			    }

			    var qstBox = new OPMsgBox ("ConfirmRegisterImport",
			    							l10nMsg["msg_75"],
			    							l10nMsg["text_43"],
			    							{isFixedCenter: true,
			    							isDraggable: true,
			    							isClose: false,
			    							isModal: true
			             					});
			    qstBox.SetICON("warn");
			    qstBox.SetButtons([{ text:l10nMsg["text_09"], handler:RegisterProcess, isDefault:true }, { text:l10nMsg["text_10"],  handler: function () {this.hide();} }]);
			    qstBox.Show();
			};
		    
			//Display Handler
			var elArray = new Array();
			elArray.push(CruiseGlobal.CreateElement("SPAN", "RegisterButton"));
			BoxGlobal.MakeSearchLayoutHTMLTable(elArray, ImportHandler.elBottomPaneDiv);
			
			// Buttons
			var btnRegister = new OPButton("RegisterButton", l10nMsg["text_44"], null, CheckRegister);
			btnRegister.SetHeight(25);
			btnRegister.SetFontBold();
			btnRegister.SetFontSize(12);
			btnRegister.SetFontColor("#FF4444");
			
			// Resource Registration for clean-up
			BoxGlobal.BoxSectionResourceMan.Add("RegisterButton", btnRegister);
		});
	},
	RegisterStart : function(){
		var _callback = function(o, messages) {
			if (!BoxGlobal.ValidateResponse(messages)){
				CruiseGlobal.SetHTML("analyzeDiv", l10nMsg["msg_83"], true);
				return;
			}
			
			var isFailExisted = false;
			for (var i = 0; i < messages.resultList.length; i++){
				var category = messages.resultList[i].category;
				var type = messages.resultList[i].type;
				var success = messages.resultList[i].success;
				var text = messages.resultList[i].text;
				var keyColumn = messages.resultList[i].keyColumn;
				var value = messages.resultList[i].value;
				
				switch(category){
				case 'boxTag':
					category = l10nMsg["text_36"];
					break;
				case 'serviceItemTag':
					category = l10nMsg["text_35"];
					break;
				case 'serviceItem':
					category = l10nMsg["text_37"];
					break;
				case 'boxTemplate':
					category = l10nMsg["text_38"];
					break;
				case 'serviceItemTagValue':
					category = l10nMsg["text_48"];
					break;
				case 'boxTemplateTagValue':
					category = l10nMsg["text_49"];
					break;
				case 'boxTemplateItem':
					category = l10nMsg["text_50"];
					break;
				case 'boxTemplateItemTagValue':
					category = l10nMsg["text_51"];
					break;
				}
				
				switch(type){
				case 1:
					if (success){
						CruiseGlobal.AddNewLineHTML("analyzeDiv", CruiseGlobal.ToL10NMsg("<B>" + l10nMsg["msg_81"] + "</B>",
								[category, l10nMsg["col_" + keyColumn], value]));
					}else{
						isFailExisted = true;
						CruiseGlobal.AddNewLineHTML("analyzeDiv", "<B><font color='red'>" + CruiseGlobal.ToL10NMsg(l10nMsg["msg_82"],
								[category, l10nMsg["col_" + keyColumn], value, text]) + "</font></B>");
					}
					break;
				case 2:
					var keyColumn2 = messages.resultList[i].keyColumn2;
					var value2 = messages.resultList[i].value2;
					if (success){
						CruiseGlobal.AddNewLineHTML("analyzeDiv", CruiseGlobal.ToL10NMsg("<B>" + l10nMsg["msg_84"] + "</B>",
								[category, l10nMsg["col_" + keyColumn], value, l10nMsg["col_" + keyColumn2], value2]));
					}else{
						isFailExisted = true;
						CruiseGlobal.AddNewLineHTML("analyzeDiv", "<B><font color='red'>" + CruiseGlobal.ToL10NMsg(l10nMsg["msg_85"],
								[category, l10nMsg["col_" + keyColumn], value, l10nMsg["col_" + keyColumn2], value2, text]) + "</font></B>");
					}
					break;
				}
			}
			
			if (isFailExisted){
				CruiseGlobal.SHOWINFO (l10nMsg["text_11"], l10nMsg["msg_86"], l10nMsg["text_09"]);
				CruiseGlobal.AddNewLineHTML("analyzeDiv", "<BR>" + l10nMsg["msg_86"]);
			}else{
				CruiseGlobal.AddNewLineHTML("analyzeDiv", "<BR>" + l10nMsg["msg_87"]);
			}
		};
		OPAjaxRequest("POST", "importStart", _callback, "fileName=" + ImportHandler.uploadedImportFileName);
		BoxGlobal.BoxSectionResourceMan.Remove("RegisterButton");
		CruiseGlobal.SetHTML("analyzeDiv", l10nMsg["msg_80"] + "<BR>", true);
		BoxGlobal.ShowLoading();
	},
	LoadImportLanguageDataLayout : function ()
	{
		PaneArray = BoxLayout.LoadDefaultRightLayout ({ paneCode : 21 });
		ImportHandler.elActionPaneDiv = PaneArray[0];
		ImportHandler.elBasePaneDiv = PaneArray[1];
		ImportHandler.elBottomPaneDiv = PaneArray[2];
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "uploaderDiv"));
		elArray.push(CruiseGlobal.CreateElement("DIV", "uploadProgressBarDiv", null, "uploadProgressBar"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, ImportHandler.elActionPaneDiv);
		
		CruiseGlobal.CreateElement("DIV", "analyzeDiv", ImportHandler.elBasePaneDiv, "analyzeResultDiv");
		CruiseGlobal.AddNewLineHTML("analyzeDiv", l10nMsg["msg_70"], true);
		
		CruiseGlobal.SetElHide("uploadProgressBarDiv");
		var uploadPgb = new OPProgressBar ("upload", "uploadProgressBarDiv", {value:0, minValue:0, maxValue:1, height: 7});
		var upLoader = new OPUploader("importUploader",CruiseGlobal.GetEl("uploaderDiv"), "importLanguageDataUpload", 
				{uploadButtonText: l10nMsg["text_42"],
				allowedExtensions: ['csv'],
				typeErrorMsg: l10nMsg["msg_64"],
		        sizeErrorMsg: l10nMsg["msg_65"],
		        minSizeErrorMsg: l10nMsg["msg_66"],
		        emptyErrorMsg: l10nMsg["msg_67"],
		        onLeave: l10nMsg["msg_68"]}
		);

		upLoader.RegisterEventProgress(function(id, fileName, loaded, total){
			uploadPgb.SetMaxValue(total);
			uploadPgb.SetValue(loaded);
		});
		
		upLoader.RegisterEventSubmit(function(id, fileName){
			upLoader.FlushUploadList();
			uploadPgb.SetMaxValue(1);
			uploadPgb.SetValue(0);
			CruiseGlobal.SetElShow("uploadProgressBarDiv");
			
			//Reset
			BoxGlobal.BoxSectionResourceMan.Remove("RegisterButton");
			
			CruiseGlobal.SetHTML("analyzeDiv", l10nMsg["msg_80"] + "<BR>", true);
			BoxGlobal.ShowLoading();
		});
		
		upLoader.RegisterEventComplete(function(id, fileName, messages){
			BoxGlobal.HideLoading(false);
			if (!BoxGlobal.ValidateResponse(messages)) return;			
			CruiseGlobal.SetHTML("analyzeDiv", l10nMsg["msg_88"]);
		});
	}
};