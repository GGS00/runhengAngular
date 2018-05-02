package com.cloudchain.admin.web.gms;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.gms.api.CategoryService;
import com.cloudchain.gms.pojo.bo.CategoryRequest;
import com.cloudchain.gms.pojo.bo.CategoryResponse;
import com.cloudchain.gms.pojo.po.GmsCategory;
import com.cloudchain.gms.pojo.po.GmsTag;
import com.cloudchain.platform.common.ResultCode;
import com.cloudchain.util.param.CommonParamUtil;
import com.cloudchain.util.string.StringUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by lihao on 2017/3/7.
 */
@Api(value = "category-api", description = "分类相关接口")
@Controller
@RequestMapping(value = "/category")
public class GmsCategoryController {
    public static final Logger LOGGER = LoggerFactory.getLogger(GmsCategoryController.class);

    @Autowired
    CategoryService categoryService;

    /**
     * 查询分类列表
     *
     * @return
     */
    @ApiOperation(value = "查询分类列表")
    @ResponseBody
    @RequestMapping(value = "/getCategoryList", method = RequestMethod.GET)
    public CategoryResponse getCategoryList(HttpServletRequest request) {
        LOGGER.info("CategoryController.getCategoryList() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if (null == user) {
            LOGGER.error("user is not login.");
            return null;
        }

        String userId = user.getUserId();
        LOGGER.debug("get category list with userId {}.", userId);

        CategoryRequest req = new CategoryRequest();
        CommonParamUtil.setGmsOperator(request, req);
        CategoryResponse resp = categoryService.getCategoriesByUserId(req);
        LOGGER.debug("user {} has {} categorys.", resp.getData() == null ? 0 : resp.getData().size());

        LOGGER.info("CategoryController.getCategoryList() OUT");
        return resp;
    }


    /**
     * 查询分类下的品牌、属性和规格
     * @param request HttpServletRequest
     * @return CategoryResponse
     */
    @ApiOperation(value = "查询分类下的品牌、属性和规格")
    @ResponseBody
    @RequestMapping(value = "/getPSB/{cId}", method = RequestMethod.GET)
    public CategoryResponse getPSB(HttpServletRequest request, @PathVariable String cId) {
        LOGGER.info("CategoryController.getPSB() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if (null == user) {
            LOGGER.error("user is not login.");
            return null;
        }

        String userId = user.getUserId();
        LOGGER.debug("get category list with userId {}.", userId);

        CategoryRequest req = new CategoryRequest();
        req.setcId(cId);
        CommonParamUtil.setGmsOperator(request, req);
        CategoryResponse resp = categoryService.getPropAndSpecByCategory(req);
        LOGGER.debug("user {} has {} categorys.", resp.getData() == null ? 0 : resp.getData().size());

        LOGGER.info("CategoryController.getPSB() OUT");
        return resp;
    }


    /**
     * 查询分类子节点
     * @param request HttpServletRequest
     * @return CategoryResponse
     */
    @ApiOperation(value = "查询分类子节点")
    @ResponseBody
    @RequestMapping(value = "/getCategoryChildren/{parentId}", method = RequestMethod.GET)
    public CategoryResponse getCategoryChildren(HttpServletRequest request, @PathVariable String parentId) {
        LOGGER.info("CategoryController.getCategoryChildren() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if (null == user) {
            LOGGER.error("user is not login.");
            return null;
        }

        String userId = user.getUserId();
        LOGGER.debug("get category list with userId {}.", userId);

        CategoryRequest req = new CategoryRequest();
        CommonParamUtil.setGmsOperator(request, req);
        req.setParentId(parentId);
        CategoryResponse resp = categoryService.getCategoriesChildren(req);
        LOGGER.debug("user {} has {} categorys.", resp.getData() == null ? 0 : resp.getData().size());

        LOGGER.info("CategoryController.getCategoryChildren() OUT");
        return resp;
    }

    /**
     * 获取分类下的标签列表，包括规格列表
     *
     * @return
     */
    @ApiOperation(value = "根据分类获取标签列表包含规格列表")
    @ResponseBody
    @RequestMapping(value = "/getTagList/{cId}", method = RequestMethod.GET)
    public CategoryResponse getTagList(@PathVariable String cId, HttpServletRequest request) {
        LOGGER.info("CategoryController.getTagList() IN");

        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if (null == user) {
            LOGGER.error("user is not login.");
            return null;
        }

        String userId = user.getUserId();
        LOGGER.debug("get tag list with category {}.", cId);

        CategoryRequest req = new CategoryRequest();
        req.setcId(cId);
        req.setUserId(userId);
        CategoryResponse resp = categoryService.getTagsByCategoryId(req);
        LOGGER.debug("category {} has {} tags.", resp.getData() == null ? 0 : resp.getData().size());

        LOGGER.info("CategoryController.getTagList() OUT");
        return resp;
    }

