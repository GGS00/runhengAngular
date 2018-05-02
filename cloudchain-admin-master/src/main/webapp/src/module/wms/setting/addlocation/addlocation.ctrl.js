angular.module('MetronicApp')
    .controller('addlocationCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', 'Table', 'citySelect','d2p','Goods', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, Table, citySelect,d2p,Goods) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
        /***************************************************************获取仓库列表*******************************************************************************/
        vm.warehouseColumn = [
            {
                field: 'ID',
                displayName: 'ID',

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

        vm.warelinsener = function () {
            vm.region_params = {
                bean: 'wmsWarehouseArea',
                method: 'page',
                wareHouseId:vm.warehouseEntity.getSelectedRows()[0].ID,
                page: 1,
                rows: 10
            }
            vm.regionPage();
        }
        /*******************************************************************获取库区列表*******************************************************************************/
        vm.regionColumn = [
            {
                field: 'id',
                displayName: 'ID',
                visible: false,
            },{
                field: 'code',
                displayName: '库区编码',
            },
            {
                field: "name",
                displayName: '库区名字',
            }
        ]
        vm.placeholder_regionName = '请选择库区';
        vm.icon_region = 'plus';
        vm.regionPage = function () {
            commonUtil.getList(vm.region_params).success(function (data) {

                if (data.additionalMsg.status == '00') {
                    vm.regionData = data;
                } else  {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        };


        /********************************************************添加商品分类******************************************************************/
        vm.regList = [{Name:"",mark:'0',radioFlag:1,cIds:[],changeFlag:0}];
        vm.addList = function () {
            vm.regList.push({
                Name:"",
                mark:'0',
                radioFlag:1,
                cIds:[],
                changeFlag:0
            })
        }
        vm.rmList = function () {
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
                if(vm.regList[index].cIds.length==0){
                    $("#categoryTree").jstree("uncheck_all")
                }
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
                        }else if (data.instance.is_leaf(node)) {
                            vm.regList[  vm.mIndex].cIds.push( node.id);
                        }
                    }
                    console.log( vm.regList);
                });
            })
        }


    //添加库位请求
    vm.add = function () {


        if ($.trim($('#id_WarehouseId').val()) == "") {
            msgAlert.text('请选择所属仓库)');
            return false;
        }
        if ($.trim($('#id_region').val()) == "") {
            msgAlert.text('请选择所属库区,库区创建(仓储/基础信息管理/库区管理/新建库区)');
            return false;
        }
        vm.warehouseId = $('#id_WarehouseId').val();
        vm.areaId =   vm.regionEntity.getSelectedRows()[0].id;//库区id
        var list = [];
        if($("#locationType").val()==""){
            msgAlert.text('请选择一种库位类型');
            return false;
        }
        for (var i=0;i<vm.regList.length;i++){
            var n = []
            if ($.trim(vm.regList[i].Name)== "") {
                msgAlert.text('有未填写的库位名称')
                return;
            }
            if(vm.regList[i].radioFlag==0){
                n=vm.regList[i].cIds;
                n.join();
            }

            list.push({
                locationName:vm.regList[i].Name,
                goodsFlg:vm.regList[i].radioFlag,
                mark:vm.regList[i].mark,
                skuLst:n,
                locationType:$("#locationType").val()
            })
        }
        vm.addParam = {
            wareHouseId:vm.warehouseId,
            areaId: vm.areaId,//库区id
            wmsHouseLocationInfoList:list
        }
        BillManage.wmsWarehouseLocationAdd(vm).success(function (data) {
            if (data.additionalMsg.status == '00') {
                msgAlert.text('添加成功');
                window.location.href= "#/wms/setting/location"
            } else {
                msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
            }
        })
    }
}
]);

