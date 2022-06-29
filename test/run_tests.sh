#! /bin/sh

DIR=$(dirname -- "$( readlink -f -- "$0"; )");

# Setup shunit2
if ! [ -d "$DIR"/shunit2 ] ; then
    echo Cloning shunit2...
    sleep 2
    git clone https://github.com/kward/shunit2.git "$DIR"/shunit2
fi

# Run tests
echo Running tests...
sleep 2

"$DIR"/test_install_report/install_report_test.sh