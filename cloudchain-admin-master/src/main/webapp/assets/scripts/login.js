


var login = function(){
    /*event.preventDefault();*/

    var loginName = $("input[name='username']").val();

    var loginPwd = $("input[name='password']").val();




    if (loginName == "" || loginPwd == "") {
        $('.adminalert').html('请输入用户名或密码')

        $('.adminDanger').show('normal');
        return false;

    }

    else {

        bodyRSA();
       /* encodeURIComponent*/
        var result = encryptedString(key, encodeURIComponent(loginPwd));

        $.ajax({
            type: "post",
            /*url: "../js/services/list.json",*/
            url: "/doLogin",
            data: {
                uName:loginName,
                uPass:result
            },
            dataType: "json",
            success: function(data){
                if(data.status == '00'){
                    Cookies("loginUser", data.realName, { expires: 7 },{ path: '/' });
                    Cookies("loginPhoto", data.userPhoto, { expires: 7 },{ path: '/' });
                    if ($("input[name='remember']").is(':checked')) {

                        Cookies("username", loginName, { expires: 7 },{ path: '/' });//存储一个带7天期限的cookie
                       /* Cookies("userinfo",data.resultMap.umsUser,{expires:7},{ path: '/' })*/
                        /*$.cookie("password", loginPwd, { expires: 7 });*/
                    }
                    else {
                        Cookies("username", "", { expires: -1 });
                        /*$.cookie("password", "", { expires: -1 });*/
                    }

                    window.location.href="/home";

                }else{

                    $('.adminalert').html(data.msg)

                    $('.adminDanger').show('normal');


                }


            },
            error:function(){
                $('.adminalert').html('系统异常');

                $('.adminDanger').show('normal');
            }
        });

    }

};

var stafflogin = function(){
    /*event.preventDefault();*/
    var adminName = $("input[name='adminname']").val();

    var loginName = $("input[name='staffusername']").val();

    var loginPwd = $("input[name='staffpassword']").val();

    if (loginName == "") {
        $('.staffalert').html('请输入用户名或密码');
        $('.staffDanger').show('normal');
        return false;
    }
    if (adminName=="") {
        $('.staffalert').html('请输入企业域');
        $('.staffDanger').show('normal');
        return false;
    }
    if (loginName == "" || loginPwd == "") {
        $('.staffalert').html('请输入用户名或密码');
        $('.staffDanger').show('normal');
        return false;
    }

    else {

        bodyRSA();
        /* encodeURIComponent*/
        var result = encryptedString(key, encodeURIComponent(loginPwd));

        $.ajax({
            type: "post",
            /*url: "../js/services/list.json",*/
            url: "/sys/orguser/doLogin",
            data: {
                uName:loginName,
                uPass:result,
                adminName:adminName,
            },
            dataType: "json",
            success: function(data){
                if(data.status == '00'){
                    Cookies("loginUser", data.realName, { expires: 7 },{ path: '/' });
                    Cookies("loginPhoto", data.userPhoto, { expires: 7 },{ path: '/' });
                    if ($("input[name='rememberstaff']").is(':checked')) {

                        Cookies("adminName", adminName, { expires: 7 },{ path: '/' });//存储一个带7天期限的cookie
                        Cookies("staffusername", loginName, { expires: 7 },{ path: '/' });//存储一个带7天期限的cookie
                       /* Cookies("userinfo",data.resultMap.umsUser,{expires:7},{ path: '/' })*/
                        /*$.cookie("password", loginPwd, { expires: 7 });*/
                    }
                    else {
                        Cookies("staffusername", "", { expires: -1 });
                        Cookies("adminName", "", { expires: -1 });
                        /*$.cookie("password", "", { expires: -1 });*/
                    }

                    window.location.href="/home";

                }else{

                    $('.staffalert').html(data.msg)

                    $('.staffDanger').show('normal');


                }


            },
            error:function(){
                $('.staffalert').html('系统异常');

                $('.staffDanger').show('normal');
            }
        });

    }

};

var switchOff = 0;
var loginByStaff = function(){
      switchOff = 1;
      $('#adminLogin').toggle('normal');
      $('#staffLogin').toggle('normal');
}

var loginByAdmin = function(){
    switchOff = 0;
    $('#adminLogin').toggle('normal');
    $('#staffLogin').toggle('normal');
}

$(document).ready(function () {

    if (Cookies("username")) {

        $("input[name='remember']").attr("checked", true);
        $("input[name='username']").val(Cookies("username"));
        /*$("#txt_password").val($.cookie("password"));*/
    }

    if (Cookies("staffusername")) {

        $("input[name='rememberstaff']").attr("checked", true);
        $("input[name='staffusername']").val(Cookies("staffusername"));
        $("input[name='adminname']").val(Cookies("adminName"));
        /*$("#txt_password").val($.cookie("password"));*/
    }
});

var key;

function bodyRSA(){
    setMaxDigits(130);
    key = new RSAKeyPair("10001","","f5e769a799b21ffb5eb358006f110e3653eaf7ade25e764fb722c912fa049156ea851a4929428059cddbc269cd868bc089df30fb22bcb89b79c965f4fee81c516a147b777c5361d63d11e8504b0a416f8cf69f7e810ced126137911010fb72e15ba2d700fcb8663a64e6bffcece7c45d7414a795281420f508387b6017b56037");
}

$(document).keydown(function(event){
    if(event.keyCode == 13){
        if(switchOff == 0){
            login();
        }else{
            stafflogin()    ;
        }

    }
});