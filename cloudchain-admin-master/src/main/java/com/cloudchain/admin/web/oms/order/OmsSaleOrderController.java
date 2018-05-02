package com.cloudchain.admin.web.oms.order;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.admin.model.oms.OmsOriginOrderModel;
import com.cloudchain.admin.model.oms.SplitOrderModel;
import com.cloudchain.oms.api.logistics.OmsLogisticsMatchRuleService;
import com.cloudchain.oms.api.order.OmsSaleOrderService;
import com.cloudchain.oms.api.order.OmsSaleOriginOrderService;
import com.cloudchain.oms.pojo.bo.logistics.logisticsmatchrule.LogisticsMatchRuleRequest;
import com.cloudchain.oms.pojo.bo.logistics.logisticsmatchrule.LogisticsMatchRuleResponse;
import com.cloudchain.oms.pojo.bo.sale.OmsSaleOrderRequest;
import com.cloudchain.oms.pojo.bo.sale.OmsSaleOrderResponse;
import com.cloudchain.oms.pojo.bo.sale.origin.OmsSaleOrderOriginRequest;
import com.cloudchain.oms.pojo.bo.sale.origin.OmsSaleOrderOriginResponse;
import com.cloudchain.oms.pojo.po.logistics.LogisticsMatchRule;
import com.cloudchain.oms.pojo.vo.order.allot.AllotWarehouseModel;
import com.cloudchain.util.param.CommonParamUtil;
import com.google.gson.Gson;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by zhuhao on 2017/3/21.
 */
@Api(value = "oms-sale-api", description = "订单中心销售订单操作接口")
@Controller
@RequestMapping("/sale")
public class OmsSaleOrderController {

    private static final Logger LOGGER = LoggerFactory.getLogger(OmsSaleOrderController.class);

    @Autowired
    OmsSaleOrderService orderService;

    @Autowired
    OmsSaleOriginOrderService originOrderService;

    @Autowired
    private OmsLogisticsMatchRuleService logisticsMatchRuleService;

