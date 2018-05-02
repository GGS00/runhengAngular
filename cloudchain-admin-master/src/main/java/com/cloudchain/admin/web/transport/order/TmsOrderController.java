package com.cloudchain.admin.web.transport.order;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.exception.BusinessLayerException;
import com.cloudchain.admin.model.base.BatchProcessResult;
import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.admin.model.tms.SegmentPlatModel;
import com.cloudchain.admin.model.tms.TmsOrderGoodsModel;
import com.cloudchain.admin.model.tms.TmsOrderModel;
import com.cloudchain.gms.api.GoodsService;
import com.cloudchain.gms.pojo.bo.GoodsRequest;
import com.cloudchain.gms.pojo.bo.GoodsResponse;
import com.cloudchain.gms.pojo.vo.GoodsModel;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.exception.BaseRuntimeException;
import com.cloudchain.platform.pojo.bo.Response;
import com.cloudchain.platform.util.JacksonUtils;
import com.cloudchain.platform.util.MapUtils;
import com.cloudchain.tms.api.TmsImportService;
import com.cloudchain.tms.api.TmsOrderService;
import com.cloudchain.tms.pojo.bo.importTms.OrderImportRequest;
import com.cloudchain.tms.pojo.bo.importTms.OrderImportResponse;
import com.cloudchain.tms.pojo.bo.importTms.TmsOrderObject;
import com.cloudchain.tms.pojo.bo.order.TmsOrderRequest;
import com.cloudchain.tms.pojo.bo.order.TmsOrderResponse;
import com.cloudchain.tms.pojo.po.TmsOrder;
import com.cloudchain.tms.pojo.vo.OrderGoodsModel;
import com.cloudchain.util.DownloadUtil;
import com.cloudchain.util.POIUtils;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.util.poi.ExcelUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.collections.CollectionUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;

/**
 * Created by LiuKai on 2017/2/24.
 */
