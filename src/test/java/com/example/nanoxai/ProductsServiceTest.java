package com.example.nanoxai;

import com.example.nanoxai.exceptions.DuplicateBarcodeException;
import com.example.nanoxai.exceptions.InvalidProductDetailsException;
import com.example.nanoxai.exceptions.MissingProductException;
import com.example.nanoxai.exceptions.NullProductException;
import com.example.nanoxai.model.Dimensions;
import com.example.nanoxai.model.Meta;
import com.example.nanoxai.model.Product;
import com.example.nanoxai.model.Review;
import com.example.nanoxai.model.requests.ProductSortableField;
import com.example.nanoxai.model.requests.SearchProductsRequest;
import com.example.nanoxai.model.responses.ProductsResponse;
import com.example.nanoxai.persistence.api.PersistenceManager;
import com.example.nanoxai.service.ProductsService;
import org.junit.Assert;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@Import(TestcontainersConfiguration.class)
@Testcontainers
@ActiveProfiles("test")
public class ProductsServiceTest {

    @Autowired
    private ProductsService productsService;

    @Autowired
    private PersistenceManager persistenceManager;

    @BeforeEach
    void setUp() {
        // Optional: Clear the database before each test to ensure a clean state
        persistenceManager.resetCollectionAndSequence(Product.class);
    }

    //Happy path
    @Test
    void testCreateProduct() {
        // Set variables for each field
        String title = "someProduct";
        String description = "This is a detailed description of product";
        String category = "Category ";
        Float price = 19.99f;
        Float discountPercentage = 3.99f;
        Float rating = 4f;
        Integer stock = 100;
        List<String> tags = Arrays.asList("tag1", "tag2", "tag3");
        String brand = "Brand ";
        String sku = "SKU";
        Integer weight = 55;
        Dimensions dimensions = Dimensions.builder()
                .width(1f)
                .height(2f)
                .depth(3f)
                .build();
        String warrantyInformation = "Warranty Information for Product ";
        String shippingInformation = "Shipping Information for Product ";
        List<Review> reviews = Arrays.asList(
                Review.builder()
                        .rating(3)
                        .comment("Great product!")
                        .date("2024-09-01")
                        .reviewerName("User")
                        .reviewerEmail("user@example.com")
                        .build(),
                Review.builder()
                        .rating(4)
                        .comment("Not what I expected.")
                        .date("2024-09-02")
                        .reviewerName("User2")
                        .reviewerEmail("user2@example.com")
                        .build()
        );
        String returnPolicy = "30-day return policy";
        Integer minimumOrderQuantity = 1;
        Meta meta = Meta.builder()
                .createdAt("2024-08-01")
                .updatedAt("2024-08-20")
                .barcode("123456789")
                .qrCode("http://example.com/qrcode/")
                .build();
        List<String> images = Arrays.asList("http://example.com/images/product-1.jpg",
                "http://example.com/images/product-2.jpg");
        String thumbnail = "http://example.com/images/product-thumb.jpg";

        // Use the builder pattern with the variables
        Product product = Product.builder()
                .title(title)
                .description(description)
                .category(category)
                .price(price)
                .discountPercentage(discountPercentage)
                .rating(rating)
                .stock(stock)
                .tags(tags)
                .brand(brand)
                .sku(sku)
                .weight(weight)
                .dimensions(dimensions)
                .warrantyInformation(warrantyInformation)
                .shippingInformation(shippingInformation)
                .reviews(reviews)
                .returnPolicy(returnPolicy)
                .minimumOrderQuantity(minimumOrderQuantity)
                .meta(meta)
                .images(images)
                .thumbnail(thumbnail)
                .build();


        Integer id = productsService.createProduct(product).getId();
        Product savedProduct = productsService.getFullProductDetailsById(id);

        assertThat(savedProduct.getId()).isNotNull();
        Assertions.assertEquals(title, savedProduct.getTitle());
        Assertions.assertEquals(description, savedProduct.getDescription());
        Assert.assertEquals(category, savedProduct.getCategory());
        Assert.assertEquals(price, savedProduct.getPrice());
        Assert.assertEquals(discountPercentage, savedProduct.getDiscountPercentage());
        Assert.assertEquals(rating, savedProduct.getRating());
        Assert.assertEquals(stock, savedProduct.getStock());
        Assert.assertEquals(tags, savedProduct.getTags());
        Assert.assertEquals(brand, savedProduct.getBrand());
        Assert.assertEquals(sku, savedProduct.getSku());
        Assert.assertEquals(weight, savedProduct.getWeight());
        Assert.assertEquals(dimensions, savedProduct.getDimensions());
        Assert.assertEquals(warrantyInformation, savedProduct.getWarrantyInformation());
        Assert.assertEquals(shippingInformation, savedProduct.getShippingInformation());
        Assert.assertEquals(reviews, savedProduct.getReviews());
        Assert.assertEquals(returnPolicy, savedProduct.getReturnPolicy());
        Assert.assertEquals(minimumOrderQuantity, savedProduct.getMinimumOrderQuantity());
        Assert.assertEquals(meta, savedProduct.getMeta());
        Assert.assertEquals(images, savedProduct.getImages());
        Assert.assertEquals(thumbnail, savedProduct.getThumbnail());
    }

