package com.fitness.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * BCrypt加密工具类 - 用于用户密码加密存储
 */
public class BCryptUtils {

    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    /** 加密密码 */
    public static String encode(String rawPassword) {
        return encoder.encode(rawPassword);
    }

    /** 验证密码是否匹配 */
    public static boolean matches(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }
}
