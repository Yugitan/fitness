package com.fitness.config;

import com.fitness.interceptor.GuestInterceptor;
import com.fitness.interceptor.LoginInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web配置类
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /** 注册拦截器 */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 管理员登录拦截器
        registry.addInterceptor(new LoginInterceptor())
                .addPathPatterns("/admin/**")
                .excludePathPatterns("/admin/login", "/admin/login/page", "/admin/css/**", "/admin/js/**");

        // 游客写操作拦截器
        registry.addInterceptor(new GuestInterceptor())
                .addPathPatterns("/training/api/**", "/plan/api/**", "/exercise/api/**")
                .excludePathPatterns("/exercise/api/list");
    }

    /** 静态资源配置 */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
        registry.addResourceHandler("/video/**")
                .addResourceLocations("classpath:/static/video/");
    }
}
