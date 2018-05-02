package com.cloudchain.admin.web.ums;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.platform.util.HttpRequestInfoUtil;
import com.cloudchain.platform.util.RSAUtil;
import com.cloudchain.ums.api.UmsEmployeeService;
import com.cloudchain.ums.api.UserService;
import com.cloudchain.ums.pojo.bo.employee.UmsEmployeeRequest;
import com.cloudchain.ums.pojo.bo.employee.UmsEmployeeResponse;
import com.cloudchain.ums.pojo.bo.session.UmsSessionRequest;
import com.cloudchain.ums.pojo.bo.user.UmsPassRequest;
import com.cloudchain.ums.pojo.bo.user.UmsPassResponse;
import com.cloudchain.ums.pojo.po.UmsEmployee;
import com.cloudchain.ums.pojo.po.UmsOrganization;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Map;

/**
 * Created by zhuhao on 2017/3/7.
 */
@Api(value = "user-employee-api", description = "员工相关接口")
@Controller
@RequestMapping(path = "/sys/orguser")
public class UmsEmployeeController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UmsEmployeeController.class);

    /**
     * userid_session
     */
    private static final String UMS_SESSION_ID = "b.g.x.session.operator";

    /**
     * 用户
     */
    public static final String UMS_EMPLOYEE = "umsEmployee";

    @Autowired
    UmsEmployeeService ues;

    @Autowired
    UserService us;

    /**
     * 查询组织架构，不包含员工详情
     * @return
     */
    @ApiOperation(value = "查看组织架构")
    @RequestMapping(value = "/org")
    @ResponseBody
    public UmsEmployeeResponse getUserOrganization(HttpServletRequest servletRequest)
    {
        LOGGER.info("UmsEmployeeController.getUserOrganization in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        UmsEmployeeRequest request = new UmsEmployeeRequest();

        request.setUserId(userModel.getUserId());

        UmsEmployeeResponse umsEmployeeResponse = ues.getUserOrganization(request);

        LOGGER.info("UmsEmployeeController.getUserOrganization out");

        return umsEmployeeResponse;
    }

    /**
     * 查询组织架构，包含员工信息
     * @param userId
     * @return
     */
    @ApiOperation(value = "查看组织架构")
    @RequestMapping(value = "/getUserOrganizationDetail")
    @ResponseBody
    public UmsEmployeeResponse getUserOrganizationDetail(String userId)
    {
        LOGGER.info("UmsEmployeeController.getUserOrganizationDetail in, request userId {}", userId);

        UmsEmployeeRequest request = new UmsEmployeeRequest();

        request.setUserId(userId);

        UmsEmployeeResponse umsEmployeeResponse = ues.getUserOrganizationDetail(request);

        LOGGER.info("UmsEmployeeController.getUserOrganizationDetail out");

        return umsEmployeeResponse;
    }

    /**
     * 添加员工
     * @param orgId
     * @param umsEmployee
     * @param request
     * @param response
     * @return
     */
    @ApiOperation(value = "新增员工")
    @RequestMapping(value = "/adduser", method = RequestMethod.POST)
    @ResponseBody
    public UmsEmployeeResponse addEmployee(String orgId, String roleId, UmsEmployee umsEmployee, HttpServletRequest request, HttpServletResponse response)
    {
        LOGGER.info("UmsEmployeeController.addEmployee in, request orgId {}, umsEmployee {}, roleId {}", orgId, umsEmployee, roleId);
        UmsEmployeeRequest umsEmployeeRequest = new UmsEmployeeRequest();
        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

        umsEmployee.setPassword(RSAUtil.decrypt(umsEmployee.getPassword()));
        umsEmployee.setUserType(1);
        umsEmployee.setBelongTo(userModel.getUserId());

        umsEmployeeRequest.setOrgId(orgId);
        umsEmployeeRequest.setEmployee(umsEmployee);
        umsEmployeeRequest.setRoleId(roleId);

        UmsEmployeeResponse umsEmployeeResponse = ues.addEmployee(umsEmployeeRequest);
        LOGGER.info("UmsEmployeeController.addEmployee out");
        return umsEmployeeResponse;
    }

    /**
     * 更新员工信息
     * @param umsEmployee
     * @param request
     * @param response
     * @return
     */
    @ApiOperation(value = "员工信息更新")
    @RequestMapping(value = "/updateuser", method = RequestMethod.POST)
    @ResponseBody
    public UmsEmployeeResponse updateEmployee(String orgId, String roleId, UmsEmployee umsEmployee, HttpServletRequest request, HttpServletResponse response)
    {
        LOGGER.info("UmsEmployeeController.updateEmployee in, request umsEmployee {}, orgId {}, roleId {}", umsEmployee, orgId, roleId);

        UmsEmployeeRequest umsEmployeeRequest = new UmsEmployeeRequest();
        umsEmployeeRequest.setEmployee(umsEmployee);
        umsEmployeeRequest.setRoleId(roleId);
        umsEmployeeRequest.setOrgId(orgId);

        UmsEmployeeResponse umsEmployeeResponse = ues.updateEmployee(umsEmployeeRequest);
        LOGGER.info("UmsEmployeeController.updateEmployee out");
        return umsEmployeeResponse;
    }

    /**
     * 删除员工信息
     * @param empId
     * @param request
     * @return
     */
    @ApiOperation(value = "删除员工")
    @RequestMapping(value = "/deluser", method = RequestMethod.POST)
    @ResponseBody
    public UmsEmployeeResponse delEmployee(String empId, HttpServletRequest request)
    {
        LOGGER.info("UmsEmployeeController.delEmployee in, request empId {}", empId);

        UmsEmployeeRequest umsEmployeeRequest = new UmsEmployeeRequest();

        UmsEmployee umsEmployee = new UmsEmployee();
        umsEmployee.setEmpId(empId);

        umsEmployeeRequest.setEmployee(umsEmployee);

        UmsEmployeeResponse umsEmployeeResponse = ues.delEmployee(umsEmployeeRequest);
        LOGGER.info("UmsEmployeeController.delEmployee out");
        return umsEmployeeResponse;
    }


    /**
     * 添加部门信息
     * @param organization
     * @param request
     * @return
     */
    @ApiOperation(value = "addorg")
    @RequestMapping(value = "/addorg", method = RequestMethod.POST)
    @ResponseBody
    public UmsEmployeeResponse addOrganization(UmsOrganization organization, HttpServletRequest request)
    {
        LOGGER.info("UmsEmployeeController.addOrganization in, request addOrganization {}", organization);

        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

        UmsEmployeeRequest umsEmployeeRequest = new UmsEmployeeRequest();

        organization.setUserId(userModel.getUserId());
        umsEmployeeRequest.setUmsOrganization(organization);


        UmsEmployeeResponse umsEmployeeResponse = ues.addOrganization(umsEmployeeRequest);

        LOGGER.info("UmsEmployeeController.addOrganization out");

        return umsEmployeeResponse;
    }

    /**
     * 更新部门信息
     * @param organization
     * @param request
     * @return
     */
    @ApiOperation(value = "更新部门信息")
    @RequestMapping(value = "/updateorg", method = RequestMethod.POST)
    @ResponseBody
    public UmsEmployeeResponse updateOrganization(UmsOrganization organization, HttpServletRequest request)
    {
        LOGGER.info("UmsEmployeeController.updateOrganization in, request addOrganization {}", organization);
        UmsEmployeeRequest umsEmployeeRequest = new UmsEmployeeRequest();

        umsEmployeeRequest.setUmsOrganization(organization);

        UmsEmployeeResponse umsEmployeeResponse = ues.updateOrganization(umsEmployeeRequest);
        LOGGER.info("UmsEmployeeController.updateOrganization out");
        return umsEmployeeResponse;
    }

    /**
     * 删除部门
     * @param orgId
     * @param request
     * @return
     */
    @ApiOperation(value = "删除部门")
    @RequestMapping(value = "/delorg", method = RequestMethod.POST)
    @ResponseBody
    public UmsEmployeeResponse delOrganization(String orgId, HttpServletRequest request)
    {
        LOGGER.info("UmsEmployeeController.delOrganization in, request orgId {}", orgId);
        UmsEmployeeRequest umsEmployeeRequest = new UmsEmployeeRequest();

        umsEmployeeRequest.setOrgId(orgId);

        UmsEmployeeResponse umsEmployeeResponse = ues.delOrganization(umsEmployeeRequest);
        LOGGER.info(" UmsEmployeeController.updateOrganization out");
        return umsEmployeeResponse;
    }

    /**
     * 员工登录接口
     * @param request
     * @param response
     * @return
     */
    @ApiOperation(value = "员工登录入口")
    @RequestMapping(value = "/doLogin", method = RequestMethod.POST)
    @ResponseBody
    public UmsEmployeeResponse doLogin(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        LOGGER.info("login request in");
        String uName = request.getParameter("uName");
        String uPass = request.getParameter("uPass");
        String adminName = request.getParameter("adminName");

        LOGGER.info("begin login , userName {}", uName);

        String ip = HttpRequestInfoUtil.getRemoteAddr(request);

        UmsEmployee employee = new UmsEmployee();
        employee.setUserName(uName);
        employee.setPassword(RSAUtil.decrypt(uPass));
        employee.setLastLoginIp(ip);

        UmsEmployeeRequest umsEmployeeRequest = new UmsEmployeeRequest();
        umsEmployeeRequest.setEmployee(employee);
        umsEmployeeRequest.setLoginFrom(1);
        umsEmployeeRequest.setAdminName(adminName);

        UmsEmployeeResponse resp = ues.login(umsEmployeeRequest);

        String status = resp.getStatus();
        if (ResultCode.SUCCESS.equals(status))
        {
            //登录成功，session操作
            Map<String, Object> resultMap = resp.getResultMap();
            UmsEmployee u = (UmsEmployee) resultMap.get(UMS_EMPLOYEE);
            session.setAttribute(UMS_SESSION_ID, u);
            resultMap.remove(UMS_EMPLOYEE);
            session.setAttribute("funcMap", resultMap);
            session.setMaxInactiveInterval(120*60);

            //存储session信息
            String sessionId = session.getId();
            String key = UMS_SESSION_ID + u.getEmpId();
            UmsSessionRequest sessionRequest = new UmsSessionRequest();
            sessionRequest.setKey(key);
            sessionRequest.setValue(sessionId);
            us.sessionCache(sessionRequest);
        }

        LOGGER.debug("uName:{}, uPass:{}", uName, uPass);
        return resp;
    }

    /**
     * 根据原密码修改密码
     * @param empId
     * @param newPassword
     * @param oldPassword
     * @param request
     * @return
     */
    @ApiOperation(value = "员工修改密码")
    @RequestMapping(value = "/updateEmpPassByOldPass", method = RequestMethod.POST)
    @ResponseBody
    public UmsPassResponse updateEmpPassByOldPass(@RequestParam("empId") String empId, @RequestParam("newPassword") String newPassword,
                                                  @RequestParam("oldPassword") String oldPassword, HttpServletRequest request)
    {
        UmsPassRequest umsPassRequest = new UmsPassRequest();

        umsPassRequest.setEmpId(empId);
        umsPassRequest.setNewPass(RSAUtil.decrypt(newPassword));
        umsPassRequest.setOldPass(RSAUtil.decrypt(oldPassword));

        return ues.updateEmpPassByOldPass(umsPassRequest);
    }

}

