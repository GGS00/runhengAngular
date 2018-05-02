package com.cloudchain.admin.exception;

import com.cloudchain.platform.exception.BaseRuntimeException;

/**
 * Created by LiuKai on 2017/2/27.
 */
public class BusinessLayerException extends BaseRuntimeException {
    private static final long serialVersionUID = -2497331288743160972L;

    /**
     * Create a new BusinessException with the specified message.
     *
     * @param msg
     *            the detail message
     */
    public BusinessLayerException(String msg) {
        super(msg);
    }

    public BusinessLayerException(String msg, String[] params) {
        super(msg);
        if(params == null || params.length == 0)
            return;
        super.setParams(params);
    }

    /**
     * Create a new BusinessException with the specified message and root cause.
     *
     * @param msg
     *            the detail message
     * @param ex
     *            the root cause
     */
    public BusinessLayerException(String msg, Throwable ex) {
        super(msg, ex);
    }

    public BusinessLayerException(String msg, Throwable ex, String[] params) {
        super(msg, ex);
        if(params == null || params.length == 0)
            return;
        super.setParams(params);
    }
}
