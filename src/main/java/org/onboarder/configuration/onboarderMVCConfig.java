package org.onboarder.configuration;

import org.onboarder.transformer.pageTransFormer;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class onboarderMVCConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/*.html")
                .addResourceLocations("classpath:/static/")
                .resourceChain(false)
                .addTransformer(new pageTransFormer());
    }
}
