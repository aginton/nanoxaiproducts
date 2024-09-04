package com.example.nanoxai.exceptions;

import java.util.List;

public class MissingProductException extends RuntimeException{

    public MissingProductException(Integer id) {
        super("Could not find product with id " + id);
    }

    public MissingProductException(List<Integer> ids) {
        super("Could not find product with ids: " + ids);
    }
}
