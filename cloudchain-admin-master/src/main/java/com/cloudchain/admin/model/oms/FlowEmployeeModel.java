package com.cloudchain.admin.model.oms;

import com.cloudchain.oms.pojo.po.settings.OmsFlowEmployee;

import java.util.List;

/**
 * Created by lihao on 2017/4/21.
 */
public class FlowEmployeeModel {
    public List<OmsFlowEmployee> getEmps() {
        return emps;
    }

    public void setEmps(List<OmsFlowEmployee> emps) {
        this.emps = emps;
    }

    List<OmsFlowEmployee> emps;
}
