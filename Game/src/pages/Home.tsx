import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonImg, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { useEffect, useRef, useState } from 'react';


const Home: React.FC = () => {
  const story = "This story involes a nice man is treating a lady very nicely and helped her a lot for academic work, but then got accused by the women that he harrased the women without any evidence. Then all his friends left him ... This whole thing is because she was jellus that boy 'took away' her ex-boyfriend: her ex boyfriend hang out with the main char all the time so that she felt being left alone. "
  // let thread = useRef()
  const [thread, setThread] = useState<Array<any>>([])
  const [imgUri, setImgUri] = useState("");
  const [des, setDes] = useState("");
  const [opDes, setOpDes] = useState<string[]>([])
  const history = useRef([]);
  useEffect(()=>{
    setThread([
      {
        "role": "system",
        "content": `Create a decision-making game where you provide a linear narrative. The game should progress \
        scene by scene and include a narrative and a list of choices. Do that one scene at a time, and generate new scene based on user respomse. \
        Present the game description using following  format. Each time the text should be relatively short. 
        AND ONLY OUTPUT ONE SENSE, THEN WAIT FOR USER's INPUT. DO NOT assume user make a choice!
        **User can only make decision for one charatar**
        You do not have to follow the choices and story line in the provided story! And give choices more than just what is provided. You must provide that magic phase "OPTIONS" before choice so the front end can split it correctly
        Do not be too wordy, keep it around 100-200 words. But make sure each step will move the story forward a little
        STORY: \n${story}
        User want to read the story and choices Language: `+ prompt("Enter language you want to use:") + `
        EXAMPLE: 
        describe the scene here
        
        OPTIONS
        1. Confess His Feelings in the Park 
        2. Confess His Feelings on a Hill Overlooking the Town`
      }
    ])
  },[])
  useEffect(() => {
    history.current = []
    if (!localStorage.getItem("token"))
      localStorage.setItem("token", prompt("Token") as string)
    //gpt wrote the fetch
    // @ts-ignore
;
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "post",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("token") },//forgot json 
      body: JSON.stringify({
        model: "gpt-4-1106-preview",
        messages: thread,
        "stream": true
      })
    }).then(response => {
      const stream = response.body;
      // @ts-ignore
      const reader = stream.getReader();
      let tmp = "";
      let image_generated = false;
      const readChunk = () => {
        // Read a chunk from the reader
        reader.read()
          .then(({
            value,
            done
          }) => {
            if (done) {

              //@ts-ignore
              // setOptions([...Array((opDes.length)).keys()].map(x=>"Option "+ (x+1)))
              return
            }
            const chunkString = new TextDecoder().decode(value) as string;
            chunkString.split("\n\n").map(x => x.slice(6, x.length + 1)).map(x => {
              console.log(x)
              if (x == "[DONE]") {
                thread.push({ "role": "assistant", "content": tmp })
                console.log(tmp)
                //@ts-ignore
                setOpDes(tmp.split("OPTIONS\n")[1].split("\n"))
              }
              if (x && x != "[DONE]" && JSON.parse(x).choices[0].delta.content) {
                tmp = tmp + JSON.parse(x).choices[0].delta.content //cannot change on des because that is not changed in this function
                setDes(tmp)

              }
              else
                readChunk();

            });
          })
      };
      readChunk();
    })

  }, [thread])
  const modal = useRef<HTMLIonModalElement>(null);
  return (
    <IonPage>
      <IonModal ref={modal} trigger='report'>
        <IonButton onClick={() => { modal.current?.dismiss() }}>Close</IonButton>
      </IonModal>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Game</IonTitle>
          <IonButtons slot="end">
            <IonButton id="report">
              Report
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <IonCard>
          {/* {imgUri != "" && <IonImg src={imgUri}></IonImg>} */}

          <IonCardContent>
            <b>{des}</b>
          </IonCardContent>
        </IonCard>
        {
          // @ts-ignore
          opDes.map((x, index) => (
            // @ts-ignore
            <IonButton onClick={() => {
              thread.push({ "role": "user", "content": "User said: " + x })
              setThread([...thread])
              setOpDes([])

              console.log(thread)
            }}>{x}</IonButton>
          ))}
      </IonContent>
    </IonPage>
  );
};

export default Home;
