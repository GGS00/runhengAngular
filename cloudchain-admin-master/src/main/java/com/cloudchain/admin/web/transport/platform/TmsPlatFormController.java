package com.cloudchain.admin.web.transport.platform;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.util.JacksonUtils;
import com.cloudchain.tms.api.TmsPlatFormService;
import com.cloudchain.tms.pojo.bo.platform.TmsPlatFormRequest;
import com.cloudchain.tms.pojo.bo.platform.TmsPlatFormResponse;
import com.cloudchain.tms.pojo.po.TmsPlatForm;
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
 * Created by LiuKai on 2017/3/13.
 */
@Api(value = "tms-platform-api", description = "TMS网点接口")
@Controller
@RequestMapping("/transport/setting/platform")
public class TmsPlatFormController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(TmsPlatFormController.class);

    /**
     *
     */
    @Autowired
    private TmsPlatFormService tmsPlatFormService;

    /**
     * 新增
     * @param request HttpServletRequest
     * @param tmsPlatForm TmsPlatForm
     * @return 结果
     */
    @ApiOperation(value = "新增网点")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public String save(HttpServletRequest request,TmsPlatForm tmsPlatForm) {
        logger.info("[TmsPlatFormController.save] IN");
        long begin = System.currentTimeMillis();


        String retString = null;
        TmsPlatFormRequest req = new TmsPlatFormRequest();
        req.setTmsPlatForm(tmsPlatForm);

        CommonParamUtil.setTmsOperator(request, req);
        req.setOperatorId(req.getUserId());
        req.setOperatorName(req.getUserName());

        TmsPlatFormResponse resp = tmsPlatFormService.save(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TmsPlatFormController.save] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 修改
     * @param request TmsPlatForm
     * @param tmsPlatForm HttpServletRequest
     * @return 结果
     */
    @ApiOperation(value = "修改网点")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public String update(HttpServletRequest request,TmsPlatForm tmsPlatForm) {
        logger.info("[TmsPlatFormController.update] IN");
        long begin = System.currentTimeMillis();


        String retString = null;
        TmsPlatFormRequest req = new TmsPlatFormRequest();
        req.setTmsPlatForm(tmsPlatForm);

        CommonParamUtil.setTmsOperator(request, req);
        req.setOperatorId(req.getUserId());
        req.setOperatorName(req.getUserName());

        TmsPlatFormResponse resp = tmsPlatFormService.update(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TmsPlatFormController.update] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 详情
     * @param id id
     * @return json
     */
    @ApiOperation(value = "网点详情")
    @RequestMapping(value = "/detail/{id}", method = RequestMethod.GET)
    @ResponseBody
    public String scanTmsOrder(@PathVariable String id){
        logger.info("[TmsPlatFormController.scanTmsOrder] IN");
        TmsPlatFormRequest req = new TmsPlatFormRequest();
        TmsPlatForm tmsPlatForm = new TmsPlatForm();
        tmsPlatForm.setId(id);
        req.setTmsPlatForm(tmsPlatForm);
        TmsPlatFormResponse resp = tmsPlatFormService.load(req);
        String retString = JacksonUtils.object2json(resp.getResultMap());
        logger.info("[TmsPlatFormController.scanTmsOrder] OUT");
        return retString;
    }

    /**
     * 删除
     * @param ids id
     * @return json
     */
    @ApiOperation(value = "网点删除")
    @RequestMapping(value = "/del/{ids}", method = RequestMethod.POST)
    @ResponseBody
    public String delete(@PathVariable String ids){
        logger.info("[TmsPlatFormController.delete] IN");
        TmsPlatFormRequest req = new TmsPlatFormRequest();
        req.setIds(ids);
        TmsPlatFormResponse resp = tmsPlatFormService.delete(req);
        String retString = null;
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TmsPlatFormController.delete] OUT");
        return retString;
    }
}
