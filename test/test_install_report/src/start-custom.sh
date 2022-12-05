#!/bin/bash

# start rsyslog
echo 'Starting rsyslog'
# remove lingering pid file
rm -f /run/rsyslogd.pid
# start service
service rsyslog start

mv "${WEEWX_HOME}"/skins/weewx-wdc/skin-custom.conf "${WEEWX_HOME}"/skins/weewx-wdc/skin.conf

# Icons herunterladen.
cd /tmp && wget -nv -O "icons-dwd.zip" "https://www.dwd.de/DE/wetter/warnungen_aktuell/objekt_einbindung/icons/wettericons_zip.zip?__blob=publicationFile&v=3"
mkdir -p /home/weewx/public_html/dwd/icons
unzip /tmp/icons-dwd.zip -d /home/weewx/public_html/dwd/icons

# start weewx
echo 'Starting weewx reports (Alternative layout with customisations)'
"${WEEWX_HOME}"/bin/wee_reports

cat /var/log/syslog | grep weewx