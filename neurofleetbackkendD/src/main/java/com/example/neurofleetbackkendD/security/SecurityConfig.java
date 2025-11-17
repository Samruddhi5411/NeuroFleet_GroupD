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
                // Public endpoints
                .requestMatchers("/api/auth/**", "/h2-console/**", "/error", "/api/test/**").permitAll()
                
                // Admin endpoints - Using hasAuthority with exact role name
                .requestMatchers("/api/admin/**", "/api/dashboard/**", 
                                "/api/urban-mobility/**", "/api/analytics/**").hasAuthority("ADMIN")
                
                // Manager endpoints
                .requestMatchers("/api/manager/**", "/api/dashboard/manager/**").hasAnyAuthority("MANAGER", "ADMIN")
                
                // Driver endpoints
                .requestMatchers("/api/driver/**", "/api/dashboard/driver/**").hasAuthority("DRIVER")
                
                // Customer endpoints
                .requestMatchers("/api/customer/**", "/api/dashboard/customer/**", 
                                "/api/recommendations/**").hasAuthority("CUSTOMER")
                
                // Shared endpoints - all authenticated users
                .requestMatchers("/api/vehicles/**").authenticated()
                .requestMatchers("/api/bookings/**").authenticated()
                .requestMatchers("/api/maintenance/**").authenticated()
                .requestMatchers("/api/routes/**").authenticated()
                .requestMatchers("/api/telemetry/**").authenticated()
                
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