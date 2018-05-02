package com.cloudchain.admin.web.ums;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.ums.api.UmsRoleService;
import com.cloudchain.ums.pojo.bo.role.UmsRoleRequest;
import com.cloudchain.ums.pojo.bo.role.UmsRoleResponse;
import com.cloudchain.ums.pojo.po.UmsRole;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Created by zhuhao on 2017/3/15.
 */
@Api(value = "role-api", description = "用户角色相关接口")
@Controller
@RequestMapping(path = "/sys/roleauth")
public class UmsRoleController {
    private static final Logger LOGGER = LoggerFactory.getLogger(UmsRoleController.class);

    @Autowired
    UmsRoleService umsRoleService;

    /**
     * 添加角色
     * @param umsRole
     * @param request
     * @return
     */
    @ApiOperation(value = "admin用户添加角色")
    @RequestMapping(value = "/add")
    @ResponseBody
    public UmsRoleResponse addRole(UmsRole umsRole, HttpServletRequest request)
    {
        LOGGER.info("UmsRoleController addRole in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

        UmsRoleRequest umsRoleRequest = new UmsRoleRequest();
        umsRole.setUserId(userModel.getUserId());
        umsRoleRequest.setUmsRole(umsRole);

        UmsRoleResponse umsRoleResponse = umsRoleService.addUmsRole(umsRoleRequest);

        LOGGER.info("UmsRoleController addRole out");
        return umsRoleResponse;
    }

    /**
     * 删除角色
     * @param roleId
     * @param request
     * @return
     */
    @ApiOperation(value = "删除角色")
    @RequestMapping(value = "/del")
    @ResponseBody
    public UmsRoleResponse deleteRole(String roleId, HttpServletRequest request)
    {
        LOGGER.info("UmsRoleController deleteRole in");

        UmsRoleRequest umsRoleRequest = new UmsRoleRequest();

        umsRoleRequest.setRoleId(roleId);

        UmsRoleResponse umsRoleResponse = umsRoleService.deleteUmsRole(umsRoleRequest);

        LOGGER.info("UmsRoleController deleteRole out");
        return umsRoleResponse;
    }

    /**
     * 更新角色信息
     * @param umsRole
     * @param request
     * @return
     */
    @ApiOperation(value = "更新角色信息")
    @RequestMapping(value = "/update")
    @ResponseBody
    public UmsRoleResponse updateRole(UmsRole umsRole, HttpServletRequest request)
    {
        LOGGER.info("UmsRoleController updateRole in");

        UmsRoleRequest umsRoleRequest = new UmsRoleRequest();

        umsRoleRequest.setUmsRole(umsRole);

        UmsRoleResponse umsRoleResponse = umsRoleService.updateUmsRole(umsRoleRequest);

        LOGGER.info("UmsRoleController updateRole out");
        return umsRoleResponse;
    }

    /**
     * 查看权限列表
     * @param request
     * @return
     */
    @ApiOperation(value = "查看角色列表")
    @RequestMapping(value = "/role")
    @ResponseBody
    public String getRoleList(HttpServletRequest request, HttpServletResponse response)
    {
        LOGGER.info("UmsRoleController getRoleList in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(request);

        Map<String, String[]> paramsMap = request.getParameterMap();
        Map<String, Object> map = new HashMap<String, Object>();
        Set<Map.Entry<String, String[]>> entrySet = paramsMap.entrySet();
        for (Map.Entry<String, String[]> entry : entrySet) {
            map.put(entry.getKey(), entry.getValue()[0]);
        }
        map.put("userId", userModel.getUserId());
        String retString = umsRoleService.getUmsRoleList(map);

        LOGGER.info("UmsRoleController getRoleList out");
        return retString;
    }

    /**
     * 更新权限资源关联
     * @param roleId
     * @param resoIds
     * @return
     */
    @ApiOperation(value = "更新角色和资源关联")
    @RequestMapping(value = "/updtRoleResoRel")
    @ResponseBody
    public UmsRoleResponse updtRoleResoRel(String roleId, String[] resoIds, HttpServletRequest servletRequest)
    {
        LOGGER.info("UmsRoleController getRoleList in");

        UmsRoleRequest request = new UmsRoleRequest();
        request.setRoleId(roleId);
        request.setResoIds(resoIds);

        UmsRoleResponse resp = umsRoleService.setRoleReso(request);

        LOGGER.info("UmsRoleController getRoleList out");
        return resp;
    }

    /**
     * 获取角色资源关联 isGet表示是否已经授权 0未授权1已授权
     * @param servletRequest
     * @return
     */
    @ApiOperation(value = "获取角色资源关联")
    @RequestMapping(value = "/{roleId}")
    @ResponseBody
    public String getUmsRoleResoList(@PathVariable String roleId, HttpServletRequest servletRequest)
    {
        LOGGER.info("UmsRoleController getUmsRoleResoList in");

        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);
        Map<String, String[]> paramsMap = servletRequest.getParameterMap();
        Map<String, Object> map = new HashMap<String, Object>();
        Set<Map.Entry<String, String[]>> entrySet = paramsMap.entrySet();
        for (Map.Entry<String, String[]> entry : entrySet) {
            map.put(entry.getKey(), entry.getValue()[0]);
        }

        map.put("roleId", roleId);
        map.put("userId", userModel.getUserId());
        map.put("sysId", 1);

        String retString = umsRoleService.getUmsRoleResoList(map);

        LOGGER.info("UmsRoleController getUmsRoleResoList out");
        return retString;
    }

}
