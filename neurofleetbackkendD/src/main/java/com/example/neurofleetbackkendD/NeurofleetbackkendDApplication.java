package com.example.neurofleetbackkendD;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@EnableScheduling
public class NeurofleetbackkendDApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(NeurofleetbackkendDApplication.class, args);
        System.out.println("═══════════════════════════════════════════════════");
        System.out.println("🚀 NeuroFleetX Backend Started Successfully!");
        System.out.println("📡 Server running on: http://localhost:8083");
        System.out.println("📝 API Base URL: http://localhost:8083/api");
        System.out.println("═══════════════════════════════════════════════════");
        System.out.println("🔐 Test Credentials:");
        System.out.println("   Admin:    admin / admin123");
        System.out.println("   Manager:  manager1 / manager123");
        System.out.println("   Driver:   driver1 / driver123");
        System.out.println("   Customer: customer1 / customer123");
        System.out.println("═══════════════════════════════════════════════════");
    }
    
//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")
//                    .allowedOrigins("*") // Allow all origins for testing
//                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
//                    .allowedHeaders("*")
//                    .allowCredentials(false); // Changed to false when allowing all origins
//            }
//        };
    }

