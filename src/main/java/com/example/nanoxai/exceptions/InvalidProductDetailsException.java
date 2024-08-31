package com.example.nanoxai.exceptions;

import java.util.List;

public class InvalidProductDetailsException extends RuntimeException{
    private final List<String> errorMessages;

    public InvalidProductDetailsException(List<String> errorMessages) {
        super("Validation failed with multiple errors");
        this.errorMessages = errorMessages;
    }

    public List<String> getErrorMessages() {
        return errorMessages;
    }

}
