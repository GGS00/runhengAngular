angular.module('MetronicApp').controller('receiptSignDetailController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','$location','receipt','commonUtil', function($rootScope, $scope, $http, uiGridConstants,settings, $location,receipt,commonUtil) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.id =  $location.search().id;

        vm.signStatus = 'SIGNED';
        vm.denialId = "init";

        initial();

        function initial(){
            receipt.getList(vm).success(function(data) {
                vm.goodsList =data.truckGoodsList;
                vm.orderShow =data.order;
                vm.feeList =data.feeList[0];
                vm.segmentId = data.segment.id;
            });
        }

        vm.pageParams = {
            bean:'tmsDenialReason',
            method:'page',
            page:1,
            rows:10
        }

        vm.getPage = function () {

            commonUtil.getList(vm.pageParams).success(function(data) {
                vm.denialReasonList = data.rows;
            });
        };
        vm.getPage();

        vm.signForCar = function(data){
           vm.goodsSignList = data;
            $('#selectCommonContacts').modal('show')
        }

        vm.denialChange = function(){
            if(vm.denialId != 'init'){
                for(var i = 0 ; i < vm.denialReasonList.length ; i++){
                    if(vm.denialReasonList[i].id == vm.denialId){
                        vm.denialDescription = vm.denialReasonList[i].description;
                    }

                }
            }else{
                vm.denialDescription = '';
            }

        }

        vm.confirmSign = function(){
            for (var i = 0; i < vm.goodsSignList.length; i++) {
                var signWeight = $(".signDiv").find('input[name="goodsList['+i+'].signWeight"]').val();
                var signQuantity = $(".signDiv").find('input[name="goodsList['+i+'].signQuantity"]').val();
                if( signWeight == ""){
                    msgAlert.text('请填写第'+ (i+1) +'条货物的签收重量');
                    return false;
                }
                if(signQuantity == ""){
                    msgAlert.text('请填写第'+ (i+1) +'条货物的签收件数');
                    return false;
                }
                if(parseFloat(signWeight) >parseFloat(vm.goodsSignList[i].truckWeight)){
                    msgAlert.text('签收重量不能大于运载重量');
                    return false;
                }
                if(parseFloat(signQuantity) >parseFloat(vm.goodsSignList[i].truckQuantity)){
                    msgAlert.text('签收件数不能大于运载件数');
                    return false;
                }
            }
            var signPerson = $(".divSpace-white").find('input[name="signPerson"]').val();
            if(signPerson == ""){
                msgAlert.text('请填写签收人姓名');
                return false;
            }
            if(vm.signStatus == 'ALL_DENIAL'){
               if(vm.denialId =='init' ){
                   msgAlert.text('请选择拒签原因');
                   return false;
               }
            }

            vm.form = $("#signConfirm").serialize();

            vm.form = decodeURIComponent(vm.form,true)
            console.log(vm.form)

            $.ajax({
                url:"/transport/receipt/sign/doSign/"+vm.segmentId,
                data:vm.form,
                type:"post",
                dataType:"json",
                success:function(data){
                    if(data.additionalMsg.status==00){

                        msgAlert.text('签收成功');
                        $('#selectCommonContacts').modal('hide');
                        initial();

                    }else if(data.additionalMsg.status==01){
                        $('#selectCommonContacts').modal('hide');
                        msgAlert.text('失败 >﹏< ['+ data.additionalMsg.message+']');

                    }


                },
                error:function(){
                    msgAlert.text('系统繁忙 >﹏<');
                }
            })
        }


    }]);

