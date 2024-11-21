package com.sivo.resource;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeConverter {

  public static LocalDateTime convertStringToLocalDateTime(String dateTimeString) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("YYY-MM-DDThh:mm");
    LocalDateTime localDateTime = LocalDateTime.parse(dateTimeString, formatter);
    return localDateTime;
  }
}
