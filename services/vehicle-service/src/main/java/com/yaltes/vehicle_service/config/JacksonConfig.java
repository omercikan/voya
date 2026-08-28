package com.yaltes.vehicle_service.config;

import org.springframework.boot.jackson.autoconfigure.JsonMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.cfg.CoercionAction;
import tools.jackson.databind.cfg.CoercionInputShape;
import tools.jackson.databind.type.LogicalType;

@Configuration
public class JacksonConfig {

    @Bean
    public JsonMapperBuilderCustomizer coercionCustomizer() {
        return builder -> builder.withCoercionConfig(
                LogicalType.Integer,
                config -> config.setCoercion(CoercionInputShape.EmptyString, CoercionAction.Fail)
        );
    }
}