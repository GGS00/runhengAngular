package com.cloudchain.admin.aspect;

import com.cloudchain.admin.model.base.BatchProcessResult;
import com.cloudchain.platform.util.JacksonUtils;
import org.apache.commons.lang.StringUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by LiuKai on 2017/3/1.
 */
@Aspect
public class CommonControllerAspect {

    private static final Logger logger = LoggerFactory.getLogger(CommonControllerAspect.class);

    /* 单条数据处理返回 */
    public static final String RETURN_VOID = "RETURN_VOID";

    /* 批量处理返回 */
    public static final String BATCH_PROCESS_RESULT = "BATCH_PROCESS_RESULT";

    public static final String expression = "execution(* com.cloudchain.admin.web..*..*.*(..)) and within(@org.springframework.stereotype.Controller *)";

    @Pointcut(expression)
    public void pointCutController() {
    }

    @Around("pointCutController()")
    public Object doAround(ProceedingJoinPoint pjp) throws Throwable {
        logger.debug("begin around by aspect, target is:[{}]", new Object[] { pjp.getSignature().toLongString() });

        long begin = System.currentTimeMillis();
        Object result = pjp.proceed();
        long end = System.currentTimeMillis();

        return processResult(result, end, begin);
    }

    @Before("pointCutController()")
    public void doBefore(JoinPoint jp) {
    }

    @AfterReturning(pointcut = "pointCutController()", returning = "result")
    public void doReturn(Object result) {
    }

    @After("pointCutController()")
    public void doAfter(JoinPoint jp) {
    }

    @AfterThrowing(pointcut = "pointCutController()", throwing = "ex")
    public void doThrowing(Exception ex) {
    }

    private Object processResult(Object object, long end, long begin) {
        if (object instanceof String) {
            String tmp = StringUtils.trim((String) object);
            if (tmp.equals(RETURN_VOID)) {
                String additionalMsg = AjaxAdditionalResponseInfo.createSuccessInfo(AjaxAdditionalResponseInfo.SUCCESS,
                        (end - begin) / 1000d, StringUtils.EMPTY);
                return new StringBuffer().append("{").append(additionalMsg).append("}").toString();
            }
            else if (StringUtils.indexOf(tmp, BATCH_PROCESS_RESULT) > -1) {
                BatchProcessResult result = JacksonUtils.json2object(tmp, BatchProcessResult.class);
                String additionalMsg = AjaxAdditionalResponseInfo.createBatchProcessResultInfo(result.getTotalCount(),
                        result.getSuccessCount(), result.getFailCount(), (end - begin) / 1000d, result.getMessage());
                return new StringBuffer().append("{").append(additionalMsg).append("}").toString();
            }
            else if (tmp.contains("additionalMsg")) {
                return tmp;
            }
            else if (tmp.contains(AjaxAdditionalResponseInfo.SP_RESP)) {
                String additionalMsg = AjaxAdditionalResponseInfo.createFailInfo(AjaxAdditionalResponseInfo.FAIL,
                        (end - begin) / 1000d, tmp.replaceAll(AjaxAdditionalResponseInfo.SP_RESP, ""));
                return new StringBuffer().append("{").append(additionalMsg).append("}").toString();
            }
            else if (tmp.startsWith("{") && tmp.endsWith("}")) {
                String additionalMsg = AjaxAdditionalResponseInfo.createSuccessInfo(AjaxAdditionalResponseInfo.SUCCESS,
                        (end - begin) / 1000d, StringUtils.EMPTY);

                int lastIndex = StringUtils.lastIndexOf(tmp, "}");
                String tmpResult = StringUtils.substring(tmp, 0, lastIndex);
                tmpResult = tmpResult + "," + additionalMsg + "}";

                return tmpResult;
            }
            else {
                return object;
            }
        }
        return object;
    }

    /** 生成处理结果信息 */
    public static String batchProcessResult(BatchProcessResult batchProcessResult) {
        return JacksonUtils.object2json(batchProcessResult);
    }
}
