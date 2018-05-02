package com.cloudchain.admin.web;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.util.*;
import com.cloudchain.ums.api.UserService;
import com.cloudchain.ums.pojo.bo.UmsRequest;
import com.cloudchain.ums.pojo.bo.UmsResponse;
import com.cloudchain.ums.pojo.bo.session.UmsSessionRequest;
import com.cloudchain.ums.pojo.po.UmsUser;
import com.cloudchain.util.param.CommonParamUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


/**
 * Created by lihao on 2017/2/15.
 */
@Controller
@RequestMapping(path = "/")
public class MainController {

    private static final Logger LOGGER = LoggerFactory.getLogger(MainController.class);

    /**
     * userid_session
     */
    private static final String UMS_SESSION_ID = "b.g.x.session.operator";

    /**
     * 用户
     */
    public static final String UMS_USER = "umsUser";

    @Value("${singleLogin.host}")
    String host;

    @Value("${singleLogin.path}")
    String path;

    @Value("${singleLogin.method}")
    String method;

    @Value("${singleLogin.sid}")
    String sid;

    @Value("${singleLogin.appcode}")
    String appcode;

    @Autowired
    UserService us;

    /**
     * 用户登录接口
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/doLogin", method = RequestMethod.POST)
    @ResponseBody
    public UmsResponse loginPost(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        LOGGER.info("login request in");
        String uName = request.getParameter("uName");
        String uPass = request.getParameter("uPass");
        String userType = request.getParameter("userType");
        String belongTo = request.getParameter("belongTo");

        LOGGER.info("begin login , userName {}, userType {}, belongTo{}", uName, userType, belongTo);

        String ip = HttpRequestInfoUtil.getRemoteAddr(request);

        if (StringUtils.isEmpty(userType))
        {
            userType = "0";
        }

        UmsUser user = new UmsUser();
        user.setUserName(uName);
        user.setPassword(RSAUtil.decrypt(uPass));
        user.setUserType(Integer.valueOf(userType));
        user.setBelongTo(belongTo);
        user.setLastLoginIp(ip);

        UmsRequest ur = new UmsRequest();
        ur.setUser(user);
        ur.setLoginFunction("admin");
        UmsResponse resp = us.login(ur);

        String status = resp.getStatus();

        LOGGER.info("login status is {}" + status);

        if (ResultCode.SUCCESS.equals(status))
        {
            //登录成功，session操作
            Map<String, Object> resultMap = resp.getResultMap();
            UmsUser u = (UmsUser) resultMap.get(UMS_USER);
            session.setAttribute(UMS_SESSION_ID, u);
            resultMap.remove(UMS_USER);
            session.setAttribute("funcMap", resultMap);
            session.setMaxInactiveInterval(120*60);

            response.addCookie(new Cookie("JSESSIONID", session.getId()));

            //存储session信息
            String sessionId = session.getId();
            String key = UMS_SESSION_ID + u.getUserId();
            UmsSessionRequest sessionRequest = new UmsSessionRequest();
            sessionRequest.setKey(key);
            sessionRequest.setValue(sessionId);
            us.sessionCache(sessionRequest);
        }

        resp.setResultMap(null);

        response.addCookie(new Cookie("JSSESIONID",request.getSession().getId()));

        LOGGER.debug("uName:{}, uPass:{}", uName, uPass);
        return resp;
    }

    /**
     * 跳转主页面
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/home")
    public String home(HttpServletRequest request, HttpServletResponse response) {
        return "/home";
    }

    /**
     * 跳转主页
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "")
    public String home1(HttpServletRequest request, HttpServletResponse response) {
        return "/chaimihome";
    }

    /**
     * 跳转登录页面
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/login")
    public String login(HttpServletRequest request, HttpServletResponse response) {
        //判断是否已经存在登录的session，如果存在直接进主页
        HttpSession session = request.getSession();
        CommUserModel commUserModel = CommonParamUtil.getUserFromSession(request);

        if (null == commUserModel)
        {
            //用户没有登录，跳转到登录页面
            return "/login";
        }

        String sessionId = session.getId();
        String key = "b.g.x.session.operator" + commUserModel.getOperatorId();

        //查看当前redis中用户对应的session和拦截的session是否匹配
        String validSessionId = us.getSessionIdFromCache(key);

        if (!sessionId.equals(validSessionId))
        {
            return "/login";
        }


        return "/home";
    }
    /**
     * 跳转登录页面
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {

        //移除session
        HttpSession session = request.getSession();

        session.invalidate();
        return "/login";
    }

    /**
     * 跳转首页
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/homepage")
    public String toHomePage(HttpServletRequest request, HttpServletResponse response) {
        return "/homepage";
    }

    /**
     * 采购联盟首页
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/d2dhome")
    public String tod2dhome(HttpServletRequest request, HttpServletResponse response) {
        return "/d2dhome";
    }

    /**
     * 柴米优仓首页
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/d2whome")
    public String tod2whome(HttpServletRequest request, HttpServletResponse response) {
        return "/d2whome";
    }

    /**
     * 柴米优仓首页
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/chailogin")
    public String tochailogin(HttpServletRequest request, HttpServletResponse response) {
        return "/chailogin";
    }

    /**
     * 柴米优仓首页
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/chaimihome")
    public String tochaimihome(HttpServletRequest request, HttpServletResponse response) {
        return "/chaimihome";
    }

    /**
     * 判断用户是否登录
     * @param request
     * @return
     */
    @RequestMapping(value = "/isLogin")
    @ResponseBody
    public UmsResponse isLogin(HttpServletRequest request)
    {
        UmsResponse response = new UmsResponse();
        String isLogin = "0";
        //判断是否已经存在登录的session，如果存在直接进主页
        HttpSession session = request.getSession();
        CommUserModel commUserModel = CommonParamUtil.getUserFromSession(request);

        if (null == commUserModel)
        {
            //用户没有登录，跳转到登录页面
            response.setObj(isLogin);
            return response;
        }

        String sessionId = session.getId();
        String key = "b.g.x.session.operator" + commUserModel.getOperatorId();

        //查看当前redis中用户对应的session和拦截的session是否匹配
        String validSessionId = us.getSessionIdFromCache(key);

        if (!sessionId.equals(validSessionId))
        {
            response.setObj(isLogin);
            return response;
        }

        isLogin = "1";
        response.setObj(isLogin);
        return response;
    }

