package com.example.nanoxai.service;

import com.example.nanoxai.constants.Constants;
import com.example.nanoxai.persistence.api.PersistenceManager;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;


import static org.springframework.data.mongodb.core.FindAndModifyOptions.options;

@Service
@Slf4j
public class SequenceGeneratorService {
    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    PersistenceManager persistenceManager;

    public Integer getProductSequenceMaxId(){
        // Find the maximum ID in the 'products' collection
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.group().max(Constants.PRODUCT.ID).as("maxId")
        );

        AggregationResults<Document> result = persistenceManager.aggregateResults(aggregation, Constants.PRODUCT.COLLECTION_NAME);
        log.info("Aggregation Result: {}", result.getMappedResults());

        return result.getUniqueMappedResult() != null
                ? result.getUniqueMappedResult().get("maxId", Integer.class)
                : null;
    }

    public String adjustProductSequenceBasedOnMaxId() {
        Integer maxId = getProductSequenceMaxId();

        // Update the sequence to start after the maximum ID
        if (maxId == null){
            log.error("No maxId found in the 'products' collection. Skipping sequence adjustment.");
            throw new RuntimeException("No maxId found in the 'products' collection. Unable to adjust sequence");
        }

        log.info("Setting sequence to start after maxId: {}", maxId);
        Query query = new Query(Criteria.where(Constants.PRODUCT.ID).is(Constants.PRODUCT.SEQ_NAME));
        Update update = new Update().set("seq", maxId);
        persistenceManager.upsert(query, update, SequenceCounter.class);
        return "Setting sequence to start after maxId: " + maxId;
    }

    public Integer getCurrentSequenceId(String seqName) {
        Query query = new Query(Criteria.where("_id").is(seqName));
        SequenceCounter sequence = mongoTemplate.findOne(query, SequenceCounter.class);
        return sequence != null ? sequence.getSeq() : null;
    }

    public int incrementSequence(String seqName, int incrementBy) {
        Query query = new Query(Criteria.where("_id").is(seqName));
        Update update = new Update().inc("seq", incrementBy);

        SequenceCounter counter = mongoTemplate.findAndModify(
                query,
                update,
                options().returnNew(true).upsert(true),
                SequenceCounter.class
        );

        return counter != null ? counter.getSeq() : 1;
    }

    @Data
    public static class SequenceCounter {
        @Id
        private String id;
        private int seq;
    }
}
