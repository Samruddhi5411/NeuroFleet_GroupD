//package com.example.neurofleetbackkendD.controllers;
//
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/test")
//@CrossOrigin(origins = "http://localhost:3000")
//public class TestAuthController {
//    
//    @GetMapping("/auth")
//    public String testAuth() {
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        
//        System.out.println("🧪 TEST AUTH ENDPOINT CALLED");
//        System.out.println("🔐 Authentication: " + auth);
//        System.out.println("👤 Principal: " + (auth != null ? auth.getPrincipal() : "NULL"));
//        System.out.println("✅ Authorities: " + (auth != null ? auth.getAuthorities() : "NULL"));
//        System.out.println("🔓 Authenticated: " + (auth != null ? auth.isAuthenticated() : "false"));
//        
//        if (auth != null && auth.isAuthenticated()) {
//            return "✅ Authentication SUCCESS! User: " + auth.getName() + ", Authorities: " + auth.getAuthorities();
//        }
//        
//        return "❌ Not authenticated";
//    }
//}