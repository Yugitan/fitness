package com.fitness.util;

import java.util.UUID;

/**
 * 字符串工具类
 */
public class StringUtils {

    /** 判断字符串是否为空或空白字符 */
    public static boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

    /** 判断字符串是否不为空 */
    public static boolean isNotBlank(String str) {
        return !isBlank(str);
    }

    /** 生成UUID（去除横线） */
    public static String uuid() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    /** 截断字符串（超过指定长度追加省略号） */
    public static String truncate(String str, int maxLength) {
        if (str == null || str.length() <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength) + "...";
    }

    /** HTML特殊字符转义（防XSS攻击） */
    public static String escapeHtml(String input) {
        if (input == null) {
            return null;
        }
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
