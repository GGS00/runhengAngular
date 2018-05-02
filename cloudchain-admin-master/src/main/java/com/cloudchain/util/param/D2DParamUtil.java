package com.cloudchain.util.param;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.admin.model.d2d.D2DOrderRequestModel;
import com.cloudchain.d2d.pojo.bo.cart.D2DCartRequest;
import com.cloudchain.d2d.pojo.bo.order.D2DOrderRequest;
import com.cloudchain.d2d.pojo.po.D2DCart;
import com.cloudchain.d2d.pojo.po.D2DOrder;
import com.cloudchain.d2d.pojo.vo.D2DOrderModel;
import com.cloudchain.d2p.pojo.vo.D2DItemModel;
import com.cloudchain.platform.util.Json2BeanUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhuhao on 2017/6/12.
 */
public class D2DParamUtil {
    /**
     * D2D请求拼装
     * @param userId
     * @param dataList
     * @return
     */
    public static D2DCartRequest convertToCartRequest(String userId, String dataList) {

        D2DCartRequest cartRequest = new D2DCartRequest();

        JSONArray jan = JSON.parseArray(dataList);
        List<D2DCart> cartList = new ArrayList<D2DCart>();

        if (null != jan && jan.size() > 0)
        {
            for (int i = 0; i < jan.size(); i++) {

                String str = jan.get(i).toString();

                D2DCart item = Json2BeanUtil.mapJson2Bo(D2DCart.class,str);

                cartList.add(item);
            }
        }
        cartRequest.setCartList(cartList);
        cartRequest.setUserId(userId);

        return cartRequest;
    }

    /**
     * 订单请求封装
     * @param userId
     * @param dataList
     * @return
     */
    public static D2DOrderRequest convertToOrderRequest(String userId, String dataList) {
        D2DOrderRequest cartRequest = new D2DOrderRequest();

        JSONArray jan = JSON.parseArray(dataList);
        List<D2DCart> cartList = new ArrayList<D2DCart>();

        if (null != jan && jan.size() > 0)
        {
            for (int i = 0; i < jan.size(); i++) {

                String str = jan.get(i).toString();

                D2DCart item = Json2BeanUtil.mapJson2Bo(D2DCart.class,str);

                cartList.add(item);
            }
        }
        cartRequest.setCartList(cartList);
        cartRequest.setUserId(userId);

        return cartRequest;
    }

    /**
     * 订单请求分装
     * @param d2DOrderRequestModel
     * @param itemData
     * @param userModel
     * @return
     */
    public static D2DOrderRequest convertToOrderRequest(D2DOrderRequestModel d2DOrderRequestModel, String itemData, CommUserModel userModel) {
        D2DOrderRequest request = new D2DOrderRequest();

        List<D2DOrderModel> orderModelList = new ArrayList<>();

        JSONArray jan = JSON.parseArray(itemData);

        List<D2DItemModel> itemLists = new ArrayList<>();

        if (null != jan && jan.size() > 0)
        {
            for (int i = 0; i < jan.size(); i++) {

                String str = jan.get(i).toString();

                D2DItemModel item = Json2BeanUtil.mapJson2Bo(D2DItemModel.class,str);

                itemLists.add(item);
            }
        }

        Map<String, List<D2DItemModel>> map = new HashMap<>();

        for (D2DItemModel itemModel:itemLists
             ) {
            String userId = itemModel.getUserId();
            List<D2DItemModel> mo = null;
            if (map.containsKey(userId))
            {
                mo = map.get(userId);
            }
            else
            {
                mo = new ArrayList<>();
            }
            mo.add(itemModel);
            map.put(userId, mo);
        }
        D2DOrder order = d2DOrderRequestModel.getOrder();

        for (Map.Entry<String, List<D2DItemModel>> entry : map.entrySet()) {
            String userId = entry.getKey();

            List<D2DItemModel> list = entry.getValue();

            D2DOrderModel orderModel = new D2DOrderModel();

            D2DOrder orderA = new D2DOrder();
            orderA.setUserId(userId);
            orderA.setCustomerId(userModel.getUserId());
            orderA.setDeliverState(order.getDeliverState());
            orderA.setDistributionWay(order.getDistributionWay());
            orderA.setGoodsType(order.getGoodsType());
            orderA.setIsInvoice(order.getIsInvoice());
            orderA.setOrderFrom(order.getOrderFrom());
            orderA.setTransFee(order.getTransFee());
            orderA.setSubtractMoney(order.getSubtractMoney());
            orderA.setSettlementWay(order.getSettlementWay());
            orderA.setRemark(order.getRemark());
            orderA.setPayState(order.getPayState());
            orderA.setOrderGoods(order.getOrderGoods());

            orderModel.setInvoice(d2DOrderRequestModel.getOrderInvoice());
            orderModel.setLogistics(d2DOrderRequestModel.getOrderLogistics());
            orderModel.setOrder(orderA);
            orderModel.setOrderPay(d2DOrderRequestModel.getOrderPay());
            orderModel.setItemList(list);

            orderModelList.add(orderModel);
        }

        request.setOrderModelList(orderModelList);

        return request;
    }
}
