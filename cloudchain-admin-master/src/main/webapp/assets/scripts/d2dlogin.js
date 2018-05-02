
var key;

function bodyRSA(){
    setMaxDigits(130);
    key = new RSAKeyPair("10001","","f5e769a799b21ffb5eb358006f110e3653eaf7ade25e764fb722c912fa049156ea851a4929428059cddbc269cd868bc089df30fb22bcb89b79c965f4fee81c516a147b777c5361d63d11e8504b0a416f8cf69f7e810ced126137911010fb72e15ba2d700fcb8663a64e6bffcece7c45d7414a795281420f508387b6017b56037");
}

$(document).keydown(function(event){
    if(event.keyCode == 13){
        login();
    }
});

var login = function(){

    var loginName = $("input[name='username']").val();
    var loginPwd = $("input[name='password']").val();
    if (loginName == "" || loginPwd == "") {
        msgAlert.text('请输入用户名或密码')
        return false;
    }
    else {
        bodyRSA();
        /* encodeURIComponent*/
        var result = encryptedString(key, encodeURIComponent(loginPwd));
        $.ajax({
            type: "post",
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
                    window.location.reload();
                }else{
                    msgAlert.text(data.msg)
                }
            }
        });

    }
};