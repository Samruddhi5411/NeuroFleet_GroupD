//package com.example.neurofleetbackkendD.security;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//
//@Component
//public class JwtFilter extends OncePerRequestFilter {
//    
//    private final JwtUtil jwtUtil;
//    private final UserDetailsService userDetailsService;
//    
//    public JwtFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
//        this.jwtUtil = jwtUtil;
//        this.userDetailsService = userDetailsService;
//    }
//    
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, 
//                                    HttpServletResponse response, 
//                                    FilterChain filterChain) throws ServletException, IOException {
//        
//        String path = request.getRequestURI();
//        
//       
//        if (path.startsWith("/api/auth/") || path.startsWith("/error") || path.startsWith("/h2-console")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//        
//        final String authHeader = request.getHeader("Authorization");
//        
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            System.out.println("⚠️ No valid Authorization header for: " + path);
//            filterChain.doFilter(request, response);
//            return;
//        }
//        
//        try {
//            String jwt = authHeader.substring(7);
//            String username = jwtUtil.extractUsername(jwt);
//            
//            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//                
//                if (jwtUtil.validateToken(jwt, userDetails)) {
//                    UsernamePasswordAuthenticationToken authToken = 
//                        new UsernamePasswordAuthenticationToken(
//                            userDetails, 
//                            null, 
//                            userDetails.getAuthorities()
//                        );
//                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                    SecurityContextHolder.getContext().setAuthentication(authToken);
//                    
//             
//                    System.out.println("✅ Authenticated: " + username + " | Authorities: " + userDetails.getAuthorities() + " | Path: " + path);
//                }
//            }
//        } catch (Exception e) {
//            System.err.println("❌ JWT Filter Error for " + path + ": " + e.getMessage());
//            e.printStackTrace();
//        }
//        
//        filterChain.doFilter(request, response);
//    }
//}

package com.example.neurofleetbackkendD.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    
    public JwtFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String path = request.getRequestURI();
        String method = request.getMethod();
        
        System.out.println("\n🔍 JWT Filter Processing: " + method + " " + path);
        
        // Skip authentication for public endpoints
        if (path.startsWith("/api/auth/") || path.startsWith("/error") || path.startsWith("/h2-console")) {
            System.out.println("⏭️  Public endpoint, skipping authentication");
            filterChain.doFilter(request, response);
            return;
        }
        
        final String authHeader = request.getHeader("Authorization");
        
        System.out.println("🔑 Authorization Header: " + (authHeader != null ? "Present (Bearer...)" : "❌ MISSING"));
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("⚠️  No valid Authorization header for: " + path);
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            String jwt = authHeader.substring(7);
            System.out.println("📜 JWT Token: " + jwt.substring(0, Math.min(20, jwt.length())) + "...");
            
            String username = jwtUtil.extractUsername(jwt);
            System.out.println("👤 Extracted Username: " + username);
            
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                System.out.println("🔐 User Authorities: " + userDetails.getAuthorities());
                
                if (jwtUtil.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails, 
                            null, 
                            userDetails.getAuthorities()
                        );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                    System.out.println("✅ AUTHENTICATION SUCCESS: " + username);
                    System.out.println("✅ Authorities: " + userDetails.getAuthorities());
                    System.out.println("✅ Accessing: " + path);
                } else {
                    System.out.println("❌ Token validation FAILED");
                }
            } else if (username == null) {
                System.out.println("❌ Could not extract username from token");
            } else {
                System.out.println("ℹ️  User already authenticated");
            }
        } catch (Exception e) {
            System.err.println("❌ JWT Filter Exception for " + path);
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("➡️  Proceeding to next filter...\n");
        filterChain.doFilter(request, response);
    }
}