#!/bin/bash

# start rsyslog
echo 'Starting rsyslog'
# remove lingering pid file
rm -f /run/rsyslogd.pid
# start service
service rsyslog start

# start weewx
echo 'Starting weewx reports (without forecast)'
sed -i -z -e "s|debug = 0|debug = 1|g" "${WEEWX_HOME}"/weewx.conf

# shellcheck source=/dev/null
. "${WEEWX_HOME}/weewx-venv/bin/activate"
weectl extension uninstall -y --config "${WEEWX_HOME}/weewx.conf" forecast

weectl report run --config "${WEEWX_HOME}/weewx.conf"
cat /var/log/syslog | grep weewx