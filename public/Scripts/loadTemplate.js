function LoadTemplate() {

    $.ajax({
        url: './Templates/viewLogin.html',
        async: false,
        success: function (template) {
            myTemplate.viewLogin = template;
        }
    });

    $.ajax({
        url: './Templates/viewMain.html',
        async: false,
        success: function (template) {
            myTemplate.viewMain = template;
        }
    });
};