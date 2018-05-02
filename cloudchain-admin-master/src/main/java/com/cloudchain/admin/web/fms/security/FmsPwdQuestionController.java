package com.cloudchain.admin.web.fms.security;

import com.cloudchain.fms.api.admin.bis.FmsPwdQuestionService;
import com.cloudchain.fms.pojo.bo.question.FmsPwdQuestionRequest;
import com.cloudchain.fms.pojo.bo.question.FmsPwdQuestionResponse;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

@Api(value = "fms-pwdQuestion-api", description = "密保接口")
@Controller
@RequestMapping("/fmsPwdQuestion")
public class FmsPwdQuestionController {
    private static final Logger logger = LoggerFactory.getLogger(FmsPwdQuestionController.class);

    @Autowired
    private FmsPwdQuestionService fmsPwdQuestionService;

    /**
     * 获取密保问题列表
     * @param request
     * @return
     */
    @ApiOperation(value = "获取密保问题列表")
    @RequestMapping(value = "/getPwdQuestionList", method = RequestMethod.GET)
    @ResponseBody
    public FmsPwdQuestionResponse getPwdQuestionList(HttpServletRequest request) {
        logger.info("[FmsPwdQuestionController.getPwdQuestionList] IN");
        long begin = System.currentTimeMillis();

        FmsPwdQuestionRequest req = new FmsPwdQuestionRequest();
        CommonParamUtil.setUmsUserId(request, req);
        FmsPwdQuestionResponse resp = fmsPwdQuestionService.getPwdQuestionList(req);

        logger.info("has {} questionList.", resp.getFmsPwdQuestions() == null ? 0 : resp.getFmsPwdQuestions().size());
        long end = System.currentTimeMillis();
        logger.info("[FmsPwdQuestionController.getPwdQuestionList] OUT,cost time:{}s", (end - begin) / 1000d);

        return resp;
    }
}
