#!/usr/bin/env python
# -*- coding: utf8 -*-
import BoxAdminGlobal

#===============================
#
# Web Requester
#
#===============================

import binascii
import struct
import socket
import BoxAdminConfig
from pyCruise.OpMsg import OpMsg
from BoxAdminError import BoxAdminError

#===============================
class SteerConnector:
    @staticmethod
    def SendAndRecv(opMsg):
        StructFormat = '!HII'
        SocketMaxLen = BoxAdminConfig.MaxLen
        SocketTimeout = BoxAdminConfig.TimeOut
        SteerAddr = BoxAdminConfig.SteerGatewayAddress
        SteerPort = BoxAdminConfig.SteerGatewayPort
        
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(SocketTimeout) 
        
        prefixLength = struct.calcsize(StructFormat)
        serializedData = opMsg.serialize()

        senddata = struct.pack(StructFormat, len(serializedData) + prefixLength, opMsg.getSenderGUSID(), opMsg.getReceiverGUSID()) + serializedData
        
        try:
            sock.connect((SteerAddr,SteerPort))
        except:
            BoxAdminGlobal.Log.Error("Connect Failed", SteerAddr, SteerPort)
            sock = None
            return BoxAdminError.CONNECTION_FAILED, None

        BoxAdminGlobal.Log.Debug("Connection Established", SteerAddr, SteerPort)

        try:
            sendLength = sock.send(senddata)
            
            while sendLength < len(senddata):
                sendLength += sock.send(senddata[sendLength:])
                
            BoxAdminGlobal.Log.Debug("Send Data", SteerAddr, SteerPort, sendLength, binascii.b2a_hex(senddata))
        except:
            BoxAdminGlobal.Log.Error("Send Failed", SteerAddr, SteerPort)
            sock.close()
            return BoxAdminError.SEND_RECV_FAILED, None

        if sendLength <= 0:
            sock.close()
            return BoxAdminError.SEND_RECV_FAILED, None

        try:
            resMsg = sock.recv(SocketMaxLen)
            BoxAdminGlobal.Log.Debug("Recv Data", SteerAddr, SteerPort, binascii.b2a_hex(resMsg))
            
            if len(resMsg) <= 0:
                sock.close()
                BoxAdminGlobal.Log.Error("Receive Failed", SteerAddr, SteerPort)
                return BoxAdminError.SEND_RECV_FAILED, None
            
            # prefixLength ?????? ??????????????? ????????????.
            while True:
                if len(resMsg) >= prefixLength:
                    break
                else:
                    resMsg += sock.recv(SocketMaxLen)
                    BoxAdminGlobal.Log.Debug("Recv Data", SteerAddr, SteerPort, binascii.b2a_hex(resMsg))
            # prefixLength ?????? ?????? ???????????? ???????????? ?????? ????????? ???????????? ?????????.
            resMsgSize, senderGUSID, receiverGUSID = struct.unpack(StructFormat, resMsg[:prefixLength])
            # ?????? ????????? ????????? ?????? ??????????????? ????????????.
            while True:
                if len(resMsg) < resMsgSize:
                    resMsg += sock.recv(SocketMaxLen)
                    BoxAdminGlobal.Log.Debug("Recv Data", SteerAddr, SteerPort, binascii.b2a_hex(resMsg))
                else:
                    break;
            # ????????? ?????????.
            sock.close()
            
            unpackdata = resMsg[prefixLength:]
        except:
            sock.close()
            BoxAdminGlobal.Log.Error("Receive Failed :: %s (%i)" % (SteerAddr, SteerPort))
            return BoxAdminError.SEND_RECV_FAILED, None

        retOpMsg = OpMsg()
        retOpMsg.parse(unpackdata)
        return retOpMsg.getResultCode(), retOpMsg

    @staticmethod
    def Send(opMsg):
        StructFormat = '!HII'
        SocketTimeout = BoxAdminConfig.TimeOut
        SteerAddr = BoxAdminConfig.SteerGatewayAddress
        SteerPort = BoxAdminConfig.SteerGatewayPort
        
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(SocketTimeout) 
        
        prefixLength = struct.calcsize(StructFormat)
        serializedData = opMsg.serialize()

        senddata = struct.pack(StructFormat, len(serializedData) + prefixLength, opMsg.getSenderGUSID(), opMsg.getReceiverGUSID()) + serializedData
        
        try:
            sock.connect((SteerAddr,SteerPort))
        except:
            BoxAdminGlobal.Log.Error("Connect Failed", SteerAddr, SteerPort)
            sock = None
            return BoxAdminError.CONNECTION_FAILED, None

        BoxAdminGlobal.Log.Debug("Connection Established", SteerAddr, SteerPort)

        try:
            sendLength = sock.send(senddata)
            
            while sendLength < len(senddata):
                sendLength += sock.send(senddata[sendLength:])
                
            BoxAdminGlobal.Log.Debug("Send Data", SteerAddr, SteerPort, sendLength, binascii.b2a_hex(senddata))
        except:
            BoxAdminGlobal.Log.Error("Send Failed", SteerAddr, SteerPort)
            sock.close()
            return BoxAdminError.SEND_RECV_FAILED, None

        if sendLength <= 0:
            sock.close()
            return BoxAdminError.SEND_RECV_FAILED, None

        sock.close()
        return BoxAdminError.SUCCESS 
    
