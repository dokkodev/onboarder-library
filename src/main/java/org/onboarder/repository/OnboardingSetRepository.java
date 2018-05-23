package org.onboarder.repository;

import org.onboarder.model.OnboardingSet;
import org.springframework.data.repository.CrudRepository;

public interface OnboardingSetRepository extends CrudRepository<OnboardingSet, Integer> {
    OnboardingSet findById(int id);
    OnboardingSet findByUrl(String url);

}
