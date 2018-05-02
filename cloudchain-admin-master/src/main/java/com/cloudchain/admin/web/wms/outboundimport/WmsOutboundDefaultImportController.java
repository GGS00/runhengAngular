package com.cloudchain.admin.web.wms.outboundimport;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.exception.BusinessLayerException;
import com.cloudchain.admin.model.base.BatchProcessResult;
import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.ums.api.UserService;
import com.cloudchain.util.POIUtils;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.warehouse.WmsWarehouseService;
import com.cloudchain.wms.pojo.bo.outbound.WmsOutboundRequest;
import com.cloudchain.wms.pojo.bo.outbound.WmsOutboundResponse;
import com.cloudchain.wms.pojo.bo.warehouse.WmsWarehouseRequest;
import com.cloudchain.wms.pojo.po.WmsOutbound;
import com.cloudchain.wms.pojo.po.WmsOutboundItem;
import com.cloudchain.wms.pojo.po.WmsWarehouse;
import io.swagger.annotations.Api;
import org.apache.commons.collections.CollectionUtils;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;

/**
 * 默认出库单
 */
@Api(value = "wms-outbound-default-import-api", description = "出库单导入接口-默认出库单")
@Controller
@RequestMapping("/wmsOutboundDefaultImport")
public class WmsOutboundDefaultImportController {
	private static final Logger logger = LoggerFactory.getLogger(WmsOutboundDefaultImportController.class);

	@Autowired
	private UserService userService;
	@Autowired
	private WmsWarehouseService wmsWarehouseService;

	public static final String BILL_TYPE = "10007001";

