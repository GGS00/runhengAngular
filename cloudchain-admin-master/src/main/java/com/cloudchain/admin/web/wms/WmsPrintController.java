package com.cloudchain.admin.web.wms;

import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.print.WmsPrintService;
import com.cloudchain.wms.pojo.bo.print.PrintRequest;
import com.cloudchain.wms.pojo.bo.print.PrintResponse;
import com.cloudchain.wms.pojo.po.WmsPrintTemplate;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by LiuKai on 2017/7/11.
 */
@Api(value = "wms-print-api", description = "打印模板接口")
@Controller
@RequestMapping("/wmsPrint")
public class WmsPrintController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(WmsPrintController.class);

    @Autowired
    private WmsPrintService printService;

    /**
     * 新增打印模板
     * @param request
     * @param printTemplate
     * @return
     */
    @ApiOperation(value = "新增打印模板")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public PrintResponse add(HttpServletRequest request, @RequestBody WmsPrintTemplate printTemplate) {

        PrintRequest req = new PrintRequest();
        CommonParamUtil.setWmsOperator(request, req);

        req.setPrintTemplate(printTemplate);

        PrintResponse resp = printService.add(req);

        return resp;
    }

    /**
     * 修改打印模板
     * @param request
     * @param printTemplate
     * @return
     */
    @ApiOperation(value = "添加打印模板url")
    @RequestMapping(value = "/addTemplateInfo", method = RequestMethod.POST)
    @ResponseBody
    public PrintResponse addTemplateInfo(HttpServletRequest request, @RequestBody WmsPrintTemplate printTemplate) {

        PrintRequest req = new PrintRequest();
        CommonParamUtil.setWmsOperator(request, req);

        req.setPrintTemplate(printTemplate);

        PrintResponse resp = printService.addTemplateInfo(req);

        return resp;
    }

    /**
     * 修改打印模板
     * @param request
     * @param printTemplate
     * @return
     */
    @ApiOperation(value = "修改打印模板")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public PrintResponse update(HttpServletRequest request, @RequestBody WmsPrintTemplate printTemplate) {

        PrintRequest req = new PrintRequest();
        CommonParamUtil.setWmsOperator(request, req);

        req.setPrintTemplate(printTemplate);

        PrintResponse resp = printService.update(req);

        return resp;
    }

    /**
     * 删除打印模板
     * @param request
     * @param templateId
     * @return
     */
    @ApiOperation(value = "删除打印模板")
    @RequestMapping(value = "/delete/{templateId}", method = RequestMethod.POST)
    @ResponseBody
    public PrintResponse update(HttpServletRequest request, @PathVariable String templateId) {

        PrintRequest req = new PrintRequest();
        CommonParamUtil.setWmsOperator(request, req);

        req.setTemplateId(templateId);

        PrintResponse resp = printService.delete(req);

        return resp;
    }

    /**
     * 加载打印模板
     * @param request
     * @param templateId
     * @return
     */
    @ApiOperation(value = "加载打印模板")
    @RequestMapping(value = "/load/{templateId}", method = RequestMethod.GET)
    @ResponseBody
    public PrintResponse load(HttpServletRequest request, @PathVariable String templateId) {

        PrintRequest req = new PrintRequest();
        CommonParamUtil.setWmsOperator(request, req);

        req.setTemplateId(templateId);

        PrintResponse resp = printService.load(req);

        return resp;
    }

    /**
     * 查询模板元数据
     * @param request
     * @param printTemplate
     * @return
     */
    @ApiOperation(value = "查询模板元数据")
    @RequestMapping(value = "/getPrintCol", method = RequestMethod.POST)
    @ResponseBody
    public PrintResponse getPrintCol(HttpServletRequest request, @RequestBody WmsPrintTemplate printTemplate) {

        PrintRequest req = new PrintRequest();
        CommonParamUtil.setWmsOperator(request, req);

        req.setPrintTemplate(printTemplate);

        PrintResponse resp = printService.getPrintCol(req);

        return resp;
    }
}
