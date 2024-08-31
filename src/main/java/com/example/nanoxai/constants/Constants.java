package com.example.nanoxai.constants;

import com.example.nanoxai.model.Product;

public class Constants {
    public static class PRODUCT {
        public final static String ID = "_id";
        public final static String COLLECTION_NAME = "products";
        public final static String SEQ_NAME = Product.class.getSimpleName();
        public final static String TITLE = "title";
        public final static String DESCRIPTION = "description";
        public final static String TAGS = "tags";
        public final static String PRICE = "price";
        public final static String RATING = "rating";
        public final static String BARCODE = "meta.barcode";
        public final static String THUMBNAIL = "thumbnail";
        public final static int DEFAULT_SIZE = 20;
        public final static int DEFAULT_PAGE = 0;
    }

    public static class DUMMY_JSON_API {
        public final static String API_URL = "https://dummyjson.com/products?limit=0";
    }
}
