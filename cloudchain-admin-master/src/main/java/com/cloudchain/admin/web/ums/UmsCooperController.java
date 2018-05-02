package com.cloudchain.admin.web.ums;

import com.cloudchain.ums.api.UmsCooperService;
import com.cloudchain.ums.pojo.bo.cooper.UmsCooperInfo;
import com.cloudchain.ums.pojo.bo.cooper.UmsCooperRequest;
import com.cloudchain.ums.pojo.bo.cooper.UmsCooperResponse;
import com.cloudchain.util.param.CommonParamUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by wangqing on 2017/4/28.
 * 合作商操作类
 */
@Controller
@RequestMapping("/user/cooper")
public class UmsCooperController {
    private static final Logger log = LoggerFactory.getLogger(UmsCooperController.class);

    @Autowired
    private UmsCooperService umsCooperService;

    /**
     * 新增合作关系信息
     */
    @RequestMapping(value = "/addCooper", method = RequestMethod.POST)
    @ResponseBody
    public UmsCooperResponse addUmsCooper(HttpServletRequest request, UmsCooperInfo umsCooperInfo){
        log.info("[UmsCooperController.addUmsCooper] IN");
        UmsCooperRequest req = new UmsCooperRequest();
        CommonParamUtil.setRequestUserInfo(request,req);

        req.setUmsCooperInfo(umsCooperInfo);
        UmsCooperResponse response = umsCooperService.addUmsCooper(req);
        log.info("[UmsCooperController.addUmsCooper] OUT");
        return response;
    }

    /**
     * 根据ID查询合作关系信息
     */
    @RequestMapping(value = "/getCooper/{cooperId}", method = RequestMethod.GET)
    @ResponseBody
    public UmsCooperResponse getUmsCooperById(HttpServletRequest request, @PathVariable String cooperId){
        log.info("[UmsCooperController.getUmsCooperById] IN");
        UmsCooperRequest req = new UmsCooperRequest();
        req.setCooperId(cooperId);
        UmsCooperResponse response = umsCooperService.getUmsCooperById(req);
        log.info("[UmsCooperController.getUmsCooperById] OUT");
        return response;
    }

    /**
     * 更新合作关系信息
     */
    @RequestMapping(value = "/updCooper/{cooperId}", method = RequestMethod.POST)
    @ResponseBody
    public UmsCooperResponse updUmsCooper(HttpServletRequest request, @PathVariable String cooperId, UmsCooperInfo umsCooperInfo){
        log.info("[UmsCooperController.updUmsCooper] IN");
        UmsCooperRequest req = new UmsCooperRequest();
        CommonParamUtil.setRequestUserInfo(request,req);

        req.setCooperId(cooperId);
        req.setUmsCooperInfo(umsCooperInfo);

        UmsCooperResponse response = umsCooperService.updUmsCooper(req);
        log.info("[UmsCooperController.updUmsCooper] OUT");
        return response;
    }

    /**
     * 批量删除合作关系信息
     */
    @RequestMapping(value = "/delCooper/{ids}", method = RequestMethod.POST)
    @ResponseBody
    public UmsCooperResponse delUmsCooper(HttpServletRequest request, @PathVariable String ids){
        log.info("[UmsCooperController.delUmsCooper] IN");
        UmsCooperRequest req = new UmsCooperRequest();
        CommonParamUtil.setRequestUserInfo(request,req);

        req.setCooperIds(ids);

        UmsCooperResponse response = umsCooperService.delUmsCooper(req);
        log.info("[UmsCooperController.delUmsCooper] OUT");
        return response;
    }

}
