package com.cloudchain.util.poi;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.platform.exception.BaseRuntimeException;
import com.cloudchain.platform.service.IBaseExport;
import com.cloudchain.util.param.CommonParamUtil;
import org.apache.commons.beanutils.BeanComparator;
import org.apache.commons.beanutils.PropertyUtilsBean;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.ComparatorUtils;
import org.apache.commons.collections.comparators.ComparableComparator;
import org.apache.commons.collections.comparators.ComparatorChain;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.io.*;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.MessageFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Map.Entry;


/**
 * @ClassName: ExcelUtil The <code>ExcelUtil</code> 与 {@link ExcelCell}搭配使用
 * @Description:
 * @author: peng.wu
 * @date: 2014年12月16日 下午1:23:44
 */
public class ExcelUtil {

	private static final Logger logger = LoggerFactory.getLogger(ExcelUtil.class);
	

	/**
	 * 用来验证excel与Vo中的类型是否一致 <br>
	 * Map<栏位类型,只能是哪些Cell类型>
	 */
	private static Map<Class<?>, Integer[]> validateMap = new HashMap<Class<?>, Integer[]>();

	static {
		validateMap.put(String[].class, new Integer[] { Cell.CELL_TYPE_STRING });
		validateMap.put(Double[].class, new Integer[] { Cell.CELL_TYPE_NUMERIC });
		validateMap.put(String.class, new Integer[] { Cell.CELL_TYPE_STRING });
		validateMap.put(Double.class, new Integer[] { Cell.CELL_TYPE_NUMERIC });
		validateMap.put(Date.class, new Integer[] { Cell.CELL_TYPE_NUMERIC, Cell.CELL_TYPE_STRING });
		validateMap.put(Integer.class, new Integer[] { Cell.CELL_TYPE_NUMERIC });
		validateMap.put(Float.class, new Integer[] { Cell.CELL_TYPE_NUMERIC });
		validateMap.put(Long.class, new Integer[] { Cell.CELL_TYPE_NUMERIC });
		validateMap.put(Boolean.class, new Integer[] { Cell.CELL_TYPE_BOOLEAN });
	}

	/**
	 * 获取cell类型的文字描述
	 *
	 * @param cellType
	 * 
	 *            <pre>
	 * Cell.CELL_TYPE_BLANK
	 * Cell.CELL_TYPE_BOOLEAN
	 * Cell.CELL_TYPE_ERROR
	 * Cell.CELL_TYPE_FORMULA
	 * Cell.CELL_TYPE_NUMERIC
	 * Cell.CELL_TYPE_STRING
	 *            </pre>
	 * 
	 * @return
	 */
	private static String getCellTypeByInt(int cellType) {
		switch (cellType) {
			case Cell.CELL_TYPE_BLANK:
				return "Null type";
			case Cell.CELL_TYPE_BOOLEAN:
				return "Boolean type";
			case Cell.CELL_TYPE_ERROR:
				return "Error type";
			case Cell.CELL_TYPE_FORMULA:
				return "Formula type";
			case Cell.CELL_TYPE_NUMERIC:
				return "Numeric type";
			case Cell.CELL_TYPE_STRING:
				return "String type";
			default:
				return "Unknown type";
		}
	}

	/**
	 * 获取单元格值
	 *
	 * @param cell
	 * @return
	 */
	private static Object getCellValue(Cell cell) {
		if (cell == null
				|| (cell.getCellType() == Cell.CELL_TYPE_STRING && StringUtils.isBlank(cell.getStringCellValue()))) {
			return null;
		}
		int cellType = cell.getCellType();
		switch (cellType) {
			case Cell.CELL_TYPE_BLANK:
				return null;
			case Cell.CELL_TYPE_BOOLEAN:
				return cell.getBooleanCellValue();
			case Cell.CELL_TYPE_ERROR:
				return cell.getErrorCellValue();
			case Cell.CELL_TYPE_FORMULA:
				return cell.getNumericCellValue();
			case Cell.CELL_TYPE_NUMERIC:
				return cell.getNumericCellValue();
			case Cell.CELL_TYPE_STRING:
				return cell.getStringCellValue();
			default:
				return null;
		}
	}

	/**
	 * @Title: exportExcel
	 * @Description: 输出
	 * @return: void
	 * @author: peng.wu
	 * @date: 2014年12月16日 下午6:00:49
	 */
	public static <T> void exportExcel(String sheetName, String[] headers, String[] propertys, Collection<T> dataset,
			OutputStream out, HttpServletRequest request, HttpServletResponse response) {
		exportExcel(sheetName, headers, propertys, dataset, out, null, request, response);
	}

	/**
	 * @Title: exportExcel
	 * @Description: out 如果有时间数据，设定输出格式。默认为"yyy-MM-dd"
	 * @return: void
	 * @author: peng.wu
	 * @date: 2014年12月16日 下午6:01:13
	 */
	public static <T> void exportExcel(String sheetName, String[] headers, String[] propertys, Collection<T> dataset,
			OutputStream out, String pattern, HttpServletRequest request, HttpServletResponse response) {
		Workbook workbook = new XSSFWorkbook();
		Map<String, CellStyle> mapCellStyle = cellStyle(workbook);
		Sheet sheet = workbook.createSheet(sheetName + System.currentTimeMillis());
		writeToSheet(workbook, sheet, sheetName, headers, propertys, dataset, pattern, mapCellStyle);
		exprot(workbook, request, response, out, sheetName);
	}

	/**
	 * @Title: exportHandle
	 * @Description: 导出处理
	 * @return: void
	 * @author: peng.wu
	 * @date: 2014年12月16日 下午2:26:25
	 */
	public static void exportHandle(IBaseExport base, HttpServletRequest request, HttpServletResponse response,
									Map<String, Object> maps, String[] summary_header, String[] summary_property, String sheetName) {
		List<Map<String, Object>> datas = new ArrayList<Map<String, Object>>();
		int rows = 10000, page = 1, offset = 0, endset = 0;

		Long total = base.total(maps);
		Long flag = total / rows;
		for (int i = 0; i <= flag; i++) {
			if (page == 1)
				offset = 1;
			else
				offset = (page - 1) * rows + 1;
			endset = page * rows;
			maps.put("offset", offset);
			maps.put("endset", endset);
			datas.addAll(base.exportPage(maps));
			page++;
			if (total % rows == 0 && i == flag - 1)
				break;
		}

		try {
			OutputStream out = response.getOutputStream();
			exportExcel(sheetName, summary_header, summary_property, datas, out, request, response);
			out.flush();
			out.close();
		}
		catch (FileNotFoundException e) {
			throw new BaseRuntimeException("error with to exportHandle FileNotFoundException");
		}
		catch (IOException e) {
			throw new BaseRuntimeException("error with to exportHandle IOException");
		}
	}

