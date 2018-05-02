package com.cloudchain.util.param;

import com.cloudchain.admin.model.base.CommUserModel;
import com.cloudchain.d2p.pojo.bo.D2PRequest;
import com.cloudchain.fms.pojo.bo.FmsRequest;
import com.cloudchain.gms.pojo.bo.GmsRequest;
import com.cloudchain.lms.pojo.bo.LmsRequest;
import com.cloudchain.oms.pojo.bo.sale.OmsSaleOrderRequest;
import com.cloudchain.platform.pojo.bo.Request;
import com.cloudchain.tms.pojo.bo.TmsRequest;
import com.cloudchain.ums.pojo.bo.cooper.UmsCooperRequest;
import com.cloudchain.ums.pojo.po.UmsEmployee;
import com.cloudchain.ums.pojo.po.UmsUser;
import com.cloudchain.wms.pojo.bo.WmsRequest;
import com.cloudchain.wms.pojo.vo.WmsModel;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Map;

/**
 * Created by LiuKai on 2017/3/7.
 */
public class CommonParamUtil {

    /**
     * 设置操作人
     * @param request HttpServletRequest
     * @param req TmsRequest
     */
    public static void setUmsUserId(HttpServletRequest request, FmsRequest req){
        CommUserModel userModel = getUserFromSession(request);
        req.setUmsUserId(userModel.getUserId());
    }

    /**
     * 设置操作人
     * @param request HttpServletRequest
     * @param req TmsRequest
     */
    public static void setTmsOperator(HttpServletRequest request, TmsRequest req){
        CommUserModel userModel = getUserFromSession(request);

        // 承运商
        req.setUserId(userModel.getUserId());
        req.setUserName(userModel.getNickName());

        // 操作人
        req.setOperatorId(userModel.getOperatorId());
        req.setOperatorName(userModel.getOperatorName());
    }


    public static void setGmsOperator(HttpServletRequest request, GmsRequest req){
        CommUserModel userModel = getUserFromSession(request);

        // 承运商
        req.setUserId(userModel.getUserId());
        req.setCreator(userModel.getNickName());

        // 操作人
        req.setOperatorId(userModel.getOperatorId());
        req.setOperatorName(userModel.getOperatorName());

        // 用户所属行业
        req.setIndustryIds(userModel.getIndustryIds());
        req.setAdmin(true);
        req.setCustomize("1".equals(userModel.getFunctionMap().get("goodsSettingCustom")));
    }


    public static void setD2POperator(HttpServletRequest request, D2PRequest req){
        CommUserModel userModel = getUserFromSession(request);

        req.setShopId("0");
        req.setShopName("自营");

        // 承运商
        req.setUserId(userModel.getUserId());
        req.setUserName(userModel.getNickName());

        // 操作人
        req.setOperatorId(userModel.getOperatorId());
        req.setOperatorName(userModel.getOperatorName());
    }

    /**
     * 获取用户登录信息
     * @param request
     * @return
     */
    public static CommUserModel getUserFromSession(HttpServletRequest request)
    {
        HttpSession session = request.getSession();

        Object object =  session.getAttribute("b.g.x.session.operator");

        UmsUser user = null;
        UmsEmployee employee = null;

        if (object instanceof UmsUser)
        {
            //admin用户登录
            user = (UmsUser) object;
        }

        if (object instanceof UmsEmployee)
        {
            //员工登录
            employee = (UmsEmployee) object;
            //对应admmin用户信息
            user = employee.getUmsUser();
        }

        if (null == user && null == employee)
        {
            return null;
        }

        //对应Admin用户信息
        CommUserModel commUserModel = new CommUserModel();
        commUserModel.setUserName(user.getUserName());
        commUserModel.setUserId(user.getUserId());
        commUserModel.setNickName(user.getNickName());
        commUserModel.setUserTel(user.getMobile());
        commUserModel.setIndustryIds(user.getIndustryIds());

        Map<String, Object> map = (Map<String, Object>) session.getAttribute("funcMap");

        commUserModel.setFunctionMap(map);

        //当前登录人信息
        commUserModel.setOperatorId(employee == null ? user.getUserId() : employee.getEmpId());
        commUserModel.setOperatorName(employee == null ? user.getNickName() : employee.getRealName());
        commUserModel.setRoleId(employee == null ? "" : employee.getRoleId());
        commUserModel.setOperatorTel(employee == null ? "" : employee.getMobile());

        return commUserModel;
    }

