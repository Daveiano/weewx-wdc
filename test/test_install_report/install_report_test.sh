#! /bin/sh
# file: test/test_install_report/install_report_test.sh

DIR=$(dirname -- "$( readlink -f -- "$0"; )");

oneTimeSetUp() {
    if ! [ -d "$DIR"/shunitexit ] ; then
        mkdir "$DIR"/shunitexit
    fi
    if ! [ -d "$DIR"/artifacts ] ; then
        echo Creating artifacts directory...
        sleep 2
        mkdir "$DIR"/artifacts
    fi
    if ! [ -d "$DIR"/artifacts-alternative-weewx-html ] ; then
        echo Creating artifacts-alternative-weewx-html directory...
        sleep 1
        mkdir "$DIR"/artifacts-alternative-weewx-html
    fi
    if ! [ -d "$DIR"/artifacts-classic-weewx-html ] ; then
        echo Creating artifacts-classic-weewx-html directory...
        sleep 1
        mkdir "$DIR"/artifacts-classic-weewx-html
    fi
    if ! [ -d "$DIR"/artifacts-forecast-weewx-html ] ; then
        echo Creating artifacts-forecast-weewx-html directory...
        sleep 1
        mkdir "$DIR"/artifacts-forecast-weewx-html
    fi
    if ! [ -d "$DIR"/artifacts-custom-weewx-html ] ; then
        echo Creating artifacts-custom-weewx-html directory...
        sleep 1
        mkdir "$DIR"/artifacts-custom-weewx-html
    fi
    if ! [ -d "$DIR"/artifacts-dwd-weewx-html ] ; then
        echo Creating artifacts-dwd-weewx-html directory...
        sleep 1
        mkdir "$DIR"/artifacts-dwd-weewx-html
    fi
    if ! [ -d "$DIR"/artifacts-custom-binding-weewx-html ] ; then
        echo Creating artifacts-custom-binding-weewx-html directory...
        sleep 1
        mkdir "$DIR"/artifacts-custom-binding-weewx-html
    fi
    if ! [ -d "$DIR"/artifacts-mqtt-weewx-html ] ; then
        echo Creating artifacts-mqtt-weewx-html directory...
        sleep 1
        mkdir "$DIR"/artifacts-mqtt-weewx-html
    fi
    if ! [ -d "$DIR"/artifacts-sensor-status-weewx-html ] ; then
        echo Creating artifacts-sensor-status-weewx-html directory...
        sleep 1
        mkdir "$DIR"/artifacts-sensor-status-weewx-html
    fi
    if ! [ -d "$DIR"/artifacts-cmon-weewx-html ] ; then
        echo Creating artifacts-cmon-weewx-html directory...
        sleep 1
        mkdir "$DIR"/artifacts-cmon-weewx-html
    fi
}

testBundling() {
    yarn run build > "$DIR"/artifacts/testBundling.txt 2>&1

    output=$(cat "$DIR"/artifacts/testBundling.txt)

    assertContains "$output" "main.js"
    assertContains "$output" "main.css"
    assertContains "$output" "service-worker.js"
    assertContains "$output" "compiled with"
    assertNotContains "$output" "fail"
    assertNotContains "$output" "error"
}

testInstall() {
    zip -qr "$DIR"/src/weewx-wdc.zip "./" -x "*__pycache__*" -x "*.idea*" -x "*.venv*" -x "*.git*" -x "*node_modules*" -x "*.vscode*" -x "*.parcel-cache*" -x "*.yarn*" -x ".eslintrc.json" -x ".prettierignore" -x ".prettierrc.json" -x "package.json" -x "tsconfig.json" -x "yarn.lock" -x ".yarnrc" -x "*test*" -x "*skins/weewx-wdc/src*"
    cd "$DIR" || exit

    docker build . -t "weewx" --no-cache > "$DIR"/artifacts/testInstall.txt 2>&1

    output=$(cat "$DIR"/artifacts/testInstall.txt)
    line1=$(sed '1q;d' "$DIR"/artifacts/testInstall.txt)
    lineLast=$(tail -n 1 "$DIR"/artifacts/testInstall.txt)

    assertContains "$output" "Request to install '/tmp/weewx-wdc/'"
    assertContains "$output" "Finished installing extension '/tmp/weewx-wdc/'"
}

