package com.fitness.common;

/**
 * 统一返回结果类 - 所有接口返回格式统一
 */
public class Result {

    /** 状态码（200-成功，其他-失败） */
    private int code;

    /** 返回消息 */
    private String message;

    /** 返回数据 */
    private Object data;

    private Result() {}

    private Result(int code, String message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /** 成功（无数据） */
    public static Result success() {
        return new Result(200, "操作成功", null);
    }

    /** 成功（带消息） */
    public static Result success(String message) {
        return new Result(200, message, null);
    }

    /** 成功（带数据） */
    public static Result success(Object data) {
        return new Result(200, "操作成功", data);
    }

    /** 成功（带消息和数据） */
    public static Result success(String message, Object data) {
        return new Result(200, message, data);
    }

    /** 失败 */
    public static Result error(int code, String message) {
        return new Result(code, message, null);
    }

    /** 失败（默认500） */
    public static Result error(String message) {
        return new Result(500, message, null);
    }

    /** 参数错误 */
    public static Result badRequest(String message) {
        return new Result(400, message, null);
    }

    /** 未授权 */
    public static Result unauthorized(String message) {
        return new Result(401, message, null);
    }

    /** 禁止访问 */
    public static Result forbidden(String message) {
        return new Result(403, message, null);
    }

    /** 资源不存在 */
    public static Result notFound(String message) {
        return new Result(404, message, null);
    }

    // ========== Getter/Setter ==========

    public int getCode() { return code; }
    public void setCode(int code) { this.code = code; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
}
