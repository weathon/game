import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonFooter,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('option1');

  const handleButtonClick = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="centered-title">The Tragic Turbulent Twists</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonCard>
      <img alt="Picture of the story" src="" />
      <IonCardHeader>
        
        
      </IonCardHeader>

      <IonCardContent>The stroy description</IonCardContent>
    </IonCard>
       
      </IonContent>
      <IonFooter>
        <IonButton
          expand="full"
          color={selectedOption === 'option1' ? 'primary' : 'medium'}
          onClick={() => handleButtonClick('option1')}
        >
          Option 1
        </IonButton>
        <IonButton
          expand="full"
          color={selectedOption === 'option2' ? 'primary' : 'medium'}
          onClick={() => handleButtonClick('option2')}
        >
          Option 2
        </IonButton>
        <IonButton
          expand="full"
          color={selectedOption === 'option3' ? 'primary' : 'medium'}
          onClick={() => handleButtonClick('option3')}
        >
          Option 3
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
