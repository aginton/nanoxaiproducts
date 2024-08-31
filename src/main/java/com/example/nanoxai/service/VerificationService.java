package com.example.nanoxai.service;

import com.example.nanoxai.exceptions.DuplicateBarcodeException;
import com.example.nanoxai.exceptions.InvalidProductDetailsException;
import com.example.nanoxai.exceptions.NullProductException;
import com.example.nanoxai.model.Product;
import com.example.nanoxai.persistence.api.PersistenceManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class VerificationService {
    private final PersistenceManager persistenceManager;

    @Autowired
    public VerificationService(PersistenceManager persistenceManager, SequenceGeneratorService sequenceGeneratorService) {
        this.persistenceManager = persistenceManager;
    }

    public void verifyProduct(Product product) {
        List<String> errors = new ArrayList<>();

        if (product == null){
            throw new NullProductException("Product cannot be null");
        }
        if (product.getMeta() == null || product.getMeta().getBarcode() == null || product.getMeta().getBarcode().trim().isEmpty()){
            errors.add("Product barcode cannot be null");
        }
        verifyProductBarcodeNotDuplicate(product.getMeta().getBarcode());
        if (CollectionUtils.isEmpty(product.getImages())){
            errors.add("Product must contain at least one image");
        }
        if (CollectionUtils.isEmpty(product.getTags())){
            errors.add("Product must contain at least one tag");
        }
        if (product.getRating() == null || product.getRating() < 0) {
            errors.add("Product must contain a non-negative rating");
        }
        if (product.getPrice() == null || product.getPrice() < 0) {
            errors.add("Product must contain a non-negative price");
        }

        if (errors.size() > 0){
            throw new InvalidProductDetailsException(errors);
        }
    }

    public void verifyProductBarcodeNotDuplicate(String barcode) {
        Query query = new Query();
        // TODO: Make field name in variable
        query.addCriteria(Criteria.where("meta.barcode").is(barcode));
        if (persistenceManager.exists(Product.class, query)){
            throw new DuplicateBarcodeException("A barcode with value " + barcode + " already exists. Please provide a unique barcode");
        }
    }
}
