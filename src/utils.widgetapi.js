/**
 * Promisified widgetapi.* with stubs for on-PC debugging
 */
var utils = {};

var flavors = window.flavors;

var console = window.console;

export default utils;

if (!window.cordova) {
    console.log('SessionStorage', 'is used to persist the app state on PC')
    console.dir(sessionStorage)
}

// Helper
utils.rejectWithGenericError = (e) => {
    console.error(e);

    // TODO Actually, the error might not be caused by network or service, but we
    // use text below, as we agreed
    return Promise.reject(e);
}

/**
 * @return Promise<Object>
 */
utils.getEnv = () => new Promise(done => {
    if (!window.widgetapi) {
        // PC debugging only
        return done({
            endpoint        : 'https://tsp-cust-cpswm.venyonservices.com/d470/wallet-manager-gateway/appserver',
            FLAVOR_subclient: '_dsv_lbbw'
        });
    }
    widgetapi.getEnv(done, e => done({}))
})

/**
 * @return Promise<Object>
 */
utils.getFlavor = () => {
    return utils.getEnv().then(env =>
        env.FLAVOR_subclient == '_dsv_lbbw' ? 'lbbw' : 'dsv'
    ).then(name =>
        flavors[name] || flavors['dsv']
    );
}

/**
 * @return Promise<String>
 */
utils.getPrefStr = (key) => new Promise(done => {
    if (!window.WidgetPreferences) {
        // PC debugging only
        window.sessionStorage['blzConfirmedBankId'] = '94059421';
        return done(window.sessionStorage[key]);
    }
    WidgetPreferences.getString(true, key, done, () => done());
})

/**
 * @return Promise<>
 */
utils.putPrefStr = (key, value) => new Promise((done, fail) => {
    if (!window.WidgetPreferences) {
        // PC debugging only
        window.sessionStorage[key] = value;
        return done();
    }
    
    WidgetPreferences.putString(true, key, value, done, fail);

}).catch(utils.rejectWithGenericError)


/**
 * @return Promise<Array>
 */
utils.getPrefList = (key) => {
    return utils.getPrefStr(key).then(json => json ? JSON.parse(json) : []);
}

/**
 * @return Promise<>
 */
utils.putPrefList = (key, list) => {
    return utils.putPrefStr(key, JSON.stringify(list))
}

/**/
utils.closeWidget = () => {
    window.widgetapi ? widgetapi.closeWidget()
        : alert('widgetapi.closeWidget()');
}

/**/
utils.closeApplication = () => {
    window.widgetapi ? widgetapi.closeApplication()
        : alert('widgetapi.closeApplication()');
}

/**
 * Hide splash screen (hides home-screen, but not widgets)
 */
utils.hideSplashScreen = (delayMs) => {
    var delay = (ms) => new Promise(done =>
        setTimeout(done, ms)
    )

    return delay(delayMs || 0)
        .then(() =>
            window.widgetapi && widgetapi.hideSplashScreen()
        )
}

/**
 * @return Promise<>
 */
utils.openWidget = (widgetUri, json) => {
    if (!window.widgetapi) {
        // PC debugging only
        alert('Open widget: ' + widgetUri + '\n' + JSON.stringify(json || {}));
        return Promise.resolve();
    }

    var getWidgetInfo = () => new Promise((done, fail) => {
        widgetapi.getWidgetInfo(widgetUri, done, fail);
    })

    var startWidget = () => new Promise((done, fail) => {
        widgetapi.startWidget(widgetUri, done, fail);
    })

    var postMessage = () => new Promise((done, fail) => {
        widgetapi.postMessage(json || {}, widgetUri, done, fail);
    })

    return getWidgetInfo().then(v =>
        v.isRunning ? Promise.resolve() : startWidget()
    ).then(postMessage, utils.rejectWithGenericError);
}

/**/
utils.showMe = () => {
    if (!window.widgetapi) {
        // PC debugging only
        return;
    }
    widgetapi.showMe();
}

/**
 * @return Promise<Object> CP Payment Card or Promise.reject()
 */
utils.getPaymentCard = (cardId) => {
    //console.log('utils.getPaymentCard()', cardId);

    if (!window.widgetapi) {
        // PC debugging only
        return Promise.resolve({
            cardId          : cardId,
            scheme          : 'MASTERCARD',
            cardImageFileUri: 'https://via.placeholder.com/300x188/ffa500/00?text=%20',
            cardholdername1 : 'CARDHOLDER NAME',
            enabled         : sessionStorage['enabled'] == 'true',
            maskedPan       : '**** **** **** 4444',
            tokenizedPan    : '1234567890123456789',
            expiry          : '' + Date.now()
        });
    }

    return utils.getPaymentCards().then(cards =>
        cards.find(v => (cardId && v.cardId == cardId)) || Promise.reject()
    ).catch(utils.rejectWithGenericError);
};

