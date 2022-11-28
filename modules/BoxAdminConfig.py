#!/usr/bin/env python
# -*- coding: utf8 -*-
from pyCruise.Log import CruiseLog
from pyCruise.Config import CruiseINIReader
import BoxAdminGlobal
import BoxAdminConfig

#===============================
#
# Configuration for Box system
#
#===============================

import os
import ConfigParser

BoxAPI_GUSID = (16 << 24) + 1       # anycast
SteerSesion_GUSID = (10 << 24) + 0  # anycast
SteerMind_GUSID = (4 << 24) + 0     # anycast

# Net
HubGatewayAddress = '127.0.0.1'
HubGatewayPort = 8088
SteerGatewayAddress = '127.0.0.1'
SteerGatewayPort = 8109
MaxLen = 65535
TimeOut = 5
NationCode = 'ko'

# Log
LOG_LEVEL = 'debug'
LOG_PATH = 'Put Default Log path and filename here...'

#===============================
class BoxAdminConfigReader:
    @staticmethod
    def Initialize():
        configReader = CruiseINIReader(os.path.join(os.path.dirname(__file__), '../boxadminweb.ini'))
        BoxAdminConfig.LOG_LEVEL = configReader.GetString('BoxAdminWeb', 'log_level', 'debug')
        BoxAdminConfig.LOG_PATH = configReader.GetString('BoxAdminWeb', 'log_path_file')
        BoxAdminConfig.HubGatewayAddress = configReader.GetString('BoxAdminWeb', 'hub_gateway_address', '127.0.0.1')
        BoxAdminConfig.HubGatewayPort = configReader.GetInt('BoxAdminWeb', 'hub_gateway_port', 8088)
        BoxAdminConfig.SteerGatewayAddress = configReader.GetString('BoxAdminWeb', 'steer_gateway_address', '127.0.0.1')
        BoxAdminConfig.SteerGatewayPort = configReader.GetInt('BoxAdminWeb', 'steer_gateway_port', 8109)
        BoxAdminConfig.MaxLen = configReader.GetInt('BoxAdminWeb', 'max_packet_length', 65535)
        BoxAdminConfig.TimeOut = configReader.GetInt('BoxAdminWeb', 'socket_timeout', 5)
        BoxAdminConfig.NationCode = configReader.GetString('BoxAdminWeb', 'nation_code', 'ko')

        BoxAdminGlobal.Log = CruiseLog(BoxAdminConfig.LOG_LEVEL, BoxAdminConfig.LOG_PATH)
