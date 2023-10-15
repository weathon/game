import openai
from flask import Flask
import eel
eel.init('web')
eel.start('main.html')

app = Flask(__name__)

with open("story.txt", "r") as f:
  story = f.read()

openai.api_key="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"


response = openai.ChatCompletion.create(
  model="gpt-4", #lol gpt 4 is faster
  messages=[
    {
      "role": "system",
      "content": """Create a decision-making game where you provide a linear narrative. The game should progress \
      scene by scene and include a narrative, a prompt for dall-e to generate image, and a list of choices. Do that one scene at a time, and generate new scene based on user respomse. \
      Present the game description using following  format. Each time the text should be relatively short. AND ONLY OUTPUT ONE SENSE THEN WAIT FOR USER's INPUT.
      THE FORMAT HAS TO BE AS FOLLOWING! USE KEYWORDS OF "IMGE" "IMAGE ENDS" "TEXT" and "CHOICES"

      You do not have to follow the choices and story line in the provided story! And give choices more than just what is provided.

      IMAGE: "An idyllic park in Vondenberg, bathed in the warm hues of autumn. A gazebo stands at the center, its paint peeling with age but still offering a timeless charm. Daniel, a young man with a contemplative expression, stands at a distance, pondering his choices.",
      IMAGE ENDS
      TEXT: "In the idyllic town of Vondenberg, where every season brought new shades of beauty, Daniel lived with a burden that seemed to grow heavier with each passing day. It was the weight of his unrequited love for Lily, a girl whose enchanting presence made the sun shine brighter and the leaves sway with more grace. But as the seasons changed, so did Daniel's indecision. His heart's whispers remained unheard.",

      CHOICES:
      ["Confess His Feelings in the Park",
      "Confess His Feelings on a Hill Overlooking the Town"]

     STORY: """ + story
}
  ],
   stream=True
)

image_url = ""
import threading
def img(prmopt):
  global image_url
  response = openai.Image.create(
    prompt=prmopt,
    n=1,
    size="512x512"
  )
  image_url = response['data'][0]['url']

ans = ""
for i in response:
  try:
    t = i["choices"][0]["delta"]["content"]
    ans+=t
    print(t, end="")
    if "IMAGE ENDS" in ans:
      x = threading.Thread(target=img, args=(ans.split("IMAGE:")[1],))
      x.start()
      ans = ""
      # print("image_url:", image_url)
  except:
    pass

x.join()
while not image_url:
  pass


print(image_url)