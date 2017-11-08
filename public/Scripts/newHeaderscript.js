$('body').append(
        "<div class='headerJS' style='padding:0px;text-align: center;'>" +
        "<a style='float:left;PADDING-LEFT: 10px;' href='http://katonet.emrsn.org/default.htm'><img src='Images/ke3.gif'/></a>" +
        "<span id=appName style='font-size: 250%;font-weight: bold;color: #4c4c4c;'></span>" +
        "<a style='float:right;PADDING-Right: 10px;' href='http://industrialautomation/indauto/group/Pages/Home.aspx'><img src='Images/rightLogo.png' /></a>" +
        "<div  id='breadTrail' style='clear: both;text-align: left;' ></div>" +
        "</div>" +
        "<div style='display:none;'>" +
        "<textarea id='pubkey' rows='15' style='width:100%'>" +
        " -----BEGIN PUBLIC KEY-----" +
        " MIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEAkf2ll1me1psD2TWEKWFX" +
        " gL3dZA/7Nw3MCGJPM9+2L0ueGMtmjS5Qezsb5AFLk58hWYfxryU7a4qN750EwqEM" +
        " cfvUcagviWdmfr8U24SmYoVpJRH+4pOyj6PlIynWLI/xVXZDvv+Y7+Lwpo0CWWpf" +
        " y/9rH5nDjV7kCsPrNpQE6qAknvL+Ousa0U7ayi8VBXmOnyHl0IDZ4f7LpsOGEOeM" +
        " XaWETCbOV9uhJRzjjVZttvZbQ4SEmN+9ZHcLiCX40Yot6g+42KR9D/zXz7rlEgUc" +
        " Yysea2REnsZnibqTqJOfegVX2Vhq5kAE/xuPsHQ+jUGnzccVJlzPKB0RYpZVx2Hz" +
        " In4HeoC1Im05q4o3wBIOMCE38U1sPEzHl2Fz4EWRqrIEzQEHfdclo2he/IxjGhKp" +
        " Y7LqGK8wbEBligXB3+Wie9AVlWUPXDn8bHrZU984qFHPcZkFkVyw1YM9P0c70rIc" +
        " gWf85doWcCpM3KZGsWCxBjt76R2zTgmJBTtISaM7Oyg7AgMBAAE=" +
        " -----END PUBLIC KEY-----" +
        "</textarea>" +
        "</div>" +
        "<div id='popupbox' style='margin:0;margin-left:40%;margin-right:40%;margin-top:50px;padding-top:10px;width:400px;height:175px;position:absolute;background:white;border:solid #00007A 2px;z-index:9;display: none;'> " +
        "<div name='login'>" +
        "<center style='font-size:18px;'>Username:</center>" +
        "<center style='padding-bottom:15px'><input id='userName' size='18' style='text-align:center' /></center>" +
        "<center style='font-size:18px;'>Password:</center>" +
        "<center style='padding-bottom:15px'><input id='userPassword' type='password' size='18' style='text-align:center' /></center>" +
        "<center><button class='pure-button pure-button-primary' style='background:#00007A' onclick='ExpiredLogIn()'>Login</button></center>" +
        "</div>" +
        "</div>");


