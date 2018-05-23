package org.onboarder.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
@RequestMapping("/onboarder")
public class OnboarderController {

    @GetMapping
    public String admin(HttpServletRequest request, Map<String, Object> model) {
        return "onboarder";
    }

}