    /**
     * wms请求封装
     * @param request HttpServletRequest
     * @param req WmsRequest
     * @param model WmsModel
     */
    public static void setWmsReq(HttpServletRequest request, WmsRequest req, WmsModel model) {
        //获取用户
        CommUserModel commUserModel = CommonParamUtil.getUserFromSession(request);
        req.setUserId(commUserModel.getUserId());
        req.setUserName(commUserModel.getNickName());
        req.setUserTel(commUserModel.getUserTel());
        req.setOperatorId(commUserModel.getOperatorId());
        req.setOperatorName(commUserModel.getOperatorName());
        req.setOperatorTel(commUserModel.getOperatorTel());
        //获取其他值
        req.setQuantity(model.getQuantity());
        req.setId(model.getId());
        req.setCode(model.getCode());
        req.setItemId(model.getItemId());
        req.setDescription(model.getDescription());
        req.setProductCode(model.getProductCode());
        req.setMark_1(model.getMark_1());
        req.setBillType(model.getBillType());
        req.setInvStatus(model.getInvStatus());
        req.setStatus(model.getStatus());
        req.setWarehouseId(model.getWarehouseId());
        req.setOperation(model.getOperation());
        req.setOwnerId(model.getOwnerId());
        req.setOwnerName(model.getOwnerNmae());
        req.setSupplierId(model.getSupplierId());
        req.setLength(model.getLength());
    }


    public static void setWmsOperator(HttpServletRequest request, WmsRequest req){
        CommUserModel userModel = getUserFromSession(request);

        // 设置操作人
        req.setOperatorId(userModel.getOperatorId());
        req.setOperatorName(userModel.getOperatorName());

        //设置仓管员
        req.setUserId(userModel.getUserId());
        req.setUserName(userModel.getNickName());

    }

    /**
     * oms请求封装  发货时需用到用户地址信息
     */
    public static void setOmsUserInfo(HttpServletRequest request, OmsSaleOrderRequest req){
        HttpSession session = request.getSession();
        Object object =  session.getAttribute("b.g.x.session.operator");
        UmsUser user = null;
        UmsEmployee employee = null;
        if (object instanceof UmsUser)
        {
            //admin用户登录
            user = (UmsUser) object;
        }
        if (object instanceof UmsEmployee)
        {
            //员工登录
            employee = (UmsEmployee) object;
            //对应admmin用户信息
            user = employee.getUmsUser();
        }
        if (null == user && null == employee)
        {
            return;
        }

        req.setUserId(user.getUserId());
        req.setOperatorId(employee == null ? user.getUserId() : employee.getEmpId());
        req.setNickName(user.getNickName());

        //userid地址信息
        req.setConsignorNm(user.getNickName());  //发货方名称
        req.setConsignorTel(user.getMobile());  //发货方电话
        if(user.getAdminUserExt() != null){
            req.setConsignorProvince(user.getAdminUserExt().getProvinceName());  //发货人省份
            req.setConsignorCity(user.getAdminUserExt().getCityName());  //城市
            req.setConsignorDistrict(user.getAdminUserExt().getDistrictName());  //区县
            req.setConsignorAddrDetail(user.getAdminUserExt().getAddressDetail());  //详细地址
        }
    }

    /**
     * 请求封装 设置用户信息
     */
    public static void setRequestUserInfo(HttpServletRequest request, UmsCooperRequest req){
        HttpSession session = request.getSession();
        Object object =  session.getAttribute("b.g.x.session.operator");
        UmsUser user = null;
        UmsEmployee employee = null;
        if (object instanceof UmsUser)
        {
            //admin用户登录
            user = (UmsUser) object;
        }
        if (object instanceof UmsEmployee)
        {
            //员工登录
            employee = (UmsEmployee) object;
            //对应admmin用户信息
            user = employee.getUmsUser();
        }
        if (null == user && null == employee)
        {
            return;
        }
        req.setUserId(user.getUserId());
        req.setUmsUser(user);
    }
    public static void setLmsOperator(HttpServletRequest request, LmsRequest req){
        CommUserModel userModel = getUserFromSession(request);

        req.setOperatorId(userModel.getOperatorId());
        req.setOperatorName(userModel.getOperatorName());

        req.setUserId(userModel.getUserId());
        req.setUserName(userModel.getUserName());
    }

    public static void setOperator(HttpServletRequest request, Request req){
        CommUserModel userModel = getUserFromSession(request);

        req.setOperatorId(userModel.getOperatorId());
        req.setOperatorName(userModel.getOperatorName());

        req.setUserId(userModel.getUserId());
    }
}

