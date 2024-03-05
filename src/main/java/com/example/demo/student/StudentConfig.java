package com.example.demo.student;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

import static java.time.Month.*;
// config public reszta nie
@Configuration
public class StudentConfig {
    @Bean
    CommandLineRunner commandLineRunner(StudentRepository repository){
        return args -> {
            if (repository.existsByName("Mariam") || repository.existsByName("Alex")) {
                System.out.println("Students 'Alex' or 'Miriam' already exist in the database. Skipping creation.");
            }else {
            Student mariam = new Student(
                    "Mariam",
                    "mariam@jd.op",
                    LocalDate.of(2000, APRIL, 5)

            );
            Student alex = new Student(
                    "Alex",
                    "alex@jd.op",
                    LocalDate.of(1989, JANUARY, 5)

            );
            /*
            we want to save the above hardcoded data to db,
            so we need to invoke the repository (StudentRepository repository)
            */
            repository.saveAll(
                    List.of(mariam, alex)
            );
                System.out.println("Students 'Alex' and 'Miriam' created successfully.");

            };};
    }
}
