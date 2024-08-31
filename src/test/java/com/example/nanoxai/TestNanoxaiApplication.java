package com.example.nanoxai;

import org.springframework.boot.SpringApplication;

public class TestNanoxaiApplication {

    public static void main(String[] args) {
        SpringApplication.from(NanoxaiApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
