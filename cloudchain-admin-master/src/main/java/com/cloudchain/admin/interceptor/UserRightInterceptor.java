package com.cloudchain.admin.interceptor;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.platform.util.MapUtils;
import com.cloudchain.platform.util.StringUtils;
import com.cloudchain.ums.api.UmsResourceService;
import com.cloudchain.ums.api.UserService;
import com.cloudchain.ums.pojo.bo.auth.UmsAuthRequest;
import com.cloudchain.ums.pojo.bo.session.UmsSessionResponse;
import com.cloudchain.ums.pojo.example.UmsUserResourcesExample;
import com.cloudchain.ums.pojo.po.BisCommResource;
import com.cloudchain.util.param.CommonParamUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

/**
 * Created by zhuhao on 2017/3/11.
 */
public class UserRightInterceptor extends HandlerInterceptorAdapter
{
    private static final Logger LOGGER = LoggerFactory.getLogger(UserRightInterceptor.class);

    /**
     * userid_session
     */
    private static final String UMS_SESSION_ID = "b.g.x.session.operator";

    /**
     * 没有登录
     */
    private static final int NO_LOGIN = 401;

    /**
     * 约定的没有权限的http状态码
     */
    private static final int NO_PERMISSON = 406;


    private static final String METHOD_GET = "GET";
    private static final String METHOD_POST = "POST";
    private static final String METHOD_NAME_PROCESS = "/process";

    private static final int REQUEST_TYPE_GET = 4;
    private static final int REQUEST_TYPE_POST = 3;
    private static final int REQUEST_TYPE_PAGE = 5;

    private static final int NEED_LOGIN = 0;
    private static final int NO_NEED_LOGIN = 1;


    /**
     * 用户权限列表
     */
    private static final String KEY = "role_list";

    @Autowired
    UserService us;

    @Autowired
    UmsResourceService resourceService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception
    {

        String url = request.getServletPath();

        String method = request.getMethod();

        int requestType = 3;

        if (METHOD_GET.equals(method) && !METHOD_NAME_PROCESS.equals(url))
        {
            requestType = 4;
        }
        else if (METHOD_POST.equals(method) && !METHOD_NAME_PROCESS.equals(url))
        {
            requestType = 3;
        }
        else
        {
            requestType = 5;
        }

        Map<String, Object> requestParams = MapUtils.requestObjMap(request);

        //判断用户是否存在登陆的session,session是否匹配
        HttpSession session = request.getSession();
        CommUserModel commUserModel = CommonParamUtil.getUserFromSession(request);

        List<BisCommResource> commList = resourceService.getCommList();

        if (null == commUserModel)
        {
            //用户没有登录，判断是否是不需要校验接口
            if (authCommResource(url, requestType, NO_NEED_LOGIN, requestParams, commList))
            {
                return super.preHandle(request, response, handler);
            }
            response.sendError(NO_LOGIN);
            return false;
        }

        String userId = commUserModel.getUserId();
        String operatorId = commUserModel.getOperatorId();

        String sessionId = session.getId();
        String key = UMS_SESSION_ID + commUserModel.getOperatorId();

        //查看当前redis中用户对应的session和拦截的session是否匹配
        String validSessionId = us.getSessionIdFromCache(key);

        if (!sessionId.equals(validSessionId))
        {
            //用户重复登陆,跳转登陆页面
            session.invalidate();
            response.sendError(NO_LOGIN);
            return false;
        }

        UmsSessionResponse resp = null;

        if (userId.equals(operatorId))
        {
            resp = us.getRoleList(userId);
        }
        else
        {
            resp = us.getRoleList(operatorId);
        }

        if (null == resp)
        {
            //用户没有登录，跳转到登录页面
            response.sendError(NO_PERMISSON);
            return false;
        }

        List<UmsUserResourcesExample> list  = (List<UmsUserResourcesExample>) resp.getData();

        boolean auth = auth(url, requestType,  requestParams, list);

        if (!auth)
        {
            //第一次验证失败的时候 重新加载权限
            UmsAuthRequest authRequest = new UmsAuthRequest();
            if (userId.equals(operatorId))
            {
                authRequest.setUserId(userId);
                us.refreshUserRole(authRequest);

                resp = us.getRoleList(userId);
            }
            else
            {
                authRequest.setEmpId(operatorId);
                us.refreshUserRole(authRequest);

                resp = us.getRoleList(operatorId);
            }

            List<UmsUserResourcesExample> lista  = (List<UmsUserResourcesExample>) resp.getData();

            boolean autha = auth(url, requestType,  requestParams, lista);

            if (!autha)
            {
                if (authCommResource(url, requestType, NEED_LOGIN, requestParams, commList))
                {
                    return super.preHandle(request, response, handler);
                }
                response.sendError(NO_PERMISSON);
                return false;
            }
        }

        return super.preHandle(request, response, handler);
    }

