import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonImg, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { useEffect, useState } from 'react';

const Home: React.FC = () => {

  const [imgUri, setImgUri] = useState("");
  const [options, setOptions] = useState([]);
  const [des, setDes] = useState("Loading...... Based on trafic it might take about 10 seconds.");
  useEffect(() => {
    //gpt wrote the fetch
    fetch("https://5000-weathon-game-44auy47bk06.ws-us105.gitpod.io/start")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Log the response data to the console
        setImgUri(data.image_url)
        setDes(data.text)
        setOptions(data.choices)
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, [])
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Game</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <IonCard>
          {imgUri!="" && <IonImg src={imgUri}></IonImg>}

          <IonCardContent>
            <b>{des}</b>
          </IonCardContent>
        </IonCard>
        {options.map((x, index)=>(
          // @ts-ignore
            <IonButton expand="block" id={index+1} onClick={(e)=>{
              // @ts-ignore
              console.log(e.target.id)
              setImgUri("");
              setOptions([]);
              setDes("Loading...... Based on trafic it might take about 10 seconds.");
              // @ts-ignore

              fetch("https://5000-weathon-game-44auy47bk06.ws-us105.gitpod.io/choice?choice="+e.target.id)
              // fetch("https://5000-weathon-game-44auy47bk06.ws-us105.gitpod.io/choice?choice"+e.target.id)
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then((data) => {
                console.log(data); // Log the response data to the console
                setImgUri(data.image_url)
                setDes(data.text)
                setOptions(data.choices)
              })
              .catch((error) => {
                console.error("There was a problem with the fetch operation:", error);
              });

            }}>{x}</IonButton>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Home;