testWeeReportRunAlternative() {
    docker run --name weewx weewx > "$DIR"/artifacts/testWeeReportRunAlternative.txt 2>&1
    docker cp weewx:/home/weewx/public_html/ "$DIR"/artifacts-alternative-weewx-html > "$DIR"/artifacts/docker.txt 2>&1
    docker rm weewx > "$DIR"/artifacts/docker.txt 2>&1

    output=$(cat "$DIR"/artifacts/testWeeReportRunAlternative.txt)

    assertContains "$output" "Starting weewx reports (alternative layout)"
    assertContains "$output" "Using configuration file /home/weewx/weewx.conf"
    assertContains "$output" "Generating as of last timestamp in the database."
    assertContains "$output" "INFO weewx.cheetahgenerator: Generated 32 files for report WdcReport in"
    assertContains "$output" "INFO weewx.reportengine: Copied 17 files to /home/weewx/public_html"

    assertNotContains "$output" "failed with exception"
    assertNotContains "$output" "Ignoring template"
    assertNotContains "$output" "Caught unrecoverable exception"
}

testWeeReportRunClassic() {
    docker run --entrypoint "/start-classic.sh" --name weewx weewx > "$DIR"/artifacts/testWeeReportRunClassic.txt 2>&1
    docker cp weewx:/home/weewx/public_html/ "$DIR"/artifacts-classic-weewx-html > "$DIR"/artifacts/docker.txt 2>&1
    docker rm weewx > "$DIR"/artifacts/docker.txt 2>&1

    output=$(cat "$DIR"/artifacts/testWeeReportRunClassic.txt)

    assertContains "$output" "Starting weewx reports (classic layout)"
    assertContains "$output" "Using configuration file /home/weewx/weewx.conf"
    assertContains "$output" "Generating as of last timestamp in the database."
    assertContains "$output" "INFO weewx.cheetahgenerator: Generated 32 files for report WdcReport in"
    assertContains "$output" "INFO weewx.reportengine: Copied 17 files to /home/weewx/public_html"

    assertNotContains "$output" "failed with exception"
    assertNotContains "$output" "Ignoring template"
    assertNotContains "$output" "Caught unrecoverable exception"
}

testWeeReportRunForecast() {
    current_date=$(date +%Y-%m-%d\ %H:%M:%S)
    docker run --env CURRENT_DATE="$current_date" --env FAKETIME_DONT_RESET=1 --env LD_PRELOAD="/usr/local/lib/faketime/libfaketime.so.1" --env FAKETIME="@2022-06-23 07:54:50" --entrypoint "/start-forecast.sh" --name weewx weewx > "$DIR"/artifacts/testWeeReportRunForecast.txt 2>&1
    docker cp weewx:/home/weewx/public_html/ "$DIR"/artifacts-forecast-weewx-html > "$DIR"/artifacts/docker.txt 2>&1
    docker rm weewx > "$DIR"/artifacts/docker.txt 2>&1

    output=$(cat "$DIR"/artifacts/testWeeReportRunForecast.txt)

    assertContains "$output" "Starting weewx reports (Alternative layout with forecast)"
    assertContains "$output" "Using configuration file /home/weewx/weewx.conf"
    assertContains "$output" "INFO weewx.cheetahgenerator: Generated 32 files for report WdcReport in"
    assertContains "$output" "INFO weewx.reportengine: Copied 9 files to /home/weewx/public_html"
    assertContains "$output" "ZambrettiThread: Zambretti: generated 1 forecast record"

    assertNotContains "$output" "failed with exception"
    assertNotContains "$output" "Ignoring template"
    assertNotContains "$output" "Caught unrecoverable exception"
}

