angular.module('MetronicApp').controller('addregionCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', '$stateParams', 'commonUtil', 'Table', 'Goods', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, $stateParams, commonUtil, Table, Goods) {

    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    //返回按钮
    vm.returnButton = function () {
        window.history.back(-1);
    }




    /**********************************************************仓库*************************************************************/
    vm.warehouseColumn = [
        {
            field: 'ID',
            displayName: 'ID',
            visible: false,
        }, {
            field: 'CODE',
            displayName: '仓库编码',
        },
        {
            field: "NAME",
            displayName: '仓库名',
        }
    ]
    vm.placeholder_warehouseName = '请选择仓库';
    vm.icon_warehouse = 'plus';
    vm.warehouseParams = {
        bean: 'wmsWarehouse',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.warehousePage = function () {

        commonUtil.getList(vm.warehouseParams).success(function (data) {

            if (data.additionalMsg.status == '00') {
                vm.warehouseData = data;
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });

    };
    vm.warehousePage();
    vm.radioFlag = 0;
    vm.wareinfo = function () {
        vm.typeId = $("#id_WarehouseId").val();
        BillManage.wmsWarehouseType(vm).success(function (data) {
            if (data.status == '00') {
                var storeMentStr2 = new Array("普通", "冷藏", "恒温", "特种", "气调");
                var storeMentStr1 = new Array("01", "02", "03", "04", "05");
                var storeMent = data.obj.storeMent.split(","); //字符分割
                vm.radiolist = new Array();
                for (var i = 0; i < storeMent.length; i++) {
                    for (var j = 0; j < storeMentStr1.length; j++) {
                        if (storeMent[i] == storeMentStr1[j]) {
                            vm.radiolist.push({"name": storeMentStr2[j], "value": storeMentStr1[j]})
                        }
                    }
                }
                vm.upradioFlag = storeMentStr1[0];
                vm.radioFlag = 1;
            } else {
                msgAlert.text(' >﹏< [' + data.message + ']');
            }
        })
    }



    vm.regList = [{Name:"",radioFlag:1,cIds:[],changeFlag:0}];


    vm.addList = function () {
        vm.regList.push({
            Name:"",
            radioFlag:1,
            cIds:[],
            changeFlag:0
        })
    }
    vm.rmList = function () {
        if(vm.regList.length ==1){
            return;
        }
        vm.regList.pop()
    }
    function categoryTree() {
        $("#categoryTree").jstree({
            "core": {
                "themes": {
                    "responsive": false
                },
                // so that create works
                "check_callback": true,
            },
            "types": {
                "default": {
                    "icon": "fa fa-folder icon-state-warning icon-lg"
                },
                "file": {
                    "icon": "fa fa-file icon-state-warning icon-lg"
                }
            },
            "state": {"key": "demo2"},
            "plugins": ["dnd", "state", "types", "checkbox"]
        });
    }
    vm.mIndex;
    vm.setShowClassify  = function(index){
        vm.mIndex = index;
        $('#confirmEdit').modal('show');
        Goods.getCategoryList().success(function (data) {
            var oldbox = data.data;
            var row =  new Array();
            if(oldbox != null){
                for(var m=0;m<oldbox.length;m++){
                    if(oldbox[m].parentCId == 0){
                        row.push({"id":oldbox[m].cId,"parent":"#","text":oldbox[m].name})
                    }else{
                        row.push({"id":oldbox[m].cId,"parent":oldbox[m].parentCId,"text":oldbox[m].name})
                    }
                }
            }
            categoryTree()
            $("#categoryTree").jstree().settings.core.data=row;
            $("#categoryTree").jstree().refresh(true);
            $("#categoryTree").on('changed.jstree',function(e,data){
                /* vm.regList[index].cIds = [];
                 console.log(vm.regList[index].cIds.length)*/
                var i, j;
                vm.regList[vm.mIndex].cIds = [];
                var dataSelect = data.selected;
                for (i = 0, j = dataSelect.length; i < j; i++) {
                    var node = data.instance.get_node(dataSelect[i]);
                    if(node.parent =="#"&&node.children.length==0){
                        $("#categoryTree").jstree('uncheck_node',node.id);//将节点选中
                        return;
                    }else if (data.instance.is_leaf(node)   ) {
                        vm.regList[  vm.mIndex].cIds.push( node.id);
                    }
                }
                console.log( vm.regList);
            });

        })


    }
    /************************************获取仓库类型********************************************************************/


        $('#confirmEdit').on('hide.bs.modal', function () {
            $('#categoryTree').jstree("destroy");
        })

    vm.submitUser = function () {
        if ($.trim($('#id_WarehouseId').val()) == "") {
            msgAlert.text('请选择所属仓库');
            return false;
        }
        // vm.regList = [{Name:"",radioFlag:1,cIds:[],changeFlag:0}];
        var list = [];
        for (var i=0;i<vm.regList.length;i++){
            var n = []
            if ($.trim(vm.regList[i].Name)== "") {
                   msgAlert.text('有未填写的库区名称')
                   return;
             }
             if(vm.regList[i].radioFlag==0){
                n=vm.regList[i].cIds;
                n.join();
             }

            list.push({
                  areaName:vm.regList[i].Name,
                  goodsFlg:vm.regList[i].radioFlag,
                   skuLst:n
            })
        }
            vm.addParam = {
                wareHouseId:$('#id_WarehouseId').val(),
                areaType:vm.upradioFlag,
                lowTemper:$('#id_lowtemp').val(),
                highTemper:$('#id_higthtemp').val(),
                wmsHouseAreaInfoList:list
            }
            BillManage.wmsWarehouseAreaAdd(vm).success(function (data) {
                debugger

                if (data.additionalMsg.status == '00') {
                    msgAlert.text('添加成功');
                     window.location.href = "#/wms/setting/region";
                } else {
                    msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
                }
            })
        }
    }
    ]);

