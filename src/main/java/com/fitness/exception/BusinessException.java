package com.fitness.exception;

/**
 * 自定义业务异常类
 */
public class BusinessException extends RuntimeException {

    /** 异常状态码 */
    private final int code;

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(String message) {
        super(message);
        this.code = 500;
    }

    public int getCode() {
        return code;
    }
}
