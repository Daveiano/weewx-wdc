#! /bin/sh
# file: test/test_install_report/install_report_test.sh

DIR=$(dirname -- "$( readlink -f -- "$0"; )");

oneTimeSetUp() {
    if ! [ -d "$DIR"/artifacts ] ; then
        echo Creating artifacts directory...
        sleep 2
        mkdir "$DIR"/artifacts
    fi
}

testBundling() {
    ./node_modules/.bin/parcel build --no-scope-hoist --no-cache > "$DIR"/artifacts/testBundling.txt 2>&1

    output=$(cat "$DIR"/artifacts/testBundling.txt)
    line1=$(sed '1q;d' "$DIR"/artifacts/testBundling.txt)

    assertEquals "Building..." "$line1"
    assertContains "$output" "Bundling..."
    assertContains "$output" "Packaging & Optimizing..."
    assertContains "$output" "✨ Built in"
}

testInstall() {
    zip -qr "$DIR"/src/weewx-wdc.zip "./" -x "*__pycache__*" -x "*.idea*" -x "*.venv*" -x "*.git*" -x "*node_modules*" -x "*.vscode*" -x "*.parcel-cache*" -x "*.yarn*" -x ".eslintrc.json" -x ".prettierignore" -x ".prettierrc.json" -x "package.json" -x "tsconfig.json" -x "yarn.lock" -x ".yarnrc" -x "*test*" -x "*skins/weewx-wdc/src*"
    cd "$DIR" || exit

    docker build . -t "weewx" --no-cache > "$DIR"/artifacts/testInstall.txt 2>&1

    output=$(cat "$DIR"/artifacts/testInstall.txt)
    line1=$(sed '1q;d' "$DIR"/artifacts/testInstall.txt)
    lineLast=$(tail -n 1 "$DIR"/artifacts/testInstall.txt)

    assertContains "$line1" "Sending build context to Docker daemon"
    assertContains "$output" "Request to install '/tmp/weewx-wdc/'"
    assertContains "$output" "Finished installing extension '/tmp/weewx-wdc/'"
    assertEquals "Successfully tagged weewx:latest" "$lineLast"
}

testWeeReportRun() {
    docker run --name weewx weewx > "$DIR"/artifacts/testWeeReportRun.txt 2>&1
    docker stop weewx >> "$DIR"/artifacts/testWeeReportRun.txt 2>&1
    docker rm weewx >> "$DIR"/artifacts/testWeeReportRun.txt 2>&1

    output=$(cat "$DIR"/artifacts/testWeeReportRun.txt)

    assertContains "$output" "Starting weewx reports"
    assertContains "$output" "Using configuration file /home/weewx/weewx.conf"
    assertContains "$output" "Generating for all time"
    assertContains "$output" "INFO weewx.cheetahgenerator: Generated 43 files for report WdcReport in"
    assertContains "$output" "INFO weewx.reportengine: Copied 9 files to /home/weewx/public_html"

    assertNotContains "$output" "failed with exception"
    assertNotContains "$output" "Ignoring template"
}

#oneTimeTearDown() {
#    rm -rf "$DIR"/artifacts
#}

# Load and run shUnit2.
#. shunit2
. "$DIR"/../shunit2/shunit2