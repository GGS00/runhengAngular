/* Setup TmsController page controller */
angular.module('MetronicApp').controller('d2dgoodsController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2d','commonUtil', function($rootScope, $scope, $http, uiGridConstants,settings, d2d,commonUtil) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

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

    initialShow()

    function initialShow(){
        $(".select2me").select2();
        $(".select2").css('width','auto');
        initialShowOne(0);
        function initialShowOne(id){
            vm.showOne = id;
            $http({url:"/d2d/category/queryChildren/"+vm.showOne,method: "get",
                params:{
                }
            }).success(function(data) {
                vm.showOneSelect= '';
                vm.showOneList = data.data;
                if(vm.showOneSelect = ''){
                    vm.showTwoSelect = '';
                    vm.showThreeSelect= '';
                    vm.selectShowResult={};
                    vm.selectShowResult.showClassifyOne = vm.showOneSelect;
                    vm.selectShowResult.showClassifyTwo = vm.showTwoSelect;
                    vm.selectShowResult.showClassifyThree = vm.showThreeSelect;
                    console.log(vm.selectShowResult)
                }else{
                    initialShowTwo(vm.showOneSelect);
                }
            })
        }

        function initialShowTwo(id){
            vm.showTwo = id;
            if(vm.showTwo == ''){
                vm.showTwoSelect= '';
                vm.showThreeSelect= '';
                vm.selectShowResult={};
                vm.selectShowResult.showClassifyOne = vm.showOneSelect;
                vm.selectShowResult.showClassifyTwo = vm.showTwoSelect;
                vm.selectShowResult.showClassifyThree = vm.showThreeSelect;
                console.log(vm.selectShowResult)
            }else{
                $http({url:"/d2d/category/queryChildren/"+vm.showTwo,method: "get",
                    params:{
                    }
                }).success(function(data) {
                    vm.showTwoSelect= '';
                    vm.showTwoList = data.data;
                    if(vm.showTwoSelect !=''){
                        initialShowThree(vm.showTwoSelect);
                    }else{
                        vm.showThreeSelect= '';
                        vm.selectShowResult={};
                        vm.selectShowResult.showClassifyOne = vm.showOneSelect;
                        vm.selectShowResult.showClassifyTwo = vm.showTwoSelect;
                        vm.selectShowResult.showClassifyThree = vm.showThreeSelect;
                        console.log(vm.selectShowResult)
                    }
                })
            }

        }

        function initialShowThree(id){
            vm.showThree = id;
            if(vm.showThree ==''){
                vm.selectShowResult={};
                vm.selectShowResult.showClassifyOne = vm.showOneSelect;
                vm.selectShowResult.showClassifyTwo = vm.showTwoSelect;
                vm.selectShowResult.showClassifyThree = vm.showThreeSelect;
                console.log(vm.selectShowResult)
            }else{
                $http({url:"/d2d/category/queryChildren/"+ vm.showThree,method: "get",
                    params:{
                    }
                }).success(function(data) {
                    vm.showThreeSelect = '';
                    vm.showThreeList = data.data;
                    vm.selectShowResult={};
                    vm.selectShowResult.showClassifyOne = vm.showOneSelect;
                    vm.selectShowResult.showClassifyTwo = vm.showTwoSelect;
                    vm.selectShowResult.showClassifyThree = vm.showThreeSelect;
                    console.log(vm.selectShowResult)
                })
            }
        }
        vm.selectSOneChange = function(){
            if(vm.showOneSelect==' '){
                vm.showOneSelect = '';
                vm.showTwoSelect = '';
                vm.showThreeSelect = '';
                vm.showTwoList = [];
                vm.showThreeList = [];
                vm.selectShowResult={};
                vm.selectShowResult.showClassifyOne = vm.showOneSelect;
                vm.selectShowResult.showClassifyTwo = vm.showTwoSelect;
                vm.selectShowResult.showClassifyThree = vm.showThreeSelect;
                console.log(vm.selectShowResult)
            }else{
                initialShowTwo(vm.showOneSelect)
            }
        }

        vm.selectSTwoChange = function(){
            if(vm.showTwoSelect==' '){
                vm.showTwoSelect = '';
                vm.showThreeSelect = '';
                vm.showThreeList = [];
                vm.selectShowResult={};
                vm.selectShowResult.showClassifyOne = vm.showOneSelect;
                vm.selectShowResult.showClassifyTwo = vm.showTwoSelect;
                vm.selectShowResult.showClassifyThree = vm.showThreeSelect;
                console.log(vm.selectShowResult)
            }else{
                initialShowThree(vm.showThreeSelect)
            }

        }
        vm.selectSThreeChange = function(){
            if(vm.showThreeSelect==' '){
                vm.showThreeSelect = '';
            }
            vm.selectShowResult={};
            vm.selectShowResult.showClassifyOne = vm.showOneSelect;
            vm.selectShowResult.showClassifyTwo = vm.showTwoSelect;
            vm.selectShowResult.showClassifyThree = vm.showThreeSelect;
            console.log(vm.selectShowResult)
        }
    }

    initialBrand();
    function initialBrand(){
        d2d.queryBrand(vm).success(function(data) {
            if(data.status==00){
                vm.brandList = data.data;
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });
    }


    vm.settingWay = 0;

    vm.pageParams = {
        bean:'d2DGoodsShelve',
        method:'page',
        page:1,
        rows:10,
        shopId:0
    }

    vm.column = [
        {   field: "spuId",
            displayName: '编号',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true
        },
        {   field: "status",
            displayName: '状态',
            enableCellEdit: true,
            width:100,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.status==0?'待上架':(row.entity.status==1?'已上架':'')}}</div>"
        },
        {   field: "showPrice",
            displayName: '销售价格',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {   field: "showCategoryName",
            displayName: '展示分类',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {   field: "goodsName",
            displayName: '商品名称',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {   field: "categoryName",
            displayName: '商品分类',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {   field: "brandName",
            displayName: '品牌',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {   field: "inv",
            displayName: '库存',
            enableCellEdit: true,
            width:100,
            enableCellEditOnFocus:true
        }
    ]




    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    };
    vm.getPage();

    vm.getPageByFilter = function(){
        var spuId = $('input[name="spuId"]').val();
        var goodsName = $('input[name="goodsName"]').val();
        var state = $('.state').val();
        var brand = $('.brand').val();
        if(state == " "){
            state ="";
        }
        if(brand == " "){
            brand ="";
        }
        if(spuId == "" && goodsName == ""&& state == ""&& brand == ""&& brand == ""&& vm.selectResult.goodsClassifyOne == ""&& vm.selectShowResult.showClassifyOne == ""){
            msgAlert.text('搜索条件不能为空');
            return false;
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

        if(vm.selectShowResult.showClassifyTwo!=''){
            if(vm.selectShowResult.showClassifyThree!=''){
                vm.showCategoryFullid = vm.selectShowResult.showClassifyThree;
            }else{
                vm.showCategoryFullid = vm.selectShowResult.showClassifyTwo;
            }
        }else{
            vm.showCategoryFullid = vm.selectShowResult.showClassifyOne;
        }

        vm.pageParams = {
            categoryFullId:vm.categoryFullId,
            showCategoryFullid:vm.showCategoryFullid,
            goodsName:goodsName,
            brandId:brand,
            spuId:spuId,
            status:state,
            bean:'d2DGoodsShelve',
            method:'page',
            page:1,
            rows:10,
            shopId:0
        }
        vm.getPage();
    }


    //设置展示分类
    vm.setShowClassify  = function(){
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要修改展示分类的商品');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能修改一条商品的展示分类');

        }else{
            vm.goodsId = vm.entity.getSelectedRows()[0].goodsId;
            $('#confirmEdit').modal('show')
        }
    }

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

    d2d.queryAllNodes().success(function (data) {
        console.log(data)
        var oldbox = data.data;
        var row =  new Array();

        row.push({"id":0,"parent":"#","text":"根节点"})
        if(oldbox != null){
            for(var i=0;i<oldbox.length;i++){
                row.push({"id":oldbox[i].cId,"parent":oldbox[i].parentCId,"text":oldbox[i].name})
            }
        }
        categoryTree()
        $("#categoryTree").jstree(true).settings.core.data = row;
        $("#categoryTree").jstree(true).refresh();
        $("#categoryTree").on('changed.jstree',function(e,data){
            $scope.clickedNode = [];
            var i, j;
            for (i = 0, j = data.selected.length; i < j; i++) {
                var node = data.instance.get_node(data.selected[i]);
                if (data.instance.is_leaf(node)) {
                    $scope.clickedNode.push(node.id);
                }
            }
            console.log($scope.clickedNode  )
        });
    })

    vm.confirmEdit = function(){
        console.log($scope.clickedNode)
        if($scope.clickedNode == ''){
            msgAlert.text('请先选择分类');
            return false;
        }else{
            vm.categoryIdList = $scope.clickedNode;
            d2d.setShelveCategory(vm).success(function(data) {
                if(data.status==00){
                    $('#confirmEdit').modal('hide')
                    msgAlert.text('修改成功');
                    vm.getPage();
                }else{
                    msgAlert.text('修改失败 >﹏< ['+ data.msg+']');
                }

            });

        }
    }

    //上架
    vm.onSale = function(){
        vm.selectListOnSale = [];
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要上架的商品');
            return false;

        }else{
            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].showPrice==undefined || vm.entity.getSelectedRows()[i].showCategoryName ==undefined){
                    msgAlert.text('上架商品中存在未设置销售价格和展示分类的条目');
                    return false;
                }

                if(vm.entity.getSelectedRows()[i].status == 1){
                    msgAlert.text('上架商品中存在已上架的条目');
                    return false;
                }
                vm.selectListOnSale.push(vm.entity.getSelectedRows()[i].shelveId);
            }
            console.log(vm.selectListOnSale)
            d2d.doShelve(vm).success(function(data) {
                if(data.status==00){
                    msgAlert.text('上架成功');
                    vm.entity.clearSelectedRows();
                    vm.getPage();
                }else{
                    vm.entity.clearSelectedRows();
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                }

            });
        }
    }

    //下架
    vm.unSale = function(){
        vm.selectListUnSale = [];
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要下架的商品');
            return false;

        }else{
            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].status == 0){
                    msgAlert.text('下架商品中存在待上架的条目');
                    return false;
                }
                vm.selectListUnSale.push(vm.entity.getSelectedRows()[i].shelveId);
            }
            d2d.cancelShelve(vm).success(function(data) {
                if(data.status==00){
                    msgAlert.text('下架成功');
                    vm.entity.clearSelectedRows();
                    vm.getPage();
                }else{
                    vm.entity.clearSelectedRows();
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                }

            });
        }
    }

    vm.pages = [
        {name:'10',id:'10'},
        {name:'20',id:'20'},
        {name:'50',id:'50'},
        {name:'100',id:'100'}
    ];

    vm.selected=vm.pages[0].id;//如果想要第一个值
    vm.page = 1; //默认当前页数
    vm.maxSize = 5; //最大页码
    vm.pageSize = 10; //1页多少个



    /*每页不同条数展示*/
    vm.packChange = function(x){
        console.log(x)
        console.log(vm.goodsParams.rows)
        vm.goodsParams.rows = x;
        getGoodsList();
    }

    vm.modifySale = function(){

        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要修改销售价格的商品');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能修改一条商品的销售价格');

        }else{
            vm.goodsId = vm.entity.getSelectedRows()[0].goodsId;
            vm.settingWay = vm.entity.getSelectedRows()[0].priceType;
            vm.goodsParams = {
                bean:'d2DGoodsPrice',
                method:'page',
                page:1,
                rows:10,
                goodsId:vm.goodsId,
                shopId:0
            }
            getGoodsList();

            d2d.getNumPriceList(vm).success(function(data) {
                if(data.status==00){
                    console.log(data)
                    vm.resultMap = data.resultMap;
                    vm.priceList = data.resultMap.list;
                }else{
                    msgAlert.text('获取失败 >﹏< ['+ data.msg+']');
                }

            });

            $('#confirmPrice').modal('show')
        }
    }

    function getGoodsList(){
        commonUtil.getList(vm.goodsParams).success(function(data) {
            console.log(data)
            vm.goodsList = data.rows;
            vm.pageCount = data.total;
        });
    }

    vm.addCountPrice = function(){

        vm.priceList.push({
            bookingNum:'',
            salePrice:'',
            price:vm.resultMap.defaultPrice
        });

    }


    vm.removeGoods = function(index){

        vm.priceList.splice(index,1)

    };

    vm.checkPriceState = false;
    vm.checkCountState = false;

    vm.countChange = function(){

        var firstCount = $(".goodsPrice_0").find('input[name="specPriceList[0].minBookingNum"]').val();
        if(vm.checkCountState == true){
            if(firstCount<=0){
                msgAlert.text('最小起订量为1');
                return false;
            }else{
                for(var i = 1 ; i　<　vm.goodsList.length ; i++){
                    vm.goodsList[i].minBookingNum = firstCount;
                }
            }
        }
    }

    vm.priceChange = function(){
        var firstPrice = $(".goodsPrice_0").find('input[name="specPriceList[0].price"]').val();
        if(vm.checkPriceState == true){
            if(firstPrice<=0){
                msgAlert.text('价格大于零');
                return false;
            }else{
                for(var i = 1 ; i　<　vm.goodsList.length ; i++){
                    vm.goodsList[i].salePrice = firstPrice*100;
                }
            }
        }
    }
    vm.confirmSetPrice = function(){
        if(vm.settingWay == 0 ){
            //按规格设置价格
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            for (var i = 0; i < vm.goodsList.length; i++) {
                var minBookingNum = $(".goodsPrice_"+i).find('input[name="specPriceList['+ i +'].minBookingNum"]').val();
                var salePrice = $(".goodsPrice_"+i).find('input[name="specPriceList['+ i +'].price"]').val();
                if(minBookingNum=="" || salePrice ==""){
                    msgAlert.text('请将商品单价和数量填写正确');
                    return false;
                }

                if(minBookingNum < 1 ){
                    msgAlert.text('最小起订量最小值为1');
                    return false;
                }

                if(salePrice <= 0 ){
                    msgAlert.text('销售价格必须大于0');
                    return false;
                }

                if(!reg.test(salePrice)){
                    msgAlert.text('商品价格格式错误');
                    return false;
                }
            }
            vm.form = $("#settingWayZero").serialize();
            vm.form = decodeURIComponent(vm.form,true);
            console.log(vm.form)
            var shelvesId = $(".goodsPrice_0").find('input[name="specPriceList[0].shelvesId"]').val();
            $.ajax({
                url:"/d2d/price/setSpecPrice/" + shelvesId,
                data:vm.form,
                type:"post",
                dataType:"json",
                success:function(data){
                    if(data.status==00){

                        msgAlert.text('设置成功');
                        $('#confirmPrice').modal('hide');
                        vm.entity.clearSelectedRows();
                        vm.getPage();

                    }else{
                        msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');

                    }

                },
                error:function(){
                    msgAlert.text('系统繁忙 >﹏<');
                }
            })

        }else{
            //按数量设置价格
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            for (var i = 0; i < vm.priceList.length; i++) {
                var bookingNum = $(".goodsNum_"+i).find('input[name="numPriceList['+ i +'].bookingNum"]').val();
                var price = $(".goodsNum_"+i).find('input[name="numPriceList['+ i +'].price"]').val();
                if(bookingNum=="" || price ==""){
                    msgAlert.text('请将购买数量和最终售价填写正确');
                    return false;
                }

                if(bookingNum < 1 ){
                    msgAlert.text('购买数量最小值为1');
                    return false;
                }

                if(price <= 0 ){
                    msgAlert.text('销售价格必须大于0');
                    return false;
                }

                if(!reg.test(price)){
                    msgAlert.text('最终售价格式错误');
                    return false;
                }
            }
            //按数量设置价格
            vm.form = $("#settingWayOne").serialize();
            vm.form = decodeURIComponent(vm.form,true);
            console.log(vm.form)

            $.ajax({
                url:"/d2d/price/setNumPrice/" + vm.resultMap.shelveId,
                data:vm.form,
                type:"post",
                dataType:"json",
                success:function(data){
                    if(data.status==00){

                        msgAlert.text('设置成功');
                        $('#confirmPrice').modal('hide');
                        vm.entity.clearSelectedRows();
                        vm.getPage();

                    }else{
                        msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');

                    }

                },
                error:function(){
                    msgAlert.text('系统繁忙 >﹏<');
                }
            })



        }

    }





}])