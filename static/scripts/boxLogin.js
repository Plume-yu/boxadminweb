/*==================================
    
         Box Login Scripts
        
====================================*/

CruiseEvent.onDOMReady(function() {
	CruiseGlobal.SetElHide("loginBase");
	PreResourceLoading(InitializeView);
});

function PreResourceLoading(InitFunction)
{
    var callback = function (o, messages) {
    	if (!BoxGlobal.ValidateResponse(messages)) return;
    	l10nMsg = messages.resourceDict;

		InitFunction();
		CruiseGlobal.SetElShow("loginBase");
    };
    
    OPAjaxRequest ('POST', "getL10NResources" , callback);
}

function InitializeView()
{
	CruiseGlobal.SetHTML("releaseName", l10nMsg["productTitle"]);
	CruiseGlobal.SetHTML("version", l10nMsg["version"]);
	CruiseGlobal.SetHTML("login_noticeSpan", l10nMsg["text_01"]);
	CruiseGlobal.SetHTML("login_loginSpan", l10nMsg["text_02"]);
	CruiseGlobal.SetHTML("login_settingSpan", l10nMsg["text_03"]);
	CruiseGlobal.SetHTML("saveAccountInfo", l10nMsg["text_04"]);
	CruiseGlobal.SetHTML("noticeSpan", l10nMsg["notice"].replace(/\[nl\]/gi,'<BR>'));
	
	var LoginButtonCallback = function() {
		CruiseGlobal.ExtractASCIIValue(CruiseGlobal.GetEl("id_input"));
		var id = CruiseGlobal.GetElementValue("id_input");
		var pwd = CruiseGlobal.GetElementValue("password_input");
		
		//validation
		if (!CruiseValidation.HasValue(id))
		{
			CruiseGlobal.SetHTML("loginResultDiv", l10nMsg["msg_06"], true);
			return;
		}
		
		if (!CruiseValidation.HasValue(pwd))
		{
			CruiseGlobal.SetHTML("loginResultDiv", l10nMsg["msg_07"], true);
			return;
		}
		
		var _callback = function(o, messages) {
			if (!BoxErrorCode.IsSuccess(messages.returnCode))
			{
				CruiseLog.Info("Login Failed :: ID: " + id + " ReturnCode: " + messages.returnCode);
				var errMsg = BoxErrorCode.GetErrorMsg(messages.returnCode);
				CruiseGlobal.SetHTML("loginResultDiv", errMsg, true);
				
				btnLogin.SetText(l10nMsg["text_05"]);
				btnLogin.Disabled(false);
				CruiseGlobal.GetEl("id_input").disabled = false;
				CruiseGlobal.GetEl("password_input").disabled = false;
				CruiseGlobal.GetEl("id_input").focus();
				return;
			}
			
			if (btnSaveIDPWD.GetChecked())
			{
				CruiseGlobal.SetSaveCookieVal("Box_userID", id, 7);
				CruiseGlobal.SetSaveCookieVal("Box_password", pwd, 7);
			}
			else
			{
				CruiseGlobal.SetSaveCookieVal("Box_userID", '', 0);
				CruiseGlobal.SetSaveCookieVal("Box_password", '', 0);
			}	
			window.location = "./main";
		};
		
		var strArgument = "id=" + id + "&password=" + encodeURIComponent(pwd);
			
		OPAjaxRequest('POST', "requestLogin", _callback, strArgument);
		btnLogin.SetText(iconsIMG.loader_smallbar + l10nMsg["msg_05"]);
		btnLogin.Disabled(true);
		CruiseGlobal.Flush("loginResultDiv");
		CruiseGlobal.GetEl("id_input").disabled = true;
		CruiseGlobal.GetEl("password_input").disabled = true;
	};
	
	var btnLogin = new OPButton("LoginButton", l10nMsg["text_05"], null, LoginButtonCallback);
	btnLogin.SetSize(150, 30);

	var btnSaveIDPWD = new OPCheckedButton("SaveIDPWD", "On", "SaveIDPWD", null, false, null);
	btnSaveIDPWD.SetCheckedText (l10nMsg["text_06"], l10nMsg["text_07"]);
	btnSaveIDPWD.SetHeight(20);
	
	var idKeyListener = new CruiseEvent.CreateKeyListener (CruiseGlobal.GetEl("id_input"), 13, LoginButtonCallback, this, false, false, this);
	var pwdKeyListener = new CruiseEvent.CreateKeyListener (CruiseGlobal.GetEl("password_input"), 13, LoginButtonCallback, this, false, false, this);
	idKeyListener.enable();
	pwdKeyListener.enable();
	
	var savedID = CruiseGlobal.GetSaveCookieVal("Box_userID");
	var savedPWD = CruiseGlobal.GetSaveCookieVal("Box_password");
	
	if (savedID != null && savedID.length > 0 && savedPWD != null && savedPWD.length > 0)
	{
		CruiseGlobal.SetElementValue("id_input", savedID);
		CruiseGlobal.SetElementValue("password_input", savedPWD);
		btnSaveIDPWD.SetChecked(true);
	}
}

