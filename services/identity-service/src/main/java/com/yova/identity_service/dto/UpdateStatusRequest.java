package com.yova.identity_service.dto;

import com.yova.identity_service.enums.Status;

public record UpdateStatusRequest(Status status) {
}
