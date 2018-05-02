package com.cloudchain.admin.model.tms;

import com.cloudchain.tms.pojo.po.TmsOrder;
import com.cloudchain.tms.pojo.po.TmsOrderFee;
import com.cloudchain.tms.pojo.po.TmsOrderGoods;

import java.util.List;

/**
 * Created by LiuKai on 2017/3/1.
 */
public class TmsOrderModel {

    private String fromCid;

    private String toCid;

    private TmsOrder tmsOrder;

    private TmsOrderFee tmsOrderFee;

    private List<TmsOrderGoods> orderGoodsList;

    public TmsOrder getTmsOrder() {
        return tmsOrder;
    }

    public void setTmsOrder(TmsOrder tmsOrder) {
        this.tmsOrder = tmsOrder;
    }

    public TmsOrderFee getTmsOrderFee() {
        return tmsOrderFee;
    }

    public void setTmsOrderFee(TmsOrderFee tmsOrderFee) {
        this.tmsOrderFee = tmsOrderFee;
    }

    public List<TmsOrderGoods> getOrderGoodsList() {
        return orderGoodsList;
    }

    public void setOrderGoodsList(List<TmsOrderGoods> orderGoodsList) {
        this.orderGoodsList = orderGoodsList;
    }

    public String getFromCid() {
        return fromCid;
    }

    public void setFromCid(String fromCid) {
        this.fromCid = fromCid;
    }

    public String getToCid() {
        return toCid;
    }

    public void setToCid(String toCid) {
        this.toCid = toCid;
    }
}
