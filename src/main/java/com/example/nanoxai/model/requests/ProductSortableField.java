package com.example.nanoxai.model.requests;

public enum ProductSortableField {
    PRICE("price"),
    BARCODE("barcode"),
    RATING("rating"),
    TITLE("title");

    private final String fieldName;

    ProductSortableField(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }
}
