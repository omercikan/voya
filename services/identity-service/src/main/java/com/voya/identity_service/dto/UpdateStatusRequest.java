package com.voya.identity_service.dto;

import com.voya.identity_service.enums.Status;

public record UpdateStatusRequest(Status status) {
}
