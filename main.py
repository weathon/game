
import openai
from flask import Flask
from flask import request
import json
import time


def writelog(log):
  with open("log.csv", "a") as f:
    f.write(log+"\n")


app = Flask(__name__)
from flask_cors import CORS
CORS(app)

with open("story.txt", "r") as f:
  story = f.read()

openai.api_key="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"


messages_list = []
image_url = ""
ans = ""

def img(prmopt):
  response = openai.Image.create(
    prompt=prmopt,
    n=1,
    size="256x256"
  )
  return response['data'][0]['url']
  
step = 0
@app.route("/start")
def start():
  global messages_list, ans, step
  step = 0
  messages_list = [
      {
        "role": "system",
        "content": """Create a decision-making game where you provide a linear narrative. The game should progress \
        scene by scene and include a narrative and a list of choices. Do that one scene at a time, and generate new scene based on user respomse. \
        Present the game description using following  format. Each time the text should be relatively short. 
        AND ONLY OUTPUT ONE SENSE, THEN WAIT FOR USER's INPUT. DO NOT assume user make a choice!
        **User can only make decision for one charatar**
        You do not have to follow the choices and story line in the provided story! And give choices more than just what is provided.
        STORY: \n"""+story+"""
        EXAMPLE, THE FORMAT HAS TO BE AS FOLLOWING!
        {"text": "In the idyllic town of Vondenberg, where every season brought new shades of beauty, Daniel lived with a burden that seemed to grow heavier with each passing day. It was the weight of his unrequited love for Lily, a girl whose enchanting presence made the sun shine brighter and the leaves sway with more grace. But as the seasons changed, so did Daniel's indecision. His heart's whispers remained unheard.",
        "choices":
        ["1. Confess His Feelings in the Park",
        "2. Confess His Feelings on a Hill Overlooking the Town"]}

      """
  }
    ]


  image_url = ""
  ans = ""
  response = openai.ChatCompletion.create(
    model="gpt-4-preview-1106", #lol gpt 4 is faster
    messages=messages_list,
    stream=True
  )


  for i in response:
    try:
      t = i["choices"][0]["delta"]["content"]
      ans+=t
      print(t, end="")
      if "IMAGE ENDS" in ans and not image_url:
        # ans="" #forget this potherwie will keep runing 
        image_url = img(ans.split("IMAGE:")[1]) #this dose not nee d to be async the chat is async
        print("image_url:", image_url)
    except:
      pass

  
  messages_list.append({
      "role": "assistant",
      "content": ans
      })
  text = ans.split("TEXT: ")[1]
  text, choices = text.split("CHOICES:")
  writelog("Game started,"+str(time.time()))
  return {"text": text, "choices":json.loads(choices), "image_url":image_url}

@app.route("/choice")
def choice():
  global messages_list, step
  writelog(f"Step {step} decision made,"+str(time.time()))

  step+=1

  print(request.args.get('choice'))
  messages_list.append({
      "role": "user",
      "content": "User has choice option " + request.args.get('choice')
      })
  response = openai.ChatCompletion.create(
      model="gpt-4-preview-1106", #lol gpt 4 is faster
      messages=messages_list,
      stream=True
    )

  ans = ""
  image_url=None
  for i in response:
    try:
      t = i["choices"][0]["delta"]["content"]
      ans+=t
      print(t, end="")
      if "IMAGE ENDS" in ans and not image_url:
        # ans="" #forget this potherwie will keep runing 
        image_url = img(ans.split("IMAGE:")[1]) #this dose not nee d to be async the chat is async
        # print("image_url:", image_url)
    except:
      pass

  messages_list.append({
      "role": "assistant",
      "content": ans
      })
  print(ans)
  text = ans.split("TEXT: ")[1]
  text, choices = text.split("CHOICES:")
  # writelog(f"Step {step} generated,"+str(time.time()))

  return {"length":len(messages_list),"text": text, "choices":json.loads(choices), "image_url":image_url}
    

@app.route("/summary")
def summary():

  with open("log.csv", "r") as f:
    data = f.read().split("\n")

  sum = 0
  count = 0.0000001
  for i in range(1, len(data)):
    sum+=float(data[i].split(",")[1])-float(data[i-1].split(",")[1])
    count+=1
  
  return "Your Average Decision time is "+str(sum/count)+"seconds"