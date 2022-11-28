/*==================================
    
       BoxError Scripts
        
====================================*/

var _BoxErrorCode = function () { this.Initialize(); };

_BoxErrorCode.prototype.Initialize = function ()
{
	this.SUCCESS = 436207616;
	this.CONNECTION_FAILED = 436208616;
	this.SEND_RECV_FAILED = 436208617;
	this.NO_AVAILABLE_MENU = 436208618;
	this.SESSION_EXPIRED = 436208615;
	this.INVALID_L10N = 436208621;
	
	this.IsSuccess = function (returnCode)
	{
		if ((returnCode & 0x00ffffff) == 0)
			return true;
		else
			return false;
	};
};

_BoxErrorCode.prototype.GetErrorMsg = function (errorCode)
{
	var retText = l10nMsg["err_" + errorCode];
	
	if (retText == undefined || retText == null)
		retText = l10nMsg["err_nocode"];
		
	return retText + " [" + errorCode + "]";
};

var BoxErrorCode = new _BoxErrorCode();