/**
 * @deprecated
 * @return Promise<string> Card ID or undefined
 */
utils.getDefaultPaymentCardId = () => new Promise(done => {
    //console.log('utils.getDefaultPaymentCardId()');

    if (!window.widgetapi) {
        // PC debugging only
        return done(sessionStorage['default']);
    }
    widgetapi.getDefaultPaymentCardId(done, () => done());
});

/**
 * @return Promise<>
 */
utils.setDefaultPaymentCard = (cardId) => new Promise( (done, fail) => {
    //console.log('utils.setDefaultPaymentCard()');

    if (!window.widgetapi) {
        // PC debugging only
        sessionStorage['default'] = cardId;
        return done();
    }
    widgetapi.setDefaultPaymentCard(cardId, done, fail);

}).catch(utils.rejectWithGenericError);

/**
 * @return Promise<Object>
 */
utils.getPaymentCards = () => new Promise((done, fail) => {
    //console.log('utils.getPaymentCards()');

    if (!window.widgetapi) {
        // PC debugging only
        utils.getPaymentCard('123').then(v => done([v]));//done([]);
        return;
    }
    widgetapi.getPaymentCards(done, fail);

}).catch(utils.rejectWithGenericError)

/**
 * @return Promise<Object>
 */
utils.getComplementaryCardData = (cardId) => new Promise((done, fail) => {
    //console.log('utils.getComplementaryCardData()', cardId);

    if (!window.widgetapi) {
        return done({
            objectKey : '2',
            name1     : 'VERONIKA-FRANZISKA-ALEXANDRA VON',
            name2     : 'SCHULTZE-MUELLER-MUSTERFRAU',
            expiryDate: '1218',
            // GC only
            iban      : 'DE99123546781234567890',
            // MC
            maskedPan: '************0000'
        });
    }
    widgetapi.getComplementaryCardData(cardId, done, fail);

}).catch(utils.rejectWithGenericError)

/**
 * @return Promise<>
 */
utils.enablePayment = (cardId, enabled) => new Promise((done, fail) => {
    console.log('utils.enablePayment()', cardId, enabled);

    if (!window.widgetapi) {
        sessionStorage['default'] = enabled ? cardId : sessionStorage['default'];
        sessionStorage['enabled'] = enabled ? 'true' : undefined;
        return done();
    }
    widgetapi.enablePayment(cardId, enabled, done, fail);

}).catch(utils.rejectWithGenericError)

/**
 * @return Promise<>
 */
utils.setComplementaryCardData = (cardId, data) => new Promise((done, fail) => {
    //console.log('utils.setComplementaryCardData()', cardId, data)

    if (!window.widgetapi) {
        // PC debugging only
        return done();
    }
    widgetapi.setComplementaryCardData(cardId, data, done, fail);

}).catch(utils.rejectWithGenericError)


/**
 * @return Promise<boolean>
 */
utils.isHceSupportedOnDevice = () => new Promise((done, fail) => {
    //console.log('utils.isHceSupportedOnDevice()')

    if (!window.widgetapi) {
        // PC debugging only
        return done(true);
    }
    widgetapi.isHceSupportedOnDevice(done, fail);

}).catch(utils.rejectWithGenericError)

/**
 * @return Promise<>
 */
utils.initCloudPayClient = () => new Promise((done, fail) => {
    //console.log('utils.initCloudPayClient()')

    if (!window.widgetapi) {
        // PC debugging only
        return done();
    }
    widgetapi.initializeCloudPayClient(done, fail);
})

/**
 * @return Promise<>
 */
utils.addCardPlaceHolder = (imageUrl) => new Promise(done => {
    //console.log('utils.addCardPlaceHolder()', imageUrl);

    if (!window.widgetapi) {
        // PC debugging only
        return done();
    }

    widgetapi.addCardPlaceHolder({
        placeHolderTimeoutSeconds: 60 * 60,
        cardImageUri: imageUrl,
        downloadTimeoutSeconds: 20,
        alpha: 0.25
    }, () => done(), () => done());
})

/**
 * See widgetapi docs for more details
 * @param {Object} {text, padding:{left, top}, font: {name, size, letterSpacing}}
 */
utils.setCardOverlays = (options) => {
    //console.log('utils.setCardOverlays()', options);

    if (!window.widgetapi) {
        // PC debugging only
        return;
    }

    widgetapi.setCardOverlays([options]); 
}

/**
 * @return Promise<>
 */
utils.setReadyForDeletion = (cardId) => new Promise((done, fail) => {
    //console.log('utils.setReadyForDeletion()', cardId);

    if (!window.widgetapi) {
        // PC debugging only
        return done();
    }

    widgetapi.setReadyForDeletion(cardId, done, fail);
})

/**
 * @return Promise<String>
 */
