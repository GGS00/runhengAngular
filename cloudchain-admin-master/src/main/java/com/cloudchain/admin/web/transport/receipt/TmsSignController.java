package com.cloudchain.admin.web.transport.receipt;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.util.JacksonUtils;
import com.cloudchain.tms.api.TmsSignService;
import com.cloudchain.tms.pojo.bo.receipt.TmsSignRequest;
import com.cloudchain.tms.pojo.bo.receipt.TmsSignResponse;
import com.cloudchain.tms.pojo.vo.TmsSignModel;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by LiuKai on 2017/3/17.
 */
@Api(value = "tms-sign-api", description = "签收接口")
@Controller
@RequestMapping("/transport/receipt/sign")
public class TmsSignController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(TmsSignController.class);

    @Autowired
    private TmsSignService tmsSignService;

    /**
     * 签收详情
     * @param request HttpServletRequest
     * @param segmentId 运段ID
     * @return json
     */
    @ApiOperation(value = "签收详情")
    @RequestMapping(value = "/detail/{segmentId}")
    @ResponseBody
    public String scan(HttpServletRequest request, @PathVariable String segmentId) {
        logger.info("[TmsSignController.scan] IN");
        String retString = null;

        TmsSignRequest req = new TmsSignRequest();
        req.setSegmentId(segmentId);

        CommonParamUtil.setTmsOperator(request, req);

        TmsSignResponse resp = tmsSignService.load(req);
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = JacksonUtils.object2json(resp.getResultMap());
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }

        logger.info("[TmsSignController.scan] OUT");
        return retString;
    }


    /**
     * 签收
     * @param request HttpServletRequest
     * @param model TmsSignModel
     * @param segmentId 运段ID
     * @return json
     */
    @ApiOperation(value = "签收")
    @RequestMapping(value = "/doSign/{segmentId}")
    @ResponseBody
    public String sign(HttpServletRequest request, TmsSignModel model, @PathVariable String segmentId) {
        logger.info("[TmsSignController.scan] IN");
        String retString = null;

        TmsSignRequest req = new TmsSignRequest();
        req.setSegmentId(segmentId);
        req.setSignModel(model);

        CommonParamUtil.setTmsOperator(request, req);

        TmsSignResponse resp = tmsSignService.sign(req);
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        } else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }

        logger.info("[TmsSignController.scan] OUT");
        return retString;
    }

}