testWeeReportRunCustom() {
    docker run --entrypoint "/start-custom.sh" --name weewx weewx > "$DIR"/artifacts/testWeeReportRunCustom.txt 2>&1
    docker cp weewx:/home/weewx/public_html/ "$DIR"/artifacts-custom-weewx-html > "$DIR"/artifacts/docker.txt 2>&1
    docker rm weewx > "$DIR"/artifacts/docker.txt 2>&1

    output=$(cat "$DIR"/artifacts/testWeeReportRunCustom.txt)

    assertContains "$output" "Starting weewx reports (Alternative layout with customisations)"
    assertContains "$output" "Using configuration file /home/weewx/weewx.conf"
    assertContains "$output" "Generating as of last timestamp in the database."
    assertContains "$output" "INFO weewx.cheetahgenerator: Generated 284 files for report WdcReport in"
    assertContains "$output" "INFO weewx.reportengine: Copied 17 files to /home/weewx/public_html"

    assertNotContains "$output" "failed with exception"
    assertNotContains "$output" "Ignoring template"
    assertNotContains "$output" "Caught unrecoverable exception"
}

testWeeReportRunDWD() {
    docker run --entrypoint "/start-dwd.sh" --name weewx weewx > "$DIR"/artifacts/testWeeReportRunDWD.txt 2>&1
    docker cp weewx:/home/weewx/public_html/ "$DIR"/artifacts-dwd-weewx-html > "$DIR"/artifacts/docker.txt 2>&1
    docker rm weewx > "$DIR"/artifacts/docker.txt 2>&1

    output=$(cat "$DIR"/artifacts/testWeeReportRunDWD.txt)

    assertContains "$output" "Starting weewx reports (weewx-DWD)"
    assertContains "$output" "Using configuration file /home/weewx/weewx.conf"
    assertContains "$output" "Generating as of last timestamp in the database."
    assertContains "$output" "INFO weewx.cheetahgenerator: Generated 31 files for report WdcReport in"
    assertContains "$output" "INFO weewx.reportengine: Copied 20 files to /home/weewx/public_html"

    assertNotContains "$output" "failed with exception"
    assertNotContains "$output" "Ignoring template"
    assertNotContains "$output" "Caught unrecoverable exception"
}

testWeeReportRunCustomBinding() {
    docker run --entrypoint "/start-custom-binding.sh" --name weewx weewx > "$DIR"/artifacts/testWeeReportRunCustomBinding.txt 2>&1
    docker cp weewx:/home/weewx/public_html/ "$DIR"/artifacts-custom-binding-weewx-html > "$DIR"/artifacts/docker.txt 2>&1
    docker rm weewx > "$DIR"/artifacts/docker.txt 2>&1

    output=$(cat "$DIR"/artifacts/testWeeReportRunCustomBinding.txt)

    assertContains "$output" "Starting weewx reports (Alternative layout with custom binding)"
    assertContains "$output" "Using configuration file /home/weewx/weewx.conf"
    assertContains "$output" "INFO weewx.cheetahgenerator: Generated 31 files for report WdcReport in"
    assertContains "$output" "INFO weewx.reportengine: Copied 17 files to /home/weewx/public_html"

    assertNotContains "$output" "failed with exception"
    assertNotContains "$output" "Ignoring template"
    assertNotContains "$output" "Caught unrecoverable exception"
}

testWeeReportRunWithoutWeewxForecast() {
    docker run --entrypoint "/start-without-forecast.sh" --name weewx weewx > "$DIR"/artifacts/testWeeReportRunWithoutWeewxForecast.txt 2>&1
    docker rm weewx > "$DIR"/artifacts/docker.txt 2>&1

    output=$(cat "$DIR"/artifacts/testWeeReportRunWithoutWeewxForecast.txt)

    assertContains "$output" "Starting weewx reports (without forecast)"
    assertContains "$output" "Using configuration file /home/weewx/weewx.conf"
    assertContains "$output" "Generating as of last timestamp in the database."
    assertContains "$output" "INFO weewx.cheetahgenerator: Generated 32 files for report WdcReport in"
    assertContains "$output" "INFO weewx.reportengine: Copied 17 files to /home/weewx/public_html"
    assertContains "$output" "DEBUG user.weewx_wdc: weewx-forecast extension is not installed. Not providing any forecast data."

    assertNotContains "$output" "failed with exception"
    assertNotContains "$output" "Ignoring template"
    assertNotContains "$output" "Caught unrecoverable exception"
}

