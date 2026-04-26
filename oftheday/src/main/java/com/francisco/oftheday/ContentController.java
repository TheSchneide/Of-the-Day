package com.francisco.oftheday;

import org.springframework.core.io.ClassPathResource;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.nio.charset.StandardCharsets;

@RestController
public class ContentController {

    @CrossOrigin(origins = "*") 
    @GetMapping(value = "/api/content", produces = "application/json")
    public String getInspirationalContent() {
        try {
            ClassPathResource resource = new ClassPathResource("inspirational_content.json");
            byte[] data = FileCopyUtils.copyToByteArray(resource.getInputStream());
            return new String(data, StandardCharsets.UTF_8);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"Unable to load content\"}";
        }
    }
}