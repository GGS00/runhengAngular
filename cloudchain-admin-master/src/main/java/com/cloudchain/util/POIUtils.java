package com.cloudchain.util;

import com.cloudchain.admin.exception.BusinessLayerException;
import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by zhangmingjing on 2017/3/2.
 */
public class POIUtils {
    /**
     * @Title: getHeadCellsValue
     * @Description: 获得excel表头值
     * @return: List<String>
     * @author: yunlei.hua
     * @date: 2014年11月27日 下午7:16:16
     */
    public static List<String> getHeadCellsValue(Row row) {
        if(row == null)
            return null;
        List<String> list = new ArrayList<String>();

        for (int cellNum = 0; cellNum < row.getLastCellNum(); cellNum++) { // 循环列Cell
            Cell cell = row.getCell(cellNum);
            String cellValue = POIUtils.getCellValue(cell);
            list.add(cellValue);
        }
        return list;
    }

    /**
     * @Title: checkHeadValue
     * @Description: 校验表头数据是否与要求格式匹配
     * @return: boolean
     * @author: yunlei.hua
     * @date: 2014年11月27日 下午7:25:31
     */
    public static boolean checkHeadValue(List<String> list, String[] str) {
        if(StringUtils.isEmpty(list) || StringUtils.isEmpty(str))
            return false;
        for(int i = 0; i < str.length; i++) {
            if(!list.get(i).toString().contains(str[i].trim()))
                return false;
        }
        return true;
    }

    /**
     * @Title: getCellValue
     * @Description: 获得cell中的数据
     * @return: String
     * @author: yunlei.hua
     * @date: 2014年11月28日 上午9:00:52
     */
    @SuppressWarnings("static-access")
    public static String getCellValue(Cell cell) {
        String result = "";

        if(cell == null)
            return result;
        int cellType = cell.getCellType();

        if(cellType == cell.CELL_TYPE_BLANK) {
            return result;
        } else if(cellType == cell.CELL_TYPE_STRING) {
            return cell.getStringCellValue().trim().replace("'", "");
        } else if(cellType == cell.CELL_TYPE_FORMULA) {
            try {
                return String.valueOf(cell.getStringCellValue());
            } catch (IllegalStateException e) {
                return String.valueOf(cell.getNumericCellValue());
            }
        } else if(HSSFDateUtil.isCellDateFormatted(cell)) {
            return DateFormatUtils.format(cell.getDateCellValue().getTime(), "yyyy-MM-dd HH:mm:ss");
        } else if(cellType == cell.CELL_TYPE_BOOLEAN) {
            return String.valueOf(cell.getBooleanCellValue());
        } else if(cellType == cell.CELL_TYPE_NUMERIC) {
            DecimalFormat df = new DecimalFormat("0.##");
            return df.format(cell.getNumericCellValue());
        } else {
            cell.setCellType(cell.CELL_TYPE_STRING);
            return cell.getStringCellValue();
        }
    }

    public static Long getCellLongValue(Cell cell){
        String valStr = getCellValue(cell);
        if (StringUtils.isEmpty(valStr)){
            return 0L;
        }

        return Long.parseLong(valStr);
    }

    public static Integer getCellIntValue(Cell cell){
        String valStr = getCellValue(cell);
        if (StringUtils.isEmpty(valStr)){
            return 0;
        }

        return Integer.parseInt(valStr);
    }

    /**
     * @Title: errMsg2TmpTable
     * @Description: 将错误消息写入excel并导出（订单导入）
     * @return: void
     * @author: yunlei.hua
     * @date: 2015年1月28日 下午5:23:12
     */
    @SuppressWarnings("static-access")
    public static void errMsg2TmpTable(Workbook workBook, String fileName, List<Map<String, Object>> msgList, HttpServletRequest request, HttpServletResponse response) {
        //获得第一个工作表sheet
        Sheet sheet = workBook.getSheetAt(0);
        workBook.setSheetName(0, "失败数据");
        //表头
        Row rowHead = sheet.getRow(0);
        int cellNum = rowHead.getLastCellNum();//每行的最后一列单元格

        //设置单元格样式
        CellStyle stype = workBook.createCellStyle();
        Font font = workBook.createFont();
        font.setFontHeightInPoints((short)11); //字体大小
        font.setFontName("宋体");
        //font.setBoldweight(Font.BOLDWEIGHT_BOLD); //粗体
        font.setColor(HSSFColor.RED.index);    //红字
        stype.setFont(font);

        //循环错误消息
        m:for(Map<String, Object> msg : msgList) {
            String currNo = (String) msg.get("LINE_NO");
            //循环每一行
            for(int r = 1; r <= sheet.getLastRowNum(); r++){
                Row row = sheet.getRow(r);
                String rowNum = String.valueOf(row.getRowNum());

                if(currNo.equals(rowNum)) {//行号相同，将错误消息插到该行的最后一个单元格
                    Cell cell = row.createCell(cellNum);
                    cell.setCellType(cell.CELL_TYPE_STRING);
                    cell.setCellStyle(stype);
                    cell.setCellValue((String) msg.get("EXCEPTION_MSG"));
                    continue m;
                }
            }
        }

        export(workBook, fileName, request, response);
    }

