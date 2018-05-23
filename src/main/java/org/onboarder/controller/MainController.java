package org.onboarder.controller;

import com.google.gson.Gson;
import org.onboarder.model.Onboarding;
import org.onboarder.model.OnboardingSet;
import org.onboarder.repository.OnboardingRepository;
import org.onboarder.repository.OnboardingSetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/onboarder")
public class MainController {

    private static final Logger LOGGER = LoggerFactory.getLogger(MainController.class);

    @Autowired
    private OnboardingSetRepository onboardingSetRepository;

    @Autowired
    private OnboardingRepository onboardingRepository;


    @GetMapping("/OnboardingSet")
    @ResponseBody
    public String show(@RequestParam String url){
        OnboardingSet onboardingSet = onboardingSetRepository.findByUrl(url);
        Gson gson = new Gson();
        String onboardingset_json = gson.toJson(onboardingSet);
        return onboardingset_json;
    }

    @PostMapping("/OnboardingSet")
    @ResponseBody
    public String saveOnboardings(@RequestBody OnboardingSet onboardingSet){


        String onboardingSetUrl = onboardingSet.getUrl();

        OnboardingSet existingOnboardingSet  = onboardingSetRepository.findByUrl(onboardingSetUrl);

        if(existingOnboardingSet != null){
            onboardingSetRepository.delete(existingOnboardingSet);
        }

        List<Onboarding> Onboardings = onboardingSet.getOnboardings();

        for(Onboarding Ob : Onboardings){
            //LOGGER.debug("id" + Ob.getId());
            Ob.setId(onboardingRepository.save(Ob).getId());
        }

        onboardingSetRepository.save(onboardingSet);
        return "success";
    }
}
