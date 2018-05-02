package com.cloudchain.admin.web.transport.commoninfo;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.tms.api.TmsBillTypeService;
import com.cloudchain.tms.pojo.bo.commoninfo.TmsBillTypeRequest;
import com.cloudchain.tms.pojo.bo.commoninfo.TmsBillTypeResponse;
import com.cloudchain.tms.pojo.po.TmsBillType;
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
@Api(value = "tms-billType-api", description = "单据类型接口")
@Controller
@RequestMapping("/transport/setting/billtype")
public class TmsBillTypeController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(TmsBillTypeController.class);

    @Autowired
    private TmsBillTypeService tmsBillTypeService;

    /**
     * 新增单据类型
     * @param request HttpServletRequest
     * @param billType TmsBillType
     * @return json
     */
    @ApiOperation(value = "新增单据类型")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public String save(HttpServletRequest request, TmsBillType billType) {
        logger.info("[TmsBillTypeController.save] IN");
        long begin = System.currentTimeMillis();


        String retString = null;
        TmsBillTypeRequest req = new TmsBillTypeRequest();
        req.setBillType(billType);

        CommonParamUtil.setTmsOperator(request, req);

        TmsBillTypeResponse resp = tmsBillTypeService.save(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TmsBillTypeController.save] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }


    /**
     * 修改单据类型
     * @param request HttpServletRequest
     * @param billType TmsBillType
     * @return json
     */
    @ApiOperation(value = "修改单据类型")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public String update(HttpServletRequest request, TmsBillType billType) {
        logger.info("[TmsBillTypeController.update] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        TmsBillTypeRequest req = new TmsBillTypeRequest();
        req.setBillType(billType);

        CommonParamUtil.setTmsOperator(request, req);

        TmsBillTypeResponse resp = tmsBillTypeService.update(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TmsBillTypeController.update] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }


    /**
     * 删除单据类型
     * @param request HttpServletRequest
     * @param ids 单据类型的ID
     * @return json
     */
    @ApiOperation(value = "删除单据类型")
    @RequestMapping(value = "/del/{ids}", method = RequestMethod.GET)
    @ResponseBody
    public String delete(HttpServletRequest request, @PathVariable String ids) {
        logger.info("[TmsBillTypeController.update] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        TmsBillTypeRequest req = new TmsBillTypeRequest();
        req.setIds(ids);

        CommonParamUtil.setTmsOperator(request, req);

        TmsBillTypeResponse resp = tmsBillTypeService.delete(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TmsBillTypeController.update] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

}
