package com.cloudchain.admin.web.oms.order;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.admin.model.oms.ShipAddressModel;
import com.cloudchain.oms.api.order.OmsSaleOrderService;
import com.cloudchain.oms.pojo.bo.sale.OmsSaleOrderRequest;
import com.cloudchain.oms.pojo.bo.sale.OmsSaleOrderResponse;
import com.cloudchain.oms.pojo.common.CarrierType;
import com.cloudchain.util.param.CommonParamUtil;
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
 * Created by wangqing on 2017/4/26.
 * oms订单发货
 */
@Controller
@RequestMapping("/ordersend")
public class OmsSendOrderController {
    private static final Logger log = LoggerFactory.getLogger(OmsSendOrderController.class);

    @Autowired
    OmsSaleOrderService omsSaleOrderService;

    /**
     * 发送wms生成出库单
    */
    @RequestMapping(value = "/toWms/{orderId}",method = RequestMethod.GET)
    @ResponseBody
    public OmsSaleOrderResponse sendToWms(HttpServletRequest request, @PathVariable String orderId){
        log.info("[OmsSendOrderController.sendToWms] IN");
        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);
        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        req.setUserId(userModel.getUserId());
        req.setNickName(userModel.getNickName());
        req.setOperatorId(userModel.getOperatorId());
        req.setOrderId(orderId);
        log.info("[OmsSendOrderController.sendToWms] call oms to 0 0 0 * * ?send order,the orderId is ："+req.getOrderId());
        //调oms的api
        OmsSaleOrderResponse response = omsSaleOrderService.wmsOutboundSend(req);

        log.info("[OmsSendOrderController.sendToWms] OUT");
        return response;
    }

    /**
     * 发送tms生成发运单
     */
    @RequestMapping(value = "/toTms/{orderId}",method = RequestMethod.GET)
    @ResponseBody
    public OmsSaleOrderResponse sendToTms(HttpServletRequest request, @PathVariable String orderId, ShipAddressModel model){
        log.info("[OmsSendOrderController.sendToTms] IN");
        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        CommonParamUtil.setOmsUserInfo(request,req);
        req.setOrderId(orderId);

        String carrierType = request.getParameter("carrierType");
        req.setCarrierType(carrierType);
        req.setConsignorAddrDetail(request.getParameter("address"));
        req.setConsignorProvince(request.getParameter("province"));
        req.setConsignorCity(request.getParameter("city"));
        req.setConsignorDistrict(request.getParameter("district"));
        req.setConsignorNm(request.getParameter("contactor"));
        req.setConsignorTel(request.getParameter("mobile"));

        if (CarrierType.SELF.toString().equals(carrierType)){
            req.setCarrierId(req.getUserId());
            req.setCarrierName(req.getNickName());
        }
        else{
            req.setCarrierId(request.getParameter("carrierId"));
            req.setCarrierName(request.getParameter("carrierName"));
        }

        log.info("[OmsSendOrderController.sendToTms] call oms to send order,the orderId is ："+req.getOrderId());
        //调oms的api
        OmsSaleOrderResponse response = omsSaleOrderService.tmsOutboundSend(req);

        log.info("[OmsSendOrderController.sendToTms] OUT");
        return response;
    }

    /**
     * 第三方快递发运
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/sendExpress/{orderId}", method = RequestMethod.GET)
    public OmsSaleOrderResponse sendExpress(HttpServletRequest request, @PathVariable String orderId){
        log.info("OmsSaleOrderController.sendExpress() IN");
        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        req.setOrderId(orderId);
        req.setLogisticsNo(request.getParameter("logisticsNo"));
        req.setExpressName(request.getParameter("expressName"));
        req.setLogisticsCompanyId(request.getParameter("logisticsCompanyId"));
        req.setRemark(request.getParameter("remark"));

        // 发货地址
        req.setConsignorAddrDetail(request.getParameter("address"));
        req.setConsignorProvince(request.getParameter("provinceName"));
        req.setConsignorCity(request.getParameter("cityName"));
        req.setConsignorDistrict(request.getParameter("districtName"));
        req.setConsignorNm(request.getParameter("contactor"));
        req.setConsignorTel(request.getParameter("mobile"));
        req.setSendId(request.getParameter("sendId"));

        OmsSaleOrderResponse resp = omsSaleOrderService.sendExpress(req);
        log.info("OmsSaleOrderController.sendExpress() IN");
        return resp;
    }
}
