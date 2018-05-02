package com.cloudchain.admin.web.transport.traceability;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.model.base.BatchProcessResult;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.util.JacksonUtils;
import com.cloudchain.tms.api.TmsTraceabilityService;
import com.cloudchain.tms.pojo.bo.traceability.TmsTraceRequest;
import com.cloudchain.tms.pojo.bo.traceability.TmsTraceResponse;
import com.cloudchain.tms.pojo.po.TmsTraceability;
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
import java.util.HashMap;
import java.util.Map;

/**
 * Created by LiuKai on 2017/3/8.
 */
@Api(value = "tms-traceability-api", description = "TMS溯源接口")
@Controller
@RequestMapping("/transport/track")
public class TmsTraceabilityController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(TmsTraceabilityController.class);

    @Autowired
    private TmsTraceabilityService tmsTraceabilityService;

    /**
     * 更新
     * @param request HttpServletRequest
     * @param traceId id
     * @param tmsTraceability TmsTraceability
     * @return json
     */
    @ApiOperation(value = "更新溯源信息")
    @RequestMapping(value = "/update/{traceId}", method = RequestMethod.POST)
    @ResponseBody
    public String update(HttpServletRequest request, @PathVariable String traceId, TmsTraceability tmsTraceability) {
        TmsTraceRequest req = new TmsTraceRequest();
        req.setTraceId(traceId);
        req.setTmsTraceability(tmsTraceability);
        String retString = null;
        TmsTraceResponse resp =  tmsTraceabilityService.update4Trace(req);
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        return retString;
    }

    /**
     * 签收
     * @param request HttpServletRequest
     * @param traceIds id逗号间隔
     * @return json
     */
    @ApiOperation(value = "溯源签收")
    @RequestMapping(value = "/sign", method = RequestMethod.POST)
    @ResponseBody
    public String sign4Trace(HttpServletRequest request, String traceIds) {
        String[] idArray = traceIds.split(",");
        int totalCount = idArray.length;
        int failCount = 0;
        String eMsg = "";// 异常消息

        TmsTraceRequest req = new TmsTraceRequest();
        req.setTraceabIds(traceIds);
        TmsTraceResponse resp =  tmsTraceabilityService.sign4Trace(req);
        if (!ResultCode.SUCCESS.equals(resp.getStatus())) {
            failCount = totalCount;
        }
        else {
            failCount = totalCount - Integer.valueOf(resp.getRetString());
        }
        eMsg = resp.getMsg();
        return CommonControllerAspect.batchProcessResult(new BatchProcessResult(totalCount, failCount, eMsg));
    }


    /**
     * 详情
     * @param request HttpServletRequest
     * @param traceId id
     * @return 详情
     */
    @ApiOperation(value = "物流详情")
    @RequestMapping(value = "/detail/{traceId}", method = RequestMethod.GET)
    @ResponseBody
    public String load(HttpServletRequest request, @PathVariable String traceId) {
        TmsTraceRequest req = new TmsTraceRequest();
        req.setTraceId(traceId);
        String retString = null;
        TmsTraceResponse resp =  tmsTraceabilityService.load(req);
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            Map<String, Object> retMap = new HashMap<>();
            retMap.put("status", "成功");
            retMap.put("orderLogs", resp.getOrderLogs());
            retString = JacksonUtils.object2json(retMap);
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        return retString;
    }
}
