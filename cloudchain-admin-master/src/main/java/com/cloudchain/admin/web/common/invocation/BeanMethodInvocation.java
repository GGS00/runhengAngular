package com.cloudchain.admin.web.common.invocation;

import com.cloudchain.admin.exception.BusinessLayerException;
import com.cloudchain.platform.common.AppContext;
import com.cloudchain.platform.exception.BaseRuntimeException;
import com.cloudchain.platform.util.JacksonUtils;
import org.apache.commons.beanutils.MethodUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by LiuKai on 2017/2/27.
 */
public class BeanMethodInvocation {
    private static final Logger logger = LoggerFactory.getLogger(BeanMethodInvocation.class);

    @Autowired
    AppContext appContext;

    public static Object execute(String targetBeanName, String methodName, Object params) {
        if (StringUtils.isEmpty(targetBeanName)) {
            logger.error("target bean name must not be null or empty!");
            throw new BusinessLayerException("target.bean.name.must.not.be.null.or.empty!");
        }

        Object targetBean = AppContext.getApp().getBean(targetBeanName);
        if (null == targetBean) {
            logger.error("target bean is null with bean name:[{}]", targetBeanName);
            throw new BusinessLayerException("target.bean.is.null.with.bean.name:[{}]",
                    new String[] { targetBeanName });
        }

        Class<?> paramsClass = null;
        if (params instanceof Map)
            paramsClass = Map.class;
        else if (params instanceof List)
            paramsClass = List.class;
        else if (params instanceof Set)
            paramsClass = Set.class;
        else
            paramsClass = params.getClass();

        Method method = MethodUtils.getAccessibleMethod(targetBean.getClass(), methodName, paramsClass);
        if (method == null) {
            logger.error("can't find method: [{}] on target: [{}], and params is: {}",
                    new Object[] { methodName, targetBean.getClass(), JacksonUtils.object2json(params) });
            throw new BaseRuntimeException(
                    "can't find method: [{" + methodName + "}] on bean: [{" + targetBean.getClass() + "}]");
        }
        Object methodResult = null;
        try {
            methodResult = method.invoke(targetBean, params);
        }
        catch (IllegalArgumentException e) {
            logger.error("invoke method : target: {}, method: {} ,with IllegalArgumentException:\n\t {}",
                    new Object[] { targetBean, methodName, e.getLocalizedMessage() });
            logger.error("invoke error!", e);
            throw new BaseRuntimeException(e.getLocalizedMessage());
        }
        catch (IllegalAccessException e) {
            logger.error("invoke method : target: {}, method: {} ,with IllegalAccessException:\n\t {}",
                    new Object[] { targetBean, methodName, e.getLocalizedMessage() });
            logger.error("invoke error!", e);
            throw new BaseRuntimeException(e.getLocalizedMessage());
        }
        catch (InvocationTargetException e) {
            logger.error("invoke method : target: {}, method: {} ,with InvocationTargetException:\n\t {}",
                    new Object[] { targetBean, methodName, e.getTargetException() });
            logger.error("invoke error!", e);
            throw new BaseRuntimeException(e.getLocalizedMessage());
        }
        catch (Throwable tx) {
            tx.printStackTrace();
            logger.error("invoke method : target: {}, method: {} ,with Throwable:\n\t {}",
                    new Object[] { targetBean, methodName, tx.getLocalizedMessage() });
            logger.error("invoke error!", tx);
            throw new BaseRuntimeException(tx.getLocalizedMessage());
        }
        return methodResult;
    }
}
