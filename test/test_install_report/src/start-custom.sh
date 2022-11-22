#!/bin/bash

# start rsyslog
echo 'Starting rsyslog'
# remove lingering pid file
rm -f /run/rsyslogd.pid
# start service
service rsyslog start

mv "${WEEWX_HOME}"/skins/weewx-wdc/skin-custom.conf "${WEEWX_HOME}"/skins/weewx-wdc/skin.conf

# start weewx
echo 'Starting weewx reports (Alternative layout with customisations)'
"${WEEWX_HOME}"/bin/wee_reports

cat /var/log/syslog | grep weewx