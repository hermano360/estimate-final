 #!/usr/bin/env bash

npm run build && git add . && git commit -m "deploy to heroku" && git push heroku master
