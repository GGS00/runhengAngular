package com.cloudchain.admin.web.d2w;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.d2w.api.D2WOrderService;
import com.cloudchain.d2w.pojo.bo.order.D2WOrderRequest;
import com.cloudchain.d2w.pojo.bo.order.D2WOrderResponse;
import com.cloudchain.d2w.pojo.vo.D2WOrderModel;
import com.cloudchain.util.param.CommonParamUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Created by zhuhao on 2017/7/7.
 */
@Controller
@RequestMapping(value = "/d2w/order")
public class D2WOrderController {
    private static final Logger LOGGER = LoggerFactory.getLogger(D2WOrderController.class);

    @Autowired
    D2WOrderService orderService;

    /**
     * 去下单
     */
    @RequestMapping(value = "/toAdd/{id}", method = RequestMethod.POST)
    @ResponseBody
    public D2WOrderResponse toAddOrder(@PathVariable String id, HttpServletRequest servletRequest)
    {
        LOGGER.info("D2WOrderController toAddOrder in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        D2WOrderRequest orderRequest = new D2WOrderRequest();

        orderRequest.setDwWarehouseId(id);
        orderRequest.setUserId(userModel.getUserId());

        D2WOrderResponse response = orderService.toAdd(orderRequest);

        LOGGER.info("D2WOrderController toAddOrder out");
        return response;
    }


    /**
     * 下单
     */
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public D2WOrderResponse addOrder(@RequestBody D2WOrderModel d2WOrderModel, HttpServletRequest servletRequest)
    {
        LOGGER.info("D2WOrderController addOrder in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        D2WOrderRequest orderRequest = new D2WOrderRequest();

        d2WOrderModel.setCustomerId(userModel.getUserId());

        orderRequest.setOrderModel(d2WOrderModel);
        orderRequest.setUserId(userModel.getUserId());
        orderRequest.setOperatorId(userModel.getOperatorId());
        orderRequest.setOperatorName(userModel.getOperatorName());

        D2WOrderResponse response = orderService.addOrder(orderRequest);

        LOGGER.info("D2WOrderController addOrder out");
        return response;
    }

    /**
     * 代客下单
     */
    @RequestMapping(value = "/valet", method = RequestMethod.POST)
    @ResponseBody
    public D2WOrderResponse valet(@RequestBody D2WOrderModel d2WOrderModel, HttpServletRequest servletRequest)
    {
        LOGGER.info("D2WOrderController valet in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        D2WOrderRequest orderRequest = new D2WOrderRequest();

        d2WOrderModel.setUserId(userModel.getUserId());

        orderRequest.setOrderModel(d2WOrderModel);
        orderRequest.setUserId(userModel.getUserId());
        orderRequest.setOperatorId(userModel.getOperatorId());
        orderRequest.setOperatorName(userModel.getOperatorName());

        D2WOrderResponse response = orderService.addOrder(orderRequest);

        LOGGER.info("D2WOrderController valet out");
        return response;
    }

    /**
     * 获取商品图片
     * @param request
     * @return
     */
    @RequestMapping(value = "/getGoodsImgs", method = RequestMethod.GET)
    @ResponseBody
    public D2WOrderResponse getGoodsImgs(HttpServletRequest request)
    {
        LOGGER.info("D2WOrderController getGoodsImgs in");

        Map<String, String[]> paramsMap = request.getParameterMap();

        Map<String, Object> map = new HashMap<String, Object>();
        Set<Map.Entry<String, String[]>> entrySet = paramsMap.entrySet();
        for (Map.Entry<String, String[]> entry : entrySet) {
            map.put(entry.getKey(), entry.getValue()[0]);
        }

        D2WOrderResponse retString = orderService.getGoodsImgs(map);

        LOGGER.info("D2WOrderController getGoodsImgs out");
        return retString;
    }

    /**
     * 查看订单详情
     * @param request
     * @param orderId
     * @return
     */
    @RequestMapping(value = "/detail/{orderId}", method = RequestMethod.GET)
    @ResponseBody
    public D2WOrderResponse orderDetail(HttpServletRequest request, @PathVariable String orderId)
    {
        LOGGER.info("D2WOrderController orderDetail in");


        D2WOrderResponse retString = orderService.getD2WOrderDetail(orderId);

        LOGGER.info("D2WOrderController orderDetail out");
        return retString;
    }


    /**
     * 选择仓库
     * @param request
     * @return
     */
    @RequestMapping(value = "/choose", method = RequestMethod.POST)
    @ResponseBody
    public D2WOrderResponse choose(HttpServletRequest request, @RequestBody D2WOrderModel d2WOrderModel)
    {
        LOGGER.info("D2WOrderController orderDetail in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

        D2WOrderRequest orderRequest = new D2WOrderRequest();

        d2WOrderModel.setUserId(userModel.getUserId());

        orderRequest.setOrderModel(d2WOrderModel);
        orderRequest.setUserId(userModel.getUserId());
        orderRequest.setOperatorId(userModel.getOperatorId());
        orderRequest.setOperatorName(userModel.getOperatorName());

        D2WOrderResponse retString = orderService.chooseHouse(orderRequest);

        LOGGER.info("D2WOrderController orderDetail out");
        return retString;
    }
}
