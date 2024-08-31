package com.example.nanoxai.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Meta {
    private String createdAt;
    private String updatedAt;
    private String barcode;
    private String qrCode;
}
