/**
 * Copyright©2013 www.jshuabo.com. all rights reserved.
 * 
 * @Title: StringUtils.java
 * @Prject: logistics
 * @Package: com.jshuabo.logistics.server.util.string
 * @author: lianghe.yuan
 * @date: 2014年7月16日 下午1:50:37
 * @version: v1.0
 * @Description:
 */
package com.cloudchain.util.string;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

/**
 * @ClassName: StringUtils
 * @Description:
 * @author: lianghe.yuan
 * @date: 2014年7月16日 下午1:50:37
 */
public class StringUtils {

    /**
     * @Title: isEmpty
     * @Description: - 空串校验
     * @param str
     * @return: boolean
     */
    public static boolean isEmpty(String str) {
        return str == null || str.length() == 0 || "-".equals(str);
    }

    /**
     * @Title: StringtoList
     * @Description: String '1,2,3' 转 List
     * @return: List<Object>
     * @author: peng.wu
     * @date: 2014年12月3日 下午6:55:46
     */
    public static List<Object> StringtoList(String str) {
        List<Object> lis = new ArrayList<Object>();
        StringTokenizer toKenizer = new StringTokenizer(str, ",");
        while (toKenizer.hasMoreElements()) {
            lis.add((toKenizer.nextToken()));
        }
        return lis;
    }
    
    /**
     * @Title: getExceptionMsg
     * @Description: 截取异常消息
     * @return: String
     * @author: yunlei.hua
     * @date: 2015年1月21日 上午9:41:20
     */
    public static String getExceptionMsg(Exception e) {
        String eMsg = e.getMessage();
        if(isEmpty(eMsg)) {
            eMsg = "";
        } else if(eMsg.contains("error_string") && eMsg.contains("sqlcode")) {
            eMsg = eMsg.substring(eMsg.indexOf("{"), eMsg.indexOf("}") + 1);
            eMsg = eMsg.substring(eMsg.indexOf("error_string")+15, eMsg.indexOf("sqlcode")-3) + "；";
        } else if(eMsg.contains("Exception")) {
            int index = eMsg.indexOf("Exception")+22;
            eMsg = eMsg.substring(index, eMsg.indexOf("###",index)-3) + "；";
        } else if(!eMsg.contains("Exception")) {
        } else {
            eMsg = "数据库系统内部错误，请联系管理员！";
        }
        return eMsg;
    }
    
    public static List<BigDecimal> toIDS(String ids){
    	List<BigDecimal> bl = new ArrayList<BigDecimal>();
    	String[] idArray = ids.split(",");
    	if(null==idArray){
    		return null;
    	}
    	for(String id : idArray){
    		try {
				bl.add(new BigDecimal(id));
			}
			catch (Exception e) {
				e.printStackTrace();
			}
    	}
    	if(bl.size()>0){
    		return bl;
    	}
    	return null;
    }
    public static List<BigDecimal> toIDS(String[] idArray){
    	List<BigDecimal> bl = new ArrayList<BigDecimal>();
    	if(null==idArray){
    		return null;
    	}
    	for(String id : idArray){
    		try {
				bl.add(new BigDecimal(id));
			}
			catch (Exception e) {
				e.printStackTrace();
			}
    	}
    	if(bl.size()>0){
    		return bl;
    	}
    	return null;
    }
}
