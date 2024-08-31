package com.example.nanoxai.model.responses;

import com.example.nanoxai.model.Product;
import lombok.Data;

import java.util.List;

@Data
public class LoadExternalProductsResponse {
    int totalProductsAdded;
    List<Product> products;
}
