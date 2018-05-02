package com.cloudchain.admin.web.lms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.lms.api.admin.bis.LmsCustomerService;
import com.cloudchain.lms.pojo.bo.admin.customer.LmsCustomerRequest;
import com.cloudchain.lms.pojo.bo.admin.customer.LmsCustomerResponse;
import com.cloudchain.lms.pojo.po.LmsCustomer;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by liwei on 2017/5/13.
 */
@Controller
@RequestMapping("/lmsCustomer")
public class LmsCustomerController {

    @Autowired
    private LmsCustomerService lmsCustomerService;

    private static final Logger logger = LoggerFactory.getLogger(LmsCustomerController.class);

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public String add(HttpServletRequest request, LmsCustomer lmsCustomer) {
        logger.info("[LmsCustomerController.add] IN");
        LmsCustomerRequest lmsCustomerRequest=new LmsCustomerRequest();
        lmsCustomerRequest.setLmsCustomer(lmsCustomer);
        CommonParamUtil.setLmsOperator(request,lmsCustomerRequest);
        LmsCustomerResponse lmsCustomerResponse=lmsCustomerService.addLmsCustomer(lmsCustomerRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(lmsCustomerResponse.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(lmsCustomerResponse.getMsg());
        }
        logger.info("[LmsCustomerController.add] OUT");
        return retString;
    }

   @RequestMapping(value = "/updateStatus", method = RequestMethod.POST)
    @ResponseBody
    public String updateStatus(HttpServletRequest request, String ids,String command) {
        logger.info("[LmsCustomerController.updateStatus] IN");
       LmsCustomerRequest lmsCustomerRequest=new LmsCustomerRequest();
       lmsCustomerRequest.setCommand(command);
       lmsCustomerRequest.setId(ids);
        CommonParamUtil.setLmsOperator(request,lmsCustomerRequest);
       LmsCustomerResponse lmsCustomerResponse=lmsCustomerService.updateStatus(lmsCustomerRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(lmsCustomerResponse.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(lmsCustomerResponse.getMsg());
        }
        logger.info("[LmsCustomerController.updateStatus] OUT");
        return retString;
    }



    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    public String edit(HttpServletRequest request, LmsCustomer lmsCustomer ) {
        logger.info("[LmsCustomerController.edit] IN");
        LmsCustomerRequest lmsCustomerRequest=new LmsCustomerRequest();
        lmsCustomerRequest.setLmsCustomer(lmsCustomer);
        CommonParamUtil.setLmsOperator(request,lmsCustomerRequest);
        LmsCustomerResponse LmsCustomerResponse=lmsCustomerService.editLmsCustomer(lmsCustomerRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(LmsCustomerResponse.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(LmsCustomerResponse.getMsg());
        }
        logger.info("[LmsCustomerController.edit] OUT");
        return retString;
    }

    @RequestMapping(value = "/load", method = RequestMethod.POST)
    @ResponseBody
    public LmsCustomer getDetail(String id ) {
        logger.info("[LmsCustomerController.getDetail] IN");
        LmsCustomer lmsCustomer=lmsCustomerService.load(id);
        logger.info("[LmsCustomerController.getDetail] OUT");
        return lmsCustomer;
    }
}
