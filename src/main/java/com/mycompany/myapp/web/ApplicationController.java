package com.mycompany.myapp.web;

import com.mycompany.myapp.domain.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ApplicationController {

    @RequestMapping("/")
    public String index(@ModelAttribute("currentUser") User user, Model model) {
        return "home";
    }

}
