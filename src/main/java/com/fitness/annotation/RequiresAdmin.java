package com.fitness.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 管理员权限验证注解（管理员后台预留）
 * 标注在需要管理员权限的接口方法上
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresAdmin {

    /** 所需最小角色：0-普通用户/1-管理员/2-超级管理员 默认1 */
    int minRole() default 1;
}
