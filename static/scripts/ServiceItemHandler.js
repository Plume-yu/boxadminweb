/*==================================
    
     ServiceItemHandler Scripts
        
====================================*/

function ISelectedDataTable(selectedValues, tableObj) {
	ServiceItemHandler.objParentOPTable = tableObj;
	ServiceItemHandler.GetServiceItem(selectedValues[0].serviceItemSN);
	ServiceItemHandler.serviceItemSN = selectedValues[0].serviceItemSN;
}

function InitializePane() {
	PaneArray = BoxLayout.LoadDefaultRightLayout ({ paneCode : 8 });
	ServiceItemHandler.elActionPaneDiv = PaneArray[0];
	ServiceItemHandler.elBasePaneDiv = PaneArray[1];
}

function SetOPTable(tableObj) {
	ServiceItemHandler.objParentOPTable = tableObj;
}

function GetServiceItem(serviceItemSN) {
	function _callback(o, messages) {
		if (!BoxGlobal.ValidateResponse(messages))
			return;
		
		var serviceItem = messages.returnTables[0][0][0];
		var serviceItemTags = messages.returnTables[1][0];
		
		ServiceItemHandler.InitializePane();
		
		//Resource Truncation
		BoxGlobal.BoxSectionResourceMan.RemoveAll();
		
		//Display Handler
		var elArray = new Array();
		elArray.push(CruiseGlobal.CreateElement("SPAN", "RemoveButton"));
		elArray.push(CruiseGlobal.CreateElement("SPAN", "ModifyButton"));
		BoxGlobal.MakeSearchLayoutHTMLTable(elArray, ServiceItemHandler.elActionPaneDiv);
		
		//Remove Button
		var btnRemove = new OPButton("RemoveButton", l10nMsg["text_20"],
				ServiceItemHandler.elActionPaneDiv,
				ServiceItemHandler.RemoveServiceItem,
				{serviceItemSN: serviceItem.serviceItemSN});
		BoxGlobal.BoxSectionResourceMan.Add("btnRemove", btnRemove);

		//Modify Button
		var btnModify = new OPButton("ModifyButton",
				l10nMsg["text_21"],
				ServiceItemHandler.elActionPaneDiv,
				ServiceItemHandler.ModifyServiceItem,
				{data: [serviceItem, serviceItemTags]});
		BoxGlobal.BoxSectionResourceMan.Add("btnModify", btnModify);
		
		if (serviceItem.serviceItemEnableFlag != 1)
		{
			btnRemove.Disabled(true);
			//btnModify.Disabled(true);
		}

		//Display Data
		var elTable = CruiseGlobal.CreateElement("TABLE", "BoxInfoTable", ServiceItemHandler.elBasePaneDiv, "BoxInfoTable");
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_serviceItemSN"], serviceItem.serviceItemSN], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_serviceItemServiceSN"], serviceItem.serviceItemServiceSN], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_serviceItemMappingItemSN"], serviceItem.serviceItemMappingItemSN], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_serviceItemEnableFlag"], BoxGlobal.GetCodeText('enableFlag', serviceItem.serviceItemEnableFlag)], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_serviceItemStartActivationDateTime"], CruiseGlobal.GetLocalTimeString(serviceItem.serviceItemStartActivationDateTime)], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_serviceItemName"], serviceItem.serviceItemName], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_serviceItemDescription"], serviceItem.serviceItemDescription], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_serviceItemRegisterUserSN"], serviceItem.serviceItemRegisterUserSN], elTable);
		BoxGlobal.MakeLayoutTR_HTML([l10nMsg["col_serviceItemRegisterDateTime"], CruiseGlobal.GetLocalTimeString(serviceItem.serviceItemRegisterDateTime)], elTable);
		
		var serviceItemTagDataTableDIV = CruiseGlobal.CreateElement("DIV", "ServiceItemDataTableDIV");
		BoxGlobal.MakeLayoutTR_INPUT(null, serviceItemTagDataTableDIV, elTable);
		
		var serviceItemTagData = [];
		var data_table_params = {JSArrayObejct: {data: serviceItemTagData},
								 l10nObj: l10nMsg,
								 formatRow: BoxMainLogic.BoxBaseFormatter,
								 selectionMode: "null",
								 width: "105%",
								 height: "105%"}
		
		var ServiceItemTagDataTable = new OPDataTable(
				"ServiceItemDataTable",
				null,
				BoxMainLogic.GetColumns("ServiceItemTagDataTable"),
				"ServiceItemDataTableDIV",
				data_table_params);
		BoxGlobal.BoxSectionResourceMan.Add("ServiceItemTagDataTable", ServiceItemTagDataTable);
		
		for (var k = 0; k < serviceItemTags.length; k++){
			var row = {serviceItemTagSN: serviceItemTags[k].serviceItemTagSN,
					   serviceItemTagName: serviceItemTags[k].serviceItemTagName,
					   serviceItemValidationValue: serviceItemTags[k].serviceItemValidationValue,
					   serviceItemTagDescription: serviceItemTags[k].serviceItemTagDescription,
					   serviceItemValidationRuleSN: serviceItemTags[k].serviceItemValidationRuleSN};
			
			serviceItemTagData.push(row);
		}
		
		ServiceItemTagDataTable.Refresh();
	}
	
	OPAjaxRequest("POST", "getDetailServiceItemAndServiceItemTag", _callback, "serviceItemSN=" + serviceItemSN);
}

