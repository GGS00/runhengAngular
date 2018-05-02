package com.cloudchain.admin.web.d2d;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.admin.model.d2d.D2DOrderRequestModel;
import com.cloudchain.d2d.api.D2DOrderService;
import com.cloudchain.d2d.pojo.bo.order.D2DOrderRequest;
import com.cloudchain.d2d.pojo.bo.order.D2DOrderResponse;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.util.param.D2DParamUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by zhuhao on 2017/6/13.
 */
@Controller
@RequestMapping(value = "/d2d/order")
public class D2DOrderController {

    private static final Logger LOGGER = LoggerFactory.getLogger(D2DOrderController.class);

    @Autowired
    D2DOrderService orderService;

    /**
     * 购物车结算校验
     */
    @RequestMapping(value = "/toAdd", method = RequestMethod.POST)
    @ResponseBody
    public D2DOrderResponse toAddOrder(String dataList, HttpServletRequest servletRequest)
    {
        LOGGER.info("D2D pc toAddOrder in");
        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        D2DOrderRequest orderRequest = D2DParamUtil.convertToOrderRequest(userModel.getUserId(), dataList);

        D2DOrderResponse response = orderService.checkCart(orderRequest);

        LOGGER.info("D2P pc toAddOrder out");
        return response;
    }

    /**
     * 下单
     * @param d2DOrderRequestModel
     * @param servletRequest
     * @return
     */
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public D2DOrderResponse addOrder(HttpServletRequest servletRequest, D2DOrderRequestModel d2DOrderRequestModel, String itemData)
    {
        LOGGER.info("D2D pc addOrder in");
        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        D2DOrderRequest request = D2DParamUtil.convertToOrderRequest(d2DOrderRequestModel, itemData, userModel);

        D2DOrderResponse response = orderService.addOrder(request);

        LOGGER.info("D2D pc addOrder out");
        return response;
    }

    /**
     * 订单详情
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/detail/{orderId}", method = RequestMethod.GET)
    public String getOrderDetail(HttpServletRequest request, @PathVariable String orderId){
        LOGGER.info("D2PPcOrderController.getOrderDetail() IN");
        String resp = orderService.getD2DOrderDetail(orderId);
        LOGGER.info("D2PPcOrderController.getOrderDetail() OUT");
        return resp;
    }

    /**
     * 物流信息
     * @param request
     * @param orderId
     * @param skuId
     * @param spuId
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/logistics/{orderId}", method = RequestMethod.GET)
    public String getLogistics(HttpServletRequest request, @PathVariable String orderId, String skuId, String spuId){
        LOGGER.info("D2PPcOrderController.logistics() IN");
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("orderId", orderId);
        params.put("skuId", skuId);
        params.put("spuId", spuId);

        String resp = orderService.getLogistics(params);
        LOGGER.info("D2PPcOrderController.logistics() OUT");
        return resp;
    }

    /**
     * 确认收货，支持批量
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/confirmReceive", method = RequestMethod.POST
    )
    public D2DOrderResponse confirmReceive(HttpServletRequest request, String[] logisticsItemId){
        LOGGER.info("D2PPcOrderController.confirmReceive() IN");

        D2DOrderRequest d2POrderRequest = new D2DOrderRequest();
        d2POrderRequest.setLogisticsItemIds(logisticsItemId);
        D2DOrderResponse resp = orderService.confirmReceive(d2POrderRequest);
        LOGGER.info("D2PPcOrderController.confirmReceive() OUT");
        return resp;
    }

}
