package com.mycompany.myapp.web;

import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.util.NoSuchElementException;
import java.util.Optional;

@ControllerAdvice
public class BaseController {

    @Autowired
    private UserRepository userRepository;

    @ModelAttribute(value = "currentUser")
    public User currentUser() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            Optional<User> user = userRepository.findOneByLogin(username);
            return user.get();
        } catch (NullPointerException e) {
        } catch (NoSuchElementException e) {
        }

        return null;
    }
}
