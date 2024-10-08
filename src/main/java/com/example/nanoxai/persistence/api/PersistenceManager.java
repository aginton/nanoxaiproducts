package com.example.nanoxai.persistence.api;


import com.example.nanoxai.model.Product;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Collation;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import java.util.List;

public interface PersistenceManager {

    <T> List<T> findByQuery(Class<T> klass, Query query);
    <T> List<T> findAll(Class<T> klass);
    Long countByQuery(Class klass, Query query);
    <T> boolean existsById(Integer id, Class<T> klass);
    <T> T findById(Integer id, Class<T> klass);
    <T> boolean deleteById(Integer id, Class<T> klass);
    <T> boolean exists(Class<T> klass, Query query);
    <T> T save(T entity);
    boolean saveAll(List<?> entities);

    AggregationResults<Document> aggregateResults(Aggregation aggregation, String collectionName);
    <T> void upsert(Query query, Update update, Class<T> klass);

    void resetCollectionAndSequence(Class<?> klass);
    void ensureIndex(Class<?> klass, String field, Sort.Direction sort);
    void ensureIndex(Class<?> klass, String field, Sort.Direction sort, Collation collation);

    void deleteByIds(List<Integer> ids, Class<Product> productClass);
}
