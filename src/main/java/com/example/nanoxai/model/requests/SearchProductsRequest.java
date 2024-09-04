package com.example.nanoxai.model.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Sort;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SearchProductsRequest {
    String text;
    ProductSortableField sortField;
    Sort.Direction order;
    Integer page;
    Integer size;
    boolean allItems;

    // Custom setter for sortField to handle case-insensitive matching
    public void setSortField(String sortField) {
        this.sortField = ProductSortableField.valueOf(sortField.toUpperCase());
    }
}
