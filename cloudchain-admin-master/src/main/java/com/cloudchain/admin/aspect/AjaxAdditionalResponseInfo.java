package com.cloudchain.admin.aspect;

import com.cloudchain.platform.util.JacksonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.ResourceBundleMessageSource;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by LiuKai on 2017/3/1.
 */
public class AjaxAdditionalResponseInfo {

    private static final Logger logger = LoggerFactory.getLogger(AjaxAdditionalResponseInfo.class);
    public static final String SUCCESS = "SUCCESS";
    public static final String PART_SUCCESS = "PART_SUCCESS";
    public static final String FAIL = "FAIL";
    public static final String TIMEOUT = "TIMEOUT";
    public static final String SP_RESP = "spResp:";

    private static final String msgKey = "\"additionalMsg\": ";

    private static ResourceBundleMessageSource messageSource;

    public static String createSuccessInfo(String status, Double time, String msg) {
        return createInfo(status, time, msg);
    }

    public static String createFailInfo(String status, Double time, String msg) {
        return createInfo(status, time, msg);
    }

    public static String createSPRespInfo(String msg){
        return new StringBuffer().append(SP_RESP).append(msg).toString();
    }

    public static String createBatchProcessResultInfo(int totalCount, int successCount, int failCount, Double time,
                                                      String msg) {
        Map<String, Object> info = new HashMap<String, Object>();
        info.put("status",
                messageSource.getMessage(
                        totalCount == successCount ? SUCCESS : (successCount > 0 ? PART_SUCCESS : FAIL), null,
                        java.util.Locale.getDefault()));
        logger.info("java.util.Locale.getDefault() is :{}",java.util.Locale.getDefault());
        info.put("processTime", time);
        info.put("totalCount", totalCount);
        info.put("successCount", successCount);
        info.put("failCount", failCount);
        info.put("message", msg);

        return msgKey + JacksonUtils.object2json(info);
    }

    private static String createInfo(String status, Double time, String msg) {
        Map<String, Object> info = new HashMap<String, Object>();
        info.put("status", messageSource.getMessage(status, null, java.util.Locale.getDefault()));
        logger.info("java.util.Locale.getDefault() is :{}",java.util.Locale.getDefault());
        info.put("processTime", time);
        info.put("message", msg);
        return msgKey + JacksonUtils.object2json(info);
    }

    /**
     * @return the messageSource
     */
    public ResourceBundleMessageSource getMessageSource() {
        return messageSource;
    }

    /**
     * @param messageSource
     *            the messageSource to set
     */
    public void setMessageSource(ResourceBundleMessageSource messageSource) {
        AjaxAdditionalResponseInfo.messageSource = messageSource;
    }
}