	/**
	 * @Title: exprot
	 * @Description: 导出
	 * @return: void
	 * @author: peng.wu
	 * @date: 2014年12月10日 下午10:12:07
	 */
	public static void exprot(Workbook wb, HttpServletRequest request, HttpServletResponse response, OutputStream out,
			String fname) {
		try {

			// String fileName = URLEncoder.encode(fname +
			// System.currentTimeMillis() + ".xlsx", "UTF-8");
			String fileName = fname + ".xlsx";
			// 设置要显示在保存窗口的文件名，如果文件名中有中文的话，则要设置字符集
			if (request.getHeader("User-Agent").toUpperCase().indexOf("MSIE") > 0) {
				fileName = java.net.URLEncoder.encode(fileName, "UTF-8");
			}
			else {
				fileName = new String(fileName.getBytes("utf-8"), "ISO8859-1");
			}

			// response.setContentType("Application/msexcel");
			// response.setContentType("bin");
			response.setContentType("application/vnd.ms-excel;charset=utf-8");
			response.setHeader("Content-Disposition", "attachment; filename=".concat(fileName));
			// response.setHeader("Connection", "close");
			// response.setHeader("Content-Type", "application/vnd.ms-excel");

			wb.write(out);
		}
		catch (IOException e) {
			logger.debug("exportExcel IOException: [{}]", e.getLocalizedMessage());
		}
	}

	/**
	 * @param <T>
	 * @param sheets
	 *            {@link ExcelSheet}的集合
	 * @param out
	 *            与输出设备关联的流对象，可以将EXCEL文档导出到本地文件或者网络中
	 */
	public static <T> void exportExcel(List<ExcelSheet<T>> sheets, String sheetName, String[] propertys,
									   HttpServletRequest request, HttpServletResponse response, OutputStream out) {
		exportExcel(sheets, sheetName, propertys, request, response, out, null);
	}

	/**
	 * @param <T>
	 * @param sheets
	 *            {@link ExcelSheet}的集合
	 * @param out
	 *            与输出设备关联的流对象，可以将EXCEL文档导出到本地文件或者网络中
	 * @param pattern
	 *            如果有时间数据，设定输出格式。默认为"yyy-MM-dd"
	 */
	public static <T> void exportExcel(List<ExcelSheet<T>> sheets, String sheetName, String[] propertys,
			HttpServletRequest request, HttpServletResponse response, OutputStream out, String pattern) {
		if (CollectionUtils.isEmpty(sheets)) {
			return;
		}
		// 声明一个工作薄
		// Workbook workbook = new XSSFWorkbook();
		SXSSFWorkbook workbook = new SXSSFWorkbook(200000);
		Map<String, CellStyle> mapCellStyle = cellStyle(workbook);
		for (ExcelSheet<T> sheet : sheets) {
			// 生成一个表格
			Sheet hssfSheet = workbook.createSheet(sheet.getSheetName());
			writeToSheet(workbook, hssfSheet, sheetName, sheet.getHeaders(), propertys, sheet.getDataset(), pattern,
					mapCellStyle);
		}
		exprot(workbook, request, response, out, sheetName);
	}

	/**
	 * @Title: cellStyle
	 * @Description: 样式
	 * @return: Map<String,CellStyle>
	 * @author: peng.wu
	 * @date: 2014年12月16日 上午9:45:47
	 */
	public static Map<String, CellStyle> cellStyle(Workbook wb) {

		Map<String, CellStyle> mapCellStyle = new HashMap<String, CellStyle>();
		CellStyle title_css = wb.createCellStyle();
		CellStyle header_css = wb.createCellStyle();
		CellStyle body_css = wb.createCellStyle();
		// DataFormat df = wb.createDataFormat();

		Font title_f = wb.createFont();
		Font header_f = wb.createFont();
		Font body_f = wb.createFont();

		title_f.setFontHeightInPoints((short) 15);
		title_f.setBoldweight(Font.BOLDWEIGHT_BOLD);

		title_css.setFont(title_f);
		title_css.setVerticalAlignment(CellStyle.VERTICAL_CENTER);// 垂直居中
		title_css.setAlignment(CellStyle.ALIGN_CENTER);// 水平居中

		header_f.setFontHeightInPoints((short) 10);
		header_f.setColor(IndexedColors.BLACK.getIndex());
		header_f.setBoldweight(Font.BOLDWEIGHT_BOLD);

		header_css.setFont(header_f);
		header_css.setBorderLeft(CellStyle.BORDER_THIN);
		header_css.setBorderRight(CellStyle.BORDER_THIN);
		header_css.setBorderTop(CellStyle.BORDER_THIN);
		header_css.setBorderBottom(CellStyle.BORDER_THIN);
		header_css.setFillForegroundColor(IndexedColors.AQUA.getIndex());
		header_css.setFillPattern(CellStyle.SOLID_FOREGROUND);
		header_css.setVerticalAlignment(CellStyle.VERTICAL_CENTER);// 垂直居中
		header_css.setAlignment(CellStyle.ALIGN_CENTER);// 水平居中
		// cs.setDataFormat(df.getFormat("#,##0.0"));

		body_f.setFontHeightInPoints((short) 10);
		body_f.setColor(IndexedColors.BLACK.getIndex());
		// body_f.setBoldweight(Font.BOLDWEIGHT_BOLD);

		body_css.setFont(body_f);
		body_css.setBorderLeft(CellStyle.BORDER_THIN);
		body_css.setBorderRight(CellStyle.BORDER_THIN);
		body_css.setBorderTop(CellStyle.BORDER_THIN);
		body_css.setBorderBottom(CellStyle.BORDER_THIN);
		// cs2.setDataFormat(df.getFormat("text"));

		mapCellStyle.put("TITLE_CSS", title_css);
		mapCellStyle.put("HEADER_CSS", header_css);
		mapCellStyle.put("BODY_CSS", body_css);

		return mapCellStyle;
	}

