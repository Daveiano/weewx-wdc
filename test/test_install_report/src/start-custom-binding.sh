#!/bin/bash

# start rsyslog
echo 'Starting rsyslog'
# remove lingering pid file
rm -f /run/rsyslogd.pid
# start service
service rsyslog start

# start weewx
echo 'Starting weewx reports (Alternative layout with custom binding)'

mv /weewx-custom-binding.conf "${WEEWX_HOME}"/weewx.conf
sed -i -z -e "s|debug = 0|debug = 1|g" "${WEEWX_HOME}"/weewx.conf
mv "${WEEWX_HOME}"/skins/weewx-wdc/skin-custom-binding.conf "${WEEWX_HOME}"/skins/weewx-wdc/skin.conf
#cat "${WEEWX_HOME}"/weewx.conf

ls -la "${WEEWX_HOME}"/archive

date

# shellcheck source=/dev/null
. "${WEEWX_HOME}/weewx-venv/bin/activate" && weectl report run --config "${WEEWX_HOME}/weewx.conf"

cat /var/log/syslog | grep weewx