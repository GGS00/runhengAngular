package com.cloudchain.admin.web.wms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.util.string.StringUtils;
import com.cloudchain.wms.api.stocktake.WmsStockTakeService;
import com.cloudchain.wms.pojo.bo.stocktake.StockTakeCheckInfo;
import com.cloudchain.wms.pojo.bo.stocktake.WmsStockTakeRequest;
import com.cloudchain.wms.pojo.bo.stocktake.WmsStockTakeResponse;
import com.cloudchain.wms.pojo.vo.StockTaskActiveModel;
import com.cloudchain.wms.pojo.vo.StockTaskAlloctModel;
import com.cloudchain.wms.pojo.vo.StockTaskInputModel;
import com.cloudchain.wms.pojo.vo.WmsStockTakePlanModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by wangqing on 2017/7/10.
 * 盘点
 */
@Controller
@RequestMapping("/wmsStockTake")
public class WmsStockTakeController {
    private static final Logger logger = LoggerFactory.getLogger(WmsStockTakeController.class);

    @Autowired
    WmsStockTakeService wmsStockTakeService;

    /**
     * 创建盘点单
     */
    @RequestMapping(value = "/addStockTakePlan", method = RequestMethod.POST)
    @ResponseBody
    public String addStockTakePlan(HttpServletRequest request,@RequestBody WmsStockTakePlanModel wmsStockTakePlanModel){
        logger.debug("[WmsStockTakeController.addStockTakePlan] IN");
        String retString = null;
        WmsStockTakeRequest req = new WmsStockTakeRequest();
        CommonParamUtil.setWmsOperator(request,req);
        req.setWmsStockTakePlanModel(wmsStockTakePlanModel);
        WmsStockTakeResponse response = wmsStockTakeService.addStockTakePlan(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.debug("[WmsStockTakeController.addStockTakePlan] OUT");
        return retString;
    }

    /**
     * 盘点单明细查询
     */
    @RequestMapping(value = "/qryStockTakeDetailById/{stocktakeId}", method = RequestMethod.GET)
    @ResponseBody
    public WmsStockTakeResponse qryStockTakeDetailById(HttpServletRequest request,@PathVariable String stocktakeId){
        logger.debug("[WmsStockTakeController.qryStockTakeDetailById] IN");
        WmsStockTakeResponse response = wmsStockTakeService.qryStockTakeDetailById(stocktakeId);
        logger.debug("[WmsStockTakeController.qryStockTakeDetailById] OUT");
        return response;
    }

    /**
     * 盘点单生效
     */
    @RequestMapping(value = "/stockTakeActive/{stocktakeCode}", method = RequestMethod.POST)
    @ResponseBody
    public String stockTakeActive(HttpServletRequest request,@PathVariable String stocktakeCode){
        logger.debug("[WmsStockTakeController.stockTakeActive] IN");
        String retString = null;
        WmsStockTakeRequest req = new WmsStockTakeRequest();
        CommonParamUtil.setWmsOperator(request,req);
        req.setStocktakeCode(stocktakeCode);
        WmsStockTakeResponse response = wmsStockTakeService.stockTakeActive(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.debug("[WmsStockTakeController.stockTakeActive] OUT");
        return retString;
    }

    /**
     * 盘点任务分配
     */
    @RequestMapping(value = "/stockTakeItemAlloct", method = RequestMethod.POST)
    @ResponseBody
    public String stockTakeItemAlloct(HttpServletRequest request, @RequestBody StockTaskAlloctModel stockTaskAlloctModel){
        logger.debug("[WmsStockTakeController.stockTakeItemAlloct] IN");
        String retString = null;
        WmsStockTakeRequest req = new WmsStockTakeRequest();
        CommonParamUtil.setWmsOperator(request,req);
        req.setStockTaskAlloctModel(stockTaskAlloctModel);
        WmsStockTakeResponse response = wmsStockTakeService.stockTakeItemAlloct(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.debug("[WmsStockTakeController.stockTakeItemAlloct] OUT");
        return retString;
    }

    /**
     * 盘点任务生效
     */
    @RequestMapping(value = "/stockTakeItemActive", method = RequestMethod.POST)
    @ResponseBody
    public String stockTakeItemActive(HttpServletRequest request, @RequestBody StockTaskActiveModel stockTaskActiveModel){
        logger.debug("[WmsStockTakeController.stockTakeItemActive] IN");
        String retString = null;
        WmsStockTakeRequest req = new WmsStockTakeRequest();
        CommonParamUtil.setWmsOperator(request,req);
        if(stockTaskActiveModel != null){
            req.setStocktakeCode(stockTaskActiveModel.getStocktakeCode());
            req.setDealType(stockTaskActiveModel.getDealType());
            req.setStocktakeItemIds(stockTaskActiveModel.getStocktakeItemIds());
        }
        WmsStockTakeResponse response = wmsStockTakeService.stockTakeItemActive(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.debug("[WmsStockTakeController.stockTakeItemActive] OUT");
        return retString;
    }

    /**
     * 盘点录入
     */
    @RequestMapping(value = "/stockTakeBatchInput", method = RequestMethod.POST)
    @ResponseBody
    public String stockTakeBatchInput(HttpServletRequest request, @RequestBody StockTaskInputModel stockTaskInputModel){
        logger.debug("[WmsStockTakeController.stockTakeBatchInput] IN");
        String retString = null;
        WmsStockTakeRequest req = new WmsStockTakeRequest();
        CommonParamUtil.setWmsOperator(request,req);
        if(stockTaskInputModel != null){
            req.setStocktakeCode(stockTaskInputModel.getStocktakeCode());
            req.setDealType(stockTaskInputModel.getDealType());
            req.setStockTakeCheckInfos(stockTaskInputModel.getStockTakeCheckInfos());
        }
        WmsStockTakeResponse response = wmsStockTakeService.stockTakeBatchInput(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.debug("[WmsStockTakeController.stockTakeBatchInput] OUT");
        return retString;
    }

    /**
     * 盘点平账
     */
    @RequestMapping(value = "/dealCheckDiff/{stocktakeCode}", method = RequestMethod.POST)
    @ResponseBody
    public String dealCheckDiff(HttpServletRequest request,@PathVariable String stocktakeCode,String stockTakeItemIds){
        logger.debug("[WmsStockTakeController.dealCheckDiff] IN");
        String retString = null;
        WmsStockTakeRequest req = new WmsStockTakeRequest();
        CommonParamUtil.setWmsOperator(request,req);
        req.setStocktakeCode(stocktakeCode);
        List<String> itemLst = new ArrayList<String>();
        if(!StringUtils.isEmpty(stockTakeItemIds)){
            String[] items = stockTakeItemIds.split(",");
            for(String str : items){
                itemLst.add(str);
            }
        }
        req.setStocktakeItemIds(itemLst);
        WmsStockTakeResponse response = wmsStockTakeService.dealCheckDiff(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.debug("[WmsStockTakeController.dealCheckDiff] OUT");
        return retString;
    }

    /**
     * 查询仓库下入库的商品列表
     */
    @RequestMapping(value = "/qryProductByWareHouse", method = RequestMethod.POST)
    @ResponseBody
    public String qryProductByWareHouse(HttpServletRequest request, List<String> wareHouseIdLst){
        logger.debug("[WmsStockTakeController.qryProductByWareHouse] IN");
        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);
        Map<String,Object> map = new HashMap<String,Object>();
        map.put("userId",userModel.getUserId());
        map.put("wareHouseIdLst",wareHouseIdLst);
        String retString = wmsStockTakeService.qryProductByWareHouse(map);
        logger.debug("[WmsStockTakeController.qryProductByWareHouse] OUT");
        return retString;
    }

    /**
     * 汇总盘点单下商品数、记录数、库位数
     */
    @RequestMapping(value = "/statNumForStockTakeItem/{stocktakeCode}", method = RequestMethod.POST)
    @ResponseBody
    public int statNumForStockTakeItem(HttpServletRequest request, @PathVariable String stocktakeCode, String statType, String stockTakeItemIds){
        logger.debug("[WmsStockTakeController.qryProductByWareHouse] IN");
        List<String> list = new ArrayList<String>();
        if(StringUtils.isEmpty(stockTakeItemIds)){
            list = null;
        }else {
            String[] strs = stockTakeItemIds.split(",");
            for(String str : strs){
                list.add(str);
            }
        }
        int total = wmsStockTakeService.statNumForStockTakeItem(stocktakeCode,statType,list);
        logger.debug("[WmsStockTakeController.qryProductByWareHouse] OUT");
        return total;

    }

}
