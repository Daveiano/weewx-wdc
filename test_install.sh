#!/bin/bash

/usr/share/weewx/wee_extension --uninstall=weewx-wdc
/usr/share/weewx/wee_extension --install=.
/usr/share/weewx/wee_reports