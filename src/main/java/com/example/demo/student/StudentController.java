package com.example.demo.student;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
resources for the api
API LAYER = talks to SERVICE LAYER (business logic) to access the data

CORS
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController // like @Service  in StudentService - tell SB what the @Component does exactly
@RequestMapping(path = "api/v1/student") //url change
public class StudentController {
    private final StudentService studentService; //connects to business logic in StudentService

    @Autowired //tell SB to make a new instance of class StudentService(it has to be a bean
    public StudentController(StudentService studentService) { /* CONSTRUCTOR: pass studentService inside the controller*/
        this.studentService = studentService; //dependency injection
    }

    @GetMapping
    public List<Student> getStudents() {
        return studentService.getStudents();
    }

    //POST to add new student
    @PostMapping
    public void registerNewStudent(@RequestBody Student student){ //we want to map Student provided by user by mapping request body into Student
        studentService.addNewStudent(student);
    }
    //DELETE  to delete student
    @DeleteMapping(path = "{studentId}")
    public void deleteStudent(@PathVariable("studentId")Long studentId){
        studentService.deleteStudent(studentId);
    }
    //PUT to edit student
    @PutMapping("{studentId}")
    public void updateStudent(
            @PathVariable("studentId")Long studentId,
            @RequestParam(required = false)String name, //request param = what will we change
            @RequestParam(required = false)String email
    ){
        studentService.updateStudent(studentId, name, email);
    }
}
