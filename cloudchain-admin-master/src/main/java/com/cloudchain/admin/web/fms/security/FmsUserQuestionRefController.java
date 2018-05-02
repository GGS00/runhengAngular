package com.cloudchain.admin.web.fms.security;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.fms.api.admin.bis.FmsUserQuestionRefService;
import com.cloudchain.fms.pojo.bo.question.FmsUserQuestionRefRequest;
import com.cloudchain.fms.pojo.bo.question.FmsUserQuestionRefResponse;
import com.cloudchain.fms.pojo.po.FmsUserQuestionRef;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.util.Json2BeanUtil;
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
import java.util.ArrayList;
import java.util.List;

@Api(value = "fms-userQuestionRef-api", description = "认证接口")
@Controller
@RequestMapping("/fmsUserQuestionRef")
public class FmsUserQuestionRefController {
    private static final Logger logger = LoggerFactory.getLogger(FmsUserQuestionRefController.class);

    @Autowired
    private FmsUserQuestionRefService fmsUserQuestionRefService;

    /**
     * 保存密保问题
     * @param request
     * @param itemData
     * @return
     */
    @ApiOperation(value = "保存密保问题")
    @RequestMapping(value = "/saveUserQuestionRef", method = RequestMethod.POST)
    @ResponseBody
    public String saveUserQuestionRef(HttpServletRequest request, String itemData) {
        logger.info("[FmsUserQuestionRefController.saveUserQuestionRef] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        JSONArray items = JSON.parseArray(itemData);
        List<FmsUserQuestionRef> itemList = new ArrayList<FmsUserQuestionRef>();
        FmsUserQuestionRef item = null;
        if (null != items && items.size() > 0)
        {
            for (int i = 0; i < items.size(); i++) {
                String str = items.get(i).toString();
                item = Json2BeanUtil.mapJson2Bo(FmsUserQuestionRef.class,str);
                itemList.add(item);
            }
        }

        FmsUserQuestionRefRequest req = new FmsUserQuestionRefRequest();
        req.setFmsUserQuestionRefs(itemList);
        CommonParamUtil.setUmsUserId(request, req);
        FmsUserQuestionRefResponse resp = fmsUserQuestionRefService.saveUserQuestionRef(req);

        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }

        long end = System.currentTimeMillis();
        logger.info("[FmsUserQuestionRefController.saveUserQuestionRef] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }
}
