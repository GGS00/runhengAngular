package com.cloudchain.admin.web.ums;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.platform.util.HttpRequestInfoUtil;
import com.cloudchain.platform.util.RSAUtil;
import com.cloudchain.platform.util.StringUtils;
import com.cloudchain.ums.api.UmsFunctionService;
import com.cloudchain.ums.api.UserService;
import com.cloudchain.ums.pojo.bo.UmsRequest;
import com.cloudchain.ums.pojo.bo.UmsResponse;
import com.cloudchain.ums.pojo.bo.function.UmsFunctionResponse;
import com.cloudchain.ums.pojo.bo.user.UmsPassRequest;
import com.cloudchain.ums.pojo.bo.user.UmsPassResponse;
import com.cloudchain.ums.pojo.po.*;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;


/**
 * Created by lihao on 2017/2/15.
 */
@Api(value = "user-api", description = "用户相关接口")
@Controller
@RequestMapping(path = "/user")
public class UmsUserController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UmsUserController.class);

    @Autowired
    UserService us;
    @Autowired
    UmsFunctionService umsFunctionService;

    /**
     * 获取用户详细信息
     * @param request
     * @return
     */
    @ApiOperation(value = "获取用户详细信息")
    @RequestMapping(value = "getUserInfo/{userId}")
    @ResponseBody
    public UmsResponse getUserInfo(@PathVariable String userId, String userType, HttpServletRequest request)
    {
        LOGGER.info("getUserInfo request in");
        LOGGER.info("request userId {}", userId);

        UmsUser user = new UmsUser();
        user.setUserId(userId);
        //判断用户类型
        if(userType != null){
            user.setUserType(Integer.valueOf(userType));
        }

        UmsRequest userRequest = new UmsRequest();
        userRequest.setUser(user);

        UmsResponse resp = us.getUserInfo(userRequest);

        LOGGER.info("getUserInfo request out");
        return resp;
    }

    /**
     * 用户申请入驻接口
     * @param user
     * @param request
     * @param company
     * @param response
     * @return
     */
    @RequestMapping(value = "apply", method = RequestMethod.POST)
    @ResponseBody
    public UmsResponse apply(UmsUser user, String company, HttpServletRequest request, HttpServletResponse response)
    {
        LOGGER.info("apply request in, request user {}", user.toString());
        String ip = HttpRequestInfoUtil.getRemoteAddr(request);
        user.setRegIp(ip);
        user.setPassword(RSAUtil.decrypt(user.getPassword()));
        user.setUserType(0);
        user.setRegSource(1);

        if (!StringUtils.isEmpty(company))
        {
            UmsAdminUserExt ext = new UmsAdminUserExt();
            ext.setCompany(company);
            user.setAdminUserExt(ext);
        }

        UmsRequest umsRequest = new UmsRequest();
        umsRequest.setUser(user);

        LOGGER.info("apply request out");
        return us.apply(umsRequest);
    }

    /**
     * 添加用户操作,会在扩展表添加默认信息，扩展信息可修改
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "新增用户")
    @RequestMapping(value = "addUser", method = RequestMethod.POST)
    @ResponseBody
    public UmsResponse addUser(UmsUser user, HttpServletRequest request)
    {
        LOGGER.info("addUser request in, request user {}", user.toString());

        String ownerType = request.getParameter("ownerType");

        String hType = request.getParameter("hType");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

        String ip = HttpRequestInfoUtil.getRemoteAddr(request);
        user.setRegIp(ip);
        user.setPassword(RSAUtil.decrypt(user.getPassword()));
        user.setBelongTo(userModel.getUserId());

        UmsRequest umsRequest = new UmsRequest();
        umsRequest.setUser(user);

        if (!StringUtils.isEmpty(ownerType))
        {
            umsRequest.setOwnerType(Integer.valueOf(ownerType));
        }
        if (!StringUtils.isEmpty(hType))
        {
            umsRequest.sethType(Integer.valueOf(hType));
        }

        String company = request.getParameter("company");

        umsRequest.setCompany(company);

        UmsResponse resp = us.addUser(umsRequest);

        LOGGER.info("addUser request out");
        return resp;
    }

    /**
     * 根据用户名获取用户详细信息
     * @param request
     * @return
     */
    @ApiOperation(value = "根据用户名获取用户详细信息")
    @RequestMapping(value = "getUserByName/{userName}")
    @ResponseBody
    public UmsResponse getUserByName(@PathVariable String userName, HttpServletRequest request)
    {
        LOGGER.info("getUserByName request in");
        LOGGER.info("request userName {}", userName);

        UmsUser user = new UmsUser();
        user.setUserName(userName);

        UmsRequest userRequest = new UmsRequest();
        userRequest.setUser(user);

        UmsResponse resp = us.getUserInfo(userRequest);

        LOGGER.info("getUserByName request out");
        return resp;
    }

    /**
     * 添加用户操作,会在扩展表添加默认信息，扩展信息可修改,只添加信息，不增加账号密码等信息
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "新增用户，不设置账号和密码")
    @RequestMapping(value = "addUserNoAccount", method = RequestMethod.POST)
    @ResponseBody
    public UmsResponse addUserNoAccount(UmsUser user, HttpServletRequest request)
    {
        LOGGER.info("addUserNoAccount request in, request user {}", user.toString());
        String ip = HttpRequestInfoUtil.getRemoteAddr(request);
        user.setRegIp(ip);

        UmsRequest umsRequest = new UmsRequest();
        umsRequest.setUser(user);

        UmsResponse resp = us.addUserNoAccount(umsRequest);

        LOGGER.info("addUserNoAccount request out");
        return resp;
    }

    /**
     * 新增常用联系人
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "新增常用联系人")
    @RequestMapping(value = "/addTopContacts", method = RequestMethod.POST)
    @ResponseBody
    public UmsResponse addTopContacts(UmsUser user, HttpServletRequest request)
    {
        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

        String company = request.getParameter("company");

        String ip = HttpRequestInfoUtil.getRemoteAddr(request);
        user.setRegIp(ip);
        user.setBelongTo(userModel.getUserId());
        user.setUserType(6);

        if (!StringUtils.isEmpty(company))
        {
            UmsUserSubacctExt ext = new UmsUserSubacctExt();
            ext.setCompany(company);
            user.setSubacctExt(ext);
        }

        UmsRequest umsRequest = new UmsRequest();
        umsRequest.setUser(user);

        UmsResponse resp = us.addTopContacts(umsRequest);

        return resp;
    }

    /**
     * 更新用户主表信息
     * @param user
     * @param request
     * @param response
     * @return
     */
    @ApiOperation(value = "更新用户主信息")
    @RequestMapping(value = "updateUserInfo", method = RequestMethod.POST)
    @ResponseBody
    public UmsResponse updateUserInfo(UmsUser user, HttpServletRequest request, HttpServletResponse response)
    {
        LOGGER.info("addUser updateUserInfo in, request user {}", user.toString());
        UmsRequest umsRequest = new UmsRequest();
        umsRequest.setUser(user);

        UmsResponse resp = us.updateUserInfo(umsRequest);

        LOGGER.info("addUser request out");
        return resp;
    }

    /**
     * 更新主用户扩展信息
     * @param ext
     * @param request
     * @param response
     * @return
     */
    @ApiOperation(value = "更新admin用户扩展信息")
    @RequestMapping(value = "updateAdminUserExtInfo", method = RequestMethod.POST)
    @ResponseBody
    public UmsResponse updateAdminUserExtInfo(UmsAdminUserExt ext, HttpServletRequest request, HttpServletResponse response)
    {
        LOGGER.info("addUser updateAdminUserExtInfo in");

        String mobile = request.getParameter("mobile");
        String email = request.getParameter("email");
        String qq = request.getParameter("qq");

        UmsRequest umsRequest = new UmsRequest();

        UmsUser user = new UmsUser();

        user.setUserId(ext.getUserId());
        user.setAdminUserExt(ext);
        user.setMobile(mobile);
        user.setEmail(email);
        user.setQq(qq);

        umsRequest.setUser(user);

        UmsResponse resp = us.updateAdminUserExtInfo(umsRequest);
        LOGGER.info("addUser updateAdminUserExtInfo out");

        return resp;
    }

    /**
     * 更新下级用户扩展信息
     * @param ext     * @param request
     * @param response
     * @return
     */
    @ApiOperation(value = "更新网点扩展信息")
    @RequestMapping(value = "updateSubacctUserExtInfo", method = RequestMethod.POST)
    @ResponseBody
    public UmsResponse updateSubacctUserExtInfo(UmsUserSubacctExt ext, HttpServletRequest request, HttpServletResponse response)
    {
        LOGGER.info("addUser updateSubacctUserExtInfo in");
        UmsRequest umsRequest = new UmsRequest();
        String mobile = request.getParameter("mobile");
        String email = request.getParameter("email");
        String qq = request.getParameter("qq");

        UmsUser user = new UmsUser();

        user.setUserId(ext.getUserId());
        user.setSubacctExt(ext);
        user.setMobile(mobile);
        user.setEmail(email);
        user.setQq(qq);

        umsRequest.setUser(user);

        UmsResponse resp = us.updateUserExtInfo(umsRequest);

        LOGGER.info("addUser updateSubacctUserExtInfo out");

        return resp;
    }

    /**
     * 更新司机扩展信息
     * @param ext
     * @param request
     * @param response
     * @return
     */
    @ApiOperation(value = "更新司机扩展信息")
    @RequestMapping(value = "updateDriverSubacctExtInfo", method = RequestMethod.POST)
    @ResponseBody
    public UmsResponse updateDriverSubacctExtInfo(UmsDriverSubacctExt ext, HttpServletRequest request, HttpServletResponse response)
    {
        LOGGER.info("addUser updateDriverSubacctExtInfo in");
        UmsRequest umsRequest = new UmsRequest();
        String mobile = request.getParameter("mobile");
        String email = request.getParameter("email");
        String qq = request.getParameter("qq");

        UmsUser user = new UmsUser();

        user.setUserId(ext.getUserId());
        user.setDriverSubacctExt(ext);
        user.setMobile(mobile);
        user.setEmail(email);
        user.setQq(qq);

        umsRequest.setUser(user);

        UmsResponse resp = us.updateDriverExtInfo(umsRequest);

        LOGGER.info("addUser updateDriverSubacctExtInfo out");

        return resp;
    }

    /**
     * 更新货主扩展信息
     * @param ext
     * @param request
     * @param response
     * @return
     */
    @ApiOperation(value = "更新货主扩展信息")
    @RequestMapping(value = "updateOwnerSubacctExtInfo", method = RequestMethod.POST)
    @ResponseBody
    public UmsResponse updateOwnerSubacctExtInfo(UmsOwnerSubacctExt ext, String shipAreas, HttpServletRequest request, HttpServletResponse response)
    {
        LOGGER.info("addUser updateOwnerSubacctExtInfo in");
        UmsRequest umsRequest = new UmsRequest();
        String mobile = request.getParameter("mobile");
        String email = request.getParameter("email");
        String qq = request.getParameter("qq");
        String nickName = request.getParameter("nickName");

        UmsUser user = new UmsUser();

        user.setUserId(ext.getUserId());
        user.setOwnerSubacctExt(ext);
        user.setMobile(mobile);
        user.setEmail(email);
        user.setQq(qq);
        user.setNickName(nickName);

        umsRequest.setUser(user);
        umsRequest.setShipAreas(shipAreas);

        UmsResponse resp = us.updateOwnerExtInfo(umsRequest);

        LOGGER.info("addUser updateOwnerSubacctExtInfo out");

        return resp;
    }

    /**
     * 更新合作伙伴扩展信息
     * @param ext
     * @param request
     * @param response
     * @return
     */
    @ApiOperation(value = "更新合作伙伴扩展信息")
    @RequestMapping(value = "updateHelperSubacctExtInfo", method = RequestMethod.POST)
    @ResponseBody
    public UmsResponse updateHelperSubacctExtInfo(UmsHelperSubacctExt ext, HttpServletRequest request, HttpServletResponse response)
    {
        LOGGER.info("addUser updateHelperSubacctExtInfo in");
        UmsRequest umsRequest = new UmsRequest();
        String mobile = request.getParameter("mobile");
        String email = request.getParameter("email");
        String qq = request.getParameter("qq");

        UmsUser user = new UmsUser();

        user.setUserId(ext.getUserId());
        user.setHelperSubacctExt(ext);
        user.setMobile(mobile);
        user.setEmail(email);
        user.setQq(qq);

        umsRequest.setUser(user);

        UmsResponse resp = us.updateHelperExtInfo(umsRequest);

        LOGGER.info("addUser updateHelperSubacctExtInfo out");

        return resp;
    }

    /**
     * 更新会员扩展信息
     * @param ext
     * @param request
     * @param response
     * @return
     */
    @ApiOperation(value = "更新会员扩展信息")
    @RequestMapping(value = "updateCustomerSubacctExtInfo", method = RequestMethod.POST)
    @ResponseBody
    public UmsResponse updateCustomerSubacctExtInfo(UmsCustomerSubacctExt ext, HttpServletRequest request, HttpServletResponse response)
    {
        LOGGER.info("addUser updateCustomerSubacctExtInfo in");
        UmsRequest umsRequest = new UmsRequest();
        String mobile = request.getParameter("mobile");
        String email = request.getParameter("email");
        String qq = request.getParameter("qq");

        UmsUser user = new UmsUser();

        user.setUserId(ext.getUserId());
        user.setCustomerSubacctExt(ext);
        user.setMobile(mobile);
        user.setEmail(email);
        user.setQq(qq);

        umsRequest.setUser(user);

        UmsResponse resp = us.updateCustomerExtInfo(umsRequest);

        LOGGER.info("addUser updateCustomerSubacctExtInfo out");

        return resp;
    }

    /**
     * 不分页查询用户信息
     * @param request
     * @param response
     * @return
     */
    @ApiOperation(value = "不分页查询用户")
    @RequestMapping(value = "getUserList", method = RequestMethod.POST)
    @ResponseBody
    public String getUserList(HttpServletRequest request, HttpServletResponse response)
    {
        LOGGER.info("ums getUserList in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);


        Map<String, String[]> paramsMap = request.getParameterMap();

        String retString = "";

        Map<String, Object> params = new HashMap<String, Object>();
        Set<Map.Entry<String, String[]>> entrySet = paramsMap.entrySet();
        for (Map.Entry<String, String[]> entry : entrySet) {
            params.put(entry.getKey(), entry.getValue()[0]);
        }
        params.put("belongTo", userModel.getUserId());

        retString = us.getUserList(params);

        LOGGER.info("ums getUserList out");

        return retString;
    }

    /**
     * 校验用户原密码
     * @param userId
     * @param password
     * @param request
     * @return
     */
    @ApiOperation(value = "校验用户原密码")
    @RequestMapping(value = "checkUserOriginPass", method = RequestMethod.POST)
    @ResponseBody
    public UmsResponse checkUserOriginPass(String userId, String password, HttpServletRequest request)
    {
        UmsRequest umsRequest = new UmsRequest();
        UmsUser user = new UmsUser();

        user.setUserId(userId);
        user.setPassword(RSAUtil.decrypt(password));
        umsRequest.setUser(user);

        return us.checkUserOriginPass(umsRequest);
    }

    /**
     * 更新用户密码
     * @param userId
     * @param newPassword
     * @param appKey
     * @param request
     * @return
     */
    @ApiOperation(value = "更新用户密码")
    @RequestMapping(value = "updateUserPassword", method = RequestMethod.POST)
    @ResponseBody
    public UmsPassResponse updateUserPassword(String userId, String newPassword, String appKey, HttpServletRequest request){
        UmsPassRequest umsPassRequest = new UmsPassRequest();
        UmsUser user = new UmsUser();
        user.setPassword(RSAUtil.decrypt(newPassword));
        user.setUserId(userId);
        umsPassRequest.setUser(user);
        umsPassRequest.setAppKey(appKey);

        return us.updateUserPass(umsPassRequest);
    }

    /**
     * 根据原密码修改新密码
     * @param userId
     * @param newPassword
     * @param oldPassword
     * @param request
     * @return
     */
    @ApiOperation(value = "根据原密码修改新密码")
    @RequestMapping(value = "updateUserPassByOldPass", method = RequestMethod.POST)
    @ResponseBody
    public UmsPassResponse updateUserPassByOldPass(@RequestParam("userId") String userId, @RequestParam("newPassword") String newPassword,
                                                        @RequestParam("oldPassword") String oldPassword, HttpServletRequest request){
        UmsPassRequest umsPassRequest = new UmsPassRequest();

        umsPassRequest.setUserId(userId);
        umsPassRequest.setNewPass(RSAUtil.decrypt(newPassword));
        umsPassRequest.setOldPass(RSAUtil.decrypt(oldPassword));

        return us.updateUserPassByOldPass(umsPassRequest);
    }

    /**
     * 新增供应商
     * @param subacctExt
     * @param request
     * @return
     */
    @RequestMapping(value = "/addSupplier", method = RequestMethod.POST)
    @ResponseBody
    public UmsResponse addSupplier(UmsUser user, UmsOwnerSubacctExt subacctExt,String shipAreas, HttpServletRequest request)
    {
        LOGGER.info("addSupplier request in, request user {}", user.toString());

        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

        String ip = HttpRequestInfoUtil.getRemoteAddr(request);
        user.setRegIp(ip);
        user.setPassword(RSAUtil.decrypt(user.getPassword()));
        user.setBelongTo(userModel.getUserId());
        user.setUserType(4);

        user.setOwnerSubacctExt(subacctExt);

        UmsRequest umsRequest = new UmsRequest();
        umsRequest.setUser(user);
        umsRequest.setOwnerType(2);
        umsRequest.setShipAreas(shipAreas);


        LOGGER.info("addSupplier request out");
        return us.addUserNoAccount(umsRequest);
    }

    /**
     * 获取用户开通功能信息
     */
    @RequestMapping(value = "/getUserFuncById", method = RequestMethod.POST)
    @ResponseBody
    public UmsFunctionResponse getUserFuncById(HttpServletRequest request, String userId, String funcId){
        LOGGER.info("ums getUserFunctionById in");
        LOGGER.info("ums getUserFunctionById in,the parm userId is:{},funcId is:{}",userId,funcId);
        UmsFunctionResponse response = umsFunctionService.isOpenFunction(userId,funcId);
        LOGGER.info("ums getUserFunctionById out");
        return response;
    }

    /**
     * 获取用户开通功能信息
     */
    @RequestMapping(value = "/getUserFunc", method = RequestMethod.GET)
    @ResponseBody
    public UmsFunctionResponse getUserFuncById(HttpServletRequest request, String funcId){
        LOGGER.info("ums getUserFunctionById in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

        LOGGER.info("ums getUserFunctionById in,the parm userId is:{},funcId is:{}", userModel.getUserId(), funcId);
        UmsFunctionResponse response = umsFunctionService.isOpenFunction(userModel.getUserId(), funcId);
        LOGGER.info("ums getUserFunctionById out");
        return response;
    }

    /**
     * 为用户添加联系人
     * @param user
     * @param request
     * @return
     */
    @RequestMapping(value = "/addContactForUser/{userId}", method = RequestMethod.POST)
    @ResponseBody
    public UmsResponse addcContactForUser(@PathVariable String userId, UmsUser user, HttpServletRequest request) {
        String ip = HttpRequestInfoUtil.getRemoteAddr(request);
        user.setRegIp(ip);
        user.setBelongTo(userId);
        user.setUserType(6); //6-常用联系人

        UmsRequest umsRequest = new UmsRequest();
        umsRequest.setUser(user);

        UmsResponse resp = us.addTopContacts(umsRequest);
        return resp;
    }
//    /**
//     * 查询非A用户下联系人信息
//     * qryUserId、userType
//     */
//    @RequestMapping(value = "/qryContactLstForUser", method = RequestMethod.POST)
//    @ResponseBody
//    public UmsResponse qryContactLstForUser(HttpServletRequest request, String qryUserId, String userType){
//        Map<String,Object> map = new HashMap<String,Object>();
//        map.put("qryUserId",qryUserId);
//        map.put("userType",userType);
//        UmsResponse response = us.qryContactLstForUser(map);
//        return response;
//    }

    /**
     * 为用户添加主账号
     * @param request
     * @param userId
     * @param userName
     * @param password
     * @return
     */
    @RequestMapping(value = "/addUserNameForUser/{userId}", method = RequestMethod.POST)
    @ResponseBody
    public UmsResponse setUserNameForUser(HttpServletRequest request,@PathVariable String userId,String userName,String password){
        UmsRequest req = new UmsRequest();
        req.setUserId(userId);
        req.setUserName(userName);
        req.setPassword(RSAUtil.decrypt(password));
        UmsResponse response = us.setUserNameForUser(req);
        return response;
    }

    /**
     * 按用户编号，查询用户信息
     */
    @RequestMapping(value = "/qryUserInfoByUserId/{userId}", method = RequestMethod.GET)
    @ResponseBody
    public String qryUserInfoByUserId(HttpServletRequest request,@PathVariable String userId){
        Map<String,Object> map = new HashMap<String,Object>();
        map.put("userId",userId);
        String str = us.qryUserInfoByUserId(map);
        return str;
    }
}




