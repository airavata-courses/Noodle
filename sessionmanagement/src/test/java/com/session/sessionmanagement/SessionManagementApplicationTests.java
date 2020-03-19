package com.session.sessionmanagement;
  
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import com.session.config.KafkaConfiguration;

import org.junit.*;;
  
@SpringBootTest(classes=KafkaConfiguration.class)
class SessionManagementApplicationTests {
  
	private static final Logger logger = LoggerFactory.getLogger(SessionManagementApplicationTests.class);
	
	@Value(value = "${spring.kafka.bootstrap-servers}")
	private String kafka;
	
	@Value(value = "${spring.zookeeper.host}")
	private String zookeeper;
	 
	@Value(value = "${spring.datasource.url}")
	private String dburl;

	@Value(value = "${spring.datasource.username}")
	private String username;
	
	@Value(value = "${spring.datasource.password}")
	private String password;


@Test 
void contextLoads() {
	
   logger.info("Test case for session management service started .....");
   Assert.assertEquals(new String("kafka-service:9092"),kafka);
   Assert.assertEquals(new String("zookeeper:2181"),zookeeper);
   Assert.assertEquals(new String("jdbc:postgresql://smdb-service:5436/sessiondb"),dburl);
   Assert.assertEquals(new String("postgres"),username);
   Assert.assertEquals(new String("idontknow.3"),password);
   logger.info("Test case for session management service completed .....");

	
	
	
	
   }
  
  }
 