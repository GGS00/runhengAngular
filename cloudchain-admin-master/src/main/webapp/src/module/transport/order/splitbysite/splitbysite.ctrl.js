/**
 * Created by shaobinhua on 2017/3/16.
 */
//按段拆单
angular.module('MetronicApp').controller('sepOrderController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','tmsSepOrder','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, tmsSepOrder,commonUtil,Table) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.linesList = [0];
    vm.myOption = [];

    initial();
    function initial(){

        vm.pointParams = {
            bean:'tmsPlatForm',
            method:'page',
            page:1,
            rows:10
        }
        commonUtil.getList(vm.pointParams).success(function(data) {
            vm.pointList = data.rows;
            console.log(vm.pointList)
        });

    }

    vm.selectAction = function(index){
        console.log(vm.myOption);


    }


    vm.addNewLines = function(){
        vm.linesList.push(vm.linesList[vm.linesList.length-1]+1);
        console.log(vm.myOption)
    }

    vm.removeLines = function(index){

        vm.linesList.splice(index,1);
        vm.myOption.splice(index,1)
    }

    vm.submitPoint = function() {
        //提交入参
        /*始终网点信息*/
        vm.fromPlatId = $('.fromPlatId').val();
        vm.toPlatId  = $('.toPlatId').val();
        if( vm.fromPlatId == "" || vm.toPlatId == ""){
            msgAlert.text('请将始发网点与终点网点填写完整');
            return false;
        }

        vm.arrivalTimeList = [];
        vm.shipTimeList = [];
        for (var i = 0; i < vm.linesList.length; i++) {
            vm.linePoint = $(".point_"+i).find('.linePoint').val();
            vm.lineContactor = $(".point_"+i).find('input[name="segmentPlatList['+ i +'].contactor"]').val();
            vm.lineMobile = $(".point_"+i).find('input[name="segmentPlatList['+ i +'].mobile"]').val();


            vm.planArrivalTime =  $(".point_"+i).find('.arrivalTime span').html();
            vm.planShipTime =  $(".point_"+i).find('.shipTime span').html();

            if(vm.linePoint =="" || vm.lineContactor ==""|| vm.lineMobile ==""){
                msgAlert.text('请将中转网点信息填写完整');
                return false;
            }
            $(".point_"+i).find('input[name="segmentPlatList['+ i +'].planArrivalTime"]').val(vm.planArrivalTime);
            $(".point_"+i).find('input[name="segmentPlatList['+ i +'].planShipTime"]').val(vm.planShipTime);

        }

        vm.form = $("#pointSetInfo").serialize();

        vm.form = decodeURIComponent(vm.form,true)
        console.log(vm.form)

        /*   $.ajax({
         url:"/transport/tmsOrder/add",
         data:vm.form,
         type:"post",
         dataType:"json",
         success:function(data){
         if(data.additionalMsg.status=='成功'){

         msgAlert.text('新增成功');
         window.location.href="#/tms/tmsorder";

         }else if(data.additionalMsg.status=='失败'){
         msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');

         }


         },
         error:function(){
         msgAlert.text('系统繁忙 >﹏<');
         }
         })*/

    }


}])