    @Test
    void testUpdateProduct(){
        String title1 = "abcd";
        String title2 = "xyz";
        float price1 = 1f;
        float price2 = 3f;
        float rating1 = 12.3f;
        float rating2 = 44f;
        List<String> tags = Arrays.asList("someTag");
        List<String> images = Arrays.asList("someImage");
        Meta meta1 = Meta.builder().barcode("abcdef").build();

        Product product = productsService.createProduct(Product.builder()
                .title(title1)
                .images(images)
                .tags(tags)
                .price(price1)
                .rating(rating1)
                .meta(meta1)
                .build());

        product.setTitle(title2);
        product.setRating(rating2);
        product.setPrice(price2);

        productsService.updateProduct(product);
        Product fullProductDetailsById = productsService.getFullProductDetailsById(product.getId());
        Assertions.assertEquals(title2, fullProductDetailsById.getTitle());
        Assertions.assertEquals(price2, fullProductDetailsById.getPrice());
        Assertions.assertEquals(rating2, fullProductDetailsById.getRating());
    }

    @Test
    void testGetAllProducts() {
        List<String> tags = Arrays.asList("someTag");
        List<String> images = Arrays.asList("someImage");
        Meta meta1 = Meta.builder().barcode("abcdef").build();
        Meta meta2 = Meta.builder().barcode("xyz").build();

        Product product1 = setProductUsingMinimalFields(5f, 3f, meta1, tags, images);
        Product product2 = setProductUsingMinimalFields(12.5f, 6f, meta2, tags, images);

        productsService.createProduct(product1);
        productsService.createProduct(product2);

        ProductsResponse response = productsService.getAllProducts();
        assertThat(response.getProducts().size()).isEqualTo(2);
    }

    @Test
    void testDeleteProduct() {
        List<String> tags = Arrays.asList("someTag");
        List<String> images = Arrays.asList("someImage");
        Meta meta = Meta.builder().barcode("abcdef").build();

        Product product = setProductUsingMinimalFields(10f, 4f, meta, tags, images);

        Product savedProduct = productsService.createProduct(product);

        productsService.deleteProductById(savedProduct.getId());

        ProductsResponse response = productsService.getAllProducts();
        assertThat(response.getProducts().size()).isEqualTo(0);
    }

    @Test
    void testDeleteProductsByIds() {
        List<String> tags = Arrays.asList("someTag");
        List<String> images = Arrays.asList("someImage");
        Meta meta1 = Meta.builder().barcode("abcdef").build();
        Meta meta2 = Meta.builder().barcode("xyz").build();

        Product product1 = setProductUsingMinimalFields(5f, 3f, meta1, tags, images);
        Product product2 = setProductUsingMinimalFields(12.5f, 6f, meta2, tags, images);

        Product savedProduct1 = productsService.createProduct(product1);
        Product savedProduct2 = productsService.createProduct(product2);

        List<Integer> idsToDelete = Arrays.asList(savedProduct1.getId(), savedProduct2.getId());
        productsService.deleteProductsByIds(idsToDelete);

        ProductsResponse response = productsService.getAllProducts();
        assertThat(response.getProducts().size()).isEqualTo(0);
    }