	@RequestMapping(value = "/importData", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
	public String importData(HttpServletRequest request, HttpServletResponse response, HttpSession session,
							 @RequestParam("excelFile") MultipartFile multipartFile, WmsOutboundRequest req) {

		logger.info("WmsOutboundDefaultImportController.importData() IN");

		String realPath = request.getSession().getServletContext().getRealPath("/");
		String oriFileName = multipartFile.getOriginalFilename();
		if (StringUtils.isEmpty(oriFileName)) {
			throw new BusinessLayerException("请选择Excel文件!");
		}
		String fileName = realPath + File.separator + "templetFile" + File.separator + new Date().getTime() + oriFileName;

		// 判断文件后缀
		if (!fileName.endsWith(".xls") && !fileName.endsWith(".xlsx")) {
			throw new BusinessLayerException("文件必须是Excel格式!");
		}

		File file = new File(fileName);
		FileInputStream fis = null;
		Workbook workBook = null;

		// 批量导入运单参数对象
		CommUserModel userModel = CommonParamUtil.getUserFromSession(request);
		req.setUserId(userModel.getUserId());

		List list = null;
		List<Map<String, Object>> msgList = new ArrayList<Map<String, Object>>();
		try {
			// 先将文件上传到项目中
			multipartFile.transferTo(file);

			// 再将excel文件解析为对象
			fis = new FileInputStream(file);

			workBook = WorkbookFactory.create(fis);

			if (fileName.endsWith(".xls")) {
				list = resolveDataXls(workBook, req.getUserId());
			} else if (fileName.endsWith(".xlsx")) {
				list = resolveDataXlsx(workBook, req.getUserId());
			}

			if (CollectionUtils.isEmpty(list)){
				return AjaxAdditionalResponseInfo.createSPRespInfo("无订单信息！");
			}

			req.setList(list);
			WmsOutboundResponse resp = doImport(req);

			if (ResultCode.SYSTEM_EXCEPTION.equals(resp.getStatus())){
				return AjaxAdditionalResponseInfo.createSPRespInfo("系统异常！");
			}

			// 导入结果
			msgList = resp.getMsgList();

			if(msgList.size() > 0) {
				//将错误消息写入excel并导出
				POIUtils.errMsg2TmpTable(workBook, oriFileName, msgList, request, response);
			}
		} catch (IOException e) {
			e.printStackTrace();
		} catch (InvalidFormatException e) {
			e.printStackTrace();
		} finally {
			// 删除Excel文件
			if (file.exists()) {
				file.delete();
			}
			if (null != fis) {
				try {
					fis.close();
				} catch (IOException e) {
					throw new BusinessLayerException("文件输入流不能正常关闭!");
				}
			}
		}

		int totalCount = req.getList().size();
		logger.info("WmsOutboundDefaultImportController.importData() OUT");
		return CommonControllerAspect.batchProcessResult(new BatchProcessResult(totalCount, 0));
	}

	/**
	 * 解析xls格式文件
	 * @param workbook
	 * @return
	 */
	protected List resolveDataXls(Workbook workbook, String userId) {
		HSSFSheet sheet = (HSSFSheet) workbook.getSheetAt(0);
		if (sheet == null) {
			throw new BusinessLayerException("该Excel是空的！");
		}

		// 验证表头格式
		HSSFRow headRow = sheet.getRow(0);
		if (!POIUtils.checkHeadValue(POIUtils.getHeadCellsValue(headRow), getImpHead())){
			throw new BusinessLayerException("导入失败，请检查表头数据格式是否匹配！");
		}

		// 验证表头格式
		HSSFRow headRow1 = sheet.getRow(1);
		if (!POIUtils.checkHeadValue(POIUtils.getHeadCellsValue(headRow1), getImpHead1())){
			throw new BusinessLayerException("导入失败，请检查表头数据格式是否匹配！");
		}

		return loopRow(sheet, userId);
	}

	/**
	 * 解析xlsx格式文件
	 * @param workbook
	 * @return
	 */
	protected List resolveDataXlsx(Workbook workbook, String userId){
		XSSFSheet sheet = (XSSFSheet) workbook.getSheetAt(0);
		if (sheet == null) {
			throw new BusinessLayerException("该Exce是空的！");
		}

		// 验证表头格式
		XSSFRow headRow = sheet.getRow(0);
		if (!POIUtils.checkHeadValue(POIUtils.getHeadCellsValue(headRow), getImpHead())){
			throw new BusinessLayerException("导入失败，请检查表头数据格式是否匹配！");
		}

		// 验证表头格式
		XSSFRow headRow1 = sheet.getRow(1);
		if (!POIUtils.checkHeadValue(POIUtils.getHeadCellsValue(headRow1), getImpHead1())){
			throw new BusinessLayerException("导入失败，请检查表头数据格式是否匹配！");
		}

		return loopRow(sheet, userId);
	}

	/**
	 * 第一行
	 * @return
	 */
	protected String[] getImpHead() {
		return new String[]{"货主编号", "单据类型", "加急/不加急", "出货仓库编号", "收货信息", "", "","","", "描述", "货品出库明细", "", "", "", };
	}

	/**
	 * 第二行
	 * @return
	 */
	protected String[] getImpHead1() {
		return new String[]{"", "", "", "", "联系人", "联系电话", "省", "市", "区", "详细地址", "", "供应商", "商品编号", "数量", "良品/不良品", };
	}

	/**
	 * 封装请求消息体
	 * @param sheet
	 * @return
	 */
	protected List loopRow(Sheet sheet, String userId){
		logger.info("WmsOutboundDefaultImportController.build() IN");
		List list = new ArrayList();
		Map<String, Object> context = new HashMap<String, Object>();

		WmsOutbound outbound = null;
		for (int line = 2; line < sheet.getLastRowNum(); line++){
			Row row =  sheet.getRow(line);
			if (null == row){
				continue;
			}

			if (!check(row, context, outbound, userId)){
				logger.error("error format params for import.");
				continue;
			}

			build(row, context, list);
		}

		logger.info("WmsOutboundDefaultImportController.build() OUT");
		return list;
	}

	protected boolean check(Row row, Map<String, Object> context, WmsOutbound outbound, String userId) {
		if (StringUtils.isEmpty(POIUtils.getCellValue(row.getCell(0)))){
			context.put("errorCode", ResultCode.PARAM_REQUIRE);
			return false;
		}

		String huoZhuNo 		= POIUtils.getCellValue(row.getCell(0));
		String billType 		= POIUtils.getCellValue(row.getCell(1));
		String isUrgent 		= POIUtils.getCellValue(row.getCell(2));
		String outWarehouseNo 	= POIUtils.getCellValue(row.getCell(3));
		String contactName 		= POIUtils.getCellValue(row.getCell(4));
		String contactPhone 	= POIUtils.getCellValue(row.getCell(5));
		String province 		= POIUtils.getCellValue(row.getCell(6));
		String city 			= POIUtils.getCellValue(row.getCell(7));
		String area 			= POIUtils.getCellValue(row.getCell(8));
		String address	 		= POIUtils.getCellValue(row.getCell(9));
		String remark 			= POIUtils.getCellValue(row.getCell(10));
		String supplier 		= POIUtils.getCellValue(row.getCell(11));
		String goodNo 			= POIUtils.getCellValue(row.getCell(12));
		Integer goodNum 		= POIUtils.getCellIntValue(row.getCell(13));
		String isGoodProduct 	= POIUtils.getCellValue(row.getCell(14));

		if(outbound == null){
			// 说明是第一条数据，所以必须设置所有数据
			if (StringUtils.isEmpty(huoZhuNo)){
				context.put("errorCode", ResultCode.PARAM_REQUIRE);
				return false;
			}
			if (StringUtils.isEmpty(billType)){
				context.put("errorCode", ResultCode.PARAM_REQUIRE);
				return false;
			}
			if (StringUtils.isEmpty(isUrgent)){
				context.put("errorCode", ResultCode.PARAM_REQUIRE);
				return false;
			}

			// 验证数据是否正确
			if(!userService.isExistByHuoZhuNo(userId, huoZhuNo)){
				// 说明货主编号有误
			}

			if(!billType.startsWith(BILL_TYPE)){
				// 单据类型有误
			}

			if(!isUrgent.startsWith("0") && !isUrgent.startsWith("1")){
				// 是否加急有误
			}

			// 验证出库仓库编号是否正确
			WmsWarehouseRequest wmsWarehouseRequest = new WmsWarehouseRequest();
			wmsWarehouseRequest.setUserId(userId);
			wmsWarehouseRequest.setCode(outWarehouseNo);
			WmsWarehouse wmsWarehouse = wmsWarehouseService.getWarehouseByParam(wmsWarehouseRequest);
			if(wmsWarehouse == null){
				// 说明仓库信息有误
			}
		}



		return true;
	}

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
		/*CommonParamUtil.setWmsReq(request,req,model);
		//req.setReceiverId(model.getReceiverId());
		//获取用户
		CommUserModel commUserModel = CommonParamUtil.getUserFromSession(request);
		req.setUserId(commUserModel.getUserId());
		req.setUserName(commUserModel.getNickName());
		req.setUserTel(commUserModel.getUserTel());
		req.setOperatorId(commUserModel.getOperatorId());
		req.setOperatorName(commUserModel.getOperatorName());
		req.setOperatorTel(commUserModel.getOperatorTel());*/
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

		//WmsOutboundResponse resp = outboundService.addOutbound(req);

		list.add(order);
		return order;
	}

	/**
	 * 具体导入操作
	 * @param req
	 * @return
	 */
	protected WmsOutboundResponse doImport(WmsOutboundRequest req) {
		//return purchaseOrderService.importData(req);
		return null;
	}
}
