package com.yaltes.identity_service.dto;

import com.yaltes.identity_service.enums.Status;

public record UpdateStatusRequest(Status status) {
}
