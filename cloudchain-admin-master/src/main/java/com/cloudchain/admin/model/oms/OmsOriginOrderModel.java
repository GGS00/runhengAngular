package com.cloudchain.admin.model.oms;

import com.cloudchain.oms.pojo.po.sale.OmsSaleOrderInvoice;
import com.cloudchain.oms.pojo.po.sale.OmsSaleOrderLogistics;
import com.cloudchain.oms.pojo.po.sale.origin.OmsSaleOrderItemOrigin;
import com.cloudchain.oms.pojo.po.sale.origin.OmsSaleOrderOrigin;

import java.util.List;

/**
 * Created by zhuhao on 2017/3/22.
 */
public class OmsOriginOrderModel {
    private OmsSaleOrderOrigin originOrder;

    private List<OmsSaleOrderItemOrigin> originItems;

    private OmsSaleOrderLogistics logistics;

    private OmsSaleOrderInvoice invoice;

    public OmsSaleOrderOrigin getOriginOrder() {
        return originOrder;
    }

    public void setOriginOrder(OmsSaleOrderOrigin originOrder) {
        this.originOrder = originOrder;
    }

    public List<OmsSaleOrderItemOrigin> getOriginItems() {
        return originItems;
    }

    public void setOriginItems(List<OmsSaleOrderItemOrigin> originItems) {
        this.originItems = originItems;
    }

    public OmsSaleOrderLogistics getLogistics() {
        return logistics;
    }

    public void setLogistics(OmsSaleOrderLogistics logistics) {
        this.logistics = logistics;
    }

    public OmsSaleOrderInvoice getInvoice() {
        return invoice;
    }

    public void setInvoice(OmsSaleOrderInvoice invoice) {
        this.invoice = invoice;
    }
}
