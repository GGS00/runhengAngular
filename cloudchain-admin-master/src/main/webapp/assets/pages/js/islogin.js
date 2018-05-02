function isloginCheck(){
    $.ajax({
        type: "get",
        url: "/isLogin",
        data: {
        },
        dataType: "json",
        success: function(data){
            if(data.obj == 0){
                window.location.href="/chaimihome#/homepage/index"
            }
        }
    });
}
isloginCheck();