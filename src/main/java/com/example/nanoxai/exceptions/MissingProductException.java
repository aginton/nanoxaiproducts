package com.example.nanoxai.exceptions;

public class MissingProductException extends RuntimeException{

    public MissingProductException(Integer id) {
        super("Could not find product with id " + id);
    }
}
