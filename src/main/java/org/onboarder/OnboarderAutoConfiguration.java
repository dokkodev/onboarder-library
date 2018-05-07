package org.onboarder;


import org.springframework.context.annotation.*;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class OnboarderAutoConfiguration extends WebMvcConfigurerAdapter {

	@Bean
	public OnboarderController onboarderController() {
		return new OnboarderController();
	}

}