    /**
     * @Title: errMsg3TmpTable
     * @Description: 将错误消息写入excel并导出（订单导入） 分成功与失败sheet
     * @return: void
     * @author: yunlei.hua
     * @date: 2015年1月28日 下午5:23:12
     */
    @SuppressWarnings("static-access")
    public static void errMsg3TmpTable(Workbook workBook, String fileName, List<Map<String, Object>> msgList, HttpServletRequest request, HttpServletResponse response) {
        //获得第一个工作表sheet
        Sheet sheet = workBook.getSheetAt(0);
        workBook.setSheetName(0, "成功数据");
//        Sheet newSheet = workBook.createSheet("失败数据");

        //表头
        Row rowHead = sheet.getRow(0);
        int cellNum = rowHead.getLastCellNum();//每行的最后一列单元格

        //设置单元格样式
        CellStyle stype = workBook.createCellStyle();
        Font font = workBook.createFont();
        font.setFontHeightInPoints((short)11); //字体大小
        font.setFontName("宋体");
        //font.setBoldweight(Font.BOLDWEIGHT_BOLD); //粗体
        font.setColor(HSSFColor.RED.index);    //红字
        stype.setFont(font);

        //循环错误消息
        int execNum = 0;
        m:for(Map<String, Object> msg : msgList) {
            execNum ++;
            String currNo = (String) msg.get("LINE_NO");
            //循环每一行
            for(int r = 1; r <= sheet.getLastRowNum(); r++){
                Row row = sheet.getRow(r);
                String rowNum = String.valueOf(row.getRowNum() + 1);

                if(currNo.equals(rowNum)) {//行号相同，将错误消息插到该行的最后一个单元格
                    Cell cell = row.createCell(cellNum);
                    cell.setCellType(cell.CELL_TYPE_STRING);
                    cell.setCellStyle(stype);
                    cell.setCellValue((String) msg.get("EXCEPTION_MSG"));
//                    continue m;
                } else {
                    if (execNum == 1) {
                        Cell cell = row.createCell(cellNum);
                        cell.setCellType(cell.CELL_TYPE_STRING);
                        cell.setCellStyle(stype);
                        cell.setCellValue("");
                    }
                }
            }
        }
        //复制sheet页
//        copySheet(workBook, sheet, newSheet, true);
        Sheet newSheet = workBook.cloneSheet(0);
        workBook.setSheetName(workBook.getNumberOfSheets() - 1, "失败数据");
//        List<String> codeLst = new ArrayList<String>();
        Set<String> codeLst = new HashSet<String>();

        for (int r = 1; r <= sheet.getLastRowNum(); r++) {
            Row row = sheet.getRow(r);
            int cellIndex = row.getLastCellNum();
            Cell cell = row.getCell(cellIndex-1);
            if (cell != null) {
                String cellVal = cell.getStringCellValue();
                if (cellVal != null && !"".equals(cellVal)) {
                    String code = row.getCell(0).getStringCellValue();
                    codeLst.add(code);
                }
            }
        }
        //移除失败记录
        for (int r = 1; r <= sheet.getLastRowNum(); r++) {
            Row row = sheet.getRow(r);
            if (row.getCell(0) != null && !"".equals(row.getCell(0))) {
                String tempVal = row.getCell(0).getStringCellValue();
                for (String code : codeLst) {
                    if (code.equals(tempVal)) {
                        if (r == sheet.getLastRowNum()) {
                            sheet.removeRow(sheet.getRow(r));
                        } else {
                            sheet.shiftRows(r+1, sheet.getLastRowNum(), -1);
                        }
                        r--;
                        break;
                    }
                }
            }
        }
        //移除成功记录
        int num = 1;
        while(true){
            Row row = newSheet.getRow(num);
            if(row == null){
                break;
            }
            boolean flag = false;
            if (row.getCell(0) != null && !"".equals(row.getCell(0))) {
                String tempVal = row.getCell(0).getStringCellValue();
                for (String code : codeLst) {
                    if (code.equals(tempVal)) {
                        num++;
                        flag = true;
                        break;
                    }
                }
                if(!flag){
                    newSheet.shiftRows(num+1, newSheet.getLastRowNum(), -1);
                    if(num == newSheet.getLastRowNum()){
                        newSheet.removeRow(newSheet.getRow(num));
                    }
                    if (num != 1) {
                        num --;
                    }
                }
            } else {
                num++;
            }
        }
        export(workBook, fileName, request, response);
    }

