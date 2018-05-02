package com.cloudchain.admin.web.d2d;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.d2d.api.D2DCategoryService;
import com.cloudchain.d2d.pojo.bo.category.D2DCategoryRequest;
import com.cloudchain.d2d.pojo.bo.category.D2DCategoryResponse;
import com.cloudchain.d2d.pojo.po.D2DCategory;
import com.cloudchain.util.param.CommonParamUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by zhuhao on 2017/6/5.
 */
@Controller
@RequestMapping(value = "/d2d/category")
public class D2DShowCategoryController {

    private static final Logger LOGGER = LoggerFactory.getLogger(D2DShowCategoryController.class);

    @Autowired
    D2DCategoryService categoryService;

    /**
     * 查询子节点
     * @param request HttpServletRequest
     * @param parentId 父ID
     * @return resp
     */
    @ResponseBody
    @RequestMapping(value = "/queryChildren/{parentId}", method = RequestMethod.GET)
    public D2DCategoryResponse queryChildren(HttpServletRequest request, @PathVariable String parentId){
        LOGGER.info("[D2PShowCategoryController.queryChildren] IN");
        D2DCategoryRequest req = new D2DCategoryRequest();
        req.setParentId(parentId);
        D2DCategoryResponse resp = categoryService.queryChildren(req);
        LOGGER.info("[D2PShowCategoryController.queryChildren] OUT");
        return resp;
    }


    /**
     * 查询全部节点
     * @param request HttpServletRequest
     * @return resp
     */
    @ResponseBody
    @RequestMapping(value = "/queryAllNodes", method = RequestMethod.GET)
    public D2DCategoryResponse queryAllNodes(HttpServletRequest request){
        LOGGER.info("[D2PShowCategoryController.queryAllNodes] IN");
        D2DCategoryRequest req = new D2DCategoryRequest();
        D2DCategoryResponse resp = categoryService.queryAllNodes(req);
        LOGGER.info("[D2PShowCategoryController.queryAllNodes] OUT");
        return resp;
    }

    /**
     * 查看分类
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/listCategory", method = RequestMethod.GET)
    public D2DCategoryResponse listCategory(HttpServletRequest request)
    {
        LOGGER.info("[d2d listCategory] IN");

        D2DCategoryRequest req = new D2DCategoryRequest();
        D2DCategoryResponse resp = categoryService.queryAllNodes(req);
        List<D2DCategory> list = (List<D2DCategory>) resp.getData();

        List<D2DCategory> modelList = buildTree(list, "0");

        resp.setData(modelList);

        LOGGER.info("[d2d.listCategory] OUT");
        return resp;
    }

    private List<D2DCategory> buildTree(List<D2DCategory> list, String s) {
        if(list == null || list.size() == 0)
        {
            return null;
        }

        List<D2DCategory> temp = new ArrayList<D2DCategory>();
        for(int i=0;i<list.size();i++)
        {
            D2DCategory category = list.get(i);
            if(s.equals(category.getParentCId()))
            {
                temp.add(category);
                List<D2DCategory> childMenus = buildTree(list, category.getcId());
                category.setChildren(childMenus);
            }
        }
        return temp;
    }

}
