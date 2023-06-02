#!/bin/bash

# start rsyslog
echo 'Starting rsyslog'
# remove lingering pid file
rm -f /run/rsyslogd.pid
# start service
service rsyslog start

mv "${WEEWX_HOME}"/archive/weewx-cmon.sdb "${WEEWX_HOME}"/archive/weewx.sdb
mv "${WEEWX_HOME}"/skins/weewx-wdc/skin-cmon.conf "${WEEWX_HOME}"/skins/weewx-wdc/skin.conf
cat /tmp/cmon-extensions.py >> "${WEEWX_HOME}"/bin/user/extensions.py

# start weewx
echo 'Starting weewx reports (CMON)'
"${WEEWX_HOME}"/bin/wee_reports
cat /var/log/syslog | grep weewx