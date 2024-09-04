package com.example.nanoxai.controller;

import com.example.nanoxai.model.Product;
import com.example.nanoxai.model.requests.SearchProductsRequest;
import com.example.nanoxai.model.responses.LoadExternalProductsResponse;
import com.example.nanoxai.model.responses.ProductsResponse;
import com.example.nanoxai.service.ProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    ProductsService productsService;


    @GetMapping("/{id}")
    public Product getFullProductDetailsById(@PathVariable Integer id) {
        return productsService.getFullProductDetailsById(id);
    }


    @PostMapping()
    public ProductsResponse searchProducts(@RequestBody SearchProductsRequest request){
        return productsService.searchProducts(request);
    }

    @GetMapping("/all")
    public ProductsResponse getAllProducts() {
        return productsService.getAllProducts();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productsService.deleteProductById(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteProducts(@RequestParam List<Integer> ids) {
        productsService.deleteProductsByIds(ids);
        return ResponseEntity.noContent().build(); // 204 No Content
    }


    @PostMapping("/update")
    public Product updateProduct(@RequestBody Product product){
        return productsService.updateProduct(product);
    }

    @PostMapping("/create")
    public Product createProduct(@RequestBody Product product){
        return productsService.createProduct(product);
    }
}
