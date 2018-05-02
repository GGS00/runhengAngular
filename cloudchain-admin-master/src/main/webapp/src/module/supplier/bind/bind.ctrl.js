/* Setup blank page controller */
angular.module('MetronicApp').controller('bindCtrl', ['$rootScope', '$scope', 'settings','commonUtil', function($rootScope, $scope, settings,commonUtil) {
        $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });


    $scope.params ={
        bean:'goods',
        method:'page',
        page:1,
        rows:10
    }

    $scope.column = [{ field: 'spuName',
        displayName: '商品名称',
        enableCellEdit: true,
        enableCellEditOnFocus:false
    },
        {  field: "bn",
            displayName: '商品编码',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "price",
            displayName: '商品价格',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        { name:'操作',
            // cellTemplate:'<button class ="btn green" ui-sref="goods.stock({Id:row.entity.spuId})">设置库存</button>' +
            //             '<button class ="btn warning" ui-sref="goods.edit({Id:row.entity.spuId})">修改信息</button>' +
            //             '<button class ="btn yellow" ui-sref="goods.supplier({Id:row.entity.spuId})">绑定供应商</button>'
            cellTemplate: '<button class ="btn yellow" ui-sref="supplier.setting({Id:row.entity.spuId})">绑定供应商</button>'
        }
    ];

    getList()

    function getList() {
        commonUtil.getList($scope.params).success(function (data) {
            $scope.data = data
        })
    }

    
}]);
/**
 * Created by sq on 2017/3/17.
 */
