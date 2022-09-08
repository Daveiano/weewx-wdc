#!/bin/bash

# start rsyslog
echo 'Starting rsyslog'
# remove lingering pid file
rm -f /run/rsyslogd.pid
# start service
service rsyslog start

# start weewx
echo 'Starting weewx reports (classic layout)'

sed -i -z -e "s/layout = 'alternative'/layout = 'classic'/g" "${WEEWX_HOME}"/skins/weewx-wdc/skin.conf
sed -i -z -e "s/show_min_max_time_week = False/show_min_max_time_week = True/g" "${WEEWX_HOME}"/skins/weewx-wdc/skin.conf

"${WEEWX_HOME}"/bin/wee_reports
cat /var/log/syslog | grep weewx