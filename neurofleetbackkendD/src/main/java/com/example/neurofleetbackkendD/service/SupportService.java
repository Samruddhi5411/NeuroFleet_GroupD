package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.SupportTicket;
import com.example.neurofleetbackkendD.model.enums.TicketStatus;
import com.example.neurofleetbackkendD.repository.SupportTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SupportService {
    
    @Autowired
    private SupportTicketRepository ticketRepository;
    
    public List<SupportTicket> getAllTickets() {
        return ticketRepository.findAll();
    }
    
    public List<SupportTicket> getCustomerTickets(Long customerId) {
        return ticketRepository.findByCustomerId(customerId);
    }
    
    public List<SupportTicket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status.name());
    }
    
    public SupportTicket createTicket(SupportTicket ticket) {
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }
    
    public SupportTicket updateTicket(Long id, SupportTicket updates) {
        SupportTicket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        if (updates.getStatus() != null) {
            ticket.setStatus(updates.getStatus());
        }
        if (updates.getResolution() != null) {
            ticket.setResolution(updates.getResolution());
        }
        if (updates.getAssignedTo() != null) {
            ticket.setAssignedTo(updates.getAssignedTo());
        }
        if (updates.getPriority() != null) {
            ticket.setPriority(updates.getPriority());
        }
        
        if (ticket.getStatus() == TicketStatus.RESOLVED || 
            ticket.getStatus() == TicketStatus.CLOSED) {
            ticket.setResolvedAt(LocalDateTime.now());
        }
        
        return ticketRepository.save(ticket);
    }
    
    public SupportTicket getTicketById(Long id) {
        return ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }
    
    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }
}