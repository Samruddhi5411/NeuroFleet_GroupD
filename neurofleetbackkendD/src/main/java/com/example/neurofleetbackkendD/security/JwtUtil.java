//package com.example.neurofleetbackkendD.security;
//
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Component;
//
//import java.security.Key;
//import java.util.Date;
//
//@Component
//public class JwtUtil {
//
//    private static final String SECRET = "mySuperSecureJwtKeyForHS256@2024!!";
//
//    private Key getSigningKey() {
//        return Keys.hmacShaKeyFor(SECRET.getBytes());
//    }
//
//    public String generateToken(String username, String role) {
//        return Jwts.builder()
//                .setSubject(username)
//                .claim("role", role)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hours
//                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    public String extractUsername(String token) {
//        try {
//            Claims claims = Jwts.parserBuilder()
//                    .setSigningKey(getSigningKey())
//                    .build()
//                    .parseClaimsJws(token)
//                    .getBody();
//            return claims.getSubject();
//        } catch (Exception e) {
//            return null;
//        }
//    }
//
//    public String extractRole(String token) {
//        try {
//            Claims claims = Jwts.parserBuilder()
//                    .setSigningKey(getSigningKey())
//                    .build()
//                    .parseClaimsJws(token)
//                    .getBody();
//            return claims.get("role", String.class);
//        } catch (Exception e) {
//            return null;
//        }
//    }
//}


//
//
//package com.example.neurofleetbackkendD.security;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Component;
//
//import java.security.Key;
//import java.util.Date;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.function.Function;
//
//@Component
//public class JwtUtil {
//    
//    @Value("${jwt.secret:NeuroFleetXSecretKey2024SuperSecureKeyForJWTAuthentication}")
//    private String secret;
//    
//    @Value("${jwt.expiration:86400000}")
//    private Long expiration;
//    
//    private Key getSigningKey() {
//        return Keys.hmacShaKeyFor(secret.getBytes());
//    }
//    
//    public String extractUsername(String token) {
//        return extractClaim(token, Claims::getSubject);
//    }
//    
//    public Date extractExpiration(String token) {
//        return extractClaim(token, Claims::getExpiration);
//    }
//    
//    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
//        final Claims claims = extractAllClaims(token);
//        return claimsResolver.apply(claims);
//    }
//    
//    private Claims extractAllClaims(String token) {
//        return Jwts.parserBuilder()
//            .setSigningKey(getSigningKey())
//            .build()
//            .parseClaimsJws(token)
//            .getBody();
//    }
//    
//    private Boolean isTokenExpired(String token) {
//        return extractExpiration(token).before(new Date());
//    }
//    
//    public String generateToken(UserDetails userDetails) {
//        Map<String, Object> claims = new HashMap<>();
//        return createToken(claims, userDetails.getUsername());
//    }
//    
//    public String generateToken(String username, String role) {
//        Map<String, Object> claims = new HashMap<>();
//        claims.put("role", role);
//        return createToken(claims, username);
//    }
//    
//    private String createToken(Map<String, Object> claims, String subject) {
//        return Jwts.builder()
//            .setClaims(claims)
//            .setSubject(subject)
//            .setIssuedAt(new Date(System.currentTimeMillis()))
//            .setExpiration(new Date(System.currentTimeMillis() + expiration))
//            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
//            .compact();
//    }
//    
//    public Boolean validateToken(String token, UserDetails userDetails) {
//        final String username = extractUsername(token);
//        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
//    }
//}
//
package com.example.neurofleetbackkendD.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {
    
    // Use a strong secret key (in production, move this to application.properties)
    private static final String SECRET_KEY = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";
    private static final long JWT_TOKEN_VALIDITY = 24 * 60 * 60 * 1000; // 24 hours

    private Key getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        System.out.println("🔍 Extracting username from token...");
        String username = extractClaim(token, Claims::getSubject);
        System.out.println("👤 Extracted username: " + username);
        return username;
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            System.err.println("❌ Error parsing JWT token: " + e.getMessage());
            throw e;
        }
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        String token = createToken(claims, username);
        System.out.println("✅ Token generated for: " + username);
        System.out.println("🔑 Token preview: " + token.substring(0, Math.min(30, token.length())) + "...");
        return token;
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            boolean isValid = (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
            
            System.out.println("🔐 Token Validation:");
            System.out.println("   Token username: " + username);
            System.out.println("   UserDetails username: " + userDetails.getUsername());
            System.out.println("   Username match: " + username.equals(userDetails.getUsername()));
            System.out.println("   Token expired: " + isTokenExpired(token));
            System.out.println("   ✅ Token valid: " + isValid);
            
            return isValid;
        } catch (Exception e) {
            System.err.println("❌ Token validation failed: " + e.getMessage());
            return false;
        }
    }
}