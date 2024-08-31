package com.example.nanoxai.exceptions;

public class DuplicateBarcodeException extends RuntimeException{
    public DuplicateBarcodeException(String message) {
        super(message);
    }
}
