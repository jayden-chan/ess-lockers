#!/bin/zsh

if [ $1 = "--dry-run" ]; then
else
    echo
    echo "=================="
    echo "     WAIT!!!      "
    echo "=================="
    echo
    echo "Did you remember to delete the existing build files on the ESS server?"
    echo "(the files are ~/www/ess.uvic.ca/ess-lockers/client/build)"
    echo "(delete the whole folder)"
    echo
    echo "Did you remember to set the lockers API key in the admin file?"
    echo

    echo -n "Continue? [Y/n] "
    read answer

    if [ "$answer" != "${answer#[Yy]}" ]; then
        echo Running setup script...
    else
        echo Aborting
        exit 0
    fi
fi

set -v

cd ./client
npm run build

cd ../admin
npm run build

cd ../

set +v

if [ $1 = "--dry-run" ]; then
    echo
    echo "Dry run selected, not copying files to server"
    exit 0
fi

set -v

# COPY BUILT CLIENT FILES
scp -r client/build ess@ess.uvic.ca:/home/ess/www/ess.uvic.ca/ess-lockers/client/

# COPY BUILT ADMIN FILES
scp -r admin/build ess@ess.uvic.ca:/home/ess/www/ess.uvic.ca/ess-lockers/client/build/admin

set +v

echo
echo
echo "=================="
echo "Frontend deploy complete. Remember to add back the old PHP files"
echo "for backwards compatibility"
echo "=================="
