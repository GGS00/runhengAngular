/**
 * Created by shaobinhua on 2017/3/16.
 */
angular.module('MetronicApp').controller('goodSettingBrandController',function($rootScope, $scope, $http, uiGridConstants,Goods,commonUtil) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    vm.pageParams = {
        bean:'brand',
        method:'page',
        page:1,
        rows:10
    }

    vm.column = [
        {   field: "bId",
            displayName: '编号',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {   field: "name",
            displayName: '品牌名称',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "fullName",
            displayName: '适用商品分类',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "creator",
            displayName: '创建人',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "createdTime",
            displayName: '创建时间',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  name:'操作',
            cellTemplate:"<div class='ui-grid-cell-contents'><a ui-sref='goods.setting.brandedit({Id:row.entity.bId})'>修改</a>&nbsp;" +
            "<a style='color: red' ng-click='grid.appScope.$parent.list.del(row.entity.bId)'>删除</a></div>"
        }
    ]

    vm.del = function (id) {
        vm.removeBrand(id)
    }

    vm.removeBrand = function (i) {
        Goods.removeBrand(i).success(function (data) {
            if(data.status == "00"){
                msgAlert.text('删除成功');
                vm.getPage();
                vm.entity.clearSelectedRows();
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                vm.entity.clearSelectedRows();

            }
        })
    }

    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            console.log(data)
            vm.data = data;
        });
    };
    vm.getPage();


    vm.deleteBrand = function(){

        vm.deleteList = [];

        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要删除的品牌');
            return false;

        }else{

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.deleteList.push(vm.entity.getSelectedRows()[i].bId);
            }

            vm.removeBrand(vm.deleteList)
        }

    }


    vm.getPageByFilter = function(){
        var beginTime = $('.arrivalTime span').html();
        if(beginTime == undefined || beginTime == "-"){
            beginTime ="";
            var endTime ="";
        }else{
            beginTime = $('.arrivalTime span').html().slice(0,10);
            var endTime = $('.arrivalTime span').html().slice(11,21);
        }
        if(vm.selectResult.goodsClassifyTwo!=''){
            if(vm.selectResult.goodsClassifyThree!=''){
                vm.categoryFullId = vm.selectResult.goodsClassifyThree;
            }else{
                vm.categoryFullId = vm.selectResult.goodsClassifyTwo;
            }
        }else{
            vm.categoryFullId = vm.selectResult.goodsClassifyOne;
        }

        // if(purchaseId == "" && supplierName == "" && warehouseName =="" && state == "" && beginTime==""){
        //     msgAlert.text('搜索条件不能为空');
        //     return false;
        // }
        vm.pageParams = {
            bId:vm.bId,
            categoryId:vm.categoryFullId,
            bName:vm.bName,
            beginTime:beginTime,
            endTime:endTime,
            bean:'brand',
            method:'page',
            page:1,
            rows:10
        }
        vm.getPage();
    }



    initialGoods()

    function initialGoods(){
        $(".select2me").select2();
        $(".select2").css('width','auto');
        initialGoodsOne(0);
        function initialGoodsOne(id){
            vm.goodsOne = id;
            $http({url:"/category/getCategoryChildren/"+vm.goodsOne,method: "get",
                params:{
                }
            }).success(function(data) {
                vm.goodsOneSelect= '';
                /*vm.goodsOneSelect = data.data[0].cId;*/
                vm.goodsOneList = data.data;
                if(vm.goodsOneSelect = ''){
                    vm.goodsTwoSelect = '';
                    vm.goodsThreeSelect= '';
                    vm.selectResult={};
                    vm.selectResult.goodsClassifyOne = vm.goodsOneSelect;
                    vm.selectResult.goodsClassifyTwo = vm.goodsTwoSelect;
                    vm.selectResult.goodsClassifyThree = vm.goodsThreeSelect;
                    console.log(vm.selectResult)
                }else{
                    initialGoodsTwo(vm.goodsOneSelect);
                }

            })
        }

        function initialGoodsTwo(id){
            vm.goodsTwo = id;
            console.log(vm.goodsTwo)
            if(vm.goodsTwo == ''){
                vm.goodsTwoSelect = '';
                vm.goodsThreeSelect= '';
                vm.selectResult={};
                vm.selectResult.goodsClassifyOne = vm.goodsOneSelect;
                vm.selectResult.goodsClassifyTwo = vm.goodsTwoSelect;
                vm.selectResult.goodsClassifyThree = vm.goodsThreeSelect;
                console.log(vm.selectResult)
            }else{
                $http({url:"/category/getCategoryChildren/"+vm.goodsTwo,method: "get",
                    params:{
                    }
                }).success(function(data) {
                    vm.goodsTwoSelect= '';
                    vm.goodsTwoList = data.data;
                    if(vm.goodsTwoSelect !=''){
                        initialGoodsThree(vm.goodsTwoSelect);
                    }else{
                        vm.goodsThreeSelect= '';
                        vm.selectResult={};
                        vm.selectResult.goodsClassifyOne = vm.goodsOneSelect;
                        vm.selectResult.goodsClassifyTwo = vm.goodsTwoSelect;
                        vm.selectResult.goodsClassifyThree = vm.goodsThreeSelect;
                        console.log(vm.selectResult)
                    }
                })
            }

        }

        function initialGoodsThree(id){
            vm.goodsThree = id;
            if(vm.goodsThree ==''){
                vm.selectResult={};
                vm.selectResult.goodsClassifyOne = vm.goodsOneSelect;
                vm.selectResult.goodsClassifyTwo = vm.goodsTwoSelect;
                vm.selectResult.goodsClassifyThree = vm.goodsThreeSelect;
                console.log(vm.selectResult)
            }else{
                $http({url:"/category/getCategoryChildren/"+ vm.goodsThree,method: "get",
                    params:{
                    }
                }).success(function(data) {
                    vm.goodsThreeSelect = '';
                    vm.goodsThreeList = data.data;
                    vm.selectResult={};
                    vm.selectResult.goodsClassifyOne = vm.goodsOneSelect;
                    vm.selectResult.goodsClassifyTwo = vm.goodsTwoSelect;
                    vm.selectResult.goodsClassifyThree = vm.goodsThreeSelect;
                    console.log(vm.selectResult)
                })
            }
        }
        vm.selectGOneChange = function(){

            if(vm.goodsOneSelect==' '){
                vm.goodsOneSelect = '';
                vm.goodsTwoSelect = '';
                vm.goodsThreeSelect = '';
                vm.goodsTwoList = [];
                vm.goodsThreeList = [];
                vm.selectResult={};
                vm.selectResult.goodsClassifyOne = vm.goodsOneSelect;
                vm.selectResult.goodsClassifyTwo = vm.goodsTwoSelect;
                vm.selectResult.goodsClassifyThree = vm.goodsThreeSelect;
                console.log(vm.selectResult)
            }else{
                initialGoodsTwo(vm.goodsOneSelect)
            }
        }

        vm.selectGTwoChange = function(){
            if(vm.goodsTwoSelect==' '){
                vm.goodsTwoSelect = '';
                vm.goodsThreeSelect = '';
                vm.goodsThreeList = [];
                vm.selectResult={};
                vm.selectResult.goodsClassifyOne = vm.goodsOneSelect;
                vm.selectResult.goodsClassifyTwo = vm.goodsTwoSelect;
                vm.selectResult.goodsClassifyThree = vm.goodsThreeSelect;
                console.log(vm.selectResult)
            }else{
                initialGoodsThree(vm.goodsTwoSelect)
            }

        }
        vm.selectGThreeChange = function(){
            if(vm.goodsThreeSelect==' '){
                vm.goodsThreeSelect = '';
            }
            vm.selectResult={};
            vm.selectResult.goodsClassifyOne = vm.goodsOneSelect;
            vm.selectResult.goodsClassifyTwo = vm.goodsTwoSelect;
            vm.selectResult.goodsClassifyThree = vm.goodsThreeSelect;
            console.log(vm.selectResult)
        }
    }


})