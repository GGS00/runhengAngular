package com.cloudchain.admin.web.common;

import com.cloudchain.admin.aspect.AjaxAdditionalResponseInfo;
import com.cloudchain.admin.aspect.CommonControllerAspect;
import com.cloudchain.admin.exception.BusinessLayerException;
import com.cloudchain.admin.model.base.BatchProcessResult;
import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.pojo.bo.Request;
import com.cloudchain.platform.pojo.bo.Response;
import com.cloudchain.platform.service.IBaseExport;
import com.cloudchain.util.POIUtils;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.util.poi.ExcelUtil;
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
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
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
 * Created by lihao on 2017/6/3.
 */
public abstract class ImpExpController<Q extends Request, R extends Response> {
    private static final Logger LOGGER = LoggerFactory.getLogger(ImpExpController.class);

    @RequestMapping(value = "/exportData/{tName}", method = RequestMethod.GET)
    public void exportData(HttpServletRequest request, HttpServletResponse response, @PathVariable String tName) {
        LOGGER.info("ImpExtController.exportData() IN");
        ExcelUtil.export2ExcelNew(getExporter(), request, response, buildParam(request), getExportHeader(), getProperties(), tName);
        LOGGER.info("ImpExtController.exportData() OUT");
    }

    protected abstract Map<String, Object> buildParam(HttpServletRequest request);

    /**
     *
     * @return
     */
    protected abstract IBaseExport getExporter();

    /**
     * 获取导出文件头
     * @return
     */
    protected abstract String[] getExportHeader();

    /**
     * 字段名
     * @return
     */
    protected abstract String[] getProperties();

    /**
     * 导入
     * @param request
     * @param response
     * @param session
     * @param multipartFile
     * @return
     */
    @RequestMapping(value = "/importData", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    public String importData(HttpServletRequest request, HttpServletResponse response, HttpSession session,
                           @RequestParam("excelFile") MultipartFile multipartFile, Q req) {
        LOGGER.info("ImpExpController.importData() IN");
        String realPath = request.getSession().getServletContext().getRealPath("/");
        String oriFileName = multipartFile.getOriginalFilename();
        if (StringUtils.isEmpty(oriFileName)) {
            throw new BusinessLayerException("请选择Excel文件!");
        }
        String fileName =
                realPath + File.separator + "templetFile" + File.separator + new Date().getTime()
                        + oriFileName;

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
                list = resolveDataXls(workBook);
            } else if (fileName.endsWith(".xlsx")) {
                list = resolveDataXlsx(workBook);
            }

            if (CollectionUtils.isEmpty(list)){
                return AjaxAdditionalResponseInfo.createSPRespInfo("无订单信息！");
            }

            req.setList(list);
            R resp = doImport(req);

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
        LOGGER.info("ImpExpController.importData() OUT");
        return CommonControllerAspect.batchProcessResult(new BatchProcessResult(totalCount, 0));
    }

    /**
     * 表格头
     * @return
     */
    protected abstract String [] getImpHead();

    /**
     * 解析xls格式文件
     * @param workbook
     * @return
     */
    protected List resolveDataXls(Workbook workbook) {
        HSSFSheet sheet = (HSSFSheet) workbook.getSheetAt(0);
        if (sheet == null) {
            throw new BusinessLayerException("该Excel是空的！");
        }

        // 验证表头格式
        HSSFRow headRow = sheet.getRow(0);
        if (!POIUtils.checkHeadValue(POIUtils.getHeadCellsValue(headRow), getImpHead())){
            throw new BusinessLayerException("导入失败，请检查表头数据格式是否匹配！");
        }

        return loopRow(sheet);
    }

    /**
     * 解析xlsx格式文件
     * @param workbook
     * @return
     */
    protected List resolveDataXlsx(Workbook workbook){
        XSSFSheet sheet = (XSSFSheet) workbook.getSheetAt(0);
        if (sheet == null) {
            throw new BusinessLayerException("该Exce是空的！");
        }

        // 验证表头格式
        XSSFRow headRow = sheet.getRow(0);
        if (!POIUtils.checkHeadValue(POIUtils.getHeadCellsValue(headRow), getImpHead())){
            throw new BusinessLayerException("导入失败，请检查表头数据格式是否匹配！");
        }

        return loopRow(sheet);
    }

    /**
     * 封装请求消息体
     * @param sheet
     * @return
     */
    protected List loopRow(Sheet sheet){
        LOGGER.info("ImpExpController.build() IN");
        List list = new ArrayList();
        Map<String, Object> context = new HashMap<String, Object>();
        for (int line = 1; line < sheet.getLastRowNum(); line++){
            Row row =  sheet.getRow(line);
            if (null == row){
                continue;
            }

            if (!check(row, context)){
                LOGGER.error("error format params for import.");
                continue;
            }

            build(row, context, list);
        }
        LOGGER.info("ImpExpController.build() OUT");
        return list;
    }

    /**
     * 数据校验
     * @param row
     * @param context
     * @return
     */
    protected abstract boolean check(Row row, Map<String, Object> context);

    /**
     *
     * @param row
     * @param context
     * @param list
     * @return
     */
    protected abstract Object build(Row row, Map<String, Object> context, List list);

    /**
     * 导入
     * @param req
     * @return
     */
    protected abstract R doImport(Q req);
}
