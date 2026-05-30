package br.com.inovatech;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class InovatechApplication {
    public static void main(String[] args) {
        SpringApplication.run(InovatechApplication.class, args);
    }
}