	/**
	 * 每个sheet的写入
	 *
	 * @param sheet
	 *            页签
	 * @param headers
	 *            表头
	 * @param dataset
	 *            数据集合
	 * @param pattern
	 *            日期格式
	 */
	private static <T> void writeToSheet(Workbook workbook, Sheet sheet, String sheetName, String[] headers,
			String[] propertys, Collection<T> dataset, String pattern, Map<String, CellStyle> mapCellStyle) {

		Row row = sheet.createRow(0);
		buildExcelHeader(sheetName, headers, mapCellStyle, sheet, row);

		Iterator<T> it = dataset.iterator(); // 遍历集合数据，产生数据行
		int index = 1, maxRowLength = 50000;
		while (it.hasNext()) {
			index++;
			row = sheet.createRow(index);
			T obj = (T) it.next();
			try {
				if (obj instanceof Map) {
					@SuppressWarnings("unchecked")
					Map<String, Object> map = (Map<String, Object>) obj;
					int cellNum = 0;

					for (String property : propertys) {
						if (map.containsKey(property) == false) {
							logger.error("dataset Map 中不存在 key [" + property + "]");
							throw new BaseRuntimeException("属性 <" + property + "> 不存在");
						}
						Cell cell = null;
						if (sheet.getLastRowNum() == maxRowLength) {
							sheet = workbook.createSheet(sheetName + System.currentTimeMillis());
							row = sheet.createRow(0);
							for (int i = 0; i < headers.length; i++) {
								cell = row.createCell(i);
								XSSFRichTextString text = new XSSFRichTextString(headers[i]);
								cell.setCellStyle(mapCellStyle.get("HEADER_CSS"));
								cell.setCellValue(text);
								sheet.setColumnWidth(i, (headers[i].getBytes().length) * 456);
							}
							cellNum = 0;
							index = 1;
							row = sheet.createRow(index);
						}

						Object value = map.get(property);
						cell = row.createCell(cellNum);
						cell.setCellStyle(mapCellStyle.get("BODY_CSS"));
						cell.setCellValue(String.valueOf(value));
						sheet.setColumnWidth(cellNum, (propertys[cellNum].getBytes().length) * 356);

						cellNum++;
					}
				}
				else {
					List<FieldForSortting> fields = sortFieldByAnno(obj.getClass());
					int cellNum = 0;
					for (int i = 0; i < fields.size(); i++) {
						Cell cell = row.createCell(cellNum);
						Field field = fields.get(i).getField();
						field.setAccessible(true);
						Object value = field.get(obj);
						String textValue = null;
						if (value instanceof Integer) {
							int intValue = (Integer) value;
							cell.setCellValue(intValue);
						}
						else if (value instanceof Float) {
							float fValue = (Float) value;
							cell.setCellValue(fValue);
						}
						else if (value instanceof Double) {
							double dValue = (Double) value;
							cell.setCellValue(dValue);
						}
						else if (value instanceof Long) {
							long longValue = (Long) value;
							cell.setCellValue(longValue);
						}
						else if (value instanceof Boolean) {
							boolean bValue = (Boolean) value;
							cell.setCellValue(bValue);
						}
						else if (value instanceof Date) {
							Date date = (Date) value;
							SimpleDateFormat sdf = new SimpleDateFormat(pattern);
							textValue = sdf.format(date);
						}
						else if (value instanceof String[]) {
							String[] strArr = (String[]) value;
							for (int j = 0; j < strArr.length; j++) {
								String str = strArr[j];
								cell.setCellValue(str);
								if (j != strArr.length - 1) {
									cellNum++;
									cell = row.createCell(cellNum);
								}
							}
						}
						else if (value instanceof Double[]) {
							Double[] douArr = (Double[]) value;
							for (int j = 0; j < douArr.length; j++) {
								Double val = douArr[j];
								// 资料不为空则set Value
								if (val != null) {
									cell.setCellValue(val);
								}

								if (j != douArr.length - 1) {
									cellNum++;
									cell = row.createCell(cellNum);
								}
							}
						}
						else {
							// 其它数据类型都当作字符串简单处理
							String empty = StringUtils.EMPTY;
							ExcelCell anno = field.getAnnotation(ExcelCell.class);
							if (anno != null) {
								empty = anno.defaultValue();
							}
							textValue = value == null ? empty : value.toString();
						}
						if (textValue != null) {
							XSSFRichTextString richString = new XSSFRichTextString(textValue);
							cell.setCellValue(richString);
						}
						cellNum++;
					}
				}
			}
			catch (Exception e) {
				logger.error("ExcelUtil error with to writeToSheet :[{}]", e.getLocalizedMessage());
			}
		}
	}

