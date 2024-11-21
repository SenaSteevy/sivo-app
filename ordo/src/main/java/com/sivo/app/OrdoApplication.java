package com.sivo.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients("com.sivo.proxy")
@ComponentScan({"com.sivo.controller", "com.sivo.service"})
@EntityScan({"com.sivo.domain","com.sivo.resource"})
@EnableJpaRepositories("com.sivo.repository")
public class OrdoApplication {

	public static void main(String[] args) {
		SpringApplication.run(OrdoApplication.class, args);
	}



}
