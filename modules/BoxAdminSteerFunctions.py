#!/usr/bin/env python
# _*_ coding: utf-8 _*_
from pyCruise.OpMsg import *
from pyCruise.ServerCategory import GUID, ServerCategory
from BoxAdminReturnObject import ReturnObject
from BoxAdminWebRequester import SteerConnector
from BoxAdminError import BoxAdminError
from BoxAdminUtility import ConvertUnicode
import BoxAdminGlobal

#===============================
#
# Steer Session 
#
#===============================

#===============================
class SteerSession ():
    @staticmethod
    def LoginRequest(steerID, steerPassword, clientIP, addInfo):  
        BoxAdminGlobal.Log.Debug('LoginRequest Request', steerID, clientIP, addInfo)
        
        sessionKey, userSN = None, None
        retObj = ReturnObject()
        
        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.steersession, 1))) #1 openSession
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.steergw, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('loginid', steerID)
        opMsg.addArgument('password', steerPassword)
        opMsg.addArgument('clientIP', clientIP)
        opMsg.addArgument('additionalInfo', addInfo)
        opMsg.addArgument('serviceName', 'BoxAdmin')
        opMsg.addArgument('allowMultipleLoginFlag', '0')

        returnCode, retOpMsg = SteerConnector.SendAndRecv(opMsg)

        if BoxAdminError.IsSuccess(returnCode):
            sessionKey, userSN = retOpMsg.getSessionKey(), retOpMsg.getResultScalar()
            returnCode = retOpMsg.getResultCode()
        
        retObj.SetReturnCode(returnCode)
        
        BoxAdminGlobal.Log.Debug('LoginRequest Response', steerID, returnCode)
        return returnCode, retObj, sessionKey, userSN

    @staticmethod
    def CheckRequest(sessionKey, userSN, clientIP, addInfo):
        BoxAdminGlobal.Log.Debug('CheckRequest Request', sessionKey, userSN, clientIP, addInfo)
        retObj = ReturnObject()
        
        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.steersession, 2))) #2 checkSession
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.steergw, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.setSessionKey(sessionKey)
        opMsg.addArgument('clientIP', clientIP)
        opMsg.addArgument('additionalInfo', addInfo)

        returnCode, retOpMsg = SteerConnector.SendAndRecv(opMsg)
        
        newSessionKey = None
        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            newSessionKey = retOpMsg.getSessionKey()
        
        retObj.SetReturnCode(returnCode)
        
        BoxAdminGlobal.Log.Debug('CheckRequest Response', sessionKey, returnCode)
        return returnCode, retObj, newSessionKey
    
    @staticmethod
    def LogoutRequest(sessionKey, userSN):
        BoxAdminGlobal.Log.Debug('LogoutRequest Request', sessionKey, userSN)
        retObj = ReturnObject()
        
        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.steersession, 3))) #3 closeSession
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.steergw, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.setSessionKey(sessionKey)

        returnCode, retOpMsg = SteerConnector.SendAndRecv(opMsg)
        
        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
        
        retObj.SetReturnCode(returnCode)
        
        BoxAdminGlobal.Log.Debug('LogoutRequest Response', sessionKey, returnCode)
        return returnCode
   
    @staticmethod
    def GetDisplayMenu(sessionKey, displayGroupType):
        BoxAdminGlobal.Log.Debug('GetDisplayFunctionListByUserIDintForMenu Request', sessionKey, displayGroupType)
        retObj = ReturnObject()
        
        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.steermind, 35))) #3 GetDisplayFunctionListByUserIDintForMenu
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.steergw, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.setSessionKey(sessionKey)
        opMsg.addArgument('displayGroupType', displayGroupType)
        opMsg.addArgument('serviceName', 'BoxAdmin')
        
        returnCode, retOpMsg = SteerConnector.SendAndRecv(opMsg)
    
        retSet = None
        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retSet = retOpMsg.getResultSet(0)
        
        retObj.SetReturnCode(returnCode)
        
        BoxAdminGlobal.Log.Debug('GetDisplayFunctionListByUserIDintForMenu Response', sessionKey, returnCode)
        return returnCode, retSet
    
    @staticmethod
    def CheckAuth(sessionKey, globalUniqueFunctionIDint, executeArguments = None):
        return SteerSession.CheckFunctionExecutionPrivilege(sessionKey, globalUniqueFunctionIDint, executeArguments)
        
    @staticmethod
    def CheckFunctionExecutionPrivilege(sessionKey, globalUniqueFunctionIDint, executeArguments = None):
        BoxAdminGlobal.Log.Debug('CheckFunctionExecutionPrivilege Request', sessionKey, globalUniqueFunctionIDint, executeArguments)
        retObj = ReturnObject()
        
        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.steermind, 18))) #18 checkFunctionExecutionPrivilege
        opMsg.setSenderGUSID(GUID.make(ServerCategory.cardweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.steergw, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.setSessionKey(sessionKey)
        opMsg.addArgument('globalUniqueFunctionIDint', globalUniqueFunctionIDint)
        
        if executeArguments == None:
            strExecuteArguments = ''
        elif len(executeArguments) <= 1:
            strExecuteArguments = ConvertUnicode(executeArguments[0])
        else:
            uniArgs = ''
            for idx in range(0, len(executeArguments)):
                uniArgs += ConvertUnicode(executeArguments[idx])
                uniArgs += ',' if idx < len(executeArguments) - 1 else ''
            strExecuteArguments = uniArgs
            
        opMsg.addArgument('executeArguments', strExecuteArguments)
        
        returnCode, retOpMsg = SteerConnector.SendAndRecv(opMsg)
    
        transactionID = None
        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            transactionID = retOpMsg.getResultScalar()
        
        retObj.SetReturnCode(returnCode)
        
        BoxAdminGlobal.Log.Debug('CheckFunctionExecutionPrivilege Response', sessionKey, returnCode)
        return returnCode, transactionID, retObj

    @staticmethod
    def NotiAuth(sessionKey, transactionID, isSuccess, result, executeComment = None):
        return SteerSession.NotiFunctionExecutionResult(sessionKey, transactionID, isSuccess, result, executeComment)
     
    @staticmethod
    def NotiFunctionExecutionResult(sessionKey, transactionID, returnCode, result, executeComment = None):
        BoxAdminGlobal.Log.Debug('NotiFunctionExecutionResult Request', sessionKey, transactionID, returnCode, result, executeComment)
        retObj = ReturnObject()
        
        opMsg = OpMsg()
        opMsg.setJobType(JobType.NOTICE)
        opMsg.setGUFID((GUID.make(ServerCategory.steermind, 19))) #19 notifyFunctionResult
        opMsg.setSenderGUSID(GUID.make(ServerCategory.cardweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.steergw, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.setSessionKey(sessionKey)
        
        opMsg.addArgument('transactionIDint', transactionID)
        opMsg.addArgument('executionResult', '1' if BoxAdminError.IsSuccess(returnCode) else '0')
        opMsg.addArgument('result', ConvertUnicode(result))
        opMsg.addArgument('executeComment', '' if executeComment is None else ConvertUnicode(executeComment))
        
        returnCode = SteerConnector.Send(opMsg)
        retObj.SetReturnCode(returnCode)
        
        BoxAdminGlobal.Log.Debug('NotiFunctionExecutionResult Response', sessionKey, returnCode)
        return returnCode, retObj
    
    @staticmethod
    def GetUserIDAndName(steerID):  
        BoxAdminGlobal.Log.Debug('GetUserIDAndName Request', steerID)
        
        userAccount, userName, displayString = None, None, None
               
        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.steersession, 8)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.steergw, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('userIDint', steerID)

        returnCode, retOpMsg = SteerConnector.SendAndRecv(opMsg)

        if BoxAdminError.IsSuccess(returnCode):
            retArgs = retOpMsg.getArguments()
            userAccount = retArgs["userAccount"]
            userName = retArgs["userName"]
            displayString = userName + " (" + userAccount + " / " + steerID + ")"
            returnCode = retOpMsg.getResultCode()
        else:
            displayString = steerID
        
        BoxAdminGlobal.Log.Debug('GetUserIDAndName Response', steerID, returnCode)
        
        return userAccount, userName, displayString