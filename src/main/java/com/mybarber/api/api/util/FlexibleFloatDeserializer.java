package com.mybarber.api.api.util;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

public class FlexibleFloatDeserializer extends JsonDeserializer<Float> {

   

	@Override
	public Float deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
		String floatString = p.getText();
        if (floatString.contains(",")) {
            floatString = floatString.replace(",", ".");
        }
        return Float.valueOf(floatString);
	}

}