function RemoveServiceItem(event, objs) {
    function ClickConfirm() {
    	function _callback(o, messages) {
			if (!BoxGlobal.ValidateResponse(messages)) return;
			CruiseGlobal.SHOWINFO (l10nMsg["text_20"], objs.serviceItemSN + l10nMsg["msg_30"], l10nMsg["text_09"]);
			ServiceItemHandler.GetServiceItem(objs.serviceItemSN);
			ServiceItemHandler.objParentOPTable.Refresh();
		};
		
    	OPAjaxRequest("POST", "removeServiceItem", _callback, "serviceItemSN=" + objs.serviceItemSN);
		this.hide();
		BoxGlobal.ShowLoading();
    }
    
    function ClickCancel() {
    	this.hide();
    }
    
    var qstBox = new OPMsgBox ("ConfirmRemove", objs.serviceItemSN + l10nMsg["msg_29"], l10nMsg["text_20"],
    						   {isFixedCenter: true, isDraggable: false, isClose: true, isModal: true, width: 300});
    qstBox.SetICON("warn");
    qstBox.SetButtons([{text:l10nMsg["text_09"], handler: ClickConfirm, isDefault: true}, { text: l10nMsg["text_10"],  handler: ClickCancel}]);
    qstBox.Show();
}

function ModifyServiceItem(event, objs) {
	serviceItem = objs.data[0]
	serviceItemTags = objs.data[1]
	
	ServiceItemHandler.InitializePane();
	
	//Resource Truncation
	BoxGlobal.BoxSectionResourceMan.RemoveAll();
	
	//Display Handler
	var elArray = new Array();
	elArray.push(CruiseGlobal.CreateElement("SPAN", "ConfirmButton"));
	elArray.push(CruiseGlobal.CreateElement("SPAN", "CancelButton"));
	BoxGlobal.MakeSearchLayoutHTMLTable(elArray, ServiceItemHandler.elActionPaneDiv);
	
	var ItemTagDataTable = null;
	var ItemTagSelectDataTable = null;
	
	var elItemMappingSN = null;
	var elServiceSN = null;
	var elServiceItemName = null;
	var elServiceItemDescription = null;
	var elYear = null, elMonth = null, elDay = null, elHour = null, elMinute = null;
	var elEnableFlag = null;
	var ItemTagSelectedData = [];
	
	function btnConfirm_callback() {
		if (serviceItem.serviceItemMappingItemSN != elItemMappingSN.value || serviceItem.serviceItemServiceSN != elServiceSN.value) {
			// 새로운 서비스 아이템 생성하고 기존 서비스 아이템은 비활성화
			var params = {itemMappingSN: elItemMappingSN.value,
					  serviceSN: elServiceSN.value,
					  serviceItemName: elServiceItemName,
					  serviceItemDescription: elServiceItemDescription,
					  startActivationTime: CruiseGlobal.ToTimeFormatString(elYear.value, elMonth.value, elDay.value, elHour.value, elMinute.value, 0),
					  enableFlag: (elEnableFlag.checked) ? elEnableFlag.value : 0,
					  tagData: ItemTagSelectedData}
		}
		else {
			// 이름, 설명, 활성화 여부 변경시는 기존 서비스 아이템을 변경
			function ClickConfirm() {
				function _callback(o, messages) {
					ServiceItemHandler.objParentOPTable.Refresh();
					
					if (!BoxGlobal.ValidateResponse(messages)) { 
						//CruiseGlobal.SHOWINFO (l10nMsg["text_11"], l10nMsg["msg_20"], l10nMsg["text_09"]); 
						return;
					}
					
					ServiceItemHandler.GetServiceItem(serviceItem.serviceItemSN);
				}
				
				OPAjaxRequest("POST", "modifyServiceItem", _callback,
						"serviceItemSN=" + serviceItem.serviceItemSN +
						"&serviceItemName=" + CruiseGlobal.ReplaceToSpecialChar(elServiceItemName.value) +
						"&serviceItemDescription=" + CruiseGlobal.ReplaceToSpecialChar(elServiceItemDescription.value) +
						"&serviceItemEnableFlag=" + ((elEnableFlag.checked) ? elEnableFlag.value : 0));
				
				this.hide();
				BoxGlobal.ShowLoading();
			}
			
			function ClickCancel() {
				this.hide();
			}
		    
		    var qstBox = new OPMsgBox ("ConfirmModify", serviceItem.serviceItemSN + l10nMsg["msg_90"], l10nMsg["text_21"],
		    		{isFixedCenter: true, isDraggable: false, isClose: true, isModal: true, width: 300});
		    
		    qstBox.SetICON("warn");
		    qstBox.SetButtons([{text: l10nMsg["text_09"], handler: ClickConfirm, isDefault: true }, {text: l10nMsg["text_10"], handler: ClickCancel}]);
		    qstBox.Show();
		}
	}
	
	function btnCancel_callback() {
		ServiceItemHandler.GetServiceItem(serviceItem.serviceItemSN);
	}
	
	//Confirm Button
	var btnConfirm = new OPButton("ConfirmButton", l10nMsg["text_09"], ServiceItemHandler.elActionPaneDiv, btnConfirm_callback);
	BoxGlobal.BoxSectionResourceMan.Add("btnConfirm", btnConfirm);

	//Cancel Button
	var btnCancel = new OPButton("CancelButton", l10nMsg["text_10"], ServiceItemHandler.elActionPaneDiv, btnCancel_callback);
	BoxGlobal.BoxSectionResourceMan.Add("btnCancel", btnCancel);
	
	//Input Area
	var elTable = CruiseGlobal.CreateElement("TABLE", "ServiceItemRegisterTable", ServiceItemHandler.elBasePaneDiv, "BoxInfoTable");
	
	// itemMappingSN
	elItemMappingSN = CruiseGlobal.CreateElement("INPUT", "inputServiceItemMappingItemSN", null, "txtInputSmall", {value: serviceItem.serviceItemMappingItemSN, maxlength: 20});
	BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemMappingItemSN"], elItemMappingSN, elTable);
	
	// serviceSN
	elServiceSN = CruiseGlobal.CreateElement("SELECT", "inputServiceSN", null, "txtInputVerySmall");
	CruiseGlobal.CreateElement("OPTION", null, elServiceSN, null, {value: serviceItem.serviceItemServiceSN, body: l10nMsg["text_24"]});
	BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemServiceSN"], elServiceSN, elTable);
	
	// serviceItemName
	elServiceItemName = CruiseGlobal.CreateElement("INPUT", "inputServiceItemName", null, "txtInputNormal", {value: serviceItem.serviceItemName, maxlength: 50});
	BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemName"], elServiceItemName, elTable);
	
	// serviceItemDescription
	elServiceItemDescription = CruiseGlobal.CreateElement("INPUT", "inputServiceItemDescription", null, "txtInputBig", {value: serviceItem.serviceItemDescription, maxlength: 250});
	BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemDescription"], elServiceItemDescription, elTable);
	
	// useFlag Section
	var elEnableFlagRadio = CruiseGlobal.CreateElement("DIV", "serviceItemEnableFlag");
	BoxGlobal.MakeLayoutTR_INPUT(l10nMsg["col_serviceItemEnableFlag"], elEnableFlagRadio, elTable);
	elEnableFlag = CruiseGlobal.CreateElement("INPUT", null, elEnableFlagRadio, null, {type: "RADIO", name: "serviceItemEnableFlag[]", value : 1});
	CruiseGlobal.CreateElement("SPAN", "enableFlagRadio", elEnableFlagRadio, null, {body: BoxGlobal.GetCodeText("enableFlag", 1), paddingRight: "10px"});
	elDisableFlag = CruiseGlobal.CreateElement("INPUT", null, elEnableFlagRadio, null, {type: "RADIO", name: "serviceItemEnableFlag[]", value : 0});
	CruiseGlobal.CreateElement("SPAN", "disableFlagRadio", elEnableFlagRadio, null, {body: BoxGlobal.GetCodeText("enableFlag", 0)});
	
	if (Number(serviceItem.serviceItemEnableFlag)){
		elEnableFlag.checked = true;
	}else{
		elDisableFlag.checked = true;
	}
}

