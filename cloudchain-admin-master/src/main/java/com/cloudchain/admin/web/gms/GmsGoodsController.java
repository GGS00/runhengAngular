package com.cloudchain.admin.web.gms;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.gms.api.GoodsService;
import com.cloudchain.gms.pojo.bo.GoodsRequest;
import com.cloudchain.gms.pojo.bo.GoodsResponse;
import com.cloudchain.gms.pojo.vo.GoodsModel;
import com.cloudchain.gms.pojo.vo.SkuInvModel;
import com.cloudchain.gms.pojo.vo.WhInvModel;
import com.cloudchain.ims.api.VirtualityInvService;
import com.cloudchain.ims.pojo.bo.InventoryRequest;
import com.cloudchain.ims.pojo.bo.InventoryResponse;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.exception.CloudChainServiceException;
import com.cloudchain.ums.api.UmsSupplierService;
import com.cloudchain.ums.pojo.bo.supplier.SupplierInfo;
import com.cloudchain.ums.pojo.bo.supplier.UmsSupplierResponse;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.warehouse.WmsWarehouseService;
import com.cloudchain.wms.pojo.bo.warehouse.WmsWarehouseRequest;
import com.cloudchain.wms.pojo.bo.warehouse.WmsWarehouseResponse;
import com.cloudchain.wms.pojo.po.WmsWarehouse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 2017/3/9.
 */
@Api(value = "goods-api", description = "商品相关接口")
@Controller
@RequestMapping(value = "/goods")
public class GmsGoodsController {
    public static final Logger LOGGER = LoggerFactory.getLogger(GmsGoodsController.class);

    @Autowired
    GoodsService goodsService;

    @Autowired
    VirtualityInvService virtualityInvService;

    @Autowired
    UmsSupplierService umsSupplierService;

    @Autowired
    private WmsWarehouseService warehouseService;

    /**
     * @param spuId
     * @return
     */
    @ApiOperation(value = "商品详情")
    @ResponseBody
    @RequestMapping(value = "/getGoodsInfo/{spuId}", method = RequestMethod.GET)
    public GoodsResponse getGoodsInfo(@PathVariable String spuId, HttpServletRequest request) {
        LOGGER.info("GoodsController.getGoodsInfo() IN");
        GoodsRequest req = new GoodsRequest();
        req.setSpuId(spuId);
        CommonParamUtil.setGmsOperator(request, req);
        String queryType = request.getParameter("queryType");
        req.setQueryType(queryType);
        GoodsResponse resp = goodsService.getGoodsInfo(req);
        LOGGER.info("GoodsController.getGoodsInfo() OUT");
        return resp;
    }

    /**
     * 添加商品
     *
     * @param request
     * @return
     */
    @ApiOperation(value = "添加商品")
    @ResponseBody
    @RequestMapping(value = "/saveGoodsInfo", method = RequestMethod.POST)
    public GoodsResponse saveGoodsInfo(HttpServletRequest request, @RequestBody GoodsModel goodsModel) {
        LOGGER.info("GoodsController.addGoddsInfo() IN");
        GoodsResponse resp = new GoodsResponse();
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if (null == user || StringUtils.isEmpty(user.getUserId())) {
            LOGGER.error("user is not login, can not save goods info.");
            return resp;
        }

        GoodsRequest req = new GoodsRequest();
        CommonParamUtil.setGmsOperator(request, req);
        goodsModel.setDataFrom(1);
        req.setGoodsModel(goodsModel);

        try {
            resp = goodsService.saveGoodsInfo(req);
        } catch (CloudChainServiceException e) {
            resp = new GoodsResponse();
            resp.setStatus(e.getResultCode());
            LOGGER.error("[GoodsController.saveGoodsInfo] error", e);
        } catch (Exception e) {
            LOGGER.error("[GoodsController.saveGoodsInfo] error", e);
            resp = new GoodsResponse();
            resp.setStatus(ResultCode.SYSTEM_EXCEPTION);
        }
        LOGGER.info("GoodsController.addGoddsInfo() OUT");
        return resp;
    }


    /**
     * 修改商品信息
     * @param request HttpServletRequest
     * @param type 0：基础信息，1：销售信息，2：详情
     * @return json
     */
    @ApiOperation(value = "修改商品信息")
    @ResponseBody
    @RequestMapping(value = "/updateGoodsBase/{type}", method = RequestMethod.POST)
    public GoodsResponse updateGoodsBase(HttpServletRequest request, @RequestBody GoodsModel goodsModel, @PathVariable Integer type) {
        LOGGER.info("GoodsController.updateGoodsBase() IN");

        GoodsResponse resp = updateGoods(request, type, goodsModel);

        LOGGER.info("GoodsController.updateGoodsBase() OUT");
        return resp;
    }

