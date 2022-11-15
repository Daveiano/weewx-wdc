#!/bin/bash

# start rsyslog
echo 'Starting rsyslog'
# remove lingering pid file
rm -f /run/rsyslogd.pid
# start service
service rsyslog start

# start weewx
echo 'Starting weewx reports (Alternative layout with customisations)'

# TODO: Remove API key.
sed -i -z -e "s|debug = 0|debug = 1|g" "${WEEWX_HOME}"/weewx.conf
sed -i -z -e 's/skin = forecast\n        enable = false/skin = forecast\n        enable = true/g' weewx.conf
sed -i -z -e "s|INSERT_WU_API_KEY_HERE|SECRET_WU|g" "${WEEWX_HOME}"/weewx.conf
sed -i -z -e "s|station_type = Interceptor|station_type = Simulator|g" "${WEEWX_HOME}"/weewx.conf
#sed -i -z -e "s|#start = 2011-01-01T00:00|start = 2022-01-01T00:00|g" "${WEEWX_HOME}"/weewx.conf
mv "${WEEWX_HOME}"/skins/weewx-wdc/skin-custom.conf "${WEEWX_HOME}"/skins/weewx-wdc/skin.conf

cat "${WEEWX_HOME}"/weewx.conf

echo "Starting weewx"
"${WEEWX_HOME}"/bin/weewxd "${WEEWX_HOME}"/weewx.conf --daemon

echo "$CURRENT_DATE"
echo "Sleeping 200 seconds..."
sleep 200

#printf -v DATE_NOW '%(%Y-%m-%d %H:%M:%S)T\n' -1

echo "Starting wee_reports..."
FAKETIME="@$CURRENT_DATE" date
FAKETIME="@$CURRENT_DATE" "${WEEWX_HOME}"/bin/wee_reports

echo "Starting wee_reports..."
FAKETIME="@$CURRENT_DATE" date
FAKETIME="@$CURRENT_DATE" "${WEEWX_HOME}"/bin/wee_reports

cp "${WEEWX_HOME}"/archive/forecast.sdb "${WEEWX_HOME}"/public_html/forecast.sdb
cat /var/log/syslog | grep weewx