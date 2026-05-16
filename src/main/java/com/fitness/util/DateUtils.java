package com.fitness.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

/**
 * 日期工具类
 */
public class DateUtils {

    /** 标准日期格式 */
    public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /** 标准日期时间格式 */
    public static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /** 中文日期格式 */
    public static final DateTimeFormatter CN_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy年MM月dd日");

    /** 格式化日期为字符串（yyyy-MM-dd） */
    public static String formatDate(LocalDate date) {
        return date != null ? date.format(DATE_FORMATTER) : "";
    }

    /** 格式化日期时间为字符串（yyyy-MM-dd HH:mm:ss） */
    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DATE_TIME_FORMATTER) : "";
    }

    /** 格式化日期为中文日期字符串 */
    public static String formatCnDate(LocalDate date) {
        return date != null ? date.format(CN_DATE_FORMATTER) : "";
    }

    /** 解析日期字符串为LocalDate */
    public static LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        return LocalDate.parse(dateStr, DATE_FORMATTER);
    }

    /** 解析日期时间字符串为LocalDateTime */
    public static LocalDateTime parseDateTime(String dateTimeStr) {
        if (dateTimeStr == null || dateTimeStr.trim().isEmpty()) {
            return null;
        }
        return LocalDateTime.parse(dateTimeStr, DATE_TIME_FORMATTER);
    }

    /** 计算两个日期之间的天数差 */
    public static long daysBetween(LocalDate start, LocalDate end) {
        return ChronoUnit.DAYS.between(start, end);
    }

    /** 获取当前日期字符串 */
    public static String todayStr() {
        return LocalDate.now().format(DATE_FORMATTER);
    }

    /** 获取当前日期时间字符串 */
    public static String nowStr() {
        return LocalDateTime.now().format(DATE_TIME_FORMATTER);
    }

    /** 获取月份的第一天 */
    public static LocalDate firstDayOfMonth(int year, int month) {
        return LocalDate.of(year, month, 1);
    }

    /** 获取月份的最后一天 */
    public static LocalDate lastDayOfMonth(int year, int month) {
        return firstDayOfMonth(year, month).plusMonths(1).minusDays(1);
    }
}
