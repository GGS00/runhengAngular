package com.cloudchain.admin.web.gms;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.gms.api.PropService;
import com.cloudchain.gms.pojo.bo.PropRequest;
import com.cloudchain.gms.pojo.bo.PropResponse;
import com.cloudchain.gms.pojo.vo.PropModel;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.Api;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by lihao on 2017/3/8.
 */
@Api(value = "prop-api", description = "属性相关接口")
@Controller
@RequestMapping(value = "/prop")
public class GmsPropController {
    public static final Logger LOGGER = LoggerFactory.getLogger(GmsPropController.class);

    @Autowired
    PropService propService;

    /**
     * 新增属性模板
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/addProp", method = RequestMethod.POST)
    public PropResponse addProp(HttpServletRequest request, @RequestBody PropModel propModel){
        LOGGER.info("PropController.addProp() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if (null == user){
            LOGGER.error("user is not login.");
            return null;
        }

        PropRequest req = new PropRequest();
        CommonParamUtil.setGmsOperator(request, req);
        req.setPropModel(propModel);
        PropResponse resp = propService.addProp(req);
        LOGGER.info("PropController.addProp() OUT");
        return resp;
    }


    /**
     * 新增属性模板
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/updateProp", method = RequestMethod.POST)
    public PropResponse updateProp(HttpServletRequest request, @RequestBody PropModel propModel){
        LOGGER.info("PropController.updateProp() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if (null == user){
            LOGGER.error("user is not login.");
            return null;
        }

        PropRequest req = new PropRequest();
        CommonParamUtil.setGmsOperator(request, req);
        req.setPropModel(propModel);
        PropResponse resp = propService.modifyProp(req);
        LOGGER.info("PropController.updateProp() OUT");
        return resp;
    }


    /**
     * 新增属性模板
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/loadProp/{propId}", method = RequestMethod.GET)
    public PropResponse loadProp(HttpServletRequest request, @PathVariable String propId){
        LOGGER.info("PropController.loadProp() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if (null == user){
            LOGGER.error("user is not login.");
            return null;
        }

        PropRequest req = new PropRequest();

        CommonParamUtil.setGmsOperator(request, req);
        req.setpId(propId);
        PropResponse resp = propService.loadProp(req);
        LOGGER.info("PropController.loadProp() OUT");
        return resp;
    }

    /**
     * 属性模板列表
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getPropList", method = RequestMethod.GET)
    public PropResponse getPropList(HttpServletRequest request){
        LOGGER.info("PropController.getPropList() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if (null == user){
            LOGGER.error("user is not login.");
            return null;
        }

        String userId = user.getUserId();
        PropRequest req = new PropRequest();
        req.setUserId(CommonParamUtil.getUserFromSession(request).getUserId());
        PropResponse resp = propService.getPropList(req);
        LOGGER.debug("user {} has {} props.", userId, CollectionUtils.isEmpty(resp.getData()) ? 0 : resp.getData().size());
        LOGGER.info("PropController.getPropList() OUT");
        return resp;
    }

    /**
     * 删除
     * @param pId
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/deleteProp/{pId}", method = RequestMethod.POST)
    public PropResponse deleteProp(@PathVariable String pId){
        LOGGER.info("PropController.deleteProp() IN");
        PropRequest req = new PropRequest();
        req.setpId(pId);
        PropResponse resp = propService.delProp(req);
        LOGGER.info("PropController.deleteProp() OUT");
        return resp;
    }
}