@Api(value = "tms-order-api", description = "运单接口")
@Controller
@RequestMapping("/transport/order")
public class TmsOrderController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(TmsOrderController.class);

    @Autowired
    private TmsOrderService tmsOrderService;

    @Autowired
    private TmsImportService tmsImportService;

    @Autowired
    private GoodsService goodsService;

    @Value("${tmsOrder.headers}")
    private String TMSORDER_HEADERS;

    @Value("${tmsOrder.propertys}")
    private String TMSORDER_PROPERTYS;

    /** 表头数据格式 */
    private String[] excelHead = {"货主", "服务产品","订单号", "面单号", "代收货款", "供应商", "发货方", "出发地联系人",
            "出发地电话", "出发地地址", "收货方", "目的地联系人", "目的地电话", "目的地地址", "箱数", "重量", "描述", "货物名称", "总金额"};

    //拆分联系电话的正则表达式
    private String regexpTel = "[^0-9]";
    //拆分联系人的正则表达式
    private String regexpContactor = "[、，/；,;|\\\\]";

    private static final String msgKey = "\"additionalMsg\": ";

    /**
     * 增加运单
     * @param request HttpServletRequest
     * @param model TmsOrder
     * @return json
     */
    @ApiOperation(value = "新增运单")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public String save(HttpServletRequest request, TmsOrderModel model) {
        logger.info("[TmsOrderController.save] IN");
        long begin = System.currentTimeMillis();


        String retString = null;
        TmsOrderRequest req = new TmsOrderRequest();
        model.getTmsOrder().setDataFrom("MANUAL");
        req.setTmsOrder(model.getTmsOrder());
        req.setTmsOrderFee(model.getTmsOrderFee());
        req.setTmsOrderGoods(model.getOrderGoodsList());
        req.setFromCid(model.getFromCid());
        req.setToCid(model.getToCid());
        CommonParamUtil.setTmsOperator(request, req);

        TmsOrderResponse resp = tmsOrderService.add(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TmsOrderController.save] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     * 修改运单
     * @param request HttpServletRequest
     * @param model TmsOrderModel
     * @return 修改结果
     */
    @ApiOperation(value = "修改运单")
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public String edit(HttpServletRequest request, TmsOrderModel model) {
        logger.info("[TmsOrderController.edit] IN");
        String retString = null;
        TmsOrderRequest req = new TmsOrderRequest();
        req.setTmsOrder(model.getTmsOrder());
        req.setTmsOrderFee(model.getTmsOrderFee());
        req.setTmsOrderGoods(model.getOrderGoodsList());
        req.setFromCid(model.getFromCid());
        req.setToCid(model.getToCid());

        CommonParamUtil.setTmsOperator(request, req);

        TmsOrderResponse resp = tmsOrderService.update(req);
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TmsOrderController.edit] OUT");
        return retString;
    }

    /**
     * 运单详情
     * @param id 运单ID
     * @return 运单详情
     */
    @ApiOperation(value = "运单详情")
    @RequestMapping(value = "/detail/{id}", method = RequestMethod.GET)
    @ResponseBody
    public String scanTmsOrder(@PathVariable String id){
        TmsOrderRequest req = new TmsOrderRequest();
        req.setId(id);
        TmsOrderResponse resp = tmsOrderService.load(req);
        String retString = JacksonUtils.object2json(resp.getResultMap());
        return retString;
    }

    /**
     * 按量拆分运单
     * @param id 运单ID
     * @param request HttpServletRequest
     * @param model TmsOrderGoodsModel
     * @return 结果
     */
    @ApiOperation(value = "运单按量拆分")
    @RequestMapping(value = "/splitbyamount/{id}", method = RequestMethod.POST)
    @ResponseBody
    public String splitByCount(@PathVariable String id, HttpServletRequest request, TmsOrderGoodsModel model){
        // 解析拆分的货物
        Map<String, Object> param = new HashMap<>();
        List<OrderGoodsModel> list = model.getOrderGoodsList();
        if (!CollectionUtils.isEmpty(list)){
            for (OrderGoodsModel m : list) {
                param.put(m.getGoodsIndex(), m.getOrderGoodsList());
            }
        }
        TmsOrderRequest req = new TmsOrderRequest();
        req.setId(id);
        req.setParam(param);
        // 操作人
        CommonParamUtil.setTmsOperator(request, req);

        TmsOrderResponse resp = tmsOrderService.splitByCount(req);
        String retString = null;
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        return retString;
    }

    /**
     * 按段拆分运单
     * @param id 运单ID
     * @param request  HttpServletRequest
     * @param model SegmentPlatModel
     * @return 拆分结果
     */
    @ApiOperation(value = "运单按段拆分")
    @RequestMapping(value = "/splitbysite/{id}", method = RequestMethod.POST)
    @ResponseBody
    public String splitBySegment(@PathVariable String id, HttpServletRequest request, SegmentPlatModel model){

        TmsOrderRequest req = new TmsOrderRequest();
        req.setId(id);
        req.setSegmentPlatList(model.getSegmentPlatList());
        req.setFromPlatId(model.getFromPlatId());
        req.setToPlatId(model.getToPlatId());

        // 操作人
        CommonParamUtil.setTmsOperator(request, req);

        TmsOrderResponse resp = tmsOrderService.splitBySegment(req);
        String retString = null;
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        return retString;
    }

    /**
     * 批量生效运单
     * @param request HttpServletRequest
     * @param codes 订单号
     * @return 结果
     */
    @ApiOperation(value = "运单生效")
    @RequestMapping(value = "/active/{codes}", method = RequestMethod.POST)
    @ResponseBody
    public String activeBatch(HttpServletRequest request, @PathVariable String codes) {
        return updateStatus(request, codes, "ACTIVE");
    }

    /**
     * 运单批量失效
     * @param request HttpServletRequest
     * @param codes 订单号
     * @return 结果
     */
    @ApiOperation(value = "运单失效")
    @RequestMapping(value = "/invalid/{codes}", method = RequestMethod.POST)
    @ResponseBody
    public String openBatch(HttpServletRequest request, @PathVariable String codes) {
        return updateStatus(request, codes, "OPEN");
    }


    @ApiOperation(value = "新增商品")
    @RequestMapping(value = "/addGoods", method = RequestMethod.POST)
    @ResponseBody
    public Response addGoods4Tms(HttpServletRequest request, GoodsModel goodsModel){

        GoodsRequest req = new GoodsRequest();
        req.setGoodsModel(goodsModel);
        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);
        req.setUserId(userModel.getUserId());
        req.setOperatorId(userModel.getOperatorId());
        req.setOperatorName(userModel.getOperatorName());
        req.setCreator(userModel.getNickName());
        GoodsResponse resp = goodsService.save4Tms(req);
        return resp;
    }


    /**
     * 更新打印状态
     * @param request HttpServletRequest
     * @param ids 运单ID
     * @return 结果
     */
    @ApiOperation(value = "运单打印")
    @RequestMapping(value = "/updatePrintStatus", method = RequestMethod.POST)
    @ResponseBody
    public String updatePrintStatus(HttpServletRequest request, String ids) {
        TmsOrderRequest req = new TmsOrderRequest();
        req.setIds(ids);
        TmsOrder tmsOrder = new TmsOrder();
        tmsOrder.setIsPrint(1);
        req.setTmsOrder(tmsOrder);
        CommonParamUtil.setTmsOperator(request, req);

        String retString = null;
        TmsOrderResponse resp = tmsOrderService.updatePrintStatus(req);
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        return retString;
    }

    private String updateStatus(HttpServletRequest request, String codes, String status){
        String[] idArray = codes.split(",");
        int totalCount = idArray.length;
        int failCount = 0;
        String eMsg = "";// 异常消息

        TmsOrderRequest req = new TmsOrderRequest();
        req.setCodes(codes);
        TmsOrder tmsOrder = new TmsOrder();
        tmsOrder.setStatus(status);
        req.setTmsOrder(tmsOrder);
        //User user = SecurityContextHolder.getCurrentUser();
        CommonParamUtil.setTmsOperator(request, req);
        TmsOrderResponse resp = tmsOrderService.changeStatusBatch(req);
        if (!ResultCode.SUCCESS.equals(resp.getStatus())) {
            failCount = totalCount;
        }
        else {
            failCount = Integer.valueOf(resp.getRetString());
        }
        eMsg = resp.getMsg();
        return CommonControllerAspect.batchProcessResult(new BatchProcessResult(totalCount, failCount, eMsg));
    }

    /**
     * 下载模板
     * @param request HttpServletRequest
     * @param response HttpServletResponse
     */
    @ApiOperation(value = "运单导入模板")
    @RequestMapping(value = "/downloadTemplate", method = RequestMethod.POST)
    @ResponseBody
    public void downloadTemplate(HttpServletRequest request, HttpServletResponse response) {
        DownloadUtil.downloadTemplate(request, response, "运单导入模板");
    }

    /**
     * 导出运单
     * @param request HttpServletRequest
     * @param response HttpServletResponse
     */
    @ApiOperation(value = "运单导出")
    @RequestMapping(value = "/exportXls", method = RequestMethod.GET)
    public void exportXls(HttpServletRequest request, HttpServletResponse response) {
        try {
            Map<String, Object> maps = MapUtils.requestObjMap(request);
            String[] tmsOrder_headers = org.springframework.util.StringUtils.tokenizeToStringArray(TMSORDER_HEADERS,
                    ",");
            String[] tmsOrder_propertys = org.springframework.util.StringUtils.tokenizeToStringArray(TMSORDER_PROPERTYS,
                    ",");

            ExcelUtil.export2Excel(tmsOrderService, request, response, maps, tmsOrder_headers, tmsOrder_propertys,
                    "运单信息");
        }
        catch (Exception e) {
            throw new BaseRuntimeException("运单信息 导出异常");
        }
    }


    /**
     * 导入运单
     * @param request HttpServletRequest
     * @param response HttpServletResponse
     * @param session HttpSession
     * @param multipartFile 要导入的文件
     * @return String
     */
    @ApiOperation(value = "运单导入")
    @RequestMapping(value = "/import", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String importTmsOrder(HttpServletRequest request, HttpServletResponse response, HttpSession session,
                                 @RequestParam("excelFile") MultipartFile multipartFile) {
        List<Map<String, Object>> msgList = new ArrayList<Map<String, Object>>();//临时表数据
        /** 先判断文件名后缀是否为‘.xls’或‘.xlsx’ */
        // 获得项目路径
        String realPath = request.getSession().getServletContext().getRealPath("/");
        String oriFileName = multipartFile.getOriginalFilename();
        if (StringUtils.isEmpty(oriFileName)) {
            throw new BusinessLayerException("请选择Excel文件!");
        }
        String fileName =
                realPath + File.separator + "templetFile" + File.separator + new Date().getTime()
                        + oriFileName;

        // 判断文件后缀
        if (!fileName.endsWith(".xls") && !fileName.endsWith(".xlsx"))
            throw new BusinessLayerException("运单必须是Excel格式!");

        File file = new File(fileName);
        FileInputStream fis = null;
        Workbook workBook = null;

        // 批量导入运单参数对象
        OrderImportRequest importParam = null;
        OrderImportResponse resp = new OrderImportResponse();
        try {
            // 先将文件上传到项目中
            multipartFile.transferTo(file);

            // 再将excel文件解析为对象
            fis = new FileInputStream(file);

            workBook = WorkbookFactory.create(fis);


            if (fileName.endsWith(".xls")) {
                importParam = createBatchImportXls(workBook, resp);
            } else if (fileName.endsWith(".xlsx")) {
                importParam = createBatchImportXlsx(workBook, resp);
            }

            if (ResultCode.SUCCESS.equals(resp.getStatus())){

                CommonParamUtil.setTmsOperator(request, importParam);
                // 调用存储过程导入运单
                resp = tmsImportService.importTmsOrder(importParam);
            }

            if (ResultCode.SYSTEM_EXCEPTION.equals(resp.getStatus())){
                return AjaxAdditionalResponseInfo.createSPRespInfo("系统异常！");
            }

            //从临时表中查询错误消息
            msgList = resp.getMsgList();

            if(msgList.size() > 0) {
                //将错误消息写入excel并导出
                POIUtils.errMsg2TmpTable(workBook, oriFileName, msgList, request, response);
            }else{
                //
            }
        } catch (Exception e) {
            throw new BusinessLayerException(com.cloudchain.util.string.StringUtils.getExceptionMsg(e));
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

        if (!ResultCode.SUCCESS.equals(resp.getStatus())){
            return AjaxAdditionalResponseInfo.createSPRespInfo("导入失败！");
        }

        if(msgList.size() > 0)
            return null;

        //导入成功，返回提示信息
        List<TmsOrderObject> inboundList = importParam.getTmsOrderList();
        int totalCount = inboundList.size();
        return CommonControllerAspect.batchProcessResult(new BatchProcessResult(totalCount, 0));
    }


    /**
     * @Title: createBatchImportXls
     * @Description: 创建批量导入运单参数对象(后缀名为.xls)
     * @return: TmsOrderBatchImportParam
     * @author: yunlei.hua
     * @throws IOException
     * @date: 2014年11月20日 下午6:07:22
     */
    private OrderImportRequest createBatchImportXls(Workbook workBook, OrderImportResponse resp) throws IOException {
        // 创建TmsOrderBatchImportParam对象
        OrderImportRequest importParam = new OrderImportRequest();
        // 对象TmsOrderObject集合
        List<TmsOrderObject> tmsOrderList = new ArrayList<TmsOrderObject>();

        // 获得第一个工作表sheet
        HSSFSheet sheet = (HSSFSheet) workBook.getSheetAt(0);
        if (sheet == null) throw new BusinessLayerException("该Excel是空的！");

        // 验证表头格式
        HSSFRow headRow = sheet.getRow(0);
        if (!POIUtils.checkHeadValue(POIUtils.getHeadCellsValue(headRow), excelHead))
            throw new BusinessLayerException("导入失败，请检查表头数据格式是否匹配！");

        //excpMsg = "";//清空异常消息
        String num = "";
        String errMsg = "";
        // 循环获得每一行row
        r: for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
            HSSFRow row = sheet.getRow(rowNum);
            if (row == null) continue;
            if (tmsOrderList.size() > 0) {// 运单集合中存在运单
                boolean flag = false;// 标记运单集合中是否包含该运单

                // 判断编码是否为空
                HSSFCell cellC = row.getCell(2);
                String codeVal = POIUtils.getCellValue(cellC);
                if (StringUtils.isEmpty(codeVal)) {
                    //excpMsg += "第["+(row.getRowNum()+1)+"]行面单号是空的；";
                    continue;
                }

                // 遍历运单集合
                for (TmsOrderObject orderObject : tmsOrderList) {
                    if (codeVal.equals(orderObject.getCode())) {// 运单集合中存在该运单
                        //校验面单号相同时，其它基础信息是否相同
                        if(!getOrderInfoInObject(orderObject).equals(getOrderInfoInHSSFRow(row))) {

                            String lineNo = orderObject.getExtendProp1();//行号

                            num = String.valueOf((row.getRowNum()+1));
                            errMsg = "该行与第["+lineNo+"]行面单号["+codeVal+"]相同，但基础信息不同；";
                            //tmsOrderMapper.insertExceptionMsg(num, errMsg);
                            dealImportErr(resp, num, errMsg);
                            continue r;
                        }

                        flag = true;

                        tmsOrderList.add(orderObject);
                        break;
                    } else {// 运单集合中不存在该运单
                        flag = false;
                    }
                }

                if (!flag) {// 不存在该运单，则新建
                    TmsOrderObject orderObject = createTmsOrderObjectXls(row);
                    if (baseCheck(orderObject, resp)){
                        tmsOrderList.add(orderObject);
                    }
                }
            } else {// 运单集合中没有运单
                TmsOrderObject orderObject = createTmsOrderObjectXls(row);
                if (baseCheck(orderObject, resp)){
                    tmsOrderList.add(orderObject);
                }
            }
        }

        if(tmsOrderList.size() < 1)
            throw new BusinessLayerException("导入的运单数据是空的！");

        importParam.setTmsOrderList(tmsOrderList);
        return importParam;
    }

    /**
     * @Title: getOrderInfoInHSSFRow
     * @Description:
     * @return: String
     * @author: yunlei.hua
     * @date: 2015年1月13日 下午5:53:57
     */
    private String getOrderInfoInHSSFRow(HSSFRow row) {
        // 货主
        HSSFCell cellA = row.getCell(0);
        // 单据类型(服务产品)
        HSSFCell cellB = row.getCell(1);
        //项目
        HSSFCell cellC = row.getCell(2);
        // 订单号
        HSSFCell cellE = row.getCell(3);
        // 代收货款
        HSSFCell cellF = row.getCell(5);
        String unPayAmount = POIUtils.getCellValue(cellF);
        unPayAmount = StringUtils.isEmpty(unPayAmount) ? "0.0" : Double.valueOf(unPayAmount).toString();
        // 供应商
        HSSFCell cellG = row.getCell(6);
        // 发货方
        HSSFCell cellH = row.getCell(7);
        // 发货方联系人
        HSSFCell cellJ = row.getCell(8);
        // 发货方电话
//        HSSFCell cellI = row.getCell(8);
        // 发货方地址
        HSSFCell cellK = row.getCell(10);
        // 收货方
        HSSFCell cellL = row.getCell(11);
        // 收货方联系人
        HSSFCell cellN = row.getCell(12);
        // 收货方电话
//        HSSFCell cellM = row.getCell(12);
        // 收货方地址
        HSSFCell cellO = row.getCell(14);

        return POIUtils.getCellValue(cellA)+POIUtils.getCellValue(cellB)+POIUtils.getCellValue(cellC)+POIUtils.getCellValue(cellE)+unPayAmount
                +POIUtils.getCellValue(cellG)+POIUtils.getCellValue(cellH)+POIUtils.getCellValue(cellJ)
                +POIUtils.getCellValue(cellK)+POIUtils.getCellValue(cellL)+POIUtils.getCellValue(cellN)+POIUtils.getCellValue(cellO);
    }

    /**
     * @Title: createTmsOrderObjectXls
     * @Description: 创建运单对象(.xls)
     * @return: TmsOrderObject
     * @author: yunlei.hua
     * @date: 2014年11月21日 上午10:35:26
     */
    private TmsOrderObject createTmsOrderObjectXls(HSSFRow row) {
        TmsOrderObject tmsOrderObject = new TmsOrderObject();
        // 货主
        HSSFCell cellA = row.getCell(0);
        tmsOrderObject.setOwnerName(POIUtils.getCellValue(cellA));
        // 单据类型(服务产品)
        HSSFCell cellB = row.getCell(1);
        tmsOrderObject.setBillTypeName(POIUtils.getCellValue(cellB));

        // 订单号
        HSSFCell cellD = row.getCell(2);
        tmsOrderObject.setCode(POIUtils.getCellValue(cellD));
        // 运单号
        HSSFCell cellE = row.getCell(3);
        tmsOrderObject.setWayBillCode(POIUtils.getCellValue(cellE));
        // 运单箱数
        tmsOrderObject.setBoxQuantity(new Long(0));
        // 代收货款
        HSSFCell cellF = row.getCell(4);
        String unPayAmount = POIUtils.getCellValue(cellF);
        tmsOrderObject.setUnReceivePayAmount(StringUtils.isEmpty(unPayAmount) ? 0.0 : Double.valueOf(unPayAmount));
        // 供应商
        HSSFCell cellG = row.getCell(5);
        tmsOrderObject.setSupplierName(POIUtils.getCellValue(cellG));
        // 发货方
        HSSFCell cellH = row.getCell(6);
        tmsOrderObject.setFromReceiverName(POIUtils.getCellValue(cellH));

        // 发货方联系人
        HSSFCell cellI = row.getCell(7);
        List<String> contactorList1 = POIUtils.getCellValueByRegex(cellI, regexpContactor);
        if (contactorList1.size() > 0)
            tmsOrderObject.setFromReceiverContactor(contactorList1.get(0));
        // 发货方第二联系人
        if (contactorList1.size() > 1)
            tmsOrderObject.setFromReceiverContactor2(contactorList1.get(1));

        // 发货方电话
        HSSFCell cellJ = row.getCell(8);
        List<String> telList1 = POIUtils.getCellValueByRegex(cellJ, regexpTel);
        if (telList1.size() > 0)
            tmsOrderObject.setFromReceiverTel(telList1.get(0));
        // 发货方第二电话
        if (telList1.size() > 1)
            tmsOrderObject.setFromReceiverTel2(telList1.get(1));

        // 发货方地址
        HSSFCell cellK = row.getCell(9);
        tmsOrderObject.setFromReceiverAddress(POIUtils.getCellValue(cellK));
        // 收货方
        HSSFCell cellL = row.getCell(10);
        tmsOrderObject.setToReceiverName(POIUtils.getCellValue(cellL));

        // 收货方联系人
        HSSFCell cellM = row.getCell(11);
        List<String> contactorList2 = POIUtils.getCellValueByRegex(cellM, regexpContactor);
        if (contactorList2.size() > 0)
            tmsOrderObject.setToReceiverContactor(contactorList2.get(0));
        // 收货方第二联系人
        if (contactorList2.size() > 1)
            tmsOrderObject.setToReceiverContactor2(contactorList2.get(1));

        // 收货方电话
        HSSFCell cellN = row.getCell(12);
        List<String> telList2 = POIUtils.getCellValueByRegex(cellN, regexpTel);
        if (telList2.size() > 0)
            tmsOrderObject.setToReceiverTel(telList2.get(0));
        // 收货方第二电话
        if (telList2.size() > 1)
            tmsOrderObject.setToReceiverTel2(telList2.get(1));

        // 收货方地址
        HSSFCell cellO = row.getCell(13);
        tmsOrderObject.setToReceiverAddress(POIUtils.getCellValue(cellO));

        // 运单箱数
        HSSFCell cellP = row.getCell(14);
        tmsOrderObject.setBoxQuantity(Long.valueOf(POIUtils.getCellValue(cellP)));

        // 重量
        HSSFCell cellQ = row.getCell(15);
        tmsOrderObject.setWeight(new BigDecimal(POIUtils.getCellValue(cellQ)));

        //描述
        HSSFCell cellR = row.getCell(16);
        tmsOrderObject.setDescription(POIUtils.getCellValue(cellR));

        //
        HSSFCell cellS = row.getCell(17);
        tmsOrderObject.setGoodsName(POIUtils.getCellValue(cellS));

        // 金额
        HSSFCell cellT = row.getCell(18);
        tmsOrderObject.setWeight(new BigDecimal(POIUtils.getCellValue(cellT)));

        tmsOrderObject.setExtendProp1(row.getRowNum() + 1 + "");

        return tmsOrderObject;
    }


    /**
     * @Title: createBatchImportXlsx
     * @Description: 创建批量导入运单参数对象(后缀名为.xlsx)
     * @return: TmsOrderBatchImportParam
     * @author: yunlei.hua
     * @throws IOException
     * @date: 2014年11月20日 下午6:08:36
     */
    private OrderImportRequest createBatchImportXlsx(Workbook workBook, OrderImportResponse resp) throws IOException {
        // 创建TmsOrderBatchImportParam对象
        OrderImportRequest importParam = new OrderImportRequest();
        // 对象TmsOrderObject集合
        List<TmsOrderObject> tmsOrderList = new ArrayList<TmsOrderObject>();

        // 获得第一个工作表sheet
        XSSFSheet sheet = (XSSFSheet) workBook.getSheetAt(0);
        if (sheet == null) throw new BusinessLayerException("该Excel是空的！");

        // 验证表头格式
        XSSFRow headRow = sheet.getRow(0);
        if (!POIUtils.checkHeadValue(POIUtils.getHeadCellsValue(headRow), excelHead))
            throw new BusinessLayerException("导入失败，请检查数据格式是否匹配！");

        //excpMsg = "";//清空异常消息
        String num = "";
        String errMsg = "";
        // 循环获得每一行row
        r: for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
            XSSFRow row = sheet.getRow(rowNum);
            if (row == null) continue;
            if (tmsOrderList.size() > 0) {// 运单集合中存在运单
                boolean flag = false;// 标记运单集合中是否包含该运单

                // 判断面单号是否为空
                XSSFCell cellD = row.getCell(3);
                String codeVal = POIUtils.getCellValue(cellD);
                if (StringUtils.isEmpty(codeVal)) {
                    //excpMsg += "第["+(row.getRowNum()+1)+"]行面单号是空的；";
                    continue;
                }

                // 遍历运单集合
                for (TmsOrderObject orderObject : tmsOrderList) {
                    if (codeVal.equals(orderObject.getCode())) {// 运单集合中存在该运单
                        //校验面单号相同时，其它基础信息是否相同
                        if(!getOrderInfoInObject(orderObject).equals(getOrderInfoInXSSFRow(row))) {
                            String lineNo = orderObject.getExtendProp1();//行号

                            num = String.valueOf((row.getRowNum()+1));
                            errMsg = "该行与第["+lineNo+"]行订单号["+codeVal+"]相同，但基础信息不同；";
                            //tmsOrderMapper.insertExceptionMsg(num, errMsg);
                            dealImportErr(resp, num, errMsg);
                            continue r;
                        }

                        flag = true;

                        tmsOrderList.add(orderObject);
                        break;
                    } else {// 运单集合中不存在该运单
                        flag = false;
                    }
                }

                if (!flag) {// 不存在该运单，则新建
                    TmsOrderObject orderObject = createTmsOrderObjectXlsx(row);
                    if (baseCheck(orderObject, resp)){
                        tmsOrderList.add(orderObject);
                    }
                }
            } else {// 运单集合中没有运单
                TmsOrderObject orderObject = createTmsOrderObjectXlsx(row);
                if (baseCheck(orderObject, resp)){
                    tmsOrderList.add(orderObject);
                }
            }
        }

        if(tmsOrderList.size() < 1)
            throw new BusinessLayerException("导入的运单数据是空的！");

        importParam.setTmsOrderList(tmsOrderList);
        return importParam;
    }



    /**
     * @Title: getOrderInfoInXSSFRow
     * @Description: 获取excel中一行的基础信息比较
     * @return: String
     * @author: yunlei.hua
     * @date: 2015年1月13日 下午5:17:29
     */
    private String getOrderInfoInXSSFRow(XSSFRow row) {
        // 货主
        XSSFCell cellA = row.getCell(0);
        // 单据类型(服务产品)
        XSSFCell cellB = row.getCell(1);

        // 订单号
        XSSFCell cellE = row.getCell(2);
        // 代收货款
        XSSFCell cellF = row.getCell(4);
        String unPayAmount = POIUtils.getCellValue(cellF);
        unPayAmount = StringUtils.isEmpty(unPayAmount) ? "0.0" : Double.valueOf(unPayAmount).toString();
        // 供应商
        XSSFCell cellG = row.getCell(5);
        // 发货方
        XSSFCell cellH = row.getCell(6);
        // 发货方联系人
        XSSFCell cellJ = row.getCell(7);
        // 发货方电话
//        XSSFCell cellI = row.getCell(8);
        // 发货方地址
        XSSFCell cellK = row.getCell(9);
        // 收货方
        XSSFCell cellL = row.getCell(10);
        // 收货方联系人
        XSSFCell cellN = row.getCell(11);
        // 收货方电话
//        XSSFCell cellM = row.getCell(12);
        // 收货方地址
        XSSFCell cellO = row.getCell(13);

        return POIUtils.getCellValue(cellA)+POIUtils.getCellValue(cellB)+POIUtils.getCellValue(cellE)+unPayAmount
                +POIUtils.getCellValue(cellG)+POIUtils.getCellValue(cellH)+POIUtils.getCellValue(cellJ)
                +POIUtils.getCellValue(cellK)+POIUtils.getCellValue(cellL)+POIUtils.getCellValue(cellN)+POIUtils.getCellValue(cellO);
    }

    /**
     * @Title: getOrderInfoInObject
     * @Description: 获取一行运单的基础信息比较
     * @return: String
     * @author: yunlei.hua
     * @date: 2015年1月13日 下午5:16:39
     */
    private String getOrderInfoInObject(TmsOrderObject orderObject) {
        return orderObject.getOwnerName()+orderObject.getBillTypeName()+orderObject.getProjectName()+orderObject.getCode()+orderObject.getUnReceivePayAmount()
                +orderObject.getSupplierName()+orderObject.getFromReceiverName()+orderObject.getFromReceiverContactor()
                +orderObject.getFromReceiverAddress()+orderObject.getToReceiverName()+orderObject.getToReceiverContactor()
                +orderObject.getToReceiverAddress();
    }

    /**
     * @Title: createTmsOrderObjectXlsx
     * @Description: 创建运单对象(.xlsx)
     * @return: TmsOrderObject
     * @author: yunlei.hua
     * @date: 2014年11月21日 下午12:12:39
     */
    private TmsOrderObject createTmsOrderObjectXlsx(XSSFRow row) {
        TmsOrderObject tmsOrderObject = new TmsOrderObject();
        // 货主
        XSSFCell cellA = row.getCell(0);
        tmsOrderObject.setOwnerName(POIUtils.getCellValue(cellA));
        // 单据类型(服务产品)
        XSSFCell cellB = row.getCell(1);
        tmsOrderObject.setBillTypeName(POIUtils.getCellValue(cellB));

        // 订单号
        XSSFCell cellD = row.getCell(2);
        tmsOrderObject.setCode(POIUtils.getCellValue(cellD));
        // 运单号
        XSSFCell cellE = row.getCell(3);
        tmsOrderObject.setWayBillCode(POIUtils.getCellValue(cellE));
        // 运单箱数
        tmsOrderObject.setBoxQuantity(new Long(0));
        // 代收货款
        XSSFCell cellF = row.getCell(4);
        String unPayAmount = POIUtils.getCellValue(cellF);
        tmsOrderObject.setUnReceivePayAmount(StringUtils.isEmpty(unPayAmount) ? 0.0 : Double.valueOf(unPayAmount));
        // 供应商
        XSSFCell cellG = row.getCell(5);
        tmsOrderObject.setSupplierName(POIUtils.getCellValue(cellG));
        // 发货方
        XSSFCell cellH = row.getCell(6);
        tmsOrderObject.setFromReceiverName(POIUtils.getCellValue(cellH));
        // 发货方联系人
        XSSFCell cellI = row.getCell(7);
        List<String> contactorList1 = POIUtils.getCellValueByRegex(cellI, regexpContactor);
        if (contactorList1.size() > 0)
            tmsOrderObject.setFromReceiverContactor(contactorList1.get(0));
        // 发货方第二联系人
        if (contactorList1.size() > 1)
            tmsOrderObject.setFromReceiverContactor2(contactorList1.get(1));

        // 发货方电话
        XSSFCell cellJ = row.getCell(8);
        List<String> telList1 = POIUtils.getCellValueByRegex(cellJ, regexpTel);
        if (telList1.size() > 0)
            tmsOrderObject.setFromReceiverTel(telList1.get(0));
        // 发货方第二电话
        if (telList1.size() > 1)
            tmsOrderObject.setFromReceiverTel2(telList1.get(1));

        // 发货方地址
        XSSFCell cellK = row.getCell(9);
        tmsOrderObject.setFromReceiverAddress(POIUtils.getCellValue(cellK));
        // 收货方
        XSSFCell cellL = row.getCell(10);
        tmsOrderObject.setToReceiverName(POIUtils.getCellValue(cellL));
        // 收货方联系人
        XSSFCell cellM = row.getCell(11);
        List<String> contactorList2 = POIUtils.getCellValueByRegex(cellM, regexpContactor);
        if (contactorList2.size() > 0)
            tmsOrderObject.setToReceiverContactor(contactorList2.get(0));
        // 收货方第二联系人
        if (contactorList2.size() > 1)
            tmsOrderObject.setToReceiverContactor2(contactorList2.get(1));

        // 收货方电话
        XSSFCell cellN = row.getCell(12);
        List<String> telList2 = POIUtils.getCellValueByRegex(cellN, regexpTel);
        if (telList2.size() > 0)
            tmsOrderObject.setToReceiverTel(telList2.get(0));
        // 收货方第二电话
        if (telList2.size() > 1)
            tmsOrderObject.setToReceiverTel2(telList2.get(1));

        // 收货方地址
        XSSFCell cellO = row.getCell(13);
        tmsOrderObject.setToReceiverAddress(POIUtils.getCellValue(cellO));

        // 箱数
        XSSFCell cellP = row.getCell(14);
        tmsOrderObject.setBoxQuantity(Long.valueOf(POIUtils.getCellValue(cellP)));

        // 重量
        XSSFCell cellQ = row.getCell(15);
        tmsOrderObject.setWeight(new BigDecimal(POIUtils.getCellValue(cellQ)));

        //描述
        XSSFCell cellR = row.getCell(16);
        tmsOrderObject.setDescription(POIUtils.getCellValue(cellR));

        tmsOrderObject.setExtendProp1(row.getRowNum() + 1 + "");

        return tmsOrderObject;
    }


    private boolean baseCheck(TmsOrderObject orderObject, OrderImportResponse resp) {
        return checkTel(resp, orderObject);
    }

    private boolean checkTel(OrderImportResponse resp, TmsOrderObject orderObj) {
        boolean flag = true;
        if (StringUtils.isEmpty(orderObj.getFromReceiverTel())){
            resp.dealErrmsg(OrderImportResponse.FROM_TEL_EMPTY, orderObj, "");
            flag = false;
        } else {
            if (orderObj.getFromReceiverTel().length() > 12){
                resp.dealErrmsg(OrderImportResponse.FROM_TEL_MAX, orderObj, orderObj.getFromReceiverTel());
                flag = false;
            }
        }
        if (!StringUtils.isEmpty(orderObj.getFromReceiverTel2()) && orderObj.getFromReceiverTel2().length() > 12){
            resp.dealErrmsg(OrderImportResponse.FROM_TEL_MAX, orderObj, orderObj.getFromReceiverTel2());
            flag = false;
        }

        if (StringUtils.isEmpty(orderObj.getToReceiverTel())){
            resp.dealErrmsg(OrderImportResponse.TO_TEL_EMPTY, orderObj, "");
            flag = false;
        } else {
            if (orderObj.getToReceiverTel().length() > 12){
                resp.dealErrmsg(OrderImportResponse.TO_TEL_MAX, orderObj, orderObj.getToReceiverTel());
                flag = false;
            }
        }
        if (!StringUtils.isEmpty(orderObj.getToReceiverTel2()) && orderObj.getToReceiverTel2().length() > 12){
            resp.dealErrmsg(OrderImportResponse.TO_TEL_MAX, orderObj, orderObj.getToReceiverTel2());
            flag = false;
        }

        return flag;
    }

    private void dealImportErr(OrderImportResponse resp, String num, String errMsg) {
        Map<String, Object> errMap = new HashMap<>();
        errMap.put("LINE_NO", num);
        errMap.put("EXCEPTION_MSG", errMsg);
        resp.getMsgList().add(errMap);
        resp.setStatus(ResultCode.PARAM_FORMAT_ERROR);
    }

}
