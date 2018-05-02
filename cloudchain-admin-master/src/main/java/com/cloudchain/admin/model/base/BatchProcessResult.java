package com.cloudchain.admin.model.base;

/**
 * Created by LiuKai on 2017/3/1.
 */
public class BatchProcessResult {

    private static final long serialVersionUID = 2142571639927121005L;

    /** 类型 */
    private String type = "BATCH_PROCESS_RESULT";
    /** 总共处理记录数 */
    private int totalCount = 0;
    /** 成功记录数 */
    private int successCount = 0;
    /** 失败记录数 */
    private int failCount = 0;

    /** 显示消息内容 */
    private String message;

    public BatchProcessResult() {
    }

    public BatchProcessResult(int totalCount, int failCount) {
        super();
        this.type = "BATCH_PROCESS_RESULT";
        this.totalCount = totalCount;
        this.successCount = totalCount - failCount;
        this.failCount = failCount;
    }


    public BatchProcessResult(int totalCount, int failCount, String message) {
        super();
        this.type = "BATCH_PROCESS_RESULT";
        this.totalCount = totalCount;
        this.successCount = totalCount - failCount;
        this.failCount = failCount;
        this.message = message;
    }


    /** @return the type */
    public String getType() {
        return type;
    }


    /** @param type the type to set */
    public void setType(String type) {
        this.type = type;
    }


    /** @return the totalCount */
    public int getTotalCount() {
        return totalCount;
    }


    /** @param totalCount the totalCount to set */
    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }


    /** @return the successCount */
    public int getSuccessCount() {
        return successCount;
    }


    /** @param successCount the successCount to set */
    public void setSuccessCount(int successCount) {
        this.successCount = successCount;
    }


    /** @return the failCount */
    public int getFailCount() {
        return failCount;
    }


    /** @param failCount the failCount to set */
    public void setFailCount(int failCount) {
        this.failCount = failCount;
    }


    /** @return the message */
    public String getMessage() {
        return message;
    }


    /** @param message the message to set */
    public void setMessage(String message) {
        this.message = message;
    }
}