    /**
     * 新增分类
     *
     * @param request
     * @return
     */
    @ApiOperation(value = "新增分类")
    @ResponseBody
    @RequestMapping(value = "addCategory", method = RequestMethod.POST)
    public CategoryResponse addCategory(HttpServletRequest request,@RequestBody GmsCategory category) {
        LOGGER.info("CategoryController.addCategory() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if (null == user) {
            LOGGER.error("user is not login.");
            return null;
        }

        String userId = user.getUserId();
        CategoryRequest req = new CategoryRequest();
        category.setUserId(userId);
        category.setIsLeaf(1);
        req.setCategory(category);
        CategoryResponse response = categoryService.addCategory(req);
        LOGGER.debug("new category result : {}.", response.getStatus());
        LOGGER.info("CategoryController.addCategory() OUT");
        return response;
    }


    /**
     * 修改分类
     *
     * @param request
     * @return
     */
    @ApiOperation(value = "修改分类")
    @ResponseBody
    @RequestMapping(value = "upateCategory", method = RequestMethod.POST)
    public CategoryResponse upateCategory(HttpServletRequest request, @RequestBody GmsCategory category) {
        LOGGER.info("CategoryController.upateCategory() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if (null == user) {
            LOGGER.error("user is not login.");
            return null;
        }

        String userId = user.getUserId();
        CategoryRequest req = new CategoryRequest();
        category.setUserId(userId);
        category.setIsLeaf(1);
        req.setCategory(category);
        CategoryResponse response = categoryService.modifyCategory(req);
        LOGGER.debug("new category result : {}.", response.getStatus());
        LOGGER.info("CategoryController.upateCategory() OUT");
        return response;
    }


    /**
     * 删除分类
     *
     * @param request
     * @return
     */
    @ApiOperation(value = "删除分类")
    @ResponseBody
    @RequestMapping(value = "/delCategory/{cId}", method = RequestMethod.POST)
    public CategoryResponse delCategory(HttpServletRequest request, @PathVariable String cId) {
        LOGGER.info("CategoryController.delCategory() IN");
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if (null == user) {
            LOGGER.error("user is not login.");
            return null;
        }

        String userId = user.getUserId();
        CategoryRequest req = new CategoryRequest();
        req.setcId(cId);
        req.setUserId(userId);
        CategoryResponse response = categoryService.delCategory(req);
        LOGGER.debug("new category result : {}.", response.getStatus());
        LOGGER.info("CategoryController.delCategory() OUT");
        return response;
    }

    /**
     * 新增标签
     *
     * @param request
     * @return
     */
    @ApiOperation(value = "新增标签")
    @ResponseBody
    @RequestMapping(value = "addTag", method = RequestMethod.POST)
    public CategoryResponse addTag(HttpServletRequest request, GmsTag tag) {
        LOGGER.info("CategoryController.addTag() IN");
        CategoryResponse resp = new CategoryResponse();
        CommUserModel user = CommonParamUtil.getUserFromSession(request);
        if (null == user) {
            LOGGER.error("user is not login.");
            return null;
        }

        String cId = request.getParameter("cId");
        if (StringUtils.isEmpty(cId)) {
            resp.setStatus(ResultCode.PARAM_REQUIRE);
            return resp;
        }

        String userId = user.getUserId();
        CategoryRequest req = new CategoryRequest();
        tag.setUserId(userId);
        req.setTag(tag);
        req.setcId(cId);
        resp = categoryService.addTag(req);
        LOGGER.info("CategoryController.addTag() OUT");
        return resp;
    }

    /**
     * 删除标签
     *
     * @param request
     * @return
     */
    @ApiOperation(value = "新增标签")
    @ResponseBody
    @RequestMapping(value = "delTag/{tId}", method = RequestMethod.POST)
    public CategoryResponse delTag(HttpServletRequest request, @PathVariable String tId) {
        LOGGER.info("CategoryController.delTag() IN");
        CategoryRequest req = new CategoryRequest();
        req.settId(tId);
        CategoryResponse resp = categoryService.deleteTag(req);
        LOGGER.debug("delete {} result:{}", tId, resp.getStatus());
        LOGGER.info("CategoryController.delTag() OUT");
        return resp;
    }

}