#===============================
class PlatformConnector:
    @staticmethod
    def SendAndRecv(msgServerID, msgID, msgBody):
        '''
        serverID, msgID??? ???????????? msgBody??? ????????????
        returnCode??? returnMsg??? ????????????.
        returnCode??? 0??? ????????? returnMsg??? None??? ????????????.
        '''
        sizeFormat = 'H'
        destFormat = 'I'
        idFormat = 'H'
        sizeSize = struct.calcsize(sizeFormat)
        destSize = struct.calcsize(destFormat)
        idSize = struct.calcsize(idFormat)
        
        msgSize = sizeSize + destSize + idSize + len(msgBody)
        
        reqMsg = struct.pack(sizeFormat, msgSize)
        reqMsg += struct.pack(destFormat, msgServerID)
        reqMsg += struct.pack(idFormat, msgID)
        reqMsg += msgBody
        
        SocketMaxLen = BoxAdminConfig.MaxLen
        SocketTimeout = BoxAdminConfig.TimeOut
        HubGWAddr = BoxAdminConfig.HubGatewayAddress
        HubGWPort = BoxAdminConfig.HubGatewayPort
        
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(SocketTimeout)
            
        try:
            sock.connect((HubGWAddr, HubGWPort))
        except:
            BoxAdminGlobal.Log.Error("Connect Failed", HubGWAddr, HubGWPort)
            sock = None
            return BoxAdminError.CONNECTION_FAILED, None

        BoxAdminGlobal.Log.Debug("Connection Established", HubGWAddr, HubGWPort)
        
        try:
            lenSendBytes = sock.send(reqMsg)
            
            while lenSendBytes < msgSize:
                lenSendBytes += sock.send(reqMsg[lenSendBytes:])
                
            BoxAdminGlobal.Log.Debug("Send Data", HubGWAddr, HubGWPort, lenSendBytes, binascii.b2a_hex(reqMsg))
        except:
            BoxAdminGlobal.Log.Error("Send Failed", HubGWAddr, HubGWPort)
            sock.close()
            return BoxAdminError.SEND_RECV_FAILED, None

        if lenSendBytes <= 0:
            sock.close()
            return BoxAdminError.SEND_RECV_FAILED, None
    
        try:
            resMsg = sock.recv(BoxAdminConfig.MaxLen)
            
            if len(resMsg) <= 0:
                sock.close()
                return BoxAdminError.SEND_RECV_FAILED, None
            else:
                # sizeSize ?????? ??????????????? ????????????.
                while True:
                    if len(resMsg) >= sizeSize:
                        break
                    else:
                        resMsg += sock.recv(SocketMaxLen)
                # sizeSize ?????? ?????? ???????????? ???????????? ?????? ????????? ???????????? ?????????.
                resMsgSize, = struct.unpack(sizeFormat, resMsg[:sizeSize])
                # ?????? ????????? ????????? ?????? ??????????????? ????????????.
                while True:
                    if len(resMsg) < resMsgSize:
                        resMsg += sock.recv(SocketMaxLen)
                    else:
                        break;
                # ????????? ?????????.
                sock.close()
        except:
            if sock is not None:
                sock.close()
            return BoxAdminError.SEND_RECV_FAILED, None
        
        opMsg = OpMsg()
        opMsg.parse(resMsg[sizeSize + idSize:]) 
        return opMsg.getResultCode(), opMsg
    
    # ?????? Platform Hub Gateway????????? ???????????? ?????? ????????? ??????.
    # ?????? ??? ?????? ????????? ?????? ?????? ?????? ????????? Send And Recv??? ????????? ?????? ??? Platform Hub Gateway??? ????????? ????????? ?????? ??????.
    @staticmethod
    def Send(msgServerID, msgID, msgBody):
        sizeFormat = 'H'
        destFormat = 'I'
        idFormat = 'H'
        sizeSize = struct.calcsize(sizeFormat)
        destSize = struct.calcsize(destFormat)
        idSize = struct.calcsize(idFormat)
        
        msgSize = sizeSize + destSize + idSize + len(msgBody)
        
        reqMsg = struct.pack(sizeFormat, msgSize)
        reqMsg += struct.pack(destFormat, msgServerID)
        reqMsg += struct.pack(idFormat, msgID)
        reqMsg += msgBody
        
        SocketTimeout = BoxAdminConfig.TimeOut
        HubGWAddr = BoxAdminConfig.HubGatewayAddress
        HubGWPort = BoxAdminConfig.HubGatewayPort
        
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(SocketTimeout)
        
        try:
            sock.connect((HubGWAddr, HubGWPort))
        except:
            BoxAdminGlobal.Log.Error("Connect Failed", HubGWAddr, HubGWPort)
            sock = None
            return BoxAdminError.CONNECTION_FAILED, None

        BoxAdminGlobal.Log.Debug("Connection Established", HubGWAddr, HubGWPort)
        
        try:
            lenSendBytes = sock.send(reqMsg)

            while lenSendBytes < msgSize:
                lenSendBytes += sock.send(reqMsg[lenSendBytes:])
                
            BoxAdminGlobal.Log.Debug("Send Data", HubGWAddr, HubGWPort, lenSendBytes, binascii.b2a_hex(reqMsg))
        except:
            BoxAdminGlobal.Log.Error("Send Failed", HubGWAddr, HubGWPort)
            sock.close()
            return BoxAdminError.SEND_RECV_FAILED, None

        if lenSendBytes <= 0:
            sock.close()
            return BoxAdminError.SEND_RECV_FAILED, None
        
        sock.close()
        return BoxAdminError.SUCCESS