    /**
     * @Title: errMsgTmpTable2Excel
     * @Description: 将错误消息根据表头数据写入excel并导出（库存审核）
     * @return: void
     * @author: yunlei.hua
     * @date: 2015年3月10日 下午3:01:37
     */
    @SuppressWarnings("static-access")
    public static void errMsgTmpTable2Excel(Workbook workBook, String fileName,
                                            List<Map<String, Object>> msgList, String[] t_propertys,
                                            HttpServletRequest request, HttpServletResponse response) {
        //获得第一个工作表sheet
        Sheet sheet = workBook.getSheetAt(0);

        //设置单元格样式
        CellStyle stype = workBook.createCellStyle();
        Font font = workBook.createFont();
        font.setFontHeightInPoints((short)11); //字体大小
        font.setFontName("宋体");
        //font.setBoldweight(Font.BOLDWEIGHT_BOLD); //粗体
        font.setColor(HSSFColor.BLACK.index);
        stype.setFont(font);

        int rowSize = msgList.size();
        for(int i = 0; i < rowSize; i++) {
            Map<String, Object> msg = msgList.get(i);
            Row row = sheet.createRow(i+1);
            for(int j = 0; j < t_propertys.length; j++) {
                Cell cell = row.createCell(j);
                cell.setCellType(cell.CELL_TYPE_STRING);
                cell.setCellStyle(stype);
                cell.setCellValue((String) msg.get(t_propertys[j]));
            }
        }

        export(workBook, fileName, request, response);
    }

    /**
     * @Title: export
     * @Description: excel导出
     * @return: void
     * @author: yunlei.hua
     * @date: 2015年1月28日 下午5:35:35
     */
    public static void export(Workbook workBook, String fileName, HttpServletRequest request, HttpServletResponse response) {
        OutputStream os = null;
        try {
            //重新下载订单
            os = response.getOutputStream();
            // 设置要显示在保存窗口的文件名，如果文件名中有中文的话，则要设置字符集
            if (request.getHeader("User-Agent").toUpperCase().indexOf("MSIE") > 0) {
                fileName = java.net.URLEncoder.encode(fileName, "utf-8");
            } else {
                fileName = new String(fileName.getBytes("utf-8"), "ISO8859-1");
            }

            response.setContentType("Application/vnd.ms-excel;");
            response.setHeader("Content-Disposition", "attachment; filename=".concat(fileName));
            response.setHeader("Content-Type", "application/vnd.ms-excel");
            workBook.write(os);
        } catch (IOException e) {
            throw new BusinessLayerException("系统错误，excel下载失败!");
        } finally {
            try {
                os.close();
            } catch (IOException e) {
                throw new BusinessLayerException("输出流不能正常关闭，excel下载失败!");
            }
        }
    }


    /**
     * @Title: getCellValueByRegex
     * @Description: 拆分excel单元格中的值
     * @return: List<String>
     * @author: yunlei.hua
     * @date: 2015年3月19日 上午11:12:20
     */
    public static List<String> getCellValueByRegex(Cell cell, String regexp) {
        List<String> preList = new ArrayList<String>();//返回的集合

        String telString = POIUtils.getCellValue(cell).replace(" ", "").replace("-", "");
        telString += ",";
        if (!StringUtils.isEmpty(telString)) {
            int star = 0;
            for (int i = 0; i < telString.length(); i++) {
                char cat = telString.charAt(i);
                Pattern p = Pattern.compile(regexp);
                Matcher m = p.matcher(cat+"");
                if (m.find()) {
                    String tel = telString.substring(star, i);
                    preList.add(tel);
                    star = i + 1;
                }
            }
            if (preList.size() < 1)
                preList.add(telString);
        }
        return preList;
    }


