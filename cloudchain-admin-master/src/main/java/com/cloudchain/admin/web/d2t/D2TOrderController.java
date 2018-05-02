package com.cloudchain.admin.web.d2t;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.d2t.api.D2TOrderService;
import com.cloudchain.d2t.pojo.bo.order.D2TOrderRequest;
import com.cloudchain.d2t.pojo.bo.order.D2TOrderResponse;
import com.cloudchain.d2t.pojo.po.D2TOrder;
import com.cloudchain.d2t.pojo.vo.D2TOrderModel;
import com.cloudchain.util.param.CommonParamUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by zhuhao on 2017/6/28.
 */
@Controller
@RequestMapping(value = "/d2t/order")
public class D2TOrderController {
    private static final Logger LOGGER = LoggerFactory.getLogger(D2TOrderController.class);

    @Autowired
    D2TOrderService orderService;

    /**
     * 新增发货单
     * @param servletRequest
     * @return
     */
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public D2TOrderResponse addOrder(HttpServletRequest servletRequest, @RequestBody D2TOrderModel orderModel)
    {
        LOGGER.info("D2TOrderController addOrder in");
        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        D2TOrder order = new D2TOrder();

        order.setOwnerId(userModel.getUserId());
        order.setOwnerName(userModel.getNickName());

        order.setCreatorId(userModel.getOperatorId());
        order.setCreator(userModel.getOperatorName());

        D2TOrderRequest request = new D2TOrderRequest();

        request.setOrderModel(orderModel);

        D2TOrderResponse response = orderService.addOrder(request);

        LOGGER.info("D2TOrderController addOrder out");
        return response;
    }
}
