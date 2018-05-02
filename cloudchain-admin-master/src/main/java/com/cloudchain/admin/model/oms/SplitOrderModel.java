package com.cloudchain.admin.model.oms;

import com.cloudchain.oms.pojo.po.sale.OmsSaleOrderItem;

import java.util.List;

/**
 * Created by lihao on 2017/5/6.
 */
public class SplitOrderModel {
    String orderId;

    List<OmsSaleOrderItem> items;

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public List<OmsSaleOrderItem> getItems() {
        return items;
    }

    public void setItems(List<OmsSaleOrderItem> items) {
        this.items = items;
    }

}
