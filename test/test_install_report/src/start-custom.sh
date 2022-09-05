#!/bin/bash

# start rsyslog
echo 'Starting rsyslog'
# remove lingering pid file
rm -f /run/rsyslogd.pid
# start service
service rsyslog start

# start weewx
echo 'Starting weewx reports (Alternative layout with customisations)'

sed -i -z -e "s/show_min_max_time_day = False/show_min_max_time_day = True/g" "${WEEWX_HOME}"/skins/weewx-wdc/skin.conf
sed -i -z -e "s/windRose_show_beaufort = True/windRose_show_beaufort = False/g" "${WEEWX_HOME}"/skins/weewx-wdc/skin.conf

"${WEEWX_HOME}"/bin/wee_reports
cat /var/log/syslog | grep weewx