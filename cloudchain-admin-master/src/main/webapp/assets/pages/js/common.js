/**
 * Created by shaobinhua on 2017/3/7.
 */
var msgAlert =
    {
        text :function(msg){

            $("div#msgTips").remove();
            $('body').append("<div class=\"modal fade\" id=\"msgTips\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog msgtips\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button><h4 class=\"modal-title\" id=\"myModalLabel\"><i class=\"fa fa-warning\" style=\"margin-right: 10px;\"></i>提示</h4></div><div class=\"modal-body\">"+ msg +"</div><div class=\"modal-footer\"><div class=\imeisNoMsg\"></div><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">关闭</button></div></div></div></div>");
            $('#msgTips').modal('show');

        },

        info :function(msg){

            $("div#msgTips").remove();
            $('body').append("<div class=\"modal fade\" id=\"msgTips\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog msgtips\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button><h4 class=\"modal-title\" id=\"myModalLabel\"><i class=\"fa fa-warning\" style=\"margin-right: 10px;\"></i>提示</h4></div><div class=\"modal-body\">"+ msg +"</div><div class=\"modal-footer\"><div class=\imeisNoMsg\"></div><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">关闭</button></div></div></div></div>");
            $('#msgTips').modal('show');
            //等待两秒钟后关闭
            setTimeout(function(){$('#msgTips').modal('hide')},2000);

        },

        success : function(msg){
            $("div#successTips").remove();
            $('body').append("<div class=\"modal fade\" id=\"successTips\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog\" style=\"margin-top: 250px;width: 500px;\"><div class=\"modal-content\"><div class=\"modal-header\" style=\"padding: 8px;border: none;\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button></div><div class=\"modal-body settledSuccess\"><div class=\"successText\"><i class=\"iconfont icon-chenggong\"></i><span>"+msg+"</span></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">关闭</button></div></div></div></div>");
            $('#successTips').modal('show');
            //等待两秒钟后关闭
            setTimeout(function(){$('#successTips').modal('hide')},2000);
        },

        tips :function(msg){
            $("div#msgTips").remove();
            $('body').append("<div class=\"modal fade\" id=\"msgTips\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog msgtips\" style=\"width:235px;border-radius: 23px;\"><div class=\"modal-content\" style=\"border-radius: 6px;height: auto;text-align: center;\"><div class=\"modal-body\" style=\"word-break: break-all;color: #777777;\"><i class=\"fa fa-shopping-cart\" style=\"margin-right: 6px;color: #B9B9B9;\"></i>"+ msg +"</div></div></div></div>");
            $('#msgTips').modal('show');
            //等待两秒钟后关闭
            setTimeout(function(){$('#msgTips').modal('hide')},1000);

        },

        confirm :function(msg,btntext,fun){
            $("div#confirmFun").remove();
            $('body').append("<div class=\"modal fade\" id=\"confirmFun\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog\" style=\"margin-top:180px;width: 500px\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button><h4 class=\"modal-title\"><i class=\"fa fa-hand-pointer-o\" style=\"margin-right: 10px;\"></i>提示</h4></div><div class=\"modal-body\"><div class=\"form-group\">" + msg + "</div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">关闭</button><button type=\"button\" class=\"btn btn-primary\" id=\"confirmBtn\">" + btntext + "</button></div></div></div></div>");
            $("#confirmBtn").bind("click",fun);
            $('#confirmFun').modal('show');
            $("#confirmBtn").on("click",function(){
                $('#confirmFun').modal('hide');
            });
        }

    }

var loading =
    {
        show :function(){
            $("div.loadingMask").remove();
            $('body').append("<div class=\"loadingMask\" style=\'width: 100%;height: 100%;background: #000;opacity: 0.4;position: absolute;z-index:19999;top:0;left:0;display: none;\'><div class=\"loading\" style=\"left: 47%;position: absolute;top: 30%;width: 200px;\"><img src=\"../assets/pages/img/loading.gif\" style=\'width: 100%;border-radius: 16px;\'></div></div>");
            $('.loadingMask').show();
        },

        hide :function(){
            $("div.loadingMask").remove();
        }

    }

var loginModal = {
    show :function(){
        $("div#loginModal").remove();
        $('body').append("<div class=\"modal fade\" id=\"loginModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog\" style=\"margin-top: 120px;width: 360px;\"><div class=\"modal-content\" style=\"border-radius: 8px;\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button><h4 class=\"modal-title\" style=\"text-align: center;color: #9B9B9B;font-weight: bold;font-size: 16px;\">登入</h4></div><div class=\"modal-body\" style=\"height: 117px;\"><div class=\"form-group\" style=\"width: 65%;margin-left: auto;margin-right: auto;\"><input class=\"form-control form-control-solid placeholder-no-fix\" type=\"text\" autocomplete=\"off\" placeholder=\"用户名\" name=\"username\" /></div><div class=\"form-group\" style=\"width: 65%;margin-left: auto;margin-right: auto;\"><input class=\"form-control form-control-solid placeholder-no-fix\" type=\"password\" autocomplete=\"off\" placeholder=\"密码\" name=\"password\" /></div></div><div class=\"modal-footer\" style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">关闭</button><button type=\"button\" class=\"btn btn-primary\" onclick=\"commonLogin()\" style=\"background: #36C5D3;border: #36C5D3;\">登入</button></div></div></div></div>");
        $('#loginModal').modal('show');
    },
}

var key;

function bodyRSA(){
    setMaxDigits(130);
    key = new RSAKeyPair("10001","","f5e769a799b21ffb5eb358006f110e3653eaf7ade25e764fb722c912fa049156ea851a4929428059cddbc269cd868bc089df30fb22bcb89b79c965f4fee81c516a147b777c5361d63d11e8504b0a416f8cf69f7e810ced126137911010fb72e15ba2d700fcb8663a64e6bffcece7c45d7414a795281420f508387b6017b56037");
}

var commonLogin = function(){

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