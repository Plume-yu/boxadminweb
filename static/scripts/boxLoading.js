/*==================================
    
       Box Loading Scripts
        
====================================*/
function CheckLoadingProcess(loadingCallback)
{	
    var callback = function (o, messages) {
    	if (!BoxGlobal.ValidateResponse(messages, {redirectPage : "./"})) return;
    	l10nMsg = messages.resourceDict;
    	CruiseGlobal.SetShowLoading(l10nMsg["msg_38"], iconsIMG.loader_bigbar);
    	
		var loadDiv = CruiseGlobal.CreateElement("DIV", "loadingParentDiv", null, "loadingParentDiv");
		CruiseGlobal.CreateElement("DIV", "loadingDiv", loadDiv, "loadingDiv", {body: l10nMsg["msg_02"]});
		CruiseGlobal.CreateElement("DIV", "progressBarDiv", loadDiv);
		
		var loadPgb = new OPProgressBar ("loadingProgressBar", "progressBarDiv", {value:0, minValue:0, maxValue:1, height: 10} );
		BoxGlobal.BoxPageResourceMan.Add("loadPgb", loadPgb);
		FetchUserSetting(loadingCallback);
    };
    
    OPAjaxRequest ('POST', "getL10NResources" , callback);
}

function FetchUserSetting (loadingCallback)
{
    var callback = function (o, messages) {
    	if (!BoxGlobal.ValidateResponse(messages, {redirectPage : "./"})) return;

        BoxGlobal.BoxPageResourceMan.Get("loadPgb").SetValue(1);
		BoxGlobal.SetValue("userID", messages.userID);
		BoxGlobal.SetValue("userAccount", messages.userAccount);
        
		if (CruiseGlobal.IsUserAgentIE())
			FinalizeLoading({ fn: loadingCallback });
		else
        	window.setTimeout (FinalizeLoading, 100, { fn: loadingCallback });
    };
    OPAjaxRequest ('GET', "getCurrentUserInfo" , callback);
}

function FinalizeLoading(obj)
{
	BoxGlobal.BoxPageResourceMan.Remove("loadPgb");
	obj.fn(null);
}