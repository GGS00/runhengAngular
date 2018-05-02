package com.cloudchain.admin.web.tbms;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.exception.BusinessLayerException;
import com.cloudchain.admin.model.base.BatchProcessResult;
import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.util.JacksonUtils;
import com.cloudchain.platform.util.StringUtils;
import com.cloudchain.tbms.api.TbmsSecurityCodeService;
import com.cloudchain.tbms.pojo.bo.TbmsSecurityCodeRequest;
import com.cloudchain.tbms.pojo.bo.TbmsSecurityCodeResponse;
import com.cloudchain.tbms.pojo.po.TbmsSecurityCode;
import com.cloudchain.util.POIUtils;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.Api;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.util.*;

/**
 * Created by zhangmingjing on 2017/3/1.
 */
@Api(value = "tbms-api", description = "溯源管理相关接口")
@Controller
@RequestMapping("/securityCode")
public class TbmsSecurityCodeController {
    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(TbmsSecurityCodeController.class);

    private String[] excelHead={"防伪码编号"};

    @Autowired
    private TbmsSecurityCodeService securityCodeService;

    private static final String msgKey = "\"additionalMsg\": ";

    /**
     * 添加单条防伪码
     * @param request
     * @param securitycode
     * @return
     */
    @ApiOperation(value = "新增防伪码")
    @RequestMapping("/saveSingle")
    @ResponseBody
    public String saveSingle(HttpServletRequest request, TbmsSecurityCode securitycode,HttpSession session){

        logger.info("[TbmsSecurityCodeController.saveSingle] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        TbmsSecurityCodeRequest req = new TbmsSecurityCodeRequest();

        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        req.setSupplierId(user.getUserId());
        req.setSupplierName(user.getUserName());
        req.setUserId(user.getOperatorId());
        req.setUserName(user.getOperatorName());
        req.setTbmsSecurityCode(securitycode);

        TbmsSecurityCodeResponse resp = securityCodeService.saveSingle(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = resp.getRetString();
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TbmsSecurityCodeController.saveSingle] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }

    /**
     *批量删除防伪码
     * @param request
     * @param response
     * @return
     */
    @ApiOperation(value = "批量删除防伪码")
    @RequestMapping("/deleteSecurityCode")
    @ResponseBody
    public  String deleteSecurityCode(HttpServletRequest request,HttpServletResponse response){
        logger.info("[TbmsSecurityCodeController.deleteSecurityCode] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        String goodsId = request.getParameter("goosId");
        String lot = request.getParameter("lot");
        String distributorId = request.getParameter("distributorId");
        String securityCode = request.getParameter("securityCode");
        Map<String,Object> param = new HashMap<String,Object>();
        //将删除防伪码参数条件放入map
        param.put("goodsId",goodsId);
        param.put("lot",lot);
        param.put("distributorId",distributorId);
        param.put("securityCode",securityCode);
        TbmsSecurityCodeRequest req = new TbmsSecurityCodeRequest();
        req.setParam(param);
        TbmsSecurityCodeResponse resp = securityCodeService.deleteSecurityCode(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TbmsSecurityCodeController.deleteSecurityCode] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }


    /**
     *批量修改防伪码
     * @param request
     * @param response
     * @return
     */
    @ApiOperation(value = "批量修改防伪码")
    @RequestMapping("/updateSecurityCode")
    @ResponseBody
    public  String updateSecurityCode(HttpServletRequest request,HttpServletResponse response){
        logger.info("[TbmsSecurityCodeController.updateSecurityCode] IN");
        long begin = System.currentTimeMillis();

        String retString = null;
        String goodsId = request.getParameter("goosId");
        String lot = request.getParameter("lot");
        String securityCode = request.getParameter("securityCode");
        String toGoodsId = request.getParameter("toGoodsId");
        String toGoodsName = request.getParameter("toGoodsName");
        String distributorId = request.getParameter("distributorId");
        String distributorName = request.getParameter("distributorName");
        Map<String,Object> param = new HashMap<String,Object>();
        //将修改防伪码参数条件放入map
        param.put("goodsId",goodsId);
        param.put("lot",lot);
        param.put("distributorId",distributorId);
        param.put("securityCode",securityCode);
        param.put("toGoodsId",toGoodsId);
        param.put("toGoodsName",toGoodsName);
        param.put("distributorId",distributorId);
        param.put("distributorName",distributorName);
        TbmsSecurityCodeRequest req = new TbmsSecurityCodeRequest();
        req.setParam(param);
        TbmsSecurityCodeResponse resp = securityCodeService.updateSecurityCode(req);

        long end = System.currentTimeMillis();
        if (ResultCode.SUCCESS.equals(resp.getStatus())) {
            retString = CommonControllerAspect.RETURN_VOID;
        }
        else {
            retString = AjaxAdditionalResponseInfo.createSPRespInfo(resp.getMsg());
        }
        logger.info("[TbmsSecurityCodeController.updateSecurityCode] OUT,cost time:{}s", (end - begin) / 1000d);
        return retString;
    }


    /**
     * 根据条件获取防伪码条数
     * @param request
     * @param response
     * @return
     */
    @ApiOperation(value = "根据条件获取防伪码条数")
    @RequestMapping("/getSecurityCodeTotalByParams")
    @ResponseBody
    public String getSecurityCodeTotalByParams(HttpServletRequest request,HttpServletResponse response){
        logger.info("[TbmsSecurityCodeController.updateSecurityCode] IN");
        long begin = System.currentTimeMillis();

        String goodsId = request.getParameter("goosId");
        String lot = request.getParameter("lot");
        String securityCode = request.getParameter("securityCode");
        Map<String,Object> param = new HashMap<String,Object>();
        param.put("goodsId",goodsId);
        param.put("lot",lot);
        //param.put("securityCode",securityCode);
        param.put("code",securityCode);   //mapper.xml文件中用的是code 20170406修改
        long total = securityCodeService.total(param);

        long end = System.currentTimeMillis();
        Map<String, Object> info = new HashMap<String, Object>();
        info.put("status", "00");
        info.put("processTime", (end - begin) / 1000d);
        info.put("message", "");
        info.put("codeTotal", total);
        String additionalMsg = msgKey + JacksonUtils.object2json(info);
        return new StringBuffer().append("{").append(additionalMsg).append("}").toString();
    }


    /**
     * 下载防伪码导入模板
     * @param request
     * @param response
     */
    @ApiOperation(value = "下载防伪码导入模板")
    @RequestMapping(value = "/downloadTemplate", method = RequestMethod.POST)
    @ResponseBody
    public void downloadTemplate(HttpServletRequest request, HttpServletResponse response) {
        String path = request.getSession().getServletContext().getRealPath("/");
        String filePath = path + File.separator + "templetFile" + File.separator + "traceabilityImportFile.xls";
        File file = new File(filePath);

        if (!file.exists()) // 模板文件不存在
            throw new BusinessLayerException("模板文件不存在！");

        BufferedInputStream bis = null;
        OutputStream out = null;
        byte[] buf = new byte[1024];
        int len = 0;

        try {
            // 设置要显示在保存窗口的文件名，如果文件名中有中文的话，则要设置字符集
            String fileName = "traceabilityImportFile.xls";
            if (request.getHeader("User-Agent").toUpperCase().indexOf("MSIE") > 0) {
                fileName = java.net.URLEncoder.encode(fileName, "utf-8");
            }
            else {
                fileName = new String(fileName.getBytes("utf-8"), "ISO8859-1");
            }

            // 设置弹出"是否要保存"的对话框
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
            // 指定文件类型
            response.setContentType("application/vnd.ms-excel;charset=utf-8");

            bis = new BufferedInputStream(new FileInputStream(file));
            out = response.getOutputStream();
            while ((len = bis.read(buf)) > 0)
                out.write(buf, 0, len);
        }
        catch (IOException e) {
            throw new BusinessLayerException("模板文件下载失败！");
        }
        catch (Exception e) {
            throw new BusinessLayerException("系统异常，请联系管理员！");
        }
        finally {
            try {
                out.close();
                bis.close();
            }
            catch (IOException e) {
                throw new BusinessLayerException("系统异常，请联系管理员！");
            }
        }
    }


    /**
     * 批量导入防伪码excel
     * @param request
     * @param response
     * @param multipartFile
     * @return
     */
    @ApiOperation(value = "批量导入防伪码excel")
    @RequestMapping(value = "/importSecurityCode", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String importSecurityCode(HttpServletRequest request, HttpServletResponse response,
                                     @RequestParam("excelFile") MultipartFile multipartFile,HttpSession session){
        String goodsId = request.getParameter("goodsId");
        String goodsName = request.getParameter("goodsName");
        String distributorId = request.getParameter("distributorId");
        String distributorName = request.getParameter("distributorName");
        // 判断是否选择商品
        if (null==goodsId||"".equals(goodsId))
            throw new BusinessLayerException("必须选择防伪码所属商品!");

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
            throw new BusinessLayerException("防伪码文件必须是Excel格式!");

        File file = new File(fileName);
        FileInputStream fis = null;
        Workbook workBook = null;

        // 批量导入运单参数对象
        TbmsSecurityCodeRequest importParam = null;
        TbmsSecurityCodeResponse resp = new TbmsSecurityCodeResponse();
        try {
            // 先将文件上传到项目中
            multipartFile.transferTo(file);

            // 再将excel文件解析为对象
            fis = new FileInputStream(file);

            workBook = WorkbookFactory.create(fis);
            importParam = createBatchImportXls(workBook, resp);

            if (ResultCode.SUCCESS.equals(resp.getStatus())) {
                //TODO 获取登录用户
                CommUserModel user = CommonParamUtil.getUserFromSession(request);
                importParam.setUserId(user.getOperatorId());
                importParam.setUserName(user.getOperatorName());
                importParam.setSupplierId(user.getUserId());
                importParam.setSupplierName(user.getUserName());
                importParam.setGoodsId(goodsId);
                importParam.setGoodsName(goodsName);
                importParam.setDistributorId(distributorId);
                importParam.setDistributorName(distributorName);
                // 调用防伪码导入服务批量录入防伪码
                resp = securityCodeService.saveBatch(importParam);

            }
            if (ResultCode.SYSTEM_EXCEPTION.equals(resp.getStatus())) {
                return AjaxAdditionalResponseInfo.createSPRespInfo("系统异常！");
            }
            //从临时表中查询错误消息
            msgList = resp.getMsgList();

            if (msgList.size() > 0) {
                //将错误消息写入excel并导出
                POIUtils.errMsg2TmpTable(workBook, oriFileName, msgList, request, response);
            } else {
                //
            }
        }catch (Exception e) {
            throw new BusinessLayerException(StringUtils.getExceptionMsg(e));
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
        List<TbmsSecurityCode> securityCodeList = importParam.getTbmsSecutrityCodeList();
        int totalCount = securityCodeList.size();
        return CommonControllerAspect.batchProcessResult(new BatchProcessResult(totalCount, 0));

    }


    /**
     * 批量导入防伪码参数（后缀名为.xls）
     * @param workBook
     * @param resp
     * @return
     * @throws IOException
     */
    private TbmsSecurityCodeRequest createBatchImportXls(Workbook workBook, TbmsSecurityCodeResponse resp) throws IOException {
        TbmsSecurityCodeRequest importParam = new TbmsSecurityCodeRequest();
        List<TbmsSecurityCode> tbmsSecurityCodeList = new ArrayList<TbmsSecurityCode>();

        // 获得第一个工作表sheet
        HSSFSheet sheet = (HSSFSheet) workBook.getSheetAt(0);
        if (sheet == null) throw new BusinessLayerException("该Excel是空的！");

        // 验证表头格式
        HSSFRow headRow = sheet.getRow(0);
        if (!POIUtils.checkHeadValue(POIUtils.getHeadCellsValue(headRow), excelHead))
            throw new BusinessLayerException("导入失败，请检查表头数据格式是否匹配！");

        // 循环获得每一行row
        r: for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
            HSSFRow row = sheet.getRow(rowNum);
            if (row == null) continue;
            //封装防伪码list
            TbmsSecurityCode securityCode = new TbmsSecurityCode();
            //获取防伪码
            HSSFCell cellA = row.getCell(0);
            securityCode.setCode(POIUtils.getCellValue(cellA));
            tbmsSecurityCodeList.add(securityCode);
        }
        if(tbmsSecurityCodeList.size() < 1){
            throw new BusinessLayerException("导入的防伪码数据是空的！");}
        importParam.setTbmsSecutrityCodeList(tbmsSecurityCodeList);
        return importParam;
    }

//    /**
//     * 批量导入防伪码（后缀名为.xlsx）
//     * @param workBook
//     * @param resp
//     * @return
//     * @throws IOException
//     */
//    private TbmsSecurityCodeRequest createBatchImportXlsx(Workbook workBook, TbmsSecurityCodeResponse resp) throws IOException {
//        TbmsSecurityCodeRequest importParam = new TbmsSecurityCodeRequest();
//        List<TbmsSecurityCode> tbmsSecurityCodeList = new ArrayList<TbmsSecurityCode>();
//
//        // 获得第一个工作表sheet
//        XSSFSheet sheet = (XSSFSheet) workBook.getSheetAt(0);
//        if (sheet == null) throw new BusinessLayerException("该Excel是空的！");
//
//        // 验证表头格式
//        XSSFRow headRow = sheet.getRow(0);
//        if (!POIUtils.checkHeadValue(POIUtils.getHeadCellsValue(headRow), excelHead))
//            throw new BusinessLayerException("导入失败，请检查数据格式是否匹配！");
//
//        // 循环获得每一行row
//        r: for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
//            XSSFRow row = sheet.getRow(rowNum);
//            if (row == null) continue;
//             //封装防伪码list
//            TbmsSecurityCode securityCode = new TbmsSecurityCode();
//            // 获取防伪码
//            XSSFCell cellA = row.getCell(0);
//            securityCode.setCode(POIUtils.getCellValue(cellA));
//            tbmsSecurityCodeList.add(securityCode);
//            }
//
//          if(tbmsSecurityCodeList.size() < 1){
//            throw new BusinessLayerException("导入的运单数据是空的！");}
//           importParam.setTbmsSecutrityCodeList(tbmsSecurityCodeList);
//           return importParam;
//    }



}
