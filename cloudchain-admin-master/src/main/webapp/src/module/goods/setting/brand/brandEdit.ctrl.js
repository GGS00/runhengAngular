/**
 * Created by sq on 2017/6/12.
 */
angular.module('MetronicApp').controller('goodBrandEditController',function($rootScope,$http,$stateParams,$scope,Goods) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    function categoryTree() {
        $("#categoryTree").jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                },
                // so that create works
                "check_callback" : true,
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            },
            "state" : { "key" : "demo2" },
            "plugins" : ["dnd", "state", "types", "checkbox"]
        })

    }

    var vm = this;

    vm.isApplyAll = 0
    vm.currentImg =  {img: "http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image"};





    Goods.loadBrand($stateParams.Id).success(function (data) {
        var b = data.obj
        vm.name = b.name
        vm.currentImg.img = b.logo
        vm.description = b.description
        vm.isApplyAll = b.isApplyAll
        $scope.cIds = b.cIds
        var clist = []
        for(var i in b.categoryList){
            clist.push(b.categoryList[i].cId)
        }


        Goods.getCategoryList().success(function (data) {
            var oldbox = data.data;
            var row =  new Array();

            // row.push({"id":0,"parent":"#","text":"根节点"})
            if(oldbox != null){
                for(var i=0;i<oldbox.length;i++){
                    if(oldbox[i].parentCId == 0){
                        row.push({"id":oldbox[i].cId,"parent":"#","text":oldbox[i].name})
                    }else{
                        row.push({"id":oldbox[i].cId,"parent":oldbox[i].parentCId,"text":oldbox[i].name})
                    }
                }
            }

            categoryTree()
            $("#categoryTree").jstree(true).settings.core.data = row;
            $('#categoryTree').jstree(true).deselect_all();
            $("#categoryTree").jstree(true).refresh('true');


            $("#categoryTree").on('refresh.jstree', function(e, data){
                $("#categoryTree").jstree(true).select_node(clist)

            })
            $("#categoryTree").on('changed.jstree',function(e,data){
                $scope.cIds = [];
                var i, j;
                for (i = 0, j = data.selected.length; i < j; i++) {
                    var node = data.instance.get_node(data.selected[i]);
                    if (data.instance.is_leaf(node)) {
                        $scope.cIds.push(node.id);
                    }
                }

            });
        })

    })



    vm.setShowClassify  = function(){
        $('#confirmEdit').modal('show')
    }

    $scope.showAddImg = function(index){
        $("#showAddImg").modal("show")
    }

    vm.save = function () {
        if(vm.name == undefined || vm.name == ""){
            msgAlert.text('请填写一个品牌名称')
            return;
        }

        if(vm.isApplyAll == 0 && $scope.cIds.length < 1){
            msgAlert.text('请至少选择一个分类')
            return;
        }

        var info = {
            bId:$stateParams.Id,
            name:vm.name,
            logo:vm.currentImg.img,
            description:vm.description,
            cIds:$scope.cIds.join(),
            isApplyAll:vm.isApplyAll,
        }
        Goods.updateBrand(info).success(function (data) {
            if(data.status==00){
                window.history.back();
            }else{
                msgAlert.text(data.msg)
            }
        })
    }



    $scope.addImg = function () {
        var uploadFile = function (client) {
            var file = document.getElementById('file').files[0];
            console.log(client);
            return client.multipartUpload("cloudchain/gms/brand/images/"+file.name+"", file).then(function (res) {
                console.log(res)
                $scope.$apply(function () {
                    vm.skuImgs  = {img:res.url};
                    vm.currentImg = vm.skuImgs;
                });
                vm.skuImgs = {img:res.url}
                console.log('upload success: %j', res);
                console.log(vm.skuImgs)
                vm.currentImg = vm.skuImgs
                $("#showAddImg").modal("hide")
            });
        };console.log(1)
        applyTokenDo(uploadFile);
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

});/**
 * Created by sq on 2017/5/24.
 */
/**
 * Created by sq on 2017/5/26.
 */
