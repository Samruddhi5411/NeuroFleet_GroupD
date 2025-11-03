package com.example.neurofleetbackkendD.security;



import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

    	
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String role = jwtUtil.extractRole(token);
            
            //now for that role it will validate the token 
           // and if no existing user has been authenticated yet for this request
            if (role != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
            	// creates a spring security authentication 1. Principal i.e. role(User) 2. Credentials ( here it is null because we have already authenticted via JWT) 
            	//3. authorities : means spring will recognize what the user can access(hasAuthority("User")
            	UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        role, 
                        null, 
                        Collections.singleton(new SimpleGrantedAuthority(role)) //   .requestMatchers("/api/products").hasAuthority("USER") defined it securityconfig
                    );
            	
            	//sets the user authentication in the spring security context
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authToken); // It will tell spring security that this request is from an authenticated user ,
                                                                                 //and spring knows who the user is and what they are allowed to do
            }
        }

        filterChain.doFilter(request, response);
    }
}