function ModifyServiceItem_Confirm(boxTagSN, newBoxTagName, newBoxTagDescription) {												
    var ModifyProcess = function (){
		var _callback = function(o, messages) {
			ServiceItemHandler.objParentOPTable.Refresh();
			if (!BoxGlobal.ValidateResponse(messages)) 
			{ 
				//CruiseGlobal.SHOWINFO (l10nMsg["text_11"], l10nMsg["msg_20"], l10nMsg["text_09"]); 
				return;
			}
			ServiceItemHandler.GetBoxTag(messages.newBoxTagSN);
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

var ServiceItemHandler = {
		elActionPaneDiv: null,
		elBasePaneDiv: null,
		objParentOPTable: null,
		serviceItemSN: null,
		
		ISelectedDataTable: ISelectedDataTable,// OPDataTable에서 클릭했을 경우, DataTable에서의 호출을 받아주는 인터페이스
		InitializePane: InitializePane,// Box에서는 오른쪽 패널에 대한 Layout initialize를 해 준다.
		SetOPTable: SetOPTable,// ISelectedDataTable을 요청하기전 DataTable을 등록해야 하는 경우.
		
		GetServiceItem: GetServiceItem,
		RemoveServiceItem: RemoveServiceItem,
		ModifyServiceItem: ModifyServiceItem,
		ModifyServiceItem_Confirm: ModifyServiceItem_Confirm};
