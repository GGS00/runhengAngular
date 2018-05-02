package com.cloudchain.admin.web.ums;

import com.cloudchain.ums.api.UmsIdentityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Created by zhuhao on 2017/7/5.
 */
@Controller
@RequestMapping(value = "/sys/identity")
public class UmsIdentityController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UmsIdentityController.class);

    @Autowired
    UmsIdentityService identityService;

    /**
     * 获取身份列表
     * @param request
     * @return
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ResponseBody
    public String list(HttpServletRequest request) {
        LOGGER.info("[UmsIdentityController.list] in");

        Map<String, String[]> paramsMap = request.getParameterMap();

        Map<String, Object> params = new HashMap<String, Object>();
        Set<Map.Entry<String, String[]>> entrySet = paramsMap.entrySet();
        for (Map.Entry<String, String[]> entry : entrySet) {
            params.put(entry.getKey(), entry.getValue()[0]);
        }

        String retString = identityService.getIdentitys(params);

        LOGGER.info("[UmsIdentityController.list] out");
        return retString;
    }
}
