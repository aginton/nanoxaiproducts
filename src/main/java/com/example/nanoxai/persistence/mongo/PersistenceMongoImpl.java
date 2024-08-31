package com.example.nanoxai.persistence.mongo;

import com.example.nanoxai.model.Product;
import com.example.nanoxai.persistence.api.PersistenceManager;
import com.example.nanoxai.service.SequenceGeneratorService;
import com.mongodb.client.result.DeleteResult;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import javax.sound.midi.Sequence;
import java.util.Collection;
import java.util.List;

@Service
@Slf4j
public class PersistenceMongoImpl implements PersistenceManager {
    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public <T> List<T> findByQuery(Class<T> klass, Query query) {
        List<T> results = mongoTemplate.find(query, klass);
        return results;
    }

    @Override
    public <T> List<T> findAll(Class<T> klass) {
        List<T> results = mongoTemplate.findAll(klass);
        return results;
    }

    @Override
    public Long countByQuery(Class klass, Query query){
        try {
            return mongoTemplate.count(query, Product.class);
        } catch (Exception ex){
            log.error("Error encountered in countByQuery({}, {})", klass, query, ex);
            return  null;
        }
    }

    @Override
    public <T> boolean existsById(Integer id, Class<T> klass) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        return mongoTemplate.exists(query, klass);
    }

    @Override
    public <T> boolean exists(Class<T> klass, Query query) {
        return mongoTemplate.exists(query, klass);
    }


    @Override
    public <T> T save(T entity) {
        return mongoTemplate.save(entity);
    }

    @Override
    public boolean saveAll(List<?> recordList){
        try {
            mongoTemplate.insertAll(recordList);
            return true;
        } catch (Exception ex){
            log.error("Error while inserting records", ex);
            return false;
        }
    }

    @Override
    public AggregationResults<Document> aggregateResults(Aggregation aggregation, String collectionName){
        return mongoTemplate.aggregate(aggregation, collectionName, Document.class);
    }

    @Override
    public <T> void upsert(Query query, Update update, Class<T> klass){
        mongoTemplate.upsert(query, update, klass);
    }

    @Override
    public <T> boolean deleteById(Integer id, Class<T> klass){
        Query query = new Query(Criteria.where("_id").is(id));
        return mongoTemplate.remove(query, klass).getDeletedCount() > 0;
    }
    @Override
    public <T> T findById(Integer id, Class<T> klass){
        Query query = new Query(Criteria.where("_id").is(id));
        return mongoTemplate.findOne(query, klass);
    }

    @Override
    public void resetCollectionAndSequence(Class<?> klass){
        // Step 1: Empty the collection
        DeleteResult remove = mongoTemplate.remove(new Query(), klass);
        remove.getDeletedCount();

        // Step 2: Reset the sequence ID
        Query query = new Query(Criteria.where("_id").is(klass.getSimpleName()));
        Update update = new Update().set("seq", 0);
        mongoTemplate.upsert(query, update, SequenceGeneratorService.SequenceCounter.class);
    }

    @Override
    public void ensureIndex(Class<?> klass, String field, Sort.Direction sort){
        String indexName = mongoTemplate.indexOps(klass).ensureIndex(new Index().on(field, sort));
        log.info("Created or found index: " + indexName);
    }
}