    /**
     * 柴米优仓首页
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/settled")
    public String tosettled(HttpServletRequest request, HttpServletResponse response) {
        return "/settled";
    }

    /**
     * 单点登录
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/toSingleLogin")
    @ResponseBody
    public UmsResponse toSingleLogin(HttpServletRequest request, HttpServletResponse response) {

        Map<String, String> headers = new HashMap<String, String>();
        headers.put("Authorization", appcode);
        headers.put("Access-Control-Allow-Origin", "*");
        Map<String, String> querys = new HashMap<String, String>();

        UmsResponse resp = new UmsResponse();

        //判断用户是否登录，未登录则跳转到登录页面
        try {

            CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

            if (null == userModel)
            {
                resp.setObj(host);
                return resp;
            }

            String userId = userModel.getUserId();

            UmsUser user = us.qryUserSimpleInfoById(userId);

            if (null == user)
            {
                resp.setObj(host);
                return resp;
            }

            String password = user.getPassword();

            String verifyCode = String.valueOf((int) ((Math.random() * 9 + 1) * 100000));

            String timestamp = DateFormatUtils.format(new Date(), DateFormatUtils.ymd_hms);

            StringBuffer sb = new StringBuffer();

            String sign_str = sb.append("userId=").append(userId).append("&password=").append(password)
                    .append("&verifyCode=").append(verifyCode).append("&timestamp=").append(timestamp).toString();

            String sign = MD5Utils.stringMD5(MD5Utils.stringMD5(sign_str) + sid);

            Map<String, String> bodys = new HashMap<String, String>();
            bodys.put("userId", userId);
            bodys.put("password", password);
            bodys.put("verifyCode", verifyCode);
            bodys.put("timestamp", timestamp);
            bodys.put("sign", sign);

            HttpUtils.doPost(host, path, method, headers, querys, bodys);

            resp.setObj(host + "?code=" + verifyCode + "#/singleLogin");
            return resp;

        } catch (Exception e) {
            e.printStackTrace();
        }
        resp.setObj(host);
        return resp;
    }
}




