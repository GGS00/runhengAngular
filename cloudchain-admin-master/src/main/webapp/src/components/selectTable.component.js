angular
    .module('MetronicApp')
    .component('selectTable', {
        bindings: {
            stValue: '<',
            stCombo:'&',
            stText: '<',
            stIcon:'<',
            stHttp:'<',
            stParam:'<',
            stId:'<',
            stSupplier:'<',
            stOwner:'<'
        },
        templateUrl: '/dist/tpl/components/selectTable.view.html',
        controller: function($scope){
            var vm = this;
            $scope.stText = vm.stText;
            $scope.stIcon = vm.stIcon;

            vm.$onChanges = function (changes) {
                vm.test = changes.stValue.currentValue;
                $scope.init = false;
                $scope.stParam = vm.stParam;
                if(vm.stParam){
                    $.ajax({
                        url:vm.stHttp,
                        data:{
                            productCode:vm.stParam,
                            id:vm.stId,
                            supplierId:vm.stSupplier,
                            ownerId:vm.stOwner
                        },
                        type:"post",
                        dataType:"json",
                        success:function(data){
                            $scope.invNum = data;
                        },
                        error:function(){
                            msgAlert.text('系统繁忙 >﹏<');
                        }
                    })
                }
            };
            $scope.init = false;
            $scope.useInfo = function($event) {
                $event.stopPropagation();
                if(!$scope.init){

                }
                $scope.init = !$scope.init;
            }

            $("body:not(:has('xxxxx'))").on("click",function(e){//js

                    $scope.$apply(function(){

                        $scope.init=false;

                    })

            })

        },
        controllerAs:'st',
        transclude:true
    })

