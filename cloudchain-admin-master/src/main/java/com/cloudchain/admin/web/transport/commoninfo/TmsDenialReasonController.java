package com.cloudchain.admin.web.transport.commoninfo;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.tms.api.TmsDenialReasonService;
import com.cloudchain.tms.pojo.bo.commoninfo.TmsDenialReasonRequest;
import com.cloudchain.tms.pojo.bo.commoninfo.TmsDenialReasonResponse;
import com.cloudchain.tms.pojo.po.TmsDenialReason;
import com.cloudchain.util.param.CommonParamUtil;
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

/**
 * Created by LiuKai on 2017/3/18.
 */
@Api(value = "tms-denialReason-api", description = "拒签原因接口")
@Controller
@RequestMapping("/transport/setting/denialreason")
public class TmsDenialReasonController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(TmsDenialReasonController.class);

    @Autowired
    private TmsDenialReasonService denialReasonService;


    /**
     * 新增单据类型
     * @param request HttpServletRequest
     * @param reason TmsDenialReason
     * @return json
     */
    @ApiOperation(value = "新增单据类型")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public String save(HttpServletRequest request, TmsDenialReason reason) {
        logger.info("[TmsDenialReasonController.save] IN");
        long begin = System.currentTimeMillis();


        String retString = null;
        TmsDenialReasonRequest req = new TmsDenialReasonRequest();
        req.setDenialReason(reason);

        CommonParamUtil.setTmsOperator(request, req);

        TmsDenialReasonResponse resp = denialReasonService.save(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TmsDenialReasonController.save] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 修改单据类型
     * @param request HttpServletRequest
     * @param reason TmsDenialReason
     * @return json
     */
    @ApiOperation(value = "修改单据类型")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public String update(HttpServletRequest request, TmsDenialReason reason) {
        logger.info("[TmsDenialReasonController.update] IN");
        long begin = System.currentTimeMillis();


        String retString = null;
        TmsDenialReasonRequest req = new TmsDenialReasonRequest();
        req.setDenialReason(reason);

        CommonParamUtil.setTmsOperator(request, req);

        TmsDenialReasonResponse resp = denialReasonService.update(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TmsDenialReasonController.update] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }


    /**
     *  删除单据类型
     * @param request HttpServletRequest
     * @param ids  单据类型ID
     * @return json
     */
    @ApiOperation(value = "删除单据类型")
    @RequestMapping(value = "/delete/{ids}", method = RequestMethod.POST)
    @ResponseBody
    public String delete(HttpServletRequest request, @PathVariable String ids) {
        logger.info("[TmsDenialReasonController.delete] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        TmsDenialReasonRequest req = new TmsDenialReasonRequest();
        req.setIds(ids);

        CommonParamUtil.setTmsOperator(request, req);

        TmsDenialReasonResponse resp = denialReasonService.delete(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TmsDenialReasonController.delete] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }
}
