package com.cloudchain.admin.web.lms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.lms.api.admin.pre.BPreInboundDetailService;
import com.cloudchain.lms.api.admin.pre.BPreInboundService;
import com.cloudchain.lms.pojo.bo.preinbound.LmsPreInboundRequest;
import com.cloudchain.lms.pojo.bo.preinbound.LmsPreInboundResponse;
import com.cloudchain.lms.pojo.po.LmsPreInbound;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by liwei on 2017/5/18.
 */
@Controller
@RequestMapping("/LmsInbound")
public class LmsInboundController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(LmsInboundController.class);

    @Autowired
    private BPreInboundDetailService inboundDetailService;
    @Autowired
    private BPreInboundService inboundService;

    @ApiOperation(value = "加载入库申请单")
    @RequestMapping(value = "/load",method = RequestMethod.POST)
    @ResponseBody
    public LmsPreInboundResponse loadInbound(HttpServletRequest request, String id) {
        logger.info("[LmsInboundController.loadInbound] IN");
        LmsPreInboundRequest lmsPreInboundRequest = new LmsPreInboundRequest();
        CommonParamUtil.setLmsOperator(request,lmsPreInboundRequest);
        lmsPreInboundRequest.setId(id);
        LmsPreInboundResponse resp = inboundService.loadInbound(lmsPreInboundRequest);
        logger.info("[LmsInboundController.loadInbound] OUT");
        return resp;
    }

    @ApiOperation(value = "审批入库申请")
    @RequestMapping(value = "/approve",method = RequestMethod.POST)
    @ResponseBody
    public String approve(HttpServletRequest request, LmsPreInbound inbound) {
        logger.info("[LmsInboundController.approve] IN");
        LmsPreInboundRequest lmsPreInboundRequest = new LmsPreInboundRequest();
        CommonParamUtil.setLmsOperator(request,lmsPreInboundRequest);
        lmsPreInboundRequest.setPreInbound(inbound);
        LmsPreInboundResponse resp = inboundService.approvalInbound(lmsPreInboundRequest);
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

}