    private boolean auth(String url, int requestType, Map<String, Object> requestParams, List<UmsUserResourcesExample> list) {

        if (url.equals("/"))
        {
            return true;
        }

        if (list == null || list.size() < 1)
        {
            return false;
        }

        String requestBeanName = null;
        String requestMethodName = null;

        if (requestType == REQUEST_TYPE_PAGE) {
            requestBeanName = (String) requestParams.get("bean");
            requestMethodName = (String) requestParams.get("method");
        }

        //请求类型  3post请求，4get请求，5分页请求
        for (UmsUserResourcesExample ex : list ) {
            String methodUrl = ex.getUrl();
            int type = ex.getType();

            if (requestType == REQUEST_TYPE_PAGE)
            {
                if (url.equals(METHOD_NAME_PROCESS))
                {
                    String methodName = ex.getMethodName();
                    String beanName = ex.getBeanName();
                    if (url.equals(methodUrl) && !StringUtils.isEmpty(beanName) &&
                            !StringUtils.isEmpty(methodName) && beanName.equals(requestBeanName) && methodName.equals(requestMethodName))
                    {
                        return true;
                    }
                }
            }
            else
            {
                if (type == requestType && methodUrl.equals(url))
                {
                    return true;
                }
                else if (type == requestType)
                {
                    boolean check = checkUrl(url, methodUrl);
                    if (check)
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private boolean checkUrl(String requestUrl, String methodUrl) {

        String[] str1 = requestUrl.split("/");
        String[] str2 = methodUrl.split("/");

        if (str1.length == str2.length)
        {
            for (int i = 0; i < str1.length; i++) {
                if (!str2[i].contains(":") && !str1[i].equals(str2[i]))
                {
                    return false;
                }
            }
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * 校验是否为公共接口
     * @param requestUrl
     * @param requestType
     * @param login
     * @param requestParams
     * @param list
     * @return
     */
    private boolean authCommResource(String requestUrl, int requestType, int login, Map<String, Object> requestParams, List<BisCommResource> list)
    {

        if (requestUrl.equals("/"))
        {
            return true;
        }

        if (list == null || list.size() < 1)
        {
            return false;
        }

        String requestBeanName = null;
        String requestMethodName = null;

        if (requestType == REQUEST_TYPE_PAGE) {
            requestBeanName = (String) requestParams.get("bean");
            requestMethodName = (String) requestParams.get("method");
        }

        //请求类型  3post请求，4get请求，5分页请求
        for (BisCommResource ex : list ) {
            String methodUrl = ex.getUrl();
            int type = ex.getType();

            if (requestType == REQUEST_TYPE_PAGE)
            {
                if (requestUrl.equals(METHOD_NAME_PROCESS))
                {
                    String methodName = ex.getMethodName();
                    String beanName = ex.getBeanName();
                    if (requestUrl.equals(methodUrl) && !StringUtils.isEmpty(beanName) && (ex.getLogin() == NO_NEED_LOGIN || (ex.getLogin() == login)) &&
                            !StringUtils.isEmpty(methodName) && beanName.equals(requestBeanName) && methodName.equals(requestMethodName))
                    {
                        return true;
                    }
                }
            }
            else
            {
                if (type == requestType && methodUrl.equals(requestUrl) &&  (ex.getLogin() == NO_NEED_LOGIN || (ex.getLogin() == login)) )
                {
                    return true;
                }
                else if (type == requestType &&  (ex.getLogin() == NO_NEED_LOGIN || (ex.getLogin() == login)) )
                {
                    boolean check = checkUrl(requestUrl, methodUrl);
                    if (check)
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
