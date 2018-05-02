package com.cloudchain.admin.web.ums;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.ums.api.UmsResourceService;
import com.cloudchain.ums.pojo.bo.resource.UmsResourceRequest;
import com.cloudchain.ums.pojo.bo.resource.UmsResourceResponse;
import com.cloudchain.ums.pojo.po.BisResource;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * Created by zhuhao on 2017/3/14.
 */
@Api(value = "user-resource-api", description = "用户资源相关接口")
@Controller
@RequestMapping(path = "/sys/resource")
public class UmsResourceController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UmsResourceController.class);

    private static final int SYS_ID_ADMIN = 1;

    private static final List<String> MENU_TYPE = new ArrayList<String>(){{add("0"); add("1");}};  ;

    @Autowired
    UmsResourceService rs;

    /**
     * 查看系统编号
     *
     * @param request
     * @return
     */
    @ApiOperation(value = "查看系统编号")
    @RequestMapping(value = "/getBisSysCode")
    @ResponseBody
    public UmsResourceResponse getBisSysCode(HttpServletRequest request) {
        LOGGER.info("UmsResourceController.getBisSysCode in");

        UmsResourceRequest resourceRequest = new UmsResourceRequest();

        UmsResourceResponse resp = rs.getBisSysCode(resourceRequest);

        LOGGER.info("UmsResourceController.getBisSysCode out");
        return resp;
    }

    /**
     * 查看系统功能列表
     *
     * @param request
     * @return
     */
    @ApiOperation(value = "查看系统功能列表")
    @RequestMapping(value = "/getBisSysFunction")
    @ResponseBody
    public String getBisSysFunction(HttpServletRequest request) {
        LOGGER.info("UmsResourceController.getBisSysFunction in");

        Map<String, String[]> paramsMap = request.getParameterMap();

        Map<String, Object> map = new HashMap<String, Object>();
        Set<Map.Entry<String, String[]>> entrySet = paramsMap.entrySet();
        for (Map.Entry<String, String[]> entry : entrySet) {
            map.put(entry.getKey(), entry.getValue()[0]);
        }

        String resp = rs.getBisSysFunction(map);

        LOGGER.info("UmsResourceController.getBisSysFunction out");
        return resp;
    }

    /**
     * 添加系统资源
     *
     * @param bisResource
     * @param request
     * @return
     */
    @ApiOperation(value = "添加系统资源")
    @RequestMapping(value = "/add")
    @ResponseBody
    public UmsResourceResponse addBisResource(BisResource bisResource, HttpServletRequest request) {
        LOGGER.info("UmsResourceController.addBisResource in");

        UmsResourceRequest resourceRequest = new UmsResourceRequest();
        resourceRequest.setBisResource(bisResource);

        UmsResourceResponse resp = rs.addBisResource(resourceRequest);

        LOGGER.info("UmsResourceController.addBisResource out");
        return resp;
    }

    /**
     * 删除系统资源
     * @param resoId
     * @param request
     * @return
     */
    @ApiOperation(value = "删除系统资源")
    @RequestMapping(value = "/del")
    @ResponseBody
    public UmsResourceResponse delBisResource(String resoId, HttpServletRequest request) {
        LOGGER.info("UmsResourceController.delBisResource in");

        UmsResourceRequest resourceRequest = new UmsResourceRequest();

        resourceRequest.setResoId(resoId);

        UmsResourceResponse resp = rs.delBisResource(resourceRequest);

        LOGGER.info("UmsResourceController.delBisResource out");
        return resp;
    }

    /**
     * 更新系统资源
     * @param bisResource
     * @param request
     * @return
     */
    @ApiOperation(value = "更新系统资源")
    @RequestMapping(value = "/update")
    @ResponseBody
    public UmsResourceResponse updateBisResource(BisResource bisResource, HttpServletRequest request) {
        LOGGER.info("UmsResourceController.updateBisResource in");

        UmsResourceRequest resourceRequest = new UmsResourceRequest();

        resourceRequest.setBisResource(bisResource);

        UmsResourceResponse resp = rs.updateBisResource(resourceRequest);

        LOGGER.info("UmsResourceController.updateBisResource out");
        return resp;
    }

    /**
     * 查看系统资源列表
     * @param request
     * @param response
     * @return
     */
    @ApiOperation(value = "查看系统资源列表")
    @RequestMapping(value = "/tree/{sysId}")
    @ResponseBody
    public String getBisResources(@PathVariable String sysId, HttpServletRequest request, HttpServletResponse response)
    {
        response.setCharacterEncoding("UTF-8");
        LOGGER.info("UmsResourceController.getBisResources in");

        Map<String, String[]> paramsMap = request.getParameterMap();

        Map<String, Object> params = new HashMap<String, Object>();
        Set<Map.Entry<String, String[]>> entrySet = paramsMap.entrySet();
        for (Map.Entry<String, String[]> entry : entrySet) {
            params.put(entry.getKey(), entry.getValue()[0]);
        }
        String retString = rs.getBisResources(params);

        LOGGER.info("UmsResourceController.getBisResources out");
        return retString;
    }

    @ApiOperation(value = "查看用户资源")
    @RequestMapping(value = "/getUserResources")
    @ResponseBody
    public String getUserResources(HttpServletRequest request, HttpServletResponse response)
    {
        response.setCharacterEncoding("UTF-8");
        LOGGER.info("UmsResourceController.getUserResources in");

        Map<String, String[]> paramsMap = request.getParameterMap();

        Map<String, Object> params = new HashMap<String, Object>();
        Set<Map.Entry<String, String[]>> entrySet = paramsMap.entrySet();
        for (Map.Entry<String, String[]> entry : entrySet) {
            params.put(entry.getKey(), entry.getValue()[0]);
        }
        String retString = rs.getUserResources(params);

        LOGGER.info("UmsResourceController.getUserResources out");
        return retString;
    }

    /**
     * admin获取菜单
     * @param servletRequest
     * @param response
     * @return
     */
    @ApiOperation(value = "获取用户登录菜单")
    @RequestMapping(value = "/menu", method = RequestMethod.GET)
    @ResponseBody
    public String menu(HttpServletRequest servletRequest, HttpServletResponse response)
    {
        response.setCharacterEncoding("UTF-8");
        LOGGER.info("UmsResourceController.menu in");

        Map<String, Object> params = new HashMap<String, Object>();

        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        String userId = userModel.getUserId();
        String operatorId = userModel.getOperatorId();

        String retString = null;

        if (userId.equals(operatorId))
        {
            params.put("userId", userId);
            params.put("sysId", SYS_ID_ADMIN);
            params.put("types", MENU_TYPE);

            retString = rs.getUserResources(params);
        }
        else
        {
            params.put("userId", userId);
            params.put("sysId", SYS_ID_ADMIN);
            params.put("types", MENU_TYPE);
            params.put("empId", operatorId);

            retString = rs.getRoleResources(params);
        }

        LOGGER.info("UmsResourceController.menu out");
        return retString;
    }

    /**
     * admin获取菜单
     * @param servletRequest
     * @param response
     * @return
     */
    @ApiOperation(value = "获取用户登录菜单")
    @RequestMapping(value = "/menu/{pId}", method = RequestMethod.GET)
    @ResponseBody
    public String menu(HttpServletRequest servletRequest, HttpServletResponse response, @PathVariable String pId)
    {
        response.setCharacterEncoding("UTF-8");
        LOGGER.info("UmsResourceController.menu in");

        Map<String, Object> params = new HashMap<String, Object>();

        CommUserModel userModel = CommonParamUtil.getUserFromSession(servletRequest);

        String userId = userModel.getUserId();
        String operatorId = userModel.getOperatorId();

        String retString = null;

        if (userId.equals(operatorId))
        {
            params.put("userId", userId);
            params.put("parentId", pId);
            params.put("sysId", SYS_ID_ADMIN);
            params.put("types", MENU_TYPE);

            retString = rs.getUserResources(params);
        }
        else
        {
            params.put("userId", userId);
            params.put("parentId", pId);
            params.put("sysId", SYS_ID_ADMIN);
            params.put("types", MENU_TYPE);
            params.put("empId", operatorId);

            retString = rs.getRoleResources(params);
        }

        LOGGER.info("UmsResourceController.menu out");
        return retString;
    }
}