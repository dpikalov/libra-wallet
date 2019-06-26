#!/usr/bin/env sh

# Error handler
err_report() {
    echo ""
    echo "Error on line $1" && read -p "Press enter to continue"
    exit
}
trap 'err_report $LINENO' ERR

WIDGET=wallet

echo "------------"
echo "BUILD: $WIDGET"

# Cleanup & rebuild production
rm -rf dist && NODE_ENV=production npm run build

# Create bar file and sign it
KEY_TO_SIGN="../../../convego-keys/KeysForWidgetSigning_DevelopmentVersion.jks"

cd dist
jar cf $WIDGET.bar *
jarsigner -sigalg SHA256withRSA -digestalg SHA-256 -keystore $KEY_TO_SIGN -storepass widgetdev $WIDGET.bar widgetdev
mv $WIDGET.bar .. && cd .. && rm -rf dist

if [ "$1" = "--install" ]
then
    adb push $WIDGET.bar mnt/sdcard/walletdevelopmentwidgets/
    rm -f $WIDGET.bar
fi

if [ "$1" = "--move" ]
then
    mv -f $WIDGET.bar ../../src/appworld/assets/bundledwidgets/
fi

echo ""
echo "[BUILD SUCCESS]"


