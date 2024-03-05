package com.example.demo.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/* interface responsible for data access
ACCESS DATA LAYER

so the DATA ACCESS interface has to be used by the corresponding SERVICE
*/
@Repository
 interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByName(String mariam);

    @Query("SELECT s FROM Student s WHERE s.email = ?1") //Student here = Student class from Student.java file
    Optional<Student> findStudentByEmail(String email);//SELECT * FROM student WHERE email = ?
}
