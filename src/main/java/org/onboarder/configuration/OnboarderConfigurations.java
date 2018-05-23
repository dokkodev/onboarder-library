package org.onboarder.configuration;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@ComponentScan({"org.onboarder.configuration", "org.onboarder.controller"})
@EnableJpaRepositories("org.onboarder.repository")
@EntityScan("org.onboarder.model")
public class OnboarderConfigurations {
}
