angular.module('MetronicApp').controller('GoodsEdit3Controller', function($stateParams, $scope, $timeout,Goods,commonUtil) {
    var editor_a;
    $scope.$on('$viewContentLoaded', function() {

    });

    $scope.initEditor= function () {
        UE.delEditor('myEditor')
        editor_a = UE.getEditor('myEditor',{initialFrameHeight:500});
    }

    var vm = this;
    var spuId = $stateParams.Id;

    Goods.getSpu(spuId,4).success(function (data) {
        vm.userId = data.obj.userId
        console.log(spuId)
        $scope.initEditor()
        $scope.downInfo()
    })


    $scope.addInfo = function () {
        applyTokenDo(function (client) {
            var content =  editor_a.getContent();
            return client.put("cloudchain/gms/goods/details/"+ vm.userId +"/"+ spuId +"/"+ spuId +".html", new Buffer(content),{headers:{
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
            }}).then(function (res) {
                console.log('upload success: %j', res);
                App.unblockUI();
                window.location.href ="#/goods/list"
            });
        })
    }


    $scope.downInfo = function () {
        applyTokenDo(function(client){
            var res =  client.signatureUrl("cloudchain/gms/goods/details/"+ vm.userId +"/"+ spuId +"/"+ spuId +".html")
            $.ajax({
                url:res,
                type:"get",
                dataType:"html",
                success:function(data){
                    console.log(data)
                    editor_a.setContent(data)
                },
                error:function(){
                    msgAlert.text('系统繁忙 >﹏<');
                }
            })
        })
    }

    //OSS上传配置
    var appServer = 'http://app.chaimi.net:3000';
    var bucket = 'cloudchain';
    var region = 'oss-cn-hangzhou';

    var urllib = OSS.urllib;
    var Buffer = OSS.Buffer;
    var Wrapper = OSS.Wrapper;
    var STS = OSS.STS;

    var applyTokenDo = function (func) {
        var url = appServer;
        return urllib.request(url, {
            method: 'GET'
        }).then(function (result) {
            var creds = JSON.parse(result.data);
            var client = new Wrapper({
                region: "oss-cn-hangzhou",
                accessKeyId:   creds.AccessKeyId,
                accessKeySecret: creds.AccessKeySecret,
                stsToken: creds.SecurityToken,
                bucket: bucket
            });
            return func(client);
        });
    };



})

