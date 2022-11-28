/*==================================
    
    Box Logout Script
    By Daesup, Lee

====================================*/

function BoxLogout()
{
    var EndProcess = function (){
		var _callback = function(o, messages) {
			if (!BoxGlobal.ValidateResponse(messages)) return;
			window.location = "./";
		};

		OPAjaxRequest("POST", "requestLogout", _callback);
		this.hide();
		BoxGlobal.ShowLoading();
    };

    var qstBox = new OPMsgBox ("ConfirmLogout", 
    							l10nMsg["msg_10"],
    							l10nMsg["text_08"],
    							{isFixedCenter: true,
    							isDraggable: false,
    							isClose: true,
    							isModal: true,
    							width: 300
             					});
    qstBox.SetICON("warn");
    qstBox.SetButtons([{ text:l10nMsg["text_09"], handler:EndProcess, isDefault:true }, { text:l10nMsg["text_10"],  handler: function () {this.hide();} }]);
    qstBox.Show();
    return;
}