# -*- coding: utf-8 -*-

'''
Created on 2010. 10. 12.

@author: lunacalos
'''
#===============================
import os.path
import BoxAdminConfig
import BoxAdminGlobal
import cherrypy
import io
from pyCruise.OpMsg import *
from pyCruise.ServerCategory import GUID, ServerCategory
from pyCruise.Convert import ConvertToUnicode
from BoxAdminReturnObject import ReturnObject
from BoxAdminSteerFunctions import SteerSession
from BoxAdminError import BoxAdminError, BoxWebExceptionHandler
from BoxAdminUtility import GetCherrySession, SetCherrySession
from BoxAdminLocalization import BoxL10N
from BoxAdminWebRequester import PlatformConnector

#===============================
class BoxAdmin:
    def __init__(self, rootPath):
        self.rootPath = rootPath
        BoxAdminConfig.BoxAdminConfigReader.Initialize()

    # Internal Functions
    #===============================
    def CheckSession(self):
        retObj = ReturnObject()

        sessionKey = GetCherrySession('steerSessionKey')
        userSN = GetCherrySession('steerUserSN')

        if sessionKey and userSN:
            returnCode, retObj, newSessionKey = SteerSession.CheckRequest(sessionKey,
                                                                          userSN,
                                                                          cherrypy.request.remote.ip,
                                                                          None)
            if BoxAdminError.IsSuccess(returnCode):
                SetCherrySession('steerSessionKey', newSessionKey)
                return True, None
            else:
                retObj.SetReturnCode(BoxAdminError.NO_SESSION_EXIST)
        else:
            retObj.SetReturnCode(BoxAdminError.NO_SESSION_EXIST)

        return False, retObj

    def CheckAuthNoNoti(self, gufid):
        sessionKey = GetCherrySession('steerSessionKey')

        if sessionKey:
            returnCode, transKey, retObj = SteerSession.CheckAuth(sessionKey,
                                                                   gufid,
                                                                   None)
            if BoxAdminError.IsSuccess(returnCode):
                return True
            else:
                return False

        return False

    # Exposed Functions
    #===============================
    @cherrypy.expose
    def getL10NResources(self):
        retObj = ReturnObject()
        retObj.SetReturnCode(BoxAdminError.SUCCESS)

        if GetCherrySession('nationCode') is None:
            nationCode = BoxAdminConfig.NationCode.replace("'", "")
        else:
            nationCode = GetCherrySession('nationCode')

        resourceDict = BoxL10N.GetTextResource(nationCode)

        if resourceDict == None or len(resourceDict) < 0:
            retObj.SetReturnCode(BoxAdminError.INVALID_L10N)

        retObj.AddReturnValue('resourceDict', resourceDict)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def index(self):
        return open(os.path.join(self.rootPath, 'view/index.html'))

    @cherrypy.expose
    def main(self):
        return open(os.path.join(self.rootPath, 'view/main.html'))

    @cherrypy.expose
    def requestLogin(self, id, password):
        clientIP = cherrypy.request.remote.ip

        returnCode, retObj, sessionKey, userSN = SteerSession.LoginRequest(id, password, clientIP, None)

        if BoxAdminError.IsSuccess(returnCode):
            SetCherrySession('steerSessionKey', sessionKey)
            SetCherrySession('steerUserSN', userSN)
            SetCherrySession('steerID', id)

        retObj.SetReturnCode (returnCode)

        return retObj.ParseToJSON()

    @cherrypy.expose
    def requestLogout(self):
        sessionKey = GetCherrySession('steerSessionKey')
        userSN = GetCherrySession('steerUserSN')

        if sessionKey and userSN:
            returnCode = SteerSession.LogoutRequest(sessionKey, userSN)
        else:
            returnCode = BoxAdminError.SUCCESS

        retObj = ReturnObject()
        retObj.SetReturnCode (returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def getCurrentUserInfo(self):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getCurrentUserInfo Request')

        retObj = ReturnObject()
        retObj.SetReturnCode(BoxAdminError.SUCCESS)
        retObj.AddReturnValue("userID", GetCherrySession('steerUserSN'))
        retObj.AddReturnValue("userAccount", GetCherrySession('steerID'))

        BoxAdminGlobal.Log.Debug('getCurrentUserInfo Response', BoxAdminError.SUCCESS)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def getTopMenuList(self):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getTopMenuList Request')

        menuRetObj = ReturnObject()
        menuRetObj.SetReturnCode(BoxAdminError.SUCCESS)

        returnCode, retSet = SteerSession.GetDisplayMenu(GetCherrySession('steerSessionKey'), 1)

        retData = []
        if BoxAdminError.IsSuccess(returnCode):
            for row in retSet[0]:
                retData.append({'displayGroupIDint' : row[0],
                                'displayGroupName' : row[1],
                                'globalUniqueFunctionIDint' : row[2],
                                'functionName' : row[3],
                                'displayName' : row[4],
                                'displayGroupType' : row[5],
                                'dangerLevel' : row[6],
                                'displayOrder' : row[7],
                                'displaySubOrder' : row[8],
                                'displayAdditionalInfo' : row[9]}
                               )
            menuRetObj.AddReturnTable(retData)
        else:
            menuRetObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getTopMenuList Response', returnCode)
        return menuRetObj.ParseToJSON()

    @cherrypy.expose
    def getLeftMenuList(self):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getLeftMenuList Request')

        menuRetObj = ReturnObject()
        menuRetObj.SetReturnCode(BoxAdminError.SUCCESS)

        returnCode, retSet = SteerSession.GetDisplayMenu(GetCherrySession('steerSessionKey'), 2)

        retData = []
        if BoxAdminError.IsSuccess(returnCode):
            for row in retSet[0]:
                retData.append({'displayGroupIDint' : row[0],
                                'displayGroupName' : row[1],
                                'globalUniqueFunctionIDint' : row[2],
                                'functionName' : row[3],
                                'displayName' : row[4],
                                'displayGroupType' : row[5],
                                'dangerLevel' : row[6],
                                'displayOrder' : row[7],
                                'displaySubOrder' : row[8],
                                'displayAdditionalInfo' : row[9]}
                               )
            menuRetObj.AddReturnTable(retData)
        else:
            menuRetObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getLeftMenuList Response', returnCode)
        return menuRetObj.ParseToJSON()

    @cherrypy.expose
    def getPageServiceItemTag(self, key, startIndex, results, sort, dir, enableFlag=None, serviceItemTagName=None):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getPageServiceItemTag Request', key, startIndex, results, sort, dir)

        if serviceItemTagName == None:
            serviceItemTagName = ''

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 121)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('offset', startIndex)
        opMsg.addArgument('count', results)
        opMsg.addArgument('serviceItemTagSN', '')
        opMsg.addArgument('serviceItemTagName', serviceItemTagName)
        opMsg.addArgument('serviceItemTagEnableFlag', enableFlag)
        opMsg.addArgument('sort', sort)
        opMsg.addArgument('dir', dir)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddYUIDataTable(retOpMsg.getResultSet(0), startIndex, results, sort, dir)

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getPageServiceItemTag Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def getServiceItemTag(self, serviceItemTagSN):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getServiceItemTag Request', serviceItemTagSN)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 122)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('serviceItemTagSN', serviceItemTagSN)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddReturnTable(retOpMsg.getResultSet(0))

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getServiceItemTag Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def removeItemTag(self, serviceItemTagSN):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getRemoveItemTag Request', serviceItemTagSN)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 124)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('serviceItemTagSN', serviceItemTagSN)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getRemoveItemTag Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def modifyItemTag(self, serviceItemTagSN, serviceItemTagName, serviceItemTagDescription, serviceItemValidationRuleSN):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('modifyItemTag Request', serviceItemTagSN, serviceItemTagName, serviceItemTagDescription, serviceItemValidationRuleSN)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 126)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('serviceItemTagSN', serviceItemTagSN)
        opMsg.addArgument('serviceItemTagName', serviceItemTagName)
        opMsg.addArgument('serviceItemTagDescription', serviceItemTagDescription)
        opMsg.addArgument('serviceItemValidationRuleSN', serviceItemValidationRuleSN)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddReturnValue("newServiceItemTagSN", retOpMsg.getResultScalar())

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('modifyItemTag Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def createItemTag(self, serviceItemTagName, serviceItemTagDescription, serviceItemValidationRuleSN):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('createItemTag Request', serviceItemTagName, serviceItemTagDescription, serviceItemValidationRuleSN)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 123)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('serviceItemTagName', serviceItemTagName)
        opMsg.addArgument('serviceItemTagDescription', serviceItemTagDescription)
        opMsg.addArgument('serviceItemValidationRuleSN', serviceItemValidationRuleSN)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddReturnValue("newServiceItemTagSN", retOpMsg.getResultScalar())

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('createItemTag Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def getPageBoxTag(self, key, startIndex, results, sort, dir, enableFlag=None, boxTagName=None):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getPageBoxTag Request', key, startIndex, results, sort, dir)

        if boxTagName == None:
            boxTagName = ''

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 109)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('offset', startIndex)
        opMsg.addArgument('count', results)
        opMsg.addArgument('boxTagSN', '')
        opMsg.addArgument('boxTagName', boxTagName)
        opMsg.addArgument('boxTagEnableFlag', enableFlag)
        opMsg.addArgument('sort', sort)
        opMsg.addArgument('dir', dir)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddYUIDataTable(retOpMsg.getResultSet(0), startIndex, results, sort, dir)

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getPageBoxTag Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def getBoxTag(self, boxTagSN):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getBoxTag Request', boxTagSN)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 110)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('boxTagSN', boxTagSN)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddReturnTable(retOpMsg.getResultSet(0))

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getBoxTag Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def removeBoxTag(self, boxTagSN):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('removeBoxTag Request', boxTagSN)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 112)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('boxTagSN', boxTagSN)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('removeBoxTag Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def modifyBoxTag(self, boxTagSN, boxTagName, boxTagDescription):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('modifyBoxTag Request', boxTagSN, boxTagName, boxTagDescription)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 114)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('boxTagSN', boxTagSN)
        opMsg.addArgument('boxTagName', boxTagName)
        opMsg.addArgument('boxTagDescription', boxTagDescription)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddReturnValue("newBoxTagSN", retOpMsg.getResultScalar())

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('modifyBoxTag Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def createBoxTag(self, boxTagName, boxTagDescription):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('createBoxTag Request', boxTagName, boxTagDescription)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 111)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('boxTagName', boxTagName)
        opMsg.addArgument('boxTagDescription', boxTagDescription)
        
        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddReturnValue("newBoxTagSN", retOpMsg.getResultScalar())

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('createBoxTag Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def getPageServiceItem(self, key, startIndex, results, sort, dir, enableFlag=None, searchText='', serviceItemServiceSN=''):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getPageServiceItem Request', key, startIndex, results, sort, dir)
        
        serviceItemMappingItemSN = ''
        serviceItemName = ''
        
        if searchText.isdigit():
            serviceItemMappingItemSN = searchText
        else:
            serviceItemName = searchText

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 115)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('offset', startIndex)
        opMsg.addArgument('count', results)
        opMsg.addArgument('serviceItemSN', '')
        opMsg.addArgument('serviceItemServiceSN', '')
        opMsg.addArgument('serviceItemMappingItemSN', serviceItemMappingItemSN)
        opMsg.addArgument('serviceItemName', serviceItemName)
        opMsg.addArgument('serviceItemEnableFlag', enableFlag)
        opMsg.addArgument('sort', sort)
        opMsg.addArgument('dir', dir)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddYUIDataTable(retOpMsg.getResultSet(0), startIndex, results, sort, dir)

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getPageServiceItem Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def getServiceItem(self, serviceItemSN):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getServiceItem Request', serviceItemSN)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 116)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('serviceItemSN', serviceItemSN)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddReturnTable(retOpMsg.getResultSet())

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getServiceItem Response', returnCode)
        return retObj.ParseToJSON()
    
    @cherrypy.expose
    def modifyServiceItem(self, serviceItemSN, serviceItemName, serviceItemDescription, serviceItemEnableFlag):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('modifyServiceItem Request', serviceItemSN, serviceItemName, serviceItemDescription, serviceItemEnableFlag)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 120)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('serviceItemSN', serviceItemSN)
        opMsg.addArgument('serviceItemName', serviceItemName)
        opMsg.addArgument('serviceItemDescription', serviceItemDescription)
        opMsg.addArgument('serviceItemEnableFlag', serviceItemEnableFlag)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()
        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('modifyServiceItem Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def getPageBox(self, key, startIndex, results, sort, dir, receiverUserSN=None, receiverGUSID=None, receiverCharacterSN=None, boxStateSearchCode=None):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getPageBox Request', key, startIndex, results, sort, dir)

        if receiverUserSN == None:
            receiverUserSN = ''

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 100)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('rowOffset', startIndex)
        opMsg.addArgument('rowCount', results)
        opMsg.addArgument('receiverServiceSN', '1')
        opMsg.addArgument('receiverUserSN', receiverUserSN)
        opMsg.addArgument('receiverGUSID', receiverGUSID)
        opMsg.addArgument('receiverCharacterSN', receiverCharacterSN)
        opMsg.addArgument('receiverCharacterName', '')
        opMsg.addArgument('boxStateSearchCode', boxStateSearchCode)
        opMsg.addArgument('sort', sort)
        opMsg.addArgument('dir', dir)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddYUIDataTable(retOpMsg.getResultSet(0), startIndex, results, sort, dir)

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getPageBox Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def getDetailBox(self, boxSN):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getDetailBox Request', boxSN)

        req = OpMsg()
        req.makeRequest(GUID.make(ServerCategory.boxweb),
                        GUID.make(ServerCategory.boxapi),
                        GUID.make(ServerCategory.boxapi, 101),
                        0)
        req.addArgument('boxSN', boxSN)

        returnCode, res = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, req.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = res.getResultCode()
            retObj.AddReturnTable(res.getResultSet())
            retObj.AddReturnTable(res.getResultSet(1))
            retObj.AddReturnTable(res.getResultSet(2))
            retObj.AddReturnTable(res.getResultSet(3))
            retObj.AddReturnTable(res.getResultSet(4))

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getDetailBox Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def removeBox(self, boxSN):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('removeBox Request', boxSN)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 106)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('boxSN', boxSN)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('removeBox Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def createServiceItem(self, itemMappingSN, serviceSN, startActivationTime, enableFlag, itemName, itemDescription, tagData):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('createServiceItem Request', itemMappingSN, serviceSN, startActivationTime, enableFlag, itemName, tagData)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 117)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('serviceItemServiceSN', serviceSN)
        opMsg.addArgument('serviceItemMappingItemSN', itemMappingSN)
        opMsg.addArgument('serviceItemStartActivationDateTime', startActivationTime)
        opMsg.addArgument('serviceItemEnableFlag', enableFlag)
        opMsg.addArgument('serviceItemName', itemName)
        opMsg.addArgument('serviceItemDescription', itemDescription)
        opMsg.addArgument('serviceItemRegisterUserSN', GetCherrySession('steerUserSN'))
        opMsg.addArgument('serviceItemTagInfo', tagData if tagData != '' else '0')

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddReturnValue("newServiceItemSN", retOpMsg.getResultScalar())

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('createServiceItem Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def getDetailServiceItemAndServiceItemTag(self, serviceItemSN=None):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        if serviceItemSN == None:
            serviceItemSN = ''

        BoxAdminGlobal.Log.Debug('getDetailServiceItemAndServiceItemTag Request', serviceItemSN)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 134)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('serviceItemSN', serviceItemSN)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            serviceItem = retOpMsg.getResultSet(0)
            serviceItemTag = retOpMsg.getResultSet(1)
            
            userID = serviceItem[0][0]["serviceItemRegisterUserSN"]
            registerUserAccount, registerUserName, displayString = SteerSession.GetUserIDAndName(userID)
            serviceItem[0][0]["serviceItemRegisterUserSN"] = displayString
            
            retObj.AddReturnTable(serviceItem)
            retObj.AddReturnTable(serviceItemTag)

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getDetailServiceItemAndServiceItemTag Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def getPageServiceItemWithTag(self, key, startIndex, results, sort, dir,
                                  serviceItemServiceSN=None,
                                  itemEnableFlag=None, serviceItemMappingItemSN=None,
                                  tagEnableFlag=None, serviceItemTagName=None):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getPageServiceItemWithTag Request', key, startIndex, results, sort, dir)

        if serviceItemMappingItemSN == None:
            serviceItemMappingItemSN = ''
        if serviceItemTagName == None:
            serviceItemTagName = ''
        if serviceItemServiceSN == None:
            serviceItemServiceSN = 1

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 133)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('offset', startIndex)
        opMsg.addArgument('count', results)
        opMsg.addArgument('serviceItemSN', '')
        opMsg.addArgument('serviceItemServiceSN', serviceItemServiceSN)
        opMsg.addArgument('serviceItemMappingItemSN', serviceItemMappingItemSN)
        opMsg.addArgument('serviceItemEnableFlag', itemEnableFlag)
        opMsg.addArgument('serviceItemTagSN', '')
        opMsg.addArgument('serviceItemTagName', serviceItemTagName)
        opMsg.addArgument('serviceItemTagEnableFlag', tagEnableFlag)
        opMsg.addArgument('validationValueSN', '')
        opMsg.addArgument('sort', sort)
        opMsg.addArgument('dir', dir)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddYUIDataTable(retOpMsg.getResultSet(0), startIndex, results, sort, dir)

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getPageServiceItemWithTag Response', returnCode)
        return retObj.ParseToJSON()

    def ConvertTagValue(self, boxTagInfoList, boxItemTagInfoList):
        boxTagLength = len(boxTagInfoList)

        if boxTagLength > 0:
            boxTagInfo = unicode(boxTagLength)

            for boxTag in boxTagInfoList:
                boxTagInfo += u"," + ConvertToUnicode(boxTag["boxTagSN"]) + u"," + ConvertToUnicode(boxTag["boxTagValue"]).encode('utf-8').encode('hex')

        boxItemTagLength = len(boxItemTagInfoList)

        if boxItemTagLength > 0:
            boxTagItemInfo = unicode(boxItemTagLength)

            for boxItemTag in boxItemTagInfoList:
                boxTagItemInfo += u"," + unicode(boxItemTag["serviceItemSN"]) + u"," + unicode(boxItemTag["externalItemKey"])
                serviceItemTagLength = len(boxItemTag["serviceItemTag"])
                boxTagItemInfo += u"," + unicode(serviceItemTagLength)
                for serviceItemTag in boxItemTag["serviceItemTag"]:
                    boxTagItemInfo += u"," + ConvertToUnicode(serviceItemTag["serviceItemTagSN"]) + u"," + ConvertToUnicode(serviceItemTag["serviceItemTagValue"]).encode('utf-8').encode('hex')

        return boxTagInfo, boxTagItemInfo
    
    def ConvertTagValueForTemplate(self, boxTagInfoList, boxItemTagInfoList):
        boxTagInfo, boxTagItemInfo = '', ''
        
        boxTagLength = len(boxTagInfoList)
        
        if boxTagLength > 0:
            boxTagInfo = unicode(boxTagLength)

            for boxTag in boxTagInfoList:
                boxTagInfo += u"," + ConvertToUnicode(boxTag["boxTagSN"]) + u"," + ConvertToUnicode(boxTag["boxTagValue"]).encode('utf-8').encode('hex')
        
        boxItemTagLength = len(boxItemTagInfoList)
        
        if boxItemTagLength > 0:
            boxTagItemInfo = unicode(boxItemTagLength)
            
            for boxItemTag in boxItemTagInfoList:
                boxTagItemInfo += u"," + unicode(boxItemTag["serviceItemSN"])
                serviceItemTagLength = len(boxItemTag["serviceItemTag"])
                boxTagItemInfo += u"," + unicode(serviceItemTagLength)
                for serviceItemTag in boxItemTag["serviceItemTag"]:
                    boxTagItemInfo += u"," + ConvertToUnicode(serviceItemTag["serviceItemTagSN"]) + u"," + ConvertToUnicode(serviceItemTag["serviceItemTagValue"]).encode('utf-8').encode('hex')
  
        return boxTagInfo, boxTagItemInfo
    
    @cherrypy.expose
    def createBox(self, receiverServiceSN, receiverUserSN, startDate, endDate, visibleFlag, itemData, boxTagData,
                  receiverGUSID=None, receiverCharacterSN=None, receiverCharacterName=None, usableTimeAfterOpen=None):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        if receiverGUSID == None:
            receiverGUSID = ''
        if receiverCharacterSN == None:
            receiverCharacterSN = ''
        if receiverCharacterName == None:
            receiverCharacterName = ''
        if usableTimeAfterOpen == None:
            usableTimeAfterOpen = ''

        BoxAdminGlobal.Log.Debug('createBox Request', receiverServiceSN, receiverUserSN, receiverGUSID, receiverCharacterSN, receiverCharacterName,
                  startDate, endDate, usableTimeAfterOpen, visibleFlag, itemData, boxTagData)

        import json

        itemData = json.loads(itemData, 'utf-8')
        boxTagData = json.loads(boxTagData, 'utf-8')

        boxTagInfo, boxServiceItemInfo = self.ConvertTagValue(boxTagData, itemData)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 107)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('receiverServiceSN', receiverServiceSN)
        opMsg.addArgument('receiverUserSN', receiverUserSN)
        opMsg.addArgument('receiverGUSID', receiverGUSID)
        opMsg.addArgument('receiverCharacterSN', receiverCharacterSN)
        opMsg.addArgument('receiverCharacterName', receiverCharacterName)

        opMsg.addArgument('senderUserSN', '')
        opMsg.addArgument('senderGUSID', '')
        opMsg.addArgument('senderCharacterSN', '')
        opMsg.addArgument('senderCharacterName', '')

        opMsg.addArgument('createEndPointCode', ServerCategory.boxweb)
        opMsg.addArgument('externalTransactionKey', '')
        opMsg.addArgument('startActivationDateTime', startDate)
        opMsg.addArgument('endActivationDateTime', endDate)

        opMsg.addArgument('activateDurationAfterOpen', usableTimeAfterOpen)
        opMsg.addArgument('visableFlagBeforeActivation', visibleFlag)
        opMsg.addArgument('boxEventSN', '')

        opMsg.addArgument('boxTagInfo', boxTagInfo)
        opMsg.addArgument('boxServiceItemInfo', boxServiceItemInfo)
        
        opMsg.addArgument('boxTransactionSN', '')

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddReturnValue("newBoxSN", retOpMsg.getResultScalar())

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('createBox Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def removeServiceItem(self, serviceItemSN):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('removeServiceItem Request', serviceItemSN)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 118)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('serviceItemSN', serviceItemSN)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('removeServiceItem Response', returnCode)
        return retObj.ParseToJSON()
    
    @cherrypy.expose
    def getPageBoxTemplate(self, key, startIndex, results, sort, dir, enableFlag=None, searchCondition=None):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getPageBoxTemplate Request', key, startIndex, results, sort, dir)

        if searchCondition == None:
            searchCondition = ''
        if enableFlag == None:
            enableFlag = '1'

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 127)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('rowOffset', startIndex)
        opMsg.addArgument('rowCount', results)
        opMsg.addArgument('searchCondition', searchCondition)
        opMsg.addArgument('boxTemplateEnableFlag', enableFlag)
        opMsg.addArgument('sort', sort)
        opMsg.addArgument('dir', dir)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddYUIDataTable(retOpMsg.getResultSet(0), startIndex, results, sort, dir)

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getPageBoxTemplate Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def getDetailBoxTemplate(self, boxTemplateSN):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getDetailBoxTemplate Request', boxTemplateSN)

        req = OpMsg()
        req.makeRequest(GUID.make(ServerCategory.boxweb),
                        GUID.make(ServerCategory.boxapi),
                        GUID.make(ServerCategory.boxapi, 128),
                        0)
        req.addArgument('boxTemplateSN', boxTemplateSN)

        returnCode, res = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, req.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = res.getResultCode()
            boxTemplate = res.getResultSet(0)
            boxTag = res.getResultSet(1)
            boxItemTag = res.getResultSet(2)
            
            userID = boxTemplate[0][0]["boxTemplateCreateUserSN"]
            registerUserAccount, registerUserName, displayString = SteerSession.GetUserIDAndName(userID)
            boxTemplate[0][0]["boxTemplateCreateUserSN"] = displayString
            
            retObj.AddReturnTable(boxTemplate)
            retObj.AddReturnTable(boxTag)
            retObj.AddReturnTable(boxItemTag)

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getDetailBoxTemplate Response', returnCode)
        return retObj.ParseToJSON()
    
    @cherrypy.expose
    def checkExportPrivileges(self):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()
        
        BoxAdminGlobal.Log.Debug('checkExportPrivileges Request')
        
        retObj = ReturnObject()
        returnCode = BoxAdminError.AUTH_NO_PRIVILEGE
        
        if self.CheckAuthNoNoti(GUID.make(ServerCategory.boxapi, 135)): # Service Item Tag
            retObj.AddReturnValue("ServiceItemTagExport", 1)
            returnCode = BoxAdminError.SUCCESS

        if self.CheckAuthNoNoti(GUID.make(ServerCategory.boxapi, 136)): # Box Tag
            retObj.AddReturnValue("BoxTagExport", 1)
            returnCode = BoxAdminError.SUCCESS
            
        if self.CheckAuthNoNoti(GUID.make(ServerCategory.boxapi, 137)): # Service Item
            retObj.AddReturnValue("ServiceItemExport", 1)
            returnCode = BoxAdminError.SUCCESS
            
        if self.CheckAuthNoNoti(GUID.make(ServerCategory.boxapi, 138)):  # Box Template
            retObj.AddReturnValue("BoxTemplateExport", 1)
            returnCode = BoxAdminError.SUCCESS
        
        if self.CheckAuthNoNoti(GUID.make(ServerCategory.boxapi, 155)): # Export History
            retObj.AddReturnValue("ExportHistory", 1)
            returnCode = BoxAdminError.SUCCESS
            
        retObj.SetReturnCode(returnCode)
    
        BoxAdminGlobal.Log.Debug('checkExportPrivileges Response', returnCode)
        return retObj.ParseToJSON()
    
    @cherrypy.expose
    def createBoxTemplate(self, boxTemplateTitle, boxTemplateServiceSN, startDate, endDate, visibleFlag, boxItemData, boxTagData, usableTimeAfterOpen = None):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()
        
        if usableTimeAfterOpen == None:
            usableTimeAfterOpen = ''

        BoxAdminGlobal.Log.Debug('createBoxTemplate Request', boxTemplateTitle, boxTemplateServiceSN, startDate, endDate, usableTimeAfterOpen, visibleFlag, boxItemData, boxTagData)
        
        import json
        
        itemData = json.loads(boxItemData, 'utf-8')
        boxTagData = json.loads(boxTagData, 'utf-8')
        
        boxTagInfo, boxItemInfo = self.ConvertTagValueForTemplate(boxTagData, itemData)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 129)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('boxTemplateTitle', boxTemplateTitle)
        opMsg.addArgument('boxTemplateServiceSN', boxTemplateServiceSN)
        opMsg.addArgument('boxTemplateCreateUserSN', 1)
        
        opMsg.addArgument('boxTemplateStartActivationDateTime', startDate)
        opMsg.addArgument('boxTemplateEndActivationDateTime', endDate)
        
        opMsg.addArgument('boxTemplateActivateDurationAfterOpen', usableTimeAfterOpen)
        opMsg.addArgument('boxTemplateVisableFlagBeforeActivation', visibleFlag)
        
        opMsg.addArgument('boxTagInfo', boxTagInfo)
        opMsg.addArgument('boxItemInfo', boxItemInfo)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())    
            
        retObj = ReturnObject()

        
        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddReturnValue("newBoxSN", retOpMsg.getResultScalar())

        retObj.SetReturnCode(returnCode)
    
        BoxAdminGlobal.Log.Debug('createBoxTemplate Response', returnCode)
        return retObj.ParseToJSON()

    @cherrypy.expose
    def createBoxFromTemplate(self, boxTemplateSN, receiverUserSN, receiverGUSID = None, receiverCharacterSN = None, receiverCharacterName = None):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()
        
        if receiverGUSID == None:
            receiverGUSID = ''
        if receiverCharacterSN == None:
            receiverCharacterSN = ''
        if receiverCharacterName == None:
            receiverCharacterName = ''

        BoxAdminGlobal.Log.Debug('createBoxFromTemplate Request', receiverUserSN, receiverGUSID, receiverCharacterSN, receiverCharacterName)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 108)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('boxTemplateSN', boxTemplateSN)
        opMsg.addArgument('receiverUserSN', receiverUserSN)
        opMsg.addArgument('receiverGUSID', receiverGUSID)
        opMsg.addArgument('receiverCharacterSN', receiverCharacterSN)
        opMsg.addArgument('receiverCharacterName', receiverCharacterName)
    
        opMsg.addArgument('senderUserSN', '')
        opMsg.addArgument('senderGUSID', '')
        opMsg.addArgument('senderCharacterSN', '')
        opMsg.addArgument('senderCharacterName', '')
        
        opMsg.addArgument('createEndPointCode', ServerCategory.boxweb)
        opMsg.addArgument('boxTransactionKey', '')
        opMsg.addArgument('boxItemTransactionKeys', '')
        opMsg.addArgument('boxEventSN', '')
        
        opMsg.addArgument('boxTransactionSN', '')

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())    
            
        retObj = ReturnObject()
        
        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddReturnValue("newBoxSN", retOpMsg.getResultScalar())

        retObj.SetReturnCode(returnCode)
    
        BoxAdminGlobal.Log.Debug('createBoxFromTemplate Response', returnCode)
        return retObj.ParseToJSON()
   
    @cherrypy.expose
    def exportDownload(self, exportHistoryName, exportMode, exportData):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        try:        
            BoxAdminGlobal.Log.Debug('exportDownload Request', exportData)
    
            import json
            exportData = json.loads(exportData, 'utf-8')
            
            exportServiceItemTag = exportData.get("itemTag")
            exportBoxTag = exportData.get("boxTag")
            exportServiceItem = exportData.get("serviceItem")
            exportBoxTemplate = exportData.get("boxTemplate")
            
            exportServiceItemAll = []
            exportBoxTemplateAll = []
           
            retObj = ReturnObject()
            retObj.SetReturnCode(BoxAdminError.SUCCESS)
            
            if exportServiceItemTag == None or exportBoxTag == None or exportServiceItem == None or exportBoxTemplate == None:
                retObj.SetReturnCode(BoxAdminError.INVALID_DATA)
                return retObj.ParseToJSON()
            
            ## Inner query
            def BuildServiceItem(serviceItem):
                opMsg = OpMsg()
                opMsg.makeRequest(GUID.make(ServerCategory.boxweb),
                                GUID.make(ServerCategory.boxapi),
                                GUID.make(ServerCategory.boxapi, 134),
                                0)
                opMsg.addArgument('serviceItemSN', serviceItem.get("serviceItemSN"))
                
                returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())    
            
                if BoxAdminError.IsSuccess(returnCode):
                    addServiceItem = retOpMsg.getResultSet()[0][0]
                    tagValues = retOpMsg.getResultSet(1)[0]
                    addServiceItem["_tagValues"] = tagValues
                    
                    for existServiceItem in exportServiceItemAll:
                        if int(addServiceItem.get("serviceItemSN")) == int(existServiceItem.get("serviceItemSN")):
                            return True, returnCode
                    
                    # serviceItemEnableFlag 값이 web admin으로 부터 셋팅되어 넘어 온 경우에는 web admin에서의 셋팅 값으로 치환한다.
                    serviceItemEnableFlag = serviceItem.get("serviceItemEnableFlag", None)
                    if serviceItemEnableFlag:
                        addServiceItem["serviceItemEnableFlag"] = serviceItemEnableFlag
                        
                    exportServiceItemAll.append(addServiceItem)
                    for tagValue in tagValues:
                        tempTagSN = tagValue.get("serviceItemTagSN")
                        isExist = False
                        
                        for selectedTag in exportServiceItemTag:
                            if int(tempTagSN) == int(selectedTag.get("serviceItemTagSN")):
                                isExist = True
                                break
                        
                        if not isExist:
                            opMsg = OpMsg()
                            opMsg.makeRequest(GUID.make(ServerCategory.boxweb),
                                            GUID.make(ServerCategory.boxapi),
                                            GUID.make(ServerCategory.boxapi, 122),
                                            0)
                            opMsg.addArgument('serviceItemTagSN', tempTagSN)
                            
                            returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())    
                        
                            if BoxAdminError.IsSuccess(returnCode):
                                exportServiceItemTag.append(retOpMsg.getResultSet(0)[0][0])
                            else:
                                return False, returnCode
                else:
                    return False, returnCode
                
                return True, returnCode
                
            ### Service Item Export Build
            if len(exportServiceItem):
                for serviceItem in exportServiceItem:
                    isSuccess, returnCode = BuildServiceItem(serviceItem)
                    
                    if not isSuccess:
                        retObj.SetReturnCode(returnCode)
                        return retObj.ParseToJSON()
            ### Service Item Export END
            
            ### Box Template Export Build
            if len(exportBoxTemplate):
                for boxTemplate in exportBoxTemplate:
                    opMsg = OpMsg()
                    opMsg.makeRequest(GUID.make(ServerCategory.boxweb),
                                    GUID.make(ServerCategory.boxapi),
                                    GUID.make(ServerCategory.boxapi, 139),
                                    0)
                    opMsg.addArgument('boxTemplateSN', boxTemplate.get("boxTemplateSN"))
                    
                    returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())    
                
                    if BoxAdminError.IsSuccess(returnCode):
                        addBoxTemplate = retOpMsg.getResultSet()[0][0]
                        tagValues = retOpMsg.getResultSet(1)[0]
                        itemValues = retOpMsg.getResultSet(2)[0]
                        itemTagValues = retOpMsg.getResultSet(3)[0]
                        addBoxTemplate["_tagValues"] = tagValues
                        addBoxTemplate["_itemValues"] = itemValues
                        addBoxTemplate["_itemTagValues"] = itemTagValues
                        
                        # 박스 템플릿의 enableFlag 값을 web admin에서 설정한 값으로 변경한다.
                        addBoxTemplate["boxTemplateEnableFlag"] = boxTemplate["boxTemplateEnableFlag"]
                        
                        exportBoxTemplateAll.append(addBoxTemplate)
                        
                        for tagValue in tagValues:
                            tempTagSN = tagValue.get("boxTagSN")
                            isExist = False
                            
                            for selectedTag in exportBoxTag:
                                if int(tempTagSN) == int(selectedTag.get("boxTagSN")):
                                    isExist = True
                                    break
                            
                            if not isExist:
                                opMsg = OpMsg()
                                opMsg.makeRequest(GUID.make(ServerCategory.boxweb),
                                                GUID.make(ServerCategory.boxapi),
                                                GUID.make(ServerCategory.boxapi, 110),
                                                0)
                                opMsg.addArgument('boxTagSN', tempTagSN)
                                
                                returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())    
                            
                                if BoxAdminError.IsSuccess(returnCode):
                                    exportBoxTag.append(retOpMsg.getResultSet(0)[0][0])
                                else:
                                    retObj.SetReturnCode(returnCode)
                                    return retObj.ParseToJSON()
                                
                        for itemValue in itemValues:
                            isSuccess, returnCode = BuildServiceItem(itemValue)
                            
                            if not isSuccess:
                                retObj.SetReturnCode(returnCode)
                                return retObj.ParseToJSON()
            ### Box Template Export
            
            ### Save export snapshot
            def CreateExportHistory(exportHistoryName, createUserSN, exportBoxTag, exportServiceItemTag, exportServiceItemAll, exportBoxTemplateAll):
                # exportHistory를 생성
                req = OpMsg()
                req.makeRequest(GUID.make(ServerCategory.boxweb),
                                GUID.make(ServerCategory.boxapi),
                                GUID.make(ServerCategory.boxapi, 149),
                                0)
                req.addArgument('exportHistoryName', exportHistoryName)
                req.addArgument('createUserSN', createUserSN)
                
                returnCode, res = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, req.serialize())
                
                if BoxAdminError.IsSuccess(returnCode):
                    exportHistorySN = long(res.getResultScalar())
                else:
                    exportHistorySN = None
                
                if exportHistorySN:
                    # boxTag export 정보를 저장한다.
                    for item in exportBoxTag:
                        req = OpMsg()
                        req.makeRequest(GUID.make(ServerCategory.boxweb),
                                        GUID.make(ServerCategory.boxapi),
                                        GUID.make(ServerCategory.boxapi, 150),
                                        0)
                        req.addArgument('exportHistorySN', exportHistorySN)
                        req.addArgument('boxTagSN', item['boxTagSN'])
                        req.addArgument('enableFlag', item['boxTagEnableFlag'])
                        
                        returnCode, res = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, req.serialize())
                    
                    # serviceItemTag export 정보를 저장한다.
                    for item in exportServiceItemTag:
                        req = OpMsg()
                        req.makeRequest(GUID.make(ServerCategory.boxweb),
                                        GUID.make(ServerCategory.boxapi),
                                        GUID.make(ServerCategory.boxapi, 151),
                                        0)
                        req.addArgument('exportHistorySN', exportHistorySN)
                        req.addArgument('serviceItemTagSN', item['serviceItemTagSN'])
                        req.addArgument('enableFlag', item['serviceItemTagEnableFlag'])
                        
                        returnCode, res = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, req.serialize())
                    
                    # serviceItem export 정보를 저장한다.
                    for item in exportServiceItemAll:
                        req = OpMsg()
                        req.makeRequest(GUID.make(ServerCategory.boxweb),
                                        GUID.make(ServerCategory.boxapi),
                                        GUID.make(ServerCategory.boxapi, 152),
                                        0)
                        req.addArgument('exportHistorySN', exportHistorySN)
                        req.addArgument('serviceItemSN', item['serviceItemSN'])
                        req.addArgument('enableFlag', item['serviceItemEnableFlag'])
                        
                        returnCode, res = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, req.serialize())
                    
                    # boxTemplate export 정보를 저장한다.
                    for item in exportBoxTemplateAll:
                        req = OpMsg()
                        req.makeRequest(GUID.make(ServerCategory.boxweb),
                                        GUID.make(ServerCategory.boxapi),
                                        GUID.make(ServerCategory.boxapi, 153),
                                        0)
                        req.addArgument('exportHistorySN', exportHistorySN)
                        req.addArgument('boxTemplateSN', item['boxTemplateSN'])
                        req.addArgument('enableFlag', item['boxTemplateEnableFlag'])
                        
                        returnCode, res = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, req.serialize())
            ### Save export snapshot
            
            ###
            def MakeScript(exportServiceItemAll):
                serviceItems = {}
                serviceItemAndServiceItemTags = {}
                
                for serviceItem in exportServiceItemAll:
                    serviceItemSN = serviceItem['serviceItemSN']
                    
                    if not serviceItemSN in serviceItems:
                        serviceItems[serviceItemSN] = {'serviceItemServiceSN': serviceItem['serviceItemServiceSN'],
                                                       'serviceItemMappingItemSN': serviceItem['serviceItemMappingItemSN'],
                                                       'serviceItemEnableFlag': serviceItem['serviceItemEnableFlag'],
                                                       'serviceItemStartActivationDateTime': serviceItem['serviceItemStartActivationDateTime'],
                                                       'serviceItemName': serviceItem['serviceItemName'],
                                                       'serviceItemDescription': serviceItem['serviceItemDescription'],
                                                       'serviceItemRegisterUserSN': serviceItem['serviceItemRegisterUserSN'],
                                                       'serviceItemRegisterDateTime': serviceItem['serviceItemRegisterDateTime']}
                    
                    tagValues = serviceItem['_tagValues']
                    
                    for item in tagValues:
                        validationValueSN = item['validationValueSN']
                        
                        if not validationValueSN in serviceItemAndServiceItemTags:
                            serviceItemAndServiceItemTags[validationValueSN] = {'serviceItemSN': item['serviceItemSN'],
                                                                                'serviceItemTagSN': item['serviceItemTagSN'],
                                                                                'serviceItemValidationValue': item['serviceItemValidationValue']}
                
                script = []
                script.append("-- -----------------------------------------------------\n")
                script.append("-- Truncate\n")
                script.append("-- -----------------------------------------------------\n")
                script.append("\n")
                
                if len(serviceItems) > 0 and len(serviceItemAndServiceItemTags) > 0:
                    script.append("TRUNCATE TABLE service_item;\n")
                    script.append("TRUNCATE TABLE service_item_and_service_item_tag;\n")
                
                script.append("\n")
                script.append("-- -----------------------------------------------------\n")
                script.append("-- Data service_item\n")
                script.append("-- -----------------------------------------------------\n")
                script.append("\n")
                
                if serviceItems:
                    script.append("REPLACE INTO service_item(serviceItemSN,serviceItemServiceSN,serviceItemMappingItemSN,serviceItemEnableFlag,serviceItemStartActivationDateTime,serviceItemName,serviceItemDescription,serviceItemRegisterUserSN,serviceItemRegisterDateTime) VALUES \n")
                
                for serviceItemSN, serviceItem in serviceItems.items():
                    script.append("(")
                    script.append(serviceItemSN + ",")
                    script.append(serviceItem['serviceItemServiceSN'] + ",")
                    script.append(serviceItem['serviceItemMappingItemSN'] + ",")
                    script.append(serviceItem['serviceItemEnableFlag'] + ",")
                    script.append("'" + serviceItem['serviceItemStartActivationDateTime'] + "',")
                    script.append("'" + serviceItem['serviceItemName'] + "',")
                    script.append("'" + serviceItem['serviceItemDescription'] + "',")
                    script.append(serviceItem['serviceItemRegisterUserSN'] + ",")
                    script.append("'" + serviceItem['serviceItemRegisterDateTime'] + "'")
                    script.append("),\n")
                
                if serviceItems:
                    temp = script[-1][:-2] + ";\n"
                    del script[-1]
                    script.append(temp)
                
                script.append("\n")
                script.append("-- -----------------------------------------------------\n")
                script.append("-- Data service_item_and_service_item_tag\n")
                script.append("-- -----------------------------------------------------\n")
                script.append("\n")
                
                if serviceItemAndServiceItemTags:
                    script.append("REPLACE INTO service_item_and_service_item_tag(validationValueSN,serviceItemSN,serviceItemTagSN,serviceItemValidationValue) VALUES \n")
                
                for validationValueSN, item in serviceItemAndServiceItemTags.items():
                    script.append("(")
                    script.append(validationValueSN + ",")
                    script.append(item['serviceItemSN'] + ",")
                    script.append(item['serviceItemTagSN'] + ",")
                    script.append("'" + item['serviceItemValidationValue'] + "'")
                    script.append("),\n")
                
                if serviceItemAndServiceItemTags:
                    temp = script[-1][:-2] + ";\n"
                    del script[-1]
                    script.append(temp)
                
                return script
            ###
            
            ###
            def MakeSortedServiceItemList(exportServiceItemAll):
                serviceItems = {}
                
                for serviceItem in exportServiceItemAll:
                    serviceItems[int(serviceItem['serviceItemSN'])] = {'serviceItemSN': serviceItem['serviceItemSN'],
                                                                       'serviceItemName': serviceItem['serviceItemName'],
                                                                       'serviceItemDescription': serviceItem['serviceItemDescription'],
                                                                       'serviceItemMappingItemSN': serviceItem['serviceItemMappingItemSN']}
                
                sortedServiceItemList = []
                
                for serviceItemSN in sorted(serviceItems):
                    sortedServiceItemList.append(serviceItems[serviceItemSN])
                
                return sortedServiceItemList
            ###
            
            ###
            def MakeSortedBoxTemplateList(exportBoxTemplateAll):
                boxTemplates = {}
                
                for boxTemplate in exportBoxTemplateAll:
                    boxTemplateSN = int(boxTemplate['boxTemplateSN'])
                    boxTemplates[boxTemplateSN] = {'boxTemplateSN': boxTemplateSN, 'boxServiceItemSN': []}
                    for boxTemplateItem in boxTemplate['_itemValues']:
                        boxTemplates[boxTemplateSN]['boxServiceItemSN'].append(long(boxTemplateItem['serviceItemSN']))
                
                sortedBoxTemplateList = []
                
                for boxTemplateSN in sorted(boxTemplates):
                    sortedBoxTemplateList.append(boxTemplates[boxTemplateSN])
                
                return sortedBoxTemplateList
            ###
            
            ###
            def MakeJsonFile(sortedServiceItemList, fullPathFileName):
                jsonData = []
                
                for serviceItem in sortedServiceItemList:
                    jsonData.append({'boxServiceItemSN': int(serviceItem['serviceItemSN']),
                                     'mappingGameItemSN': int(serviceItem['serviceItemMappingItemSN'])})
                
                import json
                
                with open(fullPathFileName, 'wb') as f:
                    json.dump(jsonData, f)
            ###
            
            ###
            def MakeBoxTemplateJsonFile(sortedBoxTemplateList, fullPathFileName):
                jsonData = sortedBoxTemplateList
                
                import json
                
                with open(fullPathFileName, 'wb') as f:
                    json.dump(jsonData, f)
            ###
            
            ###
            def MakeLanguageDataFile(sortedServiceItemList, fullPathFileName):
                import csv, codecs
                
                with open(fullPathFileName, 'wb') as f:
                    f.write(codecs.BOM_UTF8)
                    serviceItem_writer = csv.writer(f, dialect="excel")
                    
                    for serviceItem in sortedServiceItemList:
                        temp = (serviceItem['serviceItemSN'].encode('utf_8'),
                                serviceItem['serviceItemName'].encode('utf_8'),
                                serviceItem['serviceItemDescription'].encode('utf_8'))
                        serviceItem_writer.writerow(temp)
            ###
            
            if exportMode == "CreateExportHistory":
                CreateExportHistory(exportHistoryName, GetCherrySession('steerUserSN'), exportBoxTag, exportServiceItemTag, exportServiceItemAll, exportBoxTemplateAll)
            
            # Build Export Data
            buildExportData = {}
            buildExportData["exportServiceItemTag"] = exportServiceItemTag
            buildExportData["exportBoxTag"] = exportBoxTag
            buildExportData["exportServiceItem"] = exportServiceItemAll
            buildExportData["exportBoxTemplate"] = exportBoxTemplateAll
            
            import zlib, time
            time_string = str(int(time.time()))
            compressedData = zlib.compress(json.dumps(buildExportData))
            
            exportPath = os.path.join(self.rootPath, 'data/export/')
            exportFileName = "ExportBoxData_" + GetCherrySession('steerID') + "_" + time_string + ".bef"
          
            writeFile = io.FileIO(exportPath + exportFileName, 'w')
            writeFile.write(compressedData)
            
            script = MakeScript(exportServiceItemAll)
            scriptExportPath = os.path.join(self.rootPath, 'data/export/')
            scriptExportFileName = "BOX_data_" + exportHistoryName + "_" + time_string + ".sql"
            
            import codecs
            writeFile = io.FileIO(scriptExportPath + scriptExportFileName, 'w')
            writeFile.write(codecs.BOM_UTF8)
            writeFile.write(ConvertToUnicode("".join(script)).encode('utf-8'))
            
            sortedServiceItemList = MakeSortedServiceItemList(exportServiceItemAll)
            sortedBoxTemplateList = MakeSortedBoxTemplateList(exportBoxTemplateAll)
            
            jsonFileName = "BoxServiceItem_" + GetCherrySession('steerID') + "_" + time_string + ".json"
            MakeJsonFile(sortedServiceItemList, exportPath + jsonFileName)
            
            boxTemplateJsonFileName = "BoxTemplate_" + GetCherrySession('steerID') + "_" + time_string + ".json"
            MakeBoxTemplateJsonFile(sortedBoxTemplateList, exportPath + boxTemplateJsonFileName)
            
            languageDataFileName = "ServiceItem_" + GetCherrySession('steerID') + "_" + time_string + ".csv"
            MakeLanguageDataFile(sortedServiceItemList, exportPath + languageDataFileName)
        
        except Exception as exc:
            return BoxWebExceptionHandler.ToReturnObject(exc)
        
        retObj.AddReturnValue("exportFileName", exportFileName)
        retObj.AddReturnValue("scriptExportFileName", scriptExportFileName)
        retObj.AddReturnValue("serviceItemTagCount", len(exportServiceItemTag))
        retObj.AddReturnValue("boxTagCount", len(exportBoxTag))
        retObj.AddReturnValue("serviceItemCount", len(exportServiceItemAll))
        retObj.AddReturnValue("boxTemplateCount", len(exportBoxTemplateAll))
        retObj.AddReturnValue("jsonFileName", jsonFileName)
        retObj.AddReturnValue("boxTemplateJsonFileName", boxTemplateJsonFileName)
        retObj.AddReturnValue("languageDataFileName", languageDataFileName)
        
        BoxAdminGlobal.Log.Debug('exportDownload Response')
        return retObj.ParseToJSON()

    @cherrypy.expose
    def importUpload(self, qqfile):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()
        
        retObj = ReturnObject()
        retObj.SetReturnCode(BoxAdminError.SUCCESS)
        try:
            import zlib, json, time
            
            fp = cherrypy.request.body
            receivedData = fp.read(int(cherrypy.request.headers["Content-Length"]))
               
            importPath = os.path.join(self.rootPath, 'data/import/')
            importFileName = str(int(time.time())) + "_" + qqfile
            
            writeFile = io.FileIO(importPath + importFileName, 'w')
            writeFile.write(receivedData)
            
            jsonStringData = zlib.decompress(receivedData)            
            importData = json.loads(jsonStringData, 'utf-8')

            importBoxTag = importData.get("exportBoxTag")
            importBoxTemplate = importData.get("exportBoxTemplate")
            importServiceItem = importData.get("exportServiceItem")
            importServiceItemTag = importData.get("exportServiceItemTag")
            
            if importBoxTag == None or importBoxTemplate == None or importServiceItem == None or importServiceItemTag == None:
                retObj.SetReturnCode(BoxAdminError.INVALID_DATA)
                return retObj.ParseToJSON()
            
            analyzeList = []
            
            def AddAnalyzeList (category, type, array):
                if type == 1:
                    analyzeList.append({ "category" : category, "type" : type, "keyColumn" : array[0], "value" : array[1] })
                if type == 2:
                    analyzeList.append({ "category" : category, "type" : type, "keyColumn" : array[0], "value" : array[1],
                                        "diffColumn" : array[2], 'fileVal' : array[3], 'dbVal' :array[4]})
                if type == 3:
                    analyzeList.append({ "category" : category, "type" : type, "keyColumn" : array[0], "value" : array[1],
                                        "keyColumn2" : array[2], "value2" : array[3] })
                if type == 4:
                    analyzeList.append({ "category" : category, "type" : type, "keyColumn" : array[0], "value" : array[1],
                                        "keyColumn2" : array[2], "value2" : array[3],
                                        "diffColumn" : array[4], 'fileVal' : array[5], 'dbVal' :array[6]})
           
            # Analyze Import ServiceItem Tag
            for item in importServiceItemTag:
                opMsg = OpMsg()        
                opMsg.makeRequest(GUID.make(ServerCategory.boxweb),
                                GUID.make(ServerCategory.boxapi),
                                GUID.make(ServerCategory.boxapi, 122),
                                0)
                opMsg.addArgument('serviceItemTagSN', item.get("serviceItemTagSN"))

                returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

                if BoxAdminError.IsSuccess(returnCode): # Server returnCode
                    retSet = retOpMsg.getResultSet(0)[0]
                    if retSet == None or len(retSet) > 0:
                        dbServiceItemTag = retSet[0]
                        AddAnalyzeList("serviceItemTag", 1, ["serviceItemTagSN", item.get("serviceItemTagSN")])
                        
                        if dbServiceItemTag.get("serviceItemTagName") != item.get("serviceItemTagName"):
                            AddAnalyzeList("serviceItemTag", 2, ["serviceItemTagSN", item.get("serviceItemTagSN"), "serviceItemTagName", item.get("serviceItemTagName"), dbServiceItemTag.get("serviceItemTagName")])
                        if dbServiceItemTag.get("serviceItemTagDescription") != item.get("serviceItemTagDescription"):
                            AddAnalyzeList("serviceItemTag", 2, ["serviceItemTagSN", item.get("serviceItemTagSN"), "serviceItemTagDescription", item.get("serviceItemTagDescription"), dbServiceItemTag.get("serviceItemTagDescription")])
                        if dbServiceItemTag.get("serviceItemValidationRuleSN") != item.get("serviceItemValidationRuleSN"):
                            AddAnalyzeList("serviceItemTag", 2, ["serviceItemTagSN", item.get("serviceItemTagSN"), "serviceItemValidationRuleSN", item.get("serviceItemValidationRuleSN"), dbServiceItemTag.get("serviceItemValidationRuleSN")])
                        if dbServiceItemTag.get("serviceItemTagEnableFlag") != item.get("serviceItemTagEnableFlag"):
                            AddAnalyzeList("serviceItemTag", 2, ["serviceItemTagSN", item.get("serviceItemTagSN"), "serviceItemTagEnableFlag", item.get("serviceItemTagEnableFlag"), dbServiceItemTag.get("serviceItemTagEnableFlag")])
                else:
                    retObj.SetReturnCode(returnCode)
                    return retObj.ParseToJSON()
                        
            # Analyze Import Box Tag
            for item in importBoxTag:
                opMsg = OpMsg()        
                opMsg.makeRequest(GUID.make(ServerCategory.boxweb),
                                GUID.make(ServerCategory.boxapi),
                                GUID.make(ServerCategory.boxapi, 110),
                                0)
                opMsg.addArgument('boxTagSN', item.get("boxTagSN"))

                returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

                if BoxAdminError.IsSuccess(returnCode): # Server returnCode
                    retSet = retOpMsg.getResultSet(0)[0]
                    if retSet == None or len(retSet) > 0:
                        dbBoxTag = retSet[0]
                        AddAnalyzeList("boxTag", 1, ["boxTagSN", item.get("boxTagSN")])
                        
                        if dbBoxTag.get("boxTagName") != item.get("boxTagName"):
                            AddAnalyzeList("boxTag", 2, ["boxTagSN", item.get("boxTagSN"), "boxTagName", item.get("boxTagName"), dbBoxTag.get("boxTagName")])
                        if dbBoxTag.get("boxTagDescription") != item.get("boxTagDescription"):
                            AddAnalyzeList("boxTag", 2, ["boxTagSN", item.get("boxTagSN"), "boxTagDescription", item.get("boxTagDescription"), dbBoxTag.get("boxTagDescription")])
                        if dbBoxTag.get("boxTagEnableFlag") != item.get("boxTagEnableFlag"):
                            AddAnalyzeList("boxTag", 2, ["boxTagSN", item.get("boxTagSN"), "boxTagEnableFlag", item.get("boxTagEnableFlag"), dbBoxTag.get("boxTagEnableFlag")])
                else:
                    retObj.SetReturnCode(returnCode)
                    return retObj.ParseToJSON()
                
            # Analyze Import ServiceItem
            for item in importServiceItem:
                opMsg = OpMsg()        
                opMsg.makeRequest(GUID.make(ServerCategory.boxweb),
                                GUID.make(ServerCategory.boxapi),
                                GUID.make(ServerCategory.boxapi, 134),
                                0)
                opMsg.addArgument('serviceItemSN', item.get("serviceItemSN"))

                returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

                if BoxAdminError.IsSuccess(returnCode): # Server returnCode
                    retSet = retOpMsg.getResultSet(0)[0]
                    retTagSet = retOpMsg.getResultSet(1)[0]
                    if retSet == None or len(retSet) > 0:
                        dbServiceItem = retSet[0]
                        AddAnalyzeList("serviceItem", 1, ["serviceItemSN", item.get("serviceItemSN")])
                        
                        if dbServiceItem.get("serviceItemServiceSN") != item.get("serviceItemServiceSN"):
                            AddAnalyzeList("serviceItem", 2, ["serviceItemSN", item.get("serviceItemSN"), "serviceItemServiceSN", item.get("serviceItemServiceSN"), dbServiceItem.get("serviceItemServiceSN")])
                        if dbServiceItem.get("serviceItemMappingItemSN") != item.get("serviceItemMappingItemSN"):
                            AddAnalyzeList("serviceItem", 2, ["serviceItemSN", item.get("serviceItemSN"), "serviceItemMappingItemSN", item.get("serviceItemMappingItemSN"), dbServiceItem.get("serviceItemMappingItemSN")])
                        if dbServiceItem.get("serviceItemEnableFlag") != item.get("serviceItemEnableFlag"):
                            AddAnalyzeList("serviceItem", 2, ["serviceItemSN", item.get("serviceItemSN"), "serviceItemEnableFlag", item.get("serviceItemEnableFlag"), dbServiceItem.get("serviceItemEnableFlag")])
                        if dbServiceItem.get("serviceItemStartActivationDateTime") != item.get("serviceItemStartActivationDateTime"):
                            AddAnalyzeList("serviceItem", 2, ["serviceItemSN", item.get("serviceItemSN"), "serviceItemStartActivationDateTime", item.get("serviceItemStartActivationDateTime"), dbServiceItem.get("serviceItemStartActivationDateTime")])
                        if dbServiceItem.get("serviceItemName") != item.get("serviceItemName"):
                            AddAnalyzeList("serviceItem", 2, ["serviceItemSN", item.get("serviceItemSN"), "serviceItemName", item.get("serviceItemName"), dbServiceItem.get("serviceItemName")])
                        if dbServiceItem.get("serviceItemDescription") != item.get("serviceItemDescription"):
                            AddAnalyzeList("serviceItem", 2, ["serviceItemSN", item.get("serviceItemSN"), "serviceItemDescription", item.get("serviceItemDescription"), dbServiceItem.get("serviceItemDescription")])

                    if retTagSet == None or len(retTagSet) > 0:
                        dbTagValues = retTagSet
                        for tagItem in item.get("_tagValues"):
                            for dbTagItem in dbTagValues:
                                if dbTagItem.get("validationValueSN") == tagItem.get("validationValueSN"):
                                    AddAnalyzeList("serviceItemTagValue", 1, ["validationValueSN", tagItem.get("validationValueSN")])
                                    
                                    if dbTagItem.get("serviceItemTagSN") != tagItem.get("serviceItemTagSN"):
                                        AddAnalyzeList("serviceItemTagValue", 2, ["validationValueSN", tagItem.get("validationValueSN"), "serviceItemTagSN", tagItem.get("serviceItemTagSN"), dbTagItem.get("serviceItemTagSN")])
                                    if dbTagItem.get("serviceItemSN") != tagItem.get("serviceItemSN"):
                                        AddAnalyzeList("serviceItemTagValue", 2, ["validationValueSN", tagItem.get("validationValueSN"), "serviceItemSN", tagItem.get("serviceItemSN"), dbTagItem.get("serviceItemSN")])
                                    if dbTagItem.get("serviceItemValidationValue") != tagItem.get("serviceItemValidationValue"):
                                        AddAnalyzeList("serviceItemTagValue", 2, ["validationValueSN", tagItem.get("validationValueSN"), "serviceItemValidationValue", tagItem.get("serviceItemValidationValue"), dbTagItem.get("serviceItemValidationValue")])
                else:
                    retObj.SetReturnCode(returnCode)
                    return retObj.ParseToJSON()
                
            # Analyze Import BoxTemplate
            for item in importBoxTemplate:
                opMsg = OpMsg()        
                opMsg.makeRequest(GUID.make(ServerCategory.boxweb),
                                GUID.make(ServerCategory.boxapi),
                                GUID.make(ServerCategory.boxapi, 139),
                                0)
                opMsg.addArgument('boxTemplateSN', item.get("boxTemplateSN"))

                returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

                if BoxAdminError.IsSuccess(returnCode): # Server returnCode
                    retSet = retOpMsg.getResultSet(0)[0]
                    retTagSet = retOpMsg.getResultSet(1)[0]
                    retItemSet = retOpMsg.getResultSet(2)[0]
                    retItemTagSet = retOpMsg.getResultSet(3)[0]
                    
                    if retSet == None or len(retSet) > 0:
                        dbBoxTemplate = retSet[0]
                        AddAnalyzeList("boxTemplate", 1, ["boxTemplateSN", item.get("boxTemplateSN")])
                        
                        if dbBoxTemplate.get("boxTemplateTitle") != item.get("boxTemplateTitle"):
                            AddAnalyzeList("boxTemplate", 2, ["boxTemplateSN", item.get("boxTemplateSN"), "boxTemplateTitle", item.get("boxTemplateTitle"), dbBoxTemplate.get("boxTemplateTitle")])
                        if dbBoxTemplate.get("boxTemplateServiceSN") != item.get("boxTemplateServiceSN"):
                            AddAnalyzeList("boxTemplate", 2, ["boxTemplateSN", item.get("boxTemplateSN"), "boxTemplateServiceSN", item.get("boxTemplateServiceSN"), dbBoxTemplate.get("boxTemplateServiceSN")])
                        if dbBoxTemplate.get("boxTemplateStartActivationDateTime") != item.get("boxTemplateStartActivationDateTime"):
                            AddAnalyzeList("boxTemplate", 2, ["boxTemplateSN", item.get("boxTemplateSN"), "boxTemplateStartActivationDateTime", item.get("boxTemplateStartActivationDateTime"), dbBoxTemplate.get("boxTemplateStartActivationDateTime")])
                        if dbBoxTemplate.get("boxTemplateEndActivationDateTime") != item.get("boxTemplateEndActivationDateTime"):
                            AddAnalyzeList("boxTemplate", 2, ["boxTemplateSN", item.get("boxTemplateSN"), "boxTemplateEndActivationDateTime", item.get("boxTemplateEndActivationDateTime"), dbBoxTemplate.get("boxTemplateEndActivationDateTime")])
                        if dbBoxTemplate.get("boxTemplateActivateDurationAfterOpen") != item.get("boxTemplateActivateDurationAfterOpen"):
                            AddAnalyzeList("boxTemplate", 2, ["boxTemplateSN", item.get("boxTemplateSN"), "boxTemplateActivateDurationAfterOpen", item.get("boxTemplateActivateDurationAfterOpen"), dbBoxTemplate.get("boxTemplateActivateDurationAfterOpen")])
                        if dbBoxTemplate.get("boxTemplateVisableFlagBeforeActivation") != item.get("boxTemplateVisableFlagBeforeActivation"):
                            AddAnalyzeList("boxTemplate", 2, ["boxTemplateSN", item.get("boxTemplateSN"), "boxTemplateVisableFlagBeforeActivation", item.get("boxTemplateVisableFlagBeforeActivation"), dbBoxTemplate.get("boxTemplateVisableFlagBeforeActivation")])
                        if dbBoxTemplate.get("boxTemplateEnableFlag") != item.get("boxTemplateEnableFlag"):
                            AddAnalyzeList("boxTemplate", 2, ["boxTemplateSN", item.get("boxTemplateSN"), "boxTemplateEnableFlag", item.get("boxTemplateEnableFlag"), dbBoxTemplate.get("boxTemplateEnableFlag")])

                    if retTagSet == None or len(retTagSet) > 0:
                        dbTagValues = retTagSet
                        for tagItem in item.get("_tagValues"):
                            for dbTagItem in dbTagValues:
                                if dbTagItem.get("boxTemplateSN") == tagItem.get("boxTemplateSN") and dbTagItem.get("boxTagSN") == tagItem.get("boxTagSN"):
                                    AddAnalyzeList("boxTemplateTagValue", 3, ["boxTemplateSN", tagItem.get("boxTemplateSN"), "boxTagSN", tagItem.get("boxTagSN")])
    
                                    if dbTagItem.get("boxTagValue") != tagItem.get("boxTagValue"):
                                        AddAnalyzeList("boxTemplateTagValue", 4, ["boxTemplateSN", tagItem.get("boxTemplateSN"), "boxTagSN", tagItem.get("boxTagSN"), "boxTagValue", tagItem.get("boxTagValue"), dbTagItem.get("boxTagValue")])
                                  
                    if retItemSet == None or len(retItemSet) > 0:
                        dbItemValues = retItemSet 
                        for itemItem in item.get("_itemValues"):
                            for dbValueItem in dbItemValues:
                                if dbValueItem.get("boxTemplateItemSN") == itemItem.get("boxTemplateItemSN"):
                                    AddAnalyzeList("boxTemplateItem", 1, ["boxTemplateItemSN", itemItem.get("boxTemplateItemSN")])
                                    
                                    if dbValueItem.get("boxTemplateSN") != itemItem.get("boxTemplateSN"):
                                        AddAnalyzeList("boxTemplateItem", 2, ["boxTemplateItemSN", itemItem.get("boxTemplateItemSN"), "boxTemplateSN", itemItem.get("boxTemplateSN"), dbValueItem.get("boxTemplateSN")])
                                    if dbValueItem.get("serviceItemSN") != itemItem.get("serviceItemSN"):
                                        AddAnalyzeList("boxTemplateItem", 2, ["boxTemplateItemSN", itemItem.get("boxTemplateItemSN"), "serviceItemSN", itemItem.get("serviceItemSN"), dbValueItem.get("serviceItemSN")])

                    if retItemTagSet == None or len(retItemTagSet) > 0:
                        dbItemTagValues = retItemTagSet
                        for itemTagItem in item.get("_itemTagValues"):
                            for dbItemTagItem in dbItemTagValues:
                                if dbItemTagItem.get("boxTemplateItemSN") == itemTagItem.get("boxTemplateItemSN") and dbItemTagItem.get("serviceItemTagSN") == itemTagItem.get("serviceItemTagSN"):
                                    AddAnalyzeList("boxTemplateItemTagValue", 3, ["boxTemplateItemSN", itemTagItem.get("boxTemplateItemSN"), "serviceItemTagSN", itemTagItem.get("serviceItemTagSN")])
    
                                    if dbItemTagItem.get("serviceItemTagValue") != itemTagItem.get("serviceItemTagValue"):
                                        AddAnalyzeList("boxTemplateItemTagValue", 4, ["boxTemplateItemSN", itemTagItem.get("boxTemplateItemSN"), "serviceItemTagSN", itemTagItem.get("serviceItemTagSN"), "serviceItemTagValue", itemTagItem.get("serviceItemTagValue"), dbItemTagItem.get("serviceItemTagValue")])
                                       
                else:
                    retObj.SetReturnCode(returnCode)
                    return retObj.ParseToJSON()

        except Exception as exc:
            return BoxWebExceptionHandler.ToReturnObject(exc)

        retObj.AddReturnValue("importFileName", importFileName)
        retObj.AddReturnValue("success", "true")
        retObj.AddReturnValue("analyzeList", analyzeList)
        retObj.AddReturnTable(importServiceItemTag)
        retObj.AddReturnTable(importBoxTag)
        retObj.AddReturnTable(importServiceItem)
        retObj.AddReturnTable(importBoxTemplate)
        
        return retObj.ParseToJSON()

    @cherrypy.expose
    def importStart(self, fileName):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()
        
        retObj = ReturnObject()
        retObj.SetReturnCode(BoxAdminError.SUCCESS)
        try:
            import zlib, json
            
            importPath = os.path.join(self.rootPath, 'data/import/')
            importFileName = fileName
                
            readFile = io.FileIO(importPath + importFileName, 'r')
            receivedData = readFile.readall()
            
            jsonStringData = zlib.decompress(receivedData)            
            importData = json.loads(jsonStringData, 'utf-8')
    
            importBoxTag = importData.get("exportBoxTag")
            importBoxTemplate = importData.get("exportBoxTemplate")
            importServiceItem = importData.get("exportServiceItem")
            importServiceItemTag = importData.get("exportServiceItemTag")
            
            if importBoxTag == None or importBoxTemplate == None or importServiceItem == None or importServiceItemTag == None:
                retObj.SetReturnCode(BoxAdminError.INVALID_DATA)
                return retObj.ParseToJSON()
            
            resultList = []
                
            def AddResultList (category, type, isSuccess, array, text = None):
                if type == 1:
                    resultList.append({ "category" : category, "type" : type, "keyColumn" : array[0], "value" : array[1],
                                        "success" : int(isSuccess), "text" : text})
                if type == 2:
                    resultList.append({ "category" : category, "type" : type, "keyColumn" : array[0], "value" : array[1],
                                        "keyColumn2" : array[2], "value2" : array[3], "success" : int(isSuccess), "text" : text})
                    
            # Register Import ServiceItem Tag
            for item in importServiceItemTag:
                opMsg = OpMsg()        
                opMsg.makeRequest(GUID.make(ServerCategory.boxweb),
                                GUID.make(ServerCategory.boxapi),
                                GUID.make(ServerCategory.boxapi, 141),
                                0)
    
                opMsg.addArgument('serviceItemTagSN', item.get("serviceItemTagSN"))
                opMsg.addArgument('serviceItemTagName', item.get("serviceItemTagName"))
                opMsg.addArgument('serviceItemTagDescription', item.get("serviceItemTagDescription"))
                opMsg.addArgument('serviceItemValidationRuleSN', item.get("serviceItemValidationRuleSN"))
                opMsg.addArgument('serviceItemTagEnableFlag', item.get("serviceItemTagEnableFlag"))
    
                returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())
    
                if BoxAdminError.IsSuccess(returnCode): # Server returnCode
                    AddResultList("serviceItemTag", 1, True, ["serviceItemTagSN", item.get("serviceItemTagSN")])
                else:
                    AddResultList("serviceItemTag", 1, False, ["serviceItemTagSN", item.get("serviceItemTagSN")], returnCode)
                
            # Register Import Box Tag
            for item in importBoxTag:
                opMsg = OpMsg()        
                opMsg.makeRequest(GUID.make(ServerCategory.boxweb),
                                GUID.make(ServerCategory.boxapi),
                                GUID.make(ServerCategory.boxapi, 147),
                                0)
                opMsg.addArgument('boxTagSN', item.get("boxTagSN"))
                opMsg.addArgument('boxTagName', item.get("boxTagName"))
                opMsg.addArgument('boxTagDescription', item.get("boxTagDescription"))
                opMsg.addArgument('boxTagEnableFlag', item.get("boxTagEnableFlag"))

                returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())
    
                if BoxAdminError.IsSuccess(returnCode): # Server returnCode
                    AddResultList("boxTag", 1, True, ["boxTagSN", item.get("boxTagSN")])
                else:
                    AddResultList("boxTag", 1, False, ["boxTagSN", item.get("boxTagSN")], returnCode)

            # Register Import ServiceItem
            for item in importServiceItem:
                opMsg = OpMsg()        
                opMsg.makeRequest(GUID.make(ServerCategory.boxweb),
                                GUID.make(ServerCategory.boxapi),
                                GUID.make(ServerCategory.boxapi, 142),
                                0)
                
                opMsg.addArgument('serviceItemSN', item.get("serviceItemSN"))
                opMsg.addArgument('serviceItemServiceSN', item.get("serviceItemServiceSN"))
                opMsg.addArgument('serviceItemMappingItemSN', item.get("serviceItemMappingItemSN"))
                opMsg.addArgument('serviceItemEnableFlag', item.get("serviceItemEnableFlag"))
                opMsg.addArgument('serviceItemStartActivationDateTime', item.get("serviceItemStartActivationDateTime"))
                opMsg.addArgument('serviceItemName', item.get("serviceItemName"))
                opMsg.addArgument('serviceItemDescription', item.get("serviceItemDescription"))
                opMsg.addArgument('serviceItemRegisterUserSN', GetCherrySession('steerUserSN'))

                returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

                if BoxAdminError.IsSuccess(returnCode): # Server returnCode
                    AddResultList("serviceItem", 1, True, ["serviceItemSN", item.get("serviceItemSN")])
                else:
                    AddResultList("serviceItem", 1, False, ["serviceItemSN", item.get("serviceItemSN")], returnCode)

                for tagItem in item.get("_tagValues"):
                    opMsg = OpMsg()        
                    opMsg.makeRequest(GUID.make(ServerCategory.boxweb),
                                    GUID.make(ServerCategory.boxapi),
                                    GUID.make(ServerCategory.boxapi, 140),
                                    0)

                    opMsg.addArgument('validationValueSN', tagItem.get("validationValueSN"))
                    opMsg.addArgument('serviceItemSN', tagItem.get("serviceItemSN"))
                    opMsg.addArgument('serviceItemTagSN', tagItem.get("serviceItemTagSN"))
                    opMsg.addArgument('serviceItemValidationValue', tagItem.get("serviceItemValidationValue"))
                    
                    returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())
                    
                    if BoxAdminError.IsSuccess(returnCode): # Server returnCode
                        AddResultList("serviceItemTagValue", 1, True, ["validationValueSN", tagItem.get("validationValueSN")])
                    else:
                        AddResultList("serviceItemTagValue", 1, False, ["validationValueSN", tagItem.get("validationValueSN")], returnCode)
                
            # Register Import BoxTemplate
            for item in importBoxTemplate:
                opMsg = OpMsg()        
                opMsg.makeRequest(GUID.make(ServerCategory.boxweb),
                                GUID.make(ServerCategory.boxapi),
                                GUID.make(ServerCategory.boxapi, 146),
                                0)
                
                opMsg.addArgument('boxTemplateSN', item.get("boxTemplateSN"))
                opMsg.addArgument('boxTemplateTitle', item.get("boxTemplateTitle"))
                opMsg.addArgument('boxTemplateServiceSN', item.get("boxTemplateServiceSN"))
                opMsg.addArgument('boxTemplateCreateUserSN', item.get("boxTemplateCreateUserSN"))
                opMsg.addArgument('boxTemplateStartActivationDateTime', item.get("boxTemplateStartActivationDateTime"))
                opMsg.addArgument('boxTemplateEndActivationDateTime', item.get("boxTemplateEndActivationDateTime"))
                opMsg.addArgument('boxTemplateActivateDurationAfterOpen', item.get("boxTemplateActivateDurationAfterOpen"))
                opMsg.addArgument('boxTemplateVisableFlagBeforeActivation', item.get("boxTemplateVisableFlagBeforeActivation"))
                opMsg.addArgument('boxTemplateEnableFlag', item.get("boxTemplateEnableFlag"))

                returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

                if BoxAdminError.IsSuccess(returnCode): # Server returnCode
                    AddResultList("boxTemplate", 1, True, ["boxTemplateSN", item.get("boxTemplateSN")])
                else:
                    AddResultList("boxTemplate", 1, False, ["boxTemplateSN", item.get("boxTemplateSN")], returnCode)

                for tagItem in item.get("_tagValues"):
                    opMsg = OpMsg()        
                    opMsg.makeRequest(GUID.make(ServerCategory.boxweb),
                                    GUID.make(ServerCategory.boxapi),
                                    GUID.make(ServerCategory.boxapi, 145),
                                    0)
                    
                    opMsg.addArgument('boxTemplateSN', tagItem.get("boxTemplateSN"))
                    opMsg.addArgument('boxTagSN', tagItem.get("boxTagSN"))
                    opMsg.addArgument('boxTagValue', tagItem.get("boxTagValue"))
                    
                    returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())
                    
                    if BoxAdminError.IsSuccess(returnCode): # Server returnCode
                        AddResultList("boxTemplateTagValue", 2, True, ["boxTemplateSN", tagItem.get("boxTemplateSN"), "boxTagSN", tagItem.get("boxTagSN")])
                    else:
                        AddResultList("boxTemplateTagValue", 2, False, ["boxTemplateSN", tagItem.get("boxTemplateSN"), "boxTagSN", tagItem.get("boxTagSN")], returnCode)

                for itemItem in item.get("_itemValues"):
                    opMsg = OpMsg()        
                    opMsg.makeRequest(GUID.make(ServerCategory.boxweb),
                                    GUID.make(ServerCategory.boxapi),
                                    GUID.make(ServerCategory.boxapi, 144),
                                    0)
                    
                    opMsg.addArgument('boxTemplateItemSN', itemItem.get("boxTemplateItemSN"))
                    opMsg.addArgument('boxTemplateSN', itemItem.get("boxTemplateSN"))
                    opMsg.addArgument('serviceItemSN', itemItem.get("serviceItemSN"))
                    
                    returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())
                    
                    if BoxAdminError.IsSuccess(returnCode): # Server returnCode
                        AddResultList("boxTemplateItem", 1, True, ["boxTemplateItemSN", itemItem.get("boxTemplateItemSN")])
                    else:
                        AddResultList("boxTemplateItem", 1, False, ["boxTemplateItemSN", itemItem.get("boxTemplateItemSN")], returnCode)
                    
                for itemTagItem in item.get("_itemTagValues"):
                    opMsg = OpMsg()        
                    opMsg.makeRequest(GUID.make(ServerCategory.boxweb),
                                    GUID.make(ServerCategory.boxapi),
                                    GUID.make(ServerCategory.boxapi, 143),
                                    0)
                    
                    opMsg.addArgument('boxTemplateItemSN', itemTagItem.get("boxTemplateItemSN"))
                    opMsg.addArgument('serviceItemTagSN', itemTagItem.get("serviceItemTagSN"))
                    opMsg.addArgument('serviceItemTagValue', itemTagItem.get("serviceItemTagValue"))  

                    returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())
                    
                    if BoxAdminError.IsSuccess(returnCode): # Server returnCode
                        AddResultList("boxTemplateItemTagValue", 2, True, ["boxTemplateItemSN", itemTagItem.get("boxTemplateItemSN"), "serviceItemTagSN", itemTagItem.get("serviceItemTagSN")])
                    else:
                        AddResultList("boxTemplateItemTagValue", 2, False, ["boxTemplateItemSN", itemTagItem.get("boxTemplateItemSN"), "serviceItemTagSN", itemTagItem.get("serviceItemTagSN")], returnCode)

        except Exception as exc:
            return BoxWebExceptionHandler.ToReturnObject(exc)

        retObj.AddReturnValue("resultList", resultList)
        return retObj.ParseToJSON()
 
    @cherrypy.expose
    def removeBoxTemplate(self, boxTemplateSN):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('removeBoxTemplate Request', boxTemplateSN)

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 130)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('boxTemplateSN', boxTemplateSN)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('removeBoxTemplate Response', returnCode)
        return retObj.ParseToJSON()
    
    @cherrypy.expose
    def exportLanguageDataDownload(self, exportData):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()
        
        BoxAdminGlobal.Log.Debug('exportLanguageDataDownload Request', exportData)
        
        categoryCodes = [1,2,3,4]
        rowCount = 500
        
        for categoryCode in categoryCodes:
            rowOffset = 0
            resultTable = []
            resultCount = 0
            
            while True:
                req = OpMsg()
                req.makeRequest(GUID.make(ServerCategory.boxweb),
                                GUID.make(ServerCategory.boxapi),
                                GUID.make(ServerCategory.boxapi, 135),
                                0)
                req.addArgument('rowOffset', rowOffset)
                req.addArgument('rowCount', rowCount)
                req.addArgument('categoryCode', categoryCode)
        
                returnCode, res = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, req.serialize())
        
                if BoxAdminError.IsSuccess(returnCode):
                    returnCode = res.getResultCode()
                    table, count = res.getResultSet(0)
                    
                    resultTable = resultTable + table
                    resultCount = resultCount + count
                    
                    if count < rowCount:
                        if categoryCode == 1:
                            serviceItemList = resultTable
                        if categoryCode == 2:
                            serviceItemTagList = resultTable
                        if categoryCode == 3:
                            boxTemplateList = resultTable
                        if categoryCode == 4:
                            boxTagList = resultTable
                        
                        break
                    
                    rowOffset = rowOffset + rowCount
        
        import time
        
        exportPath = os.path.join(self.rootPath, 'data/export/')
        exportFileName_serviceItem = "ServiceItem_" + GetCherrySession('steerID') + "_" + str(int(time.time())) + ".csv"
        exportFileName_serviceItemTag = "ServiceItemTag_" + GetCherrySession('steerID') + "_" + str(int(time.time())) + ".csv"
        exportFileName_boxTemplate = "BoxTemplate_" + GetCherrySession('steerID') + "_" + str(int(time.time())) + ".csv"
        exportFileName_boxTag = "BoxTag_" + GetCherrySession('steerID') + "_" + str(int(time.time())) + ".csv"
        
        import csv, codecs
        
        with open(exportPath + exportFileName_serviceItem, 'wb') as f:
            f.write(codecs.BOM_UTF8)
            serviceItem_writer = csv.writer(f, dialect="excel")
            for item in serviceItemList:
                temp = (item['serviceItemSN'].encode('utf_8'), item['serviceItemName'].encode('utf_8'), item['serviceItemDescription'].encode('utf_8'))
                serviceItem_writer.writerow(temp)
        
        with open(exportPath + exportFileName_serviceItemTag, 'wb') as f:
            f.write(codecs.BOM_UTF8)
            serviceItemTag_writer = csv.writer(f, dialect="excel")
            for item in serviceItemTagList:
                temp = (item['serviceItemTagSN'].encode('utf_8'), item['serviceItemTagDescription'].encode('utf_8'))
                serviceItemTag_writer.writerow(temp)
        
        with open(exportPath + exportFileName_boxTemplate, 'wb') as f:
            f.write(codecs.BOM_UTF8)
            boxTemplate_writer = csv.writer(f, dialect="excel")
            for item in boxTemplateList:
                temp = (item['boxTemplateSN'].encode('utf_8'), item['boxTemplateTitle'].encode('utf_8'))
                boxTemplate_writer.writerow(temp)
        
        with open(exportPath + exportFileName_boxTag, 'wb') as f:
            f.write(codecs.BOM_UTF8)
            boxTag_writer = csv.writer(f, dialect="excel")
            for item in boxTagList:
                temp = (item['boxTagSN'].encode('utf_8'), item['boxTagDescription'].encode('utf_8'))
                boxTag_writer.writerow(temp)
        
        retObj = ReturnObject()
        retObj.SetReturnCode(returnCode)
        retObj.AddReturnValue('serviceItemFileName', exportFileName_serviceItem)
        retObj.AddReturnValue('serviceItemTagFileName', exportFileName_serviceItemTag)
        retObj.AddReturnValue('boxTemplateFileName', exportFileName_boxTemplate)
        retObj.AddReturnValue('boxTagFileName', exportFileName_boxTag)
        
        return retObj.ParseToJSON()
   
    @cherrypy.expose
    def importLanguageDataUpload(self, qqfile):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()
        
        retObj = ReturnObject()
        retObj.SetReturnCode(BoxAdminError.SUCCESS)
        try:
            import time
            
            fp = cherrypy.request.body
            receivedData = fp.read(int(cherrypy.request.headers["Content-Length"]))
            
            importPath = os.path.join(self.rootPath, 'data/import/')
            importFileName = str(int(time.time())) + "_" + qqfile
            fileName = qqfile.split('_')
            
            with open(importPath + importFileName, 'wb') as f:
                f.write(receivedData)
            
            import csv, pickle, codecs
            
            with open(importPath + importFileName, 'rb') as f:
                bom = f.read(3)
                
                if codecs.BOM_UTF8 == bom:
                    reader = csv.reader(f, dialect="excel")
                else:
                    f.seek(0)
                    reader = csv.reader(f, dialect="excel")
                
                rowCount = 0
                set = []
                data = []
                
                for row in reader:
                    columnCount = 0
                    newRow = []
                    
                    for item in row:
                        newRow.append(unicode(item, 'utf_8'))
                        columnCount = columnCount + 1
                        
                    if fileName[0] == "ServiceItem" and columnCount < 3:
                        newRow.append(u'')
                        
                    data.append(newRow)
                    rowCount = rowCount + 1
                    
                    if rowCount % 100 == 0:
                        set.append(data)
                        data = []
                
                if data:
                    set.append(data)
            
            results = []
            
            for data in set:
                pickled = pickle.dumps(data)
                
                if fileName[0] == "ServiceItem":
                    req = OpMsg()
                    req.makeRequest(GUID.make(ServerCategory.boxweb),
                                    GUID.make(ServerCategory.boxapi),
                                    GUID.make(ServerCategory.boxapi, 136),
                                    0)
                    req.setBlob(pickled)
                elif fileName[0] == "ServiceItemTag":
                    req = OpMsg()
                    req.makeRequest(GUID.make(ServerCategory.boxweb),
                                    GUID.make(ServerCategory.boxapi),
                                    GUID.make(ServerCategory.boxapi, 137),
                                    0)
                    req.setBlob(pickled)
                elif fileName[0] == "BoxTag":
                    req = OpMsg()
                    req.makeRequest(GUID.make(ServerCategory.boxweb),
                                    GUID.make(ServerCategory.boxapi),
                                    GUID.make(ServerCategory.boxapi, 156),
                                    0)
                    req.setBlob(pickled)
                elif fileName[0] == "BoxTemplate":
                    req = OpMsg()
                    req.makeRequest(GUID.make(ServerCategory.boxweb),
                                    GUID.make(ServerCategory.boxapi),
                                    GUID.make(ServerCategory.boxapi, 138),
                                    0)
                    req.setBlob(pickled)
                else:
                    return retObj.ParseToJSON()
                
                returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID, 1, req.serialize())
                results.append((returnCode, retOpMsg))
            
            returnCode, retOpMsg = None, None
            
            for result in results:
                returnCode, retOpMsg = result
                if not BoxAdminError.IsSuccess(returnCode):
                    break
                else:
                    returnCode_temp = retOpMsg.getResultCode()
                    if not BoxAdminError.IsSuccess(returnCode_temp):
                        break
                    
            if returnCode == None and len(set) < 1:
                retObj.SetReturnCode(BoxAdminError.SUCCESS)
                retObj.AddReturnValue("success", "true")
                return retObj.ParseToJSON()
            
            if BoxAdminError.IsSuccess(returnCode): # Connector returnCode
                returnCode = retOpMsg.getResultCode()
                if BoxAdminError.IsSuccess(returnCode): # Server returnCode
                    retObj.SetReturnCode(BoxAdminError.SUCCESS)
                    retObj.AddReturnValue("success", "true")
                    return retObj.ParseToJSON()
                else:
                    retObj.SetReturnCode(returnCode)
                    return retObj.ParseToJSON()
            else:
                retObj.SetReturnCode(returnCode)
                return retObj.ParseToJSON()

        except Exception as exc:
            return BoxWebExceptionHandler.ToReturnObject(exc)
        
        return retObj.ParseToJSON()
    
    @cherrypy.expose
    def getPageExportHistory(self, key, startIndex, results, sort, dir, enableFlag=None, searchCondition=None):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getPageExportHistory Request', key, startIndex, results, sort, dir)

        if searchCondition == None:
            searchCondition = ''
        if enableFlag == None:
            enableFlag = '1'

        opMsg = OpMsg()
        opMsg.setJobType(JobType.REQUEST)
        opMsg.setGUFID((GUID.make(ServerCategory.boxapi, 154)))
        opMsg.setSenderGUSID(GUID.make(ServerCategory.boxweb, 0))
        opMsg.setReceiverGUSID(GUID.make(ServerCategory.boxapi, 0))
        opMsg.setExecType(ExecType.EXECUTE)
        opMsg.addArgument('rowOffset', startIndex)
        opMsg.addArgument('rowCount', results)
        opMsg.addArgument('searchCondition', searchCondition)
        opMsg.addArgument('enableFlag', enableFlag)
        opMsg.addArgument('sort', sort)
        opMsg.addArgument('dir', dir)

        returnCode, retOpMsg = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, opMsg.serialize())

        retObj = ReturnObject()

        if BoxAdminError.IsSuccess(returnCode):
            returnCode = retOpMsg.getResultCode()
            retObj.AddYUIDataTable(retOpMsg.getResultSet(0), startIndex, results, sort, dir)

        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getPageExportHistory Response', returnCode)
        return retObj.ParseToJSON()
    
    @cherrypy.expose
    def getDetailExportHistory(self, exportHistorySN):
        isExist, retObj = self.CheckSession()
        if not isExist:
            return retObj.ParseToJSON()

        BoxAdminGlobal.Log.Debug('getDetailExportHistory Request', exportHistorySN)
        
        categoryCodes = [1,2,3,4,5]
        rowCount = 500
        
        retObj = ReturnObject()
        
        for categoryCode in categoryCodes:
            rowOffset = 0
            resultTable = []
            resultCount = 0
            
            while True:
                req = OpMsg()
                req.makeRequest(GUID.make(ServerCategory.boxweb),
                                GUID.make(ServerCategory.boxapi),
                                GUID.make(ServerCategory.boxapi, 155),
                                0)
                req.addArgument('rowOffset', rowOffset)
                req.addArgument('rowCount', rowCount)
                req.addArgument('exportHistorySN', exportHistorySN)
                req.addArgument('categoryCode', categoryCode)
        
                returnCode, res = PlatformConnector.SendAndRecv(BoxAdminConfig.BoxAPI_GUSID , 1, req.serialize())
        
                if BoxAdminError.IsSuccess(returnCode):
                    returnCode = res.getResultCode()
                    table, count = res.getResultSet(0)
                    
                    resultTable = resultTable + table
                    resultCount = resultCount + count
                    
                    if count < rowCount:
                        retObj.AddReturnTable((resultTable, resultCount))
                        break
                    
                    rowOffset = rowOffset + rowCount
        
        retObj.SetReturnCode(returnCode)

        BoxAdminGlobal.Log.Debug('getDetailExportHistory Response', returnCode)
        return retObj.ParseToJSON()

