package com.cloudchain.admin.web.wms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.shelvedoc.WmsShelvedocService;
import com.cloudchain.wms.api.shelvework.WmsShelveWorkService;
import com.cloudchain.wms.pojo.bo.shelvedoc.WmsShelvedocRequest;
import com.cloudchain.wms.pojo.bo.shelvedoc.WmsShelvedocResponse;
import com.cloudchain.wms.pojo.po.WmsShelveDocItem;
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
 * Created by zmj on 2017/3/20.
 */
@Controller
@RequestMapping("/shelveDoc")
public class WmsShelveDocController {

    @Autowired
    private WmsShelvedocService shelvedocService;

    @Autowired
    private WmsShelveWorkService shelveWorkService;



    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(WmsShelveDocController.class);



    @RequestMapping(value = "/createShelveDoc/{id}",method = RequestMethod.POST)
    @ResponseBody
    @ApiOperation(value = "创建上架单")
    public  String createShelveDoc(HttpServletRequest request,@PathVariable  String id){
        logger.info("[WmsShelveDocController.createShelveDoc] IN");
        String retString = null;
        WmsShelvedocRequest req  = new WmsShelvedocRequest();
        req.setId(id);
        CommonParamUtil.setWmsOperator(request,req);
        WmsShelvedocResponse response = shelvedocService.createShelveDoc(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString =  CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsShelveDocController.createShelveDoc] OUT");
        return retString;
    }



    @RequestMapping(value = "/doManulAllocate",method = RequestMethod.POST)
    @ResponseBody
    @ApiOperation(value = "手工分配")
    public String doManulAllocate(HttpServletRequest request, WmsShelveDocItem shelveDocItem){
        logger.info("[WmsShelveDocController.doManulAllocate] IN");
        String retString = null;
        WmsShelvedocRequest req  = new WmsShelvedocRequest();
        req.setShelveDocDetailId(shelveDocItem.getId());
        req.setAllocateQuantity(shelveDocItem.getAllocatedQuantityBu().longValue());
        req.setDstLocationId(shelveDocItem.getDestLocationId());
        req.setInvStatus(shelveDocItem.getInventoryStatus());
        CommonParamUtil.setWmsOperator(request,req);
        WmsShelvedocResponse response = shelvedocService.doManulAllocate(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString =  CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsShelveDocController.doManulAllocate] OUT");
        return retString;
    }


    @RequestMapping(value = "/activeShelveDoc/{id}",method = RequestMethod.POST)
    @ResponseBody
    @ApiOperation(value = "上架单生效")
    public String activeShelveDoc(HttpServletRequest request,@PathVariable String  id){
        logger.info("[WmsShelveDocController.activeShelveDoc] IN");
        String retString = null;
        WmsShelvedocRequest req  = new WmsShelvedocRequest();
        req.setId(id);
        CommonParamUtil.setWmsOperator(request,req);
        WmsShelvedocResponse response = shelvedocService.activeShelveDoc(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString =  CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsShelveDocController.activeShelveDoc] OUT");
        return retString;
    }


    @RequestMapping(value = "/disableShelveDoc/{id}",method = RequestMethod.POST)
    @ResponseBody
    @ApiOperation(value = "上架单失效")
    public String disableShelveDoc(HttpServletRequest request,@PathVariable String  id){
        logger.info("[WmsShelveDocController.disableShelveDoc] IN");
        String retString = null;
        WmsShelvedocRequest req  = new WmsShelvedocRequest();
        req.setId(id);
        CommonParamUtil.setWmsOperator(request,req);
        WmsShelvedocResponse response = shelvedocService.disableShelveDoc(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString =  CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsShelveDocController.disableShelveDoc] OUT");
        return retString;
    }


    @RequestMapping(value = "/singleConfirmDoc",method = RequestMethod.POST)
    @ResponseBody
    @ApiOperation(value = "作业单单一确认")
    public String singleConfirmDoc(HttpServletRequest request,String taskId,Integer quantity){
        logger.info("[WmsShelveDocController.singleConfirmDoc] IN");
        String retString = null;
        WmsShelvedocRequest req  = new WmsShelvedocRequest();
        req.setTaskId(taskId);
        req.setAllocateQuantity(quantity);
        CommonParamUtil.setWmsOperator(request,req);
        WmsShelvedocResponse response = shelveWorkService.singleConfirmDoc(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString =  CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsShelveDocController.singleConfirmDoc] OUT");
        return retString;
    }

    /**
     * 上架单人员分配
     * @param shelveDocId 上架单ID
     * @param taskExector 责任人
     */
    @RequestMapping(value = "/shelveDocAllotEmply/{shelveDocId}",method = RequestMethod.POST)
    @ResponseBody
    public String shelveDocAllotEmply(HttpServletRequest request,@PathVariable String shelveDocId, String taskExector, String taskExeNmae){
        logger.info("[WmsShelveDocController.shelveDocAllotEmply] IN");
        String retString = null;
        WmsShelvedocRequest req  = new WmsShelvedocRequest();
        CommonParamUtil.setWmsOperator(request,req);
        req.setShelveDocId(shelveDocId);
        req.setTaskExector(taskExector);
        req.setTaskExectorName(taskExeNmae);
        WmsShelvedocResponse response = shelvedocService.shelveDocAllotEmply(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString =  CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsShelveDocController.shelveDocAllotEmply] OUT");
        return retString;
    }

}
