package com.example.nanoxai.exceptions;

import com.mongodb.DuplicateKeyException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<String> handleDuplicateKeyException(DuplicateKeyException ex) {
        log.error("Duplicate key error: " + ex.getMessage());
        return new ResponseEntity<>("A record with the same key already exists. Please check your input and try again." + ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(MissingProductException.class)
    public ResponseEntity<String> handleCustomException(MissingProductException ex) {
        log.error(ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidProductDetailsException.class)
    public ResponseEntity<List<String>> handleCustomException(InvalidProductDetailsException ex) {
        log.error(ex.getMessage());
        return new ResponseEntity<>(ex.getErrorMessages(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateBarcodeException.class)
    public ResponseEntity<String> handleCustomException(DuplicateBarcodeException ex) {
        log.error(ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(NullProductException.class)
    public ResponseEntity<String> handleCustomException(NullProductException ex) {
        log.error(ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

}
