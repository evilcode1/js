
/*jshint ignore:start*/
(function () {
    'use strict';
    document.addEventListener('DOMContentLoaded', function (e) {

        var originURL = document.location.origin + '/comet';
        var params = (new URL(document.location)).searchParams;
        var languageToUse = params.get('language') || 'en';
        var BeError = document.getElementById('BeError');
        var BeErrorContainer = document.getElementById('BeErrorContainer');
        var token = params.get('token');
        var title = params.get('title');
        var message;
        var originPath = document.location.pathname;
        var form = document.getElementById('resetPasswordForm');
        var successMessage = document.getElementById('successMessage');
        var passwordNotMatchMessage;
        var passwordNotReqMessage;

        successMessage.style.display = 'none';
        BeError.style.display = 'none';
        BeErrorContainer.style.display = 'none';

        document.title = pageText[languageToUse].PAGE_TITLE;
        document.getElementById('enterNewPassword').innerHTML = pageText[languageToUse].FORM_TITLE;
        document.getElementById('inputPassword').placeholder = pageText[languageToUse].NEW_PASSWORD_PLACEHOLDER;
        document.getElementById('inputPassword2').placeholder = pageText[languageToUse].NEW_PASSWORD_PLACEHOLDER2;
        document.getElementById('submitButton').innerHTML = pageText[languageToUse].CHANGE_PASSWORD_BUTTON;
        document.getElementById('succesMessageHeader').innerHTML = pageText[languageToUse].SUCCESS_MESSAGE_HEADER;
        document.getElementById('succesMessage').innerHTML = pageText[languageToUse].SUCCESS_MESSAGE;
        document.getElementById('enterTokenMessage').innerHTML = pageText[languageToUse].ENTER_TOKEN_MESSAGE;
        passwordNotMatchMessage = pageText[languageToUse].PASSWORD_NOT_MATCH;
        passwordNotReqMessage = pageText[languageToUse].PASSWORD_MISSING_REQUIREMENTS;

        //LOADING FORM
        // document.addEventListener('DOMContentLoaded', function (event) {
        var password1 = document.getElementById('inputPassword');
        var password2 = document.getElementById('inputPassword2');
        var submitButton = document.getElementById('submitButton');
        var errorMessage = document.getElementById('errorMessage');
        password1.addEventListener('keyup', ifValidEnableSubmit);
        password2.addEventListener('keyup', ifValidEnableSubmit);

        function isPasswordValid() {
            // Maybe validate form
            // console.log('password1 22', password1.value);
            // console.log('password2 22', password2.value);
            return true;
        }

        function ifValidEnableSubmit(data) {
            if (password1.value && password2.value && password1.value.length && password2.value.length && password1.value === password2.value) {
                if (isPasswordValid()) {
                    errorMessage.innerHTML = '';
                    submitButton.disabled = false;
                }
                else {
                    errorMessage.innerHTML = passwordNotReqMessage;
                    submitButton.disabled = true;
                }
            }
            else {
                if (password1.value || password2.value) {
                    errorMessage.innerHTML = passwordNotMatchMessage;
                }
                else {
                    errorMessage.innerHTML = '';
                }
                submitButton.disabled = true;
            }
        }

        // });

        //when submitting form
        form.addEventListener('submit', showSpinner);

        function showSpinner() {
            document.getElementById('submitButton').style.display = 'none';
            document.getElementById('spinner').style.display = 'block';
            document.getElementById('loadingMessage').innerHTML = pageText[languageToUse].LOADING;

            // put token in cookie in case is not on the URL
            document.cookie = 'token=' + document.getElementById('token').value;
        }


        // use staging or production function to submit the form (LAMBDA )
        if (document.location.href.indexOf('testbox') > 1) {
            form.action = 'https://2sjtt6o466.execute-api.us-east-1.amazonaws.com/dev/submit';
        } else {
            form.action = 'https://fr39c4vbbf.execute-api.us-east-1.amazonaws.com/production/submit';
        }


        //after redirect from LAMBDA(page reloaded)
        token = token ? token : getCookie('token');

        if (token) {
            document.getElementById('token').value = token;
            fillHidenValues();
        } else {
            // display token field 
            document.getElementById('token').setAttribute('type', 'text');
            document.getElementById('enterTokenMessage').style.display = 'block';
            fillHidenValues();
        }

        if (title) {
            token = getCookie('token');
            originURL = getCookie('originURL');
            originPath = getCookie('originPath');

            if (token) {
                document.getElementById('token').value = token;

                if (originURL) {
                    document.getElementById('originURL').value = originURL;
                }
                if (originPath) {
                    document.getElementById('originPath').value = originPath;
                }
                if (language) {
                    document.getElementById('language').value = languageToUse;
                }

            } else {

                document.getElementById('token').setAttribute('type', 'text');


                if (originURL) {
                    document.getElementById('originURL').value = originURL;
                }
                if (originPath) {
                    document.getElementById('originPath').value = originPath;
                }
                if (language) {
                    document.getElementById('language').value = languageToUse;
                }
            }

            if (title === 'Error') {
                //show a generic message
                // message = params.get('message');
                // if (message === 'CODE01') {
                //     errorMessage1.style.display = 'block';
                // } else {
                //     errorMessage2.style.display = 'block';
                // }

                var errorMessagefromBE = params.get('errormessage');
                BeError.innerHTML = escapeRegExp(errorMessagefromBE);
                BeError.style.display = 'block';
                BeErrorContainer.style.display = 'block';

            } else {
                form.style.display = 'none';
                successMessage.style.display = 'block';
                message = params.get('message');
                clearAllCookies()
            }
        }

        // Thanks to Chirp Internet: www.chirp.com.au
        function getCookie(name) {
            var re = new RegExp(name + '=([^;]+)');
            var value = re.exec(document.cookie);
            return (value !== null) ? decodeURI(value[1]) : null;
        }

        function fillHidenValues() {
            document.getElementById('originURL').value = originURL;
            document.getElementById('originPath').value = '/reset-password.html';
            document.getElementById('language').value = languageToUse;

            // clearAllCookies();
            // keep token in cookie in case there is error and user wants to try again.

            if (token) {
                document.cookie = 'token=' + token;
            }

            document.cookie = 'originURL=' + originURL;
            document.cookie = 'originPath=/reset-password.html';
        }

        function clearAllCookies() {
            var cookie = document.cookie.split(';');

            for (var i = 0; i < cookie.length; i++) {

                var chip = cookie[i],
                    entry = chip.split("="),
                    name = entry[0];

                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }
        }

        function sanitizeText(string) {
            return string.replace(/</g, '&lt;'); // $& means the whole matched string
        }
    })


})();

/*jshint ignore:end*/
