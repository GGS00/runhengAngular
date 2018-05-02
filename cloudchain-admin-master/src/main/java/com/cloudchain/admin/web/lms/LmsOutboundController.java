package com.cloudchain.admin.web.lms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.lms.api.admin.after.BAfterOutboundService;
import com.cloudchain.lms.api.d2o.outbound.AAfterOutboundService;
import com.cloudchain.lms.pojo.bo.afteroutbound.LmsAfterOutboundRequest;
import com.cloudchain.lms.pojo.bo.afteroutbound.LmsAfterOutboundResponse;
import com.cloudchain.lms.pojo.po.LmsAfterOutbound;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.Date;

/**
 * Created by liwei on 2017/6/1.
 */
@Controller
@RequestMapping("/LmsOutbound")
public class LmsOutboundController {
    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(LmsOutboundController.class);

    @Autowired
    private AAfterOutboundService afterOutboundService;
    @Autowired
    private BAfterOutboundService bAfterOutboundService;

    @ApiOperation(value = "加载出库申请单")
    @RequestMapping(value = "/load",method = RequestMethod.POST)
    @ResponseBody
    public LmsAfterOutboundResponse loadInbound(HttpServletRequest request, String id) {
        logger.info("[LmsInboundController.loadInbound] IN");
        LmsAfterOutboundRequest lmsPreInboundRequest = new LmsAfterOutboundRequest();
        CommonParamUtil.setLmsOperator(request,lmsPreInboundRequest);
        lmsPreInboundRequest.setId(id);
        LmsAfterOutboundResponse resp = afterOutboundService.loadOutbound(lmsPreInboundRequest);
        logger.info("[LmsInboundController.loadInbound] OUT");
        return resp;
    }

    @ApiOperation(value = "审批出库申请单")
    @RequestMapping(value = "/approve",method = RequestMethod.POST)
    @ResponseBody
    public String approve(HttpServletRequest request, LmsAfterOutbound afterOutbound, @DateTimeFormat(pattern = "yyyy-MM-dd") Date time) {
        logger.info("[LmsInboundController.approve] IN");
        LmsAfterOutboundRequest lmsPreInboundRequest = new LmsAfterOutboundRequest();
        CommonParamUtil.setLmsOperator(request,lmsPreInboundRequest);
        afterOutbound.setPayTime(time);
        lmsPreInboundRequest.setOutbound(afterOutbound);
        LmsAfterOutboundResponse resp = bAfterOutboundService.approveOutbound(lmsPreInboundRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[LmsInboundController.approve] OUT");
        return retString;
    }

    @ApiOperation(value = "结算出库申请单")
    @RequestMapping(value = "/doSettlement",method = RequestMethod.POST)
    @ResponseBody
    public String doSettlement(HttpServletRequest request, LmsAfterOutbound afterOutbound, @DateTimeFormat(pattern = "yyyy-MM-dd") Date time,String toRepayInterest) {
        logger.info("[LmsInboundController.doSettlement] IN");
        LmsAfterOutboundRequest lmsPreInboundRequest = new LmsAfterOutboundRequest();
        CommonParamUtil.setLmsOperator(request,lmsPreInboundRequest);
        afterOutbound.setPayTime(time);
        lmsPreInboundRequest.setOutbound(afterOutbound);
        BigDecimal bigDecimal = new BigDecimal(toRepayInterest);
        lmsPreInboundRequest.setToRepayInterest(bigDecimal);
        LmsAfterOutboundResponse resp = bAfterOutboundService.doSettlement(lmsPreInboundRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[LmsInboundController.doSettlement] OUT");
        return retString;
    }

    @ApiOperation(value = "计算应还利息")
    @RequestMapping(value = "/getInterest",method = RequestMethod.POST)
    @ResponseBody
    public LmsAfterOutboundResponse getInterest(HttpServletRequest request, LmsAfterOutbound afterOutbound, @DateTimeFormat(pattern = "yyyy-MM-dd") Date time) {
        logger.info("[LmsInboundController.getInterest] IN");
        LmsAfterOutboundRequest lmsPreInboundRequest = new LmsAfterOutboundRequest();
        CommonParamUtil.setLmsOperator(request,lmsPreInboundRequest);
        afterOutbound.setPayTime(time);
        lmsPreInboundRequest.setOutbound(afterOutbound);
        LmsAfterOutboundResponse resp = bAfterOutboundService.getInterest(lmsPreInboundRequest);
        /*String retString = null;
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }*/
        logger.info("[LmsInboundController.getInterest] OUT");
        return resp;
    }
}
