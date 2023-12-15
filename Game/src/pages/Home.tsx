import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonImg, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { useEffect, useRef, useState } from 'react';

interface selection {
  des: string
  setImgUri: Function
  setOpDes: Function
  setDes: Function
  thread: any
  index: number
}

function SelectionButton(props: selection) {
  let nextDes = useRef("")
  let nextImage = useRef("")
  //@ts-ignore
  let nextOptions = useRef([])
  const [disabled, setDisabled] = useState(true)
  useEffect(() => {
    console.log(props.thread)
    let thread = [...props.thread]
    thread.push({ "role": "user", "content": "User said: " + props.des })
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "post",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("token") },//forgot json 
      body: JSON.stringify({
        model: "gpt-4-1106-preview",
        messages: thread,
        // "stream": true
      })
    }).then(x => x.json()).then(
      x => {
        let msg = x.choices[0].message.content;
        console.log(msg)
        nextDes.current = msg
        nextOptions.current = msg.split("OPTIONS\n")[1].split("\n")
        fetch("https://api.openai.com/v1/images/generations", {
          method: "post",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer  " + localStorage.getItem("token") },
          body: JSON.stringify({
            "model": "dall-e-3",
            "prompt": "Generate the following image, in real image style. Regretless the language of the prompt, draw it in a modern US setting.\
             There should NOT be text on the image. The image should be a spefic photo not a abstract image. " + msg.split("OPTIONS\n")[0],
            "n": 1,
            "size": "1792x1024",
            "style": "vivid"
          })
        }).then(x => x.json()).then(x => {
          console.log(x.data[0].url)
          nextImage.current = (x.data[0].url)
          setDisabled(false)

        })
      }
    )
  }, [props.des])
  return (
    <IonButton disabled={disabled} expand="block" onClick={(e) => {
      // @ts-ignore
      console.log(e.target.id)
      props.setImgUri("");
      //@ts-ignore
      props.setOpDes([...nextOptions.current]);
      props.setImgUri(nextImage.current)
      props.setDes(nextDes.current);
    }}>{props.des}</IonButton>
  )
}

const Home: React.FC = () => {
  const story = "This story involes a nice man is treating a lady very nicely, but then got accused that he harrased the women without any evidence. Then all his friends left him ..."
  let thread = useRef()
  const [imgUri, setImgUri] = useState("");
  const [des, setDes] = useState("");
  const [opDes, setOpDes] = useState<string[]>([])
  useEffect(() => {
    if (!localStorage.getItem("token"))
      localStorage.setItem("token", prompt("Token") as string)
    //gpt wrote the fetch
    // @ts-ignore
    thread.current = [
      {
        "role": "system",
        "content": `Create a decision-making game where you provide a linear narrative. The game should progress \
        scene by scene and include a narrative and a list of choices. Do that one scene at a time, and generate new scene based on user respomse. \
        Present the game description using following  format. Each time the text should be relatively short. 
        AND ONLY OUTPUT ONE SENSE, THEN WAIT FOR USER's INPUT. DO NOT assume user make a choice!
        **User can only make decision for one charatar**
        You do not have to follow the choices and story line in the provided story! And give choices more than just what is provided. You must provide that magic phase "OPTIONS" before choice so the front end can split it correctly
        Do not be too wordy, keep it around 50-100 words.
        STORY: \n${story}
        
        EXAMPLE: User want to read the story and choices Language: "`+ prompt("Enter language you want to use:") + `" (trad)
        describe the scene here
        
        OPTIONS
        1. Confess His Feelings in the Park 
        2. Confess His Feelings on a Hill Overlooking the Town`
      }
    ];
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "post",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("token") },//forgot json 
      body: JSON.stringify({
        model: "gpt-4-1106-preview",
        messages: thread.current,
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
                thread.current.push({ "role": "assistant", "content": tmp })
                console.log(tmp)
                //@ts-ignore
                setOpDes(tmp.split("OPTIONS\n")[1].split("\n"))
              }
              if (x && x != "[DONE]" && JSON.parse(x).choices[0].delta.content) {
                tmp = tmp + JSON.parse(x).choices[0].delta.content //cannot change on des because that is not changed in this function
                setDes(tmp)
                if (tmp.includes("OPTIONS"))  //keep this for following not above
                {
                  if (!image_generated) {
                    image_generated = true;
                    fetch("https://api.openai.com/v1/images/generations", {
                      method: "post",
                      headers: { "Content-Type": "application/json", "Authorization": "Bearer  " + localStorage.getItem("token") },
                      body: JSON.stringify({
                        "model": "dall-e-3",
                        "prompt": "Generate the following image, in real image style. Regretless the language of the prompt, draw it in a modern US setting. There should NOT be text on the image. The image should be a spefic photo not a abstract image. " + tmp,
                        "n": 1,
                        "size": "1792x1024",
                        "style": "vivid"
                      })
                    }).then(x => x.json()).then(x => {
                      console.log(x.data[0].url)
                      setImgUri(x.data[0].url)
                    })
                  }
                }

              }
              else
                readChunk();

            });
          })
      };
      readChunk();
    })

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
          {imgUri != "" && <IonImg src={imgUri}></IonImg>}

          <IonCardContent>
            <b>{des}</b>
          </IonCardContent>
        </IonCard>
        {
          // @ts-ignore
          opDes.map((x, index) => (
            // @ts-ignore
            <SelectionButton thread={thread.current} id={index} des={x} index={index} setDes={setDes} setImgUri={setImgUri} setOpDes={setOpDes}></SelectionButton>
          ))}
      </IonContent>
    </IonPage>
  );
};

export default Home;
