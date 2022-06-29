#!/bin/bash

DIR=$(dirname -- "$( readlink -f -- "$0"; )");

echo "$DIR"
sleep 2

echo "Building and bundling skin..."
sleep 2
yarn run build
zip -r ./test/test_install_report/src/weewx-wdc.zip ./ -x "*__pycache__*" -x "*.idea*" -x "*.venv*" -x "*.git*" -x "*node_modules*" -x "*.vscode*" -x "*.parcel-cache*" -x "*.yarn*" -x ".eslintrc.json" -x ".prettierignore" -x ".prettierrc.json" -x "package.json" -x "tsconfig.json" -x "yarn.lock" -x ".yarnrc" -x "*test*" -x "*skins/weewx-wdc/src*"

cd $DIR || exit
docker build . -t "weewx"
docker run --name weewx weewx
sleep 2
docker stop weewx
docker rm weewx

#/usr/share/weewx/wee_extension --uninstall=weewx-wdc
#/usr/share/weewx/wee_extension --install=.
#/usr/share/weewx/wee_reports