testWeeReportRunMqtt() {
    docker run --entrypoint "/start-mqtt.sh" --name weewx weewx > "$DIR"/artifacts/testWeeReportRunMqtt.txt 2>&1
    docker cp weewx:/home/weewx/public_html/ "$DIR"/artifacts-mqtt-weewx-html > "$DIR"/artifacts/docker.txt 2>&1
    docker rm weewx > "$DIR"/artifacts/docker.txt 2>&1

    output=$(cat "$DIR"/artifacts/testWeeReportRunMqtt.txt)

    assertContains "$output" "Starting weewx reports (mqtt)"
    assertContains "$output" "Using configuration file /home/weewx/weewx.conf"
    assertContains "$output" "Generating as of last timestamp in the database."
    assertContains "$output" "INFO weewx.cheetahgenerator: Generated 32 files for report WdcReport in"
    assertContains "$output" "INFO weewx.reportengine: Copied 18 files to /home/weewx/public_html"

    assertNotContains "$output" "failed with exception"
    assertNotContains "$output" "Ignoring template"
    assertNotContains "$output" "Caught unrecoverable exception"
}

testWeeReportRunSensorStatus() {
    docker run --entrypoint "/start-sensor.sh" --name weewx weewx > "$DIR"/artifacts/testWeeReportRunSensorStatus.txt 2>&1
    docker cp weewx:/home/weewx/public_html/ "$DIR"/artifacts-sensor-status-weewx-html > "$DIR"/artifacts/docker.txt 2>&1
    docker rm weewx > "$DIR"/artifacts/docker.txt 2>&1

    output=$(cat "$DIR"/artifacts/testWeeReportRunSensorStatus.txt)

    assertContains "$output" "Starting weewx reports (sensor status)"
    assertContains "$output" "Using configuration file /home/weewx/weewx.conf"
    assertContains "$output" "Generating as of last timestamp in the database."
    assertContains "$output" "INFO weewx.cheetahgenerator: Generated 18 files for report WdcReport in"
    assertContains "$output" "INFO weewx.reportengine: Copied 18 files to /home/weewx/public_html"

    assertNotContains "$output" "failed with exception"
    assertNotContains "$output" "Ignoring template"
    assertNotContains "$output" "Caught unrecoverable exception"
}

testWeeReportRunCMNON() {
    docker run --entrypoint "/start-cmon.sh" --name weewx weewx > "$DIR"/artifacts/testWeeReportRunCMON.txt 2>&1
    docker cp weewx:/home/weewx/public_html/ "$DIR"/artifacts-cmon-weewx-html > "$DIR"/artifacts/docker.txt 2>&1

    output=$(cat "$DIR"/artifacts/testWeeReportRunCMON.txt)

    assertContains "$output" "Starting weewx reports (CMON)"
    assertContains "$output" "Using configuration file /home/weewx/weewx.conf"
    assertContains "$output" "Generating as of last timestamp in the database."
    assertContains "$output" "INFO weewx.cheetahgenerator: Generated 15 files for report WdcReport in"
    assertContains "$output" "INFO weewx.reportengine: Copied 18 files to /home/weewx/public_html"

    assertNotContains "$output" "failed with exception"
    assertNotContains "$output" "Ignoring template"
    assertNotContains "$output" "Caught unrecoverable exception"
}

oneTimeTearDown() {
    if [ -d "$DIR"/shunitexit ] ; then
      rm -rf "$DIR"/shunitexit
      docker rm weewx > "$DIR"/artifacts/docker.txt 2>&1
    fi
}

# Load and run shUnit2.
#. shunit2
. "$DIR"/../shunit2/shunit2