angular
    .module('MetronicApp')
    .component('pickCount', {
        templateUrl: '/d2p/dist/tpl/components/pickCount.view.html',
        controller: 'pickCountCtrl',
        controllerAs: 'pickCount',
        bindings: {
            pcIndex: '<'
        }
    })
    .controller('pickCountCtrl', pickCountCtrl)
    .service('pickCount', pickCount)

pickCountCtrl.$inject = ['$timeout','$scope','$http','uiGridConstants','$log','pickCount'];


function pickCountCtrl($timeout,$scope,$http,uiGridConstants,$log,pickCount) {
    var vm = this;
    $scope.pcIndex = vm.pcIndex;


    $scope.reduce = function(index){
        var t = $(".text_box_"+index);
        if (parseInt(t.val())==1){
            $('.min_'+index).attr('disabled',true);
            return false;
        }
        t.val(parseInt(t.val())-1);
    }

    $scope.add = function(index){
        var t = $(".text_box_"+index);
        if (parseInt(t.val())!=1){
            $('.min_'+index).attr('disabled',false);
        }
        t.val(parseInt(t.val())+1)
    }

    //初始化数量为1,并失效减
    $('.min_'+$scope.pcIndex).attr('disabled',true);

}


function pickCount(){
    var selectResult = "";
    return {
        setSelect: function(value) {
            selectResult = value;
        },
        getSelect: function () {
            return selectResult
        },
    }
}
