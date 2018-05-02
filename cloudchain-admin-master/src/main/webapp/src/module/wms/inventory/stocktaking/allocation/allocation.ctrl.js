/**
 * 盘点分配控制器
 */
angular.module('MetronicApp').controller('allocationCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', 'Table', 'linkageSelect', '$location', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, Table, linkageSelect, $location) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.stockCode = $location.search().code;
    vm.warehouseName = $location.search().warehouseName;
    vm.startTime = $location.search().startTime;
    vm.endTime = $location.search().endTime;
    vm.creatTime = $location.search().creatTime;
    vm.wareHouseId = $location.search().wareHouseId;
    vm.alloctType = $location.search().alloctType;




    initialGoods()

    function initialGoods() {
        $(".select2me").select2();
        $(".select2").css('width', 'auto');
        initialGoodsOne(0);
        function initialGoodsOne(id) {
            vm.goodsOne = id;
            $http({
                url: "/category/getCategoryChildren/" + vm.goodsOne, method: "get",
                params: {}
            }).success(function (data) {
                vm.goodsOneSelect = '';
                /*vm.goodsOneSelect = data.data[0].cId;*/
                vm.goodsOneList = data.data;
                if (vm.goodsOneSelect = '') {
                    vm.goodsTwoSelect = '';
                    vm.goodsThreeSelect = '';
                    vm.selectResult = {};
                    vm.selectResult.goodsClassifyOne = vm.goodsOneSelect;
                    vm.selectResult.goodsClassifyTwo = vm.goodsTwoSelect;
                    vm.selectResult.goodsClassifyThree = vm.goodsThreeSelect;
                    console.log(vm.selectResult)
                } else {
                    initialGoodsTwo(vm.goodsOneSelect);
                }

            })
        }

        function initialGoodsTwo(id) {
            vm.goodsTwo = id;
            console.log(vm.goodsTwo)
            if (vm.goodsTwo == '') {
                vm.goodsTwoSelect = '';
                vm.goodsThreeSelect = '';
                vm.selectResult = {};
                vm.selectResult.goodsClassifyOne = vm.goodsOneSelect;
                vm.selectResult.goodsClassifyTwo = vm.goodsTwoSelect;
                vm.selectResult.goodsClassifyThree = vm.goodsThreeSelect;
                console.log(vm.selectResult)
            } else {
                $http({
                    url: "/category/getCategoryChildren/" + vm.goodsTwo, method: "get",
                    params: {}
                }).success(function (data) {
                    vm.goodsTwoSelect = '';
                    vm.goodsTwoList = data.data;
                    if (vm.goodsTwoSelect != '') {
                        initialGoodsThree(vm.goodsTwoSelect);
                    } else {
                        vm.goodsThreeSelect = '';
                        vm.selectResult = {};
                        vm.selectResult.goodsClassifyOne = vm.goodsOneSelect;
                        vm.selectResult.goodsClassifyTwo = vm.goodsTwoSelect;
                        vm.selectResult.goodsClassifyThree = vm.goodsThreeSelect;
                        console.log(vm.selectResult)
                    }
                })
            }

        }

        function initialGoodsThree(id) {
            vm.goodsThree = id;
            if (vm.goodsThree == '') {
                vm.selectResult = {};
                vm.selectResult.goodsClassifyOne = vm.goodsOneSelect;
                vm.selectResult.goodsClassifyTwo = vm.goodsTwoSelect;
                vm.selectResult.goodsClassifyThree = vm.goodsThreeSelect;
                console.log(vm.selectResult)
            } else {
                $http({
                    url: "/category/getCategoryChildren/" + vm.goodsThree, method: "get",
                    params: {}
                }).success(function (data) {
                    vm.goodsThreeSelect = '';
                    vm.goodsThreeList = data.data;
                    vm.selectResult = {};
                    vm.selectResult.goodsClassifyOne = vm.goodsOneSelect;
                    vm.selectResult.goodsClassifyTwo = vm.goodsTwoSelect;
                    vm.selectResult.goodsClassifyThree = vm.goodsThreeSelect;
                    console.log(vm.selectResult)
                })
            }
        }

        vm.selectGOneChange = function () {

            if (vm.goodsOneSelect == ' ') {
                vm.goodsOneSelect = '';
                vm.goodsTwoSelect = '';
                vm.goodsThreeSelect = '';
                vm.goodsTwoList = [];
                vm.goodsThreeList = [];
                vm.selectResult = {};
                vm.selectResult.goodsClassifyOne = vm.goodsOneSelect;
                vm.selectResult.goodsClassifyTwo = vm.goodsTwoSelect;
                vm.selectResult.goodsClassifyThree = vm.goodsThreeSelect;
                console.log(vm.selectResult)
            } else {
                initialGoodsTwo(vm.goodsOneSelect)
            }
        }

        vm.selectGTwoChange = function () {
            if (vm.goodsTwoSelect == ' ') {
                vm.goodsTwoSelect = '';
                vm.goodsThreeSelect = '';
                vm.goodsThreeList = [];
                vm.selectResult = {};
                vm.selectResult.goodsClassifyOne = vm.goodsOneSelect;
                vm.selectResult.goodsClassifyTwo = vm.goodsTwoSelect;
                vm.selectResult.goodsClassifyThree = vm.goodsThreeSelect;
                console.log(vm.selectResult)
            } else {
                initialGoodsThree(vm.goodsTwoSelect)
            }

        }
        vm.selectGThreeChange = function () {
            if (vm.goodsThreeSelect == ' ') {
                vm.goodsThreeSelect = '';
            }
            vm.selectResult = {};
            vm.selectResult.goodsClassifyOne = vm.goodsOneSelect;
            vm.selectResult.goodsClassifyTwo = vm.goodsTwoSelect;
            vm.selectResult.goodsClassifyThree = vm.goodsThreeSelect;
            console.log(vm.selectResult)
        }
    }

    initialShow()

    function initialShow() {
        $(".select2me").select2();
        $(".select2").css('width', 'auto');
        initialShowOne(0);
        function initialShowOne(id) {
            vm.showOne = id;
            $http({
                url: "/d2p/category/queryChildren/" + vm.showOne, method: "post",
                params: {}
            }).success(function (data) {
                vm.showOneSelect = '';
                vm.showOneList = data.data;
                if (vm.showOneSelect = '') {
                    vm.showTwoSelect = '';
                    vm.showThreeSelect = '';
                    vm.selectShowResult = {};
                    vm.selectShowResult.showClassifyOne = vm.showOneSelect;
                    vm.selectShowResult.showClassifyTwo = vm.showTwoSelect;
                    vm.selectShowResult.showClassifyThree = vm.showThreeSelect;
                    console.log(vm.selectShowResult)
                } else {
                    initialShowTwo(vm.showOneSelect);
                }
            })
        }

        function initialShowTwo(id) {
            vm.showTwo = id;
            if (vm.showTwo == '') {
                vm.showTwoSelect = '';
                vm.showThreeSelect = '';
                vm.selectShowResult = {};
                vm.selectShowResult.showClassifyOne = vm.showOneSelect;
                vm.selectShowResult.showClassifyTwo = vm.showTwoSelect;
                vm.selectShowResult.showClassifyThree = vm.showThreeSelect;
                console.log(vm.selectShowResult)
            } else {
                $http({
                    url: "/d2p/category/queryChildren/" + vm.showTwo, method: "post",
                    params: {}
                }).success(function (data) {
                    vm.showTwoSelect = '';
                    vm.showTwoList = data.data;
                    if (vm.showTwoSelect != '') {
                        initialShowThree(vm.showTwoSelect);
                    } else {
                        vm.showThreeSelect = '';
                        vm.selectShowResult = {};
                        vm.selectShowResult.showClassifyOne = vm.showOneSelect;
                        vm.selectShowResult.showClassifyTwo = vm.showTwoSelect;
                        vm.selectShowResult.showClassifyThree = vm.showThreeSelect;
                        console.log(vm.selectShowResult)
                    }
                })
            }

        }

        function initialShowThree(id) {
            vm.showThree = id;
            if (vm.showThree == '') {
                vm.selectShowResult = {};
                vm.selectShowResult.showClassifyOne = vm.showOneSelect;
                vm.selectShowResult.showClassifyTwo = vm.showTwoSelect;
                vm.selectShowResult.showClassifyThree = vm.showThreeSelect;
                console.log(vm.selectShowResult)
            } else {
                $http({
                    url: "/d2p/category/queryChildren/" + vm.showThree, method: "post",
                    params: {}
                }).success(function (data) {
                    vm.showThreeSelect = '';
                    vm.showThreeList = data.data;
                    vm.selectShowResult = {};
                    vm.selectShowResult.showClassifyOne = vm.showOneSelect;
                    vm.selectShowResult.showClassifyTwo = vm.showTwoSelect;
                    vm.selectShowResult.showClassifyThree = vm.showThreeSelect;
                    console.log(vm.selectShowResult)
                })
            }
        }

        vm.selectSOneChange = function () {
            if (vm.showOneSelect == ' ') {
                vm.showOneSelect = '';
                vm.showTwoSelect = '';
                vm.showThreeSelect = '';
                vm.showTwoList = [];
                vm.showThreeList = [];
                vm.selectShowResult = {};
                vm.selectShowResult.showClassifyOne = vm.showOneSelect;
                vm.selectShowResult.showClassifyTwo = vm.showTwoSelect;
                vm.selectShowResult.showClassifyThree = vm.showThreeSelect;
                console.log(vm.selectShowResult)
            } else {
                initialShowTwo(vm.showOneSelect)
            }
        }

        vm.selectSTwoChange = function () {
            if (vm.showTwoSelect == ' ') {
                vm.showTwoSelect = '';
                vm.showThreeSelect = '';
                vm.showThreeList = [];
                vm.selectShowResult = {};
                vm.selectShowResult.showClassifyOne = vm.showOneSelect;
                vm.selectShowResult.showClassifyTwo = vm.showTwoSelect;
                vm.selectShowResult.showClassifyThree = vm.showThreeSelect;
                console.log(vm.selectShowResult)
            } else {
                initialShowThree(vm.showThreeSelect)
            }

        }
        vm.selectSThreeChange = function () {
            if (vm.showThreeSelect == ' ') {
                vm.showThreeSelect = '';
            }
            vm.selectShowResult = {};
            vm.selectShowResult.showClassifyOne = vm.showOneSelect;
            vm.selectShowResult.showClassifyTwo = vm.showTwoSelect;
            vm.selectShowResult.showClassifyThree = vm.showThreeSelect;
            console.log(vm.selectShowResult)
        }
    }


    vm.menuLen = 4;
    vm.pageParams = {
        bean: 'wmsStockTake',
        method: 'pageQryStockTakeItem',
        stocktakeCode: vm.stockCode,
        qryType:1,
        page: 1,
        rows: 10
    }
    vm.column = [
        {
            field: "line_no",
            displayName: '序号',
            width: '8%',
        },
        {
            field: "product_id",
            displayName: '商品编号',
            width: '8%',
        },
        {
            field: "product_name",
            displayName: '商品名称',
            width: '15%',
        },
        {
            field: "cateName",
            displayName: '分类',
            width: '8%',
        },
        {
            field: "spuUnit",
            displayName: '单位',
            width: '8%',
        },
        {
            field: "inventory_status",
            displayName: '是否良品',
            width: '8%',
            cellTemplate: '<div style="padding:5px">{{row.entity.inventory_status=="GOOD"?"良品":(row.entity.inventory_status=="BAD"?"不良品":row.entity.inventory_status)}}</div>'
        },
        {
            field: "status",
            displayName: '状态',
            width: '10%',
            cellTemplate: '<div style="padding:5px">{{grid.appScope.$parent.matchBillType(row.entity.status)}}</div>'
        },
        {
            field: "owner_name",
            displayName: '货主',
            width: '8%',
        },
        {
            field: "supplier_name",
            displayName: '供应商',
            width: '8%',
        },
        {
            field: "locationName",
            displayName: '所在库位',
            width: '8%'
        },
        {
            field: "amount_quantity",
            displayName: '账存数量',
            width: '10%'
        },
        {
            name: "盘点人",
            displayName: '盘点人',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{grid.appScope.$parent.allocation.alloctType=="01"?row.entity.primary_name:row.entity.replay_name}}</div>'
        },
        {
            name: "分配时间",
            displayName: '分配时间',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{grid.appScope.$parent.allocation.alloctType=="01"?row.entity.primary_time:row.entity.replay_time}}</div>'
        }
    ]
    vm.getPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.pageParams
        }).success(function (data) {
            vm.data = data;
        })
    };
    vm.getPage();

    function initial() {
        $("#id_code").val(vm.stockCode);
        $("#id_warehouseName").val(vm.warehouseName);
        $("#id_startTime").val(vm.startTime);
        $("#id_endTime").val(vm.endTime);
        $("#id_createTime").val(vm.creatTime);


        vm.dictTypeName = '盘点任务状态';
        BillManage.getBillTypeList(vm).success(function (data) {
            vm.billLst = data.rows;
        });
    }

    initial();

    //单据类型匹配
    $scope.matchBillType = function (billType) {
        for (var i = 0; i < vm.billLst.length; i++) {
            if (vm.billLst[i].dataValue == billType) {
                return vm.billLst[i].dataName;
            }
        }
        return billType;
    }

    //搜索
    vm.getPageByFilter = function () {
        if(vm.ownerEntity.getSelectedRows().length>0){
          vm.ownerId=  vm.ownerEntity.getSelectedRows()[0].userId
        }else {
            vm.ownerId ="";
        }
        if(vm.locationEntity.getSelectedRows().length>0){
            vm.locationId=  vm.locationEntity.getSelectedRows()[0].id
        }else {
            vm.locationId ="";
        }

        if(vm.regionEntity.getSelectedRows().length>0){
            vm.areaId=  vm.regionEntity.getSelectedRows()[0].id;
        }else {
            vm.areaId ="";
        }


        vm.pageParams = {
            stocktakeCode: vm.stockCode,
            bean: 'wmsStockTake',
            method: 'pageQryStockTakeItem',
            page: 1,
            rows: 10,
            qryType:1,
            productId: $.trim($("#id_goodsCode").val()),
            ownerId:  vm.ownerId ,
            locationId:  vm.locationId,
            status: $.trim($("#id_Status").val()),
            areaId:   vm.areaId,
        }
        vm.getPage();
    }


    vm.viewDetail = function () {
            var str ="";
            for(var i=0;i<vm.entity.getSelectedRows().length;i++){
                str +=vm.entity.getSelectedRows()[i].stocktakeItemId+","
            }
            if (  str.charAt( str.length-1)== ",") {
                str= str.substring(0, str.length-1);
            }
            window.location.href = "#/wms/inventory/stocktaking/checkallocat?code="+vm.stockCode+"&ItemId="+str+"&wareHouseId="+ vm.wareHouseId+"&alloctType="+vm.alloctType ;


    }
    vm.viewDetail2 = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请至少选择一条记录');
            return false;
        }
        var str ="";
        for(var i=0;i<vm.entity.getSelectedRows().length;i++){
            str +=vm.entity.getSelectedRows()[i].stocktakeItemId+","
        }
        if (  str.charAt( str.length-1)== ",") {
            str= str.substring(0, str.length-1);
        }
        window.location.href = "#/wms/inventory/stocktaking/checkallocat?code="+vm.stockCode+"&ItemId="+str+"&wareHouseId="+ vm.wareHouseId+"&alloctType="+vm.alloctType ;


    }
    //盘点分配生效
    vm.allocatioActive  = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请至少选择一条记录');
            return false;
        }
        vm.stocktakeItemIds = [];
        for(var i=0;i<vm.entity.getSelectedRows().length;i++){
            vm.stocktakeItemIds.push(vm.entity.getSelectedRows()[i].stocktakeItemId)
        }

        vm.params  ={
            stocktakeCode:vm.stockCode,
            dealType:vm.alloctType,
            stocktakeItemIds: vm.stocktakeItemIds

        }
        BillManage.stockTakeItemActive(vm).success(function(data) {
            if (data.additionalMsg.status == '00') {
                msgAlert.info('盘点分配成功');
                vm.back();
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });
    }

    vm.back =function () {
        window.location.href="#/wms/inventory/stocktaking";
    }
    /*********** **************************************************获取ums货主信息************************************************************************************/
    vm.ownerColumn = [
        {
            field: 'userId',
            displayName: '货主id',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "nickName",
            displayName: '货主名称',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.placeholder_ownerName = '请输入货主';
    vm.icon_owner = 'plus';
    vm.ownerParams = {
        bean: 'user',
        method: 'pageOUsersByUserId',
        page: 1,
        rows: 10,
        userType: 4,
        ownerType: 1
    }
    vm.ownerPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.ownerParams
        }).success(function (data) {
            vm.ownerData = data;
        })
    }
    vm.ownerPage();
    /*******************************************************************获取库区列表*******************************************************************************/
    vm.regionColumn = [
        {
            field: 'id',
            displayName: 'ID',
            visible: false,
        }, {
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
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });

    };
    vm.region_params = {
        bean: 'wmsWarehouseArea',
        method: 'page',
        wareHouseId: vm.wareHouseId,
        page: 1,
        rows: 10
    }
    vm.regionPage();
    //库区选择监听
    vm.regionLinsener = function () {
        vm.locationrParams = {
            bean: 'wmsWarehouseLocation',
            method: 'page',
            page: 1,
            rows: 10,
            areaId: vm.regionEntity.getSelectedRows()[0].id
        }
        vm.locationPage();
    }
    /*********** **************************************************获取库位信息************************************************************************************/
    vm.locationColumn = [
        {
            field: 'id',
            displayName: '库位编号',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "name",
            displayName: '库位名称',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.placeholder_locationName = '请输入库位';
    vm.icon_location = 'plus';

    vm.locationPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.locationrParams
        }).success(function (data) {
            vm.locationrData = data;
        })
    }
}])


