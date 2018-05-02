package com.cloudchain.admin.web.d2p;

import com.cloudchain.d2p.api.D2POrderService;
import com.cloudchain.oms.pojo.bo.sale.OmsSaleOrderRequest;
import com.cloudchain.oms.pojo.bo.sale.OmsSaleOrderResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by zhuhao on 2017/5/8.
 */
@Api(value = "d2p-order-api", description = "批发系统订单相关接口")
@Controller
@RequestMapping(value = "/d2p/order")
public class D2POrderController {

    private static final Logger LOGGER = LoggerFactory.getLogger(D2POrderController.class);

    @Autowired
    D2POrderService orderService;

    /**
     * 订单详情
     * @return
     */
    @ResponseBody
    @ApiOperation(value = "订单详情")
    @RequestMapping(value = "/detail/{orderId}", method = RequestMethod.GET)
    public String getOrderDetail(HttpServletRequest request, @PathVariable String orderId){
        LOGGER.info("D2POrderController.getOrderDetail() IN");
        String resp = orderService.getD2POrderDetail(orderId);
        LOGGER.info("D2POrderController.getOrderDetail() OUT");
        return resp;
    }
}