    /**
     * 复制一个单元格样式到目的单元格样式
     * @param fromStyle
     * @param toStyle
     */
    public static void copyCellStyle(CellStyle fromStyle,
                                     CellStyle toStyle) {
        /*toStyle.setAlignment(fromStyle.getAlignment());
        //边框和边框颜色
        toStyle.setBorderBottom(fromStyle.getBorderBottom());
        toStyle.setBorderLeft(fromStyle.getBorderLeft());
        toStyle.setBorderRight(fromStyle.getBorderRight());
        toStyle.setBorderTop(fromStyle.getBorderTop());
        toStyle.setTopBorderColor(fromStyle.getTopBorderColor());
        toStyle.setBottomBorderColor(fromStyle.getBottomBorderColor());
        toStyle.setRightBorderColor(fromStyle.getRightBorderColor());
        toStyle.setLeftBorderColor(fromStyle.getLeftBorderColor());


        toStyle.setFillForegroundColor(IndexedColors.PALE_BLUE.getIndex());
        toStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);

        toStyle.setDataFormat(fromStyle.getDataFormat());
        toStyle.setFillPattern(fromStyle.getFillPattern());

        toStyle.setHidden(fromStyle.getHidden());
        toStyle.setIndention(fromStyle.getIndention());//首行缩进
        toStyle.setLocked(fromStyle.getLocked());
        toStyle.setRotation(fromStyle.getRotation());//旋转
        toStyle.setVerticalAlignment(fromStyle.getVerticalAlignment());
        toStyle.setWrapText(fromStyle.getWrapText()); */
        //cloneStyleFrom拷贝单元格所有样式
        toStyle.cloneStyleFrom(fromStyle);

    }

    /**
     * Sheet复制
     * @param fromSheet
     * @param toSheet
     * @param copyValueFlag
     */
    public static void copySheet(Workbook wb,Sheet fromSheet, Sheet toSheet,
                                 boolean copyValueFlag) {
        //合并区域处理
        mergerRegion(fromSheet, toSheet);
        for (Iterator rowIt = fromSheet.rowIterator(); rowIt.hasNext();) {
            Row tmpRow = (Row) rowIt.next();
            Row newRow = toSheet.createRow(tmpRow.getRowNum());
            //行复制
            copyRow(wb,tmpRow,newRow,copyValueFlag);
        }
    }
    /**
     * 行复制功能
     * @param fromRow
     * @param toRow
     */
    public static void copyRow(Workbook wb,Row fromRow,Row toRow,boolean copyValueFlag){
        for (Iterator cellIt = fromRow.cellIterator(); cellIt.hasNext();) {
            Cell tmpCell = (Cell) cellIt.next();
            Cell newCell = toRow.createCell(tmpCell.getColumnIndex());

            copyCell(wb,tmpCell, newCell, copyValueFlag);
        }
    }
    /**
     * 复制原有sheet的合并单元格到新创建的sheet
     *
     */
    public static void mergerRegion(Sheet fromSheet, Sheet toSheet) {
        int sheetMergerCount = fromSheet.getNumMergedRegions();
        for (int i = 0; i < sheetMergerCount; i++) {
            CellRangeAddress mergedRegionAt = fromSheet.getMergedRegion(i);
            toSheet.addMergedRegion(mergedRegionAt);
        }
    }
    /**
     * 复制单元格
     *
     * @param srcCell
     * @param distCell
     * @param copyValueFlag
     *            true则连同cell的内容一起复制
     */
    public static void copyCell(Workbook wb,Cell srcCell, Cell distCell,
                                boolean copyValueFlag) {
        CellStyle newstyle=wb.createCellStyle();
        copyCellStyle(srcCell.getCellStyle(), newstyle);
        //样式
        distCell.setCellStyle(newstyle);
        //评论
        if (srcCell.getCellComment() != null) {
            distCell.setCellComment(srcCell.getCellComment());
        }
        // 不同数据类型处理
        int srcCellType = srcCell.getCellType();
        distCell.setCellType(srcCellType);
        if (copyValueFlag) {
            if (srcCellType == Cell.CELL_TYPE_NUMERIC) {
                if (DateUtil.isCellDateFormatted(srcCell)) {
                    distCell.setCellValue(srcCell.getDateCellValue());
                } else {
                    distCell.setCellValue(srcCell.getNumericCellValue());
                }
            } else if (srcCellType == Cell.CELL_TYPE_STRING) {
                distCell.setCellValue(srcCell.getRichStringCellValue());
            } else if (srcCellType == Cell.CELL_TYPE_BLANK) {
                // nothing21
            } else if (srcCellType == Cell.CELL_TYPE_BOOLEAN) {
                distCell.setCellValue(srcCell.getBooleanCellValue());
            } else if (srcCellType == Cell.CELL_TYPE_ERROR) {
                distCell.setCellErrorValue(srcCell.getErrorCellValue());
            } else if (srcCellType == Cell.CELL_TYPE_FORMULA) {
                distCell.setCellFormula(srcCell.getCellFormula());
            } else { // nothing29
            }
        }
    }
}
