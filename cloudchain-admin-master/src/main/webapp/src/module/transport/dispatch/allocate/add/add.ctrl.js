angular.module('MetronicApp').controller('addNewDispatchController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','dispatch','commonUtil', function($rootScope, $scope, $http, uiGridConstants,settings, dispatch,commonUtil) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;
        vm.pageParams = {
            bean:'tmsSegment',
            method:'page',
            status: 'UN_DISPATCH',
            page:1,
            rows:10
        }

        vm.column = [
            {   field: "way_bill_code",
                displayName: '运单号',
                width:150,
                enableCellEdit: true,
                enableCellEditOnFocus:true
            },
            {  field: "code",
                displayName: '订单号',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {  field: "fromProvince",
                displayName: '发货地',
                enableCellEdit: true,
                width:300,
                enableCellEditOnFocus:true,
                cellTemplate:'<div style="padding:5px">{{row.entity.fromProvince}}{{row.entity.fromCity}}{{row.entity.fromDistrict}}{{row.entity.fromAddress}}</div>'
            },
            {  field: "fromContactor",
                displayName: '发货人',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {  field: "fromMobile",
                displayName: '发货人联系方式',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {  field: "toProvince",
                displayName: '收货地',
                enableCellEdit: true,
                width:300,
                enableCellEditOnFocus:true,
                cellTemplate:'<div style="padding:5px">{{row.entity.toProvince}}{{row.entity.toCity}}{{row.entity.toDistrict}}{{row.entity.toAddress}}</div>'
            },
            {  field: "toContactor",
                displayName: '收货人',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {  field: "toMobile",
                displayName: '收货人联系方式',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            }
        ]


        vm.getPageByFilter = function(){
            var wayBillCode = $('input[name="wayBillCode"]').val();
            var code = $('input[name="code"]').val();
            if(code == "" && wayBillCode ==""){
                msgAlert.text('搜索条件不能为空');
                return false;
            }
            vm.pageParams = {
                bean:'tmsSegment',
                method:'page',
                status: 'UN_DISPATCH',
                wayBillCode:wayBillCode,
                code:code,
                page:1,
                rows:10
            }
            vm.getPage();
        }

        vm.getPage = function () {

            commonUtil.getList(vm.pageParams).success(function(data) {
                console.log(data)
                vm.data = data;
            });
        };
        vm.getPage();

        vm.nextToAddDrivers = function(){
            vm.selectDispatch = [];
            vm.truckLoadType = $('.truckLoadType').val();
            if(vm.entity.getSelectedRows().length == 0){

                msgAlert.text('请先选择调度的货物');
                return false;

            }else if(vm.truckLoadType == ' '){
                msgAlert.text('请先选择配置方式');
                return false;
            }else{
                for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                    vm.selectDispatch.push(vm.entity.getSelectedRows()[i].id);
                }

                var storage = window.localStorage;
                storage["orderSelect"] = JSON.stringify(vm.entity.getSelectedRows());
                storage["truckLoadType"] = vm.truckLoadType;
                window.location.href="#/transport/dispatch/allocate/addsteptwo";

            }
        }


    }])


    .controller('selectDispatchController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','dispatch','commonUtil', function($rootScope, $scope, $http, uiGridConstants,settings, dispatch,commonUtil) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;
        vm.pageParams = {
            bean:'tmsVehicle',
            method:'page',
            page:1,
            rows:10
        }


        vm.column = [
            {  field: "no",
                displayName: '车牌号',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {   field: "vehiclePropertyName",
                displayName: '车辆属性',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {   field: "type_name",
                displayName: '车辆类型',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {   field: "vehicleModel",
                displayName: '车辆型号',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {   field: "produce_date",
                displayName: '生产日期',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {   field: "purchase_date",
                displayName: '购买日期',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {  field: "CITY_ID",
                displayName: '常驻城市',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {  field: "description",
                displayName: '描述',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {  field: "drivingLisenceCode",
                displayName: '行驶证一维码',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {  field: "drivingLisenceRegisTime",
                displayName: '行驶证注册日期',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {  field: "mainDriverName",
                displayName: '主司机',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {  field: "secondDriverName",
                displayName: '副司机',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {  field: "gps_No",
                displayName: 'GPS设备号',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {  field: "engineNo",
                displayName: '发动机编号',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
            {   field: "vin",
                displayName: '车辆识别码',
                enableCellEdit: true,
                width:150,
                enableCellEditOnFocus:true
            },
        ]



        vm.getPage = function () {

            commonUtil.getList(vm.pageParams).success(function(data) {
                vm.data = data;
            });
        };
        vm.getPage();

        vm.getPageByFilter = function(){
            var no = $('input[name="no"]').val();
            if(no == ""){
                msgAlert.text('搜索条件不能为空');
                return false;
            }
            vm.pageParams = {
                bean:'tmsVehicle',
                method:'page',
                no:no,
                page:1,
                rows:10
            }
            vm.getPage();
        }

        vm.confirmVehicle = function(){
            vm.transType  = $('.transType').val();
            if(vm.entity.getSelectedRows().length == 0){

                msgAlert.text('请先选择载具');
                return false;

            }else if(vm.transType == ' '){
                msgAlert.text('请先选择运输方式');
                return false;
            }else{
                vm.selectVehicleList = vm.entity.getSelectedRows();
                vm.mobile=[];
                vm.secondMobile=[];
                vm.pageParams = {
                    bean:'user',
                    method:'pageGetDriverList',
                    userType:3,
                    page:1,
                    rows:10
                }
                commonUtil.getList(vm.pageParams).success(function(data) {
                    vm.driversList = data.rows;
                    for(var i = 0 ; i < vm.selectVehicleList.length ; i++){
                        for(var j = 0 ; j < vm.driversList.length ; j++){
                            if(vm.selectVehicleList[i].MAIN_DRIVER_ID == vm.driversList[j].userId){
                                vm.mobile[i]=vm.driversList[j].mobile;
                            }
                            if(vm.selectVehicleList[i].SECOND_DRIVER_ID == vm.driversList[j].userId){
                                vm.secondMobile[i]=vm.driversList[j].mobile;
                            }
                        }
                    }
                });
                $('#selectCommonContacts').modal('show');


                vm.searchMainMobile = function(id,index){
                    if(id == ' '){
                        vm.mobile[index]='';
                    }else{
                        for(var i = 0 ; i < vm.driversList.length ; i++){
                            if(vm.driversList[i].userId == id ){
                                vm.mobile[index]=vm.driversList[i].mobile;
                            }
                        }
                    }
                    console.log(vm.mobile)
                }


                vm.searchSecondMobile = function(id,index){
                    console.log(id)
                    if(id == ' '){
                        vm.secondMobile[index]='';
                    }else{
                        for(var i = 0 ; i < vm.driversList.length ; i++){
                            if(vm.driversList[i].userId == id ){
                                vm.secondMobile[index]=vm.driversList[i].mobile;
                            }
                        }
                    }

                }


            }

        }

        vm.confirmDrivers = function(){

            vm.vehicleDList = "["
            for (var i = 0; i < vm.entity.getSelectedRows().length; i++) {
                var mainDriverMobile = $(".vehicle_"+i).find('input[name="mainDriverMobile"]').val();
                var mainDriverName = $(".vehicle_"+i).find('.mainDriver option:selected').text();
                var mainDriverId = $(".vehicle_"+i).find('.mainDriver').val();
                var secondDriverMobile = $(".vehicle_"+i).find('input[name="secondDriverMobile"]').val();
                if(secondDriverMobile==" "){
                    secondDriverMobile = "";
                }
                var secondDriverId = $(".vehicle_"+i).find('.secondDriver').val();
                if(secondDriverId==" "){
                    secondDriverId = "";
                }
                var secondDriverName = $(".vehicle_"+i).find('.secondDriver option:selected').text();
                if(secondDriverName=='选择副司机'){
                    secondDriverName = '';
                }
                var description = $(".vehicle_"+i).find('input[name="description"]').val();
                var vehicleInfo = $(".vehicle_"+i).find('input[name="vehicleInfo"]').val();
                var vehicleZZ = $(".vehicle_"+i).find('input[name="vehicleZZ"]').val();
                var vehicleId = $(".vehicle_"+i).find('input[name="vehicleId"]').val();

                if( mainDriverId == " "){
                    msgAlert.text('请选择第'+ (i+1) +'条主司机信息');
                    return false;
                }
                if(mainDriverMobile == ""){
                    msgAlert.text('请将第'+ (i+1) +'条信息填写完整');
                    return false;
                }
                var jsonText = {};
                jsonText["mainDriverMobile"] = mainDriverMobile;
                jsonText["mainDriverName"] = mainDriverName;
                jsonText["mainDriverId"] = mainDriverId;
                jsonText["secondDriverMobile"] = secondDriverMobile;
                jsonText["secondDriverName"] = secondDriverName;
                jsonText["secondDriverId"] = secondDriverId;
                jsonText["description"] = description;
                jsonText["vehicleInfo"] = vehicleInfo;
                jsonText["vehicleZZ"] = vehicleZZ;
                jsonText["vehicleId"] = vehicleId;
                if(i<(vm.entity.getSelectedRows().length-1)){
                    vm.vehicleDList+=JSON.stringify(jsonText)+",";
                }else{
                    vm.vehicleDList+=JSON.stringify(jsonText);
                }
            }
            vm.vehicleDList += "]";
            console.log(vm.vehicleDList);
            for (var i = 0; i < vm.entity.getSelectedRows().length; i++) {
                var mainDriverId = $(".vehicle_"+i).find('.mainDriver').val();
                var n =(vm.vehicleDList.split(mainDriverId)).length-1;
                if(n > 1){
                    msgAlert.text('一个司机不能配载到不同车辆上且不能同时作为主副司机');
                    return false;
                }
            }
            var storage = window.localStorage;
            storage["vehicleDrivers"] = vm.vehicleDList;
            storage["transType"] = vm.transType;
            $('.modal-backdrop.fade.in').css('display',"none");
            window.location.href="#/transport/dispatch/allocate/addstepthree";
        }

    }])



    .controller('finalDispatchController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','dispatch','commonUtil', function($rootScope, $scope, $http, uiGridConstants,settings, dispatch,commonUtil) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        var storage = window.localStorage;
        console.log(JSON.parse(storage["orderSelect"]));
        console.log(JSON.parse(storage["vehicleDrivers"]));
        console.log(storage["truckLoadType"]);
        console.log(storage["transType"]);
        vm.vehicleDList = JSON.parse(storage["vehicleDrivers"]);
        vm.orderSelectList = JSON.parse(storage["orderSelect"]);
        vm.payList = [0];
        vm.payWay = 0;

        vm.pageParams = {
            bean:'tmsPlatForm',
            method:'page',
            page:1,
            rows:10
        }

        vm.addNewPay = function(){

            vm.payList.push(vm.payList[vm.payList.length-1]+1);
            console.log(vm.payList)

        };

        vm.removePay = function(index){

            vm.payList.splice(index,1)
            console.log(vm.payList)

        };

        vm.addLines = function(index){
            vm.indexList = index;
            for(var i = 0 ; i < vm.orderSelectList.length ; i++){
                $('#checkbox'+ i).attr('checked',false);
            }
            $('#selectLines').modal('show')
        }
        vm.orderFinSelect = [];
        vm.confirmOrders = function(x){

            vm.orderCheck = [];
            for(var i = 0 ; i < vm.orderSelectList.length ; i++){
                if($('#checkbox'+ i).is(':checked')){
                    vm.orderCheck.push($('.orderNum' + i).attr('orderNum'));
                };
            }
            vm.orderFinSelect[x] =  vm.orderCheck;

            if(vm.orderFinSelect[x].length == 0 ){
                msgAlert.text('请选择要配载的运单');
            }else{

                console.log(vm.orderFinSelect[x]);
                $('#selectLines').modal('hide');
            }

        }


        vm.column = [
            {   field: "name",
                displayName: '状态',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            },
            {  field: "controller",
                displayName: '车船',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            },
            {  field: "address",
                displayName: '核载(吨)',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            },
            {  field: "tel",
                displayName: '运输队',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            },
            {  field: "description",
                displayName: '描述',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            }
        ]



        vm.getPage = function () {

            commonUtil.getList(vm.pageParams).success(function(data) {
                vm.data = data;
            });

        };
        vm.getPage();

        vm.backToDispatch=function(){
            window.location.href="#/transport/dispatch/allocate";
        }

        vm.submit = function(){

            //提交入参
            for (var i = 0; i < vm.vehicleDList.length; i++) {
                var segmentIdL = $('.segmentIds_'+i).find('.orderNumShow').html();

                if(segmentIdL==undefined){
                    msgAlert.text('请选择运单进行配载');
                    return false;
                }
               vm.segmentIdsList =[];
               for(var j = 0; j < $('.segmentIds_'+ i).find('.orderNumShow').length; j++){
                   vm.segmentIdsList.push($('.segmentIds_'+i).find('.orderNumShow').eq(j).attr('segmentId'));
               }
               $('#segmentIds'+i).val(vm.segmentIdsList.join());
            }

            /*分摊规则*/
            var apportionType = $('select[name="dispatchFee.apportionType"]').val();
            if(apportionType==" "){
                msgAlert.text('请选择分摊规则');
                return false;
            }
            /*订单金额*/
            if(vm.payWay == 0){
                //按整单
                if(vm.wholeMoneyNum == ""||vm.wholeMoneyNum==undefined){
                    msgAlert.text('请填写完整总运费');
                    return false;
                }
            }
            var cashFee = $('input[name="dispatchFee.cashFee"]').val();
            var toPayFee = $('input[name="dispatchFee.toPayFee"]').val();
            var receiptFee = $('input[name="dispatchFee.receiptFee"]').val();
            var monthlyFee = $('input[name="dispatchFee.monthlyFee"]').val();
            var receiverPayFee = $('input[name="dispatchFee.receiverPayFee"]').val();
            var planDepartureTime = $('.planDepartureTime span').html();
            var planArrivalTime = $('.planArrivalTime span').html();
            if(cashFee == "" && toPayFee=="" && receiptFee ==""&& monthlyFee ==""&& receiverPayFee ==""){
                msgAlert.text('请将付款方式信息填写完整');
                return false;
            }

            if(vm.wholeMoneyNum !=Number(Number(cashFee)+Number(toPayFee)+Number(receiptFee)+Number(monthlyFee)+Number(receiverPayFee))){
                msgAlert.text('合计与付款总额不等，请重新填写');
                return false;
            }



            $('#planDepartureTime').val(planDepartureTime);
            $('#planArrivalTime').val(planArrivalTime);
            $('#truckLoadType').val(storage["truckLoadType"]);
            $('#transType').val(storage["transType"]);



            vm.form = $("#finalDispatch").serialize();

            vm.form = decodeURIComponent(vm.form,true)
            console.log(vm.form)

           $.ajax({
                url:"/transport/dispatch/allocate/add",
                data:vm.form,
                type:"post",
                dataType:"json",
                success:function(data){
                    if(data.additionalMsg.status== 00){

                        msgAlert.text('新增成功');
                        window.location.href="#/transport/dispatch/allocate";

                    }else if(data.additionalMsg.status== 01){
                        msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');

                    }


                },
                error:function(){
                    msgAlert.text('系统繁忙 >﹏<');
                }
            })

        }

    }])