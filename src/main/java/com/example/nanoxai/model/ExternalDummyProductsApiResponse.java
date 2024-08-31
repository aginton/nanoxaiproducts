package com.example.nanoxai.model;

import lombok.Data;

import java.util.List;

@Data
public class ExternalDummyProductsApiResponse {
    List<Product> products;
    int total;
    int skip;
    int limit;
}
