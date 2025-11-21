package com.example.neurofleetbackkendD.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Map;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
public class WebSocketController {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @MessageMapping("/vehicle-location")
    @SendTo("/topic/vehicle-updates")
    public Map<String, Object> sendVehicleLocation(Map<String, Object> location) {
        return location;
    }
    
    @MessageMapping("/booking-status")
    @SendTo("/topic/booking-updates")
    public Map<String, Object> sendBookingUpdate(Map<String, Object> booking) {
        return booking;
    }
    
    // send real-time notification
    public void sendNotification(String userId, Map<String, Object> notification) {
        messagingTemplate.convertAndSend("/queue/notifications-" + userId, notification);
    }
}
