package com.cloudchain.admin.web.fms.labor;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.model.fms.FmsLaborEntryModel;
import com.cloudchain.fms.api.boss.bis.FmsLaborEntryService;
import com.cloudchain.fms.pojo.bo.labor.FmsLaborEntryRequest;
import com.cloudchain.fms.pojo.bo.labor.FmsLaborEntryResponse;
import com.cloudchain.fms.pojo.po.FmsLaborEntry;
import com.cloudchain.platform.common.ResultCode;
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

@Api(value = "fms-laborEntry-api", description = "人工审批接口")
@Controller
@RequestMapping("/fmsLaborEntry")
public class FmsLaborEntryController {
    private static final Logger logger = LoggerFactory.getLogger(FmsLaborEntryController.class);

    @Autowired
    private FmsLaborEntryService fmsLaborEntryService;

    /**
     * 提交人工审批申请
     * @param request
     * @param model
     * @return
     */
    @ApiOperation(value = "提交人工审批申请")
    @RequestMapping(value = "/saveLaborEntry", method = RequestMethod.POST)
    @ResponseBody
    public String saveLaborEntry(HttpServletRequest request, FmsLaborEntryModel model) {
        logger.info("[FmsLaborEntryController.saveLaborEntry] IN");
        long begin = System.currentTimeMillis();
        String retString = null;

        FmsLaborEntryRequest req = new FmsLaborEntryRequest();
        FmsLaborEntry entry = new FmsLaborEntry();
        entry.setNewMobile(model.getMobile());
        entry.setRealName(model.getRealName());
        entry.setIdentitycard(model.getIdentityCard());

        req.setLaborEntry(entry);
        req.setType(model.getType());
        req.setMobile(model.getMobile());
        req.setCode(model.getCode());
        req.setCheckUuid(model.getCheckUuid());

        CommonParamUtil.setUmsUserId(request, req);

        FmsLaborEntryResponse resp = fmsLaborEntryService.saveLaborEntryByAdmin(req);


        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }

        long end = System.currentTimeMillis();
        logger.info("[FmsLaborEntryController.saveLaborEntry] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }


}
