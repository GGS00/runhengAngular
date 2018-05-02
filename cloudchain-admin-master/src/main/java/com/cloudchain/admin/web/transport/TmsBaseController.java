package com.cloudchain.admin.web.transport;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.util.JacksonUtils;
import com.cloudchain.tms.api.TmsBaseService;
import com.cloudchain.tms.pojo.bo.TmsCommonRequest;
import com.cloudchain.tms.pojo.bo.TmsResponse;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by LiuKai on 2017/4/5.
 */
public abstract class TmsBaseController<T, R extends TmsCommonRequest, Q extends TmsResponse> {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(TmsBaseController.class);

    /**
     * 新增
     * @param request HttpServletRequest
     * @param t TmsVehicle
     * @return json
     */
    @ApiOperation(value = "新增")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public String save(HttpServletRequest request, T t) {
        logger.info("[{}.save] IN", this.getClass().getSimpleName());
        long begin = System.currentTimeMillis();

        String retString = null;
        R req = getReq();
        req.setReqEntity(t);

        CommonParamUtil.setTmsOperator(request, req);

        Q resp = getService().save(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[{}.save] OUT,cost time:{}s", this.getClass().getSimpleName(), (end - begin) / 1000d);
        return retString;
    }

    protected abstract TmsBaseService<R, Q> getService();

    protected abstract R getReq();


    /**
     * 修改车辆
     * @param request HttpServletRequest
     * @param t TmsVehicle
     * @return json
     */
    @ApiOperation(value = "修改")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public String update(HttpServletRequest request,T t) {
        logger.info("[{}.update] IN", this.getClass().getSimpleName());
        long begin = System.currentTimeMillis();

        String retString = null;
        R req = getReq();
        req.setReqEntity(t);

        CommonParamUtil.setTmsOperator(request, req);

        Q resp = getService().update(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[{}.update] OUT,cost time:{}s", this.getClass().getSimpleName(), (end - begin) / 1000d);
        return retString;
    }

    /**
     *  车辆详情
     * @param id 车辆ID
     * @return json
     */
    @ApiOperation(value = "详情")
    @RequestMapping(value = "/detail/{id}", method = RequestMethod.GET)
    @ResponseBody
    public String scan(@PathVariable String id){
        logger.info("[{}.scan] IN", this.getClass().getSimpleName());
        R req = getReq();
        req.setIds(id);
        Q resp = getService().load(req);
        String retString = resp.getRetString();
        if (StringUtils.isEmpty(retString)) {
            retString = JacksonUtils.object2json(resp.getObj());
        }
        logger.info("[{}.scan] OUT", this.getClass().getSimpleName());
        return retString;
    }

    /**
     * 删除车辆
     * @param id 车辆ID
     * @return json
     */
    @ApiOperation(value = "删除")
    @RequestMapping(value = "/del/{id}", method = RequestMethod.POST)
    @ResponseBody
    public String delete(@PathVariable String id){
        logger.info("[{}.delete] IN", this.getClass().getSimpleName());
        R req = getReq();
        req.setIds(id);
        String retString = null;
        Q resp = getService().delete(req);
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[{}.delete] OUT", this.getClass().getSimpleName());
        return retString;
    }
}