    /**
     * 代客下单
     * @param request
     * @param originOrderModel
     * @return
     */
    @ResponseBody
    @ApiOperation(value = "代客下单")
    @RequestMapping(value = "/addOriginOrder", method = RequestMethod.POST)
    public OmsSaleOrderOriginResponse addOriginOrder(HttpServletRequest request, OmsOriginOrderModel originOrderModel){
        LOGGER.info("OmsSaleOrderController.addOriginOrder() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        originOrderModel.getOriginOrder().setUserId(user.getUserId());

        OmsSaleOrderOriginRequest req = new OmsSaleOrderOriginRequest();
        req.setOriginOrder(originOrderModel.getOriginOrder());
        req.setOriginItems(originOrderModel.getOriginItems());
        req.setLogistics(originOrderModel.getLogistics());
        req.setInvoice(originOrderModel.getInvoice());
        req.setOperatorId(user.getOperatorId());
        req.setOperatorName(user.getOperatorName());
        OmsSaleOrderOriginResponse resp = originOrderService.addOriginOrder(req);
        LOGGER.info("OmsSaleOrderController.addOriginOrder() OUT");
        return resp;
    }

    /**
     * 订单详情
     * @return
     */
    @ResponseBody
    @ApiOperation(value = "订单详情")
    @RequestMapping(value = "/getSaleOrderDetail/{orderId}", method = RequestMethod.GET)
    public OmsSaleOrderResponse getOrderDetail(HttpServletRequest request, @PathVariable String orderId){
        LOGGER.info("OmsSaleOrderController.getOrderDetail() IN");
        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        req.setOrderId(orderId);
        OmsSaleOrderResponse resp = orderService.getSaleOrderDetail(req);
        LOGGER.info("OmsSaleOrderController.getOrderDetail() OUT");
        return resp;
    }

    /**
     * 审核通过
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/agree/{action}/{orderId}", method = RequestMethod.POST)
    public OmsSaleOrderResponse agree(HttpServletRequest request, @PathVariable String action, @PathVariable String orderId){
        LOGGER.info("OmsSaleOrderController.agree() IN");
        OmsSaleOrderResponse resp = null;
        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        req.setUserId(user.getUserId());
        req.setOperatorId(user.getOperatorId());
        req.setOperatorName(user.getOperatorName());
        req.setAction(action);
        req.setOrderId(orderId);
        resp = orderService.agree(req);
        LOGGER.info("OmsSaleOrderController.agree() OUT");
        return resp;
    }

    /**
     * 审核不通过
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/refuse/{action}/{orderId}", method = RequestMethod.POST)
    public OmsSaleOrderResponse refuse(HttpServletRequest request, @PathVariable String action, @PathVariable String orderId){
        LOGGER.info("OmsSaleOrderController.refuse() IN");
        OmsSaleOrderResponse resp = null;
        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        req.setUserId(user.getUserId());
        req.setOperatorId(user.getOperatorId());
        req.setOperatorName(user.getOperatorName());
        req.setAction(action);
        req.setOrderId(orderId);
        req.setRemark(request.getParameter("remark"));
        resp = orderService.refuse(req);
        LOGGER.info("OmsSaleOrderController.refuse() OUT");
        return resp;
    }

    @ResponseBody
    @RequestMapping(value = "/reExamine", method = RequestMethod.POST)
    public OmsSaleOrderResponse reExamine(HttpServletRequest request){
        LOGGER.info("OmsSaleOrderController.reExamine() IN");
        String reExamineIds = request.getParameter("reExamineIds");
        List<String> reExamineArr = new ArrayList<String>();
        for (String orderId : reExamineIds.split(",")){
            if (StringUtils.isNotEmpty(orderId)){
                reExamineArr.add(orderId);
            }
        }
        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        req.setOrderIds(reExamineArr);
        OmsSaleOrderResponse resp = orderService.reExamine(req);
        LOGGER.info("OmsSaleOrderController.reExamine() OUT");
        return resp;
    }

    /**
     * 拆单
     * @param request
     * @return
     */
    @ApiOperation(value = "拆单")
    @ResponseBody
    @RequestMapping(value = "/splitOrder", method = RequestMethod.POST)
    public OmsSaleOrderResponse splitOrder(HttpServletRequest request, SplitOrderModel splitOrderModel){
        LOGGER.info("OmsSaleOrderController.splitOrder() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        req.setItems(splitOrderModel.getItems());
        req.setOrderId(splitOrderModel.getOrderId());
        req.setUserId(user.getUserId());
        req.setOperateIp(user.getOperatorId());
        req.setOperatorName(user.getOperatorName());
        OmsSaleOrderResponse resp = orderService.split(req);
        LOGGER.info("OmsSaleOrderController.splitOrder() OUT");
        return resp;
    }

    /**
     * 合单
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/mergeOrder", method = RequestMethod.POST)
    public OmsSaleOrderResponse mergeOrder(HttpServletRequest request){
        LOGGER.info("OmsSaleOrderController.mergeOrder() IN");
        String mergeIds = request.getParameter("mergeIds");
        List<String> mergeArr = new ArrayList<String>();
        for (String mergeId : mergeIds.split(",")){
            if (StringUtils.isNotEmpty(mergeId)){
                mergeArr.add(mergeId);
            }
        }

        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        req.setOrderIds(mergeArr);
        req.setUserId(user.getUserId());
        req.setOperatorId(user.getOperatorId());
        req.setOperatorName(user.getOperatorName());
        OmsSaleOrderResponse resp = orderService.merge(req);
        LOGGER.info("OmsSaleOrderController.mergeOrder() OUT");
        return resp;
    }

    /**
     * 配仓
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/allot", method = RequestMethod.POST)
    public OmsSaleOrderResponse allot(HttpServletRequest request){
        LOGGER.info("OmsSaleOrderController.allot() IN");
        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        Gson gson = new Gson();
        AllotWarehouseModel allotWarehouseModel = gson.fromJson(request.getParameter("param"), AllotWarehouseModel.class);
        req.setOrderId(allotWarehouseModel.getOrderId());
        req.setAllotWarehouseModel(allotWarehouseModel);
        OmsSaleOrderResponse resp = orderService.allot(req);
        LOGGER.info("OmsSaleOrderController.allot() OUT");
        return resp;
    }

    /**
     * 可发货区域仓库列表
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getAllotWarehouses", method = RequestMethod.GET)
    public OmsSaleOrderResponse getAllotWarehouses(HttpServletRequest request){
        LOGGER.info("OmsSaleOrderController.getAllotWarehouses() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        String provinceId = request.getParameter("provinceId");
        String cityId = request.getParameter("cityId");
        String districtId = request.getParameter("districtId");
        String orderId = request.getParameter("orderId");
        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        req.setProvinceId(provinceId);
        req.setCitiId(cityId);
        req.setDistrictId(districtId);
        req.setOrderId(orderId);
        req.setUserId(user.getUserId());
        req.setOperatorName(user.getNickName());
        OmsSaleOrderResponse resp = orderService.getAllotWarehouses(req);
        LOGGER.info("OmsSaleOrderController.getAllotWarehouses() OUT");
        return resp;
    }

    /**
     * 已分配的商品明细
     * @param orderId
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getAllotedDetail/{orderId}", method = RequestMethod.GET)
    public OmsSaleOrderResponse getAllotedDetail(@PathVariable String orderId){
        LOGGER.info("OmsSaleOrderController.getAllotedDetail() IN");
        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        req.setOrderId(orderId);
        OmsSaleOrderResponse resp = orderService.getAllotedDetail(req);
        LOGGER.info("OmsSaleOrderController.getAllotedDetail() OUT");
        return resp;
    }

    /**
     * 商品供应商列表
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getSuppliers", method = RequestMethod.GET)
    public OmsSaleOrderResponse getSuppliers(HttpServletRequest request){
        LOGGER.info("OmsSaleOrderController.getSuppliers() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        String warehouseId = request.getParameter("warehouseId");
        String skuId = request.getParameter("skuId");
        String itemId = request.getParameter("itemId");

        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        req.setWarehouseId(warehouseId);
        req.setSkuId(skuId);
        req.setItemId(itemId);
        req.setUserId(user.getUserId());
        req.setNickName(user.getNickName());
        OmsSaleOrderResponse resp = orderService.getShipSuppliers(req);
        LOGGER.info("OmsSaleOrderController.getSuppliers() OUT");
        return resp;
    }

    /**
     * 查询揽件/代销供应商供应商列表
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getSupplierInv", method = RequestMethod.GET)
    public OmsSaleOrderResponse getSupplierInv(HttpServletRequest request){
        LOGGER.info("OmsSaleOrderController.getSupplierInv() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        String supplierId = request.getParameter("supplierId");
        String skuId = request.getParameter("skuId");
        String itemId = request.getParameter("itemId");

        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        req.setSupplierId(supplierId);
        req.setSkuId(skuId);
        req.setUserId(user.getUserId());
        req.setItemId(itemId);
        OmsSaleOrderResponse resp = orderService.getSupplierInv(req);
        LOGGER.info("OmsSaleOrderController.getSupplierInv() OUT");
        return resp;
    }

    /**
     * 配仓占用预分配
     * @param orderId
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/allotConfirm/{orderId}", method = RequestMethod.POST)
    public OmsSaleOrderResponse allotConfirm(HttpServletRequest request, @PathVariable String orderId){
        LOGGER.info("OmsSaleOrderController.allotConfirm() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        req.setOrderId(orderId);
        req.setUserId(user.getUserId());
        OmsSaleOrderResponse resp = orderService.allotConfirm(req);
        LOGGER.info("OmsSaleOrderController.allotConfirm() OUT");
        return resp;
    }

    /**
     * 配仓取消预分配
     * @param orderId
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/givebackInventory/{orderId}", method = RequestMethod.POST)
    public OmsSaleOrderResponse givebackInventory(HttpServletRequest request, @PathVariable String orderId){
        LOGGER.info("OmsSaleOrderController.givebackInventory() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        req.setOrderId(orderId);
        req.setUserId(user.getUserId());
        OmsSaleOrderResponse resp = orderService.givebackInventory(req);
        LOGGER.info("OmsSaleOrderController.givebackInventory() OUT");
        return resp;
    }

    /**
     * 根据区域查询最优快递
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getLogisticsCompIdByArea", method = RequestMethod.POST)
    public OmsSaleOrderResponse getLogisticsCompIdByArea(HttpServletRequest request,String shipArea){
        LOGGER.info("OmsSaleOrderController.getLogisticsCompIdByArea() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        OmsSaleOrderRequest req = new OmsSaleOrderRequest();
        req.setRemark(shipArea);
        req.setUserId(user.getUserId());
        OmsSaleOrderResponse response = orderService.getLogisticsCompIdByArea(req);
        LOGGER.info("OmsSaleOrderController.getLogisticsCompIdByArea() OUT");
        return response;
    }

}
