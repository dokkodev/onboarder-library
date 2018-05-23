package org.onboarder.repository;

import org.onboarder.model.Onboarding;
import org.springframework.data.repository.CrudRepository;

public interface OnboardingRepository extends CrudRepository<Onboarding, Integer> {
    Onboarding findById(int id);
}
