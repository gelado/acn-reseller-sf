'use strict';
​
var server = require('server');
​
server.get('Show', function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var actionUrl = URLUtils.url('Reseller-Subscribe').toString();
    var resellerForm = server.forms.getForm('reseller');

    resellerForm.clear();
    res.render('/reseller/reseller', {
        actionUrl: actionUrl,
        contactForm: resellerForm
    });
    next();
});
​
server.post('Subscribe', server.middleware.https, function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var resellerForm = server.forms.getForm('reseller');
    var transaction = require('dw/system/Transaction');
    var customObjMgr = require('dw/object/CustomObjectMgr');
    var formErrors = require('*/cartridge/scripts/formErrors');

    // form validations
    if (!resellerForm.name.value.split(' ')[1]) {
        resellerForm.valid = false;
        resellerForm.name.valid = false;
        resellerForm.name.error = "Por favor preencha o nome completo";
    }

    if (resellerForm.valid) {
        transaction.wrap(function () {
            var newSubscribe = customObjMgr.createCustomObject('Reseller', resellerForm.cpf.value);
            newSubscribe.custom.cpf = resellerForm.cpf.value;
            newSubscribe.custom.Name = resellerForm.name.value;
            newSubscribe.custom.phone = resellerForm.phone.value;
            newSubscribe.custom.email = resellerForm.email.value;
        });
    }

    res.render('/reseller/resellerSuccess', {
        contactForm: resellerForm
    });

    next();
});
module.exports = server.exports();