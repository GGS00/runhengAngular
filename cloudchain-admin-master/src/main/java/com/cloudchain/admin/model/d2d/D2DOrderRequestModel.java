package com.cloudchain.admin.model.d2d;

import com.cloudchain.d2d.pojo.po.D2DOrder;
import com.cloudchain.d2d.pojo.po.D2DOrderInvoice;
import com.cloudchain.d2d.pojo.po.D2DOrderLogistics;
import com.cloudchain.d2d.pojo.po.D2DOrderPay;

/**
 * Created by zhuhao on 2017/6/14.
 */
public class D2DOrderRequestModel {
    private D2DOrder order;

    private D2DOrderInvoice orderInvoice;

    private D2DOrderLogistics orderLogistics;

    private D2DOrderPay orderPay;

    public D2DOrder getOrder() {
        return order;
    }

    public void setOrder(D2DOrder order) {
        this.order = order;
    }

    public D2DOrderInvoice getOrderInvoice() {
        return orderInvoice;
    }

    public void setOrderInvoice(D2DOrderInvoice orderInvoice) {
        this.orderInvoice = orderInvoice;
    }

    public D2DOrderLogistics getOrderLogistics() {
        return orderLogistics;
    }

    public void setOrderLogistics(D2DOrderLogistics orderLogistics) {
        this.orderLogistics = orderLogistics;
    }

    public D2DOrderPay getOrderPay() {
        return orderPay;
    }

    public void setOrderPay(D2DOrderPay orderPay) {
        this.orderPay = orderPay;
    }
}
