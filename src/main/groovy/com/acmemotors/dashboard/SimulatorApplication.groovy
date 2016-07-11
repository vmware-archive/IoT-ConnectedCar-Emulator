package com.acmemotors.dashboard

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class SimulatorApplication {

	static void main(String[] args) {
		SpringApplication.run SimulatorApplication, args
	}
}
