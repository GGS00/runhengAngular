package com.cloudchain.admin.web.common;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.admin.web.common.invocation.BeanMethodInvocation;
import com.cloudchain.platform.util.JacksonUtils;
import com.cloudchain.util.param.CommonParamUtil;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Created by LiuKai on 2017/2/25.
 */
@Controller
public class PageBaseController {

    private static final Logger logger = LoggerFactory.getLogger(PageBaseController.class);

    private static final Map<String, String> loginCfgPage = new HashMap<>();

    private static final String GET_USER_LIST = "pageGetUserList";

    private static final String GET_DRIVER_LIST = "pageGetDriverList";

    private static final String GET_TOP_COTACTS_LIST = "pageGetTopContacts";

    private static final String D2D_ORDER = "d2DOrder";

    private static final String D2W_WAREHOUSE = "d2WWareHouse";

    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/process", method = RequestMethod.GET, produces="text/plain;charset=UTF-8")
    @ResponseBody
    public String page(HttpServletRequest request, HttpServletResponse response) {
        response.setCharacterEncoding("UTF-8");
        Map<String, String[]> paramsMap = request.getParameterMap();
        logger.debug("received a request, beanName is : [{}], methodName is : [{}], other params is {}",
                new Object[] { paramsMap.get("bean"), paramsMap.get("method"), JacksonUtils.object2json(paramsMap) });

        String jsonResult = StringUtils.EMPTY;

        Map<String, Object> map = new HashMap<String, Object>();
        Set<Map.Entry<String, String[]>> entrySet = paramsMap.entrySet();
        for (Map.Entry<String, String[]> entry : entrySet) {
            map.put(entry.getKey(), entry.getValue()[0]);
        }

        String beanName = (String) map.get("bean");
        if (StringUtils.isEmpty(beanName)) {
            logger.error("beanName must not be null or empty");
            return jsonResult;
        }

        String methodName = (String) map.get("method");
        if (StringUtils.isEmpty(methodName)) {
            logger.error("methodName must not be null or empty");
            return jsonResult;
        }

        if (!StringUtils.isEmpty(methodName) && methodName.contains("page")) {
            Integer page = Integer.valueOf((String) map.get("page"));
            Integer rows = Integer.valueOf((String) map.get("rows"));
            Integer offset = 1;
            Integer endset = 0;
            Integer mySqlOffset = 0;

            if (page == null) {
                page = 0;
                logger.warn("page user, but param \"page\" is null, and be set as 1");
            }
            if (rows == null) {
                rows = 0;
                logger.warn("page user, but param \"rows\" is null, and be set as 1");
            }

            if (page == 1)
                offset = 1;
            else
                offset = (page - 1) * rows + 1;

            endset = page * rows;

            if (page >= 1) {
                mySqlOffset = (page - 1) * rows;
            }

            map.put("offset", offset);
            map.put("endset", endset);
            map.put("mySqlOffset", mySqlOffset);
            map.put("rows", rows <= 0 ? 20 : rows);
        }

        // 传入USER
        CommUserModel userModel =CommonParamUtil.getUserFromSession(request);

        if (beanName.equals(D2D_ORDER)  && null == userModel)
        {
            Map<String, Object> map1 = new HashMap<>();
            map1.put("isLogin", 1);
            String ret = JacksonUtils.object2json(map1);
            return  ret;
        }

        if (userModel != null)
        {
            map.put("userId", userModel.getUserId());
            map.put("loginName", userModel.getUserName());  //登录的用户名
            map.put("carrierId", userModel.getUserId());
            //当用户ID和OperatorId不同时设置，否则不设置
            if (!userModel.getUserId().equals(userModel.getOperatorId())) {
                map.put("operatorId", userModel.getOperatorId());
            }

            // for industry
            map.put("isAdmin", "1");
            map.put("isCustomize", userModel.getFunctionMap().get("goodsSettingCustom"));
        }

        if (GET_USER_LIST.equals(methodName) || GET_DRIVER_LIST.equals(methodName) || GET_TOP_COTACTS_LIST.equals(methodName))
        {
            map.put("belongTo", userModel.getUserId());
        }
        //20170527添加 wms查询指定用户的订单
        if("pageGetPurchaseOrder".equals(methodName)){
            if(map.get("qryUserId") != null && !StringUtils.isEmpty(map.get("qryUserId").toString())){
                map.put("userId",map.get("qryUserId"));
            }
        }

        try {
            jsonResult = (String) BeanMethodInvocation.execute(beanName + "ServiceImpl", methodName, map);
        }
        catch (Throwable tx) {
            logger.error("process error", tx);
            logger.error(
                    "invoke method : targetBean: {}, method: {} , with error: \n\tparams is : ; \n\texception is [{}]",
                    new Object[] { beanName, methodName, tx.getLocalizedMessage() });
        }

        return jsonResult;
    }
}