	public static void setXlsHeader(Sheet sheet, Row row, String[] headers, Map<String, CellStyle> mapCellStyle) {

		for (int i = 0; i < headers.length; i++) {
			Cell cell = row.createCell(i);
			row.setHeight((short) 700);
			cell = row.createCell(i);
			cell.setCellStyle(mapCellStyle.get("TITLE_CSS"));
			row.getCell(0).setCellValue("出库统计");
			sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, headers.length - 1));
		}

		row = sheet.createRow(1);
		for (int i = 0; i < headers.length; i++) {
			Cell cell = row.createCell(i);
			XSSFRichTextString text = new XSSFRichTextString(headers[i]);
			cell.setCellStyle(mapCellStyle.get("HEADER_CSS"));
			cell.setCellValue(text);
			sheet.setColumnWidth(i, (headers[i].getBytes().length) * 456);
		}
	}

	/**
	 * 把Excel的数据封装成voList
	 *
	 * @param clazz
	 *            vo的Class
	 * @param inputStream
	 *            excel输入流
	 * @param pattern
	 *            如果有时间数据，设定输入格式。默认为"yyy-MM-dd"
	 * @param logs
	 *            错误log集合
	 * @param arrayCount
	 *            如果vo中有数组类型,那就按照index顺序,把数组应该有几个值写上.
	 * @return voList
	 * @throws RuntimeException
	 */
	@SuppressWarnings("unchecked")
	public static <T> Collection<T> importExcel(Class<T> clazz, InputStream inputStream, String pattern, ExcelLogs logs,
			Integer... arrayCount) {
		Workbook workBook = null;
		try {
			workBook = new XSSFWorkbook(inputStream);
		}
		catch (IOException e) {
			logger.error("ExcelUtil error with to importExcel :[{}]", e.getLocalizedMessage());
		}
		List<T> list = new ArrayList<T>();
		Sheet sheet = workBook.getSheetAt(0);
		Iterator<Row> rowIterator = sheet.rowIterator();
		try {
			List<ExcelLog> logList = new ArrayList<ExcelLog>();
			// Map<title,index>
			Map<String, Integer> titleMap = new HashMap<String, Integer>();

			while (rowIterator.hasNext()) {
				Row row = rowIterator.next();
				if (row.getRowNum() == 0) {
					if (clazz == Map.class) {
						// 解析map用的key,就是excel标题行
						Iterator<Cell> cellIterator = row.cellIterator();
						Integer index = 0;
						while (cellIterator.hasNext()) {
							String value = cellIterator.next().getStringCellValue();
							titleMap.put(value, index);
							index++;
						}
					}
					continue;
				}
				// 整行都空，就跳过
				boolean allRowIsNull = true;
				Iterator<Cell> cellIterator = row.cellIterator();
				while (cellIterator.hasNext()) {
					Object cellValue = getCellValue(cellIterator.next());
					if (cellValue != null) {
						allRowIsNull = false;
						break;
					}
				}
				if (allRowIsNull) {
					logger.warn("Excel row " + row.getRowNum() + " all row value is null!");
					continue;
				}
				T t = null;
				StringBuilder log = new StringBuilder();
				if (clazz == Map.class) {
					Map<String, Object> map = new HashMap<String, Object>();
					for (String k : titleMap.keySet()) {
						Integer index = titleMap.get(k);
						String value = row.getCell(index).getStringCellValue();
						map.put(k, value);
					}
					list.add((T) map);

				}
				else {
					t = clazz.newInstance();
					int arrayIndex = 0;// 标识当前第几个数组了
					int cellIndex = 0;// 标识当前读到这一行的第几个cell了
					List<FieldForSortting> fields = sortFieldByAnno(clazz);
					for (FieldForSortting ffs : fields) {
						Field field = ffs.getField();
						field.setAccessible(true);
						if (field.getType().isArray()) {
							Integer count = arrayCount[arrayIndex];
							Object[] value = null;
							if (field.getType().equals(String[].class)) {
								value = new String[count];
							}
							else {
								// 目前只支持String[]和Double[]
								value = new Double[count];
							}
							for (int i = 0; i < count; i++) {
								Cell cell = row.getCell(cellIndex);
								String errMsg = validateCell(cell, field, cellIndex);
								if (StringUtils.isBlank(errMsg)) {
									value[i] = getCellValue(cell);
								}
								else {
									log.append(errMsg);
									log.append(";");
									logs.setHasError(true);
								}
								cellIndex++;
							}
							field.set(t, value);
							arrayIndex++;
						}
						else {
							Cell cell = row.getCell(cellIndex);
							String errMsg = validateCell(cell, field, cellIndex);
							if (StringUtils.isBlank(errMsg)) {
								Object value = null;
								// 处理特殊情况,Excel中的String,转换成Bean的Date
								if (field.getType().equals(Date.class) && cell.getCellType() == Cell.CELL_TYPE_STRING) {
									Object strDate = getCellValue(cell);
									try {
										value = new SimpleDateFormat(pattern).parse(strDate.toString());
									}
									catch (ParseException e) {

										errMsg = MessageFormat.format("the cell [{0}] can not be converted to a date ",
												CellReference.convertNumToColString(cell.getColumnIndex()));
									}
								}
								else {
									value = getCellValue(cell);
									// 处理特殊情况,excel的value为String,且bean中为其他,且defaultValue不为空,那就=defaultValue
									ExcelCell annoCell = field.getAnnotation(ExcelCell.class);
									if (value instanceof String && !field.getType().equals(String.class)
											&& StringUtils.isNotBlank(annoCell.defaultValue())) {
										value = annoCell.defaultValue();
									}
								}
								field.set(t, value);
							}
							if (StringUtils.isNotBlank(errMsg)) {
								log.append(errMsg);
								log.append(";");
								logs.setHasError(true);
							}
							cellIndex++;
						}
					}
					list.add(t);
					logList.add(new ExcelLog(t, log.toString(), row.getRowNum() + 1));
				}
			}
			logs.setLogList(logList);
		}
		catch (InstantiationException e) {
			throw new RuntimeException(MessageFormat.format("can not instance class:{0}", clazz.getSimpleName()), e);
		}
		catch (IllegalAccessException e) {
			throw new RuntimeException(MessageFormat.format("can not instance class:{0}", clazz.getSimpleName()), e);
		}
		return list;
	}

	/**
	 * 验证Cell 类型是否正确
	 *
	 * @param cell
	 *            单元格
	 * @param field
	 *            栏位
	 * @param cellNum
	 *            第几个栏位 ，用于errMsg
	 * @return
	 */
	private static String validateCell(Cell cell, Field field, int cellNum) {
		String columnName = CellReference.convertNumToColString(cellNum);
		String result = null;
		Integer[] integers = validateMap.get(field.getType());
		if (integers == null) {
			result = MessageFormat.format("Unsupported type [{0}]", field.getType().getSimpleName());
			return result;
		}
		ExcelCell annoCell = field.getAnnotation(ExcelCell.class);
		if (cell == null
				|| (cell.getCellType() == Cell.CELL_TYPE_STRING && StringUtils.isBlank(cell.getStringCellValue()))) {
			if (annoCell != null && annoCell.valid().allowNull() == false) {
				result = MessageFormat.format("the cell [{0}] can not null", columnName);
			} ;
		}
		else if (cell.getCellType() == Cell.CELL_TYPE_BLANK && annoCell.valid().allowNull()) {
			return result;
		}
		else {
			List<Integer> cellTypes = Arrays.asList(integers);

			// 如果类型不在指定范围内，并且没有默认值
			if (!(cellTypes.contains(cell.getCellType()))
					|| StringUtils.isNotBlank(annoCell.defaultValue()) && cell.getCellType() == Cell.CELL_TYPE_STRING) {
				StringBuilder strType = new StringBuilder();
				for (int i = 0; i < cellTypes.size(); i++) {
					Integer intType = cellTypes.get(i);
					strType.append(getCellTypeByInt(intType));
					if (i != cellTypes.size() - 1) {
						strType.append(",");
					}
				}
				result = MessageFormat.format("the cell [{0}] type must [{1}]", columnName, strType.toString());
			}
			else {
				// 类型符合验证,但值不在要求范围内的
				// String in
				if (annoCell.valid().in().length != 0 && cell.getCellType() == Cell.CELL_TYPE_STRING) {
					String[] in = annoCell.valid().in();
					String cellValue = cell.getStringCellValue();
					boolean isIn = false;
					for (String str : in) {
						if (str.equals(cellValue)) {
							isIn = true;
						}
					}
					if (!isIn) {
						result = MessageFormat.format("the cell [{0}] value must in {1}", columnName, in);
					}
				}
				// 数字型
				if (cell.getCellType() == Cell.CELL_TYPE_NUMERIC) {
					double cellValue = cell.getNumericCellValue();
					// 小于
					if (!Double.isNaN(annoCell.valid().lt())) {
						if (!(cellValue < annoCell.valid().lt())) {
							result = MessageFormat.format("the cell [{0}] value must less than [{1}]", columnName,
									annoCell.valid().lt());
						}
					}
					// 大于
					if (!Double.isNaN(annoCell.valid().gt())) {
						if (!(cellValue > annoCell.valid().gt())) {
							result = MessageFormat.format("the cell [{0}] value must greater than [{1}]", columnName,
									annoCell.valid().gt());
						}
					}
					// 小于等于
					if (!Double.isNaN(annoCell.valid().le())) {
						if (!(cellValue <= annoCell.valid().le())) {
							result = MessageFormat.format("the cell [{0}] value must less than or equal [{1}]",
									columnName, annoCell.valid().le());
						}
					}
					// 大于等于
					if (!Double.isNaN(annoCell.valid().ge())) {
						if (!(cellValue >= annoCell.valid().ge())) {
							result = MessageFormat.format("the cell [{0}] value must greater than or equal [{1}]",
									columnName, annoCell.valid().ge());
						}
					}
				}
			}
		}
		return result;
	}

	/**
	 * 根据annotation的seq排序后的栏位
	 *
	 * @param clazz
	 * @return
	 */
	private static List<FieldForSortting> sortFieldByAnno(Class<?> clazz) {
		Field[] fieldsArr = clazz.getDeclaredFields();
		List<FieldForSortting> fields = new ArrayList<FieldForSortting>();
		List<FieldForSortting> annoNullFields = new ArrayList<FieldForSortting>();
		for (Field field : fieldsArr) {
			// ExcelCell ec = field.getAnnotation(ExcelCell.class);
			// if (ec == null) {
			// // 没有ExcelCell Annotation 视为不汇入
			// continue;
			// }
			// int id = ec.index();
			// fields.add(new FieldForSortting(field, id));
			fields.add(new FieldForSortting(field));
		}
		fields.addAll(annoNullFields);
		sortByProperties(fields, true, false, "index");
		return fields;
	}

	@SuppressWarnings("unchecked")
	private static void sortByProperties(List<? extends Object> list, boolean isNullHigh, boolean isReversed,
			String... props) {
		if (CollectionUtils.isNotEmpty(list)) {
			Comparator<?> typeComp = ComparableComparator.getInstance();
			if (isNullHigh == true) {
				typeComp = ComparatorUtils.nullHighComparator(typeComp);
			}
			else {
				typeComp = ComparatorUtils.nullLowComparator(typeComp);
			}
			if (isReversed) {
				typeComp = ComparatorUtils.reversedComparator(typeComp);
			}

			List<Object> sortCols = new ArrayList<Object>();

			if (props != null) {
				for (String prop : props) {
					sortCols.add(new BeanComparator(prop, typeComp));
				}
			}
			if (sortCols.size() > 0) {
				Comparator<Object> sortChain = new ComparatorChain(sortCols);
				Collections.sort(list, sortChain);
			}
		}
	}

	/**
	 * @Title: export2Excel
	 * @Description:
	 * @return: void
	 * @author: shenghua.chen
	 * @date: 2015年1月5日 上午10:41:19
	 */
	public static void export2ExcelWithList(HttpServletRequest request, HttpServletResponse response, String[] t_header,
			String[] t_title, String t_name, List<Map<String, Object>> listData) {
		// 新建Workbook
		SXSSFWorkbook workbook = new SXSSFWorkbook(200000);
		buildWorkBook(workbook, t_name, t_header, t_title, listData);
		poiExcelExport(request, response, t_name, workbook);
	}

	/**
	 * @Title: poiExportExcel
	 * @Description: 导出Excel
	 * @return: void
	 * @author: shenghua.chen
	 * @date: 2015年1月5日 下午3:51:46
	 */
	public static void poiExcelExport(HttpServletRequest request, HttpServletResponse response, String t_name,
			SXSSFWorkbook workbook) {
		String t_time = DateFormatUtils.format(new Date(), "yyyyMMddHHmmss");
		// 创建导出excel名字
		String fileName = t_name + t_time + ".xls";
		OutputStream out = null;
		try {
			response.reset();
			out = response.getOutputStream();

			// 设置要显示在保存窗口的文件名，如果文件名中有中文的话，则要设置字符集
			if (request.getHeader("User-Agent").toUpperCase().indexOf("MSIE") > 0) {
				fileName = java.net.URLEncoder.encode(fileName, "UTF-8");
			}
			else {
				fileName = new String(fileName.getBytes("UTF-8"), "ISO8859-1");
			}
			// 设置要显示在保存窗口的文件名，如果文件名中有中文的话，则要设置字符集
			response.setHeader("Content-Type","application/msexcel");
			response.setContentType("application/vnd.ms-excel;charset=gb2312");
			response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
			workbook.write(out);
		}
		catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		catch (IOException e) {
			e.printStackTrace();
		}
		finally {
			if (null != out) {
				try {
					out.flush();
				}
				catch (IOException e) {
					e.printStackTrace();
				}
			}
			if (null != out) {
				try {
					out.close();
				}
				catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

	/**
	 * @Title: buildWorkBook
	 * @Description:
	 * @return: void
	 * @author: shenghua.chen
	 * @date: 2015年1月5日 上午10:46:32
	 */
	private static void buildWorkBook(Workbook workbook, String t_name, String[] t_header, String[] t_title,
			List<Map<String, Object>> listData) {
		// 工作簿样式
		Map<String, CellStyle> mapCellStyle = cellStyle(workbook);
		// 首先创建一个sheet
		Sheet sheet = workbook.createSheet(t_name + System.currentTimeMillis());
		// 创建首行，写表名
		Row row = sheet.createRow(0);
		buildExcelHeader(t_name, t_header, mapCellStyle, sheet, row);
		Cell cell = null;
		// 创建数据体,第二行开始写数据体
		int r_num = 2;
		for (int i = 0; i < listData.size(); i++) {
			// 每50000条数据创建一个新的sheet
			if (i > 0 && i % 20000 == 0) {
				sheet = workbook.createSheet(t_name + System.currentTimeMillis());
				// 创建首行，写表名，行号归起始位置
				row = sheet.createRow(0);
				buildExcelHeader(t_name, t_header, mapCellStyle, sheet, row);
				r_num = 2;
			}
			row = sheet.createRow(r_num);
			Map<String, Object> map = listData.get(i);
			for (int j = 0; j < t_title.length; j++) {
				cell = row.createCell(j);
				cell.setCellValue(String.valueOf(map.get(t_title[j])));
				cell.setCellStyle(mapCellStyle.get("BODY_CSS"));
			}
			r_num++;
		}
	}

	/**
	 * @Title: buildExcelHeader
	 * @Description:
	 * @return: void
	 * @author: shenghua.chen
	 * @date: 2015年1月5日 下午2:33:57
	 */
	public static void buildExcelHeader(String t_name, String[] t_header, Map<String, CellStyle> mapCellStyle,
			Sheet sheet, Row row) {
		for (int i = 0; i < t_header.length; i++) {
			Cell cell = row.createCell(i);
			row.setHeight((short) 700);
			cell = row.createCell(i);
			cell.setCellStyle(mapCellStyle.get("TITLE_CSS"));
			row.getCell(0).setCellValue(t_name);
		}
		sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, t_header.length - 1));
		// 第二行写表各个列名字
		row = sheet.createRow(1);
		for (int i = 0; i < t_header.length; i++) {
			Cell cell = row.createCell(i);
			XSSFRichTextString text = new XSSFRichTextString(t_header[i]);
			cell.setCellStyle(mapCellStyle.get("HEADER_CSS"));
			cell.setCellValue(text);
			sheet.setColumnWidth(i, (t_header[i].getBytes().length) * 456);
		}
	}

	/**
	 * @Title: export2Excel
	 * @Description: excel poi 导出
	 * @return: void
	 * @author: shenghua.chen
	 * @date: 2015年1月5日 下午4:28:38
	 * @param base
	 *            serviceName
	 * @param params
	 *            请求参数
	 * @param t_header
	 *            字段名中文显示集合
	 * @param t_title
	 *            字段名英文集合
	 * @param t_name
	 *            表名
	 */
	public static void export2Excel(IBaseExport base, HttpServletRequest request, HttpServletResponse response,
			Map<String, Object> params, String[] t_header, String[] t_title, String t_name) {
		
		//begin Add for UMS
		CommUserModel user = CommonParamUtil.getUserFromSession(request);
		if (null != user) {
			//params.put("user", user);
			params.put("userid", user.getUserId());
			//CommonParamUtil.selectParam(params);
			Long warehouseID = (Long) params.get("currentWarehouseId");
			params.put("warehouseID", warehouseID == null ? -1 : warehouseID);
			params.put("siteId", warehouseID == null ? -1 : warehouseID);
			Long platform_ID = (Long) params.get("currentPlatFormId");
			params.put("platform_ID", platform_ID == null ? -1 : platform_ID);
			
		}
		// 每个sheet 显示行数
		int rowMax = 60000;
		// rows
		long rows = base.total(params);
		// 每页大小
		long pageSize = rowMax;
		long page = 1;
		if (rowMax < rows && rows % pageSize != 0) {
			// 页数
			page = rows / pageSize + 1;
		}
		// 创建工作簿
		SXSSFWorkbook workbook = new SXSSFWorkbook(200000);
		// 设置字体和单元格样式
		Map<String, CellStyle> mapCellStyle = cellStyle(workbook);

		// 创建第一个sheet（页），并命名
		Sheet sheet = workbook.createSheet(t_name + System.currentTimeMillis());
		// 创建第一行
		Row row = sheet.createRow((short) 0);
		// 创建表头
		buildExcelHeader(t_name, t_header, mapCellStyle, sheet, row);
		// 构造数据体cell
		Cell cell = null;
		// 数据体标记,去除表头和字段名
		int flag = 1;
		for (int i = 1; i <= page; i++) {
			// 根据每个工作簿显示数量分批次获取数据并进行处理
			long offset = (i - 1) * pageSize;
			long endset = i * pageSize - 1;
			params.put("offset", Long.valueOf(offset));
			params.put("endset", Long.valueOf(endset));
			params.put("user", user);
			Long mySqlOffset = 0l;
			if(i >= 1){
            	mySqlOffset = (i - 1) * pageSize;
            }
			params.put("mySqlOffset", mySqlOffset);
			params.put("rows", pageSize);
			
			//CommonParamUtil.selectParam(params);
			// 获得要导出的数据集
			List<Map<String, Object>> datas = base.exportPage(params);
			for (int rownum = 0; rownum < datas.size(); rownum++) {
				Map<String, Object> map = datas.get(rownum);
				// 大于 每个sheet 最大值
				if (flag > rowMax) {
					flag = 1;
					// 创建新的工作簿
					sheet = workbook.createSheet(t_name + System.currentTimeMillis());
					row = sheet.createRow((short) 0);
					buildExcelHeader(t_name, t_header, mapCellStyle, sheet, row);
				}
				// 填充数据体
				row = sheet.createRow(flag + 1);
				for (int j = 0; j < t_title.length; j++) {
					cell = row.createCell(j);
					// 去除空
					String str = "-";
					if (null != map.get(t_title[j]) && !"".equals(map.get(t_title[j]))) {
						str = String.valueOf(map.get(t_title[j]));
						str = formatCommonStr(str);
					}
					cell.setCellValue(str);
					cell.setCellStyle(mapCellStyle.get("BODY_CSS"));
				}
				flag++;
			}
		}
		// 导出excel
		poiExcelExport(request, response, t_name, workbook);
	}
	
	/**
	 * @Title export2ExcelWithTotal
	 * @Description 制定total长度
	 * @param base
	 * @param request
	 * @param response
	 * @param params
	 * @param t_header
	 * @param t_title
	 * @param t_name
	 * @param rowLength
	 * @author rui.wei
	 * @date 2016年11月2日 下午1:43:37
	 */
	public static void export2ExcelWithTotal(IBaseExport base, HttpServletRequest request, HttpServletResponse response,
			Map<String, Object> params, String[] t_header, String[] t_title, String t_name,int rowLength) {
		// 每个sheet 显示行数
		int rowMax = 60000;
		// rows
		long rows = rowLength;
		// 每页大小
		long pageSize = rowMax;
		long page = 1;
		if (rowMax < rows && rows % pageSize != 0) {
			// 页数
			page = rows / pageSize + 1;
		}
		// 创建工作簿
		SXSSFWorkbook workbook = new SXSSFWorkbook(200000);
		// 设置字体和单元格样式
		Map<String, CellStyle> mapCellStyle = cellStyle(workbook);

		// 创建第一个sheet（页），并命名
		Sheet sheet = workbook.createSheet(t_name + System.currentTimeMillis());
		// 创建第一行
		Row row = sheet.createRow((short) 0);
		// 创建表头
		buildExcelHeader(t_name, t_header, mapCellStyle, sheet, row);
		// 构造数据体cell
		Cell cell = null;
		// 数据体标记,去除表头和字段名
		int flag = 1;
		for (int i = 1; i <= page; i++) {
			// 根据每个工作簿显示数量分批次获取数据并进行处理
			long offset = (i - 1) * pageSize;
			long endset = i * pageSize - 1;
			params.put("offset", Long.valueOf(offset));
			params.put("endset", Long.valueOf(endset));
			Long mySqlOffset = 0l;
			if(i >= 1){
            	mySqlOffset = (i - 1) * pageSize;
            }
			params.put("mySqlOffset", mySqlOffset);
			params.put("rows", pageSize);
			
			//CommonParamUtil.selectParam(params);
			// 获得要导出的数据集
			List<Map<String, Object>> datas = base.exportPage(params);
			for (int rownum = 0; rownum < datas.size(); rownum++) {
				Map<String, Object> map = datas.get(rownum);
				// 大于 每个sheet 最大值
				if (flag > rowMax) {
					flag = 1;
					// 创建新的工作簿
					sheet = workbook.createSheet(t_name + System.currentTimeMillis());
					row = sheet.createRow((short) 0);
					buildExcelHeader(t_name, t_header, mapCellStyle, sheet, row);
				}
				// 填充数据体
				row = sheet.createRow(flag + 1);
				for (int j = 0; j < t_title.length; j++) {
					cell = row.createCell(j);
					// 去除空
					String str = "-";
					if (null != map.get(t_title[j]) && !"".equals(map.get(t_title[j]))) {
						str = String.valueOf(map.get(t_title[j]));
						str = formatCommonStr(str);
					}
					cell.setCellValue(str);
					cell.setCellStyle(mapCellStyle.get("BODY_CSS"));
				}
				flag++;
			}
		}
		// 导出excel
		poiExcelExport(request, response, t_name, workbook);
	}
	
	
	public static void export2ExcelNew(IBaseExport base, HttpServletRequest request, HttpServletResponse response,
			Map<String, Object> params, String[] t_header, String[] t_title, String t_name) {
		// 每个sheet 显示行数
		int rowMax = 60000;
		// rows
		long rows = base.total(params);
		// 每页大小
		long pageSize = rowMax;
		long page = 1;
		if (rowMax < rows && rows % pageSize != 0) {
			// 页数
			page = rows / pageSize + 1;
		}
		// 创建工作簿
		SXSSFWorkbook workbook = new SXSSFWorkbook(200000);
		// 设置字体和单元格样式
		Map<String, CellStyle> mapCellStyle = cellStyle(workbook);

		// 创建第一个sheet（页），并命名
		Sheet sheet = workbook.createSheet(t_name + System.currentTimeMillis());
		// 创建第一行
		Row row = sheet.createRow((short) 0);
		// 创建表头
		buildExcelHeader(t_name, t_header, mapCellStyle, sheet, row);
		// 构造数据体cell
		Cell cell = null;
		// 数据体标记,去除表头和字段名
		int flag = 1;
		for (int i = 1; i <= page; i++) {
			// 根据每个工作簿显示数量分批次获取数据并进行处理
			long offset = (i - 1) * pageSize;
			long endset = i * pageSize - 1;
			params.put("offset", Long.valueOf(offset));
			params.put("endset", Long.valueOf(endset));
			// 获得要导出的数据集
			List<Map<String, Object>> datas = base.exportPage(params);
			for (int rownum = 0; rownum < datas.size(); rownum++) {
				Map<String, Object> map = datas.get(rownum);
				// 大于 每个sheet 最大值
				if (flag > rowMax) {
					flag = 1;
					// 创建新的工作簿
					sheet = workbook.createSheet(t_name + System.currentTimeMillis());
					row = sheet.createRow((short) 0);
					buildExcelHeader(t_name, t_header, mapCellStyle, sheet, row);
				}
				// 填充数据体
				row = sheet.createRow(flag + 1);
				for (int j = 0; j < t_title.length; j++) {
					cell = row.createCell(j);
					// 去除空
					String str = "-";
					if (null != map.get(t_title[j]) && !"".equals(map.get(t_title[j]))) {
						str = String.valueOf(map.get(t_title[j]));
						str = formatCommonStr(str);
					}
					cell.setCellValue(str);
					cell.setCellStyle(mapCellStyle.get("BODY_CSS"));
				}
				flag++;
			}
		}
		// 导出excel

		poiExcelExport(request, response, t_name, workbook);
	}

	/**
	 *
	 * @Title: formatCommonStr
	 * @Description: 公共字符串统一处理
	 * @return: String
	 * @author: shenghua.chen
	 * @date: 2015年1月8日 上午10:45:17
	 */
	public static String formatCommonStr(String str) {
		if ("ENABLED".equalsIgnoreCase(str)) {
			str = "生效";
		}
		else if ("DISABLED".equalsIgnoreCase(str)) {
			str = "失效";
		}
		return str;
	}

	/**
	 * test begin
	 */

	/**
	 * 将一个 JavaBean 对象转化为一个 Map
	 *
	 * @param bean
	 *            要转化的JavaBean 对象
	 * @return 转化出来的 Map 对象
	 * @throws IntrospectionException
	 *             如果分析类属性失败
	 * @throws IllegalAccessException
	 *             如果实例化 JavaBean 失败
	 * @throws InvocationTargetException
	 *             如果调用属性的 setter 方法失败
	 */
	public static Map<String, Object> convertBean(Object bean) {
		Map<String, Object> returnMap = new HashMap<String, Object>();
		try {
			Class type = bean.getClass();
			String str = type.getName();
			String sb = str.substring(0, str.indexOf("$$"));
			Class<?> forName = null;
			try {
				forName = Class.forName(sb);
			}
			catch (ClassNotFoundException e1) {
				e1.printStackTrace();
			}
			// Field[] fieldlist = type.getDeclaredFields();
			// for (int i = 0; i < fieldlist.length; i++) {
			// Field f = fieldlist[i];
			// String name = f.getName();
			// String methodNme = changeStrToGetMethodNames(name);
			// Method meth = null;
			// Method[] mds = type.getDeclaredMethods();
			// for (int j = 0; j < mds.length; j++) {
			// if (mds[j].getName().equals(methodNme)) {
			// try {
			// meth = type.getMethod(methodNme);
			// } catch (SecurityException e) {
			// e.printStackTrace();
			// } catch (NoSuchMethodException e) {
			// e.printStackTrace();
			// }
			// Object rtcs = meth.invoke(bean, null);
			// returnMap.put(name, rtcs);
			// break;
			// }
			// }
			// if (meth == null) {
			// System.out.println("在" + bean.getClass().getName()
			// + "中没有找到" + methodNme + "方法");
			// }
			// }
			BeanInfo beanInfo = Introspector.getBeanInfo(forName);
			PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
			for (int i = 0; i < propertyDescriptors.length; i++) {
				PropertyDescriptor descriptor = propertyDescriptors[i];
				String propertyName = descriptor.getName();
				if (!propertyName.equals("class")) {
					Method readMethod = descriptor.getReadMethod();
					Object result = readMethod.invoke(bean, new Object[0]);
					if (result != null) {
						returnMap.put(propertyName, result);
					}
					else {
						returnMap.put(propertyName, "");
					}
				}
			}
		}
		catch (IllegalArgumentException e) {
			e.printStackTrace();
		}
		catch (IntrospectionException e) {
			e.printStackTrace();
		}
		catch (IllegalAccessException e) {
			e.printStackTrace();
		}
		catch (InvocationTargetException e) {
			e.printStackTrace();
		}
		return returnMap;
	}

	/**
	 * JavaBean转Map
	 *
	 * @param obj
	 * @return
	 */
	public static Map<String, Object> beanToMap(Object obj) {
		Map<String, Object> params = new HashMap<String, Object>(0);
		try {
			PropertyUtilsBean propertyUtilsBean = new PropertyUtilsBean();
			PropertyDescriptor[] descriptors = propertyUtilsBean.getPropertyDescriptors(obj);
			for (int i = 0; i < descriptors.length; i++) {
				String name = descriptors[i].getName();
				if (!StringUtils.equals(name, "class")) {
					params.put(name, propertyUtilsBean.getNestedProperty(obj, name));
				}
			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return params;
	}

	/**
	 * @Title: export2ExcelWithBean
	 * @Description: TEST
	 * @return: void
	 * @author: shenghua.chen
	 * @date: 2015年1月5日 下午5:00:20
	 */
	public static void export2ExcelWithBean(HttpServletRequest request, HttpServletResponse response,
			String[] wmsSerialNo_headers, String[] wmsSerialNo_propertys, String string, Collection<?> excelExport) {
		Iterator<?> it = excelExport.iterator(); // 遍历集合数据，产生数据行
		while (it.hasNext()) {
			Object obj = it.next();
			if (obj instanceof Map) {
				System.out.println("Map");
			}
			else {
				Map<String, Object> bean = convertBean(obj);
				// Map<String, Object> bean = beanToMap(obj);
				System.out.println(bean.toString());
			}
		}
	}

	/**
	 * @Title: changeStrToGetMethodNames
	 * @Description:
	 * @return: String
	 * @author: shenghua.chen
	 * @date: 2015年1月6日 上午9:17:21
	 */
	private static String changeStrToGetMethodNames(String str) {
		if (null == str || "".equals(str) || " ".equals(str)) {
			return null;
		}
		char firstChar = str.toCharArray()[0];
		String upstr = String.valueOf(firstChar).toUpperCase();
		return "get" + upstr + str.substring(1);
	}

	/**
	 *
	 * @Title: exportPackageStaticsExcel
	 * @Description: 复核打包统计页面导出
	 * @return: void
	 * @author: bing.jiang
	 * @date: 2015年1月12日 下午4:20:21
	 */
	public static void exportPackageStaticsExcel(IBaseExport base, HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> params, String[] t_header, String[] t_title,
			String t_name) {
		// 每个sheet 显示行数
		int rowMax = 60000;
		// rows
		long rows = base.total(params);
		// 每页大小
		long pageSize = rowMax;
		long page = 1;
		if (rowMax < rows && rows % pageSize != 0) {
			// 页数
			page = rows / pageSize + 1;
		}
		// 创建工作簿
		SXSSFWorkbook workbook = new SXSSFWorkbook(200000);
		// 设置字体和单元格样式
		Map<String, CellStyle> mapCellStyle = cellStyle(workbook);

		// 创建第一个sheet（页），并命名
		Sheet sheet = workbook.createSheet(t_name + System.currentTimeMillis());
		// 创建第一行
		Row row = sheet.createRow((short) 0);
		// 创建表头
		buildExcelHeader(t_name, t_header, mapCellStyle, sheet, row);
		// 构造数据体cell
		Cell cell = null;
		// 数据体标记,去除表头和字段名
		int flag = 1;
		for (int i = 1; i <= page; i++) {
			// 根据每个工作簿显示数量分批次获取数据并进行处理
			long offset = (i - 1) * pageSize;
			long endset = i * pageSize - 1;
			params.put("offset", Long.valueOf(offset));
			params.put("endset", Long.valueOf(endset));
			// 获得要导出的数据集
			List<Map<String, Object>> datas = base.exportPage(params);
			for (int rownum = 0; rownum < datas.size(); rownum++) {
				Map<String, Object> map = datas.get(rownum);
				// 大于 每个sheet 最大值
				if (flag > rowMax) {
					flag = 1;
					// 创建新的工作簿
					sheet = workbook.createSheet(t_name + System.currentTimeMillis());
					row = sheet.createRow((short) 0);
					buildExcelHeader(t_name, t_header, mapCellStyle, sheet, row);
				}
				// 填充数据体
				row = sheet.createRow(flag + 1);
				for (int j = 0; j < t_title.length; j++) {
					cell = row.createCell(j);
					// 去除空
					String str = "-";
					if (null != map.get(t_title[j]) && !"".equals(map.get(t_title[j]))) {
						str = String.valueOf(map.get(t_title[j]));
						str = formatCommonStr(str);
					}
					cell.setCellValue(str);
					cell.setCellStyle(mapCellStyle.get("BODY_CSS"));
				}
				flag++;
			}
		}
		// 导出excel
		poiExcelExport(request, response, t_name, workbook);
	}

	public static Map<String, Object> requestObjMap(HttpServletRequest request) {
		@SuppressWarnings("unchecked")
		Map<String, Object[]> paramsMap = request.getParameterMap();

		Map<String, Object> map = new HashMap<String, Object>();
		Set<Entry<String, Object[]>> entrySet = paramsMap.entrySet();
		for (Entry<String, Object[]> entry : entrySet) {
			map.put(entry.getKey(), entry.getValue()[0]);
		}
		return map;
	}
}
