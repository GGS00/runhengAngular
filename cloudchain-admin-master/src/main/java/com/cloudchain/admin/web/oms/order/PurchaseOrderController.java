package com.cloudchain.admin.web.oms.order;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.admin.web.common.ImpExpController;
import com.cloudchain.oms.api.order.OmsPurchaseOrderService;
import com.cloudchain.oms.pojo.bo.purchase.OmsPurchaseOrderRequest;
import com.cloudchain.oms.pojo.bo.purchase.OmsPurchaseOrderResponse;
import com.cloudchain.oms.pojo.po.purchase.OmsPurchaseOrder;
import com.cloudchain.oms.pojo.po.purchase.OmsPurchaseOrderItem;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.service.IBaseExport;
import com.cloudchain.util.POIUtils;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.util.param.OmsParamUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.poi.ss.usermodel.Row;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * Created by zhuhao on 2017/4/20.
 */
@Api(value = "purchase-order-api", description = "订单中心采购订单操作接口")
@Controller
@RequestMapping("/purchase")
public class PurchaseOrderController extends ImpExpController<OmsPurchaseOrderRequest, OmsPurchaseOrderResponse>{

    private static final Logger LOGGER = LoggerFactory.getLogger(PurchaseOrderController.class);

    @Autowired
    OmsPurchaseOrderService purchaseOrderService;

    @Value("${omsPurchaseOrder.headers}")
    private String OMS_PURCHASEORDER_HEADERS;

    @Value("${omsPurchaseOrder.propertys}")
    private String OMS_PURCHASEORDER_PROPERTIES;

    /**
     * 新增采购单
     * @param omsPurchaseOrder
     * @param itemData
     * @param arrivalDate
     * @param request
     * @return
     */
    @ApiOperation(value = "增加采购单")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public OmsPurchaseOrderResponse addOrder(OmsPurchaseOrder omsPurchaseOrder, String itemData,
                                             @DateTimeFormat(pattern = "yyyy-MM-dd") Date arrivalDate, HttpServletRequest request) {
        LOGGER.info("add purchaseOrde in");

        OmsPurchaseOrderRequest purchaseOrderRequest = OmsParamUtil.convertToOmsPurchaseOrderRequest(omsPurchaseOrder, itemData, arrivalDate, request);

        OmsPurchaseOrderResponse resp = purchaseOrderService.addPurchaseOrder(purchaseOrderRequest);

        LOGGER.info("add purchaseOrde out");

        return resp;
    }

    /**
     * 更新采购订单
     * @param omsPurchaseOrder
     * @param request
     * @return
     */
    @ApiOperation(value = "更新采购单")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public OmsPurchaseOrderResponse updateOrder(OmsPurchaseOrder omsPurchaseOrder, String itemData,
                                                @DateTimeFormat(pattern = "yyyy-MM-dd") Date arrivalDate, HttpServletRequest request) {
        LOGGER.info("add purchaseOrder in");

        OmsPurchaseOrderRequest purchaseOrderRequest = OmsParamUtil.convertToUpdateOmsPurchaseOrderRequest(omsPurchaseOrder, itemData, arrivalDate, request);

        OmsPurchaseOrderResponse resp = purchaseOrderService.updatePurchaseOrder(purchaseOrderRequest);

        LOGGER.info("add purchaseOrder out");

        return resp;
    }

    /**
     * 删除采购订单
     * @param purchaseIds
     * @param request
     * @return
     */
    @ApiOperation(value = "删除采购订单")
    @RequestMapping(value = "/delete/{purchaseIds}", method = RequestMethod.POST)
    @ResponseBody
    public OmsPurchaseOrderResponse deleteOrder(@PathVariable String purchaseIds, HttpServletRequest request) {
        LOGGER.info("add deleteOrder in");

        OmsPurchaseOrderRequest purchaseOrderRequest = new OmsPurchaseOrderRequest();

        String[] purchaseId = purchaseIds.split(",");

        List<String> purchaseIdList = new ArrayList<>();

        for (int i = 0; i < purchaseId.length; i++) {
            purchaseIdList.add(purchaseId[i]);
        }

        purchaseOrderRequest.setPurchaseIdList(purchaseIdList);

        OmsPurchaseOrderResponse resp = purchaseOrderService.batchDeletePurchaseOrder(purchaseOrderRequest);

        LOGGER.info("add deleteOrder out");

        return resp;
    }

    /**
     * 批量审核采购单
     * @param purchaseIds
     * @param request
     * @return
     */
    @ApiOperation(value = "批量审核采购单")
    @RequestMapping(value = "/audit/{purchaseIds}", method = RequestMethod.POST)
    @ResponseBody
    public OmsPurchaseOrderResponse auditPurchase(@PathVariable String purchaseIds, HttpServletRequest request)
    {
        LOGGER.info("auditPurchase in");

        OmsPurchaseOrderRequest purchaseOrderRequest = new OmsPurchaseOrderRequest();

        String[] purchaseId = purchaseIds.split(",");

        List<String> purchaseIdList = new ArrayList<>();

        for (int i = 0; i < purchaseId.length; i++) {
            purchaseIdList.add(purchaseId[i]);
        }

        purchaseOrderRequest.setPurchaseIdList(purchaseIdList);

        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);
        purchaseOrderRequest.setOperatorId(userModel.getOperatorId());
        purchaseOrderRequest.setOperatorName(userModel.getOperatorName());

        OmsPurchaseOrderResponse resp = purchaseOrderService.batchAuditPurchase(purchaseOrderRequest);

        LOGGER.info("auditPurchase out");

