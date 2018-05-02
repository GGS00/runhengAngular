package com.cloudchain.admin.model.tms;

import com.cloudchain.tms.pojo.vo.OrderGoodsModel;

import java.util.List;

/**
 * Created by LiuKai on 2017/3/1.
 */
public class TmsOrderGoodsModel {

    private List<OrderGoodsModel> orderGoodsList;

    public List<OrderGoodsModel> getOrderGoodsList() {
        return orderGoodsList;
    }

    public void setOrderGoodsList(List<OrderGoodsModel> orderGoodsList) {
        this.orderGoodsList = orderGoodsList;
    }
}
