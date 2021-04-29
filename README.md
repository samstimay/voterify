# voterify
  
This is the public repo of the live site hosted here: http://votery.org  
The goal is to make an easy way for people to vote using cell phones and SMS.
  
Colaboration is welcome.  

In order for this project to run locally, you'll need to contact me  for the API secrets folder in `/functions/`  
voterify at ![g mail](https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_dark_1x.png)

## Project setup
This project is based on Google Firebase, Vue JS and Bulma.   
Run Prettier extensions on save.

### SSH
Create an SSH key where you plan to work  
* `ssh-keygen` - create the key, usually in .ssh/id_rsa  
* Add the key to GitHub  
* Start ssh agent `eval "$(ssh-agent -s)"`
* Add your ssh to shh agent `ssh-add` 
* Check if your ssh is already added `ssh-add -l`

### Firebase
Install firebase tools globally
* `npm install -g firebase-tools`
* `firebase login` - login to firebase
* if running firebase inside a container run `firebase login --no-localhost` instead
* install functions/secrets/firebase-secrets.json
   * goto https://console.firebase.google.com
   * select Votery project and click Project Settings gear
   * click service accounts
   * click `Generate new private key`
   * download the json and rename it to `firebase-secrets.json`
   * copy firebase-secrets.json to `@/functions/secrets`

### Installation
```
yarn
cd functions
yarn
```


### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Deployment
```
firebase deploy
```
