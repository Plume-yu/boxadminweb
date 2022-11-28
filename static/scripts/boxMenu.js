/*==================================
    
    Box Menu Scripts
        
====================================*/

function LoadFunctionMapping()
{
	document.MenuFunctionMapping = {
		268435577: { onclick: { fn: BoxMainLogic.GetPageServiceItemTag, obj: null} },
		268435579: { onclick: { fn: BoxMainLogic.AddServiceItemTag, obj: null} },
		268435565: { onclick: { fn: BoxMainLogic.GetPageBoxTag, obj: null} },
		268435567: { onclick: { fn: BoxMainLogic.AddBoxTag, obj: null} },
		268435571: { onclick: { fn: BoxMainLogic.GetPageServiceItem, obj: null} },
		268435573: { onclick: { fn: BoxMainLogic.AddServiceItem, obj: null} },
		268435583: { onclick: { fn: BoxMainLogic.GetPageBoxTemplate, obj: null} },
		268435585: { onclick: { fn: BoxMainLogic.AddBoxTemplate, obj: null} },
		268435556: { onclick: { fn: BoxMainLogic.GetPageBox, obj: null} },
		268435563: { onclick: { fn: BoxMainLogic.CreateBox, obj: null} },
		268435564: { onclick: { fn: BoxMainLogic.CreateBoxFromTemplate, obj: null} },
		268435589: { onclick: { fn: ImportHandler.LoadImportLayout, obj: null} },
		268435590: { onclick: { fn: ExportHandler.LoadExportLayout, obj: null} },
		268435595: { onclick: { fn: ImportHandler.LoadImportLanguageDataLayout, obj: null} },
		268435596: { onclick: { fn: ExportHandler.LoadExportLanguageDataLayout, obj: null} }
	};
}

CruiseEvent.onDOMReady(function() {
	LoadFunctionMapping();
});

function LoadMenuBar ()
{
    var aSubmenuData = [];
    var callback = function (o, messages) {
		menuData = messages.returnTables[0];

		if (menuData.length <= 0)
		{
			var msgBox = new OPMsgBox ("noAvailMenu",
		    							l10nMsg["msg_11"],
		    							l10nMsg["text_11"],
		    							{isFixedCenter: true,
		    							isDraggable: false,
		    							isClose: false,
		    							isModal: true
		             					});
		             					
			var msgBoxHandler = function() {
				msgBox.OK();
				window.location = "./";
			};
				
		    msgBox.SetButtons([	{ text: l10nMsg["text_02"], handler:msgBoxHandler, isDefault:true }]);
		    msgBox.SetICON("alarm");
		    msgBox.Show();
		}
		
		topMenuBase = document.getElementById("boxTopMenuBase");
		var itemdata = [];
		for (var i = 0; i < menuData.length; i++){			
			itemdata.push(YAHOO.lang.merge({ text: menuData[i].displayName }, TopMenuBehavior(menuData[i].globalUniqueFunctionIDint)));
			if (menuData[i+1] == null || menuData[i+1].displayGroupIDint != menuData[i].displayGroupIDint){
				aSubmenuData.push({id: "topMenu" + menuData[i].displayGroupIDint, itemdata: itemdata});
				var elLI = CruiseGlobal.CreateElement("LI", null, topMenuBase, "yuimenubaritem");
				CruiseGlobal.CreateElement("A", null, elLI, "yuimenubaritemlabel",
														{href : "#topMenu" + menuData[i].displayGroupIDint,
														 body : menuData[i].displayGroupName});
				itemdata = [];
			}	
		}
        var menuBar = new OPMenuBar("baseMenuBar", aSubmenuData);
        menuBar.RenderMenu();
    };
    OPAjaxRequest ('GET', "getTopMenuList" , callback);
}

function TopMenuBehavior (gufid)
{
	//hooking function behavior here:
	var behavior = document.MenuFunctionMapping[gufid];
	if (behavior == null) {
		behavior = { onclick: { fn: function () { alert("Not implemented!"); }, obj: null} };
	}
	return behavior;
}

function LoadLeftMenu ()
{
	var aSubmenuData = [];
    var callback = function (o, messages) {
		menuData = messages.returnTables[0];
		
		if (menuData.length <= 0) {
			BoxGlobal.InitQuickMenuContainer();
	    	BoxGlobal.baseLayout.GetUnitByPosition('left').collapse();
			return;
		}
		
		var menuItem = [];
		var menuGroup = [];
		var itemdata = [];
		for (var i = 0; i < menuData.length; i++){				
			itemdata.push(YAHOO.lang.merge({ text: menuData[i].displayName }, LeftMenuBehavior(menuData[i].globalUniqueFunctionIDint)));
			if (menuData[i+1] == null || menuData[i+1].displayGroupIDint != menuData[i].displayGroupIDint){
				menuItem.push(itemdata);
				menuGroup.push(menuData[i].displayGroupName);
				itemdata = [];
			}
		}
        var leftMenu = new OPMenu ("boxLeftMenu", "leftMenuDiv", menuItem, menuGroup);
		leftMenu.RenderMenu();
    };

    OPAjaxRequest ('GET', "getLeftMenuList", callback);
}

function LeftMenuBehavior (gufid)
{   
	//hooking function behavior here:
	var behavior = document.MenuFunctionMapping[gufid];
	if (behavior == null) {
		behavior = { onclick: { fn: function () { alert("Not implemented!"); }, obj: null} };
	}
	return behavior;
}