    @Test
    void testSearchUsingFilter(){
        String prefix1 = "apple";
        String prefix2 = "banana";
        List<String> tags = Arrays.asList("someTag");
        List<String> images = Arrays.asList("someImage");
        Meta meta1 = Meta.builder().barcode("abcdef").build();
        Meta meta2 = Meta.builder().barcode("xyz").build();
        Product product1 = setProductUsingMinimalFields(10f, 3f, meta1, tags, images);
        product1.setTitle(prefix1 + "jfdklsa");
        Product product2 = setProductUsingMinimalFields(10f, 3f, meta2, tags, images);
        product2.setTitle(prefix2 + "nwer");
        productsService.createProduct(product1);
        productsService.createProduct(product2);

        SearchProductsRequest request = SearchProductsRequest.builder()
                .text(prefix1)
                .build();
        ProductsResponse response = productsService.searchProducts(request);
        Assertions.assertEquals(1, response.getProducts().size());
        Assertions.assertEquals(meta1, response.getProducts().get(0).getMeta());
    }

    @Test
    void testSearchUsingSort(){
        String title_low = "apple";
        String title_high = "banana";
        float rating_low = 1f;
        float price_low = 1f;
        float rating_high = 2f;
        float price_high = 2f;
        List<String> tags = Arrays.asList("someTag");
        List<String> images = Arrays.asList("someImage");
        Meta meta1 = Meta.builder().barcode("abcdef").build();
        Meta meta2 = Meta.builder().barcode("xyz").build();

        Product product1 = setProductUsingMinimalFields(price_low, rating_low, meta1, tags, images);
        product1.setTitle(title_low);
        Product product2 = setProductUsingMinimalFields(price_high, rating_high, meta2, tags, images);
        product2.setTitle(title_high);

        productsService.createProduct(product1);
        productsService.createProduct(product2);

        SearchProductsRequest request = SearchProductsRequest
                .builder()
                .sortField(ProductSortableField.TITLE)
                .build();

        //Search by title ascending
        ProductsResponse response = productsService.searchProducts(request);
        Assertions.assertEquals(2, response.getProducts().size());
        Assertions.assertEquals(title_low, response.getProducts().get(0).getTitle());
        Assertions.assertEquals(title_high, response.getProducts().get(1).getTitle());

        //Search by title descending
        request.setOrder(Sort.Direction.DESC);
        response = productsService.searchProducts(request);
        Assertions.assertEquals(title_high, response.getProducts().get(0).getTitle());
        Assertions.assertEquals(title_low, response.getProducts().get(1).getTitle());

        //Search by price ascending
        request.setSortField(ProductSortableField.PRICE.getFieldName());
        request.setOrder(Sort.Direction.ASC);
        response = productsService.searchProducts(request);
        Assertions.assertEquals(price_low, response.getProducts().get(0).getPrice());
        Assertions.assertEquals(price_high, response.getProducts().get(1).getPrice());

        //Search by price descending
        request.setOrder(Sort.Direction.DESC);
        response = productsService.searchProducts(request);
        Assertions.assertEquals(price_high, response.getProducts().get(0).getPrice());
        Assertions.assertEquals(price_low, response.getProducts().get(1).getPrice());

        //Search by rating ascending
        request.setSortField(ProductSortableField.RATING.getFieldName());
        request.setOrder(Sort.Direction.ASC);
        response = productsService.searchProducts(request);
        Assertions.assertEquals(rating_low, response.getProducts().get(0).getRating());
        Assertions.assertEquals(rating_high, response.getProducts().get(1).getRating());

        //Search by rating descending
        request.setOrder(Sort.Direction.DESC);
        response = productsService.searchProducts(request);
        Assertions.assertEquals(rating_high, response.getProducts().get(0).getRating());
        Assertions.assertEquals(rating_low, response.getProducts().get(1).getRating());
    }

