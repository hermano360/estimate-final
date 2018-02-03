 #!/usr/bin/env bash

npm run build && git add . && git commit -m "forgot to run webpack" && git push heroku master
