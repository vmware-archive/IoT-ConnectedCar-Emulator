package com.acmemotors.dashboard

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class EmulatorApplication {

	static void main(String[] args) {
		SpringApplication.run EmulatorApplication, args
	}
}
