package com.cloudchain.admin.web.wms.outboundimport;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.admin.web.common.ImpExpController;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.service.IBaseExport;
import com.cloudchain.util.POIUtils;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.outbound.WmsOutboundService;
import com.cloudchain.wms.pojo.bo.outbound.WmsOutboundRequest;
import com.cloudchain.wms.pojo.bo.outbound.WmsOutboundResponse;
import com.cloudchain.wms.pojo.po.WmsOutbound;
import com.cloudchain.wms.pojo.po.WmsOutboundItem;
import io.swagger.annotations.Api;
import org.apache.poi.ss.usermodel.Row;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 */
@Api(value = "wms-outbound-sale-import-api", description = "出库单导入接口-销售出库单")
@Controller
@RequestMapping("/wmsOutboundSaleImport")
public class WmsOutboundSaleImportController extends ImpExpController<WmsOutboundRequest, WmsOutboundResponse> {
	private static final Logger logger = LoggerFactory.getLogger(WmsOutboundSaleImportController.class);

	@Autowired
	private WmsOutboundService outboundService;

	@Override
	protected Map<String, Object> buildParam(HttpServletRequest request) {
		Map<String, Object> params = new HashMap<String, Object>();
		CommUserModel model = CommonParamUtil.getUserFromSession(request);
		params.put("userId", model.getUserId());
		return params;
	}

	@Override
	protected IBaseExport getExporter() {
		return null;
	}

	@Override
	protected String[] getExportHeader() {
		return new String[0];
	}

	@Override
	protected String[] getProperties() {
		return new String[0];
	}

	@Override
	protected String[] getImpHead() {
		return new String[]{"货主编号", "单据类型", "加急/不加急", "出货仓库编号", "联系人", "联系电话", "联系地址", "描述",
				"供应商", "商品编号", "数量", "良品/不良品", };
	}

	@Override
	protected boolean check(Row row, Map<String, Object> context) {
		if (StringUtils.isEmpty(POIUtils.getCellValue(row.getCell(0)))){
			context.put("errorCode", ResultCode.PARAM_REQUIRE);
			return false;
		}
		return true;
	}

	@Override
	protected Object build(Row row, Map<String, Object> context, List list) {
		String orderNo = POIUtils.getCellValue(row.getCell(0));
		WmsOutbound order = (WmsOutbound)context.get(orderNo);
		List<WmsOutboundItem> itemList;

//		WmsOutboundItem item = new WmsOutboundItem();
//		item.setSkuId(POIUtils.getCellValue(row.getCell(6)));
//		item.setSkuName(POIUtils.getCellValue(row.getCell(7)));
//		item.setbName(POIUtils.getCellValue(row.getCell(8)));
//		item.setcName(POIUtils.getCellValue(row.getCell(9)));
//		item.setSpec(POIUtils.getCellValue(row.getCell(10)));
//		item.setCount(POIUtils.getCellIntValue(row.getCell(12)));
//		item.setRemark(POIUtils.getCellValue(row.getCell(13)));
//
//		if (null != order){
//			itemList = order.getIt
//			itemList.add(item);
//			return order;
//		}
//
//		itemList = new ArrayList<WmsOutboundItem>();
//		itemList.add(item);
//
//		order = new WmsOutbound();
//		order.setLineNum(row.getRowNum());
//		order.setSupplierId(POIUtils.getCellValue(row.getCell(1)));
//		order.setSupplierName(POIUtils.getCellValue(row.getCell(2)));
//		order.setGoodsDeliveryWay(POIUtils.getCellIntValue(row.getCell(14)));
//		order.setSettlementWay(POIUtils.getCellIntValue(row.getCell(15)));
//		order.setPrepayProportion(POIUtils.getCellIntValue(row.getCell(16)));
//		order.setBalanceSettlementDays(POIUtils.getCellIntValue(row.getCell(17)));
//		order.setRemark(POIUtils.getCellValue(row.getCell(18)));
//		order.setItems(itemList);
//		context.put(orderNo, order);

		WmsOutboundRequest req = new WmsOutboundRequest();
		//req.setReceiverId(model.getReceiverId());
		//获取用户
//		CommUserModel commUserModel = CommonParamUtil.getUserFromSession(request);
//		req.setUserId(commUserModel.getUserId());
//		req.setUserName(commUserModel.getNickName());
//		req.setUserTel(commUserModel.getUserTel());
//		req.setOperatorId(commUserModel.getOperatorId());
//		req.setOperatorName(commUserModel.getOperatorName());
//		req.setOperatorTel(commUserModel.getOperatorTel());
		//获取其他值
		//req.setQuantity(POIUtils.getCellValue(row.getCell(1)));
		req.setId(POIUtils.getCellValue(row.getCell(1)));
		req.setCode(POIUtils.getCellValue(row.getCell(1)));
		req.setItemId(POIUtils.getCellValue(row.getCell(1)));
		req.setDescription(POIUtils.getCellValue(row.getCell(1)));
		req.setProductCode(POIUtils.getCellValue(row.getCell(1)));
		//req.setMark_1(POIUtils.getCellValue(row.getCell(1)));
		req.setBillType(POIUtils.getCellValue(row.getCell(1)));
		req.setInvStatus(POIUtils.getCellValue(row.getCell(1)));
		req.setStatus(POIUtils.getCellValue(row.getCell(1)));
		req.setWarehouseId(POIUtils.getCellValue(row.getCell(1)));
		req.setOperation(POIUtils.getCellValue(row.getCell(1)));
		req.setOwnerId(POIUtils.getCellValue(row.getCell(1)));
		req.setOwnerName(POIUtils.getCellValue(row.getCell(1)));
		req.setSupplierId(POIUtils.getCellValue(row.getCell(1)));
		req.setLength(POIUtils.getCellValue(row.getCell(1)));

		//收货人信息
		req.setReceiverName(POIUtils.getCellValue(row.getCell(1)));
		req.setReceiverContactor(POIUtils.getCellValue(row.getCell(1)));
		req.setReceiverMobile(POIUtils.getCellValue(row.getCell(1)));
		req.setReceiverProvince(POIUtils.getCellValue(row.getCell(1)));
		req.setReceiverCity(POIUtils.getCellValue(row.getCell(1)));
		req.setReceiverDistrict(POIUtils.getCellValue(row.getCell(1)));
		req.setReceiverAddress(POIUtils.getCellValue(row.getCell(1)));
		req.setRelatedBillNo1(POIUtils.getCellValue(row.getCell(1)));
		req.setRelatedBillNo2(POIUtils.getCellValue(row.getCell(1)));
		req.setRelatedBillNo3(POIUtils.getCellValue(row.getCell(1)));

		WmsOutboundResponse resp = outboundService.addOutbound(req);

		list.add(order);
		return order;
	}

	@Override
	protected WmsOutboundResponse doImport(WmsOutboundRequest req) {
		//return purchaseOrderService.importData(req);
		return null;
	}
}
