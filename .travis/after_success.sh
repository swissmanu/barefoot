#!/bin/sh

echo '######################################'
echo '#            AFTER SUCCESS           #'
echo '#             - START -              #'
echo '######################################'

echo '---- Cloning repo into /tmp ----'
cd /tmp
git clone https://${GH_OAUTH_TOKEN}@github.com/${GH_USER_NAME}/${GH_PROJECT_NAME} gh-pages 2>&1
cd gh-pages

echo '---- Switch to gh-pages branch ----'
git checkout gh-pages

echo '---- Copy latest documentation ----'
rm -fr docs/
cp -R $RESULT_DOCS ./

echo '---- Set git settings ----'
git config --global user.name $GIT_AUTHOR_NAME
git config --global user.email $GIT_AUTHOR_EMAIL

echo '---- Add files, commit and push ----'
git add -A
git commit -m "adding latest coverage reports and documentation to gh-pages"
git push https://${GH_OAUTH_TOKEN}@github.com/${GH_USER_NAME}/${GH_PROJECT_NAME} 2>&1

echo '######################################'
echo '#           AFTER SUCCESS            #'
echo '#            - FINISH -              #'
echo '######################################'