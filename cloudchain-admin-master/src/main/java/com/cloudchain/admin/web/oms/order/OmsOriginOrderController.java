package com.cloudchain.admin.web.oms.order;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.admin.web.common.ImpExpController;
import com.cloudchain.oms.api.order.OmsSaleOriginOrderService;
import com.cloudchain.oms.pojo.bo.sale.origin.OmsSaleOrderOriginRequest;
import com.cloudchain.oms.pojo.bo.sale.origin.OmsSaleOrderOriginResponse;
import com.cloudchain.oms.pojo.po.sale.origin.OmsSaleOrderItemOrigin;
import com.cloudchain.oms.pojo.vo.order.origin.OriginOrderDetailModel;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.service.IBaseExport;
import com.cloudchain.util.POIUtils;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.Api;
import org.apache.poi.ss.usermodel.Row;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 2017/5/25.
 */
@Api(value = "oms-originorder-api", description = "订单中心原始订单操作接口")
@Controller
@RequestMapping("/originOrder")
public class OmsOriginOrderController extends ImpExpController<OmsSaleOrderOriginRequest, OmsSaleOrderOriginResponse>{
    private static final Logger LOGGER = LoggerFactory.getLogger(OmsOriginOrderController.class);

    @Autowired
    OmsSaleOriginOrderService originOrderService;

    @Value("${omsOriginOrder.headers}")
    private String OMS_ORIGINORDER_HEADERS;

    @Value("${omsOriginOrder.propertys}")
    private String OMS_ORIGINORDER_PROPERTIES;

    /**
     * 原始订单详情
     * @param orderId
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getOriginOrderDetail/{orderId}", method = RequestMethod.GET)
    public OmsSaleOrderOriginResponse getOriginOrderDetail(@PathVariable String orderId){
        LOGGER.info("OmsOriginOrderController.getOriginOrderDetail() IN");
        OmsSaleOrderOriginRequest req = new OmsSaleOrderOriginRequest();
        req.setOrderId(orderId);
        OmsSaleOrderOriginResponse resp = originOrderService.getOriginOrderDetail(req);
        LOGGER.info("OmsOriginOrderController.getOriginOrderDetail() OUT");
        return resp;
    }

    /**
     * 导出的查询条件
     * @param request
     * @return
     */
    @Override
    protected Map<String, Object> buildParam(HttpServletRequest request) {
        Map<String, Object> params = new HashMap<String, Object>();
        CommUserModel model = CommonParamUtil.getUserFromSession(request);
        params.put("userId", model.getUserId());
        return params;
    }

    @Override
    protected IBaseExport getExporter() {
        return originOrderService;
    }

    /**
     *
     * @return
     */
    @Override
    protected String[] getExportHeader() {
        return StringUtils.tokenizeToStringArray(OMS_ORIGINORDER_HEADERS, ",");
    }

    /**
     *
     * @return
     */
    @Override
    protected String[] getProperties() {
        return StringUtils.tokenizeToStringArray(OMS_ORIGINORDER_PROPERTIES, ",");
    }

    @Override
    protected String[] getImpHead() {
        return new String[]{"订单号", "订单来源", "会员编号", "会员名称	", "商品编码", "商品名称", "商品价格", "购买数量", "总价", "优惠金额", "收件人", "收件人电话", "收件人省份", "收件人城市", "收件人地区", "收件人详细地址", "配送方式", "运费", "买家备注", "卖家备注"};
    }

    /**
     * 封装原始订单
     * @param row
     * @param context
     * @param list
     * @return
     */
    protected Object build(Row row, Map<String, Object> context, List list) {
        LOGGER.info("OmsSaleOrderController.build() IN");
        List<OmsSaleOrderItemOrigin> items = null;

        // 来源订单号
        String fromOrderId = POIUtils.getCellValue(row.getCell(0));
        LOGGER.debug("fromOrderId = {}.", fromOrderId);

        OmsSaleOrderItemOrigin item = new OmsSaleOrderItemOrigin();
        item.setSkuId(POIUtils.getCellValue(row.getCell(4)));
        item.setSkuName(POIUtils.getCellValue(row.getCell(5)));
        item.setPrice(POIUtils.getCellIntValue(row.getCell(6)));
        item.setCount(POIUtils.getCellIntValue(row.getCell(7)));
        item.setSubTotal(POIUtils.getCellLongValue(row.getCell(8)));
        item.setDiscountMoney(POIUtils.getCellIntValue(row.getCell(9)));
        item.setReceiveCount(0);
        item.setSendCount(0);

        // 合并订单号相同的订单明细
        OriginOrderDetailModel orderModel = (OriginOrderDetailModel)context.get(fromOrderId);
        if (null != orderModel){
            // 订单号相同的加到同一个订单的明细列表里
            items = orderModel.getOriginItems();
            items.add(item);
            return orderModel;
        }

        list.add(orderModel);
        orderModel = new OriginOrderDetailModel();
        orderModel.setLineNum(row.getRowNum());
        orderModel.setFromOrderId(fromOrderId);
        orderModel.setExpectedQuantity(POIUtils.getCellIntValue(row.getCell(7)));
        orderModel.setCustomerId(POIUtils.getCellValue(row.getCell(2)));
        orderModel.setCustomerName(POIUtils.getCellValue(row.getCell(3)));
        orderModel.setDeliverState(0);
        orderModel.setPayState(0);
        orderModel.setRemark(POIUtils.getCellValue(row.getCell(19)));
        orderModel.setOrderFrom(POIUtils.getCellValue(row.getCell(1)));
        orderModel.setGoodsType(1);
        orderModel.setOrderType(1);
        items = new ArrayList<OmsSaleOrderItemOrigin>();
        items.add(item);
        orderModel.setOriginItems(items);
        context.put(fromOrderId, orderModel);
        return orderModel;
    }

    /**
     * 导入数据校验
     * @param row
     * @return
     */
    protected boolean check(Row row, Map<String, Object> context){
        if (StringUtils.isEmpty(POIUtils.getCellValue(row.getCell(0)))){
            LOGGER.error("from orderId can not be null.");
            context.put("errorCode", ResultCode.PARAM_REQUIRE);
            return false;
        }
        return true;
    }

    protected OmsSaleOrderOriginResponse doImport(OmsSaleOrderOriginRequest req) {
        return originOrderService.importData((req));
    }
}
