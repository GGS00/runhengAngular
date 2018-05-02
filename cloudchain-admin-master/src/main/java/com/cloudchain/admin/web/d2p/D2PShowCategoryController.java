package com.cloudchain.admin.web.d2p;

import com.cloudchain.d2p.api.CategoryService;
import com.cloudchain.d2p.pojo.bo.D2PResponse;
import com.cloudchain.d2p.pojo.bo.category.CategoryRequest;
import com.cloudchain.d2p.pojo.bo.category.CategoryResponse;
import com.cloudchain.d2p.pojo.po.D2PCategory;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
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
 * Created by LiuKai on 2017/5/9.
 */
@Api(value = "d2p-goods-category", description = "批发系统商品展示分类相关接口")
@Controller
@RequestMapping(value = "/d2p/category")
public class D2PShowCategoryController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(D2PShowCategoryController.class);

    @Autowired
    private CategoryService categoryService;

    /**
     * 查询子节点
     * @param request HttpServletRequest
     * @param parentId 父ID
     * @return resp
     */
    @ResponseBody
    @ApiOperation(value = "查询子节点")
    @RequestMapping(value = "/queryChildren/{parentId}", method = RequestMethod.POST)
    public D2PResponse queryChildren(HttpServletRequest request, @PathVariable String parentId){
        logger.info("[D2PShowCategoryController.queryChildren] IN");
        CategoryRequest req = new CategoryRequest();
        req.setParentId(parentId);
        CommonParamUtil.setD2POperator(request, req);
        CategoryResponse resp = null;
        try {
            resp = categoryService.queryChildren(req);
        } catch (Exception e) {
            logger.error("[D2PShowCategoryController.queryChildren] error", e);
            resp = new CategoryResponse();
            resp.setStatus(ResultCode.SYSTEM_EXCEPTION);
        }
        logger.info("[D2PShowCategoryController.queryChildren] OUT");
        return resp;
    }


    /**
     * 查询全部节点
     * @param request HttpServletRequest
     * @return resp
     */
    @ResponseBody
    @ApiOperation(value = "查询全部节点")
    @RequestMapping(value = "/queryAllNodes", method = RequestMethod.POST)
    public D2PResponse queryAllNodes(HttpServletRequest request){
        logger.info("[D2PShowCategoryController.queryAllNodes] IN");
        CategoryRequest req = new CategoryRequest();
        CommonParamUtil.setD2POperator(request, req);
        CategoryResponse resp = null;
        try {
            resp = categoryService.queryAllNodes(req);
        } catch (Exception e) {
            logger.error("[D2PShowCategoryController.queryAllNodes] error", e);
            resp = new CategoryResponse();
            resp.setStatus(ResultCode.SYSTEM_EXCEPTION);
        }
        logger.info("[D2PShowCategoryController.queryAllNodes] OUT");
        return resp;
    }


    /**
     * 新增子节点
     * @param request HttpServletRequest
     * @param parentId 父ID
     * @return resp
     */
    @ResponseBody
    @ApiOperation(value = "新增子节点")
    @RequestMapping(value = "/addChild/{parentId}", method = RequestMethod.POST)
    public D2PResponse addChild(HttpServletRequest request, @PathVariable String parentId, D2PCategory category){
        logger.info("[D2PShowCategoryController.addChild] IN");
        CategoryRequest req = new CategoryRequest();
        req.setParentId(parentId);
        req.setCategory(category);
        CommonParamUtil.setD2POperator(request, req);
        CategoryResponse resp = null;
        try {
            resp = categoryService.save(req);
        } catch (Exception e) {
            logger.error("[D2PShowCategoryController.addChild] error", e);
            resp = new CategoryResponse();
            resp.setStatus(ResultCode.SYSTEM_EXCEPTION);
        }
        logger.info("[D2PShowCategoryController.addChild] OUT");
        return resp;
    }


    /**
     * 修改节点
     * @param request HttpServletRequest
     * @param parentId 父ID
     * @return resp
     */
    @ResponseBody
    @ApiOperation(value = "修改节点")
    @RequestMapping(value = "/update/{parentId}", method = RequestMethod.POST)
    public D2PResponse updateChild(HttpServletRequest request, @PathVariable String parentId, D2PCategory category){
        logger.info("[D2PShowCategoryController.updateChild] IN");
        CategoryRequest req = new CategoryRequest();
        req.setParentId(parentId);
        req.setCategory(category);
        CommonParamUtil.setD2POperator(request, req);
        CategoryResponse resp = null;
        try {
            resp = categoryService.update(req);
        } catch (Exception e) {
            logger.error("[D2PShowCategoryController.updateChild] error", e);
            resp = new CategoryResponse();
            resp.setStatus(ResultCode.SYSTEM_EXCEPTION);
        }
        logger.info("[D2PShowCategoryController.updateChild] OUT");
        return resp;
    }

    /**
     * 删除节点
     * @param request HttpServletRequest
     * @param id ID
     * @return resp
     */
    @ResponseBody
    @ApiOperation(value = "删除节点")
    @RequestMapping(value = "/delete/{id}", method = RequestMethod.POST)
    public D2PResponse deleteChild(HttpServletRequest request, @PathVariable String id){
        logger.info("[D2PShowCategoryController.deleteChild] IN");
        CategoryRequest req = new CategoryRequest();
        req.setcId(id);
        CommonParamUtil.setD2POperator(request, req);
        CategoryResponse resp = null;
        try {
            resp = categoryService.delete(req);
        } catch (Exception e) {
            logger.error("[D2PShowCategoryController.deleteChild] error", e);
            resp = new CategoryResponse();
            resp.setStatus(ResultCode.SYSTEM_EXCEPTION);
        }
        logger.info("[D2PShowCategoryController.deleteChild] OUT");
        return resp;
    }


    /**
     * 改变顺序
     * @param request HttpServletRequest
     * @param parentId ID
     * @return resp
     */
    @ResponseBody
    @ApiOperation(value = "改变顺序")
    @RequestMapping(value = "/changeSort/{parentId}", method = RequestMethod.POST)
    public D2PResponse changeSort(HttpServletRequest request, @PathVariable String parentId, @RequestParam String sortIds){
        logger.info("[D2PShowCategoryController.changeSort] IN");
        CategoryRequest req = new CategoryRequest();
        req.setParentId(parentId);
        List<String> sortIdList = new ArrayList<>(Arrays.asList(sortIds.split(",")));
        req.setSortIds(sortIdList);
        CommonParamUtil.setD2POperator(request, req);
        CategoryResponse resp = null;
        try {
            resp = categoryService.changeSort(req);
        } catch (Exception e) {
            logger.error("[D2PShowCategoryController.changeSort] error", e);
            resp = new CategoryResponse();
            resp.setStatus(ResultCode.SYSTEM_EXCEPTION);
        }
        logger.info("[D2PShowCategoryController.changeSort] OUT");
        return resp;
    }
}
