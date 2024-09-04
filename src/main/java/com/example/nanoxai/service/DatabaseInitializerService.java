package com.example.nanoxai.service;

import com.example.nanoxai.constants.Constants;
import com.example.nanoxai.model.ExternalDummyProductsApiResponse;
import com.example.nanoxai.model.Product;
import com.example.nanoxai.persistence.api.PersistenceManager;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Collation;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
@Slf4j
public class DatabaseInitializerService {
    @Autowired
    PersistenceManager persistenceManager;
    @Autowired
    SequenceGeneratorService sequenceGeneratorService;
    @Autowired
    ExternalApiService externalApiService;


    public void ensureIndexes() {
        persistenceManager.ensureIndex(Product.class, Constants.PRODUCT.PRICE, Sort.Direction.ASC);
        persistenceManager.ensureIndex(Product.class, Constants.PRODUCT.RATING, Sort.Direction.ASC);

        //Title should be case-insensitive for sorting purposes
        //SECONDARY: Considers differences in diacritics (like accents) but still ignores case. For instance, "café" and "cafe" would be considered different, but "Apple" and "apple" would still be equal.
        Collation collation = Collation.of("en").strength(Collation.ComparisonLevel.secondary());
        persistenceManager.ensureIndex(Product.class, Constants.PRODUCT.TITLE, Sort.Direction.ASC, collation);
    }

    @PostConstruct
    public void fetchProducts(){
        ensureIndexes();
        Integer productSequenceMaxId = sequenceGeneratorService.getProductSequenceMaxId();

        if (productSequenceMaxId == null){
            log.info("No entries currently exist in collection 'products'. Fetching from external api...");
            ExternalDummyProductsApiResponse externalDummyProductsApiResponse = externalApiService.getExternalDummyProducts();
            List<Product> products = externalDummyProductsApiResponse.getProducts();
            log.info("Fetched {} products from external response: ", products.size());
            persistenceManager.saveAll(products);
            sequenceGeneratorService.adjustProductSequenceBasedOnMaxId();
        } else {
            log.info("Already have entries in 'products' collection. Not fetching from external api, continuing with sequence {}", productSequenceMaxId);
        }
    }
}
