package com.example.nanoxai.service;

import com.example.nanoxai.constants.Constants;
import com.example.nanoxai.exceptions.MissingProductException;
import com.example.nanoxai.model.Product;
import com.example.nanoxai.model.requests.SearchProductsRequest;
import com.example.nanoxai.model.responses.LoadExternalProductsResponse;
import com.example.nanoxai.model.responses.ProductsResponse;
import com.example.nanoxai.persistence.api.PersistenceManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class ProductsService {
    private final PersistenceManager persistenceManager;
    private final SequenceGeneratorService sequenceGeneratorService;
    private final VerificationService verificationService;
    private final QueryBuilderService queryBuilderService;


    @Autowired
    public ProductsService(PersistenceManager persistenceManager, SequenceGeneratorService sequenceGeneratorService, VerificationService verificationService, QueryBuilderService queryBuilderService) {
        this.persistenceManager = persistenceManager;
        this.sequenceGeneratorService = sequenceGeneratorService;
        this.verificationService = verificationService;
        this.queryBuilderService = queryBuilderService;
    }

    public ProductsResponse getAllProducts() {
        List<Product> allResults = persistenceManager.findAll(Product.class);
        return ProductsResponse.builder().total(Long.valueOf(allResults.size())).products(allResults).build();
    }


    public ProductsResponse searchProducts(SearchProductsRequest request) {
        ProductsResponse response = ProductsResponse.builder().total(0L).build();
        Query query = queryBuilderService.buildSearchQuery(request);
        Long totalRecordsInCollection = persistenceManager.countByQuery(Product.class, query);

        if (totalRecordsInCollection != null && totalRecordsInCollection > 0){
            queryBuilderService.updateQueryWithSortAndPagination(query, request);
            List<Product> results = persistenceManager.findByQuery(Product.class, query);
            response.setProducts(results);
            response.setTotal(totalRecordsInCollection);
        }

        return response;
    }

    public Product updateProduct(Product product) {
        if (!persistenceManager.existsById(product.getId(), Product.class)){
            throw new MissingProductException(product.getId());
        }
        verificationService.verifyProduct(product);
        return persistenceManager.save(product);
    }

    @Transactional
    public Product createProduct(Product product) {
        verificationService.verifyProduct(product);
        product.setId(sequenceGeneratorService.incrementSequence(Constants.PRODUCT.SEQ_NAME, 1));
        return persistenceManager.save(product);
    }

    public void deleteProductById(Integer id) {
        if (!persistenceManager.deleteById(id, Product.class)){
            throw new MissingProductException(id);
        }
    }

    public void deleteProductsByIds(List<Integer> ids) {
        persistenceManager.deleteByIds(ids, Product.class);
    }


    public Product getFullProductDetailsById(Integer id) {
        Product response = persistenceManager.findById(id, Product.class);
        if (response == null){
            throw new MissingProductException(id);
        }
        return response;
    }
}
