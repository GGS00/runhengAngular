package com.cloudchain.admin.model.tms;

import com.cloudchain.tms.pojo.vo.TruckGoods;

import java.util.List;

/**
 * Created by LiuKai on 2017/3/16.
 */
public class TruckModel {

    /**
     * 派车单ID
     */
    private String ddId;

    /**
     *  运段ID
     */
    private String segmentId;

    /**
     * 所装货品
     */
    private List<TruckGoods> goods;

    public String getDdId() {
        return ddId;
    }

    public void setDdId(String ddId) {
        this.ddId = ddId;
    }

    public List<TruckGoods> getGoods() {
        return goods;
    }

    public void setGoods(List<TruckGoods> goods) {
        this.goods = goods;
    }

    public String getSegmentId() {
        return segmentId;
    }

    public void setSegmentId(String segmentId) {
        this.segmentId = segmentId;
    }
}
