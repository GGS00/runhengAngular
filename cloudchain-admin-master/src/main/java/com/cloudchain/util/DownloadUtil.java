package com.cloudchain.util;

import com.cloudchain.admin.exception.BusinessLayerException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

/**
 * Created by LiuKai on 2017/3/6.
 */
public class DownloadUtil {

    public static void downloadTemplate(HttpServletRequest request, HttpServletResponse response, String templateName) {
        String path = request.getSession().getServletContext().getRealPath("/");
        String filePath = path + File.separator + "templetFile" + File.separator + templateName + ".xlsx";
        File file = new File(filePath);

        if (!file.exists()) // 模板文件不存在
            throw new BusinessLayerException("模板文件不存在！");

        BufferedInputStream bis = null;
        OutputStream out = null;
        byte[] buf = new byte[1024];
        int len = 0;

        try {
            // 设置要显示在保存窗口的文件名，如果文件名中有中文的话，则要设置字符集
            String fileName = templateName + ".xlsx";
            if (request.getHeader("User-Agent").toUpperCase().indexOf("MSIE") > 0) {
                fileName = java.net.URLEncoder.encode(fileName, "utf-8");
            }
            else {
                fileName = new String(fileName.getBytes("utf-8"), "ISO8859-1");
            }

            // 设置弹出"是否要保存"的对话框
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
            // 指定文件类型
            response.setContentType("application/vnd.ms-excel;charset=utf-8");

            bis = new BufferedInputStream(new FileInputStream(file));
            out = response.getOutputStream();
            while ((len = bis.read(buf)) > 0)
                out.write(buf, 0, len);
        }
        catch (IOException e) {
            throw new BusinessLayerException("模板文件下载失败！");
        }
        catch (Exception e) {
            throw new BusinessLayerException("系统异常，请联系管理员！");
        }
        finally {
            try {
                out.close();
                bis.close();
            }
            catch (IOException e) {
                throw new BusinessLayerException("系统异常，请联系管理员！");
            }
        }
    }
}
