package com.example.nanoxai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    private int rating;
    private String comment;
    private String date;
    private String reviewerName;
    private String reviewerEmail;
}
