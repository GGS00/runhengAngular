package com.cloudchain.admin.web.wms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.inbound.WmsInboundItemService;
import com.cloudchain.wms.pojo.bo.inbound.WmsInboundRequest;
import com.cloudchain.wms.pojo.bo.inbound.WmsInboundResponse;
import com.cloudchain.wms.pojo.po.WmsInboundItem;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;

/**
 * Created by zmj on 2017/3/20.
 */
@Controller
@RequestMapping("/wmsInboundItem")
public class WmsInboundItemController  {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(WmsInboundItemController.class);

    @Autowired
    private WmsInboundItemService wmsInboundItemService;

    @ApiOperation(value = "新增入库单明细")
    @RequestMapping(value = "/addInboundItem", method = RequestMethod.POST)
    @ResponseBody
    public String saveInboundItem(HttpServletRequest request, WmsInboundItem inboundItem){
        logger.info("[WmsInboundItemController.saveInboundItem] IN");
        String retString = null;
        WmsInboundRequest req  = new WmsInboundRequest();
        req.setId(inboundItem.getInboundId());
        req.setProductCode(inboundItem.getProductId());
        req.setQuantity(inboundItem.getExpectedQuantityBu());
        req.setInvStatus(inboundItem.getInventoryStatus());
        req.setCode(inboundItem.getInboundCode());
        CommonParamUtil.setWmsOperator(request,req);
        WmsInboundResponse response =  wmsInboundItemService.addInboundItem(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = response.getRetString();
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsInboundItemController.saveInboundItem] OUT");
        return retString;
    }



    @ApiOperation(value="单一明细收货")
    @RequestMapping(value = "/doReceiveDetail", method = RequestMethod.POST)
    @ResponseBody
    public  String doReceiveDetail(HttpServletRequest request){
        logger.info("[WmsInboundItemController.doReceiveDetail] IN");

        String itemId = request.getParameter("itemId");
        String quantity = request.getParameter("quantity");
        String inventoryStatus = request.getParameter("inventoryStatus");
        String retString = null;
        WmsInboundRequest req  = new WmsInboundRequest();
        req.setItemId(itemId);
        req.setQuantity(new BigDecimal(quantity));
        req.setInvStatus(inventoryStatus);
        CommonParamUtil.setWmsOperator(request,req);
        WmsInboundResponse response =  wmsInboundItemService.inboundItemReceive(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString =  CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsInboundItemController.doReceiveDetail] OUT");
        return retString;
    }

    @ApiOperation(value = "更新入库单明细")
    @RequestMapping(value = "/updInboundItem",method = RequestMethod.POST)
    @ResponseBody
    public String updInboundItem(HttpServletRequest request){
        String retString="";
        logger.info("[WmsInboundItemController.updInboundItem] IN");
        //获取入库单id
        String inboundId = request.getParameter("inboundId");
        //获取入库单明细id
        String inboundItemId = request.getParameter("inboundItemId");
        //获取修改的内容
        String updStr = request.getParameter("quantity");
        logger.info("本次修改的入库单明细id为:"+inboundItemId+",更新期待收货数量为:"+updStr);

        BigDecimal updNum = new BigDecimal(updStr);

        WmsInboundRequest req  = new WmsInboundRequest();
        req.setId(inboundId);
        req.setItemId(inboundItemId);
        req.setQuantity(updNum);
        CommonParamUtil.setWmsOperator(request,req);
        //d调wms服务进行更新
        WmsInboundResponse response =  wmsInboundItemService.updateInboundItem(req);   //目前只支持修改期待收货数量
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString =  response.getRetString();
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsInboundItemController.updInboundItem] OUT");
        return retString;
    }

    @ApiOperation(value = "批量删除入库单明细")
    @RequestMapping(value = "/delInboundItems",method = RequestMethod.POST)
    @ResponseBody
    public String delInboundItems(HttpServletRequest request){
        String retString="";
        logger.info("[WmsInboundItemController.delInboundItems] IN");
        //获取入库单id
        String inboundId = request.getParameter("inboundId");
        //获取入库单明细id
        String inboundItemId = request.getParameter("inboundItemId");
        logger.info("本次删除的入库单明细id为:"+inboundItemId);

        WmsInboundRequest req  = new WmsInboundRequest();
        req.setId(inboundId);
        req.setItemId(inboundItemId);  //多条明细时，明细id以","逗号进行分割传入
        CommonParamUtil.setWmsOperator(request,req);
        //d调wms服务进行批量删除
        WmsInboundResponse response =  wmsInboundItemService.deleteInboundItem(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString =  response.getRetString();
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsInboundItemController.delInboundItems] OUT");
        return retString;
    }

}
