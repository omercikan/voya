package com.yaltes.api_gateway.dto;

public record ApiResponse(boolean success, String message) {

    public static ApiResponse error(String message) {
        return new ApiResponse(false, message);
    }
}
