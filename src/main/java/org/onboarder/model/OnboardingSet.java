package org.onboarder.model;
import lombok.Data;
import org.onboarder.model.Onboarding;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class OnboardingSet {

    @Id
    @GeneratedValue
    private int id;

    @Column(name= "url")
    private String url;

    @OneToMany(fetch=FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name="onboardingset_id")
    private List<Onboarding> onboardings;
}