    private GoodsResponse updateGoods(HttpServletRequest request, int type, GoodsModel goodsModel) {

        GoodsRequest req = new GoodsRequest();
        CommonParamUtil.setGmsOperator(request, req);
        req.setGoodsModel(goodsModel);

        switch (type) {
            case 0 :
                req.setUpdateSpu(true);
                break;
            case 1 :
                req.setUpdateSku(true);
                break;
            case 2 :
                req.setUpdateInfo(true);
                break;
            case 3 :
                req.setUpdateProp(true);
                break;
        }

        GoodsResponse resp = null;
        try {
            resp = goodsService.updateGoodsInfo(req);
        } catch (CloudChainServiceException e) {

            resp = new GoodsResponse();
            resp.setStatus(e.getResultCode());
            resp.setMsg(e.getResultMsg());
            LOGGER.error("[GoodsController.updateGoods] error", e);
        } catch (Exception e) {
            LOGGER.error("[GoodsController.updateGoods] error", e);
            resp = new GoodsResponse();
            resp.setStatus(ResultCode.SYSTEM_EXCEPTION);
        }
        return resp;
    }


    /**
     * 获取sku
     *
     * @param skuId
     * @return
     */
    @ApiOperation(value = "获取sku信息")
    @ResponseBody
    @RequestMapping(value = "/getSkuInfo/{skuId}", method = RequestMethod.POST)
    public GoodsResponse getSkuInfo(@PathVariable String skuId, HttpServletRequest request) {
        LOGGER.info("GoodsController.getSkuInfo() IN");
        GoodsRequest req = new GoodsRequest();
        req.setUserId(CommonParamUtil.getUserFromSession(request).getUserId());
        req.setSkuId(skuId);
        GoodsResponse resp = goodsService.getSkuInfo(req);
        LOGGER.info("GoodsController.getSkuInfo() OUT");
        return resp;
    }

    /**
     * 根据spuId获取sku信息，设置销售库存，查询页面
     * @param spuId
     * @param request
     * @return
     */
    @ApiOperation(value = "根据spuId获取sku信息")
    @ResponseBody
    @RequestMapping(value = "/getSkuBySpu/{spuId}", method = RequestMethod.POST)
    public GoodsResponse getSkuBySpu(@PathVariable String spuId, HttpServletRequest request) {
        LOGGER.info("GoodsController.getSkuBySpu() IN");
        GoodsRequest req = new GoodsRequest();
        req.setUserId(CommonParamUtil.getUserFromSession(request).getUserId());
        req.setSpuId(spuId);
        GoodsResponse resp = goodsService.getSkuBySpuId(req);
        LOGGER.info("GoodsController.getSkuBySpu() OUT");
        return resp;
    }

    /**
     * 根据spuId删除
     * @param spuId
     * @param request
     * @return
     */
    @ApiOperation(value = "根据spuId删除")
    @ResponseBody
    @RequestMapping(value = "/deleteSpu/{spuId}", method = RequestMethod.POST)
    public GoodsResponse deleteSpu(@PathVariable String spuId, HttpServletRequest request) {
        LOGGER.info("GoodsController.deleteSpu() IN");
        GoodsRequest req = new GoodsRequest();
        req.setUserId(CommonParamUtil.getUserFromSession(request).getUserId());
        req.setSpuIds(spuId);
        GoodsResponse resp = goodsService.deleteSpu(req);
        LOGGER.info("GoodsController.deleteSpu() OUT");
        return resp;
    }

    /**
     * 根据skuId删除
     * @param skuId
     * @param request
     * @return
     */
    @ApiOperation(value = "根据skuId删除")
    @ResponseBody
    @RequestMapping(value = "/deleteSku/{skuId}", method = RequestMethod.POST)
    public GoodsResponse deleteSku(@PathVariable String skuId, HttpServletRequest request) {
        LOGGER.info("GoodsController.deleteSku() IN");
        GoodsRequest req = new GoodsRequest();
        req.setUserId(CommonParamUtil.getUserFromSession(request).getUserId());
        req.setSkuIds(skuId);
        GoodsResponse resp = goodsService.deleteSku(req);
        LOGGER.info("GoodsController.deleteSku() OUT");
        return resp;
    }


    /**
     * 设置销售库存页面，提交设置虚拟库存
     * @param request
     * @return
     */
    @ApiOperation(value = "设置虚拟库存")
    @ResponseBody
    @RequestMapping(value = "/invSetting", method = RequestMethod.POST)
    public GoodsResponse invSetting(HttpServletRequest request, @RequestBody GoodsModel goodsModel) {
        LOGGER.info("GoodsController.invSetting() IN");
        GoodsRequest req = new GoodsRequest();
        req.setUserId(CommonParamUtil.getUserFromSession(request).getUserId());
        req.setGoodsModel(goodsModel);
        GoodsResponse resp = goodsService.invSetting(req);
        LOGGER.info("GoodsController.invSetting() OUT");
        return resp;
    }

    /**
     * 设置销售渠道
     * @param request
     * @param spuIds
     * @return
     */
    @ApiOperation(value = "设置销售渠道")
    @ResponseBody
    @RequestMapping(value = "/channelSetting/{spuIds}", method = RequestMethod.POST)
    public GoodsResponse channelSetting(HttpServletRequest request, @PathVariable  String spuIds, @RequestBody String channel) {
        LOGGER.info("GoodsController.channelSetting() IN");
        GoodsRequest req = new GoodsRequest();
        req.setUserId(CommonParamUtil.getUserFromSession(request).getUserId());
        req.setSpuIds(spuIds);
        //String channel = request.getParameter("channel");
        req.setChannel(channel);
        GoodsResponse resp = goodsService.channelSetting(req);
        LOGGER.info("GoodsController.channelSetting() OUT");
        return resp;
    }


