package com.cloudchain.util.param;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.oms.pojo.bo.purchase.OmsPurchaseOrderRequest;
import com.cloudchain.oms.pojo.po.purchase.OmsPurchaseArrivalItem;
import com.cloudchain.oms.pojo.po.purchase.OmsPurchaseOrder;
import com.cloudchain.oms.pojo.po.purchase.OmsPurchaseOrderItem;
import com.cloudchain.platform.util.Json2BeanUtil;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by zhuhao on 2017/4/20.
 */
public class OmsParamUtil {

    /**
     * Oms采购订单请求封装
     * @param omsPurchaseOrder
     * @param itemData
     * @param arrivalDate
     * @return
     */
    public static OmsPurchaseOrderRequest convertToOmsPurchaseOrderRequest(OmsPurchaseOrder omsPurchaseOrder, String itemData,
                                                                           Date arrivalDate, HttpServletRequest request) {
        OmsPurchaseOrderRequest orderRequest = new OmsPurchaseOrderRequest();

        JSONArray jan = JSON.parseArray(itemData);

        List<OmsPurchaseOrderItem> itemList = new ArrayList<OmsPurchaseOrderItem>();

        if (null != jan && jan.size() > 0)
        {
            for (int i = 0; i < jan.size(); i++) {

                String str = jan.get(i).toString();

                OmsPurchaseOrderItem item = Json2BeanUtil.mapJson2Bo(OmsPurchaseOrderItem.class,str);

                itemList.add(item);
            }
        }

        orderRequest.setOrderItemList(itemList);

        omsPurchaseOrder.setArrivalTime(arrivalDate);

        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

        omsPurchaseOrder.setUserId(userModel.getUserId());

        omsPurchaseOrder.setOperatorId(userModel.getOperatorId());

        omsPurchaseOrder.setOperatorName(userModel.getOperatorName());

        orderRequest.setOmsPurchaseOrder(omsPurchaseOrder);

        return orderRequest;
    }

    public static OmsPurchaseOrderRequest convertToUpdateOmsPurchaseOrderRequest(OmsPurchaseOrder omsPurchaseOrder, String itemData, Date arrivalDate, HttpServletRequest request) {
        OmsPurchaseOrderRequest orderRequest = new OmsPurchaseOrderRequest();

        JSONArray jan = JSON.parseArray(itemData);

        List<OmsPurchaseOrderItem> itemList = new ArrayList<OmsPurchaseOrderItem>();

        if (null != jan && jan.size() > 0)
        {
            for (int i = 0; i < jan.size(); i++) {

                String str = jan.get(i).toString();

                OmsPurchaseOrderItem item = Json2BeanUtil.mapJson2Bo(OmsPurchaseOrderItem.class,str);

                itemList.add(item);
            }
        }

        orderRequest.setOrderItemList(itemList);

        omsPurchaseOrder.setArrivalTime(arrivalDate);

        orderRequest.setOmsPurchaseOrder(omsPurchaseOrder);

        return orderRequest;
    }

    public static OmsPurchaseOrderRequest convertToAttivalRequest(String dataList) {
        OmsPurchaseOrderRequest orderRequest = new OmsPurchaseOrderRequest();

        JSONArray jan = JSON.parseArray(dataList);

        List<OmsPurchaseArrivalItem> itemList = new ArrayList<OmsPurchaseArrivalItem>();

        if (null != jan && jan.size() > 0)
        {
            for (int i = 0; i < jan.size(); i++) {

                String str = jan.get(i).toString();

                OmsPurchaseArrivalItem item = Json2BeanUtil.mapJson2Bo(OmsPurchaseArrivalItem.class,str);

                itemList.add(item);
            }
        }

        orderRequest.setArrivalItemList(itemList);

        return orderRequest;
    }
}
