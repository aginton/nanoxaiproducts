package com.example.nanoxai.service;

import com.example.nanoxai.constants.Constants;
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
        verifyProductBarcodeNotDuplicate(product.getId(), product.getMeta().getBarcode());
    }

    public void verifyProductBarcodeNotDuplicate(Integer id, String barcode) {
        Query query = new Query();
        query.addCriteria(Criteria.where(Constants.PRODUCT.BARCODE).is(barcode)
                .andOperator(Criteria.where(Constants.PRODUCT.ID).ne(id)));
        if (persistenceManager.exists(Product.class, query)){
            throw new DuplicateBarcodeException("A barcode with value " + barcode + " already exists. Please provide a unique barcode");
        }
    }
}
