package com.cloudchain.admin.web.wms;

import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.turnovercarton.WmsTurnoverCartonService;
import com.cloudchain.wms.pojo.bo.turnovercarton.WmsTurnoverCartonRequest;
import com.cloudchain.wms.pojo.bo.turnovercarton.WmsTurnoverCartonResponse;
import com.cloudchain.wms.pojo.po.WmsTurnoverCartonConfig;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by LiuKai on 2017/7/19.
 */
@Api(value = "wms-turnoverCarton-api", description = "周转箱接口")
@Controller
@RequestMapping("/wms/turnoverCarton")
public class WmsTurnoverCartonController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(WmsTurnoverCartonController.class);

    @Autowired
    private WmsTurnoverCartonService cartonService;

    /**
     * 新建出周转箱
     * @param request HttpServletRequest
     * @param req WmsTurnoverCartonRequest
     * @return
     */
    @ApiOperation(value = "新建周转箱")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public WmsTurnoverCartonResponse add(HttpServletRequest request, @RequestBody WmsTurnoverCartonRequest req) {
        logger.info("[WmsTurnoverCartonController.add] IN");
        CommonParamUtil.setWmsOperator(request, req);
        WmsTurnoverCartonResponse resp = cartonService.add(req);
        logger.info("[WmsTurnoverCartonController.add] OUT");
        return resp;
    }

    /**
     *  修改周转箱
     * @param request
     * @param cartonConfig
     * @return
     */
    @ApiOperation(value = "修改周转箱")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public WmsTurnoverCartonResponse update(HttpServletRequest request, @RequestBody WmsTurnoverCartonConfig cartonConfig) {
        logger.info("[WmsTurnoverCartonController.update] IN");

        WmsTurnoverCartonRequest req = new WmsTurnoverCartonRequest();
        req.setCartonConfig(cartonConfig);
        CommonParamUtil.setWmsOperator(request, req);
        WmsTurnoverCartonResponse resp = cartonService.update(req);
        logger.info("[WmsTurnoverCartonController.update] OUT");
        return resp;
    }


    @ApiOperation(value = "周转箱详情")
    @RequestMapping(value = "/load/{id}", method = RequestMethod.GET)
    @ResponseBody
    public WmsTurnoverCartonResponse load(HttpServletRequest request, @PathVariable String id) {
        logger.info("[WmsTurnoverCartonController.load] IN");

        WmsTurnoverCartonRequest req = new WmsTurnoverCartonRequest();
        req.setCartonId(id);
        CommonParamUtil.setWmsOperator(request, req);
        WmsTurnoverCartonResponse resp = cartonService.load(req);
        logger.info("[WmsTurnoverCartonController.load] OUT");
        return resp;
    }

    /**
     * 删除周转箱
     * @param request
     * @param id
     * @return
     */
    @ApiOperation(value = "删除周转箱")
    @RequestMapping(value = "/delete/{id}", method = RequestMethod.POST)
    @ResponseBody
    public WmsTurnoverCartonResponse delete(HttpServletRequest request, @PathVariable String id) {
        logger.info("[WmsTurnoverCartonController.delete] IN");

        WmsTurnoverCartonRequest req = new WmsTurnoverCartonRequest();
        req.setCartonId(id);
        CommonParamUtil.setWmsOperator(request, req);
        WmsTurnoverCartonResponse resp = cartonService.delete(req);
        logger.info("[WmsTurnoverCartonController.delete] OUT");
        return resp;
    }
}
