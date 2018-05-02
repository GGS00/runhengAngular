package com.cloudchain.admin.web.wms;

import com.alibaba.dts.shade.org.apache.commons.lang.math.NumberUtils;
import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.exception.BusinessLayerException;
import com.cloudchain.admin.model.base.BatchProcessResult;
import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.util.StringUtils;
import com.cloudchain.util.POIUtils;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.wms.api.inbound.WmsInboundService;
import com.cloudchain.wms.pojo.bo.inbound.WmsInboundRequest;
import com.cloudchain.wms.pojo.bo.inbound.WmsInboundResponse;
import com.cloudchain.wms.pojo.bo.outbound.WmsOutboundRequest;
import com.cloudchain.wms.pojo.po.WmsInbound;
import com.cloudchain.wms.pojo.po.WmsInboundItem;
import com.cloudchain.wms.pojo.po.WmsWhLeaseConfig;
import com.cloudchain.wms.pojo.vo.WmsOutboundModel;
import io.swagger.annotations.ApiOperation;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by zhangmingjing on 2017/3/1.
 */

@Controller
@RequestMapping("/wmsInbound")
public class WmsInboundController {

    @Autowired
    private WmsInboundService  wmsInboundService;

    private String[] excelHead={"货品编码", "货品名称", "入库数量", "库存状态"};
    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(WmsInboundController.class);

