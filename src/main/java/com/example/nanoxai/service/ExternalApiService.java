package com.example.nanoxai.service;

import com.example.nanoxai.model.ExternalDummyProductsApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import static com.example.nanoxai.constants.Constants.DUMMY_JSON_API.API_URL;

@Service
@Slf4j
public class ExternalApiService {
    private RestTemplate restTemplate = new RestTemplate();

    public ExternalDummyProductsApiResponse getExternalDummyProducts(){
        return restTemplate.getForObject(API_URL, ExternalDummyProductsApiResponse.class);
    }
}
