//package edu.kh.test.controller;
//
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.ModelAttribute;
//import org.springframework.web.bind.annotation.PostMapping;
//
//import edu.kh.test.dto.Student;
//
//public class StudentController {
//
//	@PostMapping("select")
//	public String selectStudent(Model model, @ModelAttribute Student student) {
//		model.addAttribute("stdName", student.getStdName());
//		model.addAttribute("stdAge", student.getStdAge());
//		model.addAttribute("stdAddress", student.getStdAddress());
//		return "student/select";
//	}
//	
//}







package edu.kh.test.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import edu.kh.test.dto.Student;

import org.springframework.ui.Model;

@Controller
public class StudentController {

    @PostMapping("/student/select")
    public String selectStudent(Model model, @ModelAttribute Student student) {
        model.addAttribute("name", student.getStdName());
        model.addAttribute("age", student.getStdAge());
        model.addAttribute("address", student.getStdAddress());
        return "student/select";
    }
}


