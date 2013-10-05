package com.websock.controller;

import java.security.Principal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeEvent;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import com.websock.model.Chat;

@Controller
public class SockController {
	
	private static final Log logger = LogFactory.getLog(SockController.class);
	private DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
	private final SimpMessageSendingOperations messagingTemplate;
	
	@Autowired
	public SockController(SimpMessageSendingOperations messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
	}
	
	@MessageMapping(value="/chat")
	public void getChat(Chat chat, Principal principal) {
		
		chat.setFrom(principal.getName());
		
		logger.debug("Received chat " + chat.toString());
		messagingTemplate.convertAndSendToUser(chat.getTo(), "/queue/chats", chat);
	}
	

	@SubscribeEvent("/test")
	public String test() throws Exception {
		logger.debug("Test Received");
		return dateFormat.format(new Date());
	}
	
	@SubscribeEvent("/join")
	public void join(Principal principal) throws Exception {
		logger.debug(principal.getName() + " joined the chat!");
		messagingTemplate.convertAndSend("/topic/join", principal.getName());
	}

	@MessageMapping(value="/trade")
	public void executeTrade() {
		
		logger.debug("Trade: executed");
		//this.tradeService.executeTrade(trade);
	}
	
	

	@MessageExceptionHandler
	@SendToUser(value="/queue/errors")
	public String handleException(Throwable exception) {
		return exception.getMessage();
	}
	
	@Scheduled(fixedDelay=1000)
	public void sendTimeUpdates() {
		//System.out.println("Sending message");
		this.messagingTemplate.convertAndSend("/queue/time-updates", dateFormat.format(new Date()));
	}
	
	
}
