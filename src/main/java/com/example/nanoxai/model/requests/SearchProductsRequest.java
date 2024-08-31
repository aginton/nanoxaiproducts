package com.example.nanoxai.model.requests;

import lombok.Data;
import org.springframework.data.domain.Sort;

@Data
public class SearchProductsRequest {
    String text;
    ProductSortableField sortField;
    Sort.Direction order;
    Integer page;
    Integer size;

    // Custom setter for sortField to handle case-insensitive matching
    public void setSortField(String sortField) {
        this.sortField = ProductSortableField.valueOf(sortField.toUpperCase());
    }
}
