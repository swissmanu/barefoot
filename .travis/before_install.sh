#!/bin/sh

echo '######################################'
echo '#           BEFORE INSTALL           #'
echo '#             - START -              #'
echo '######################################'

echo '---- Installing NaturalDocs ----'
sudo apt-get update
sudo apt-get install naturaldocs
sudo ln -s /usr/bin/naturaldocs /usr/bin/NaturalDocs

echo '######################################'
echo '#           BEFORE INSTALL           #'
echo '#            - FINISH -              #'
echo '######################################'