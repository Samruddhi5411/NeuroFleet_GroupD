package com.example.neurofleetbackkendD.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;
import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            user.getActive(),
            true,
            true,
            true,
            getAuthorities(user)
        );
    }
    
    // Added both ROLE_ prefix and plain role for compatibility
    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        return Collections.singletonList(
            new SimpleGrantedAuthority(user.getRole().name())
        );
    }
}
