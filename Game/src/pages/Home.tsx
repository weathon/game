import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonImg, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { useEffect, useRef, useState } from 'react';


const Home: React.FC = () => {
  // const story = "This story involes a nice man is treating a lady very nicely and helped her a lot for academic work, but then got accused by the women that he harrased the women without any evidence. Then all his friends left him ... This whole thing is because she was jellus that boy 'took away' her ex-boyfriend: her ex boyfriend hang out with the main char all the time so that she felt being left alone. "
  // let thread = useRef()
  const story = `The Harsh Horizon

  Walter was an ambitious university student hailing from a poor and war-torn country. Despite the adversities that had defined his life, he was determined to break through the cycle of poverty and despair. He had always been the quiet, diligent type, but one day, as he walked through the bustling campus, he saw her.
  
  Her name was Esther, and she was the epitome of beauty and grace. With her radiant smile and her golden hair, she seemed to illuminate the darkest corners of his heart. Esther, a student from a different race, was the embodiment of everything Walter had ever dreamt of. He couldn't help but fall head over heels for her.
  
  Walter was well aware of the challenges that lay ahead. Their worlds were so different that it almost seemed impossible for them to connect. But he was determined. He'd do whatever it took to get her to notice him.
  
  He started by joining clubs she was part of, attending events she showed interest in, and even taking up a foreign language class to impress her. Walter's friends, who had always admired his resilience and humility, were beginning to worry. They saw him changing, giving up on the friendships that had been his backbone through thick and thin.
  
  As Walter tried harder and harder to impress Esther, he distanced himself from his friends. He was constantly texting her, leaving no room for any other social interactions. It was as if his world revolved around her, and his friends felt like mere spectators.
  
  Winchester, his closest and most loyal friend, couldn't bear to see Walter lose himself in this pursuit. He decided to confront Walter about his obsession.
  
  One evening, Winchester sat down with Walter in a quiet corner of their favorite café. He told Walter about his concerns and how much he missed their friendship. Walter, initially defensive, eventually realized Winchester was right. He had abandoned his friends in his pursuit of Esther, and he needed to find a balance.
  
  Walter promised to make amends, to rekindle the friendships he had so carelessly discarded, and to be there for his friends, just as they had always been there for him.
  
  
  Over the next few weeks, Walter made a conscious effort to reconnect with his friends. He realized that he had lost some of them, but Winchester stood by him, proving the depth of their friendship.
  
  Walter decided to give a thoughtful gift to Esther, a handcrafted necklace with a pendant in the shape of a heart. It was a symbol of his newfound balance, with his friends on one side and his feelings for her on the other.
  
  
  With the necklace in his hand, Walter approached Esther after a class. His heart raced as he handed her the gift, telling her it was a symbol of his admiration and respect for her. Esther, taken aback by his honesty, accepted the necklace with a polite smile.
  
  Walter's heart soared. It seemed like his efforts were finally paying off, and Esther was warming up to him.
  
  
  But his joy was short-lived. A few days later, Esther cornered Walter in the hallway, surrounded by their mutual friends. She was furious and disappointed, calling his gesture "inappropriate" and "intrusive." In front of everyone, she threw the necklace on the ground, shattering it into pieces.
  
  Esther didn't stop there. She blocked Walter on all social media platforms and began spreading rumors about his supposed harassment of her. His friends, who had only recently reunited with him, were confused and torn between the two sides.
  
  
  Walter was devastated. He couldn't believe how quickly his world had crumbled. He felt isolated and humiliated. He retreated into his shell, hardly attending classes and avoiding any contact with his classmates. He lost his appetite and sleep, sinking deeper into depression.
  
  But Winchester didn't give up on him. He stood by Walter's side, refusing to believe the rumors and continuing to support his friend through this tough time. Winchester was the rock Walter needed to hold onto in the midst of the storm.
  
  With Winchester's unwavering support, Walter began to heal. He understood that Esther was not the person he had thought she was, and he deserved better. Slowly but surely, he started to rebuild his life. He focused on his studies, rekindled old friendships, and began to rediscover himself.
  
  Winchester and Walter's bond grew stronger through this challenging period, and their friendship became even more profound. They learned to rely on each other, and Winchester was always there to lend an ear or offer a shoulder to lean on.
  
  As time passed, Walter began to look beyond the hurt and betrayal. He realized that Esther's rejection was not the end of the world. His dreams were still within reach, and he was not defined by his failed pursuit of a person who couldn't see his worth.
  
  Walter's journey through heartbreak and betrayal was a crucible, shaping him into a stronger, wiser person. He knew he could still achieve greatness, and with Winchester by his side, the future held the promise of brighter days.
  
  The story of Walter, Esther, and Winchester was a testament to the resilience of the human spirit, the importance of true friendship, and the power of self-discovery in the face of adversity.
  `

  const [thread, setThread] = useState<Array<any>>([])
  const [imgUri, setImgUri] = useState("");
  const [des, setDes] = useState("");
  const [opDes, setOpDes] = useState<string[]>([])
  const history = useRef([]);
  useEffect(() => {
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
        2. Confess His Feelings on a Hill Overlooking the Town
        Each screen should only be 50-100 words, story should not be smooth, should not always be happy or positive. Language do not be too formal. `
      }
    ])
  }, [])
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
        <IonContent>
          {
            thread.map((x, index) => (
              <IonCard>{(x.role != "system") && <p key={index}>{x.content}<br /></p>}</IonCard>
            ))
          }
          <IonButton onClick={() => { modal.current?.dismiss() }}>Close</IonButton>
          <a href={(() => {
            const file = new Blob([thread.map(x => x.content).join("\n\n")], { type: 'text/plain' })
            return URL.createObjectURL(file)
          })()} download="history.txt">Download History</a>
        </IonContent>
      </IonModal>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Game</IonTitle>
          <IonButtons slot="end">
            <IonButton id="report">
              History
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
              setDes("")
              setOpDes([])

              console.log(thread)
            }}>{x}</IonButton>
          ))}
        <IonButton onClick={() => {
          thread.push({ "role": "user", "content": "User said: " + prompt() })
          setThread([...thread])
          setDes("")
          setOpDes([])

          console.log(thread)
        }}>Other Options</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
