#!/bin/bash

# start rsyslog
echo 'Starting rsyslog'
# remove lingering pid file
rm -f /run/rsyslogd.pid
# start service
service rsyslog start

# start weewx
echo 'Starting weewx reports (weewx-DWD)'

mv "${WEEWX_HOME}"/skins/weewx-wdc/skin-dwd.conf "${WEEWX_HOME}"/skins/weewx-wdc/skin.conf
cat "${WEEWX_HOME}"/skins/weewx-wdc/weewx-dwd.conf >> "${WEEWX_HOME}"/weewx.conf
sed -i -z -e "s|lang = en|lang = de|g" "${WEEWX_HOME}"/weewx.conf

# @see https://github.com/roe-dl/weewx-DWD#wettervorhersage-als-diagramm
sed -i '/schema = schemas.wview_extended.schema/a \[\[dwd_binding\]\]\n        database = dwd_sqlite\n        table_name = forecast\n        manager = weewx.manager.Manager\n        schema = schemas.dwd.schema\n' "${WEEWX_HOME}"/weewx.conf >/dev/null
sed -i '/A SQLite database is simply a single file/a \[\[dwd_sqlite\]\]\n        database_name = dwd-forecast-O461.sdb\n        database_type = SQLite\n' "${WEEWX_HOME}"/weewx.conf >/dev/null
cat /tmp/dwd-extensions.py >> "${WEEWX_HOME}"/bin/user/extensions.py

# weewx-DWD installieren.
cd /tmp && wget -nv -O "weewx-dwd.zip" "https://github.com/roe-dl/weewx-DWD/archive/refs/heads/master.zip"
unzip /tmp/weewx-dwd.zip -d /tmp/weewx-dwd/
cp -R /tmp/weewx-dwd/weewx-DWD-master/usr/ /
sed -i -z -e "s|PTH=\"/etc/weewx/skins/Belchertown/dwd\"|PTH=\"/home/weewx/skins/weewx-wdc/dwd\"|g" /usr/local/bin/wget-dwd
sed -i -z -e "s|config = configobj.ConfigObj(\"/etc/weewx/weewx.conf\")|config = configobj.ConfigObj(\"/home/weewx/weewx.conf\")|g" /usr/local/bin/dwd-warnings
mkdir /home/weewx/skins/weewx-wdc/dwd

# Icons herunterladen.
cd /tmp && wget -nv -O "icons-dwd.zip" "https://www.dwd.de/DE/wetter/warnungen_aktuell/objekt_einbindung/icons/wettericons_zip.zip?__blob=publicationFile&v=3"
cd /tmp && wget -nv -O "warnicons-dwd.zip" "https://www.dwd.de/DE/wetter/warnungen_aktuell/objekt_einbindung/icons/warnicons_nach_stufen_50x50_zip.zip?__blob=publicationFile&v=2"
mkdir -p /home/weewx/public_html/dwd/icons && mkdir -p /home/weewx/public_html/dwd/warn_icons
unzip /tmp/icons-dwd.zip -d /home/weewx/public_html/dwd/icons
unzip /tmp/warnicons-dwd.zip -d /home/weewx/public_html/dwd/warn_icons

# weewx-DWD ausführen.
/usr/local/bin/wget-dwd
/usr/local/bin/dwd-warnings
/usr/local/bin/dwd-cap-warnings --config=/home/weewx/weewx.conf --resolution=city
/usr/local/bin/dwd-mosmix --config=/home/weewx/weewx.conf --daily --hourly --json --database O461

ls -la /home/weewx/skins/weewx-wdc/dwd
ls -la /home/weewx/public_html

"${WEEWX_HOME}"/bin/wee_reports
ls -la /home/weewx/public_html
cat /var/log/syslog | grep weewx