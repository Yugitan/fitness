package com.fitness;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/**
 * 健身记录Web应用 - 主启动类
 */
@SpringBootApplication
@MapperScan("com.fitness.mapper")
public class FitnessApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(FitnessApplication.class, args);
    }

    /** 外置Tomcat部署入口 */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(FitnessApplication.class);
    }
}
