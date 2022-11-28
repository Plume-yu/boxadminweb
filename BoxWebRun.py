#!/usr/bin/env python
# -*- coding: utf8 -*-
'''
Created on 2010. 10. 12.

@author: lunacalos
'''

import cherrypy
import os.path
import sys

LOCAL_PATH = os.path.dirname(os.path.abspath(__file__))

sys.path.append(os.path.join(LOCAL_PATH, 'modules') )
from BoxAdminController import BoxAdmin
from pyCruise.Config import OpConfigParser

configfilename=os.path.join(LOCAL_PATH, 'boxadminweb.ini')
iniparser = OpConfigParser()
configdict = iniparser.dict_from_file(configfilename)

configdict['/']['tools.staticdir.root'] = LOCAL_PATH
configdict['/']['tools.sessions.timeout'] = int(configdict['/']['tools.sessions.timeout'])
configdict['global']['server.socket_port'] = int(configdict['global']['server.socket_port'])

if __name__ == '__main__':
    cherrypy.quickstart(BoxAdmin(LOCAL_PATH), config=configdict)
