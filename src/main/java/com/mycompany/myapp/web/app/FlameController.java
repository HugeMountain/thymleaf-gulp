package com.mycompany.myapp.web.app;

import com.mycompany.myapp.domain.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FlameController {
    @RequestMapping("/flame")
    public String flame(@ModelAttribute("currentUser") User user, Model model) {
        return "animate/flame";
    }
}