utils.getTxPrecondition = () => new Promise((done, fail) => {
    //console.log('utils.getTxPrecondition()');

    if (!window.widgetapi) {
        // PC debugging only
        return done(sessionStorage['txPrecondition'] || 'SCREEN_UNLOCKED');
    }

    widgetapi.getTransactionPrecondition(done, fail);

}).catch(utils.rejectWithGenericError)

/**
 * @param String  'NONE', 'SCREEN_UNLOCKED', 'APPLICATION_VISIBLE' 
 * @return Promise<>
 */
utils.setTxPrecondition = (name) => new Promise((done, fail) => {
    //console.log('utils.setTxPrecondition()', name);

    if (!window.widgetapi) {
        // PC debugging only
        sessionStorage['txPrecondition'] = name;
        return done();
    }

    widgetapi.setTransactionPrecondition(name, done, fail);

}).catch(utils.rejectWithGenericError)

/**
 * @return Promise<Object>
 */
utils.getCardLayoutDescription = (cardId) => new Promise((done, fail) => {
    //console.log('utils.getCardLayoutDescription()', cardId);

    if (!window.widgetapi) {
        // PC debugging only
        return done({
            pan   : '0000000000000',
            iban  : 'DE11111111111111111111',
            expiry: '1810',
            cardholdername1: 'CLD CARDHOLDERNAME 1',
            cardholdername2: 'CLD CARDHOLDERNAME 2'
        });
    }
    widgetapi.getCardLayoutDescription(cardId, done, fail);

}).catch(utils.rejectWithGenericError)

/**
 * @return Promise<String>
 */
utils.getCloudPayClientId = () => new Promise((done, fail) => {
    //console.log('utils.getCloudPayClientId()');

    if (!window.widgetapi) {
        // PC debugging only
        return done('CLOUDPAY_CLIENT_ID');
    }
    widgetapi.getCloudPayClientId(done, fail);

}).catch(utils.rejectWithGenericError)

/**
 * @return Promise<String>
 */
utils.getPushNotificationId = () => new Promise((done, fail) => {
    //console.log('utils.getPushNotificationId()');

    if (!window.widgetapi) {
        // PC debugging only
        return done('PUSH_NOTIFICATION_ID');
    }
    widgetapi.getPushNotificationId(done, fail);

}).catch(utils.rejectWithGenericError)

/**
 * @return Promise<String>
 */
utils.getDeviceInfo = (alsoSecureInfo) => new Promise((done, fail) => {
    //console.log('utils.getDeviceInfo()', alsoSecureInfo);

    if (!window.widgetapi) {
        // PC debugging only
        return done({
            manufacturer  : 'samsung',
            brand         : 'samsung',
            model         : 'SM-A510F',
            androidVersion: 'Nougat (7.0)'
        });
    }
    widgetapi.getDeviceInfo(alsoSecureInfo, done, fail);

}).catch(utils.rejectWithGenericError)

/**
 * @param Array permissions
 * @return Promise<>
 */
utils.requestAndroidPermissions = (permissions) => new Promise((done, fail) => {
    //console.log('widgetapi.requestAndroidPermissions()', permissions);

    if (!window.widgetapi) {
        // PC debugging only
        var str = permissions.join('\n');
        return confirm('widgetapi.requestAndroidPermissions:\n' +str) ?
            done() : fail()
    }
    widgetapi.requestAndroidPermissions(permissions, done, fail);

}).catch(utils.rejectWithGenericError)

/**
 * @return Promise<>
 */
utils.setGiroCardProvisioningCode = (code) => new Promise((done, fail) => {
    //console.log('widgetapi.setCardProvisioningRegistrationCode()');

    if (!window.widgetapi) {
        // PC debugging only
        return done();
    }
    widgetapi.setCardProvisioningRegistrationCode(code, done, fail);

}).catch(utils.rejectWithGenericError)

/**
 * @return Promise<>
 * TODO Think about combining with method widgetapi.setCardOverlays()
 */
utils.downloadAndSaveCardImageBeforeProvisioning = (scheme, imageUrl, timeout) => new Promise((done, fail) => {
    //console.log('widgetapi.downloadAndSaveCardImageBeforeProvisioning()');

    if (!window.widgetapi) {
        // PC debugging only
        return done();
    }
    widgetapi.downloadAndSaveCardImageBeforeProvisioning(scheme, imageUrl, timeout, done, fail);

}).catch(utils.rejectWithGenericError);

/**
 * @param String - name is 'gps', 'network', 'passive', 'fised'
 * @return Promise<Boolean>
 */
utils.isLocationProviderEnabled = (name) => new Promise((done, fail) => {
    console.log('widgetapi.isLocationProviderEnabled()', name);

    if (!window.widgetapi) {
        // PC debugging only
        return done(true);
    }
    widgetapi.isLocationProviderEnabled(name, done, fail);

}).catch(utils.rejectWithGenericError);

