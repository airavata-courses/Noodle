import React from "react";
import { Button } from "antd";

import data from "../../data.json"; 
const SettingsView = props => {
  const goBack = () => {
    props.history.goBack();
  };
  
 // const socialMediaList = data.SocialMedias;

return (
  <div>
      {
        data.Skills.map((skill) => {
          return (
            <div>
              <h4>{skill.Area}</h4>
              <ul>
                {
                  skill.SkillSet.map((skillDetail) => {
                    return (
                        <li>
                          {skillDetail.Name}
                        </li>
                    );
                  })
                }
              </ul>
            </div>
          );
        })
      } 
 
 <Button onClick={goBack}>Go back</Button>
  </div>
);
};

export default SettingsView;
