#!/bin/bash

# start rsyslog
echo 'Starting rsyslog'
# remove lingering pid file
rm -f /run/rsyslogd.pid
# start service
service rsyslog start

# start weewx
echo 'Starting weewx reports'
"${WEEWX_HOME}"/bin/wee_reports
cat /var/log/syslog | grep weewx