    /**
     * @param spuId
     * @return
     */
    @ApiOperation(value = "根据spuId获取虚拟sku列表的库存")
    @ResponseBody
    @RequestMapping(value = "/getVirtualityInvList/{spuId}", method = RequestMethod.GET)
    public GoodsResponse getVirtualityInvList(@PathVariable String spuId, HttpServletRequest request) {
        LOGGER.info("GoodsController.getVirtualityInvList() IN");
        GoodsRequest req = new GoodsRequest();
        req.setSpuId(spuId);
        req.setUserId(CommonParamUtil.getUserFromSession(request).getUserId());
        GoodsResponse resp = goodsService.getVirtualityInv(req);
        LOGGER.info("GoodsController.getVirtualityInvList() OUT");
        return resp;
    }


    /**
     * @param spuId
     * @return
     */
    @ApiOperation(value = "根据spuId获取销售sku列表的库存")
    @ResponseBody
    @RequestMapping(value = "/getSaleInvList/{spuId}", method = RequestMethod.GET)
    public GoodsResponse getSaleInvList(@PathVariable String spuId, HttpServletRequest request) {
        LOGGER.info("GoodsController.getSaleInvList() IN");
        String userId = CommonParamUtil.getUserFromSession(request).getUserId();
        GoodsRequest req = new GoodsRequest();
        req.setSpuId(spuId);
        req.setUserId(userId);
        GoodsResponse resp = goodsService.getSaleInv(req);

        // 拼装仓库名和供应商名
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            Map<String, Object> retMap = resp.getResultMap();
            List<SkuInvModel> skuInvMap = (List<SkuInvModel>) retMap.get("skuInvMap");
            if (CollectionUtils.isNotEmpty(skuInvMap)) {
                List<String> whIdList = new ArrayList<>();
                List<String> supplierIdList = new ArrayList<>();
                for (SkuInvModel model : skuInvMap) {
                    for (WhInvModel invModel : model.getSelfWh()) {
                        whIdList.add(invModel.getWhId());
                    }

                    for (WhInvModel invModel : model.getSupplierWh()) {
                        supplierIdList.add(invModel.getWhId());
                    }
                }

                // 查询供应商名称
                Map<String, String> supplierNameMap = new HashMap<>();
                if (CollectionUtils.isNotEmpty(supplierIdList)) {
                    Map<String,Object> qrySupplierMap = new HashMap<>();
                    qrySupplierMap.put("belongTo", userId);
                    qrySupplierMap.put("supplierIdLst", supplierIdList);
                    UmsSupplierResponse supplierResponse = umsSupplierService.qryBatchSupplierLst(qrySupplierMap);
                    List<SupplierInfo> supplierInfos = supplierResponse.getSupplierInfos();
                    for (SupplierInfo info : supplierInfos) {
                        supplierNameMap.put(info.getUserId(), info.getNickName());
                    }
                }

                // 查询仓库名称
                Map<String, String> whNameMap = new HashMap<>();
                if (CollectionUtils.isNotEmpty(whIdList)) {
                    WmsWarehouseRequest wReq = new WmsWarehouseRequest();
                    wReq.setIdList(whIdList);
                    WmsWarehouseResponse wResp = warehouseService.getWarehouseByIdList(wReq);
                    List<WmsWarehouse> wmsWarehouses = (List<WmsWarehouse>) wResp.getData();
                    for (WmsWarehouse warehouse : wmsWarehouses) {
                        whNameMap.put(warehouse.getId(), warehouse.getName());
                    }
                }

                for (SkuInvModel model : skuInvMap) {
                    for (WhInvModel invModel : model.getSelfWh()) {
                        invModel.setWhName(whNameMap.get(invModel.getWhId()));
                    }

                    for (WhInvModel invModel : model.getSupplierWh()) {
                        invModel.setWhName(supplierNameMap.get(invModel.getWhId()));
                    }
                }
            }

        }

        LOGGER.info("GoodsController.getSaleInvList() OUT");
        return resp;
    }


    /**
     * @param request
     * @return
     */
    @ApiOperation(value = "更新虚拟库存")
    @ResponseBody
    @RequestMapping(value = "/updateVirtualityInv", method = RequestMethod.POST)
    public InventoryResponse updateVirtualityInv(HttpServletRequest request) {
        LOGGER.info("GoodsController.updateVirtualityInv() IN");
        InventoryRequest req = new InventoryRequest();
        req.setSpuId(request.getParameter("spuId"));
        String param = request.getParameter("param");
        req.setVirtualityParams(param);
        req.setUserId(CommonParamUtil.getUserFromSession(request).getUserId());
        InventoryResponse resp = virtualityInvService.updateVirtualityInv(req);
        LOGGER.info("GoodsController.updateVirtualityInv() OUT");
        return resp;
    }
}
