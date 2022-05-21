#!/bin/bash

yarn run build
/usr/share/weewx/wee_extension --uninstall=weewx-wdc
/usr/share/weewx/wee_extension --install=.