    @Test
    void testPagination(){
        List<String> tags = Arrays.asList("someTag");
        List<String> images = Arrays.asList("someImage");
        Meta meta1 = Meta.builder().barcode("abcdef").build();
        Meta meta2 = Meta.builder().barcode("xyz").build();
        Meta meta3 = Meta.builder().barcode("wjfdklsa").build();
        Meta meta4 = Meta.builder().barcode("nfdsnf").build();
        Meta meta5 = Meta.builder().barcode("bbnw").build();

        Product product1 = setProductUsingMinimalFields(1f, 2f, meta1, tags, images);
        Product product2 = setProductUsingMinimalFields(1f, 2f, meta2, tags, images);
        Product product3 = setProductUsingMinimalFields(1f, 2f, meta3, tags, images);
        Product product4 = setProductUsingMinimalFields(1f, 2f, meta4, tags, images);
        Product product5 = setProductUsingMinimalFields(1f, 2f, meta5, tags, images);

        Product savedProduct1 = productsService.createProduct(product1);
        Product savedProduct2 = productsService.createProduct(product2);
        Product savedProduct3 = productsService.createProduct(product3);
        Product savedProduct4 = productsService.createProduct(product4);
        Product savedProduct5 = productsService.createProduct(product5);

        SearchProductsRequest request = SearchProductsRequest.builder()
                .page(0)
                .size(2)
                .build();
        ProductsResponse response = productsService.searchProducts(request);
        Assertions.assertEquals(5L, response.getTotal());
        Assertions.assertEquals(2, response.getProducts().size());
        Assertions.assertEquals(savedProduct1.getId(), response.getProducts().get(0).getId());
        Assertions.assertEquals(savedProduct2.getId(), response.getProducts().get(1).getId());

        request.setPage(1);
        response = productsService.searchProducts(request);
        Assertions.assertEquals(5L, response.getTotal());
        Assertions.assertEquals(2, response.getProducts().size());
        Assertions.assertEquals(savedProduct3.getId(), response.getProducts().get(0).getId());
        Assertions.assertEquals(savedProduct4.getId(), response.getProducts().get(1).getId());

        request.setPage(2);
        response = productsService.searchProducts(request);
        Assertions.assertEquals(5L, response.getTotal());
        Assertions.assertEquals(1, response.getProducts().size());
        Assertions.assertEquals(savedProduct5.getId(), response.getProducts().get(0).getId());
    }


    //Bad Path
    @Test
    void createProductWithDuplicateBarcodeExpectError(){
        List<String> tags = Arrays.asList("someTag");
        List<String> images = Arrays.asList("someImage");
        Meta meta1 = Meta.builder().barcode("abcdef").build();
        Product product1 = setProductUsingMinimalFields(10f, 3f, meta1, tags, images);
        Product product2 = setProductUsingMinimalFields(5f, 3f, meta1, tags, images);

        productsService.createProduct(product1);
        Assertions.assertThrows(DuplicateBarcodeException.class, () -> {
            productsService.createProduct(product2);
        });
    }

    @Test
    void createProductWithMissingFieldsExpectError(){
        Product product = Product.builder().title("emptyProduct").build();
        InvalidProductDetailsException invalidProductDetailsException = Assertions.assertThrows(InvalidProductDetailsException.class, () -> {
            productsService.createProduct(product);
        });
        //Expect error message for each missing field
        Assertions.assertEquals(5, invalidProductDetailsException.getErrorMessages().size());
    }

    @Test
    void findByInvalidIdExpectError(){
        Assertions.assertThrows(MissingProductException.class, () -> {
            productsService.getFullProductDetailsById(100);
        });
    }

    @Test
    void updateByInvalidIdExpectError(){
        List<String> tags = Arrays.asList("someTag");
        List<String> images = Arrays.asList("someImage");
        Meta meta1 = Meta.builder().barcode("abcdef").build();
        Product product = setProductUsingMinimalFields(1f, 2f, meta1, tags, images);
        product.setId(100);
        Assertions.assertThrows(MissingProductException.class, () -> {
            productsService.updateProduct(product);
        });
    }

    @Test
    void createNullProductExpectError(){
        Assertions.assertThrows(NullProductException.class, () -> {
            productsService.createProduct(null);
        });
    }


    Product setProductUsingMinimalFields(Float price, Float rating, Meta meta, List<String> tags, List<String> images){
        return Product.builder()
                .price(price)
                .rating(rating)
                .meta(meta)
                .tags(tags)
                .images(images)
                .build();
    }
}
