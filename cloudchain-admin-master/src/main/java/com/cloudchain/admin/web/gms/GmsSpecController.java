package com.cloudchain.admin.web.gms;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.gms.api.SpecService;
import com.cloudchain.gms.pojo.bo.SpecRequest;
import com.cloudchain.gms.pojo.bo.SpecResponse;
import com.cloudchain.gms.pojo.vo.SpecModel;
import com.cloudchain.gms.pojo.vo.SpecValModel;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by lihao on 2017/3/7.
 */
@Api(value = "spec-api", description = "规格相关接口")
@Controller
@RequestMapping(value = "/spec")
public class GmsSpecController {
    public static final Logger LOGGER = LoggerFactory.getLogger(GmsSpecController.class);

    @Autowired
    SpecService specService;

    /**
     * 获取规格值列表
     * @return
     */
    @ApiOperation(value = "获取规格值列表")
    @ResponseBody
    @RequestMapping(value = "/getSpecValList/{specId}", method = RequestMethod.GET)
    public SpecResponse getSpecValList(@PathVariable String specId){
        LOGGER.info("SpecController.getSpecValList() IN");
        LOGGER.debug("get specval list with spec {}.", specId);

        SpecRequest req = new SpecRequest();
        req.setSpecId(specId);
        SpecResponse resp = specService.getSpecValsBySpecId(req);
        LOGGER.debug("spec {} has {} specvals.", resp.getData() == null ? 0 : resp.getData().size());

        LOGGER.info("SpecController.getSpecValList() OUT");
        return resp;
    }

    /**
     * 规格列表
     * @param tId
     * @return
     */
    @ApiOperation(value = "规格列表")
    @ResponseBody
    @RequestMapping(value = "/getSpecList/{tId}", method = RequestMethod.GET)
    public SpecResponse getSpecList(HttpServletRequest request, @PathVariable("tId") String tId){
        LOGGER.info("SpecController.getSpecList() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if (null == user){
            return null;
        }

        SpecRequest req = new SpecRequest();
        req.settId(tId);
        //req.setUserId(user.getUserId());
        SpecResponse resp = specService.getSpecsByTagId(req);
        LOGGER.info("SpecController.getSpecList() OUT");
        return resp;
    }

    /**
     * 新增规格
     * @param request
     * @return
     */
    @ApiOperation(value = "新增规格")
    @ResponseBody
    @RequestMapping(value = "/addSpec", method = RequestMethod.POST)
    public SpecResponse addSpec(HttpServletRequest request, @RequestBody SpecModel specModel){
        LOGGER.info("SpecController.addSpec() IN");
        SpecRequest req = new SpecRequest();

        CommonParamUtil.setGmsOperator(request, req);
        req.setSpec(specModel);
        SpecResponse resp = specService.addSpec(req);
        LOGGER.debug("add spec result {}.", resp.getStatus());
        LOGGER.info("SpecController.addSpec() OUT");
        return resp;
    }


    /**
     * 修改规格
     * @param request
     * @return
     */
    @ApiOperation(value = "修改规格")
    @ResponseBody
    @RequestMapping(value = "/updateSpec", method = RequestMethod.POST)
    public SpecResponse updateSpec(HttpServletRequest request, @RequestBody SpecModel specModel){
        LOGGER.info("SpecController.updateSpec() IN");
        SpecRequest req = new SpecRequest();

        CommonParamUtil.setGmsOperator(request, req);
        req.setSpec(specModel);
        SpecResponse resp = specService.updateSpec(req);
        LOGGER.debug("add spec result {}.", resp.getStatus());
        LOGGER.info("SpecController.updateSpec() OUT");
        return resp;
    }


    /**
     * 查看规格
     * @param request
     * @return
     */
    @ApiOperation(value = "查看规格")
    @ResponseBody
    @RequestMapping(value = "/loadSpec/{specId}", method = RequestMethod.GET)
    public SpecResponse loadSpec(HttpServletRequest request, @PathVariable String specId){
        LOGGER.info("SpecController.updateSpec() IN");
        SpecRequest req = new SpecRequest();
        CommonParamUtil.setGmsOperator(request, req);
        req.setSpecId(specId);
        SpecResponse resp = specService.loadSpec(req);
        LOGGER.debug("add spec result {}.", resp.getStatus());
        LOGGER.info("SpecController.updateSpec() OUT");
        return resp;
    }

    /**
     * 删除规格
     * @param request
     * @param specId
     * @return
     */
    @ApiOperation(value = "删除规格")
    @ResponseBody
    @RequestMapping(value = "/deleteSpec/{specId}", method = RequestMethod.POST)
    public SpecResponse delSpec(HttpServletRequest request, @PathVariable String specId){
        LOGGER.info("SpecController.updateSpec() IN");
        SpecRequest req = new SpecRequest();
        CommonParamUtil.setGmsOperator(request, req);
        req.setSpecId(specId);
        SpecResponse resp = specService.delSpec(req);
        LOGGER.debug("add spec result {}.", resp.getStatus());
        LOGGER.info("SpecController.updateSpec() OUT");
        return resp;
    }



    /**
     * 新增规格值
     * @param specValModel
     * @return
     */
    @ApiOperation(value = "新增规格值")
    @ResponseBody
    @RequestMapping(value = "addSpecVal", method = RequestMethod.POST)
    public SpecResponse addSpecVal(HttpServletRequest request, SpecValModel specValModel){
        LOGGER.info("SpecController.addSpecVal() IN");
        SpecRequest req = new SpecRequest();
        req.setSpecVal(specValModel);
        req.setUserId(CommonParamUtil.getUserFromSession(request).getUserId());
        SpecResponse resp = specService.addSpecVal(req);
        LOGGER.debug("add spec val result {}.", resp.getStatus());
        LOGGER.info("SpecController.addSpecVal() OUT");
        return resp;
    }
}
