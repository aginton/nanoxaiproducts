package com.example.nanoxai.model.responses;

import com.example.nanoxai.model.Product;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProductsResponse {
    Long total;
    List<Product> products;
}
