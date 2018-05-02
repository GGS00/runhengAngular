package com.cloudchain.admin.model.oms;

import com.cloudchain.oms.pojo.po.settings.OmsFlowSetting;

import java.util.List;

/**
 * Created by lihao on 2017/4/21.
 */
public class FlowSettingModel {
    List<OmsFlowSetting> flowSettings;

    public List<OmsFlowSetting> getFlowSettings() {
        return flowSettings;
    }

    public void setFlowSettings(List<OmsFlowSetting> flowSettings) {
        this.flowSettings = flowSettings;
    }
}
