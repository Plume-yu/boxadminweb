#!/usr/bin/env python
# -*- coding: utf8 -*-

#===============================
#
# Error stuff for Box system
#
#===============================
from pyCruise.Error import CruiseError
from pyCruise.ServerCategory import ServerCategory
from BoxAdminReturnObject import ReturnObject
import traceback
import BoxAdminGlobal

#===============================
class _BoxAdminError (CruiseError):
    def __init__(self):
        CruiseError.__init__(self, ServerCategory.boxweb)         
        
        # BoxWeb ErrorCode
        self.CONNECTION_FAILED          = self.Make(1000)
        self.SEND_RECV_FAILED           = self.Make(1001)
        self.NO_AVAILABLE_MENU          = self.Make(1002)
        self.AUTH_UNKNOWN_ERROR         = self.Make(1003)
        self.AUTH_NO_PRIVILEGE          = self.Make(1004)
        self.INVALID_L10N               = self.Make(1005)
        self.INVALID_DATA               = self.Make(1006)
        self.EXCEPTION                  = self.Make(1007)
        
        self.NO_SESSION_EXIST           = self.Make(999)      

# singleton
BoxAdminError = _BoxAdminError()

class BoxWebExceptionHandler:
    @staticmethod
    def ToReturnObject(exc):
        retObj = ReturnObject()
        retObj.SetReturnCode(BoxAdminError.EXCEPTION)
        retObj.SetExceptionFlag(1)
        trace = traceback.format_exc()
        retObj.AddReturnValue("errMsg", str(exc))
        retObj.AddReturnValue("trace", trace)
        
        BoxAdminGlobal.Log.Error('Exception: ', trace)
        
        return retObj.ParseToJSON()

if __name__ == '__main__':
    print BoxAdminError.SUCCESS
    print BoxAdminError.CONNECTION_FAILED
    print BoxAdminError.SEND_RECV_FAILED
    print BoxAdminError.NO_AVAILABLE_MENU
    print BoxAdminError.AUTH_UNKNOWN_ERROR
    print BoxAdminError.AUTH_NO_PRIVILEGE
    print BoxAdminError.NO_SESSION_EXIST