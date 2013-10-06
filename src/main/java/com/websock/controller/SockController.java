package com.websock.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeEvent;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

import com.websock.model.Chat;
import com.websock.service.RandomFactService;

@Controller
public class SockController {
	
	private static final Log logger = LogFactory.getLog(SockController.class);

	private final SimpMessageSendingOperations messagingTemplate;
	private final RandomFactService randomFactService;
	private List<String> users = new ArrayList<String>();
	
	@Autowired
	public SockController(RandomFactService randomFactService, SimpMessageSendingOperations messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
		this.randomFactService = randomFactService;
		
	}
		
	@SubscribeEvent("/join")
	public List<String> join(Principal principal) throws Exception {
		logger.debug(principal.getName() + " joined the chat!");
		if(!users.contains(principal.getName())) {
			users.add(principal.getName());
		}
		
		// notify all subscribers of new user
		messagingTemplate.convertAndSend("/topic/join", principal.getName());
		
		return users;
	}

	@MessageMapping(value="/chat")
	public void getChat(Chat chat, Principal principal) {
		
		chat.setFrom(principal.getName());
		
		logger.debug("Received chat " + chat.toString());
		messagingTemplate.convertAndSendToUser(chat.getTo(), "/queue/chats", chat);
	}
	
	@MessageExceptionHandler
	@SendToUser(value="/queue/errors")
	public String handleException(Throwable exception) {
		return exception.getMessage();
	}
	
	@Scheduled(fixedDelay=5000)
	public void sendRandomFact() {
		this.messagingTemplate.convertAndSend("/queue/random-fact", randomFactService.randomFact());
	}
	
	
}
