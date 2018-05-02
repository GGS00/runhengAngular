package com.cloudchain.admin.web.transport.dispatch;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.model.base.BatchProcessResult;
import com.cloudchain.admin.model.tms.DispatchBillModel;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.tms.api.TmsDispatchBillService;
import com.cloudchain.tms.pojo.bo.dispatch.TmsDispatchBillRequest;
import com.cloudchain.tms.pojo.bo.dispatch.TmsDispatchBillResponse;
import com.cloudchain.tms.pojo.po.TmsDispatchBill;
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
 * Created by LiuKai on 2017/3/7.
 */
@Api(value = "tms-dispatch-api", description = "调度接口")
@Controller
@RequestMapping("/transport/dispatch/allocate")
public class TmsDispatchBillController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(TmsDispatchBillController.class);

    @Autowired
    private TmsDispatchBillService tmsDispatchBillService;

    /**
     * 新建调度
     * @param request HttpServletRequest
     * @param model DispatchBillModel
     * @return 结果
     */
    @ApiOperation(value = "新增调度单")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public String save(HttpServletRequest request, DispatchBillModel model) {
        logger.info("[TmsDispathchBillController.save] IN");
        String retString = null;

        TmsDispatchBillRequest req = new TmsDispatchBillRequest();
        req.setTmsDispatchBill(model.getDispatchBill());
        req.setDispatchDriverList(model.getDispatchDriverList());
        req.setTmsDispatchFee(model.getDispatchFee());
        req.setSegmentIds(model.getSegmentIds());
        req.setSegmentDrivers(model.getSegmentDrivers());

        CommonParamUtil.setTmsOperator(request, req);

        TmsDispatchBillResponse resp = tmsDispatchBillService.save(req);
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TmsDispathchBillController.save] OUT");
        return retString;
    }


    /**
     * 修改调度单
     * @param request HttpServletRequest
     * @param model DispatchBillModel
     * @return 结果
     */
    @ApiOperation(value = "修改调度单")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public String update(HttpServletRequest request, DispatchBillModel model) {
        logger.info("[TmsDispathchBillController.update] IN");
        String retString = null;

        TmsDispatchBillRequest req = new TmsDispatchBillRequest();
        req.setTmsDispatchBill(model.getDispatchBill());
        req.setDispatchDriverList(model.getDispatchDriverList());
        req.setTmsDispatchFee(model.getDispatchFee());
        req.setSegmentIds(model.getSegmentIds());

        CommonParamUtil.setTmsOperator(request, req);

        TmsDispatchBillResponse resp = tmsDispatchBillService.update(req);
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TmsDispathchBillController.update] OUT");
        return retString;
    }

    /**
     * 详细信息
     * @param request
     * @param id
     * @return 详情
     */
    @ApiOperation(value = "调度单详情")
    @RequestMapping(value = "/detail/{id}", method = RequestMethod.GET)
    @ResponseBody
    public String scan(HttpServletRequest request, @PathVariable String id){
        logger.info("[TmsDispathchBillController.scan] IN");
        TmsDispatchBillRequest req = new TmsDispatchBillRequest();
        req.setDispatchId(id);
        TmsDispatchBillResponse resp = tmsDispatchBillService.load(req);
        logger.info("[TmsDispathchBillController.scan] OUT");
        return resp.getRetString();
    }

    /**
     * 删除调度单
     * @param id
     * @return
     */
    @ApiOperation(value = "删除调度单")
    @RequestMapping(value = "/del/{id}", method = RequestMethod.POST)
    @ResponseBody
    public String delete(@PathVariable String id) {
        logger.info("[TmsDispathchBillController.delete] IN");
        TmsDispatchBillRequest req = new TmsDispatchBillRequest();
        req.setDispatchId(id);
        TmsDispatchBillResponse resp = tmsDispatchBillService.delete(req);
        String retString = null;
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TmsDispathchBillController.delete] OUT");
        return retString;
    }


    /**
     * 批量生效调度单
     * @param request HttpServletRequest
     * @param ids 调度单ID
     * @return 结果
     */
    @ApiOperation(value = "调度单生效")
    @RequestMapping(value = "/active/{ids}", method = RequestMethod.POST)
    @ResponseBody
    public String activeBatch(HttpServletRequest request, @PathVariable String ids) {
        return updateStatus(request, ids, "ACTIVE");
    }

    /**
     * 批量失效调度单
     * @param request HttpServletRequest
     * @param ids 调度单ID
     * @return 结果
     */
    @ApiOperation(value = "调度单失效")
    @RequestMapping(value = "/invalid/{ids}", method = RequestMethod.POST)
    @ResponseBody
    public String openBatch(HttpServletRequest request, @PathVariable String ids) {
        return updateStatus(request, ids, "OPEN");
    }

    private String updateStatus(HttpServletRequest request, String ids, String status){
        String[] idArray = ids.split(",");
        int totalCount = idArray.length;
        int failCount = 0;
        String eMsg = "";// 异常消息

        TmsDispatchBillRequest req = new TmsDispatchBillRequest();
        req.setDispatchId(ids);
        TmsDispatchBill dispatchBill = new TmsDispatchBill();
        dispatchBill.setStatus(status);
        req.setTmsDispatchBill(dispatchBill);
        //User user = SecurityContextHolder.getCurrentUser();
        CommonParamUtil.setTmsOperator(request, req);
        TmsDispatchBillResponse resp = tmsDispatchBillService.changeStatus(req);
        if (!ResultCode.SUCCESS.equals(resp.getStatus())) {
            failCount = totalCount;
        }
        else {
            failCount = Integer.valueOf(resp.getRetString());
        }
        eMsg = resp.getMsg();
        return CommonControllerAspect.batchProcessResult(new BatchProcessResult(totalCount, failCount, eMsg));
    }

}