        return resp;
    }

    /**
     * 查看可添加的到货单
     * @param arrivalId
     * @param request
     * @return
     */
    @ApiOperation(value = "查看可添加的到货单")
    @RequestMapping(value = "/itemToArrival/{arrivalId}", method = RequestMethod.GET)
    @ResponseBody
    public String getItemToArrivalList(@PathVariable String arrivalId, HttpServletRequest request)
    {
        LOGGER.info("getItemToArrivalList in");

        String retString = purchaseOrderService.getItemToArrivalList(arrivalId);

        LOGGER.info("getItemToArrivalList out");

        return retString;
    }

    /**
     * 查看到货单明细
     * @param arrivalId
     * @param request
     * @return
     */
    @ApiOperation(value = "查看到货单明细")
    @RequestMapping(value = "/item/{arrivalId}", method = RequestMethod.GET)
    @ResponseBody
    public String getArrivalItemList(@PathVariable String arrivalId, HttpServletRequest request)
    {
        LOGGER.info("getArrivalItemList in");

        String retString = purchaseOrderService.getArrivalItemList(arrivalId);

        LOGGER.info("getArrivalItemList out");

        return retString;
    }

    /**
     * 到货
     * @param dataList
     * @param request
     * @return
     */
    @ApiOperation(value = "到货")
    @RequestMapping(value = "/arrival", method = RequestMethod.POST)
    @ResponseBody
    public OmsPurchaseOrderResponse arrival(String dataList, HttpServletRequest request)
    {
        LOGGER.info("arrival in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

        OmsPurchaseOrderRequest purchaseOrderRequest = OmsParamUtil.convertToAttivalRequest(dataList);

        purchaseOrderRequest.setOperatorName(userModel.getOperatorName());
        purchaseOrderRequest.setUserId(userModel.getUserId());
        purchaseOrderRequest.setUserName(userModel.getUserName());
        purchaseOrderRequest.setOperatorId(userModel.getOperatorId());

        OmsPurchaseOrderResponse resp = purchaseOrderService.arrival(purchaseOrderRequest);

        LOGGER.info("arrival out");
        return resp;
    }

    @Override
    protected Map<String, Object> buildParam(HttpServletRequest request) {
        Map<String, Object> params = new HashMap<String, Object>();
        CommUserModel model = CommonParamUtil.getUserFromSession(request);
        params.put("userId", model.getUserId());
        params.put("state", request.getParameter("state"));
        return params;
    }

    @Override
    protected IBaseExport getExporter() {
        return purchaseOrderService;
    }

    @Override
    protected String[] getExportHeader() {
        return StringUtils.tokenizeToStringArray(OMS_PURCHASEORDER_HEADERS, ",");
    }

    @Override
    protected String[] getProperties() {
        return StringUtils.tokenizeToStringArray(OMS_PURCHASEORDER_PROPERTIES, ",");
    }

    /**
     * 文件头
     * @return
     */
    @Override
    protected String[] getImpHead() {
        return new String[]{"采购单编号","供应商编号","供应商名称", "收货仓库编码", "仓库名称",	 "到货时间","商品编码", "商品名称", "商品分类", "品牌", "商品属性", "采购单价", "采购数量", "商品备注", "交割方式", "结款方式", "预付比例", "余款结算", "订单备注"};
    }

    @Override
    protected boolean check(Row row, Map<String, Object> context) {
        if (StringUtils.isEmpty(POIUtils.getCellValue(row.getCell(0)))){
            LOGGER.error("purchase orderId can not be null.");
            context.put("errorCode", ResultCode.PARAM_REQUIRE);
            return false;
        }
        return true;
    }

    @Override
    protected Object build(Row row, Map<String, Object> context, List list) {
        LOGGER.info("PurchaseOrderController.build() IN");
        String orderNo = POIUtils.getCellValue(row.getCell(0));
        OmsPurchaseOrder order = (OmsPurchaseOrder)context.get(orderNo);
        List<OmsPurchaseOrderItem> itemList;

        OmsPurchaseOrderItem item = new OmsPurchaseOrderItem();
        item.setSkuId(POIUtils.getCellValue(row.getCell(6)));
        item.setSkuName(POIUtils.getCellValue(row.getCell(7)));
        item.setbName(POIUtils.getCellValue(row.getCell(8)));
        item.setcName(POIUtils.getCellValue(row.getCell(9)));
        item.setSpec(POIUtils.getCellValue(row.getCell(10)));
        item.setPrice(POIUtils.getCellIntValue(row.getCell(11)));
        item.setCount(POIUtils.getCellIntValue(row.getCell(12)));
        item.setRemark(POIUtils.getCellValue(row.getCell(13)));

        if (null != order){
            itemList = order.getItems();
            itemList.add(item);
            return order;
        }


        itemList = new ArrayList<OmsPurchaseOrderItem>();
        itemList.add(item);

        order = new OmsPurchaseOrder();
        order.setLineNum(row.getRowNum());
        order.setSupplierId(POIUtils.getCellValue(row.getCell(1)));
        order.setSupplierName(POIUtils.getCellValue(row.getCell(2)));
        order.setWarehouseId(POIUtils.getCellValue(row.getCell(3)));
        order.setGoodsDeliveryWay(POIUtils.getCellIntValue(row.getCell(14)));
        order.setSettlementWay(POIUtils.getCellIntValue(row.getCell(15)));
        order.setPrepayProportion(POIUtils.getCellIntValue(row.getCell(16)));
        order.setBalanceSettlementDays(POIUtils.getCellIntValue(row.getCell(17)));
        order.setRemark(POIUtils.getCellValue(row.getCell(18)));
        order.setItems(itemList);
        context.put(orderNo, order);

        list.add(order);
        LOGGER.info("PurchaseOrderController.build() OUT");
        return order;
    }

    protected OmsPurchaseOrderResponse doImport(OmsPurchaseOrderRequest req) {
        return purchaseOrderService.importData(req);
    }
}
