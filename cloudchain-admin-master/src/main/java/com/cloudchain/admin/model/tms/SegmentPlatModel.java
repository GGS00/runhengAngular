package com.cloudchain.admin.model.tms;

import com.cloudchain.tms.pojo.vo.SegmentPlat;

import java.util.List;

/**
 * Created by LiuKai on 2017/3/1.
 */
public class SegmentPlatModel {

    private String fromPlatId;

    private String toPlatId;

    private List<SegmentPlat> segmentPlatList;

    public List<SegmentPlat> getSegmentPlatList() {
        return segmentPlatList;
    }

    public void setSegmentPlatList(List<SegmentPlat> segmentPlatList) {
        this.segmentPlatList = segmentPlatList;
    }

    public String getFromPlatId() {
        return fromPlatId;
    }

    public void setFromPlatId(String fromPlatId) {
        this.fromPlatId = fromPlatId;
    }

    public String getToPlatId() {
        return toPlatId;
    }

    public void setToPlatId(String toPlatId) {
        this.toPlatId = toPlatId;
    }
}
