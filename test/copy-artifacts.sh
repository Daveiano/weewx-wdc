#! /bin/sh

DIR=$(dirname -- "$( readlink -f -- "$0"; )");

rm -rf "$DIR"/e2e-tests/artifacts*
cp -R "$DIR"/test_install_report/artifacts-alternative-weewx-html "$DIR"/e2e-tests/artifacts-alternative-weewx-html
cp -R "$DIR"/test_install_report/artifacts-classic-weewx-html "$DIR"/e2e-tests/artifacts-classic-weewx-html
cp -R "$DIR"/test_install_report/artifacts-forecast-weewx-html "$DIR"/e2e-tests/artifacts-forecast-weewx-html
cp -R "$DIR"/test_install_report/artifacts-custom-weewx-html "$DIR"/e2e-tests/artifacts-custom-weewx-html
cp -R "$DIR"/test_install_report/artifacts-dwd-weewx-html "$DIR"/e2e-tests/artifacts-dwd-weewx-html