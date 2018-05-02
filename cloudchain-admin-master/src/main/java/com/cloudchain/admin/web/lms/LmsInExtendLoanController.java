package com.cloudchain.admin.web.lms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.lms.api.admin.in.LmsInExtendLoanService;
import com.cloudchain.lms.pojo.bo.admin.inextendloan.LMSInExtendLoanResponse;
import com.cloudchain.lms.pojo.bo.admin.inextendloan.LmsInExtendLoanRequest;
import com.cloudchain.lms.pojo.po.LmsInExtendLoan;
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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by liwei on 2017/5/26.
 */
@Controller
@RequestMapping("/LmsInExtendLoan")
public class LmsInExtendLoanController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(LmsInExtendLoanController.class);
    @Autowired
    private LmsInExtendLoanService inExtendLoanService;

    @ApiOperation(value = "确认放款")
    @RequestMapping(value = "/doConfirmExtend",method = RequestMethod.POST)
    @ResponseBody
    public String doConfirmExtend(HttpServletRequest request, LmsInExtendLoan inExtendLoan,  @DateTimeFormat(pattern = "yyyy-MM-dd") Date time, String description) {
        logger.info("[LmsInExtendLoanController.doConfirmExtend] IN");
        LmsInExtendLoanRequest inExtendLoanRequest = new LmsInExtendLoanRequest();
        inExtendLoan.setIssueTime(time);
        CommonParamUtil.setLmsOperator(request,inExtendLoanRequest);
        inExtendLoanRequest.setInExtendLoan(inExtendLoan);
        inExtendLoanRequest.setRemark(description);
        LMSInExtendLoanResponse innExtendLoanResponse = inExtendLoanService.doConfirmExtend(inExtendLoanRequest);
        String retString = null;
        if (ResultCode.SUCCESS.equals(innExtendLoanResponse.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(innExtendLoanResponse.getMsg());
        }
        logger.info("[LmsInExtendLoanController.doConfirmExtend] OUT");
        return retString;
    }
}
