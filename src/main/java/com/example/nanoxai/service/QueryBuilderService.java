package com.example.nanoxai.service;

import com.example.nanoxai.constants.Constants;
import com.example.nanoxai.model.requests.SearchProductsRequest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Collation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
public class QueryBuilderService {


    public Query buildSearchQuery(SearchProductsRequest request) {
        Query query = new Query();
        updateQueryFieldsToReturn(query);
        updateQueryWithCriteria(query, request);
        return query;
    }

    private void updateQueryFieldsToReturn(Query query) {
        query.fields().include(Constants.PRODUCT.ID)
                .include(Constants.PRODUCT.BARCODE)
                .include(Constants.PRODUCT.RATING)
                .include(Constants.PRODUCT.PRICE)
                .include(Constants.PRODUCT.TITLE)
                .include(Constants.PRODUCT.THUMBNAIL);
    }

    private void updateQueryWithCriteria(Query query, SearchProductsRequest request) {
        if (request == null || request.getText() == null){
            return;
        }
        String text = request.getText().trim();
        if (!text.isEmpty()){
            Criteria criteria = new Criteria().orOperator(
                    Criteria.where(Constants.PRODUCT.TITLE).regex(text, "i"),  // "i" for case-insensitive
                    Criteria.where(Constants.PRODUCT.DESCRIPTION).regex(text, "i"),
                    Criteria.where(Constants.PRODUCT.TAGS).regex(text, "i")
            );
            query.addCriteria(criteria);
        }
    }

    public void updateQueryWithSortAndPagination(Query query, SearchProductsRequest request) {
        addQuerySortIfNecessary(query, request);

        //If request.allItems == true, then get all items and dont paginate
        if (request == null || !request.isAllItems()){
            updateQueryWithPagination(query, request);
        }
    }


    private void updateQueryWithPagination(Query query, SearchProductsRequest request) {
        int size = request != null && request.getSize() != null ? request.getSize() : Constants.PRODUCT.DEFAULT_SIZE;
        int page = request != null && request.getPage() != null ? request.getPage() : Constants.PRODUCT.DEFAULT_PAGE;
        Pageable pageable = PageRequest.of(page, size);
        query.with(pageable);
    }


    private void addQuerySortIfNecessary(Query query, SearchProductsRequest request) {
        if (request != null && request.getSortField() != null){
            Sort.Direction sortOrder = request.getOrder() == null ? Sort.Direction.ASC : request.getOrder();
            Sort sort = Sort.by(sortOrder, request.getSortField().getFieldName());

            if ("title".equals(request.getSortField().getFieldName())) {
                // Use collation for case-insensitive sorting
                Collation collation = Collation.of("en").strength(Collation.ComparisonLevel.secondary());
                query.collation(collation);
            }

            query.with(sort);
        }
    }

}
