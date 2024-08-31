package com.example.nanoxai.controller;

import com.example.nanoxai.model.Product;
import com.example.nanoxai.model.requests.SearchProductsRequest;
import com.example.nanoxai.model.responses.LoadExternalProductsResponse;
import com.example.nanoxai.model.responses.ProductsResponse;
import com.example.nanoxai.service.ProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    ProductsService productsService;

    @GetMapping()
    public ProductsResponse getProducts(@RequestParam(defaultValue = "false") boolean fulldata) {
        return productsService.getProducts(null, fulldata);
    }

    @GetMapping("/{id}")
    public Product getFullProductDetailsById(@PathVariable Integer id) {
        return productsService.getFullProductDetailsById(id);
    }

    @GetMapping("/load-from-external")
    public LoadExternalProductsResponse loadProductsFromExternalApi() {
        return productsService.loadProductsFromExternalApi();
    }

    // TODO: Make return partial data
    @PostMapping()
    public ProductsResponse getProducts(@RequestParam(defaultValue = "false") boolean fulldata, @RequestBody SearchProductsRequest request){
        return productsService.getProducts(request, fulldata);
    }

    @GetMapping("/all")
    public ProductsResponse getAllProducts() {
        return productsService.getAllProducts();
    }

    @GetMapping("/sequence")
    public Integer getSequence() {
        return productsService.getProductSequence();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productsService.deleteProductById(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @PostMapping("/reset-products")
    public ResponseEntity<Void> resetProducts() {
        productsService.resetProductsCollectionAndSequence();
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