    @ApiOperation(value = "新增入库单")
    @RequestMapping(value = "/addInbound", method = RequestMethod.POST)
    @ResponseBody
    public String saveInbound(HttpServletRequest request,@RequestBody WmsInboundRequest wmsInboundRequest){
        logger.info("[WmsInboundController.saveSingle] IN");
        String retString = null;
//        WmsInboundRequest req  = new WmsInboundRequest();
//        req.setInbound(inbound);
        CommonParamUtil.setWmsOperator(request,wmsInboundRequest);
        WmsInboundResponse response =  wmsInboundService.addInbound(wmsInboundRequest);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = response.getRetString();
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsInboundController.saveSingle] OUT");
        return retString;
    }


    @ApiOperation(value = "入库单录码")
    @RequestMapping(value = "/doInputUC", method = RequestMethod.POST)
    @ResponseBody
    public String doInputUC(HttpServletRequest request, String id,String inventoryStatus,
                            String uniqueCodes,int uniqueCodeCount,String length){
        logger.info("[WmsInboundController.doInputUC] IN");
        String retString = null;
        WmsInboundRequest req  = new WmsInboundRequest();
        req.setItemId(id);
        req.setInvStatus(inventoryStatus);
        req.setLength(length);
        req.setUniqueCodes(uniqueCodes);
        req.setUniqueCodeCount(uniqueCodeCount);
        CommonParamUtil.setWmsOperator(request,req);
        WmsInboundResponse response = wmsInboundService.doInputUC(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString =  CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsInboundController.doInputUC] OUT");
        return retString;
    }


    @ApiOperation(value = "修改入库单")
    @RequestMapping(value = "/updateInbound", method = RequestMethod.POST)
    @ResponseBody
    public  String updateInbound(HttpServletRequest request, WmsInbound inbound){
        String retString="";
        logger.info("[WmsInboundController.updateInbound] IN");
        WmsInboundRequest req  = new WmsInboundRequest();
        req.setInbound(inbound);
        CommonParamUtil.setWmsOperator(request,req);
        WmsInboundResponse response =wmsInboundService.updateInbound(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString =  CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsInboundController.updateInbound] OUT");
        return retString;
    }


    @ApiOperation(value = "批量删除入库单")
    @RequestMapping(value = "/deleteInbound/{ids}",method = RequestMethod.POST)
    @ResponseBody
    public String deleteInbound(HttpServletRequest request,@PathVariable String ids){
        String retString="";
        logger.info("[WmsInboundController.deleteInbound] IN");
        WmsInboundRequest req  = new WmsInboundRequest();
        //分割待删除入库单ids
        String[] inboundIds =  ids.split(",");
        req.setIds(inboundIds);
        CommonParamUtil.setWmsOperator(request,req);
        WmsInboundResponse response = wmsInboundService.deleteInbound(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString =  CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsInboundController.deleteInbound] OUT");
        return retString;
    }

    @ApiOperation(value = "批量生效")
    @RequestMapping(value = "/batchUpdateStatus/{ids}",method = RequestMethod.POST)
    @ResponseBody
    public String batchUpdateStatus(HttpServletRequest request,@PathVariable String ids){
        String retString="";
        logger.info("[WmsInboundController.batchUpdateStatus] IN");
        WmsInboundRequest req  = new WmsInboundRequest();
        String[] inboundIds =  ids.split(",");
        req.setStatus("ACTIVE");
        req.setIds(inboundIds);
        CommonParamUtil.setWmsOperator(request,req);
        WmsInboundResponse response = wmsInboundService.batchUpdateStatus(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString =  CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsInboundController.batchUpdateStatus] OUT");
        return retString;
    }

    @ApiOperation(value = "批量失效")
    @RequestMapping(value = "/batchInvalid/{ids}",method = RequestMethod.POST)
    @ResponseBody
    public String batchInvalid(HttpServletRequest request,@PathVariable String ids){
        String retString="";
        logger.info("[WmsInboundController.batchInvalid] IN");
        WmsInboundRequest req  = new WmsInboundRequest();
        String[] inboundIds =  ids.split(",");
        req.setStatus("WORKING");
        req.setIds(inboundIds);
        CommonParamUtil.setWmsOperator(request,req);
        WmsInboundResponse response = wmsInboundService.batchUpdateStatus(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString =  CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.info("[WmsInboundController.batchInvalid] OUT");
        return retString;
    }


    @RequestMapping(value = "/scanWmsInbound/{id}", method = RequestMethod.GET)
    public String scanDetail(@PathVariable String id, Model model) {
        model.addAttribute("wmsInbound", wmsInboundService.load(id));
        return "wms/";
    }

    @RequestMapping(value = "/scanWmsDetail/{id}", method = RequestMethod.GET)
    public String scanDescri(@PathVariable String id, Model model) {
        model.addAttribute("wmsInbound", wmsInboundService.load(id));
        return "wms/";
    }

    @RequestMapping(value = "/getWmsInbound", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> getWmsInboundById(HttpServletRequest request, WmsOutboundModel model) {
        WmsOutboundRequest req = new WmsOutboundRequest();
        CommonParamUtil.setWmsReq(request,req,model);
        return wmsInboundService.load(req.getId());
    }

    /**
     * 一键入库
     */
    @RequestMapping(value = "/quickShelf/{inboundId}", method = RequestMethod.GET)
    @ResponseBody
    public String quickShelf(HttpServletRequest request, @PathVariable String inboundId) {
        logger.debug("[WmsInboundController.quickShelf] IN");
        String retString = null;
        WmsInboundRequest req  = new WmsInboundRequest();
        req.setId(inboundId);
        CommonParamUtil.setWmsOperator(request,req);
        WmsInboundResponse response =  wmsInboundService.oneBtnShelfForInbound(req);
        if (ResultCode.SUCCESS.equals(response.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(response.getMsg());
        }
        logger.debug("[WmsInboundController.quickShelf] OUT");
        return retString;
    }

    @RequestMapping(value = "/printInbound/{inboundId}", method = RequestMethod.GET)
    @ResponseBody
    public WmsInboundResponse printInbound(HttpServletRequest request, @PathVariable String inboundId) {
        WmsInboundRequest req = new WmsInboundRequest();
        req.setId(inboundId);

        WmsInboundResponse resp = wmsInboundService.getPrintMap(req);
        return resp;
    }

    /**
     * 导入入库单
     * @param request
     * @param response
     * @param multipartFile
     * @param session
     * @return
     */
    @RequestMapping(value = "/importInbound", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String importInbound(HttpServletRequest request, HttpServletResponse response,
                                     @RequestParam("excelFile") MultipartFile multipartFile, HttpSession session){
        String warehouseId = request.getParameter("warehouseId");
        String ownerId = request.getParameter("ownerId");
        String billTypeId = request.getParameter("billTypeId");
        String supplierId = request.getParameter("supplierId");

        if (StringUtils.isEmpty(supplierId))
        {
            supplierId = ownerId;
        }

        WmsInbound inbound = new WmsInbound();
        inbound.setWarehouseId(warehouseId);
        inbound.setOwnerId(ownerId);
        inbound.setBillTypeId(billTypeId);
        inbound.setSupplierId(supplierId);
        inbound.setDataFrom("IMPORT");

        List<Map<String, Object>> msgList = new ArrayList<Map<String, Object>>();//临时表数据
        /** 先判断文件名后缀是否为‘.xls’或‘.xlsx’ */
        // 获得项目路径
        String realPath = request.getSession().getServletContext().getRealPath("/");
        String oriFileName = multipartFile.getOriginalFilename();
        if (StringUtils.isEmpty(oriFileName)) {
            throw new BusinessLayerException("请选择Excel文件!");
        }

        String fileName =
                realPath + "templetFile" + File.separator + new Date().getTime()
                        + oriFileName;

        // 判断文件后缀
        if (!fileName.endsWith(".xls") && !fileName.endsWith(".xlsx"))
        {
            throw new BusinessLayerException("入库文件必须是Excel格式!");
        }

        File file = new File(fileName);
        FileInputStream fis = null;
        Workbook workBook = null;

        WmsInboundResponse resp = new WmsInboundResponse();

        WmsInboundRequest importParam = null;

        try
        {
            // 先将文件上传到项目中
            multipartFile.transferTo(file);

            fis = new FileInputStream(file);;

            workBook = WorkbookFactory.create(fis);

            importParam = createBatchImportXls(warehouseId, workBook, resp);

            if (ResultCode.SUCCESS.equals(resp.getStatus())) {
                //TODO 获取登录用户
                CommUserModel user = CommonParamUtil.getUserFromSession(request);
                importParam.setUserId(user.getOperatorId());
                importParam.setUserName(user.getOperatorName());
                importParam.setOperatorId(user.getOperatorId());
                importParam.setOperatorName(user.getOperatorName());

                importParam.setInbound(inbound);
                // 调用防伪码导入服务批量录入防伪码
                resp = wmsInboundService.importInbound(importParam);
            }

            if (ResultCode.SYSTEM_EXCEPTION.equals(resp.getStatus())) {
                return AjaxAdditionalResponseInfo.createSPRespInfo("系统异常！");
            }
            //从临时表中查询错误消息
            msgList = resp.getMsgList();

            if (null != msgList && msgList.size() > 0) {
                //将错误消息写入excel并导出
                POIUtils.errMsg2TmpTable(workBook, oriFileName, msgList, request, response);
            } else {
                //
            }
        }
        catch (Exception e)
        {
            return AjaxAdditionalResponseInfo.createSPRespInfo(StringUtils.getExceptionMsg(e));
        }
        finally
        {
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

        if(null != msgList && msgList.size() > 0)
            return AjaxAdditionalResponseInfo.createSPRespInfo("导入失败！");

        //导入成功，返回提示信息
        List<WmsInboundItem> securityCodeList = importParam.getWmsInboundItems();
        int totalCount = securityCodeList.size();
        return CommonControllerAspect.batchProcessResult(new BatchProcessResult(totalCount, 0));
    }

    /**
     * 批量导入防伪码参数（后缀名为.xls）
     * @param warehouseId
     * @param workBook
     * @param resp
     * @return
     * @throws IOException
     */
    private WmsInboundRequest createBatchImportXls(String warehouseId, Workbook workBook, WmsInboundResponse resp) throws IOException {
        WmsInboundRequest importParam = new WmsInboundRequest();

        // 获得第一个工作表sheet
        HSSFSheet sheet = (HSSFSheet) workBook.getSheetAt(0);
        if (sheet == null) throw new BusinessLayerException("该Excel是空的！");

        // 验证表头格式
        HSSFRow headRow = sheet.getRow(0);
        if (!POIUtils.checkHeadValue(POIUtils.getHeadCellsValue(headRow), excelHead))
            throw new BusinessLayerException("导入失败，请检查表头数据格式是否匹配！");

        ArrayList<WmsInboundItem> wmsInboundItems = new ArrayList<>();

        // 循环获得每一行row
        r: for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
            HSSFRow row = sheet.getRow(rowNum);
            if (row == null) continue;
            //封装防伪码list
            HSSFCell cellA = row.getCell(0);
            String productId = POIUtils.getCellValue(cellA); //"货品编码", "货品名称", "入库数量", "库存状态"
            if (StringUtils.isEmpty(productId))
                throw new BusinessLayerException("导入失败，第" + rowNum + "行货品编码为空。");

            HSSFCell cellB = row.getCell(2);
            String expectedQuantityBu = POIUtils.getCellValue(cellB);
            if (StringUtils.isEmpty(expectedQuantityBu) || !NumberUtils.isNumber(expectedQuantityBu))
                throw new BusinessLayerException("导入失败，第" + rowNum + "行入库数量错误。");

            HSSFCell cellC = row.getCell(3);
            String inventoryStatus = POIUtils.getCellValue(cellC);

            WmsInboundItem item = new WmsInboundItem();
            item.setProductId(productId);
            item.setExpectedQuantityBu(new BigDecimal(expectedQuantityBu));
            if (StringUtils.isEmpty(inventoryStatus) || "良品".equals(inventoryStatus))
            {
                inventoryStatus = "GOOD";
            }
            else
            {
                inventoryStatus = "BAD";
            }
            item.setInventoryStatus(inventoryStatus);
            item.setLineNo(rowNum);

            wmsInboundItems.add(item);
        }

        importParam.setWmsInboundItems(wmsInboundItems);

        return importParam;
    }
}
