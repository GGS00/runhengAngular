package com.cloudchain.admin.web.lms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.lms.api.admin.after.LmsAfterReceiptForReturnService;
import com.cloudchain.lms.pojo.bo.admin.afterreceiptforreturn.LmsAfterReceiptForReturnRequest;
import com.cloudchain.lms.pojo.bo.admin.afterreceiptforreturn.LmsAfterReceiptForReturnResponse;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by liwei on 2017/6/5.
 */
@Controller
@RequestMapping("/LmsAfterReceiptForReturn")
public class LmsAfterReceiptForReturnController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(LmsAfterReceiptForReturnController.class);
    @Autowired
    private LmsAfterReceiptForReturnService afterReceiptForReturnService;

    @ApiOperation(value = "按客户结算")
    @RequestMapping(value = "/settleByCustomer",method = RequestMethod.POST)
    @ResponseBody
    public String settleByCustomer(HttpServletRequest request,String customerId,
                                   String payAmount, String accountName, String bankAccount, String bankName,
                                   String description, @DateTimeFormat(pattern = "yyyy-MM-dd") Date time) {
        logger.info("[LmsAfterReceiptForReturnController.settleByCustomer] IN");
        LmsAfterReceiptForReturnRequest afterReceiptForReturnRequest = new LmsAfterReceiptForReturnRequest();
        CommonParamUtil.setLmsOperator(request,afterReceiptForReturnRequest);
        Map<String,Object> param=new HashMap();
        /*param.put("afterReceiptForReturnList", afterReceiptForReturnList);*/
        param.put("settlementAmount",payAmount);
        param.put("refundDate", time);
        param.put("toAccountName", accountName);
        param.put("toBankAccount", bankAccount);
        param.put("toBankName", bankName);
        param.put("description", description);
        afterReceiptForReturnRequest.setParam(param);
        afterReceiptForReturnRequest.setId(customerId);
        LmsAfterReceiptForReturnResponse resp = afterReceiptForReturnService.settleByCustomer(afterReceiptForReturnRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[LmsAfterReceiptForReturnController.settleByCustomer] OUT");
        return retString;
    }
    @ApiOperation(value = "按客户结算")
    @RequestMapping(value = "/settleByOrder",method = RequestMethod.POST)
    @ResponseBody
    public String settleByCustomer(HttpServletRequest request,String orderIds, String payAmount, String accountName,
                                   String bankAccount, String bankName, @DateTimeFormat(pattern = "yyyy-MM-dd") Date time) {
        logger.info("[LmsAfterReceiptForReturnController.settleByOrder] IN");
        LmsAfterReceiptForReturnRequest afterReceiptForReturnRequest = new LmsAfterReceiptForReturnRequest();
        CommonParamUtil.setLmsOperator(request,afterReceiptForReturnRequest);
        Map<String,Object> param=new HashMap();
        param.put("settlementAmount",payAmount);
        param.put("refundDate", time);
        param.put("toAccountName", accountName);
        param.put("toBankAccount", bankAccount);
        param.put("toBankName", bankName);
        param.put("description", "");
        afterReceiptForReturnRequest.setParam(param);
        afterReceiptForReturnRequest.setId(orderIds);
        LmsAfterReceiptForReturnResponse resp = afterReceiptForReturnService.settleByOrder(afterReceiptForReturnRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[LmsAfterReceiptForReturnController.settleByOrder] OUT");
        return retString;
    }
}