/**/
utils.demoEnrollCpCard = (serviceId, serviceVer, fundingPan, expiry) => new Promise((done, fail) => {
    //console.log('widgetapi.demoEnrollCpCard()');

    if (!window.widgetapi) {
        // PC debugging only
        return done();
    }
    widgetapi.demoEnrollCpCard(serviceId, serviceVer, fundingPan, expiry, done, fail);

}).catch(utils.rejectWithGenericError);

/**/
utils.demoDeleteCpCard = (cardId) => new Promise((done, fail) => {
    //console.log('widgetapi.demoDeleteCpCard()');

    if (!window.widgetapi) {
        // PC debugging only
        return done();
    }
    widgetapi.demoDeleteCpCard(cardId, done, fail);

}).catch(utils.rejectWithGenericError);

/**/
utils.getPaymentCardFor = (bankCard, identity) => {
    //console.log('getPaymentCardFor', bankCard);

    var getData = (cpCard) => utils.getComplementaryCardData(cpCard.cardId)
        .then(v => ({
            cpCard: cpCard,
            data  : v || {}
        }));

    return utils.getPaymentCards().then(cards =>
        Promise.all(cards.map(getData))
    ).then(datas =>
        datas.find(v =>
            identity(bankCard) == identity(v.data)) || Promise.reject()
    ).then(v => v.cpCard);
}

/**
utils.getPaymentCardByObjectKey = (objectKey) => {

    var getExtra = (cpCard) => utils.getComplementaryCardData(cpCard.cardId)
        .then(v => ({
            cpCard: cpCard,
            extra : v || {}
        }));

    return utils.getPaymentCards().then(cards =>
        Promise.all(cards.map(getExtra))
    ).then(extras =>
        extras.find(v => v.extra.objectKey == objectKey) || Promise.reject()
    ).then(v => v.cpCard);
}*/

utils.resetCloudPayClient = () => new Promise((done, fail) => {
    //console.log('widgetapi.resetCloudPayClient()');

    if (!window.widgetapi) {
        // PC debugging only
        return done();
    }
    widgetapi.resetCloudPayClient(done, fail);

}).catch(utils.rejectWithGenericError);

/**/ 
utils.setTapPaymentCardId = (cardId, appOrDevice) => new Promise((done, fail) => {
    console.log('widgetapi.setTapPaymentCardId()', cardId, appOrDevice);
    if (!window.widgetapi) {
        // PC debugging only
        return utils.putPrefStr('tapPaymentCard-' + appOrDevice, cardId)
            .then(done, fail);
    }
    // TBD
    widgetapi.setDefaultPaymentCard(cardId, done, fail);
    // TBD
    //utils.setTapPaymentCardId(cardId, appOrDevice, done, fail)
})

/**/ 
utils.getTapPaymentCardId = (appOrDevice) => new Promise((done, fail) => {
    //console.log('widgetapi.getTapPaymentCardId()');
    if (!window.widgetapi) {
        // PC debugging only
        return utils.getPrefStr('tapPaymentCard-' + appOrDevice)
            .then(done, fail);
    }
    // TBD
    widgetapi.getDefaultPaymentCard(done, fail);
    // TBD
    //utils.getTapPaymentCardId(appOrDevice, done, fail)
})

// @deprecated
utils.setOneTimeOverrideCard = (cardId) => new Promise((done, fail) => {
    //console.log('widgetapi.setOneTimeOverrideCard()');

    if (!window.widgetapi) {
        // PC debugging only
        return done();
    }
    done();
    //widgetapi.setOneTimeOverrideCard(cardId, done, fail);

}).catch(utils.rejectWithGenericError);

/**
 * TODO move to state
 * Set / get currently enrolling card 
 * @return Object (if getter) or none
 */
utils.cardEnrolling = (bankCard) => {
    // getter
    if (bankCard === undefined) {
        return utils.getPrefStr('cardEnrolling')
            .then(v => v ? JSON.parse(v) : Promise.reject())
    }

    // setter
    if (!bankCard) {
        return utils.putPrefStr('cardEnrolling', 'null');
    }
    
    // set timeout for card enrolling 
    /*setTimeout(() => {
        utils.cardEnrolling(null);
    }, 6 * 1000);
    */

    return utils.putPrefStr('cardEnrolling', JSON.stringify(bankCard))
}

// Subscribe to 'card-added' events
window.addEventListener('card-added', async function(event) {     
  console.log('card-added', event.detail.data);

  const cpCard   = event.detail.data; 
  const bankCard = await utils.cardEnrolling();

  // associate bankCard with given cpCard
  await utils.setComplementaryCardData(cpCard.cardId, bankCard);
  // set no enrolling card anymore
  await utils.cardEnrolling(null);
})
