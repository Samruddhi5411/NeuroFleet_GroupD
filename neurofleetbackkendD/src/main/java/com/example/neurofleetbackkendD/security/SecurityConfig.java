package com.example.neurofleetbackkendD.security;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
public class SecurityConfig {
    
    private final JwtFilter jwtFilter;
    private final UserDetailsService userDetailsService;
    
    public SecurityConfig(JwtFilter jwtFilter, UserDetailsService userDetailsService) {
        this.jwtFilter = jwtFilter;
        this.userDetailsService = userDetailsService;
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:3001"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                config.setExposedHeaders(List.of("Authorization"));
                config.setAllowCredentials(true);
                return config;
            }))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // ✅ Public endpoints
                .requestMatchers("/api/auth/**", "/h2-console/**", "/error", "/api/test/**").permitAll()
                
                // ✅ CRITICAL FIX: Specific routes BEFORE general /api/admin/**
                // Routes and Loads - Manager and Admin
                .requestMatchers("/api/routes/**").hasAnyAuthority("ADMIN", "MANAGER")
                .requestMatchers("/api/loads/**").hasAnyAuthority("ADMIN", "MANAGER")
                
                // Analytics - Manager and Admin
                .requestMatchers("/api/analytics/**").hasAnyAuthority("ADMIN", "MANAGER")
                
                // Vehicles - Manager and Admin
                .requestMatchers("/api/admin/vehicles/**").hasAnyAuthority("ADMIN", "MANAGER")
                .requestMatchers("/api/manager/vehicles/**").hasAnyAuthority("ADMIN", "MANAGER")
                
                // Manager specific endpoints
                .requestMatchers("/api/manager/**").hasAnyAuthority("MANAGER", "ADMIN")
                
                // Admin endpoints (AFTER specific routes)
                .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
                .requestMatchers("/api/dashboard/**").hasAuthority("ADMIN")
                .requestMatchers("/api/urban-mobility/**").hasAuthority("ADMIN")
                
                // Driver endpoints
                .requestMatchers("/api/driver/**").hasAuthority("DRIVER")
                .requestMatchers("/api/dashboard/driver/**").hasAuthority("DRIVER")
                
                // Customer endpoints
                .requestMatchers("/api/customer/**").hasAuthority("CUSTOMER")
                .requestMatchers("/api/dashboard/customer/**").hasAuthority("CUSTOMER")
                .requestMatchers("/api/recommendations/**").hasAuthority("CUSTOMER")
                
                // Shared endpoints
                .requestMatchers("/api/vehicles/**").authenticated()
                .requestMatchers("/api/bookings/**").authenticated()
                .requestMatchers("/api/maintenance/**").authenticated()
                
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .headers(headers -> headers.frameOptions().disable());
        
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}