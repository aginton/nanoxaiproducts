package com.example.nanoxai.model;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "products")
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Product {
    @Id
    private Integer id;
    private String title;
    private String description;
    private String category;
    private Float price;
    private Float discountPercentage;
    private Float rating;
    private Integer stock;
    private List<String> tags;
    private String brand;
    private String sku;
    private Integer weight;
    private Dimensions dimensions;
    private String warrantyInformation;
    private String shippingInformation;
    private List<Review> reviews;
    private String returnPolicy;
    private Integer minimumOrderQuantity;
    private Meta meta;
    private List<String> images;
    private String thumbnail;
}