//this is for the popuplogin when the user has been logged in the app for too long.
function ExpiredLogIn() {
    var crypt = new JSEncrypt();
    // Set the public key.
    crypt.setPublicKey($('#pubkey').val());
    // Get the input value.
    var timestamp = GetTimeStamp();
    var input = (timestamp + ":" + $('#userName').val() + ":" + $('#userPassword').val());
    var userName = $('#userName').val();
    //Set the Encrypted Value
    var encryptedValue = crypt.encrypt(input);
    encryptedValue = base64.encode(encryptedValue);
    if (encryptedValue == false) {
        alert('Encryption Failed');
    }
    else {
        $.ajax({
            type: 'GET',
            url: "https://mktsvm-dev-app.emrsn.org/Login/api/Auth",
            async: false,
            data: { credentials: encryptedValue },
            success: function (response) {
                if (response == true) {
                    sessionStorage.ReLogIn = false;
                    sessionStorage.LoginTimeStamp = timestamp;
                    sessionStorage.UserName = userName;
                    sessionStorage.ObscureObjectReference = encryptedValue;
                    $('#userName').val('');
                    $('#userPassword').val('');
                    $('#content').show();
                    $('#popupbox').hide();
                }
                else {
                    alert('Invalid Credentials, try again.');
                    $('#userName').val('');
                    $('#userPassword').val('');
                    $('#popupbox').show();
                    $('#content').hide();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Error Thrown: ' + errorThrown);;
            }
        })
    }
};

function GetTimeStamp() {
    var n = new Date();
    var d = n.getDate();
    var y = n.getFullYear();
    var m = n.getMonth() + 1;
    var h = n.getHours();
    h = h.toString();
    var z = --m >= 0 && m < 12 && d > 0 && d < 29 + (
             4 * (y = y & 3 || !(y % 25) && y & 15 ? 0 : 1) + 15662003 >> m * 2 & 3
             ) && m * 31 - (m > 1 ? (1054267675 >> m * 3 - 6 & 7) - y : 0) + d;
    z = z.toString();
    if (h.length != 2) {
        h = '0' + h;
    }
    if (z.length != 3) {
        for (i = z.length; i < 3; i++) {
            z = '0' + z;
        }
    }
    return z + h;
};


//this catches any error recieved with an ajax call in the program. There is error handeling specifically for TimedOut accounts. (>24 hours)
$(document).ajaxError(function (jqXHR, textStatus, errorThrown) {
    if (textStatus.statusText != 'Unauthorized') {
        alert('Error: ' + textStatus.statusText);
    }
    else {
        if (sessionStorage.ObscureObjectReference != 'TimedOut') { //prevents multiple alerts if multiple ajax calls in a row
            sessionStorage.ObscureObjectReference = 'TimedOut';
            alert('Error: ' + textStatus.statusText);
            alert('You have been logged in for too long, please login again.');
            $('#content').hide();
            $('#popupbox').show();
        }
    }
});
//if the user never extends login, this will make them have to sign in to continue.
$(document).ajaxSuccess(function (event, request, settings, data) {
    if ((typeof data != "undefined") && (typeof data.Message != "undefined") && data.Message == "Authorization has been denied for this request.") {
        sessionStorage.ObscureObjectReference = 'TimedOut';
        alert('You have been logged in for too long, or your credentials are invalid, please login again.');
        $('#content').hide();
        $('#popupbox').show();
    }
});
//if the user cheats and tries to refresh the page, it will not work, but the app will be refreshed in the background.
if (sessionStorage.ObscureObjectReference == "TimedOut" || sessionStorage.ReLogIn == "true") {
    setTimeout(function () {
        $('#content').hide();
    }, 100);
    $('#popupbox').show();
}

//a reminder will come up every 30min IF the user is close to a timeout between 23 and 25 hours of constant login. 
$(function () {
    setInterval(function () {
        if (GetTimeStamp() - sessionStorage.LoginTimeStamp >= 23 && GetTimeStamp() - sessionStorage.LoginTimeStamp <= 25) {
            new message();
        }
    }, 1800000); // 15000 = 15 sec for testing, otherwise 1800000 is 30min
});
message = function () {
    //clean up just in case
    $('#message').remove();
    this.elContainer = null;
    this.btnYes = null;
    this.btnNo = null;
    this.init();
};
message.prototype.init = function () {
    //set up our elements
    this.elContainer = $('<div id="message" align="center"><h1>Login session is about to expire</h1><h3>Do you want to extend your login?</h3></div>');
    this.btnYes = $('<input type="button" value="Yes" class="pure-button pure-button-primary"/>');
    this.btnNo = $('<input type="button" value="No" class="pure-button pure-button-primary"/>');
    //combine them
    this.elContainer.append(this.btnYes, this.btnNo);
    //add some onclick events
    this.btnYes.on('click', $.proxy(this.reLogin, this));
    this.btnNo.on('click', $.proxy(this.cancel, this));
    //container css
    this.elContainer.css({
        background: 'black',
        color: 'white',
        padding: 20,
        position: 'fixed',
        height: '200px',
        width: '500px',
        bottom: 0,
        opacity: 0,
        top: '50%',
        left: '50%',
        'margin-top': '-150px',
        'margin-left': '-250px'
    });
    //btnNo css
    this.btnNo.css({
        'font-size': 20,
        margin: 20,
    });
    //btnYes css
    this.btnYes.css({
        'font-size': 20,
        margin: 20
    });
    //append to screen
    $('body').append(this.elContainer);
    $(this.elContainer).animate({ opacity: 1 }, 2000);
};
//on btnYes click
message.prototype.reLogin = function () {
    sessionStorage.ReLogIn = true;
    $('#message').remove();
    $('#content').hide();
    $('#popupbox').show();
};
//on btnNo click
message.prototype.cancel = function () {
    $(this.elContainer).animate({ opacity: 0 }, 2000);
    setTimeout(function () {
        $('#message').remove();
    }, 2000)
};