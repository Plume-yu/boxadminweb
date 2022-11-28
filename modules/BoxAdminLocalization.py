# -*- coding: utf8 -*-

#===============================
#
# L10N stuff for Box system
#
#===============================
import xml.dom.minidom
import os.path
import BoxAdminGlobal
import traceback
from BoxVersion import Version

#===============================
class BoxL10N:
    @staticmethod
    def GetTextResource(nationCode):
        relativePath = '/../static/l10n/'
        fileName = 'box_l10n.xml'
        fullName = relativePath + fileName.replace('.xml', '.' + nationCode + '.xml')
        
        BoxAdminGlobal.Log.Debug('GetTextResource Request', fullName)
        
        try:
            doc = xml.dom.minidom.parse(os.path.join(os.path.dirname(__file__) + fullName))
            node = doc.getElementsByTagName("Message")
            
            returnData = dict()
            for eachNode in node:
                key = eachNode.getAttribute('key')
                value = eachNode.getAttribute('value')
                returnData[key] = value
            
            #Add Version Info
            returnData["version"] = Version.VERSION_NUMBER
            return returnData
        except:
            traceMsg = traceback.format_exc()
            BoxAdminGlobal.Log.Error('GetTextResource Request', fullName, traceMsg)
            return None

if __name__ == '__main__':
    print BoxL10N.GetTextResource('ko')